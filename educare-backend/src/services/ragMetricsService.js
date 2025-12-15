/**
 * RAG Metrics Service
 * FASE 06 + FASE 08: Coleta e analisa métricas de desempenho do RAG
 * Inclui telemetria avançada para critérios de desligamento
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
  },
  // FASE 08: Telemetria avançada por módulo
  moduleStats: {
    baby: { queries: 0, empty_results: 0, avg_score: 0, total_score: 0, strict_mode_queries: 0 },
    mother: { queries: 0, empty_results: 0, avg_score: 0, total_score: 0, strict_mode_queries: 0 },
    professional: { queries: 0, empty_results: 0, avg_score: 0, total_score: 0, strict_mode_queries: 0 }
  },
  // Métricas de ingestão de documentos
  ingestions: [],
  ingestionStats: {
    total_uploads: 0,
    successful_uploads: 0,
    failed_uploads: 0,
    total_chunks_indexed: 0,
    providers_used: {
      gemini: 0,
      qdrant: 0,
      openai: 0
    },
    last_upload: null
  }
};

const MAX_STORED_QUERIES = 1000;

/**
 * Registra uma query no RAG
 * FASE 08: Adiciona suporte a strict_mode e scores
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
        fallback_used: data.fallback_used || false,
        strict_mode: data.strict_mode || false
      },
      file_search_used: data.file_search_used || false,
      chunks_retrieved: data.chunks_retrieved || 0,
      relevance_score: data.relevance_score || null,
      confidence_level: data.confidence_level || null,
      error: data.error || null,
      empty_result: data.documents_found === 0 && data.success
    };

    metricsStorage.queries.push(record);

    // Mantém apenas os últimos 1000 registros
    if (metricsStorage.queries.length > MAX_STORED_QUERIES) {
      metricsStorage.queries = metricsStorage.queries.slice(-MAX_STORED_QUERIES);
    }

    // FASE 08: Atualiza stats por módulo
    updateModuleStats(record);
    updateAggregates();

    console.log(`[RAGMetrics] Query registrada - módulo: ${record.module_type}, tempo: ${record.response_time_ms}ms, sucesso: ${record.success}, strict: ${record.knowledge_base.strict_mode}`);

    return { success: true, record };
  } catch (error) {
    console.error('[RAGMetrics] Erro ao registrar query:', error);
    return { success: false, error: error.message };
  }
}

/**
 * FASE 08: Atualiza estatísticas específicas por módulo
 */
