const { AppFaq, FaqUserFeedback } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

/**
 * Controller: FAQ Dinâmica Contextual
 * 
 * Gerencia sugestões de FAQs baseadas na idade da criança e feedback dos usuários.
 */

/**
 * Helper: Extrai identificador único do usuário
 */
const getUserIdentifier = (req) => {
  // Prioridade: userId autenticado > IP
  if (req.user && req.user.id) {
    return { identifier: req.user.id, type: 'user_id' };
  }
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  return { identifier: ip, type: 'ip' };
};

/**
 * GET /api/faqs/suggestions?week=X
 * 
 * Retorna 5 FAQs mais relevantes usando algoritmo de ranqueamento.
 * 
 * Lógica:
 * 1. Filtra por semana: min_week <= week <= max_week
 * 2. Calcula score: (usage_count * 1.0) + (upvotes * 2.0) - (downvotes * 5.0)
 * 3. Ordena por score DESC
 * 4. Retorna top 5
 * 
 * @param {Request} req - week (query param), category (opcional)
 * @returns {Response} - {success, data: [...]}
 */
exports.getSuggestionsByWeek = async (req, res) => {
  try {
    const { week, category } = req.query;
    const weekNum = parseInt(week, 10);
    
    // Query SQL otimizada com ranking dinâmico
    // Filtra apenas FAQs não deletadas (deleted_at IS NULL)
    const query = `
      SELECT 
        id,
        category,
        question_text,
        answer_rag_context,
        min_week,
        max_week,
        is_seed,
        usage_count,
        upvotes,
        downvotes,
        created_at,
        updated_at,
        (usage_count * 1.0 + upvotes * 2.0 - downvotes * 5.0) as relevance_score
      FROM app_faqs
      WHERE min_week <= $1 AND max_week >= $1
        AND (deleted_at IS NULL)
      ${category ? `AND category = $2` : ''}
      ORDER BY relevance_score DESC
      LIMIT 5
    `;
    
    const params = category ? [weekNum, category] : [weekNum];
    const suggestions = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });
    
    // Incrementa usage_count para rastreamento
    if (suggestions.length > 0) {
      const faqIds = suggestions.map(f => f.id);
      await AppFaq.update(
        { usage_count: sequelize.literal('usage_count + 1') },
        { where: { id: faqIds } }
      );
    }
    
    return res.json({
      success: true,
      data: suggestions,
      count: suggestions.length,
      week: weekNum
    });
  } catch (error) {
    console.error('Erro ao obter sugestões de FAQs:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter sugestões de FAQs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * GET /api/faqs
 * 
 * Lista todas as FAQs com paginação. Apenas admin/owner.
 * Exclui FAQs deletadas (soft delete).
 */
exports.listAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const includeDeleted = req.query.includeDeleted === 'true';
    
    const whereClause = includeDeleted ? {} : { deleted_at: null };
    
    const { count, rows } = await AppFaq.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['created_at', 'DESC']]
    });
    
    return res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar FAQs:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar FAQs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * POST /api/faqs
 * 
 * Criar nova FAQ. Apenas admin/owner.
 */
