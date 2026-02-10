const pgvectorService = require('../services/pgvectorService');
const stateMachineService = require('../services/stateMachineService');
const messageBufferService = require('../services/messageBufferService');
const conversationContextService = require('../services/conversationContextService');
const elevenLabsService = require('../services/elevenLabsService');
const whatsappButtonsService = require('../services/whatsappButtonsService');

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
      console.error('[Conversation] getState error:', error.message);
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
      console.error('[Conversation] updateState error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao atualizar estado' });
    }
  },

  async transitionState(req, res) {
    try {
      const { phone, to_state, ...additionalUpdates } = req.body;

      if (!phone || !to_state) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone e to_state são obrigatórios' });
      }

      const result = await stateMachineService.transition(phone, to_state, additionalUpdates);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (error) {
      console.error('[Conversation] transitionState error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno na transição de estado' });
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
      console.error('[Conversation] saveFeedback error:', error.message);
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
      console.error('[Conversation] saveReport error:', error.message);
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
      console.error('[Conversation] getReports error:', error.message);
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
      console.error('[Conversation] searchMemory error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar memória' });
    }
  },

  async saveMemory(req, res) {
    try {
      const { phone, role, content, embedding, interaction_type, active_context, assistant_name, domain, journey_week, emotional_tone, metadata } = req.body;

      if (!phone || !role || !content) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone, role e content são obrigatórios' });
      }

      const result = await pgvectorService.saveConversationMemory({
        user_phone: phone,
        role,
        content,
        embedding: embedding || null,
        interaction_type: interaction_type || 'conversation',
        active_context,
        assistant_name,
        domain,
        journey_week,
        emotional_tone,
        metadata: metadata || {}
      });

      return res.json(result);
    } catch (error) {
      console.error('[Conversation] saveMemory error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao salvar memória' });
    }
  },

  async addToBuffer(req, res) {
    try {
      const { phone, message } = req.body;

      if (!phone || !message) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone e message são obrigatórios' });
      }

      const result = await messageBufferService.addMessage(phone, message);
      return res.json(result);
    } catch (error) {
      console.error('[Conversation] addToBuffer error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao adicionar ao buffer' });
    }
  },

  async getBuffer(req, res) {
    try {
      const { phone } = req.params;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const result = await messageBufferService.getBuffer(phone);
      return res.json(result);
    } catch (error) {
      console.error('[Conversation] getBuffer error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar buffer' });
    }
  },

  async consumeBuffer(req, res) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const result = await messageBufferService.consumeBuffer(phone);
      return res.json(result);
    } catch (error) {
      console.error('[Conversation] consumeBuffer error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao consumir buffer' });
    }
  },

  async getContext(req, res) {
    try {
      const { phone } = req.params;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const limit = req.query.memory_limit ? parseInt(req.query.memory_limit) : undefined;
      const result = await conversationContextService.getFullContext(phone, { limit });
      return res.json(result);
    } catch (error) {
      console.error('[Conversation] getContext error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar contexto' });
    }
  },

  async getContextPrompt(req, res) {
    try {
      const { phone } = req.params;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const context = await conversationContextService.getFullContext(phone);
      const prompt = conversationContextService.formatContextForPrompt(context);

      return res.json({
        success: true,
        prompt,
        context_summary: {
          has_user: !!context.user,
          has_child: !!context.child,
          memory_count: context.memory?.count || 0,
          state: context.state?.current_state || null,
          active_context: context.state?.active_context || null
        }
      });
    } catch (error) {
      console.error('[Conversation] getContextPrompt error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao gerar prompt de contexto' });
    }
  },

  async textToSpeech(req, res) {
    try {
      const { text, voice_id, model_id } = req.body;

      if (!text) {
        return res.status(400).json({ success: false, error: 'Parâmetro text é obrigatório' });
      }

      const result = await elevenLabsService.textToSpeech(text, {
        voiceId: voice_id,
        modelId: model_id
      });

      if (!result.success) {
        return res.json(result);
      }

      return res.json({
        success: true,
        audio_path: result.filePath,
        hash: result.hash,
        cached: result.cached,
        file_size: result.file_size,
        processing_time_ms: result.processing_time_ms
      });
    } catch (error) {
      console.error('[Conversation] textToSpeech error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao gerar áudio', fallback: 'text' });
    }
  },

  async getTTSAudio(req, res) {
    try {
      const { hash } = req.params;

      if (!hash || !/^[a-f0-9]{16}$/.test(hash)) {
        return res.status(400).json({ success: false, error: 'Hash inválido' });
      }

      const fs = require('fs');
      const path = require('path');
      const audioPath = path.join(process.cwd(), 'uploads', 'audio_cache', `${hash}.mp3`);

      if (!fs.existsSync(audioPath)) {
        return res.status(404).json({ success: false, error: 'Áudio não encontrado' });
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      const stream = fs.createReadStream(audioPath);
      stream.pipe(res);
    } catch (error) {
      console.error('[Conversation] getTTSAudio error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar áudio' });
    }
  },

  async getTTSStatus(req, res) {
    try {
      return res.json({
        success: true,
        configured: elevenLabsService.isConfigured(),
        cache: elevenLabsService.getCacheStats()
      });
    } catch (error) {
      console.error('[Conversation] getTTSStatus error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao buscar status TTS' });
    }
  },

  async formatButtons(req, res) {
    try {
      const { phone, text, buttons, type } = req.body;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      let payload;

      switch (type) {
        case 'context_selection':
          payload = whatsappButtonsService.formatContextSelectionButtons(phone);
          break;
        case 'feedback':
          payload = whatsappButtonsService.formatFeedbackButtons(phone);
          break;
        case 'menu':
          payload = whatsappButtonsService.formatMenuButtons(phone, req.body.active_context);
          break;
        case 'quiz':
          payload = whatsappButtonsService.formatQuizButtons(phone, text, buttons, { quizId: req.body.quiz_id });
          break;
        default:
          if (!text || !buttons) {
            return res.status(400).json({ success: false, error: 'Parâmetros text e buttons são obrigatórios para tipo custom' });
          }
          payload = whatsappButtonsService.formatButtonMessage(phone, text, buttons);
      }

      return res.json({ success: true, payload });
    } catch (error) {
      console.error('[Conversation] formatButtons error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao formatar botões' });
    }
  },

  async sendButtons(req, res) {
    try {
      const { phone, text, buttons } = req.body;

      if (!phone || !text || !buttons) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone, text e buttons são obrigatórios' });
      }

      const result = await whatsappButtonsService.sendButtonMessage(phone, text, buttons);
      return res.json(result);
    } catch (error) {
      console.error('[Conversation] sendButtons error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao enviar botões' });
    }
  },

  async getStateMachine(req, res) {
    try {
      const { state } = req.query;

      if (state) {
        return res.json({
          success: true,
          state,
          valid_transitions: stateMachineService.getValidTransitions(state),
          state_message: stateMachineService.getStateMessage(state)
        });
      }

      return res.json({
        success: true,
        states: stateMachineService.VALID_STATES,
        transitions: stateMachineService.TRANSITIONS
      });
    } catch (error) {
      console.error('[Conversation] getStateMachine error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  }
};

module.exports = conversationController;
