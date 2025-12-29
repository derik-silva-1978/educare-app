/**
 * RAG Service - Frontend Integration
 * Conecta os componentes TitiNauta ao backend RAG
 * FASE 10-11 Integration completa
 */

import httpClient, { ApiResponse } from './httpClient';

export interface RAGResponse {
  success: boolean;
  answer: string;
  response_id: string;
  metadata: {
    documents_found: number;
    documents_used: Array<{
      id: string;
      title: string;
      source_type: string;
      relevance_score?: number;
    }>;
    file_search_used: boolean;
    chunks_retrieved: number;
    model: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    processing_time_ms: number;
    confidence?: {
      level: 'high' | 'medium' | 'low';
      score: number;
      reason: string;
    };
    safety?: {
      query_audit: Array<{ type: string; risk_level: string }> | null;
      response_audit: Array<{ type: string; risk_level: string }> | null;
      disclaimers_added: boolean;
    };
  };
}

export interface RAGFeedback {
  response_id: string;
  rating: number;
  feedback_type: 'helpful' | 'not_helpful' | 'incorrect' | 'unclear';
  comment?: string;
  module?: string;
}

export interface RAGMetrics {
  success_rate: number;
  average_response_time_ms: number;
  total_queries: number;
  documents_found_avg: number;
  fallback_rate: number;
  knowledge_base_usage: {
    [key: string]: number;
  };
}

export interface RAGModuleStats {
  baby: {
    success_rate: number;
    queries: number;
    avg_response_time: number;
  };
  mother: {
    success_rate: number;
    queries: number;
    avg_response_time: number;
  };
  professional: {
    success_rate: number;
    queries: number;
    avg_response_time: number;
  };
}

/**
 * Faz uma pergunta ao RAG
 * Usa autenticação JWT quando disponível, fallback para API key externa
 * Suporta callbacks de progresso
 */
export async function askQuestion(
  question: string,
  babyId?: string,
  options: {
    module_type?: 'baby' | 'mother' | 'professional';
    age_range?: string;
    domain?: string;
    enable_reranking?: boolean;
    enable_safety?: boolean;
    enable_confidence?: boolean;
    onProgress?: (status: 'retrieving' | 'processing' | 'generating') => void;
  } = {}
): Promise<RAGResponse> {
  const payload = {
    question,
    baby_id: babyId,
    module_type: options.module_type || 'baby',
    age_range: options.age_range,
    domain: options.domain,
    enable_reranking: options.enable_reranking !== false,
    enable_safety: options.enable_safety !== false,
    enable_confidence: options.enable_confidence !== false,
  };

  console.log('[RAGService] Payload sendo enviado:', { module_type: payload.module_type, question: payload.question.substring(0, 30) });

  // Notifica início da recuperação
  options.onProgress?.('retrieving');

  // Primeiro tenta com autenticação JWT
  try {
    console.log('[RAGService] Tentando com autenticação JWT para:', question.substring(0, 50) + '...');
    
    options.onProgress?.('processing');
    
    const response = await httpClient.post<RAGResponse>(
      '/rag/ask',
      payload,
      { requiresAuth: true }
    );

    if (response.success && response.data) {
      console.log('[RAGService] Sucesso com JWT auth');
      options.onProgress?.('generating');
      // Garante que o campo success está presente na resposta
      return {
        ...response.data,
        success: true
      };
    }

    // Se não teve sucesso mas não é erro de auth, lança erro
    if (response.error && !response.error.includes('Token') && !response.error.includes('401')) {
      console.error('[RAGService] Erro (JWT):', response.error);
      throw new Error(response.error);
    }
  } catch (authError) {
    console.log('[RAGService] Falha com JWT, tentando endpoint externo');
  }

  // Fallback: usa a rota externa (não requer auth)
  try {
    console.log('[RAGService] Usando rota externa para pergunta');
    
    options.onProgress?.('processing');
    
    const externalResponse = await httpClient.post<RAGResponse>(
      '/rag/external/ask',
      payload,
      { requiresAuth: false }
    );

    if (externalResponse.success && externalResponse.data) {
      console.log('[RAGService] Sucesso com rota externa');
      options.onProgress?.('generating');
      // Garante que o campo success está presente na resposta
      return {
        ...externalResponse.data,
        success: true
      };
    }

    throw new Error(externalResponse.error || 'Erro ao obter resposta do RAG');
  } catch (error) {
    console.error('[RAGService] Erro ao fazer pergunta:', error);
    throw error;
  }
}

/**
 * Submete feedback sobre uma resposta RAG
 */
export async function submitFeedback(feedback: RAGFeedback): Promise<{
  success: boolean;
  feedback_id?: string;
  error?: string;
}> {
  try {
    const payload = {
      response_id: feedback.response_id,
      query: feedback.feedback_type,
      rating: feedback.rating,
      feedback_type: feedback.feedback_type,
      comment: feedback.comment,
      module: feedback.module,
    };

    const response = await httpClient.post(
      '/metrics/rag/feedback',
      payload,
      { requiresAuth: false }
    );

    return {
      success: response.success,
      feedback_id: response.data?.feedback_id,
      error: response.error,
    };
  } catch (error) {
    console.error('[RAGService] Erro ao submeter feedback:', error);
    throw error;
  }
}

/**
 * Obtém métricas agregadas do RAG
 */