function updateModuleStats(record) {
  const module = record.module_type;
  if (!metricsStorage.moduleStats[module]) {
    metricsStorage.moduleStats[module] = {
      queries: 0,
      empty_results: 0,
      avg_score: 0,
      total_score: 0,
      strict_mode_queries: 0
    };
  }

  const stats = metricsStorage.moduleStats[module];
  stats.queries++;

  if (record.empty_result) {
    stats.empty_results++;
  }

  if (record.knowledge_base.strict_mode) {
    stats.strict_mode_queries++;
  }

  if (record.relevance_score !== null) {
    stats.total_score += record.relevance_score;
    stats.avg_score = stats.total_score / stats.queries;
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
        error_count: 0,
        empty_result_count: 0,
        empty_result_rate: 0,
        strict_mode_count: 0,
        fallback_count: 0
      };
      return;
    }

    const avgTime = Math.round(queries.reduce((sum, q) => sum + (q.response_time_ms || 0), 0) / queries.length);
    const successCount = queries.filter(q => q.success).length;
    const successRate = Math.round((successCount / queries.length) * 100);
    const errorCount = queries.filter(q => !q.success).length;
    const emptyResultCount = queries.filter(q => q.empty_result).length;
    const emptyResultRate = Math.round((emptyResultCount / queries.length) * 100);
    const strictModeCount = queries.filter(q => q.knowledge_base.strict_mode).length;
    const fallbackCount = queries.filter(q => q.knowledge_base.fallback_used).length;

    stats[module] = {
      count: queries.length,
      avg_response_time_ms: avgTime,
      success_rate: successRate,
      error_count: errorCount,
      empty_result_count: emptyResultCount,
      empty_result_rate: emptyResultRate,
      strict_mode_count: strictModeCount,
      fallback_count: fallbackCount
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
      avg_chunks_retrieved: 0,
      strict_mode_count: queries.filter(q => q.knowledge_base.primary_table === 'kb_baby' && q.knowledge_base.strict_mode).length
    },
    kb_mother: {
      primary_count: queries.filter(q => q.knowledge_base.primary_table === 'kb_mother').length,
      used_count: queries.filter(q => q.knowledge_base.used_table === 'kb_mother').length,
      avg_documents_found: 0,
      avg_chunks_retrieved: 0,
      strict_mode_count: queries.filter(q => q.knowledge_base.primary_table === 'kb_mother' && q.knowledge_base.strict_mode).length
    },
    kb_professional: {
      primary_count: queries.filter(q => q.knowledge_base.primary_table === 'kb_professional').length,
      used_count: queries.filter(q => q.knowledge_base.used_table === 'kb_professional').length,
      avg_documents_found: 0,
      avg_chunks_retrieved: 0,
      strict_mode_count: queries.filter(q => q.knowledge_base.primary_table === 'kb_professional' && q.knowledge_base.strict_mode).length
    },
    knowledge_documents: {
      primary_count: queries.filter(q => q.knowledge_base.primary_table === 'knowledge_documents').length,
      used_count: queries.filter(q => q.knowledge_base.used_table === 'knowledge_documents').length,
      avg_documents_found: 0,
      avg_chunks_retrieved: 0,
      strict_mode_count: 0
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

  const emptyResultRate = recentQueries.length > 0
    ? Math.round((recentQueries.filter(q => q.empty_result).length / recentQueries.length) * 100)
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
      empty_result_rate_percent: emptyResultRate,
      recent_queries_analyzed: recentQueries.length,
      total_queries_recorded: metricsStorage.queries.length
    }
  };
}

/**
 * FASE 08: Diagnóstico de prontidão para desligamento do legacy
 * Verifica se um módulo está pronto para operar sem fallback
 */
function getShutdownReadiness(moduleType = null) {
  const queries = metricsStorage.queries;
  const modules = moduleType ? [moduleType] : ['baby', 'mother', 'professional'];
  const results = {};

  const THRESHOLDS = {
    min_queries: 50,           // Mínimo de queries para avaliar
    min_success_rate: 80,      // Taxa de sucesso mínima (%)
    max_empty_rate: 5,         // Taxa máxima de resultados vazios (%)
    min_avg_score: 0.75,       // Score médio mínimo de relevância
    max_fallback_rate: 10      // Taxa máxima de uso de fallback (%)
  };

  modules.forEach(module => {
    const moduleQueries = queries.filter(q => q.module_type === module);
    const count = moduleQueries.length;

    if (count < THRESHOLDS.min_queries) {
      results[module] = {
        ready: false,
        reason: `Dados insuficientes (${count}/${THRESHOLDS.min_queries} queries)`,
        metrics: { query_count: count },
        recommendation: 'Aguarde mais uso antes de desligar fallback'
      };
      return;
    }

    const successCount = moduleQueries.filter(q => q.success).length;
    const successRate = Math.round((successCount / count) * 100);

    const emptyCount = moduleQueries.filter(q => q.empty_result).length;
    const emptyRate = Math.round((emptyCount / count) * 100);

    const fallbackCount = moduleQueries.filter(q => q.knowledge_base.fallback_used).length;
    const fallbackRate = Math.round((fallbackCount / count) * 100);

    const scoresAvailable = moduleQueries.filter(q => q.relevance_score !== null);
    const avgScore = scoresAvailable.length > 0
      ? scoresAvailable.reduce((sum, q) => sum + q.relevance_score, 0) / scoresAvailable.length
      : null;

    const issues = [];

    if (successRate < THRESHOLDS.min_success_rate) {
      issues.push(`Taxa de sucesso baixa: ${successRate}% (mín: ${THRESHOLDS.min_success_rate}%)`);
    }

    if (emptyRate > THRESHOLDS.max_empty_rate) {
      issues.push(`Taxa de resultados vazios alta: ${emptyRate}% (máx: ${THRESHOLDS.max_empty_rate}%)`);
    }

    if (fallbackRate > THRESHOLDS.max_fallback_rate) {
      issues.push(`Taxa de fallback alta: ${fallbackRate}% (máx: ${THRESHOLDS.max_fallback_rate}%)`);
    }

    if (avgScore !== null && avgScore < THRESHOLDS.min_avg_score) {
      issues.push(`Score médio baixo: ${avgScore.toFixed(2)} (mín: ${THRESHOLDS.min_avg_score})`);
    }

    const ready = issues.length === 0;

    results[module] = {
      ready,
      reason: ready ? 'Módulo pronto para operar sem fallback' : issues.join('; '),
      metrics: {
        query_count: count,
        success_rate: successRate,
        empty_rate: emptyRate,
        fallback_rate: fallbackRate,
        avg_relevance_score: avgScore ? avgScore.toFixed(2) : 'N/A'
      },
      thresholds: THRESHOLDS,
      recommendation: ready
        ? `Pode definir USE_LEGACY_FALLBACK_FOR_${module.toUpperCase()}=false`
        : 'Aguarde melhoria nas métricas ou adicione mais conteúdo à KB'
    };
  });

  return {
    success: true,
    data: results,
    summary: {
      modules_ready: Object.values(results).filter(r => r.ready).length,
      modules_total: modules.length,
      all_ready: Object.values(results).every(r => r.ready)
    }
  };
}

