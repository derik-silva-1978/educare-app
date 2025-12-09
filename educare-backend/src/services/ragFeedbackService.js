/**
 * RAG Feedback Service
 * FASE 11-UPGRADE: Sistema de Feedback e Auto-Melhoramento
 * 
 * Responsabilidades:
 * - Coletar feedback de respostas
 * - Rastrear eventos do RAG
 * - Analisar qualidade
 * - Gerar sugestões de melhoria
 */

const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');

const openai = new OpenAI();

const FEEDBACK_ENABLED = process.env.RAG_FEEDBACK_ENABLED !== 'false';
const AUTO_ANALYSIS_ENABLED = process.env.RAG_AUTO_ANALYSIS === 'true';
const IMPROVEMENT_MODEL = process.env.RAG_IMPROVEMENT_MODEL || 'gpt-4o-mini';

const feedbackStore = [];
const eventStore = [];
const analysisResults = [];
const improvementSuggestions = [];

const MAX_STORE_SIZE = parseInt(process.env.RAG_STORE_MAX_SIZE || '10000');

/**
 * Registra evento do RAG
 */
function logEvent(eventType, data = {}) {
  if (!FEEDBACK_ENABLED) return null;

  const event = {
    id: uuidv4(),
    type: eventType,
    timestamp: new Date().toISOString(),
    data,
    session_id: data.session_id || null,
    user_id: data.user_id || null,
    query: data.query || null,
    module: data.module || null
  };

  eventStore.push(event);

  if (eventStore.length > MAX_STORE_SIZE) {
    eventStore.shift();
  }

  return event;
}

/**
 * Registra feedback do usuário
 */
function submitFeedback(params) {
  if (!FEEDBACK_ENABLED) {
    return { success: false, reason: 'disabled' };
  }

  const {
    response_id,
    query,
    rating,
    feedback_type,
    comment,
    user_id,
    module
  } = params;

  const feedback = {
    id: uuidv4(),
    response_id,
    query,
    rating,
    feedback_type,
    comment,
    user_id,
    module,
    created_at: new Date().toISOString(),
    processed: false
  };

  feedbackStore.push(feedback);

  if (feedbackStore.length > MAX_STORE_SIZE) {
    feedbackStore.shift();
  }

  logEvent('feedback_submitted', { feedback_id: feedback.id, rating, feedback_type });

  console.log(`[RAGFeedback] Feedback registrado: ${feedback_type} (rating: ${rating})`);

  return { success: true, feedback_id: feedback.id };
}

/**
 * Obtém estatísticas de feedback
 */
function getFeedbackStats(options = {}) {
  const { module, days = 30 } = options;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  let filtered = feedbackStore.filter(f => f.created_at >= cutoff);
  
  if (module) {
    filtered = filtered.filter(f => f.module === module);
  }

  const ratings = filtered.map(f => f.rating).filter(r => r !== null && r !== undefined);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  const byType = {};
  filtered.forEach(f => {
    byType[f.feedback_type] = (byType[f.feedback_type] || 0) + 1;
  });

  return {
    total_feedback: filtered.length,
    avg_rating: avgRating ? parseFloat(avgRating.toFixed(2)) : null,
    by_type: byType,
    period_days: days,
    module_filter: module || 'all'
  };
}

/**
 * Obtém estatísticas de eventos
 */
function getEventStats(options = {}) {
  const { days = 7 } = options;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const filtered = eventStore.filter(e => e.timestamp >= cutoff);

  const byType = {};
  filtered.forEach(e => {
    byType[e.type] = (byType[e.type] || 0) + 1;
  });

  const byModule = {};
  filtered.filter(e => e.module).forEach(e => {
    byModule[e.module] = (byModule[e.module] || 0) + 1;
  });

  return {
    total_events: filtered.length,
    by_type: byType,
    by_module: byModule,
    period_days: days
  };
}

/**
 * Analisa qualidade do RAG baseado em feedback
 */
