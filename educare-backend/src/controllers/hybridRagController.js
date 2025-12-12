const hybridRagService = require('../services/hybridRagService');
const hybridIngestionService = require('../services/hybridIngestionService');

exports.query = async (req, res) => {
  try {
    const { query, knowledge_category, source_type, domain, preferred_provider } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query é obrigatória'
      });
    }

    console.log(`[HybridRAG] Query de ${req.user.email}: "${query.substring(0, 50)}..."`);

    const result = await hybridRagService.query(query, {
      knowledge_category,
      source_type,
      domain,
      preferred_provider
    });

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error || 'Nenhuma resposta encontrada'
      });
    }

    return res.json({
      success: true,
      data: {
        answer: result.answer,
        citations: result.citations,
        sources: result.sources,
        provider: result.provider_used,
        fallback_used: result.fallback_used,
        query_time_ms: result.query_time_ms
      }
    });
  } catch (error) {
    console.error('[HybridRAG] Erro na query:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar consulta'
    });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const status = await hybridRagService.getProviderStatus();
    const activeProviders = hybridRagService.getActiveProviders();

    return res.json({
      success: true,
      data: {
        active_providers: activeProviders,
        providers: status
      }
    });
  } catch (error) {
    console.error('[HybridRAG] Erro ao obter status:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter status do sistema RAG'
    });
  }
};

exports.getProviders = async (req, res) => {
  try {
    const activeProviders = hybridRagService.getActiveProviders();

    return res.json({
      success: true,
      data: {
        providers: activeProviders,
        gemini_configured: process.env.GEMINI_API_KEY ? true : false,
        qdrant_configured: !!(process.env.QDRANT_URL && process.env.QDRANT_API_KEY),
        openai_configured: process.env.OPENAI_API_KEY ? true : false
      }
    });
  } catch (error) {
    console.error('[HybridRAG] Erro ao listar providers:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar provedores'
    });
  }
};

exports.testConnection = async (req, res) => {
  try {
    const results = {
      gemini: { configured: false, connected: false },
      qdrant: { configured: false, connected: false },
      openai: { configured: false, connected: false }
    };

    if (process.env.GEMINI_API_KEY) {
      results.gemini.configured = true;
      try {
        const geminiService = require('../services/geminiFileSearchService');
        const stats = await geminiService.getStoreStats();
        results.gemini.connected = stats.success;
        results.gemini.stats = stats.stats;
      } catch (err) {
        results.gemini.error = err.message;
      }
    }

    if (process.env.QDRANT_URL && process.env.QDRANT_API_KEY) {
      results.qdrant.configured = true;
      try {
        const qdrantService = require('../services/qdrantService');
        const stats = await qdrantService.getCollectionStats();
        results.qdrant.connected = stats.success;
        results.qdrant.stats = stats.stats;
      } catch (err) {
        results.qdrant.error = err.message;
      }
    }

    if (process.env.OPENAI_API_KEY) {
      results.openai.configured = true;
      try {
        const fileSearchService = require('../services/fileSearchService');
        const files = await fileSearchService.listFiles();
        results.openai.connected = files.success;
        results.openai.file_count = files.data?.length || 0;
      } catch (err) {
        results.openai.error = err.message;
      }
    }

    const allConnected = Object.values(results).some(r => r.connected);

    return res.json({
      success: true,
      healthy: allConnected,
      data: results
    });
  } catch (error) {
    console.error('[HybridRAG] Erro no teste de conexão:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao testar conexões'
    });
  }
};