const MAX_STORED_INGESTIONS = 100;

/**
 * Registra uma ingestão de documento no RAG
 */
function recordIngestion(data) {
  try {
    const record = {
      timestamp: new Date().toISOString(),
      filename: data.filename || 'unknown',
      title: data.title || data.filename,
      knowledge_category: data.knowledge_category || 'general',
      success: data.success || false,
      ingestion_time_ms: data.ingestion_time_ms || 0,
      chunks_indexed: data.chunks_indexed || 0,
      providers_used: data.providers || [],
      file_size: data.file_size || 0,
      error: data.error || null
    };

    metricsStorage.ingestions.push(record);

    if (metricsStorage.ingestions.length > MAX_STORED_INGESTIONS) {
      metricsStorage.ingestions = metricsStorage.ingestions.slice(-MAX_STORED_INGESTIONS);
    }

    const stats = metricsStorage.ingestionStats;
    stats.total_uploads++;
    if (record.success) {
      stats.successful_uploads++;
      stats.total_chunks_indexed += record.chunks_indexed;
    } else {
      stats.failed_uploads++;
    }
    
    record.providers_used.forEach(p => {
      if (stats.providers_used[p] !== undefined) {
        stats.providers_used[p]++;
      }
    });
    
    stats.last_upload = record.timestamp;

    console.log(`[RAGMetrics] Ingestão registrada: ${record.filename}, sucesso: ${record.success}, chunks: ${record.chunks_indexed}`);
    return { success: true, record };
  } catch (error) {
    console.error('[RAGMetrics] Erro ao registrar ingestão:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retorna estatísticas de ingestão
 */
function getIngestionStats() {
  return {
    success: true,
    data: metricsStorage.ingestionStats,
    recent_ingestions: metricsStorage.ingestions.slice(-10).reverse()
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
  metricsStorage.moduleStats = {
    baby: { queries: 0, empty_results: 0, avg_score: 0, total_score: 0, strict_mode_queries: 0 },
    mother: { queries: 0, empty_results: 0, avg_score: 0, total_score: 0, strict_mode_queries: 0 },
    professional: { queries: 0, empty_results: 0, avg_score: 0, total_score: 0, strict_mode_queries: 0 }
  };
  metricsStorage.ingestions = [];
  metricsStorage.ingestionStats = {
    total_uploads: 0,
    successful_uploads: 0,
    failed_uploads: 0,
    total_chunks_indexed: 0,
    providers_used: { gemini: 0, qdrant: 0, openai: 0 },
    last_upload: null
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
  getShutdownReadiness,
  recordIngestion,
  getIngestionStats,
  reset
};