export async function getAggregateMetrics(): Promise<RAGMetrics> {
  try {
    const response = await httpClient.get<RAGMetrics>(
      '/metrics/rag/aggregates',
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error('Erro ao obter métricas agregadas');
    }

    return response.data;
  } catch (error) {
    console.error('[RAGService] Erro ao obter métricas:', error);
    throw error;
  }
}

/**
 * Obtém estatísticas por módulo
 */
export async function getModuleStats(): Promise<RAGModuleStats> {
  try {
    const response = await httpClient.get<RAGModuleStats>(
      '/metrics/rag/by-module',
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error('Erro ao obter estatísticas por módulo');
    }

    return response.data;
  } catch (error) {
    console.error('[RAGService] Erro ao obter stats por módulo:', error);
    throw error;
  }
}

/**
 * Obtém estatísticas de feedback
 */
export async function getFeedbackStats(
  module?: string,
  days: number = 30
): Promise<{
  total_feedback: number;
  average_rating: number;
  feedback_types: { [key: string]: number };
  helpful_rate: number;
}> {
  try {
    let endpoint = `/metrics/rag/feedback/stats?days=${days}`;
    if (module) {
      endpoint += `&module=${module}`;
    }

    const response = await httpClient.get(endpoint, { requiresAuth: true });

    if (!response.success || !response.data) {
      throw new Error('Erro ao obter estatísticas de feedback');
    }

    return response.data;
  } catch (error) {
    console.error('[RAGService] Erro ao obter feedback stats:', error);
    throw error;
  }
}

/**
 * Obtém dashboard de maturidade do RAG
 */
export async function getMaturityDashboard(): Promise<{
  overall_score: number;
  level: 'initial' | 'basic' | 'developing' | 'mature';
  modules: {
    [key: string]: {
      score: number;
      level: string;
      metrics: {
        [key: string]: number | string;
      };
    };
  };
  recommendations: string[];
  last_updated: string;
}> {
  try {
    const response = await httpClient.get('/metrics/rag/maturity', {
      requiresAuth: true,
    });

    if (!response.success || !response.data) {
      throw new Error('Erro ao obter dashboard de maturidade');
    }

    return response.data;
  } catch (error) {
    console.error('[RAGService] Erro ao obter maturity dashboard:', error);
    throw error;
  }
}

/**
 * Obtém análise de qualidade
 */
export async function getQualityAnalysis(days: number = 30): Promise<{
  quality_score: number;
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    count: number;
    description: string;
  }>;
  recommendations: string[];
}> {
  try {
    const response = await httpClient.get(
      `/metrics/rag/quality-analysis?days=${days}`,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error('Erro ao obter análise de qualidade');
    }

    return response.data;
  } catch (error) {
    console.error('[RAGService] Erro ao obter quality analysis:', error);
    throw error;
  }
}

/**
 * Obtém sugestões de melhoria
 */
export async function getImprovementSuggestions(limit: number = 10): Promise<
  Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
    status: 'pending' | 'in_progress' | 'completed';
  }>
> {
  try {
    const response = await httpClient.get(
      `/metrics/rag/suggestions?limit=${limit}`,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error('Erro ao obter sugestões de melhoria');
    }

    return response.data;
  } catch (error) {
    console.error('[RAGService] Erro ao obter suggestions:', error);
    throw error;
  }
}

/**
 * Obtém health check do RAG
 */
export async function getHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime_percentage: number;
  last_query_time_ms: number;
  active_modules: string[];
  issues: string[];
}> {
  try {
    const response = await httpClient.get('/metrics/rag/health', {
      requiresAuth: true,
    });

    if (!response.success || !response.data) {
      throw new Error('Erro ao obter health check');
    }

    return response.data;
  } catch (error) {
    console.error('[RAGService] Erro ao obter health check:', error);
    throw error;
  }
}

export interface IngestionStats {
  total_uploads: number;
  successful_uploads: number;
  failed_uploads: number;
  total_chunks_indexed: number;
  providers_used: {
    gemini: number;
    qdrant: number;
    openai: number;
  };
  last_upload: string | null;
}

export interface IngestionRecord {
  timestamp: string;
  filename: string;
  title: string;
  knowledge_category: string;
  success: boolean;
  ingestion_time_ms: number;
  chunks_indexed: number;
  providers_used: string[];
  file_size: number;
  error: string | null;
}

/**
 * Obtém estatísticas de ingestão de documentos
 */
export async function getIngestionStats(): Promise<{
  success: boolean;
  data: IngestionStats;
  recent_ingestions: IngestionRecord[];
}> {
  try {
    const response = await httpClient.get<{
      success: boolean;
      data: IngestionStats;
      recent_ingestions: IngestionRecord[];
    }>('/metrics/rag/ingestions', {
      requiresAuth: true,
    });

    if (!response.success) {
      throw new Error('Erro ao obter estatísticas de ingestão');
    }

    return {
      success: true,
      data: response.data?.data || {
        total_uploads: 0,
        successful_uploads: 0,
        failed_uploads: 0,
        total_chunks_indexed: 0,
        providers_used: { gemini: 0, qdrant: 0, openai: 0 },
        last_upload: null
      },
      recent_ingestions: response.data?.recent_ingestions || []
    };
  } catch (error) {
    console.error('[RAGService] Erro ao obter ingestion stats:', error);
    throw error;
  }
}

export default {
  askQuestion,
  submitFeedback,
  getAggregateMetrics,
  getModuleStats,
  getFeedbackStats,
  getMaturityDashboard,
  getQualityAnalysis,
  getImprovementSuggestions,
  getHealthCheck,
  getIngestionStats,
};
