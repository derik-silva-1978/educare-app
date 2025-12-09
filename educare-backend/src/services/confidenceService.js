/**
 * Confidence Service
 * FASE 10-UPGRADE: Camada de Scoring de Confiança
 * 
 * Responsabilidades:
 * - Calcular nível de confiança das respostas
 * - Detectar incerteza ou falta de cobertura
 * - Sinalizar quando escalação humana é necessária
 * - Fornecer explicabilidade da confiança
 */

const CONFIDENCE_THRESHOLDS = {
  high: parseFloat(process.env.CONFIDENCE_HIGH_THRESHOLD || '0.80'),
  medium: parseFloat(process.env.CONFIDENCE_MEDIUM_THRESHOLD || '0.50'),
  low: parseFloat(process.env.CONFIDENCE_LOW_THRESHOLD || '0.25')
};

const MIN_DOCUMENTS_FOR_HIGH = parseInt(process.env.MIN_DOCS_HIGH_CONFIDENCE || '2');
const REQUIRE_HUMAN_BELOW = parseFloat(process.env.REQUIRE_HUMAN_BELOW || '0.30');

/**
 * Calcula score de confiança baseado em múltiplos fatores
 */
function calculateConfidenceScore(params) {
  const {
    documents = [],
    query = '',
    responseText = '',
    responseTime = 0,
    usedFallback = false,
    moduleMatch = true
  } = params;

  let score = 0.5;
  const factors = [];

  const docCount = documents.length;
  if (docCount >= 5) {
    score += 0.15;
    factors.push({ factor: 'doc_count', value: docCount, impact: '+0.15' });
  } else if (docCount >= 3) {
    score += 0.10;
    factors.push({ factor: 'doc_count', value: docCount, impact: '+0.10' });
  } else if (docCount === 0) {
    score -= 0.30;
    factors.push({ factor: 'no_docs', impact: '-0.30' });
  }

  if (documents.length > 0) {
    const avgRelevance = documents.reduce((sum, d) => sum + (d.relevance_score || 0.5), 0) / documents.length;
    if (avgRelevance >= 0.8) {
      score += 0.15;
      factors.push({ factor: 'high_relevance', value: avgRelevance.toFixed(2), impact: '+0.15' });
    } else if (avgRelevance >= 0.6) {
      score += 0.08;
      factors.push({ factor: 'medium_relevance', value: avgRelevance.toFixed(2), impact: '+0.08' });
    } else if (avgRelevance < 0.4) {
      score -= 0.10;
      factors.push({ factor: 'low_relevance', value: avgRelevance.toFixed(2), impact: '-0.10' });
    }
  }

  if (usedFallback) {
    score -= 0.15;
    factors.push({ factor: 'used_fallback', impact: '-0.15' });
  }

  if (!moduleMatch) {
    score -= 0.10;
    factors.push({ factor: 'module_mismatch', impact: '-0.10' });
  }

  if (responseTime > 5000) {
    score -= 0.05;
    factors.push({ factor: 'slow_response', value: `${responseTime}ms`, impact: '-0.05' });
  }

  if (responseText) {
    const uncertainPhrases = ['não tenho certeza', 'talvez', 'possivelmente', 'não encontrei'];
    const hasUncertainty = uncertainPhrases.some(phrase => responseText.toLowerCase().includes(phrase));
    if (hasUncertainty) {
      score -= 0.10;
      factors.push({ factor: 'uncertainty_phrases', impact: '-0.10' });
    }
  }

  const finalScore = Math.max(0, Math.min(1, score));

  return {
    score: finalScore,
    factors,
    calculated_at: new Date().toISOString()
  };
}

/**
 * Determina nível de confiança (high/medium/low)
 */
function getConfidenceLevel(score) {
  if (score >= CONFIDENCE_THRESHOLDS.high) return 'high';
  if (score >= CONFIDENCE_THRESHOLDS.medium) return 'medium';
  return 'low';
}

