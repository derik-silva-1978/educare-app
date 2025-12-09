/**
 * RAG Metrics Service
 * Coleta e analisa métricas de desempenho do RAG
 */

const metricsStorage = {
  queries: [],
  aggregated: {
    total_queries: 0,
    avg_response_time_ms: 0,
    knowledge_base_usage: {
      kb_baby: 0,
      kb_mother: 0,
      kb_professional: 0,
      knowledge_documents: 0
    },
    fallback_count: 0,
    error_count: 0,
    file_search_success_rate: 0,
    last_updated: null
  }
};

const MAX_STORED_QUERIES = 1000;

/**
 * Registra uma query no RAG
 */
function recordQuery(data) {
  try {
    const record = {
      timestamp: new Date().toISOString(),
      question: data.question ? data.question.substring(0, 100) : 'N/A',
      module_type: data.module_type || 'unknown',
      success: data.success || false,
      response_time_ms: data.response_time_ms || 0,
      documents_found: data.documents_found || 0,
      knowledge_base: {
        primary_table: data.primary_table || 'unknown',
        used_table: data.used_table || 'unknown',
        fallback_used: data.fallback_used || false
      },
      file_search_used: data.file_search_used || false,
      chunks_retrieved: data.chunks_retrieved || 0,
      error: data.error || null
    };

    metricsStorage.queries.push(record);

    // Mantém apenas os últimos 1000 registros
    if (metricsStorage.queries.length > MAX_STORED_QUERIES) {
      metricsStorage.queries = metricsStorage.queries.slice(-MAX_STORED_QUERIES);
    }

    updateAggregates();

    console.log(`[RAGMetrics] Query registrada - módulo: ${record.module_type}, tempo: ${record.response_time_ms}ms, sucesso: ${record.success}`);

    return { success: true, record };
  } catch (error) {
    console.error('[RAGMetrics] Erro ao registrar query:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza agregações de métricas
 */
function updateAggregates() {
  const queries = metricsStorage.queries;
  
  if (queries.length === 0) {
    metricsStorage.aggregated.last_updated = new Date().toISOString();
    return;
  }

  // Total de queries
  metricsStorage.aggregated.total_queries = queries.length;

  // Tempo médio de resposta
  const totalTime = queries.reduce((sum, q) => sum + (q.response_time_ms || 0), 0);
  metricsStorage.aggregated.avg_response_time_ms = Math.round(totalTime / queries.length);

  // Uso de bases de conhecimento
  metricsStorage.aggregated.knowledge_base_usage = {
    kb_baby: queries.filter(q => q.knowledge_base.used_table === 'kb_baby').length,
    kb_mother: queries.filter(q => q.knowledge_base.used_table === 'kb_mother').length,
    kb_professional: queries.filter(q => q.knowledge_base.used_table === 'kb_professional').length,
    knowledge_documents: queries.filter(q => q.knowledge_base.used_table === 'knowledge_documents').length
  };

  // Contagem de fallbacks
  metricsStorage.aggregated.fallback_count = queries.filter(q => q.knowledge_base.fallback_used).length;

  // Contagem de erros
  metricsStorage.aggregated.error_count = queries.filter(q => !q.success).length;

  // Taxa de sucesso do File Search
  const fileSearchQueries = queries.filter(q => q.file_search_used);
  metricsStorage.aggregated.file_search_success_rate = fileSearchQueries.length > 0
    ? Math.round((fileSearchQueries.filter(q => q.chunks_retrieved > 0).length / fileSearchQueries.length) * 100)
    : 0;

  metricsStorage.aggregated.last_updated = new Date().toISOString();
}

/**
 * Retorna agregações atuais
 */
function getAggregates() {
  return {
    success: true,
    data: metricsStorage.aggregated,
    recorded_queries_sample: metricsStorage.queries.slice(-10).reverse()
  };
}

/**
 * Retorna últimas N queries
 */
function getRecentQueries(limit = 20) {
  return {
    success: true,
    count: metricsStorage.queries.length,
    recent: metricsStorage.queries.slice(-limit).reverse()
  };
}

/**
 * Retorna estatísticas por módulo
 */
function getModuleStats() {
  const queries = metricsStorage.queries;
  
  const modules = {
    baby: queries.filter(q => q.module_type === 'baby'),
    mother: queries.filter(q => q.module_type === 'mother'),
    professional: queries.filter(q => q.module_type === 'professional'),
    unknown: queries.filter(q => q.module_type === 'unknown')
  };

  const stats = {};

  Object.entries(modules).forEach(([module, queries]) => {
    if (queries.length === 0) {
      stats[module] = {
        count: 0,
        avg_response_time_ms: 0,
        success_rate: 0,
        error_count: 0
      };
      return;
    }

    const avgTime = Math.round(queries.reduce((sum, q) => sum + (q.response_time_ms || 0), 0) / queries.length);
    const successCount = queries.filter(q => q.success).length;
    const successRate = Math.round((successCount / queries.length) * 100);
    const errorCount = queries.filter(q => !q.success).length;

    stats[module] = {
      count: queries.length,
      avg_response_time_ms: avgTime,
      success_rate: successRate,
      error_count: errorCount
    };
  });

  return {
    success: true,
    data: stats
  };
}

/**
 * Retorna estatísticas de bases de conhecimento
 */
function getKnowledgeBaseStats() {
  const queries = metricsStorage.queries;
  
  const stats = {
    kb_baby: {
      primary_count: queries.filter(q => q.knowledge_base.primary_table === 'kb_baby').length,
      used_count: queries.filter(q => q.knowledge_base.used_table === 'kb_baby').length,
      avg_documents_found: 0,
      avg_chunks_retrieved: 0
    },
    kb_mother: {
      primary_count: queries.filter(q => q.knowledge_base.primary_table === 'kb_mother').length,
      used_count: queries.filter(q => q.knowledge_base.used_table === 'kb_mother').length,
      avg_documents_found: 0,
      avg_chunks_retrieved: 0
    },
    kb_professional: {
      primary_count: queries.filter(q => q.knowledge_base.primary_table === 'kb_professional').length,
      used_count: queries.filter(q => q.knowledge_base.used_table === 'kb_professional').length,
      avg_documents_found: 0,
      avg_chunks_retrieved: 0
    },
    knowledge_documents: {
      primary_count: queries.filter(q => q.knowledge_base.primary_table === 'knowledge_documents').length,
      used_count: queries.filter(q => q.knowledge_base.used_table === 'knowledge_documents').length,
      avg_documents_found: 0,
      avg_chunks_retrieved: 0
    }
  };

  // Calcula médias
  Object.entries(stats).forEach(([table, stat]) => {
    const queriesForTable = queries.filter(q => q.knowledge_base.used_table === table);
    if (queriesForTable.length > 0) {
      stat.avg_documents_found = Math.round(
        queriesForTable.reduce((sum, q) => sum + (q.documents_found || 0), 0) / queriesForTable.length
      );
      stat.avg_chunks_retrieved = Math.round(
        queriesForTable.reduce((sum, q) => sum + (q.chunks_retrieved || 0), 0) / queriesForTable.length
      );
    }
  });

  return {
    success: true,
    data: stats
  };
}

/**
 * Retorna health check do RAG
 */
function getHealthCheck() {
  const queries = metricsStorage.queries;
  const recentQueries = queries.slice(-100);

  const successCount = recentQueries.filter(q => q.success).length;
  const successRate = recentQueries.length > 0 ? Math.round((successCount / recentQueries.length) * 100) : 0;

  const avgTime = recentQueries.length > 0
    ? Math.round(recentQueries.reduce((sum, q) => sum + (q.response_time_ms || 0), 0) / recentQueries.length)
    : 0;

  const fallbackRate = recentQueries.length > 0
    ? Math.round((recentQueries.filter(q => q.knowledge_base.fallback_used).length / recentQueries.length) * 100)
    : 0;

  // Determina status geral
  let status = 'healthy';
  if (successRate < 80) status = 'degraded';
  if (successRate < 50) status = 'unhealthy';
  if (recentQueries.length === 0) status = 'no-data';

  return {
    success: true,
    status,
    metrics: {
      success_rate_percent: successRate,
      avg_response_time_ms: avgTime,
      fallback_rate_percent: fallbackRate,
      recent_queries_analyzed: recentQueries.length,
      total_queries_recorded: metricsStorage.queries.length
    }
  };
}

/**
 * Limpa métricas (para testes)
 */
function reset() {
  metricsStorage.queries = [];
  metricsStorage.aggregated = {
    total_queries: 0,
    avg_response_time_ms: 0,
    knowledge_base_usage: {
      kb_baby: 0,
      kb_mother: 0,
      kb_professional: 0,
      knowledge_documents: 0
    },
    fallback_count: 0,
    error_count: 0,
    file_search_success_rate: 0,
    last_updated: null
  };
  console.log('[RAGMetrics] Métricas resetadas');
  return { success: true };
}

module.exports = {
  recordQuery,
  getAggregates,
  getRecentQueries,
  getModuleStats,
  getKnowledgeBaseStats,
  getHealthCheck,
  reset
};
