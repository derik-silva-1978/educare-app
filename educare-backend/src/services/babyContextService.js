const { Child, Profile, User, JourneyBotResponse, JourneyBotQuestion, QuizSession, Answer, BiometricsLog, SleepLog, VaccineHistory, Appointment, ChildDevelopmentReport } = require('../models');
const { Op } = require('sequelize');

async function getBabyContext(babyId) {
  try {
    if (!babyId) {
      return {
        success: false,
        error: 'baby_id não fornecido'
      };
    }

    const child = await Child.findByPk(babyId, {
      include: [{
        model: Profile,
        as: 'profile',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      }]
    });

    if (!child) {
      return {
        success: false,
        error: 'Bebê não encontrado'
      };
    }

    const ageData = calculateAge(child.birth_date);

    const milestones = await getMilestones(babyId);

    const quizSummary = await getQuizSummary(babyId);

    const educareTrack = getEducareTrack(ageData.months);

    const context = {
      baby_id: child.id,
      name: child.name,
      gender: child.gender,
      birth_date: child.birth_date,
      age_days: ageData.days,
      age_weeks: ageData.weeks,
      age_months: ageData.months,
      age_formatted: ageData.formatted,
      special_needs: child.special_needs,
      observations: child.observations,
      milestones,
      quiz_summary: quizSummary,
      educare_track: educareTrack,
      caregiver: child.profile ? {
        name: child.profile.name,
        relationship: child.profile.type
      } : null
    };

    return {
      success: true,
      data: context
    };
  } catch (error) {
    console.error('[BabyContext] Erro ao obter contexto:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function calculateAge(birthDate) {
  if (!birthDate) {
    return {
      days: null,
      weeks: null,
      months: null,
      formatted: 'Idade não informada'
    };
  }

  const birth = new Date(birthDate);
  const today = new Date();
  const diffMs = today - birth;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);

  let formatted = '';
  if (months < 1) {
    formatted = `${weeks} semanas`;
  } else if (months < 24) {
    formatted = `${months} meses`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    formatted = remainingMonths > 0 
      ? `${years} anos e ${remainingMonths} meses`
      : `${years} anos`;
  }

  return {
    days,
    weeks,
    months,
    formatted
  };
}

async function getMilestones(babyId) {
  try {
    const responses = await JourneyBotResponse.findAll({
      where: { child_id: babyId },
      include: [{
        model: JourneyBotQuestion,
        as: 'question',
        attributes: ['id', 'domain', 'age_range', 'question_text']
      }],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    const achieved = [];
    const pending = [];
    const delayed = [];

    responses.forEach(r => {
      if (!r.question) return;

      const milestone = {
        domain: r.question.domain || 'geral',
        question: r.question.question_text,
        age_range: r.question.age_range,
        answered_at: r.created_at
      };

      const answer = (r.response_value || r.answer || '').toLowerCase();
      
      if (answer === 'sim' || answer === 'yes' || answer === 'consegue') {
        achieved.push(milestone);
      } else if (answer === 'ainda não' || answer === 'parcialmente' || answer === 'às vezes') {
        pending.push(milestone);
      } else if (answer === 'não' || answer === 'no') {
        delayed.push(milestone);
      }
    });

    const domainCounts = {};
    responses.forEach(r => {
      if (r.question && r.question.domain) {
        domainCounts[r.question.domain] = (domainCounts[r.question.domain] || 0) + 1;
      }
    });

    return {
      achieved: achieved.slice(0, 10),
      pending: pending.slice(0, 10),
      delayed: delayed.slice(0, 5),
      total_responses: responses.length,
      domains_evaluated: Object.keys(domainCounts),
      domain_counts: domainCounts
    };
  } catch (error) {
    console.error('[BabyContext] Erro ao obter marcos:', error);
    return {
      achieved: [],
      pending: [],
      delayed: [],
      total_responses: 0,
      domains_evaluated: [],
      domain_counts: {}
    };
  }
}

async function getQuizSummary(babyId) {
  try {
    const sessions = await QuizSession.findAll({
      where: { childId: babyId },
      include: [{
        model: Answer,
        as: 'sessionAnswers'
      }],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    if (sessions.length === 0) {
      return {
        total_sessions: 0,
        strongest_domain: null,
        weakest_domain: null,
        last_score: null,
        last_feedback: null
      };
    }

    const domainScores = {};
    let totalScore = 0;
    let totalAnswers = 0;

    sessions.forEach(session => {
      if (session.sessionAnswers) {
        session.sessionAnswers.forEach(answer => {
          totalAnswers++;
          const score = answer.score || 0;
          totalScore += score;
        });
      }
    });

    const latestSession = sessions[0];

    return {
      total_sessions: sessions.length,
      strongest_domain: null,
      weakest_domain: null,
      last_score: totalAnswers > 0 ? Math.round((totalScore / totalAnswers) * 100) / 100 : null,
      last_session_date: latestSession ? latestSession.created_at : null,
      total_answers: totalAnswers
    };
  } catch (error) {
    console.error('[BabyContext] Erro ao obter resumo de quizzes:', error);
    return {
      total_sessions: 0,
      strongest_domain: null,
      weakest_domain: null,
      last_score: null
    };
  }
}

async function getShortTermMemory(babyId) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentBiometrics, recentSleep, upcomingAppointments] = await Promise.all([
      BiometricsLog.findAll({
        where: { childId: babyId, createdAt: { [Op.gte]: sevenDaysAgo } },
        order: [['recordedAt', 'DESC']],
        limit: 3
      }),
      SleepLog.findAll({
        where: { childId: babyId, createdAt: { [Op.gte]: sevenDaysAgo } },
        order: [['createdAt', 'DESC']],
        limit: 5
      }),
      Appointment.findAll({
        where: { 
          childId: babyId, 
          appointmentDate: { [Op.gte]: new Date() },
          status: { [Op.in]: ['scheduled', 'confirmed'] }
        },
        order: [['appointmentDate', 'ASC']],
        limit: 3
      })
    ]);

    return {
      recent_biometrics: recentBiometrics.map(b => ({
        weight: b.weight,
        height: b.height,
        head_circumference: b.headCircumference,
        recorded_at: b.recordedAt,
        source: b.source
      })),
      recent_sleep: recentSleep.map(s => ({
        duration_minutes: s.durationMinutes,
        sleep_type: s.sleepType,
        quality: s.quality,
        start_time: s.startTime
      })),
      upcoming_appointments: upcomingAppointments.map(a => ({
        doctor_name: a.doctorName,
        specialty: a.specialty,
        appointment_date: a.appointmentDate,
        location: a.location
      })),
      period: 'últimos 7 dias'
    };
  } catch (error) {
    console.error('[BabyContext] Erro ao obter memória curta:', error);
    return {
      recent_biometrics: [],
      recent_sleep: [],
      upcoming_appointments: [],
      period: 'últimos 7 dias'
    };
  }
}

async function getLongTermMemory(babyId) {
  try {
    const [vaccines, allBiometrics, developmentReports] = await Promise.all([
      VaccineHistory.findAll({
        where: { childId: babyId },
        order: [['takenAt', 'DESC']]
      }),
      BiometricsLog.findAll({
        where: { childId: babyId },
        order: [['recordedAt', 'ASC']]
      }),
      ChildDevelopmentReport.findAll({
        where: { child_id: babyId },
        order: [['generated_at', 'DESC']],
        limit: 3
      })
    ]);

    const takenVaccines = vaccines.filter(v => v.status === 'taken');
    const pendingVaccines = vaccines.filter(v => ['pending', 'scheduled', 'delayed'].includes(v.status));

    let growthTrend = null;
    if (allBiometrics.length >= 2) {
      const first = allBiometrics[0];
      const last = allBiometrics[allBiometrics.length - 1];
      
      if (first.weight && last.weight) {
        const weightGain = parseFloat(last.weight) - parseFloat(first.weight);
        growthTrend = {
          weight_start: parseFloat(first.weight),
          weight_current: parseFloat(last.weight),
          weight_gain_kg: Math.round(weightGain * 100) / 100,
          height_start: first.height ? parseFloat(first.height) : null,
          height_current: last.height ? parseFloat(last.height) : null,
          measurements_count: allBiometrics.length
        };
      }
    }

    const latestReport = developmentReports[0];

    return {
      vaccines_taken: takenVaccines.map(v => ({
        name: v.vaccineName,
        dose: v.doseNumber,
        taken_at: v.takenAt
      })),
      vaccines_pending: pendingVaccines.slice(0, 5).map(v => ({
        name: v.vaccineName,
        dose: v.doseNumber,
        scheduled_at: v.scheduledAt,
        status: v.status
      })),
      vaccine_summary: {
        total_taken: takenVaccines.length,
        pending: pendingVaccines.length
      },
      growth_trend: growthTrend,
      latest_development_report: latestReport ? {
        overall_score: latestReport.overall_score,
        dimension_scores: latestReport.dimension_scores,
        recommendations: latestReport.recommendations?.slice(0, 3) || [],
        concerns: latestReport.concerns?.slice(0, 3) || [],
        generated_at: latestReport.generated_at
      } : null
    };
  } catch (error) {
    console.error('[BabyContext] Erro ao obter memória longa:', error);
    return {
      vaccines_taken: [],
      vaccines_pending: [],
      vaccine_summary: { total_taken: 0, pending: 0 },
      growth_trend: null,
      latest_development_report: null
    };
  }
}

async function getFullChildContext(babyId) {
  try {
    const [basicContext, shortTermMemory, longTermMemory] = await Promise.all([
      getBabyContext(babyId),
      getShortTermMemory(babyId),
      getLongTermMemory(babyId)
    ]);

    if (!basicContext.success) {
      return basicContext;
    }

    return {
      success: true,
      data: {
        ...basicContext.data,
        short_term_memory: shortTermMemory,
        long_term_memory: longTermMemory
      }
    };
  } catch (error) {
    console.error('[BabyContext] Erro ao obter contexto completo:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function getEducareTrack(ageMonths) {
  if (ageMonths === null) {
    return {
      current_stage: 'Indefinido',
      age_range: null,
      recommended_domains: ['motor', 'cognitivo', 'social', 'sensorial']
    };
  }

  let stage, ageRange, domains;

  if (ageMonths <= 3) {
    stage = 'Recém-nascido (0-3m)';
    ageRange = '0-3m';
    domains = ['sensorial', 'motor', 'social'];
  } else if (ageMonths <= 6) {
    stage = 'Explorador Inicial (4-6m)';
    ageRange = '4-6m';
    domains = ['motor', 'sensorial', 'cognitivo'];
  } else if (ageMonths <= 9) {
    stage = 'Descobridor (7-9m)';
    ageRange = '7-9m';
    domains = ['motor', 'cognitivo', 'social'];
  } else if (ageMonths <= 12) {
    stage = 'Aventureiro (10-12m)';
    ageRange = '10-12m';
    domains = ['motor', 'linguagem', 'cognitivo'];
  } else if (ageMonths <= 18) {
    stage = 'Explorador Avançado (13-18m)';
    ageRange = '13-18m';
    domains = ['linguagem', 'motor', 'social'];
  } else if (ageMonths <= 24) {
    stage = 'Pequeno Comunicador (19-24m)';
    ageRange = '19-24m';
    domains = ['linguagem', 'social', 'cognitivo'];
  } else if (ageMonths <= 36) {
    stage = 'Construtor de Mundo (2-3a)';
    ageRange = '2-3a';
    domains = ['cognitivo', 'linguagem', 'social'];
  } else if (ageMonths <= 48) {
    stage = 'Pensador Criativo (3-4a)';
    ageRange = '3-4a';
    domains = ['cognitivo', 'social', 'adaptativo'];
  } else if (ageMonths <= 60) {
    stage = 'Preparador Escolar (4-5a)';
    ageRange = '4-5a';
    domains = ['cognitivo', 'linguagem', 'adaptativo'];
  } else {
    stage = 'Pré-escolar Avançado (5-6a)';
    ageRange = '5-6a';
    domains = ['cognitivo', 'social', 'adaptativo'];
  }

  return {
    current_stage: stage,
    age_range: ageRange,
    recommended_domains: domains
  };
}

function formatContextForPrompt(context) {
  if (!context) {
    return 'Contexto do bebê não disponível.';
  }

  let text = `CONTEXTO DO BEBÊ:
- Nome: ${context.name || 'Não informado'}
- Idade: ${context.age_formatted || 'Não informada'}
- Gênero: ${context.gender === 'M' ? 'Masculino' : context.gender === 'F' ? 'Feminino' : 'Não informado'}`;

  if (context.special_needs) {
    text += `\n- Necessidades especiais: ${context.special_needs}`;
  }

  if (context.educare_track) {
    text += `\n- Etapa Educare: ${context.educare_track.current_stage}`;
    text += `\n- Domínios prioritários: ${context.educare_track.recommended_domains.join(', ')}`;
  }

  if (context.milestones) {
    if (context.milestones.achieved.length > 0) {
      text += `\n- Marcos atingidos recentes: ${context.milestones.achieved.slice(0, 3).map(m => m.domain).join(', ')}`;
    }
    if (context.milestones.pending.length > 0) {
      text += `\n- Marcos em desenvolvimento: ${context.milestones.pending.slice(0, 3).map(m => m.domain).join(', ')}`;
    }
    if (context.milestones.delayed.length > 0) {
      text += `\n- Áreas que precisam de atenção: ${context.milestones.delayed.slice(0, 3).map(m => m.domain).join(', ')}`;
    }
  }

  if (context.quiz_summary && context.quiz_summary.total_sessions > 0) {
    text += `\n- Avaliações realizadas: ${context.quiz_summary.total_sessions}`;
  }

  if (context.caregiver) {
    text += `\n- Cuidador: ${context.caregiver.name} (${context.caregiver.relationship || 'responsável'})`;
  }

  if (context.short_term_memory) {
    const stm = context.short_term_memory;
    text += '\n\nMEMÓRIA RECENTE (últimos 7 dias):';
    
    if (stm.recent_biometrics && stm.recent_biometrics.length > 0) {
      const latest = stm.recent_biometrics[0];
      text += `\n- Última medição: ${latest.weight ? `${latest.weight}kg` : ''} ${latest.height ? `${latest.height}cm` : ''}`;
    }
    
    if (stm.recent_sleep && stm.recent_sleep.length > 0) {
      const avgDuration = stm.recent_sleep.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / stm.recent_sleep.length;
      text += `\n- Sono recente: média de ${Math.round(avgDuration / 60)}h por noite (${stm.recent_sleep.length} registros)`;
    }
    
    if (stm.upcoming_appointments && stm.upcoming_appointments.length > 0) {
      text += `\n- Próximas consultas: ${stm.upcoming_appointments.map(a => `${a.specialty || a.doctor_name}`).join(', ')}`;
    }
  }

  if (context.long_term_memory) {
    const ltm = context.long_term_memory;
    text += '\n\nHISTÓRICO DE SAÚDE:';
    
    if (ltm.vaccine_summary) {
      text += `\n- Vacinas aplicadas: ${ltm.vaccine_summary.total_taken}, pendentes: ${ltm.vaccine_summary.pending}`;
    }
    
    if (ltm.growth_trend) {
      text += `\n- Curva de crescimento: de ${ltm.growth_trend.weight_start}kg para ${ltm.growth_trend.weight_current}kg (${ltm.growth_trend.measurements_count} medições)`;
    }
    
    if (ltm.latest_development_report) {
      const report = ltm.latest_development_report;
      text += `\n- Última avaliação de desenvolvimento: score geral ${report.overall_score}%`;
      if (report.concerns && report.concerns.length > 0) {
        text += `\n- Pontos de atenção identificados: ${report.concerns.slice(0, 2).join(', ')}`;
      }
    }
  }

  return text;
}

module.exports = {
  getBabyContext,
  getFullChildContext,
  getShortTermMemory,
  getLongTermMemory,
  calculateAge,
  getMilestones,
  getQuizSummary,
  getEducareTrack,
  formatContextForPrompt
};
