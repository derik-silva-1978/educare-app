const hybridRagService = require('../services/hybridRagService');
const hybridIngestionService = require('../services/hybridIngestionService');

exports.query = async (req, res) => {
  try {
    const { question, knowledge_category, source_type, domain, preferred_provider, system_prompt } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Campo obrigatório: question'
      });
    }

    console.log(`[HybridRAG:Controller] Query recebida: "${question.substring(0, 50)}..."`);

    const result = await hybridRagService.query(question, {
      knowledge_category,
      source_type,
      domain,
      preferred_provider,
      systemPrompt: system_prompt
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Erro ao processar pergunta'
      });
    }

    console.log(`[HybridRAG:Controller] Resposta de ${result.provider_used} em ${result.query_time_ms}ms`);

    return res.json({
      success: true,
      answer: result.answer,
      citations: result.citations,
      sources: result.sources,
      metadata: {
        provider_used: result.provider_used,
        fallback_used: result.fallback_used,
        query_time_ms: result.query_time_ms
      }
    });
  } catch (error) {
    console.error('[HybridRAG:Controller] Erro no endpoint /query:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar pergunta'
    });
  }
};

exports.status = async (req, res) => {
  try {
    const status = await hybridRagService.getProviderStatus();
    const activeProviders = hybridRagService.getActiveProviders();

    return res.json({
      success: true,
      active_providers: activeProviders,
      providers: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[HybridRAG:Controller] Erro no endpoint /status:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter status dos provedores'
    });
  }
};

exports.ingest = async (req, res) => {
  try {
    const { file_path, file_name, metadata } = req.body;

    if (!file_path || !file_name) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: file_path, file_name'
      });
    }

    console.log(`[HybridRAG:Controller] Ingestão solicitada: ${file_name}`);

    const result = await hybridIngestionService.ingestDocument(file_path, file_name, metadata || {});

    return res.json({
      success: result.success,
      providers: result.providers,
      chunks_indexed: result.chunks_indexed,
      ingestion_time_ms: result.ingestion_time_ms,
      gemini: result.gemini,
      qdrant: result.qdrant
    });
  } catch (error) {
    console.error('[HybridRAG:Controller] Erro no endpoint /ingest:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno na ingestão'
    });
  }
};

exports.healthCheck = async (req, res) => {
  try {
    const activeProviders = hybridRagService.getActiveProviders();
    
    return res.json({
      success: true,
      status: activeProviders.length > 0 ? 'operational' : 'no_providers',
      active_providers: activeProviders,
      gemini_configured: process.env.GEMINI_API_KEY ? true : false,
      qdrant_configured: process.env.QDRANT_URL && process.env.QDRANT_API_KEY ? true : false,
      primary_provider: process.env.RAG_PRIMARY_PROVIDER || 'gemini',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[HybridRAG:Controller] Erro no health check:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao verificar saúde do sistema'
    });
  }
};
