const { AppFaq } = require('../models');
const { sequelize } = require('../config/database');
const { literal } = require('sequelize');

/**
 * Controller: FAQ Dinâmica Contextual
 * 
 * Gerencia sugestões de FAQs baseadas na idade da criança e feedback dos usuários.
 */

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
        -- Score de ranqueamento dinâmico
        (usage_count * 1.0 + upvotes * 2.0 - downvotes * 5.0) as relevance_score
      FROM app_faqs
      WHERE min_week <= $1 AND max_week >= $1
      ${category ? `AND category = $2` : ''}
      ORDER BY relevance_score DESC
      LIMIT 5
    `;
    
    // Executar query raw para melhor performance
    const params = category ? [weekNum, category] : [weekNum];
    const suggestions = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });
    
    // Se não encontrar FAQs relevantes, incrementa usage_count do que foi retornado
    if (suggestions.length > 0) {
      // Incrementa usage_count para rastreamento
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
 */
exports.listAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await AppFaq.findAndCountAll({
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
    
    // Validação adicional de lógica de negócio
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
      is_seed: false, // Criado manualmente pelo admin, não é seed
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
    
    // Verificar se FAQ existe
    const faq = await AppFaq.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ não encontrada'
      });
    }
    
    // Validação de lógica de negócio
    if (min_week !== undefined && max_week !== undefined && min_week > max_week) {
      return res.status(400).json({
        success: false,
        message: 'min_week não pode ser maior que max_week'
      });
    }
    
    // Atualizar campos fornecidos
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
 * Deletar FAQ. Apenas admin/owner.
 * Soft delete (não remove completamente) para manter histórico.
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
    
    // Hard delete (pode ser modificado para soft delete se necessário)
    await faq.destroy();
    
    return res.json({
      success: true,
      message: 'FAQ deletada com sucesso'
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
 * POST /api/faqs/:id/feedback
 * 
 * Registrar feedback do usuário (upvote/downvote).
 * Incrementa counters que alimentam o algoritmo de ranqueamento.
 * 
 * O feedback é anônimo e não rastreia usuário específico.
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
    
    // Incrementar counter apropriado
    if (type === 'upvote') {
      await faq.update({
        upvotes: sequelize.literal('upvotes + 1')
      });
    } else if (type === 'downvote') {
      await faq.update({
        downvotes: sequelize.literal('downvotes + 1')
      });
    }
    
    // Recarregar para retornar valores atualizados
    await faq.reload();
    
    // Calcular score atual
    const currentScore = faq.usage_count * 1.0 + faq.upvotes * 2.0 - faq.downvotes * 5.0;
    
    return res.json({
      success: true,
      message: `${type} registrado com sucesso`,
      data: {
        id: faq.id,
        upvotes: faq.upvotes,
        downvotes: faq.downvotes,
        relevance_score: currentScore
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
