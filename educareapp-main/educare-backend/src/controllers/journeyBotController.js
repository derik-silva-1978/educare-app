const { JourneyBotSession, JourneyBotResponse, JourneyBotQuestion, User, Child } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Obter perguntas por faixa etária
exports.getQuestionsForAge = async (req, res) => {
  try {
    const { age_months } = req.query;
    const userId = req.user.id;

    if (!age_months) {
      return res.status(400).json({ error: 'Parâmetro age_months é obrigatório' });
    }

    let ageInMonths = parseInt(age_months);
    
    // Para bebês de 0 meses, usar perguntas de 1 mês (primeira faixa disponível)
    if (ageInMonths === 0) {
      ageInMonths = 1;
      console.log(`🍼 Bebê de 0 meses detectado, usando perguntas de 1 mês`);
    }
    
    // Buscar perguntas para a faixa etária
    const questions = await JourneyBotQuestion.findAll({
      where: {
        meta_min_months: {
          [Op.lte]: ageInMonths
        },
        meta_max_months: {
          [Op.gte]: ageInMonths
        },
        is_active: true
      },
      order: [['week', 'ASC'], ['created_at', 'ASC']]
    });

    console.log(`🔍 Buscando perguntas para idade: ${ageInMonths} meses`);
    console.log(`📊 Perguntas encontradas: ${questions.length}`);

    return res.status(200).json({ 
      success: true, 
      data: questions,
      meta: {
        age_months: ageInMonths,
        total_questions: questions.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perguntas por faixa etária:', error);
    return res.status(500).json({ error: 'Erro ao buscar perguntas por faixa etária' });
  }
};

// Obter respostas existentes para uma criança
exports.getChildResponses = async (req, res) => {
  try {
    const { child_id, user_id } = req.query;
    const userId = req.user.id;

    // Verificar se o usuário tem permissão
    if (user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const responses = await JourneyBotResponse.findAll({
      where: {
        child_id,
        user_id
      },
      order: [['created_at', 'ASC']]
    });

    return res.status(200).json({ success: true, data: responses });
  } catch (error) {
    console.error('Erro ao buscar respostas do journey bot:', error);
    return res.status(500).json({ error: 'Erro ao buscar respostas do journey bot' });
  }
};

// Obter sessão ativa para uma criança
exports.getActiveSession = async (req, res) => {
  try {
    const { child_id, user_id } = req.query;
    const userId = req.user.id;

    // Verificar se o usuário tem permissão
    if (user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const session = await JourneyBotSession.findOne({
      where: {
        child_id,
        user_id,
        status: 'active'
      },
      order: [['created_at', 'DESC']]
    });

    if (!session) {
      return res.status(404).json({ error: 'Sessão ativa não encontrada' });
    }

    return res.status(200).json({ success: true, data: session });
  } catch (error) {
    console.error('Erro ao buscar sessão ativa:', error);
    return res.status(500).json({ error: 'Erro ao buscar sessão ativa' });
  }
};

// Criar nova sessão
exports.createSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { user_id, child_id, total_questions, answered_questions, status, session_data } = req.body;

    // Verificar se o usuário tem permissão
    if (user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const session = await JourneyBotSession.create({
      user_id,
      child_id,
      total_questions,
      answered_questions: answered_questions || 0,
      status: status || 'active',
      session_data: session_data || {}
    });

    return res.status(201).json({ success: true, data: session });
  } catch (error) {
    console.error('Erro ao criar sessão do journey bot:', error);
    return res.status(500).json({ error: 'Erro ao criar sessão do journey bot' });
  }
};

// Atualizar sessão
exports.updateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const session = await JourneyBotSession.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }

    // Verificar se o usuário tem permissão
    if (session.user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await session.update(updateData);

    return res.status(200).json({ success: true, data: session });
  } catch (error) {
    console.error('Erro ao atualizar sessão do journey bot:', error);
    return res.status(500).json({ error: 'Erro ao atualizar sessão do journey bot' });
  }
};

// Salvar resposta
exports.saveResponse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { user_id, child_id, question_id, answer, answer_text } = req.body;

    // Verificar se o usuário tem permissão
    if (user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const response = await JourneyBotResponse.create({
      user_id,
      child_id,
      question_id,
      answer,
      answer_text,
      responded_at: new Date()
    });

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error('Erro ao salvar resposta do journey bot:', error);
    return res.status(500).json({ error: 'Erro ao salvar resposta do journey bot' });
  }
};
