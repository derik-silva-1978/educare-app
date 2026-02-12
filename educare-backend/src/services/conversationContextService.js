const pgvectorService = require('./pgvectorService');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

const MEMORY_LIMIT = parseInt(process.env.CONTEXT_MEMORY_LIMIT || '5', 10);

async function getFullContext(userPhone, options = {}) {
  const startTime = Date.now();

  try {
    const [stateResult, recentMemory, userProfile] = await Promise.all([
      pgvectorService.getConversationState(userPhone),
      getRecentMemory(userPhone, options.limit || MEMORY_LIMIT),
      getUserProfile(userPhone)
    ]);

    const state = stateResult.success ? stateResult.state : null;

    let childData = null;
    if (state?.active_child_id) {
      childData = await getChildData(state.active_child_id);
    } else if (userProfile?.id) {
      childData = await getFirstChild(userProfile.id);
    }

    const feedbackStats = await getFeedbackStats(userPhone);

    const context = {
      success: true,
      phone: userPhone,
      state: state ? {
        current_state: state.state,
        active_context: state.active_context,
        active_child_id: state.active_child_id,
        assistant_name: state.assistant_name,
        journey_week: state.journey_week,
        audio_preference: state.audio_preference,
        correlation_id: state.correlation_id,
        last_interaction_at: state.last_interaction_at
      } : null,
      user: userProfile ? {
        id: userProfile.id,
        name: userProfile.name,
        role: userProfile.role,
        subscription_status: userProfile.subscription_status
      } : null,
      child: childData,
      memory: {
        recent: recentMemory,
        count: recentMemory.length
      },
      feedback: feedbackStats,
      context_time_ms: Date.now() - startTime
    };

    return context;
  } catch (error) {
    console.error('[ConversationContext] Error building context:', error.message);
    return {
      success: false,
      error: error.message,
      phone: userPhone,
      context_time_ms: Date.now() - startTime
    };
  }
}

async function getRecentMemory(userPhone, limit = 5) {
  try {
    const [results] = await sequelize.query(`
      SELECT id, role, content, interaction_type, active_context, assistant_name, domain, journey_week, emotional_tone, created_at
      FROM conversation_memory
      WHERE user_phone = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, {
      bind: [userPhone, limit]
    });

    return results.reverse();
  } catch (error) {
    console.error('[ConversationContext] Error fetching memory:', error.message);
    return [];
  }
}

async function getUserProfile(userPhone) {
  try {
    const cleanPhone = userPhone.replace(/\D/g, '');

    const [results] = await sequelize.query(`
      SELECT id, name, email, phone, role, status, subscription_status, created_at
      FROM users
      WHERE phone LIKE $1 OR phone LIKE $2
      LIMIT 1
    `, {
      bind: [`%${cleanPhone.slice(-8)}`, `%${cleanPhone.slice(-9)}`]
    });

    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('[ConversationContext] Error fetching user:', error.message);
    return null;
  }
}

async function getChildData(childId) {
  try {
    const [results] = await sequelize.query(`
      SELECT id, name, birth_date, gender, special_needs,
        EXTRACT(MONTH FROM age(NOW(), birth_date))::INTEGER +
        EXTRACT(YEAR FROM age(NOW(), birth_date))::INTEGER * 12 AS age_months
      FROM children
      WHERE id = $1
      LIMIT 1
    `, {
      bind: [childId]
    });

    if (results.length === 0) return null;

    const child = results[0];

    const [milestones] = await sequelize.query(`
      SELECT domain, milestone_name, status, evaluated_at
      FROM milestone_evaluations
      WHERE child_id = $1
      ORDER BY evaluated_at DESC
      LIMIT 10
    `, {
      bind: [childId]
    });

    return {
      ...child,
      milestones: milestones || []
    };
  } catch (error) {
    console.error('[ConversationContext] Error fetching child:', error.message);
    return null;
  }
}

async function getFirstChild(userId) {
  try {
    const [results] = await sequelize.query(`
      SELECT id FROM children WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1
    `, {
      bind: [userId]
    });

    if (results.length > 0) {
      return await getChildData(results[0].id);
    }
    return null;
  } catch (error) {
    console.error('[ConversationContext] Error fetching first child:', error.message);
    return null;
  }
}

async function getFeedbackStats(userPhone) {
  try {
    const [results] = await sequelize.query(`
      SELECT
        COUNT(*)::INTEGER AS total_feedbacks,
        ROUND(AVG(score), 1) AS avg_score,
        MAX(created_at) AS last_feedback_at
      FROM ux_feedback
      WHERE user_phone = $1
    `, {
      bind: [userPhone]
    });

    return results[0] || { total_feedbacks: 0, avg_score: null, last_feedback_at: null };
  } catch (error) {
    console.error('[ConversationContext] Error fetching feedback stats:', error.message);
    return { total_feedbacks: 0, avg_score: null, last_feedback_at: null };
  }
}

function formatContextForPrompt(context) {
  if (!context.success) return '';

  const parts = [];

  if (context.user) {
    parts.push(`USUÁRIO: ${context.user.name || 'Não identificado'} (${context.user.role || 'parent'})`);
  } else {
    parts.push(`USUÁRIO: Contato WhatsApp (sem cadastro no app)`);
  }

  if (context.child) {
    parts.push(`CRIANÇA: ${context.child.name || 'Não informada'}, ${context.child.age_months || '?'} meses, ${context.child.gender === 'M' ? 'Masculino' : context.child.gender === 'F' ? 'Feminino' : 'Não informado'}`);
    if (context.child.special_needs) {
      parts.push(`NECESSIDADES ESPECIAIS: ${context.child.special_needs}`);
    }
    if (context.child.milestones && context.child.milestones.length > 0) {
      const achieved = context.child.milestones.filter(m => m.status === 'achieved').slice(0, 3);
      const delayed = context.child.milestones.filter(m => m.status === 'delayed').slice(0, 3);
      if (achieved.length > 0) {
        parts.push(`MARCOS ATINGIDOS: ${achieved.map(m => m.milestone_name || m.domain).join(', ')}`);
      }
      if (delayed.length > 0) {
        parts.push(`ÁREAS DE ATENÇÃO: ${delayed.map(m => m.milestone_name || m.domain).join(', ')}`);
      }
    }
  }

  if (context.state) {
    parts.push(`CONTEXTO ATIVO: ${context.state.active_context === 'child' ? 'Bebê' : context.state.active_context === 'mother' ? 'Saúde Materna' : 'Não definido'}`);
    if (context.state.journey_week) {
      parts.push(`SEMANA DA JORNADA: ${context.state.journey_week}`);
    }
  }

  if (context.memory && context.memory.count > 0) {
    parts.push(`HISTÓRICO RECENTE (${context.memory.count} interações):`);
    context.memory.recent.forEach(m => {
      const role = m.role === 'user_message' ? 'Usuário' : 'Assistente';
      const preview = m.content.substring(0, 100);
      parts.push(`  [${role}] ${preview}${m.content.length > 100 ? '...' : ''}`);
    });
  }

  return parts.join('\n');
}

module.exports = {
  getFullContext,
  getRecentMemory,
  getUserProfile,
  getChildData,
  getFeedbackStats,
  formatContextForPrompt
};
