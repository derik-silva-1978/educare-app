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
  CONTENT_FLOW: {
    text: 'Separei um conteúdo especial para esta semana 🌱\nÉ rapidinho e pode te ajudar bastante.',
    buttons: [
      { id: 'content_view', text: '▶️ Ver conteúdo' },
      { id: 'content_quiz', text: '🧩 Fazer um quiz' },
      { id: 'content_pause', text: '⏸️ Voltar depois' }
    ]
  },
  QUIZ_FLOW: {
    text: 'Vamos lá! 🧩\nVou te fazer algumas perguntas rápidas.\n\nNão existe resposta certa ou errada 💙',
    buttons: []
  },
  LOG_FLOW: {
    text: 'Vamos anotar isso rapidinho 📝\nO que você gostaria de registrar?',
    buttons: [
      { id: 'log_biometrics', text: '📏 Peso/altura' },
      { id: 'log_sleep', text: '🌙 Sono' },
      { id: 'log_vaccine', text: '💉 Vacina' }
    ]
  },
  SUPPORT: {
    text: 'Se algo não funcionou como esperado, você pode me contar 🛠️',
    buttons: [
      { id: 'support_problem', text: '⚠️ Reportar problema' },
      { id: 'support_suggestion', text: '💡 Sugerir melhoria' },
      { id: 'support_back', text: '↩️ Voltar' }
    ]
  },
  FEEDBACK: {
    text: 'Antes de você sair, como foi sua experiência até agora? ⭐',
    buttons: [
      { id: 'fb_1', text: '⭐ 1-2 estrelas' },
      { id: 'fb_3', text: '⭐⭐⭐ 3 estrelas' },
      { id: 'fb_5', text: '⭐⭐⭐⭐⭐ 4-5' }
    ]
  },
  PAUSE: {
    text: 'Tudo bem 💙\nQuando quiser, é só me chamar.',
    buttons: []
  },
  EXIT: {
    text: 'Estarei por aqui sempre que precisar 🌷',
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

function resolveActionButton(buttonId) {
  const mapping = {
    action_quiz: { to_state: 'QUIZ_FLOW' },
    action_content: { to_state: 'CONTENT_FLOW' },
    action_change: { to_state: 'CONTEXT_SELECTION' },
    action_exit: { to_state: 'PAUSE' },
    action_log: { to_state: 'LOG_FLOW' },
    action_support: { to_state: 'SUPPORT' },
    content_view: { action: 'view_content' },
    content_quiz: { to_state: 'QUIZ_FLOW' },
    content_pause: { to_state: 'PAUSE' },
    log_biometrics: { action: 'collect_log', log_type: 'biometrics' },
    log_sleep: { action: 'collect_log', log_type: 'sleep' },
    log_vaccine: { action: 'collect_log', log_type: 'vaccine' },
    support_problem: { action: 'collect_report', report_type: 'problem' },
    support_suggestion: { action: 'collect_report', report_type: 'suggestion' },
    support_back: { to_state: 'FREE_CONVERSATION' }
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
  resolveFeedbackScore,
  resolveActionButton
};
