const { JourneyBotQuestion, JourneyBotSession, JourneyBotResponse } = require('../models');
const { Op } = require('sequelize');

class JourneyBotController {
  // Get questions for age range
  async getQuestionsForAge(req, res) {
    try {
      const { age_months } = req.query;
      
      if (!age_months) {
        return res.status(400).json({
          success: false,
          message: 'Idade em meses é obrigatória'
        });
      }

      const ageInMonths = parseInt(age_months);
      
      // Buscar perguntas para a faixa etária (com margem de 3 meses)
      const questions = await JourneyBotQuestion.findAll({
        where: {
          min_age_months: {
            [Op.lte]: ageInMonths + 3
          },
          max_age_months: {
            [Op.gte]: Math.max(0, ageInMonths - 3)
          },
          is_active: true
        },
        order: [
          ['min_age_months', 'ASC'],
          ['max_age_months', 'ASC'],
          ['order_index', 'ASC']
        ]
      });

      res.json({
        success: true,
        data: questions
      });
    } catch (error) {
      console.error('Erro ao buscar perguntas do journey bot:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Get active session for child
  async getActiveSession(req, res) {
    try {
      const { child_id, user_id } = req.query;
      
      if (!child_id || !user_id) {
        return res.status(400).json({
          success: false,
          message: 'child_id e user_id são obrigatórios'
        });
      }

      const session = await JourneyBotSession.findOne({
        where: {
          child_id,
          user_id,
          status: 'active'
        },
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Erro ao buscar sessão ativa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Create new session
  async createSession(req, res) {
    try {
      const { user_id, child_id, total_questions, answered_questions, status, session_data } = req.body;
      
      if (!user_id || !child_id) {
        return res.status(400).json({
          success: false,
          message: 'user_id e child_id são obrigatórios'
        });
      }

      const session = await JourneyBotSession.create({
        user_id,
        child_id,
        total_questions: total_questions || 0,
        answered_questions: answered_questions || 0,
        status: status || 'active',
        session_data: session_data || {}
      });

      res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Update session
  async updateSession(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const [updatedRows] = await JourneyBotSession.update(updateData, {
        where: { id }
      });

      if (updatedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sessão não encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Sessão atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Get responses for child
  async getChildResponses(req, res) {
    try {
      const { child_id, user_id } = req.query;
      
      if (!child_id || !user_id) {
        return res.status(400).json({
          success: false,
          message: 'child_id e user_id são obrigatórios'
        });
      }

      const responses = await JourneyBotResponse.findAll({
        where: {
          child_id,
          user_id
        },
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: responses
      });
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Save response
  async saveResponse(req, res) {
    try {
      const { user_id, child_id, question_id, answer, answer_text } = req.body;
      
      if (!user_id || !child_id || !question_id || answer === undefined) {
        return res.status(400).json({
          success: false,
          message: 'user_id, child_id, question_id e answer são obrigatórios'
        });
      }

      const response = await JourneyBotResponse.create({
        user_id,
        child_id,
        question_id,
        answer,
        answer_text: answer_text || ''
      });

      res.status(201).json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new JourneyBotController();
