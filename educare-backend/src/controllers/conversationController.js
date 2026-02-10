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
  },

  async resolveButton(req, res) {
    try {
      const { phone, button_id } = req.body;

      if (!phone || !button_id) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone e button_id são obrigatórios' });
      }

      const contextResult = stateMachineService.resolveContextSelection(button_id);
      if (contextResult) {
        const transitionResult = await stateMachineService.transition(phone, 'FREE_CONVERSATION', contextResult);
        return res.json({ ...transitionResult, action: 'context_selected', context: contextResult });
      }

      const feedbackScore = stateMachineService.resolveFeedbackScore(button_id);
      if (feedbackScore !== null) {
        const stateResult = await pgvectorService.getConversationState(phone);
        const state = stateResult.success ? stateResult.state : {};
        await pgvectorService.saveFeedback({
          user_phone: phone,
          score: feedbackScore,
          state: state.state,
          active_context: state.active_context,
          assistant_name: state.assistant_name,
          journey_week: state.journey_week
        });
        return res.json({ success: true, action: 'feedback_saved', score: feedbackScore });
      }

      const actionResult = stateMachineService.resolveActionButton(button_id);
      if (actionResult) {
        if (actionResult.to_state) {
          const transitionResult = await stateMachineService.transition(phone, actionResult.to_state);
          return res.json({ ...transitionResult, action: 'state_transition', button_action: actionResult });
        }
        return res.json({ success: true, action: actionResult.action, button_action: actionResult });
      }

      return res.json({ success: false, error: 'Botão não reconhecido', button_id });
    } catch (error) {
      console.error('[Conversation] resolveButton error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao resolver botão' });
    }
  },

  async setAudioPreference(req, res) {
    try {
      const { phone, preference } = req.body;

      if (!phone || !preference) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone e preference são obrigatórios' });
      }

      if (!['text', 'audio'].includes(preference)) {
        return res.status(400).json({ success: false, error: 'Preferência deve ser "text" ou "audio"' });
      }

      await pgvectorService.updateConversationState(phone, { audio_preference: preference });
      return res.json({ success: true, phone, audio_preference: preference });
    } catch (error) {
      console.error('[Conversation] setAudioPreference error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async getAudioPreference(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const stateResult = await pgvectorService.getConversationState(phone);
      const preference = stateResult.success && stateResult.state
        ? stateResult.state.audio_preference || 'text'
        : 'text';

      return res.json({ success: true, phone, audio_preference: preference });
    } catch (error) {
      console.error('[Conversation] getAudioPreference error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async ttsForWhatsApp(req, res) {
    try {
      const { text, phone, check_preference } = req.body;

      if (!text) {
        return res.status(400).json({ success: false, error: 'Parâmetro text é obrigatório' });
      }

      if (check_preference && phone) {
        const stateResult = await pgvectorService.getConversationState(phone);
        const pref = stateResult.success && stateResult.state
          ? stateResult.state.audio_preference || 'text'
          : 'text';

        if (pref === 'text') {
          return res.json({ success: true, action: 'skip_audio', reason: 'Usuário prefere texto', audio_preference: 'text' });
        }
      }

      const result = await elevenLabsService.textToSpeech(text);

      if (!result.success) {
        return res.json({ success: false, fallback: 'text', error: result.error });
      }

      const baseUrl = process.env.BASE_URL || process.env.BACKEND_URL || `https://${req.get('host')}`;
      const audioUrl = `${baseUrl}/api/conversation/tts/audio/${result.hash}`;

      return res.json({
        success: true,
        audio_url: audioUrl,
        hash: result.hash,
        cached: result.cached,
        processing_time_ms: result.processing_time_ms,
        send_via: 'evolution_api',
        media_type: 'audio/mpeg'
      });
    } catch (error) {
      console.error('[Conversation] ttsForWhatsApp error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno ao gerar áudio', fallback: 'text' });
    }
  },

  async getContextualMenu(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const stateResult = await pgvectorService.getConversationState(phone);
      const state = stateResult.success && stateResult.state ? stateResult.state : null;
      const currentState = state?.state || 'ENTRY';
      const activeContext = state?.active_context || null;

      const stateMessage = stateMachineService.getStateMessage(currentState);

      let menuButtons = [];
      let menuText = 'Como posso te ajudar agora? ✨';

      if (currentState === 'FREE_CONVERSATION' || currentState === 'CONTENT_FLOW' || currentState === 'QUIZ_FLOW') {
        menuButtons = [
          { id: 'action_content', text: '📚 Ver conteúdos da jornada' },
          { id: 'action_quiz', text: '🧩 Responder um quiz' },
          { id: 'action_log', text: '📝 Registrar informações' },
          { id: 'action_support', text: '🛠️ Reportar problema' }
        ];

        if (activeContext) {
          menuButtons.push({ id: 'action_change', text: '🔄 Mudar contexto' });
        }
      } else if (currentState === 'ENTRY' || currentState === 'CONTEXT_SELECTION') {
        menuText = 'Sobre o que você quer falar agora? 💬';
        menuButtons = [
          { id: 'ctx_child', text: '👶 Sobre meu bebê' },
          { id: 'ctx_mother', text: '💚 Sobre mim' }
        ];
      } else if (currentState === 'LOG_FLOW') {
        menuText = 'O que você gostaria de registrar? 📝';
        menuButtons = [
          { id: 'log_biometrics', text: '📏 Peso/altura' },
          { id: 'log_sleep', text: '🌙 Sono' },
          { id: 'log_vaccine', text: '💉 Vacina' }
        ];
      } else if (currentState === 'SUPPORT') {
        menuText = 'Como posso ajudar? 🛠️';
        menuButtons = [
          { id: 'support_problem', text: '⚠️ Reportar problema' },
          { id: 'support_suggestion', text: '💡 Sugerir melhoria' },
          { id: 'support_back', text: '↩️ Voltar' }
        ];
      } else if (currentState === 'FEEDBACK') {
        menuText = 'Como foi sua experiência até agora? ⭐';
        menuButtons = [
          { id: 'fb_1', text: '⭐ 1-2 estrelas' },
          { id: 'fb_3', text: '⭐⭐⭐ 3 estrelas' },
          { id: 'fb_5', text: '⭐⭐⭐⭐⭐ 4-5' }
        ];
      }

      return res.json({
        success: true,
        phone,
        current_state: currentState,
        active_context: activeContext,
        assistant_name: state?.assistant_name || null,
        state_message: stateMessage,
        contextual_menu: {
          text: menuText,
          buttons: menuButtons
        }
      });
    } catch (error) {
      console.error('[Conversation] getContextualMenu error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async getWelcome(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const stateResult = await pgvectorService.getConversationState(phone);
      const hasExistingState = stateResult.success && stateResult.state;
      const state = hasExistingState ? stateResult.state : null;

      const isReturning = hasExistingState && state.correlation_id !== null;
      let userName = null;

      const { findUserByPhone } = require('../utils/phoneUtils');
      const user = await findUserByPhone(phone);
      if (user) {
        userName = user.name?.split(' ')[0] || null;
      }

      if (!isReturning) {
        const welcomeText = userName
          ? `Oi, ${userName}! Eu sou o TitiNauta 🚀👶\nVou te acompanhar na jornada de desenvolvimento, passo a passo.\n\nAqui você pode:\n✨ acompanhar o desenvolvimento\n✨ responder quizzes rápidos\n✨ receber dicas personalizadas\n\nPra começar, me conta:`
          : 'Oi! Eu sou o TitiNauta 🚀👶\nVou te acompanhar na jornada de desenvolvimento, passo a passo.\n\nAqui você pode:\n✨ acompanhar o desenvolvimento\n✨ responder quizzes rápidos\n✨ receber dicas personalizadas\n\nPra começar, me conta:';

        return res.json({
          success: true,
          type: 'first_visit',
          text: welcomeText,
          buttons: [
            { id: 'ctx_child', text: '👶 Sobre meu bebê' },
            { id: 'ctx_mother', text: '💚 Sobre mim' }
          ]
        });
      }

      const activeContext = state?.active_context;
      const contextLabel = activeContext === 'child' ? 'seu bebê 👶' : activeContext === 'mother' ? 'você 💚' : null;

      let welcomeBack = userName ? `Que bom te ver de volta, ${userName}! 💙` : 'Que bom te ver de volta! 💙';

      if (contextLabel) {
        welcomeBack += `\nDa última vez estávamos falando sobre ${contextLabel}`;
        return res.json({
          success: true,
          type: 'returning_with_context',
          text: welcomeBack + '\n\nQuer continuar ou mudar de assunto?',
          active_context: activeContext,
          buttons: [
            { id: 'action_continue', text: '▶️ Continuar' },
            { id: 'action_change', text: '🔄 Mudar contexto' }
          ]
        });
      }

      return res.json({
        success: true,
        type: 'returning_no_context',
        text: welcomeBack + '\n\nSobre o que você quer falar agora?',
        buttons: [
          { id: 'ctx_child', text: '👶 Sobre meu bebê' },
          { id: 'ctx_mother', text: '💚 Sobre mim' }
        ]
      });
    } catch (error) {
      console.error('[Conversation] getWelcome error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  }
};

module.exports = conversationController;
