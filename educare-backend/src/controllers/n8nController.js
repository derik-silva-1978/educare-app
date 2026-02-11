const { User, Profile, Child, Subscription, SubscriptionPlan, BiometricsLog, SleepLog, Appointment, VaccineHistory, ContentItem } = require('../models');
const nlpParserService = require('../services/nlpParserService');
const { Op } = require('sequelize');
const { findUserByPhone, extractPhoneVariants } = require('../utils/phoneUtils');

const findUserByPhoneRobust = async (phone) => {
  const variants = extractPhoneVariants(phone);
  if (variants.length === 0) return null;
  
  const { sequelize } = require('../config/database');
  const placeholders = variants.map((_, i) => `$${i + 1}`).join(', ');
  
  try {
    const [rows] = await sequelize.query(
      `SELECT u.id, u.name, u.email, u.role, u.status 
       FROM users u 
       WHERE u.phone IN (${placeholders})
       LIMIT 1`,
      { bind: variants }
    );
    if (rows.length > 0) return rows[0];
  } catch (e1) {
    console.log('[n8n] users.phone query failed, trying profiles.phone:', e1.message);
  }

  try {
    const [rows] = await sequelize.query(
      `SELECT u.id, u.name, u.email, u.role, u.status 
       FROM profiles p 
       JOIN users u ON u.id = p.user_id 
       WHERE p.phone IN (${placeholders})
       LIMIT 1`,
      { bind: variants }
    );
    if (rows.length > 0) return rows[0];
  } catch (e2) {
    console.log('[n8n] profiles.phone query failed, trying email:', e2.message);
  }

  try {
    const [rows] = await sequelize.query(
      `SELECT u.id, u.name, u.email, u.role, u.status 
       FROM users u 
       WHERE u.email LIKE $1
       LIMIT 1`,
      { bind: [`%${variants[0].slice(-8)}%`] }
    );
    if (rows.length > 0) return rows[0];
  } catch (e3) {
    console.error('[n8n] All user lookup methods failed:', e3.message);
  }

  return null;
};

const SBP_VACCINE_CALENDAR = [
  { vaccine: 'BCG', weeks: 0, dose: 1 },
  { vaccine: 'Hepatite B', weeks: 0, dose: 1 },
  { vaccine: 'Pentavalente (DTP+Hib+HB)', weeks: 8, dose: 1 },
  { vaccine: 'VIP (Polio inativada)', weeks: 8, dose: 1 },
  { vaccine: 'Pneumocócica 10V', weeks: 8, dose: 1 },
  { vaccine: 'Rotavírus', weeks: 8, dose: 1 },
  { vaccine: 'Meningocócica C', weeks: 12, dose: 1 },
  { vaccine: 'Pentavalente (DTP+Hib+HB)', weeks: 16, dose: 2 },
  { vaccine: 'VIP (Polio inativada)', weeks: 16, dose: 2 },
  { vaccine: 'Pneumocócica 10V', weeks: 16, dose: 2 },
  { vaccine: 'Rotavírus', weeks: 16, dose: 2 },
  { vaccine: 'Meningocócica C', weeks: 20, dose: 2 },
  { vaccine: 'Pentavalente (DTP+Hib+HB)', weeks: 24, dose: 3 },
  { vaccine: 'VIP (Polio inativada)', weeks: 24, dose: 3 },
  { vaccine: 'Febre Amarela', weeks: 36, dose: 1 },
  { vaccine: 'Tríplice Viral (SCR)', weeks: 52, dose: 1 },
  { vaccine: 'Pneumocócica 10V', weeks: 52, dose: 'reforço' },
  { vaccine: 'Meningocócica C', weeks: 52, dose: 'reforço' },
  { vaccine: 'DTP', weeks: 60, dose: 'reforço 1' },
  { vaccine: 'VOP (Polio oral)', weeks: 60, dose: 'reforço 1' },
  { vaccine: 'Hepatite A', weeks: 60, dose: 1 },
  { vaccine: 'Tetra Viral (SCRV)', weeks: 60, dose: 1 },
  { vaccine: 'DTP', weeks: 208, dose: 'reforço 2' },
  { vaccine: 'VOP (Polio oral)', weeks: 208, dose: 'reforço 2' }
];