/**
 * Verifica se escalação humana é necessária
 */
function requiresHumanEscalation(score, context = {}) {
  if (score < REQUIRE_HUMAN_BELOW) return true;
  if (context.sensitiveContent) return true;
  if (context.healthRelated && score < 0.5) return true;
  if (context.userRequestedHuman) return true;
  return false;
}

/**
 * Gera explicação textual da confiança
 */
function explainConfidence(confidenceResult) {
  const { score, factors } = confidenceResult;
  const level = getConfidenceLevel(score);
  
  const explanations = {
    high: 'A resposta é baseada em múltiplas fontes relevantes e bem alinhadas com a pergunta.',
    medium: 'A resposta tem suporte moderado nos documentos disponíveis.',
    low: 'A resposta pode não estar totalmente coberta pela base de conhecimento.'
  };

  const positiveFactors = factors.filter(f => f.impact.startsWith('+'));
  const negativeFactors = factors.filter(f => f.impact.startsWith('-'));

  return {
    level,
    score: Math.round(score * 100) + '%',
    explanation: explanations[level],
    strengths: positiveFactors.map(f => f.factor),
    weaknesses: negativeFactors.map(f => f.factor)
  };
}

/**
 * Analisa confiança de uma resposta RAG completa
 */
function analyzeRAGResponse(params) {
  const confidenceResult = calculateConfidenceScore(params);
  const level = getConfidenceLevel(confidenceResult.score);
  const needsHuman = requiresHumanEscalation(confidenceResult.score, params.context || {});
  const explanation = explainConfidence(confidenceResult);

  return {
    score: confidenceResult.score,
    level,
    requires_human: needsHuman,
    explanation,
    factors: confidenceResult.factors,
    thresholds: CONFIDENCE_THRESHOLDS,
    recommendations: generateRecommendations(confidenceResult.score, confidenceResult.factors)
  };
}

/**
 * Gera recomendações baseadas na análise de confiança
 */
function generateRecommendations(score, factors) {
  const recommendations = [];

  if (score < 0.5) {
    recommendations.push({
      priority: 'high',
      action: 'expand_knowledge_base',
      description: 'Considere adicionar mais documentos sobre este tópico'
    });
  }

  const noDocsFactor = factors.find(f => f.factor === 'no_docs');
  if (noDocsFactor) {
    recommendations.push({
      priority: 'critical',
      action: 'add_coverage',
      description: 'Nenhum documento encontrado para esta consulta'
    });
  }

  const fallbackFactor = factors.find(f => f.factor === 'used_fallback');
  if (fallbackFactor) {
    recommendations.push({
      priority: 'medium',
      action: 'migrate_content',
      description: 'Migrar conteúdo relevante para base segmentada'
    });
  }

  return recommendations;
}

/**
 * Agregador de confiança para múltiplas respostas
 */
function aggregateConfidence(responses) {
  if (!responses || responses.length === 0) {
    return { avg_score: 0, min_score: 0, max_score: 0 };
  }

  const scores = responses.map(r => r.confidence?.score || 0.5);
  
  return {
    avg_score: scores.reduce((a, b) => a + b, 0) / scores.length,
    min_score: Math.min(...scores),
    max_score: Math.max(...scores),
    distribution: {
      high: responses.filter(r => getConfidenceLevel(r.confidence?.score || 0) === 'high').length,
      medium: responses.filter(r => getConfidenceLevel(r.confidence?.score || 0) === 'medium').length,
      low: responses.filter(r => getConfidenceLevel(r.confidence?.score || 0) === 'low').length
    }
  };
}

module.exports = {
  calculateConfidenceScore,
  getConfidenceLevel,
  requiresHumanEscalation,
  explainConfidence,
  analyzeRAGResponse,
  aggregateConfidence,
  generateRecommendations,
  CONFIDENCE_THRESHOLDS
};
