const ragService = require('../services/ragService');
const { Child, Profile, User, JourneyBotResponse } = require('../models');

exports.ask = async (req, res) => {
  try {
    const { question, child_id, baby_id, age_range, domain, tags, use_file_search, module_type } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Campo obrigatório: question'
      });
    }

    const babyId = child_id || baby_id;
    
    console.log('[RAG] Recebido module_type:', module_type);

    const result = await ragService.askWithBabyId(question, babyId, {
      age_range,
      domain,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : null,
      use_file_search: use_file_search !== false,
      module_type: module_type || 'baby'
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Erro ao processar pergunta'
      });
    }

    console.log(`[RAG] Pergunta processada em ${result.metadata.processing_time_ms}ms, ` +
      `${result.metadata.documents_found} docs, file_search: ${result.metadata.file_search_used}`);

    return res.json({
      success: true,
      answer: result.answer,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('[RAG] Erro no endpoint /ask:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar pergunta'
    });
  }
};

exports.askSimple = async (req, res) => {
  try {
    const { question, child_id, baby_id } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Campo obrigatório: question'
      });
    }

    const babyId = child_id || baby_id;

    const result = await ragService.askWithBabyId(question, babyId, {
      use_file_search: false
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    return res.json({
      success: true,
      answer: result.answer,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('[RAG] Erro no endpoint /ask-simple:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno'
    });
  }
};

exports.getKnowledgeDocuments = async (req, res) => {
  try {
    const { age_range, domain, tags, source_type, limit } = req.query;

    const filters = {
      age_range,
      domain,
      source_type,
      tags: tags ? tags.split(',').map(t => t.trim()) : null,
      limit: limit ? parseInt(limit) : 10
    };

    const result = await ragService.selectKnowledgeDocuments(filters);

    return res.json({
      success: result.success,
      data: result.data,
      count: result.count
    });
  } catch (error) {
    console.error('[RAG] Erro ao listar documentos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar documentos'
    });
  }
};

exports.healthCheck = async (req, res) => {
  const isConfigured = ragService.isConfigured();

  return res.json({
    success: true,
    status: isConfigured ? 'operational' : 'not_configured',
    openai_configured: isConfigured,
    timestamp: new Date().toISOString()
  });
};

exports.askMultimodal = async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        response_text: 'Por favor, faça uma pergunta.',
        media_type: 'text',
        media_url: null
      });
    }

    const childId = context?.child_id;
    const week = context?.week;

    const result = await ragService.askWithBabyId(question, childId, {
      use_file_search: true
    });

    if (!result.success) {
      return res.json({
        response_text: result.error || 'Desculpe, não consegui processar sua pergunta. Tente novamente.',
        media_type: 'text',
        media_url: null
      });
    }

    return res.json({
      response_text: result.answer,
      media_type: 'text',
      media_url: null,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('[RAG] Erro no endpoint /ask-multimodal:', error);
    return res.status(500).json({
      response_text: 'Erro ao processar sua pergunta. Tente novamente mais tarde.',
      media_type: 'text',
      media_url: null
    });
  }
};
