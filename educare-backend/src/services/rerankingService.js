/**
 * Reranking Service
 * FASE 10-UPGRADE: Camada de Re-ranking Neural
 * 
 * Responsabilidades:
 * - Ordenação semântica pós-busca
 * - Scoring de relevância contextual
 * - Filtros de duplicidade
 * - Diversificação de resultados
 */

const OpenAI = require('openai');

const openai = new OpenAI();

const RERANKING_ENABLED = process.env.RERANKING_ENABLED !== 'false';
const RERANKING_MODEL = process.env.RERANKING_MODEL || 'gpt-4o-mini';
const MAX_CANDIDATES = parseInt(process.env.RERANKING_MAX_CANDIDATES || '20');
const TOP_K = parseInt(process.env.RERANKING_TOP_K || '5');

/**
 * Calcula score de relevância usando LLM
 */
async function calculateRelevanceScore(query, document, context = {}) {
  try {
    const prompt = `Avalie a relevância do documento abaixo para responder à pergunta do usuário.

PERGUNTA: ${query}

DOCUMENTO:
${document.content || document.text || JSON.stringify(document)}

Considere:
1. Relevância direta para a pergunta
2. Precisão da informação
3. Completude da resposta potencial
4. Adequação ao contexto (${context.module || 'geral'})

Responda APENAS com um JSON:
{"score": 0.XX, "reason": "explicação breve"}

O score deve ser entre 0.0 (irrelevante) e 1.0 (altamente relevante).`;

    const response = await openai.chat.completions.create({
      model: RERANKING_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0
    });

    const result = JSON.parse(response.choices[0].message.content.trim());
    return {
      score: Math.max(0, Math.min(1, result.score || 0)),
      reason: result.reason || ''
    };
  } catch (error) {
    console.error('[Reranking] Erro ao calcular score:', error);
    return { score: 0.5, reason: 'Erro no cálculo' };
  }
}

/**
 * Agrupa documentos similares para diversificação
 */
function groupSimilarDocuments(documents) {
  const groups = [];
  const used = new Set();

  for (const doc of documents) {
    if (used.has(doc.id)) continue;

    const group = [doc];
    used.add(doc.id);

    for (const other of documents) {
      if (used.has(other.id)) continue;
      if (calculateTextSimilarity(doc.title || '', other.title || '') > 0.8) {
        group.push(other);
        used.add(other.id);
      }
    }

    groups.push(group);
  }

  return groups;
}

/**
 * Calcula similaridade textual simples (Jaccard)
 */
function calculateTextSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Seleciona documentos diversificados do topo
 */
function diversifyResults(rankedDocs, topK) {
  const groups = groupSimilarDocuments(rankedDocs);
  const result = [];
  let groupIndex = 0;

  while (result.length < topK && groupIndex < groups.length) {
    const group = groups[groupIndex];
    if (group.length > 0) {
      result.push(group[0]);
    }
    groupIndex++;
  }

  return result;
}

/**
 * Re-rankeia documentos usando LLM
 */
async function rerank(query, documents, options = {}) {
  if (!RERANKING_ENABLED) {
    console.log('[Reranking] Desativado via configuração');
    return {
      documents: documents.slice(0, options.topK || TOP_K),
      reranked: false,
      reason: 'disabled'
    };
  }

  if (!documents || documents.length === 0) {
    return {
      documents: [],
      reranked: false,
      reason: 'no_documents'
    };
  }

  console.log(`[Reranking] Processando ${documents.length} documentos para query: "${query.substring(0, 50)}..."`);

  const startTime = Date.now();
  const candidates = documents.slice(0, MAX_CANDIDATES);
  const module = options.module || 'geral';
  const topK = options.topK || TOP_K;

  try {
    const scoredDocs = await Promise.all(
      candidates.map(async (doc) => {
        const { score, reason } = await calculateRelevanceScore(query, doc, { module });
        return {
          ...doc,
          relevance_score: score,
          relevance_reason: reason,
          original_rank: documents.indexOf(doc)
        };
      })
    );

    scoredDocs.sort((a, b) => b.relevance_score - a.relevance_score);

    const diversified = options.diversify !== false 
      ? diversifyResults(scoredDocs, topK)
      : scoredDocs.slice(0, topK);

    const duration = Date.now() - startTime;

    console.log(`[Reranking] Concluído em ${duration}ms. Top score: ${diversified[0]?.relevance_score?.toFixed(2) || 'N/A'}`);

    return {
      documents: diversified,
      reranked: true,
      stats: {
        candidates_processed: candidates.length,
        top_k_returned: diversified.length,
        duration_ms: duration,
        avg_score: diversified.reduce((sum, d) => sum + (d.relevance_score || 0), 0) / diversified.length
      }
    };
  } catch (error) {
    console.error('[Reranking] Erro durante reranking:', error);
    return {
      documents: documents.slice(0, topK),
      reranked: false,
      reason: error.message
    };
  }
}

/**
 * Adiciona scores de confiança aos documentos
 */
function addConfidenceLevel(documents) {
  return documents.map(doc => {
    const score = doc.relevance_score || 0.5;
    let confidence;
    
    if (score >= 0.8) {
      confidence = 'high';
    } else if (score >= 0.5) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    return {
      ...doc,
      confidence_level: confidence
    };
  });
}

/**
 * Filtra documentos com baixa confiança
 */
function filterLowConfidence(documents, minConfidence = 'low') {
  const levels = { high: 3, medium: 2, low: 1 };
  const minLevel = levels[minConfidence] || 1;

  return documents.filter(doc => {
    const docLevel = levels[doc.confidence_level] || 1;
    return docLevel >= minLevel;
  });
}

module.exports = {
  rerank,
  calculateRelevanceScore,
  addConfidenceLevel,
  filterLowConfidence,
  calculateTextSimilarity,
  diversifyResults
};