const n8nController = {
  async checkUser(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({
          exists: false,
          error: 'Parâmetro phone é obrigatório'
        });
      }

      const user = await findUserByPhoneRobust(phone);

      if (!user) {
        return res.json({
          exists: false,
          subscription_status: null,
          child: null
        });
      }

      let subscriptionStatus = 'inactive';
      let planName = null;
      try {
        const { sequelize } = require('../config/database');
        const [subs] = await sequelize.query(
          `SELECT s.status, sp.name as plan_name 
           FROM subscriptions s 
           LEFT JOIN subscription_plans sp ON sp.id = s.plan_id 
           WHERE s.user_id = $1 AND s.status IN ('active', 'trial', 'pending')
           ORDER BY s.created_at DESC LIMIT 1`,
          { bind: [user.id] }
        );
        if (subs.length > 0) {
          const statusMap = { 'active': 'active', 'trial': 'trialing', 'pending': 'pending', 'canceled': 'canceled', 'expired': 'past_due' };
          subscriptionStatus = statusMap[subs[0].status] || subs[0].status;
          planName = subs[0].plan_name;
        }
      } catch (subErr) {
        console.error('[n8n] Erro ao buscar subscription:', subErr.message);
      }

      let child = null;
      try {
        const { sequelize } = require('../config/database');
        const [children] = await sequelize.query(
          `SELECT c.id, c.first_name, c.last_name, c.birth_date 
           FROM profiles p 
           JOIN children c ON c.profile_id = p.id 
           WHERE p.user_id = $1 AND c.is_active = true
           ORDER BY c.created_at DESC LIMIT 1`,
          { bind: [user.id] }
        );
        if (children.length > 0) {
          child = {
            id: children[0].id,
            name: `${children[0].first_name} ${children[0].last_name || ''}`.trim(),
            dob: children[0].birth_date
          };
        }
      } catch (profileErr) {
        console.error('[n8n] Erro ao buscar child:', profileErr.message);
      }

      const response = {
        exists: true,
        user_id: user.id,
        user_name: user.name,
        subscription_status: subscriptionStatus,
        plan_name: planName,
        child
      };

      if (subscriptionStatus === 'past_due' || subscriptionStatus === 'canceled') {
        response.stripe_checkout_url = `${process.env.VITE_API_URL || ''}/subscription/reactivate`;
      }

      return res.json(response);
    } catch (error) {
      console.error('[n8n] Erro em checkUser:', error);
      return res.status(500).json({
        exists: false,
        error: 'Erro interno ao verificar usuário',
        debug_message: error.message,
        debug_type: error.name
      });
    }
  },

  async recognizeWhatsAppUser(req, res) {
    try {
      const { phone, phone_number, sender_name } = req.body;
      const phoneNumber = phone || phone_number;

      if (!phoneNumber) {
        return res.status(400).json({
          recognized: false,
          error: 'Parâmetro phone é obrigatório'
        });
      }

      const cleanPhone = phoneNumber.replace(/\D/g, '');
      console.log(`[n8n] Reconhecimento WhatsApp - Buscando usuário: ${cleanPhone}`);

      const user = await findUserByPhoneRobust(phoneNumber);

      if (!user) {
        console.log(`[n8n] Usuário não encontrado para ${cleanPhone}`);
        return res.json({
          recognized: false,
          message: 'Usuário não cadastrado no Educare+',
          sender_name: sender_name || null,
          register_url: `${process.env.APP_URL || 'https://educareapp.com.br'}/register?phone=${cleanPhone}`
        });
      }

      const { sequelize } = require('../config/database');

      let subscriptionActive = false;
      let subStatus = 'inactive';
      let subPlanName = null;
      try {
        const [subs] = await sequelize.query(
          `SELECT s.status, sp.name as plan_name 
           FROM subscriptions s 
           LEFT JOIN subscription_plans sp ON sp.id = s.plan_id 
           WHERE s.user_id = $1 AND s.status IN ('active', 'trial', 'pending')
           ORDER BY s.created_at DESC LIMIT 1`,
          { bind: [user.id] }
        );
        if (subs.length > 0) {
          subStatus = subs[0].status;
          subPlanName = subs[0].plan_name;
          subscriptionActive = ['active', 'trial'].includes(subStatus);
        }
      } catch (subErr) {
        console.error('[n8n] Erro ao buscar subscription em recognize:', subErr.message);
      }

      let childrenList = [];
      try {
        const [rows] = await sequelize.query(
          `SELECT c.id, c.first_name, c.last_name, c.birth_date, c.gender
           FROM profiles p 
           JOIN children c ON c.profile_id = p.id 
           WHERE p.user_id = $1 AND c.is_active = true
           ORDER BY c.created_at DESC`,
          { bind: [user.id] }
        );
        childrenList = rows;
      } catch (childErr) {
        console.error('[n8n] Erro ao buscar children em recognize:', childErr.message);
      }

      const primaryChild = childrenList[0] || null;
      let basicContext = null;
      if (primaryChild) {
        const birthDate = new Date(primaryChild.birth_date);
        const ageMonths = Math.floor((Date.now() - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
        basicContext = {
          name: primaryChild.first_name,
          age_months: ageMonths,
          gender: primaryChild.gender
        };
      }

      const response = {
        recognized: true,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        },
        subscription: {
          active: subscriptionActive,
          status: subStatus,
          plan_name: subPlanName
        },
        children: childrenList.map(c => ({
          id: c.id,
          name: c.first_name,
          is_primary: c.id === primaryChild?.id
        })),
        primary_child: primaryChild ? {
          id: primaryChild.id,
          name: primaryChild.first_name,
          age_months: basicContext?.age_months,
          gender: primaryChild.gender
        } : null,
        basic_context: basicContext,
        greeting: primaryChild 
          ? `Olá ${user.name.split(' ')[0]}! Estou aqui para ajudar com o desenvolvimento de ${primaryChild.first_name}.`
          : `Olá ${user.name.split(' ')[0]}! Como posso ajudar você hoje?`
      };

      console.log(`[n8n] Usuário reconhecido: ${user.name} (${user.id}), ${childrenList.length} criança(s)`);
      return res.json(response);
    } catch (error) {
      console.error('[n8n] Erro em recognizeWhatsAppUser:', error);
      return res.status(500).json({
        recognized: false,
        error: 'Erro interno ao reconhecer usuário'
      });
    }
  },

  async updateBiometrics(req, res) {
    try {
      const { child_id, raw_text } = req.body;

      if (!child_id || !raw_text) {
        return res.status(400).json({
          response_text: 'Dados incompletos. Informe child_id e raw_text.',
          media_type: 'text',
          media_url: null
        });
      }

      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(child_id)) {
        return res.status(400).json({
          response_text: 'child_id inválido. Deve ser um UUID válido.',
          media_type: 'text',
          media_url: null
        });
      }

      const child = await Child.findByPk(child_id);
      if (!child) {
        return res.status(404).json({
          response_text: 'Criança não encontrada.',
          media_type: 'text',
          media_url: null
        });
      }

      const parsed = await nlpParserService.parseBiometrics(raw_text);

      if (!parsed.weight && !parsed.height && !parsed.head_circumference) {
        return res.json({
          response_text: 'Não consegui identificar peso ou altura na sua mensagem. Por favor, informe novamente. Exemplo: "Peso 8.5kg" ou "Mede 72cm".',
          media_type: 'text',
          media_url: null
        });
      }

      const log = await BiometricsLog.create({
        childId: child_id,
        weight: parsed.weight,
        height: parsed.height,
        headCircumference: parsed.head_circumference,
        rawInput: raw_text,
        source: 'whatsapp',
        recordedAt: new Date()
      });

      const parts = [];
      if (parsed.weight) parts.push(`peso: ${parsed.weight}kg`);
      if (parsed.height) parts.push(`altura: ${parsed.height}cm`);
      if (parsed.head_circumference) parts.push(`perímetro cefálico: ${parsed.head_circumference}cm`);

      return res.json({
        response_text: `✅ Registrado para ${child.firstName}: ${parts.join(', ')}. Continue acompanhando o desenvolvimento!`,
        media_type: 'text',
        media_url: null,
        data: { id: log.id, ...parsed }
      });
    } catch (error) {
      console.error('[n8n] Erro em updateBiometrics:', error);
      return res.status(500).json({
        response_text: 'Erro ao registrar dados biométricos. Tente novamente.',
        media_type: 'text',
        media_url: null
      });
    }
  },

  async logSleep(req, res) {
    try {
      const { child_id, raw_text } = req.body;

      if (!child_id || !raw_text) {
        return res.status(400).json({
          response_text: 'Dados incompletos. Informe child_id e raw_text.',
          media_type: 'text',
          media_url: null
        });
      }

      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(child_id)) {
        return res.status(400).json({
          response_text: 'child_id inválido. Deve ser um UUID válido.',
          media_type: 'text',
          media_url: null
        });
      }

      const child = await Child.findByPk(child_id);
      if (!child) {
        return res.status(404).json({
          response_text: 'Criança não encontrada.',
          media_type: 'text',
          media_url: null
        });
      }

      const parsed = await nlpParserService.parseSleep(raw_text);

      let startTime = null;
      let endTime = null;
      const now = new Date();

      if (parsed.start_time) {
        const [h, m] = parsed.start_time.split(':');
        startTime = new Date(now);
        startTime.setHours(parseInt(h), parseInt(m), 0, 0);
      }

      if (parsed.end_time) {
        const [h, m] = parsed.end_time.split(':');
        endTime = new Date(now);
        endTime.setHours(parseInt(h), parseInt(m), 0, 0);
        if (startTime && endTime < startTime) {
          endTime.setDate(endTime.getDate() + 1);
        }
      }

      const log = await SleepLog.create({
        childId: child_id,
        startTime,
        endTime,
        durationMinutes: parsed.duration_minutes,
        sleepType: parsed.sleep_type,
        quality: parsed.quality,
        rawInput: raw_text,
        source: 'whatsapp'
      });

      const parts = [];
      if (parsed.start_time) parts.push(`início: ${parsed.start_time}`);
      if (parsed.end_time) parts.push(`fim: ${parsed.end_time}`);
      if (parsed.duration_minutes) parts.push(`duração: ${Math.floor(parsed.duration_minutes / 60)}h${parsed.duration_minutes % 60}min`);
      if (parsed.sleep_type !== 'unknown') parts.push(`tipo: ${parsed.sleep_type === 'night' ? 'noturno' : 'soneca'}`);

      return res.json({
        response_text: `😴 Sono registrado para ${child.firstName}: ${parts.join(', ') || 'dados salvos'}. Bons sonhos!`,
        media_type: 'text',
        media_url: null,
        data: { id: log.id, ...parsed }
      });
    } catch (error) {
      console.error('[n8n] Erro em logSleep:', error);
      return res.status(500).json({
        response_text: 'Erro ao registrar sono. Tente novamente.',
        media_type: 'text',
        media_url: null
      });
    }
  },

  async createAppointment(req, res) {
    try {
      const { child_id, raw_text } = req.body;

      if (!child_id || !raw_text) {
        return res.status(400).json({
          response_text: 'Dados incompletos. Informe child_id e raw_text.',
          media_type: 'text',
          media_url: null
        });
      }

      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(child_id)) {
        return res.status(400).json({
          response_text: 'child_id inválido. Deve ser um UUID válido.',
          media_type: 'text',
          media_url: null
        });
      }

      const child = await Child.findByPk(child_id);
      if (!child) {
        return res.status(404).json({
          response_text: 'Criança não encontrada.',
          media_type: 'text',
          media_url: null
        });
      }

      const parsed = await nlpParserService.parseAppointment(raw_text);

      let appointmentDate = null;
      if (parsed.appointment_date) {
        appointmentDate = new Date(parsed.appointment_date);
        if (parsed.appointment_time) {
          const [h, m] = parsed.appointment_time.split(':');
          appointmentDate.setHours(parseInt(h), parseInt(m), 0, 0);
        }
      }

      const appointment = await Appointment.create({
        childId: child_id,
        doctorName: parsed.doctor_name,
        specialty: parsed.specialty,
        appointmentDate,
        location: parsed.location,
        status: 'scheduled',
        rawInput: raw_text,
        source: 'whatsapp'
      });

      const parts = [];
      if (parsed.specialty) parts.push(parsed.specialty);
      if (parsed.doctor_name) parts.push(`com ${parsed.doctor_name}`);
      if (parsed.appointment_date) parts.push(`em ${new Date(parsed.appointment_date).toLocaleDateString('pt-BR')}`);
      if (parsed.appointment_time) parts.push(`às ${parsed.appointment_time}`);
      if (parsed.location) parts.push(`no(a) ${parsed.location}`);

      return res.json({
        response_text: `🏥 Consulta agendada para ${child.firstName}: ${parts.join(' ') || 'dados salvos'}. Vou te lembrar!`,
        media_type: 'text',
        media_url: null,
        data: { id: appointment.id, ...parsed }
      });
    } catch (error) {
      console.error('[n8n] Erro em createAppointment:', error);
      return res.status(500).json({
        response_text: 'Erro ao agendar consulta. Tente novamente.',
        media_type: 'text',
        media_url: null
      });
    }
  },

  async checkVaccines(req, res) {
    try {
      const { age_weeks, child_id } = req.query;

      if (!age_weeks) {
        return res.status(400).json({
          response_text: 'Parâmetro age_weeks é obrigatório.',
          media_type: 'text',
          media_url: null
        });
      }

      const weeks = parseInt(age_weeks);
      
      let takenVaccines = [];
      if (child_id) {
        const history = await VaccineHistory.findAll({
          where: { 
            childId: child_id,
            status: 'taken'
          }
        });
        takenVaccines = history.map(v => `${v.vaccineName}-${v.doseNumber}`);
      }

      const dueVaccines = SBP_VACCINE_CALENDAR.filter(v => v.weeks <= weeks);
      
      const pending = dueVaccines.filter(v => {
        const key = `${v.vaccine}-${v.dose}`;
        return !takenVaccines.includes(key);
      });

      const upcoming = SBP_VACCINE_CALENDAR.filter(v => v.weeks > weeks && v.weeks <= weeks + 8);

      let responseText = `💉 **Calendário Vacinal - ${weeks} semanas**\n\n`;
      
      if (pending.length > 0) {
        responseText += `⚠️ **Vacinas pendentes:**\n`;
        pending.forEach(v => {
          responseText += `• ${v.vaccine} (dose ${v.dose}) - era para ${v.weeks} semanas\n`;
        });
      } else {
        responseText += `✅ Todas as vacinas em dia até ${weeks} semanas!\n`;
      }

      if (upcoming.length > 0) {
        responseText += `\n📅 **Próximas vacinas:**\n`;
        upcoming.forEach(v => {
          responseText += `• ${v.vaccine} (dose ${v.dose}) - às ${v.weeks} semanas\n`;
        });
      }

      return res.json({
        response_text: responseText,
        media_type: 'text',
        media_url: null,
        data: {
          age_weeks: weeks,
          pending_count: pending.length,
          pending_vaccines: pending,
          upcoming_vaccines: upcoming,
          taken_count: takenVaccines.length
        }
      });
    } catch (error) {
      console.error('[n8n] Erro em checkVaccines:', error);
      return res.status(500).json({
        response_text: 'Erro ao verificar vacinas. Tente novamente.',
        media_type: 'text',
        media_url: null
      });
    }
  },

  async getChildContent(req, res) {
    try {
      const { week } = req.query;
      const weeks = parseInt(week) || 0;

      const content = await ContentItem.findAll({
        where: {
          status: 'published',
          type: { [Op.in]: ['news', 'training'] },
          [Op.or]: [
            { target_audience: 'all' },
            { target_audience: 'parents' }
          ]
        },
        order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
        limit: 5
      });

      if (content.length === 0) {
        return res.json({
          response_text: `👶 Seu bebê está na semana ${weeks}! Continue acompanhando o desenvolvimento pelo app Educare+.`,
          media_type: 'text',
          media_url: null,
          data: []
        });
      }

      let responseText = `👶 **Conteúdo para semana ${weeks}:**\n\n`;
      content.forEach((item, i) => {
        responseText += `${i + 1}. **${item.title}**\n${item.summary || item.description || ''}\n\n`;
      });

      const hasImage = content.find(c => c.image_url);

      return res.json({
        response_text: responseText,
        media_type: hasImage ? 'image' : 'text',
        media_url: hasImage?.image_url || null,
        data: content.map(c => ({ id: c.id, title: c.title, type: c.type }))
      });
    } catch (error) {
      console.error('[n8n] Erro em getChildContent:', error);
      return res.status(500).json({
        response_text: 'Erro ao buscar conteúdo. Tente novamente.',
        media_type: 'text',
        media_url: null
      });
    }
  },

  async getMotherContent(req, res) {
    try {
      const { week } = req.query;
      const weeks = parseInt(week) || 0;

      const content = await ContentItem.findAll({
        where: {
          status: 'published',
          type: { [Op.in]: ['news', 'training', 'course'] },
          [Op.or]: [
            { target_audience: 'all' },
            { target_audience: 'professionals' }
          ]
        },
        order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
        limit: 5
      });

      if (content.length === 0) {
        return res.json({
          response_text: `👩 Semana ${weeks} pós-parto: Cuide de você também! Acesse o app Educare+ para mais dicas.`,
          media_type: 'text',
          media_url: null,
          data: []
        });
      }

      let responseText = `👩 **Conteúdo para mães - semana ${weeks}:**\n\n`;
      content.forEach((item, i) => {
        responseText += `${i + 1}. **${item.title}**\n${item.summary || item.description || ''}\n\n`;
      });

      const hasImage = content.find(c => c.image_url);

      return res.json({
        response_text: responseText,
        media_type: hasImage ? 'image' : 'text',
        media_url: hasImage?.image_url || null,
        data: content.map(c => ({ id: c.id, title: c.title, type: c.type }))
      });
    } catch (error) {
      console.error('[n8n] Erro em getMotherContent:', error);
      return res.status(500).json({
        response_text: 'Erro ao buscar conteúdo. Tente novamente.',
        media_type: 'text',
        media_url: null
      });
    }
  }
};

module.exports = n8nController;