exports.create = async (req, res) => {
  try {
    const { question_text, category, answer_rag_context, min_week, max_week } = req.body;
    
    if (min_week > max_week) {
      return res.status(400).json({
        success: false,
        message: 'min_week não pode ser maior que max_week'
      });
    }
    
    const faq = await AppFaq.create({
      question_text,
      category,
      answer_rag_context: answer_rag_context || null,
      min_week,
      max_week,
      is_seed: false,
      usage_count: 0,
      upvotes: 0,
      downvotes: 0
    });
    
    return res.status(201).json({
      success: true,
      message: 'FAQ criada com sucesso',
      data: faq
    });
  } catch (error) {
    console.error('Erro ao criar FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * PUT /api/faqs/:id
 * 
 * Atualizar FAQ existente. Apenas admin/owner.
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text, category, answer_rag_context, min_week, max_week } = req.body;
    
    const faq = await AppFaq.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ não encontrada'
      });
    }
    
    if (min_week !== undefined && max_week !== undefined && min_week > max_week) {
      return res.status(400).json({
        success: false,
        message: 'min_week não pode ser maior que max_week'
      });
    }
    
    const updateData = {};
    if (question_text !== undefined) updateData.question_text = question_text;
    if (category !== undefined) updateData.category = category;
    if (answer_rag_context !== undefined) updateData.answer_rag_context = answer_rag_context;
    if (min_week !== undefined) updateData.min_week = min_week;
    if (max_week !== undefined) updateData.max_week = max_week;
    
    await faq.update(updateData);
    
    return res.json({
      success: true,
      message: 'FAQ atualizada com sucesso',
      data: faq
    });
  } catch (error) {
    console.error('Erro ao atualizar FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * DELETE /api/faqs/:id
 * 
 * SOFT DELETE: Marca deleted_at em vez de remover permanentemente.
 * Apenas admin/owner.
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const faq = await AppFaq.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ não encontrada'
      });
    }
    
    // Soft delete: apenas marca deleted_at
    await faq.update({ deleted_at: new Date() });
    
    return res.json({
      success: true,
      message: 'FAQ movida para lixeira'
    });
  } catch (error) {
    console.error('Erro ao deletar FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao deletar FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * PUT /api/faqs/:id/restore
 * 
 * Restaurar FAQ deletada (soft delete). Apenas admin/owner.
 */
exports.restore = async (req, res) => {
  try {
    const { id } = req.params;
    
    const faq = await AppFaq.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ não encontrada'
      });
    }
    
    if (!faq.deleted_at) {
      return res.status(400).json({
        success: false,
        message: 'FAQ não está deletada'
      });
    }
    
    await faq.update({ deleted_at: null });
    
    return res.json({
      success: true,
      message: 'FAQ restaurada com sucesso',
      data: faq
    });
  } catch (error) {
    console.error('Erro ao restaurar FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao restaurar FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * POST /api/faqs/:id/feedback
 * 
 * Registrar feedback do usuário (upvote/downvote).
 * Implementa voto único por usuário/IP com possibilidade de alterar.
 */
exports.recordFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'upvote' ou 'downvote'
    
    const faq = await AppFaq.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ não encontrada'
      });
    }
    
    // Obter identificador do usuário
    const { identifier, type: identifierType } = getUserIdentifier(req);
    
    // Verificar se já votou nesta FAQ
    const existingFeedback = await FaqUserFeedback.findOne({
      where: {
        faq_id: id,
        user_identifier: identifier
      }
    });
    
    if (existingFeedback) {
      // Já votou - verificar se é o mesmo tipo
      if (existingFeedback.feedback_type === type) {
        return res.status(400).json({
          success: false,
          message: `Você já deu ${type} nesta FAQ`
        });
      }
      
      // Mudando o voto: reverter o anterior e aplicar o novo
      // Reverter voto anterior
      if (existingFeedback.feedback_type === 'upvote') {
        await faq.update({ upvotes: sequelize.literal('upvotes - 1') });
      } else {
        await faq.update({ downvotes: sequelize.literal('downvotes - 1') });
      }
      
      // Aplicar novo voto
      if (type === 'upvote') {
        await faq.update({ upvotes: sequelize.literal('upvotes + 1') });
      } else {
        await faq.update({ downvotes: sequelize.literal('downvotes + 1') });
      }
      
      // Atualizar registro de feedback
      await existingFeedback.update({ feedback_type: type });
      
      await faq.reload();
      const currentScore = faq.usage_count * 1.0 + faq.upvotes * 2.0 - faq.downvotes * 5.0;
      
      return res.json({
        success: true,
        message: `Voto alterado para ${type}`,
        data: {
          id: faq.id,
          upvotes: faq.upvotes,
          downvotes: faq.downvotes,
          relevance_score: currentScore,
          changed: true
        }
      });
    }
    
    // Primeiro voto: criar registro e incrementar
    await FaqUserFeedback.create({
      faq_id: id,
      user_identifier: identifier,
      identifier_type: identifierType,
      feedback_type: type
    });
    
    if (type === 'upvote') {
      await faq.update({ upvotes: sequelize.literal('upvotes + 1') });
    } else {
      await faq.update({ downvotes: sequelize.literal('downvotes + 1') });
    }
    
    await faq.reload();
    const currentScore = faq.usage_count * 1.0 + faq.upvotes * 2.0 - faq.downvotes * 5.0;
    
    return res.json({
      success: true,
      message: `${type} registrado com sucesso`,
      data: {
        id: faq.id,
        upvotes: faq.upvotes,
        downvotes: faq.downvotes,
        relevance_score: currentScore,
        changed: false
      }
    });
  } catch (error) {
    console.error('Erro ao registrar feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao registrar feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * GET /api/faqs/analytics
 * 
 * Métricas agregadas de uso das FAQs. Apenas admin/owner.
 */
exports.getAnalytics = async (req, res) => {
  try {
    // Top 10 FAQs por score
    const topFaqs = await sequelize.query(`
      SELECT 
        id, category, question_text, usage_count, upvotes, downvotes,
        (usage_count * 1.0 + upvotes * 2.0 - downvotes * 5.0) as relevance_score
      FROM app_faqs
      WHERE deleted_at IS NULL
      ORDER BY relevance_score DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });
    
    // FAQs com mais downvotes (candidatas a revisão)
    const problemFaqs = await sequelize.query(`
      SELECT 
        id, category, question_text, downvotes, upvotes,
        (downvotes * 1.0 / NULLIF(upvotes + downvotes, 0)) as negative_ratio
      FROM app_faqs
      WHERE deleted_at IS NULL AND downvotes > 0
      ORDER BY downvotes DESC
      LIMIT 5
    `, { type: sequelize.QueryTypes.SELECT });
    
    // Estatísticas gerais
    const stats = await sequelize.query(`
      SELECT 
        COUNT(*) as total_faqs,
        SUM(usage_count) as total_usage,
        SUM(upvotes) as total_upvotes,
        SUM(downvotes) as total_downvotes,
        AVG(usage_count) as avg_usage,
        COUNT(*) FILTER (WHERE is_seed = TRUE) as seed_faqs,
        COUNT(*) FILTER (WHERE is_seed = FALSE) as custom_faqs
      FROM app_faqs
      WHERE deleted_at IS NULL
    `, { type: sequelize.QueryTypes.SELECT });
    
    // Por categoria
    const byCategory = await sequelize.query(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(usage_count) as total_usage,
        SUM(upvotes) as total_upvotes,
        SUM(downvotes) as total_downvotes
      FROM app_faqs
      WHERE deleted_at IS NULL
      GROUP BY category
    `, { type: sequelize.QueryTypes.SELECT });
    
    return res.json({
      success: true,
      data: {
        summary: stats[0] || {},
        topFaqs,
        problemFaqs,
        byCategory
      }
    });
  } catch (error) {
    console.error('Erro ao obter analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * GET /api/faqs/search?q=termo
 * 
 * Busca full-text em FAQs.
 */
exports.search = async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Termo de busca deve ter pelo menos 2 caracteres'
      });
    }
    
    const searchTerm = `%${q.trim().toLowerCase()}%`;
    
    let query = `
      SELECT 
        id, category, question_text, answer_rag_context,
        min_week, max_week, usage_count, upvotes, downvotes,
        (usage_count * 1.0 + upvotes * 2.0 - downvotes * 5.0) as relevance_score
      FROM app_faqs
      WHERE deleted_at IS NULL
        AND (LOWER(question_text) LIKE $1 OR LOWER(answer_rag_context) LIKE $1)
    `;
    
    const params = [searchTerm];
    
    if (category) {
      query += ` AND category = $2`;
      params.push(category);
    }
    
    query += ` ORDER BY relevance_score DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit, 10));
    
    const results = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });
    
    return res.json({
      success: true,
      data: results,
      count: results.length,
      query: q
    });
  } catch (error) {
    console.error('Erro ao buscar FAQs:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar FAQs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
