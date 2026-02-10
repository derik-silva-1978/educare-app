const pgvectorService = require('./pgvectorService');

const VALID_STATES = [
  'ENTRY',
  'CONTEXT_SELECTION',
  'FREE_CONVERSATION',
  'CONTENT_FLOW',
  'QUIZ_FLOW',
  'LOG_FLOW',
  'SUPPORT',
  'FEEDBACK',
  'PAUSE',
  'EXIT'
];

const TRANSITIONS = {
  ENTRY: ['CONTEXT_SELECTION', 'EXIT'],
  CONTEXT_SELECTION: ['FREE_CONVERSATION', 'CONTENT_FLOW', 'QUIZ_FLOW', 'EXIT'],
  FREE_CONVERSATION: ['CONTEXT_SELECTION', 'CONTENT_FLOW', 'QUIZ_FLOW', 'LOG_FLOW', 'SUPPORT', 'FEEDBACK', 'PAUSE', 'EXIT'],
  CONTENT_FLOW: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'QUIZ_FLOW', 'FEEDBACK', 'PAUSE', 'EXIT'],
  QUIZ_FLOW: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'CONTENT_FLOW', 'FEEDBACK', 'PAUSE', 'EXIT'],
  LOG_FLOW: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'FEEDBACK', 'EXIT'],
  SUPPORT: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'FEEDBACK', 'EXIT'],
  FEEDBACK: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'PAUSE', 'EXIT'],
  PAUSE: ['ENTRY', 'CONTEXT_SELECTION', 'FREE_CONVERSATION', 'EXIT'],
  EXIT: ['ENTRY']
};

const CONTEXT_MESSAGES = {
  ENTRY: {
    text: 'Olá! 😊 Sou o TitiNauta, seu assistente no Educare+.\n\nSobre o que você quer falar agora? 💬',
    buttons: [
      { id: 'ctx_child', text: '👶 Sobre meu bebê' },
      { id: 'ctx_mother', text: '💚 Sobre mim (saúde)' }
    ]
  },
  CONTEXT_SELECTION: {
    text: 'Sobre o que você quer falar agora? 💬',
    buttons: [
      { id: 'ctx_child', text: '👶 Sobre meu bebê' },
      { id: 'ctx_mother', text: '💚 Sobre mim (saúde)' }
    ]
  },
  FREE_CONVERSATION: {
    text: 'Pode me contar sua dúvida! Estou aqui para ajudar. 💜',
    buttons: [
      { id: 'action_quiz', text: '📝 Fazer quiz' },
      { id: 'action_content', text: '📚 Ver conteúdos' },
      { id: 'action_change', text: '🔄 Mudar contexto' },
      { id: 'action_exit', text: '👋 Sair' }
    ]
  },
  FEEDBACK: {
    text: 'Antes de você sair, como foi sua experiência até agora? ⭐',
    buttons: [
      { id: 'fb_1', text: '⭐ 1' },
      { id: 'fb_2', text: '⭐⭐ 2' },
      { id: 'fb_3', text: '⭐⭐⭐ 3' },
      { id: 'fb_4', text: '⭐⭐⭐⭐ 4' },
      { id: 'fb_5', text: '⭐⭐⭐⭐⭐ 5' }
    ]
  },
  PAUSE: {
    text: 'Tudo bem! Estarei aqui quando quiser voltar. 💜\n\nÉ só me mandar uma mensagem!',
    buttons: []
  },
  EXIT: {
    text: 'Obrigado por usar o Educare+! 💜\n\nFoi ótimo conversar com você. Até a próxima! 👋',
    buttons: []
  }
};

function isValidTransition(fromState, toState) {
  if (!TRANSITIONS[fromState]) return false;
  return TRANSITIONS[fromState].includes(toState);
}

function getValidTransitions(currentState) {
  return TRANSITIONS[currentState] || [];
}

function getStateMessage(state) {
  return CONTEXT_MESSAGES[state] || null;
}

async function transition(userPhone, toState, additionalUpdates = {}) {
  if (!VALID_STATES.includes(toState)) {
    return {
      success: false,
      error: `Estado inválido: ${toState}`,
      valid_states: VALID_STATES
    };
  }

  const currentStateResult = await pgvectorService.getConversationState(userPhone);
  const currentState = currentStateResult.success && currentStateResult.state
    ? currentStateResult.state.state
    : null;

  if (currentState && !isValidTransition(currentState, toState)) {
    return {
      success: false,
      error: `Transição inválida: ${currentState} → ${toState}`,
      current_state: currentState,
      valid_transitions: getValidTransitions(currentState)
    };
  }

  const updates = {
    state: toState,
    ...additionalUpdates,
    updated_at: new Date().toISOString()
  };

  if (toState === 'ENTRY' || toState === 'EXIT') {
    updates.active_context = null;
    updates.assistant_name = null;
    updates.quiz_session_id = null;
  }

  if (toState === 'CONTEXT_SELECTION') {
    updates.quiz_session_id = null;
  }

  const result = await pgvectorService.updateConversationState(userPhone, updates);

  if (!result.success) {
    return result;
  }

  const stateMessage = getStateMessage(toState);

  return {
    success: true,
    previous_state: currentState || 'NEW',
    current_state: toState,
    state_message: stateMessage,
    state_data: result.state
  };
}

function resolveContextSelection(buttonId) {
  const mapping = {
    ctx_child: { active_context: 'child', assistant_name: 'TitiNauta' },
    ctx_mother: { active_context: 'mother', assistant_name: 'TitiNauta Materna' },
    '1': { active_context: 'child', assistant_name: 'TitiNauta' },
    '2': { active_context: 'mother', assistant_name: 'TitiNauta Materna' }
  };
  return mapping[buttonId] || null;
}

function resolveFeedbackScore(buttonId) {
  const mapping = {
    fb_1: 1, fb_2: 2, fb_3: 3, fb_4: 4, fb_5: 5,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
  };
  return mapping[buttonId] || null;
}

module.exports = {
  VALID_STATES,
  TRANSITIONS,
  isValidTransition,
  getValidTransitions,
  getStateMessage,
  transition,
  resolveContextSelection,
  resolveFeedbackScore
};
