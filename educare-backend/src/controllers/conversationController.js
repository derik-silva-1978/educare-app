const pgvectorService = require('../services/pgvectorService');
const stateMachineService = require('../services/stateMachineService');
const messageBufferService = require('../services/messageBufferService');
const conversationContextService = require('../services/conversationContextService');
const elevenLabsService = require('../services/elevenLabsService');
const whatsappButtonsService = require('../services/whatsappButtonsService');

const sanitizePhone = (phone) => {
  if (!phone) return null;
  let clean = String(phone).replace(/\D/g, '');
  if (clean.length >= 10 && clean.length <= 11 && !clean.startsWith('55')) {
    clean = '55' + clean;
  }
  if (clean.length >= 12 && !clean.startsWith('+')) {
    clean = '+' + clean;
  }
  return clean || null;
};

const conversationController = {
  async getStateConfigs(req, res) {
    try {
      const { sequelize } = require('../models');
      const [configs] = await sequelize.query(
        'SELECT * FROM conversation_state_config ORDER BY ARRAY_POSITION(ARRAY[\'ENTRY\',\'ONBOARDING\',\'CONTEXT_SELECTION\',\'FREE_CONVERSATION\',\'CONTENT_FLOW\',\'QUIZ_FLOW\',\'LOG_FLOW\',\'SUPPORT\',\'FEEDBACK\',\'PAUSE\',\'EXIT\'], state)'
      );
      return res.json({ success: true, data: configs });
    } catch (error) {
      console.error('[StateConfig] getAll error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  async getStateConfig(req, res) {
    try {
      const { state } = req.params;
      const { sequelize } = require('../models');
      const [configs] = await sequelize.query(
        'SELECT * FROM conversation_state_config WHERE state = :state',
        { replacements: { state: state.toUpperCase() } }
      );
      if (!configs.length) {
        return res.status(404).json({ success: false, error: 'Estado não encontrado' });
      }
      return res.json({ success: true, data: configs[0] });
    } catch (error) {
      console.error('[StateConfig] get error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  async updateStateConfig(req, res) {
    try {
      const { state } = req.params;
      const { message_template, buttons, transitions, agent_module_types, onboarding_config, description, display_name, color, icon, is_active } = req.body;
      const { sequelize } = require('../models');

      const updates = [];
      const replacements = { state: state.toUpperCase() };

      if (message_template !== undefined) { updates.push('message_template = :message_template'); replacements.message_template = message_template; }
      if (buttons !== undefined) { updates.push('buttons = :buttons'); replacements.buttons = JSON.stringify(buttons); }
      if (transitions !== undefined) { updates.push('transitions = :transitions'); replacements.transitions = JSON.stringify(transitions); }
      if (agent_module_types !== undefined) { updates.push('agent_module_types = :agent_module_types'); replacements.agent_module_types = JSON.stringify(agent_module_types); }
      if (onboarding_config !== undefined) { updates.push('onboarding_config = :onboarding_config'); replacements.onboarding_config = JSON.stringify(onboarding_config); }
      if (description !== undefined) { updates.push('description = :description'); replacements.description = description; }
      if (display_name !== undefined) { updates.push('display_name = :display_name'); replacements.display_name = display_name; }
      if (color !== undefined) { updates.push('color = :color'); replacements.color = color; }
      if (icon !== undefined) { updates.push('icon = :icon'); replacements.icon = icon; }
      if (is_active !== undefined) { updates.push('is_active = :is_active'); replacements.is_active = is_active; }

      if (updates.length === 0) {
        return res.status(400).json({ success: false, error: 'Nenhum campo para atualizar' });
      }

      updates.push('version = version + 1');
      updates.push('updated_at = NOW()');
      if (req.userId) { updates.push('updated_by = :updated_by'); replacements.updated_by = req.userId; }

      const sql = `UPDATE conversation_state_config SET ${updates.join(', ')} WHERE state = :state RETURNING *`;
      const [result] = await sequelize.query(sql, { replacements });

      if (!result.length) {
        return res.status(404).json({ success: false, error: 'Estado não encontrado' });
      }

      if (stateMachineService.invalidateConfigCache) {
        stateMachineService.invalidateConfigCache();
      }

      return res.json({ success: true, data: result[0] });
    } catch (error) {
      console.error('[StateConfig] update error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  async getState(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const cleanPhone = sanitizePhone(phone);
      const result = await pgvectorService.getConversationState(cleanPhone);
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

      const cleanPhone = sanitizePhone(phone);
      const result = await pgvectorService.updateConversationState(cleanPhone, updates);
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

      const cleanPhone = sanitizePhone(phone);
      const result = await stateMachineService.transition(cleanPhone, to_state, additionalUpdates);

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

      const cleanPhone = sanitizePhone(phone);
      const result = await pgvectorService.saveFeedback({
        user_phone: cleanPhone,
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

      const cleanPhone = sanitizePhone(phone);
      const result = await pgvectorService.saveReport({
        user_phone: cleanPhone,
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
      const cleanPhone = sanitizePhone(phone);

      const result = await pgvectorService.getReports({
        user_phone: cleanPhone || phone,
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

      const cleanPhone = sanitizePhone(phone);
      const result = await pgvectorService.searchConversationMemory(query_embedding, cleanPhone, {
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

      const cleanPhone = sanitizePhone(phone);
      const result = await pgvectorService.saveConversationMemory({
        user_phone: cleanPhone,
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

      const cleanPhone = sanitizePhone(phone);
      const result = await messageBufferService.addMessage(cleanPhone, message);
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

      const cleanPhone = sanitizePhone(phone);
      const result = await messageBufferService.getBuffer(cleanPhone);
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

      const cleanPhone = sanitizePhone(phone);
      const result = await messageBufferService.consumeBuffer(cleanPhone);
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

      const cleanPhone = sanitizePhone(phone);
      const limit = req.query.memory_limit ? parseInt(req.query.memory_limit) : undefined;
      const result = await conversationContextService.getFullContext(cleanPhone, { limit });
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

      const cleanPhone = sanitizePhone(phone);
      const context = await conversationContextService.getFullContext(cleanPhone);
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
        const currentState = await pgvectorService.getConversationState(phone);
        const currentStateName = currentState.success ? currentState.state?.state : 'ENTRY';

        let transitionResult;
        if (currentStateName === 'ENTRY') {
          await stateMachineService.transition(phone, 'CONTEXT_SELECTION');
          transitionResult = await stateMachineService.transition(phone, 'FREE_CONVERSATION', contextResult);
        } else {
          transitionResult = await stateMachineService.transition(phone, 'FREE_CONVERSATION', contextResult);
        }
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

      const cleanPhone = sanitizePhone(phone);
      await pgvectorService.updateConversationState(cleanPhone, { audio_preference: preference });
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

      const cleanPhone = sanitizePhone(phone);
      const stateResult = await pgvectorService.getConversationState(cleanPhone);
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

      const cleanPhone = sanitizePhone(phone);
      if (check_preference && phone) {
        const stateResult = await pgvectorService.getConversationState(cleanPhone);
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

      const cleanPhone = sanitizePhone(phone);
      const stateResult = await pgvectorService.getConversationState(cleanPhone);
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

      const cleanPhone = sanitizePhone(phone);
      const stateResult = await pgvectorService.getConversationState(cleanPhone);
      const hasExistingState = stateResult.success && stateResult.state;
      const state = hasExistingState ? stateResult.state : null;

      const isReturning = hasExistingState && state.correlation_id !== null;
      let userName = null;

      const { findUserByPhone } = require('../utils/phoneUtils');
      const user = await findUserByPhone(cleanPhone);
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
  },

  async checkFeedbackTrigger(req, res) {
    try {
      const { phone, trigger_event } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const cleanPhone = sanitizePhone(phone);
      const stateResult = await pgvectorService.getConversationState(cleanPhone);
      const state = stateResult.success && stateResult.state ? stateResult.state : null;

      const feedbackStats = await conversationContextService.getFeedbackStats
        ? await (async () => {
            const { sequelize } = require('../config/database');
            const [results] = await sequelize.query(
              `SELECT COUNT(*)::INTEGER AS total, MAX(created_at) AS last_at
               FROM ux_feedback WHERE user_phone = $1`, { bind: [cleanPhone] }
            );
            return results[0] || { total: 0, last_at: null };
          })()
        : { total: 0, last_at: null };

      const hoursSinceLastFeedback = feedbackStats.last_at
        ? (Date.now() - new Date(feedbackStats.last_at).getTime()) / (1000 * 60 * 60)
        : null;

      const MIN_HOURS_BETWEEN_FEEDBACK = 24;
      const tooRecent = hoursSinceLastFeedback !== null && hoursSinceLastFeedback < MIN_HOURS_BETWEEN_FEEDBACK;

      const TRIGGER_EVENTS = ['quiz_completed', 'content_viewed', 'exit', 'pause', 'session_long'];
      const event = trigger_event || null;

      let shouldTrigger = false;
      let triggerReason = null;

      if (!tooRecent && event && TRIGGER_EVENTS.includes(event)) {
        if (event === 'quiz_completed' && feedbackStats.total < 3) {
          shouldTrigger = true;
          triggerReason = 'Feedback após conclusão de quiz';
        } else if (event === 'content_viewed' && feedbackStats.total === 0) {
          shouldTrigger = true;
          triggerReason = 'Primeiro feedback após visualizar conteúdo';
        } else if ((event === 'exit' || event === 'pause') && (hoursSinceLastFeedback === null || hoursSinceLastFeedback > 72)) {
          shouldTrigger = true;
          triggerReason = 'Feedback na saída (sem feedback recente)';
        } else if (event === 'session_long' && feedbackStats.total < 5) {
          shouldTrigger = true;
          triggerReason = 'Sessão longa, coleta de feedback';
        }
      }

      return res.json({
        success: true,
        should_trigger: shouldTrigger,
        trigger_reason: triggerReason,
        too_recent: tooRecent,
        hours_since_last: hoursSinceLastFeedback !== null ? Math.round(hoursSinceLastFeedback) : null,
        total_feedbacks: feedbackStats.total,
        feedback_message: shouldTrigger ? {
          text: 'Antes de seguir, posso te perguntar uma coisinha? ⭐\n\nComo você avalia sua experiência até agora?',
          buttons: [
            { id: 'fb_1', text: '⭐' },
            { id: 'fb_2', text: '⭐⭐' },
            { id: 'fb_3', text: '⭐⭐⭐' },
            { id: 'fb_4', text: '⭐⭐⭐⭐' },
            { id: 'fb_5', text: '⭐⭐⭐⭐⭐' }
          ]
        } : null
      });
    } catch (error) {
      console.error('[Conversation] checkFeedbackTrigger error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async saveFeedbackWithContext(req, res) {
    try {
      const { phone, score, comment, trigger_event } = req.body;

      if (!phone || !score) {
        return res.status(400).json({ success: false, error: 'Parâmetros phone e score são obrigatórios' });
      }

      if (score < 1 || score > 5) {
        return res.status(400).json({ success: false, error: 'Score deve ser entre 1 e 5' });
      }

      const cleanPhone = sanitizePhone(phone);
      const stateResult = await pgvectorService.getConversationState(cleanPhone);
      const state = stateResult.success ? stateResult.state : {};

      await pgvectorService.saveFeedback({
        user_phone: cleanPhone,
        score: parseInt(score),
        state: state.state,
        active_context: state.active_context,
        assistant_name: state.assistant_name,
        journey_week: state.journey_week,
        comment: comment || null,
        metadata: { trigger_event: trigger_event || 'manual' }
      });

      let responseText;
      if (score >= 4) {
        responseText = 'Que bom saber disso 💙\nObrigada por compartilhar.';
      } else if (score === 3) {
        responseText = 'Obrigada pelo feedback 💙\nVamos continuar melhorando!';
      } else {
        responseText = 'Obrigada por me contar 🤍\nSe quiser, pode me dizer o que posso melhorar.';
      }

      return res.json({
        success: true,
        score,
        response_text: responseText,
        ask_comment: score <= 2
      });
    } catch (error) {
      console.error('[Conversation] saveFeedbackWithContext error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async getEnrichedContext(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const cleanPhone = sanitizePhone(phone);
      const memoryLimit = req.query.memory_limit ? parseInt(req.query.memory_limit) : 5;
      const context = await conversationContextService.getFullContext(cleanPhone, { limit: memoryLimit });

      if (!context.success) {
        return res.json(context);
      }

      const activeContext = context.state?.active_context || null;
      const filteredContext = { ...context };
      if (activeContext && filteredContext.memory?.recent) {
        const filtered = filteredContext.memory.recent.filter(m =>
          !m.active_context || m.active_context === activeContext
        );
        filteredContext.memory = { recent: filtered, count: filtered.length };
      }

      const contextPrompt = conversationContextService.formatContextForPrompt(filteredContext);

      let personalizations = [];
      if (context.child) {
        if (context.child.age_months !== null && context.child.age_months !== undefined) {
          personalizations.push(`Bebê com ${context.child.age_months} meses`);
        }
        if (context.child.milestones?.length > 0) {
          const delayed = context.child.milestones.filter(m => m.status === 'delayed');
          if (delayed.length > 0) {
            personalizations.push(`Atenção em: ${delayed.map(m => m.domain).join(', ')}`);
          }
        }
      }
      if (context.feedback?.avg_score && parseFloat(context.feedback.avg_score) < 3) {
        personalizations.push('Usuário com experiência abaixo da média - priorizar empatia');
      }

      const enrichedPrompt = contextPrompt +
        (personalizations.length > 0 ? '\n\nPERSONALIZAÇÕES: ' + personalizations.join(' | ') : '');

      return res.json({
        success: true,
        prompt: enrichedPrompt,
        context_summary: {
          has_user: !!context.user,
          user_name: context.user?.name || null,
          has_child: !!context.child,
          child_age_months: context.child?.age_months || null,
          memory_count: context.memory?.count || 0,
          state: context.state?.current_state || null,
          active_context: context.state?.active_context || null,
          assistant_name: context.state?.assistant_name || null,
          audio_preference: context.state?.audio_preference || 'text',
          correlation_id: context.state?.correlation_id || null,
          personalizations
        }
      });
    } catch (error) {
      console.error('[Conversation] getEnrichedContext error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async saveSessionSummary(req, res) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const cleanPhone = sanitizePhone(phone);
      const stateResult = await pgvectorService.getConversationState(cleanPhone);
      const state = stateResult.success ? stateResult.state : null;

      if (!state || !state.correlation_id) {
        return res.json({ success: true, skipped: true, reason: 'Sem sessão ativa para resumir' });
      }

      const { sequelize } = require('../config/database');

      const sessionStart = state.created_at || state.last_interaction_at;

      const [interactions] = await sequelize.query(`
        SELECT role, content, interaction_type, active_context, created_at
        FROM conversation_memory
        WHERE user_phone = $1
          AND created_at >= $2::timestamptz
        ORDER BY created_at DESC
        LIMIT 30
      `, { bind: [cleanPhone, sessionStart] });

      if (!interactions || interactions.length === 0) {
        return res.json({ success: true, skipped: true, reason: 'Sem interações nesta sessão' });
      }

      const reversed = [...interactions].reverse();

      const topics = new Set();
      const contexts = new Set();
      let userMessageCount = 0;
      let assistantMessageCount = 0;

      reversed.forEach(i => {
        if (i.role === 'user_message') userMessageCount++;
        if (i.role === 'assistant_response') assistantMessageCount++;
        if (i.active_context) contexts.add(i.active_context);
        if (i.interaction_type && i.interaction_type !== 'conversation') topics.add(i.interaction_type);
      });

      const lastMessages = reversed.slice(-6).map(i => {
        const role = i.role === 'user_message' ? 'U' : 'A';
        return `${role}: ${i.content.substring(0, 80)}`;
      });

      const summary = {
        correlation_id: state.correlation_id,
        contexts_used: Array.from(contexts),
        interaction_types: Array.from(topics),
        message_counts: { user: userMessageCount, assistant: assistantMessageCount },
        last_exchange_preview: lastMessages.join('\n'),
        active_context_at_end: state.active_context || null,
        assistant_at_end: state.assistant_name || null
      };

      await pgvectorService.saveConversationMemory({
        user_phone: cleanPhone,
        role: 'assistant_response',
        content: `[SESSION_SUMMARY] Sessão ${state.correlation_id}: ${userMessageCount} msgs do usuário, contextos: ${Array.from(contexts).join(',')}. Tópicos: ${Array.from(topics).join(',') || 'conversa livre'}.`,
        interaction_type: 'conversation',
        active_context: state.active_context,
        assistant_name: state.assistant_name,
        metadata: { type: 'session_summary', ...summary }
      });

      return res.json({
        success: true,
        summary
      });
    } catch (error) {
      console.error('[Conversation] saveSessionSummary error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async getAnalytics(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
      }

      const cleanPhone = sanitizePhone(phone);
      const { sequelize } = require('../config/database');

      const [memoryStats] = await sequelize.query(`
        SELECT
          COUNT(*)::INTEGER AS total_interactions,
          COUNT(CASE WHEN role = 'user_message' THEN 1 END)::INTEGER AS user_messages,
          COUNT(CASE WHEN role = 'assistant_response' THEN 1 END)::INTEGER AS assistant_messages,
          COUNT(DISTINCT active_context)::INTEGER AS contexts_used,
          COUNT(CASE WHEN interaction_type = 'quiz' THEN 1 END)::INTEGER AS quiz_interactions,
          COUNT(CASE WHEN interaction_type = 'journey' THEN 1 END)::INTEGER AS journey_interactions,
          COUNT(CASE WHEN interaction_type = 'feedback' THEN 1 END)::INTEGER AS feedback_interactions,
          MIN(created_at) AS first_interaction,
          MAX(created_at) AS last_interaction
        FROM conversation_memory
        WHERE user_phone = $1
      `, { bind: [cleanPhone] });

      const [feedbackStats] = await sequelize.query(`
        SELECT
          COUNT(*)::INTEGER AS total_feedbacks,
          ROUND(AVG(score), 2) AS avg_score,
          MIN(score)::INTEGER AS min_score,
          MAX(score)::INTEGER AS max_score,
          MAX(created_at) AS last_feedback
        FROM ux_feedback
        WHERE user_phone = $1
      `, { bind: [cleanPhone] });

      const [reportStats] = await sequelize.query(`
        SELECT
          COUNT(*)::INTEGER AS total_reports,
          COUNT(CASE WHEN type = 'problem' THEN 1 END)::INTEGER AS problems,
          COUNT(CASE WHEN type = 'suggestion' THEN 1 END)::INTEGER AS suggestions,
          COUNT(CASE WHEN status = 'open' THEN 1 END)::INTEGER AS open_reports
        FROM support_reports
        WHERE user_phone = $1
      `, { bind: [cleanPhone] });

      const stateResult = await pgvectorService.getConversationState(cleanPhone);
      const state = stateResult.success ? stateResult.state : null;

      let sessionDuration = null;
      if (state?.correlation_id && state?.created_at) {
        const [sessionTiming] = await sequelize.query(`
          SELECT
            MIN(created_at) AS session_start,
            MAX(created_at) AS session_end
          FROM conversation_memory
          WHERE user_phone = $1 AND created_at >= $2::timestamptz
        `, { bind: [cleanPhone, state.created_at] });

        if (sessionTiming[0]?.session_start && sessionTiming[0]?.session_end) {
          const start = new Date(sessionTiming[0].session_start);
          const end = new Date(sessionTiming[0].session_end);
          sessionDuration = Math.max(0, Math.round((end - start) / 1000 / 60));
        }
      }

      return res.json({
        success: true,
        phone,
        current_session: {
          state: state?.state || null,
          active_context: state?.active_context || null,
          correlation_id: state?.correlation_id || null,
          session_duration_minutes: sessionDuration,
          audio_preference: state?.audio_preference || 'text'
        },
        interactions: memoryStats[0] || {},
        feedback: feedbackStats[0] || {},
        reports: reportStats[0] || {}
      });
    } catch (error) {
      console.error('[Conversation] getAnalytics error:', error.message);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  },

  async healthCheck(req, res) {
    try {
      const { sequelize, getPoolStatus, getAuthStatus, isAuthError } = require('../config/database');
      const services = {};

      try {
        await sequelize.query('SELECT 1');
        services.database = { status: 'ok' };
      } catch (err) {
        const authFail = isAuthError(err);
        services.database = {
          status: 'error',
          detail: err.message,
          is_auth_error: authFail,
          hint: authFail ? 'Senha do DB_PASSWORD pode estar incorreta ou dessincronizada. Verifique no Portainer (Stack Editor).' : undefined
        };
      }

      const authStatus = getAuthStatus();
      services.auth = {
        status: authStatus.auth_healthy ? 'ok' : 'warning',
        db_user: authStatus.db_user,
        db_name: authStatus.db_name,
        db_host: authStatus.db_host,
        auth_failure_count: authStatus.auth_failure_count,
        last_auth_failure: authStatus.last_auth_failure,
      };

      services.pool = getPoolStatus();

      try {
        const [stateTable] = await sequelize.query(
          `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversation_states') AS exists`
        );
        services.state_machine = {
          status: stateTable[0]?.exists ? 'ok' : 'error',
          detail: stateTable[0]?.exists ? 'conversation_states table exists' : 'conversation_states table not found'
        };
      } catch (err) {
        services.state_machine = { status: 'error', detail: err.message };
      }

      try {
        const [memoryTable] = await sequelize.query(
          `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversation_memory') AS exists`
        );
        services.memory = {
          status: memoryTable[0]?.exists ? 'ok' : 'error',
          detail: memoryTable[0]?.exists ? 'conversation_memory table exists' : 'conversation_memory table not found'
        };
      } catch (err) {
        services.memory = { status: 'error', detail: err.message };
      }

      try {
        const [pgvResult] = await sequelize.query(
          `SELECT 1 FROM pg_extension WHERE extname = 'vector'`
        );
        services.pgvector = {
          status: pgvResult.length > 0 ? 'ok' : 'unavailable',
          detail: pgvResult.length > 0 ? 'pgvector extension active (uses same DB connection)' : 'pgvector extension not installed',
          same_credentials_as_db: true
        };
      } catch (err) {
        services.pgvector = { status: 'error', detail: err.message, same_credentials_as_db: true };
      }

      try {
        const qdrantUrl = process.env.QDRANT_URL;
        const qdrantKey = process.env.QDRANT_API_KEY;
        if (qdrantUrl && qdrantKey) {
          services.qdrant = {
            status: 'configured',
            detail: 'Qdrant is an external vector DB (separate credentials from PostgreSQL)',
            url_set: true,
            api_key_set: true,
            separate_from_postgres: true
          };
        } else {
          services.qdrant = {
            status: 'not_configured',
            detail: 'QDRANT_URL or QDRANT_API_KEY not set',
            url_set: !!qdrantUrl,
            api_key_set: !!qdrantKey,
            separate_from_postgres: true
          };
        }
      } catch (err) {
        services.qdrant = { status: 'error', detail: err.message };
      }

      try {
        const configured = elevenLabsService.isConfigured();
        services.tts = {
          status: configured ? 'ok' : 'error',
          detail: configured ? 'ElevenLabs configured' : 'ElevenLabs API key not set'
        };
      } catch (err) {
        services.tts = { status: 'error', detail: err.message };
      }

      services.buffer = { status: 'ok', detail: 'Message buffer service available' };

      services.credential_map = {
        postgresql: 'DB_USERNAME + DB_PASSWORD (Sequelize)',
        pgvector: 'Same as PostgreSQL (extension in same DB)',
        qdrant: 'QDRANT_URL + QDRANT_API_KEY (external service)',
        n8n_workflow: 'All API calls use EDUCARE_API_KEY header (no direct DB access from n8n)',
        n8n_internal_db: 'DB_POSTGRESDB_USER + DB_POSTGRESDB_PASSWORD (separate n8n database)',
      };

      const hasErrors = Object.values(services).some(s => s?.status === 'error');
      const hasWarnings = Object.values(services).some(s => s?.status === 'warning');

      return res.json({
        success: true,
        overall: hasErrors ? 'degraded' : hasWarnings ? 'warning' : 'healthy',
        services,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Conversation] healthCheck error:', error.message);
      return res.status(500).json({
        success: false,
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    }
  },

  async processOnboarding(req, res) {
    try {
      const { phone, message } = req.body;
      if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone é obrigatório' });
      }

      const stateResult = await pgvectorService.getConversationState(phone);
      if (!stateResult.success || !stateResult.state) {
        return res.status(404).json({ success: false, error: 'Estado não encontrado' });
      }

      const currentState = stateResult.state;
      if (currentState.state !== 'ONBOARDING') {
        return res.status(400).json({ success: false, error: 'Usuário não está em ONBOARDING', current_state: currentState.state });
      }

      const onboardingStep = currentState.onboarding_step || 'ASKING_NAME';
      const result = stateMachineService.resolveOnboardingStep(onboardingStep, message);

      if (!result.valid) {
        return res.json({
          success: true,
          onboarding_step: onboardingStep,
          retry: true,
          message: result.error
        });
      }

      const updates = {
        ...result.updates,
        onboarding_step: result.next_step
      };

      if (result.next_step === 'COMPLETE') {
        const genderPronoun = result.updates?.baby_gender === 'female' ? 'dela' : (currentState.baby_gender === 'female' ? 'dela' : 'dele');
        const babyName = result.updates?.baby_name || currentState.baby_name || 'bebê';
        const completeMsg = stateMachineService.getOnboardingMessage('COMPLETE', {
          baby_name: babyName,
          baby_gender: result.updates?.baby_gender || currentState.baby_gender,
          age_text: result.age_text
        });

        await pgvectorService.updateConversationState(phone, {
          ...updates,
          state: 'CONTEXT_SELECTION',
          onboarding_step: null
        });

        return res.json({
          success: true,
          onboarding_step: 'COMPLETE',
          onboarding_completed: true,
          message: completeMsg?.text,
          next_state: 'CONTEXT_SELECTION',
          baby_data: {
            name: babyName,
            gender: result.updates?.baby_gender || currentState.baby_gender,
            birthdate: result.updates?.baby_birthdate || currentState.baby_birthdate,
            age_text: result.age_text,
            age_weeks: result.age_weeks,
            age_months: result.age_months
          },
          context_selection: stateMachineService.getStateMessage('CONTEXT_SELECTION')
        });
      }

      await pgvectorService.updateConversationState(phone, updates);

      const nextMsg = stateMachineService.getOnboardingMessage(result.next_step, {
        ...currentState,
        ...result.updates
      });

      return res.json({
        success: true,
        onboarding_step: result.next_step,
        message: nextMsg?.text,
        buttons: nextMsg?.buttons || [],
        baby_data: {
          name: result.updates?.baby_name || currentState.baby_name,
          gender: result.updates?.baby_gender || currentState.baby_gender
        }
      });
    } catch (error) {
      console.error('[Conversation] processOnboarding error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  async getOnboardingStatus(req, res) {
    try {
      const phone = req.query.phone;
      if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone é obrigatório' });
      }
      const stateResult = await pgvectorService.getConversationState(phone);
      if (!stateResult.success || !stateResult.state) {
        return res.json({ success: true, onboarding_completed: false, needs_onboarding: true });
      }
      const state = stateResult.state;
      return res.json({
        success: true,
        onboarding_completed: !!state.onboarding_completed,
        needs_onboarding: !state.onboarding_completed && state.state === 'ENTRY',
        current_step: state.state === 'ONBOARDING' ? (state.onboarding_step || 'ASKING_NAME') : null,
        baby_data: state.onboarding_completed ? {
          name: state.baby_name,
          gender: state.baby_gender,
          birthdate: state.baby_birthdate
        } : null
      });
    } catch (error) {
      console.error('[Conversation] getOnboardingStatus error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  async getReportImage(req, res) {
    try {
      const phone = req.params.phone;
      if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone é obrigatório' });
      }
      const reportImageService = require('../services/reportImageService');

      const stateResult = await pgvectorService.getConversationState(phone);
      let reportData;
      if (stateResult.success && stateResult.state && stateResult.state.baby_name) {
        const state = stateResult.state;
        const ageWeeks = state.journey_week || 0;
        reportData = reportImageService.getDefaultReportData(state.baby_name, state.baby_gender, ageWeeks);
      } else {
        reportData = reportImageService.getDefaultReportData('Bebê', 'male', 16);
      }

      const format = req.query.format;
      if (format === 'ascii') {
        const ascii = reportImageService.generateAsciiReport(reportData);
        return res.json({ success: true, report: ascii });
      }

      const imageBuffer = await reportImageService.generateReportImage(reportData);
      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'no-cache');
      return res.send(imageBuffer);
    } catch (error) {
      console.error('[Conversation] getReportImage error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = conversationController;
