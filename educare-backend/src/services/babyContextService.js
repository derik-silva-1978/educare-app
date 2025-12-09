const { Child, Profile, User, JourneyBotResponse, JourneyBotQuestion, QuizSession, Answer } = require('../models');
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

  return text;
}

module.exports = {
  getBabyContext,
  calculateAge,
  getMilestones,
  getQuizSummary,
  getEducareTrack,
  formatContextForPrompt
};
