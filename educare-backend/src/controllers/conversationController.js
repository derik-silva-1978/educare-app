const pgvectorService = require('../services/pgvectorService');

const conversationController = {
  async getState(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const result = await pgvectorService.getConversationState(phone);
      return res.json(result);
    } catch (error) {
      console.error('[PgVector] getState error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar estado' });
    }
  },

  async updateState(req, res) {
    try {
      const { phone, ...updates } = req.body;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const result = await pgvectorService.updateConversationState(phone, updates);
      return res.json(result);
    } catch (error) {
      console.error('[PgVector] updateState error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao atualizar estado' });
    }
  },

  async saveFeedback(req, res) {
    try {
      const { phone, score, state, active_context, assistant_name, journey_week, comment } = req.body;

      if (!phone || score === undefined) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone e score são obrigatórios' });
      }

      const result = await pgvectorService.saveFeedback({
        user_phone: phone,
        score,
        state,
        active_context,
        assistant_name,
        journey_week,
        comment
      });

      return res.json(result);
    } catch (error) {
      console.error('[PgVector] saveFeedback error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao salvar feedback' });
    }
  },

  async saveReport(req, res) {
    try {
      const { phone, type, content, state, active_context, assistant_name } = req.body;

      if (!phone || !content) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone e content são obrigatórios' });
      }

      const result = await pgvectorService.saveReport({
        user_phone: phone,
        type,
        content,
        state,
        active_context,
        assistant_name
      });

      return res.json(result);
    } catch (error) {
      console.error('[PgVector] saveReport error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao salvar report' });
    }
  },

  async getReports(req, res) {
    try {
      const { phone, type, status, limit, offset } = req.query;

      const result = await pgvectorService.getReports({
        user_phone: phone,
        type,
        status,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined
      });

      return res.json(result);
    } catch (error) {
      console.error('[PgVector] getReports error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar reports' });
    }
  },

  async searchMemory(req, res) {
    try {
      const { phone, query_embedding, active_context, limit } = req.body;

      if (!phone || !query_embedding) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone e query_embedding são obrigatórios' });
      }

      const result = await pgvectorService.searchConversationMemory(query_embedding, phone, {
        active_context,
        limit: limit || 10
      });

      return res.json(result);
    } catch (error) {
      console.error('[PgVector] searchMemory error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar memória' });
    }
  }
};

module.exports = conversationController;
