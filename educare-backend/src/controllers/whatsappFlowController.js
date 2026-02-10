const { User, Profile, Child, JourneyV2, JourneyV2Week, JourneyV2Topic, JourneyV2Quiz, JourneyBotQuestion, JourneyBotResponse, BiometricsLog, SleepLog, VaccineHistory } = require('../models');
const { findUserByPhone } = require('../utils/phoneUtils');
const { Op } = require('sequelize');
const pgvectorService = require('../services/pgvectorService');

const findChildByUser = async (userId) => {
  const profile = await Profile.findOne({ where: { userId } });
  if (!profile) return null;

  const children = await Child.findAll({
    where: { profileId: profile.id },
    order: [['birth_date', 'DESC']]
  });

  if (!children || children.length === 0) return null;

  return children[0];
};

const calculateAgeMonths = (birthDate) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  return (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
};

const whatsappFlowController = {
  async getCurrentContent(req, res) {
    try {
      const { phone, active_context } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const user = await findUserByPhone(User, phone);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
      }

      const child = await findChildByUser(user.id);
      if (!child) {
        return res.status(404).json({ success: false, error: 'Nenhuma criança cadastrada' });
      }

      const ageMonths = calculateAgeMonths(child.birth_date);
      const trail = active_context === 'mother' ? 'mother' : 'baby';

      const journey = await JourneyV2.findOne({
        where: {
          trail,
          month: ageMonths !== null ? ageMonths : 0
        }
      });

      if (!journey) {
        const fallbackJourney = await JourneyV2.findOne({
          where: { trail },
          order: [['month', 'ASC']]
        });

        if (!fallbackJourney) {
          return res.status(404).json({ success: false, error: 'Nenhuma jornada disponível' });
        }

        const fallbackWeek = await JourneyV2Week.findOne({
          where: { journey_id: fallbackJourney.id },
          order: [['week', 'ASC']],
          include: [{ model: JourneyV2Topic, as: 'topics', order: [['order_index', 'ASC']] }]
        });

        if (!fallbackWeek) {
          return res.status(404).json({ success: false, error: 'Nenhum conteúdo disponível' });
        }

        const quizCount = await JourneyV2Quiz.count({ where: { week_id: fallbackWeek.id } });

        return res.json({
          success: true,
          data: {
            week_number: fallbackWeek.week,
            week_title: fallbackWeek.title,
            topics: (fallbackWeek.topics || []).map(t => ({
              id: t.id,
              title: t.title,
              content_preview: typeof t.content === 'object' ? (t.content.summary || t.content.text || '').substring(0, 150) : String(t.content || '').substring(0, 150),
              domain: t.dev_domain
            })),
            has_quiz: quizCount > 0,
            journey_trail: trail
          }
        });
      }

      const week = await JourneyV2Week.findOne({
        where: { journey_id: journey.id },
        order: [['week', 'ASC']],
        include: [{ model: JourneyV2Topic, as: 'topics', order: [['order_index', 'ASC']] }]
      });

      if (!week) {
        return res.status(404).json({ success: false, error: 'Nenhum conteúdo para esta semana' });
      }

      const quizCount = await JourneyV2Quiz.count({ where: { week_id: week.id } });

      return res.json({
        success: true,
        data: {
          week_number: week.week,
          week_title: week.title,
          topics: (week.topics || []).map(t => ({
            id: t.id,
            title: t.title,
            content_preview: typeof t.content === 'object' ? (t.content.summary || t.content.text || '').substring(0, 150) : String(t.content || '').substring(0, 150),
            domain: t.dev_domain
          })),
          has_quiz: quizCount > 0,
          journey_trail: trail
        }
      });
    } catch (error) {
      console.error('[WhatsAppFlow] getCurrentContent error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar conteúdo' });
    }
  },

  async getTopicDetail(req, res) {
    try {
      const { topicId } = req.params;

      const topic = await JourneyV2Topic.findByPk(topicId);
      if (!topic) {
        return res.status(404).json({ success: false, error: 'Tópico não encontrado' });
      }

      let mediaUrl = null;
      if (typeof topic.content === 'object' && topic.content.media_url) {
        mediaUrl = topic.content.media_url;
      }

      let readingTime = 3;
      const contentText = typeof topic.content === 'object' ? JSON.stringify(topic.content) : String(topic.content || '');
      const wordCount = contentText.split(/\s+/).length;
      readingTime = Math.max(1, Math.ceil(wordCount / 200));

      return res.json({
        success: true,
        data: {
          id: topic.id,
          title: topic.title,
          content: topic.content,
          domain: topic.dev_domain,
          media_url: mediaUrl,
          reading_time_estimate: readingTime
        }
      });
    } catch (error) {
      console.error('[WhatsAppFlow] getTopicDetail error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar tópico' });
    }
  },

  async getNextQuestion(req, res) {
    try {
      const { phone, active_context } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const user = await findUserByPhone(User, phone);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
      }

      const child = await findChildByUser(user.id);
      if (!child) {
        return res.status(404).json({ success: false, error: 'Nenhuma criança cadastrada' });
      }

      const ageMonths = calculateAgeMonths(child.birth_date);

      const answeredResponses = await JourneyBotResponse.findAll({
        where: { user_id: user.id, child_id: child.id },
        attributes: ['question_id']
      });
      const answeredIds = answeredResponses.map(r => r.question_id);

      const whereClause = {
        is_active: true,
        meta_min_months: { [Op.lte]: ageMonths || 0 },
        meta_max_months: { [Op.gte]: ageMonths || 0 }
      };

      if (answeredIds.length > 0) {
        whereClause.id = { [Op.notIn]: answeredIds };
      }

      const totalQuestions = await JourneyBotQuestion.count({
        where: {
          is_active: true,
          meta_min_months: { [Op.lte]: ageMonths || 0 },
          meta_max_months: { [Op.gte]: ageMonths || 0 }
        }
      });

      const nextQuestion = await JourneyBotQuestion.findOne({
        where: whereClause,
        order: [['order_index', 'ASC']]
      });

      if (!nextQuestion) {
        return res.json({
          success: true,
          data: {
            question_id: null,
            question_text: null,
            domain: null,
            options: [],
            progress: {
              answered: answeredIds.length,
              total: totalQuestions,
              percentage: totalQuestions > 0 ? Math.round((answeredIds.length / totalQuestions) * 100) : 100
            },
            completed: true
          }
        });
      }

      return res.json({
        success: true,
        data: {
          question_id: nextQuestion.id,
          question_text: nextQuestion.domain_question,
          domain: nextQuestion.domain_name,
          options: [
            { id: 1, text: 'Sim, faz isso' },
            { id: 2, text: 'Às vezes faz' },
            { id: 3, text: 'Ainda não faz' }
          ],
          progress: {
            answered: answeredIds.length,
            total: totalQuestions,
            percentage: totalQuestions > 0 ? Math.round((answeredIds.length / totalQuestions) * 100) : 0
          }
        }
      });
    } catch (error) {
      console.error('[WhatsAppFlow] getNextQuestion error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar próxima pergunta' });
    }
  },

  async saveAnswer(req, res) {
    try {
      const { phone, question_id, answer, answer_text } = req.body;

      if (!phone || !question_id || answer === undefined) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone, question_id e answer são obrigatórios' });
      }

      const user = await findUserByPhone(User, phone);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
      }

      const child = await findChildByUser(user.id);
      if (!child) {
        return res.status(404).json({ success: false, error: 'Nenhuma criança cadastrada' });
      }

      const question = await JourneyBotQuestion.findByPk(question_id);

      let feedbackText = 'Resposta registrada com sucesso!';
      if (question) {
        if (answer === 1 && question.domain_feedback_1) feedbackText = question.domain_feedback_1;
        else if (answer === 2 && question.domain_feedback_2) feedbackText = question.domain_feedback_2;
        else if (answer === 3 && question.domain_feedback_3) feedbackText = question.domain_feedback_3;
      }

      await JourneyBotResponse.create({
        user_id: user.id,
        child_id: child.id,
        question_id,
        answer: parseInt(answer),
        answer_text: answer_text || `Opção ${answer}`,
        responded_at: new Date()
      });

      const ageMonths = calculateAgeMonths(child.birth_date);
      const totalQuestions = await JourneyBotQuestion.count({
        where: {
          is_active: true,
          meta_min_months: { [Op.lte]: ageMonths || 0 },
          meta_max_months: { [Op.gte]: ageMonths || 0 }
        }
      });
      const answeredCount = await JourneyBotResponse.count({
        where: { user_id: user.id, child_id: child.id }
      });

      const hasNext = answeredCount < totalQuestions;

      return res.json({
        success: true,
        data: {
          saved: true,
          feedback_text: feedbackText,
          has_next_question: hasNext,
          progress: {
            answered: answeredCount,
            total: totalQuestions,
            percentage: totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 100
          }
        }
      });
    } catch (error) {
      console.error('[WhatsAppFlow] saveAnswer error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao salvar resposta' });
    }
  },

  async getLogOptions(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const user = await findUserByPhone(User, phone);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
      }

      return res.json({
        success: true,
        data: {
          options: [
            { id: 'biometrics', text: '📏 Registrar peso/altura' },
            { id: 'sleep', text: '🌙 Registrar sono' },
            { id: 'vaccine', text: '💉 Registrar vacina' }
          ]
        }
      });
    } catch (error) {
      console.error('[WhatsAppFlow] getLogOptions error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar opções de registro' });
    }
  },

  async saveLog(req, res) {
    try {
      const { phone, log_type, data } = req.body;

      if (!phone || !log_type || !data) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone, log_type e data são obrigatórios' });
      }

      const user = await findUserByPhone(User, phone);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
      }

      const child = await findChildByUser(user.id);
      if (!child) {
        return res.status(404).json({ success: false, error: 'Nenhuma criança cadastrada' });
      }

      let confirmationText = '';

      switch (log_type) {
        case 'biometrics': {
          await BiometricsLog.create({
            childId: child.id,
            weight: data.weight_kg || null,
            height: data.height_cm || null,
            source: 'whatsapp',
            recordedAt: new Date()
          });
          const parts = [];
          if (data.weight_kg) parts.push(`Peso: ${data.weight_kg}kg`);
          if (data.height_cm) parts.push(`Altura: ${data.height_cm}cm`);
          const childName = child.firstName || child.first_name || 'bebê';
          confirmationText = `✅ Medidas registradas para ${childName}: ${parts.join(', ')}`;
          break;
        }
        case 'sleep': {
          const durationMinutes = data.sleep_hours ? Math.round(data.sleep_hours * 60) : null;
          await SleepLog.create({
            childId: child.id,
            durationMinutes,
            quality: data.sleep_quality || 'unknown',
            notes: data.notes || null,
            source: 'whatsapp'
          });
          const sleepChildName = child.firstName || child.first_name || 'bebê';
          confirmationText = `✅ Sono registrado para ${sleepChildName}: ${data.sleep_hours || '?'}h - Qualidade: ${data.sleep_quality || 'não informada'}`;
          break;
        }
        case 'vaccine': {
          await VaccineHistory.create({
            childId: child.id,
            vaccineName: data.vaccine_name,
            takenAt: data.date_administered || new Date(),
            status: 'taken',
            source: 'whatsapp',
            notes: data.notes || null,
            location: data.location || null
          });
          const vaccChildName = child.firstName || child.first_name || 'bebê';
          confirmationText = `✅ Vacina registrada para ${vaccChildName}: ${data.vaccine_name}`;
          break;
        }
        default:
          return res.status(400).json({ success: false, error: `Tipo de registro inválido: ${log_type}` });
      }

      return res.json({
        success: true,
        data: {
          saved: true,
          log_type,
          confirmation_text: confirmationText
        }
      });
    } catch (error) {
      console.error('[WhatsAppFlow] saveLog error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao salvar registro' });
    }
  },

  async saveReport(req, res) {
    try {
      const { phone, type, content, state, active_context, assistant_name } = req.body;

      if (!phone || !content) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone e content são obrigatórios' });
      }

      const result = await pgvectorService.saveReport({
        user_phone: phone,
        type: type || 'support',
        content,
        state,
        active_context,
        assistant_name
      });

      return res.json(result);
    } catch (error) {
      console.error('[WhatsAppFlow] saveReport error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao salvar report' });
    }
  }
};

module.exports = whatsappFlowController;