async function analyzeQuality(options = {}) {
  const feedbackStats = getFeedbackStats(options);
  const eventStats = getEventStats(options);

  const analysis = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    metrics: {
      feedback: feedbackStats,
      events: eventStats
    },
    health: 'unknown',
    issues: [],
    recommendations: []
  };

  if (feedbackStats.avg_rating !== null) {
    if (feedbackStats.avg_rating >= 4.0) {
      analysis.health = 'healthy';
    } else if (feedbackStats.avg_rating >= 3.0) {
      analysis.health = 'moderate';
    } else {
      analysis.health = 'needs_attention';
      analysis.issues.push('Rating médio abaixo de 3.0');
    }
  }

  const negativeCount = feedbackStats.by_type?.negative || 0;
  const totalFeedback = feedbackStats.total_feedback || 1;
  
  if (negativeCount / totalFeedback > 0.3) {
    analysis.issues.push('Mais de 30% de feedback negativo');
    analysis.recommendations.push('Revisar consultas com rating baixo');
  }

  if (eventStats.by_type?.fallback_used > eventStats.total_events * 0.2) {
    analysis.issues.push('Alto uso de fallback (>20%)');
    analysis.recommendations.push('Expandir bases segmentadas com mais conteúdo');
  }

  analysisResults.push(analysis);

  return analysis;
}

/**
 * Gera sugestões de melhoria usando LLM
 */
async function generateImprovementSuggestions(options = {}) {
  if (!AUTO_ANALYSIS_ENABLED) {
    return { generated: false, reason: 'disabled' };
  }

  try {
    const recentFeedback = feedbackStore.slice(-50);
    const negativeFeedback = recentFeedback.filter(f => f.rating && f.rating < 3);

    if (negativeFeedback.length === 0) {
      return { 
        generated: false, 
        reason: 'no_negative_feedback',
        message: 'Não há feedback negativo recente para analisar'
      };
    }

    const feedbackSummary = negativeFeedback.map(f => ({
      query: f.query,
      rating: f.rating,
      type: f.feedback_type,
      comment: f.comment
    }));

    const prompt = `Analise o feedback negativo do sistema RAG de assistência infantil e materna.

FEEDBACK NEGATIVO RECENTE:
${JSON.stringify(feedbackSummary, null, 2)}

Identifique:
1. Padrões de problemas
2. Lacunas de conhecimento
3. Áreas para melhoria

Responda com JSON:
{
  "patterns": ["padrão 1", "padrão 2"],
  "knowledge_gaps": ["gap 1", "gap 2"],
  "suggestions": [
    {"priority": "high|medium|low", "action": "ação sugerida", "rationale": "justificativa"}
  ]
}`;

    const response = await openai.chat.completions.create({
      model: IMPROVEMENT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.3
    });

    const suggestions = JSON.parse(response.choices[0].message.content.trim());

    const result = {
      id: uuidv4(),
      generated_at: new Date().toISOString(),
      based_on_feedback_count: negativeFeedback.length,
      ...suggestions
    };

    improvementSuggestions.push(result);

    console.log(`[RAGFeedback] ${suggestions.suggestions.length} sugestões de melhoria geradas`);

    return {
      generated: true,
      result
    };
  } catch (error) {
    console.error('[RAGFeedback] Erro ao gerar sugestões:', error);
    return {
      generated: false,
      error: error.message
    };
  }
}

/**
 * Obtém sugestões de melhoria pendentes
 */
function getPendingSuggestions(limit = 10) {
  return improvementSuggestions.slice(-limit).reverse();
}

/**
 * Marca sugestão como implementada
 */
function markSuggestionImplemented(suggestionId, implementedBy) {
  const suggestion = improvementSuggestions.find(s => s.id === suggestionId);
  if (!suggestion) {
    return { success: false, error: 'Sugestão não encontrada' };
  }

  suggestion.implemented = true;
  suggestion.implemented_at = new Date().toISOString();
  suggestion.implemented_by = implementedBy;

  return { success: true };
}

/**
 * Obtém dashboard de maturidade do RAG
 */
async function getMaturityDashboard() {
  const feedbackStats = getFeedbackStats({ days: 30 });
  const eventStats = getEventStats({ days: 7 });
  const recentAnalysis = analysisResults.slice(-1)[0];
  const pendingSuggestions = getPendingSuggestions(5);

  const maturityScore = calculateMaturityScore({
    feedbackStats,
    eventStats,
    recentAnalysis
  });

  return {
    timestamp: new Date().toISOString(),
    maturity: {
      score: maturityScore.score,
      level: maturityScore.level,
      factors: maturityScore.factors
    },
    feedback_summary: {
      total_last_30_days: feedbackStats.total_feedback,
      avg_rating: feedbackStats.avg_rating,
      by_type: feedbackStats.by_type
    },
    event_summary: {
      total_last_7_days: eventStats.total_events,
      by_type: eventStats.by_type
    },
    health: recentAnalysis?.health || 'unknown',
    pending_improvements: pendingSuggestions.length,
    top_suggestions: pendingSuggestions.slice(0, 3).map(s => ({
      priority: s.suggestions?.[0]?.priority,
      action: s.suggestions?.[0]?.action
    }))
  };
}

/**
 * Calcula score de maturidade do RAG
 */
function calculateMaturityScore(data) {
  let score = 50;
  const factors = [];

  const { feedbackStats, eventStats } = data;

  if (feedbackStats.avg_rating !== null) {
    const ratingContribution = (feedbackStats.avg_rating / 5) * 20;
    score += ratingContribution;
    factors.push({ name: 'avg_rating', value: feedbackStats.avg_rating, contribution: ratingContribution });
  }

  if (feedbackStats.total_feedback > 100) {
    score += 10;
    factors.push({ name: 'feedback_volume', value: feedbackStats.total_feedback, contribution: 10 });
  } else if (feedbackStats.total_feedback > 50) {
    score += 5;
    factors.push({ name: 'feedback_volume', value: feedbackStats.total_feedback, contribution: 5 });
  }

  const fallbackRate = eventStats.by_type?.fallback_used / Math.max(eventStats.total_events, 1);
  if (fallbackRate < 0.1) {
    score += 10;
    factors.push({ name: 'low_fallback', value: fallbackRate, contribution: 10 });
  } else if (fallbackRate > 0.3) {
    score -= 10;
    factors.push({ name: 'high_fallback', value: fallbackRate, contribution: -10 });
  }

  score = Math.max(0, Math.min(100, score));

  let level;
  if (score >= 80) level = 'mature';
  else if (score >= 60) level = 'developing';
  else if (score >= 40) level = 'basic';
  else level = 'initial';

  return { score: Math.round(score), level, factors };
}

/**
 * Exporta dados para análise externa
 */
function exportData(type = 'all', options = {}) {
  const data = {};

  if (type === 'all' || type === 'feedback') {
    data.feedback = feedbackStore.slice(-(options.limit || 1000));
  }

  if (type === 'all' || type === 'events') {
    data.events = eventStore.slice(-(options.limit || 1000));
  }

  if (type === 'all' || type === 'analysis') {
    data.analysis = analysisResults.slice(-(options.limit || 50));
  }

  if (type === 'all' || type === 'suggestions') {
    data.suggestions = improvementSuggestions.slice(-(options.limit || 50));
  }

  return {
    exported_at: new Date().toISOString(),
    data
  };
}

module.exports = {
  logEvent,
  submitFeedback,
  getFeedbackStats,
  getEventStats,
  analyzeQuality,
  generateImprovementSuggestions,
  getPendingSuggestions,
  markSuggestionImplemented,
  getMaturityDashboard,
  calculateMaturityScore,
  exportData
};
