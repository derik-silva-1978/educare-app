const crypto = require('crypto');
const pgvectorService = require('./pgvectorService');

const VALID_STATES = [
  'ENTRY',
  'ONBOARDING',
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
  ENTRY: ['ONBOARDING', 'CONTEXT_SELECTION'],
  ONBOARDING: ['CONTEXT_SELECTION', 'PAUSE', 'EXIT'],
  CONTEXT_SELECTION: ['FREE_CONVERSATION', 'CONTENT_FLOW', 'QUIZ_FLOW', 'LOG_FLOW'],
  FREE_CONVERSATION: ['CONTEXT_SELECTION', 'CONTENT_FLOW', 'QUIZ_FLOW', 'LOG_FLOW', 'SUPPORT', 'FEEDBACK', 'PAUSE', 'EXIT'],
  CONTENT_FLOW: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'QUIZ_FLOW', 'PAUSE'],
  QUIZ_FLOW: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'FEEDBACK', 'PAUSE'],
  LOG_FLOW: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'PAUSE'],
  SUPPORT: ['CONTEXT_SELECTION', 'FEEDBACK', 'EXIT'],
  FEEDBACK: ['CONTEXT_SELECTION', 'FREE_CONVERSATION', 'EXIT'],
  PAUSE: ['CONTEXT_SELECTION', 'FREE_CONVERSATION', 'ONBOARDING'],
  EXIT: ['ENTRY']
};

const CONTEXT_MESSAGES = {
  ENTRY: {
    text: 'Olá! 😊 Sou o TitiNauta, seu assistente no Educare+.\n\nSobre o que você quer falar agora? 💬',
    buttons: [
      { id: 'ctx_child', text: '👶 Sobre meu bebê' },
      { id: 'ctx_mother', text: '💚 Sobre mim' }
    ]
  },
  ONBOARDING: {
    text: 'Oi! Eu sou o TitiNauta 🚀👶\nVou te acompanhar na jornada de desenvolvimento do seu bebê!\n\nPra começar, me conta: *qual o nome do seu bebê?*',
    buttons: []
  },
  CONTEXT_SELECTION: {
    text: 'Sobre o que você quer falar agora? 💬',
    buttons: [
      { id: 'ctx_child', text: '👶 Sobre meu bebê' },
      { id: 'ctx_mother', text: '💚 Sobre mim' }
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

const ONBOARDING_MESSAGES = {
  ASKING_NAME: {
    text: 'Oi! Eu sou o TitiNauta 🚀👶\nVou te acompanhar na jornada de desenvolvimento do seu bebê!\n\nPra começar, me conta: *qual o nome do seu bebê?*'
  },
  ASKING_GENDER: {
    text: (name) => `Que nome lindo! 💙\nO ${name} é menino ou menina?`,
    buttons: [
      { id: 'gender_male', text: '👦 Menino' },
      { id: 'gender_female', text: '👧 Menina' }
    ]
  },
  ASKING_BIRTHDATE: {
    text: (name) => `Perfeito! 💙\nQuando o ${name} nasceu?\nMe manda a data assim: *DD/MM/AAAA*`
  },
  COMPLETE: {
    text: (name, age, genderPronoun) => `Maravilha! O ${name} tem ${age} 🎉\nJá preparei tudo pra acompanhar o desenvolvimento ${genderPronoun}!`
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

  if (toState === 'ONBOARDING') {
    updates.onboarding_step = 'ASKING_NAME';
    updates.correlation_id = crypto.randomUUID();
  }

  if (toState === 'ENTRY') {
    updates.active_context = null;
    updates.assistant_name = null;
    updates.quiz_session_id = null;
    updates.correlation_id = crypto.randomUUID();
  }

  if (toState === 'EXIT') {
    updates.active_context = null;
    updates.assistant_name = null;
    updates.quiz_session_id = null;
    updates.metadata = { ...(updates.metadata || {}), session_ended_at: new Date().toISOString() };
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

function resolveOnboardingStep(currentStep, userInput) {
  switch (currentStep) {
    case 'ASKING_NAME': {
      const name = (userInput || '').trim();
      if (name.length < 2 || /\d/.test(name)) {
        return { valid: false, error: 'Por favor, me diz o nome do seu bebê 💙' };
      }
      return {
        valid: true,
        updates: { baby_name: name },
        next_step: 'ASKING_GENDER',
        message: ONBOARDING_MESSAGES.ASKING_GENDER.text(name),
        buttons: ONBOARDING_MESSAGES.ASKING_GENDER.buttons
      };
    }
    case 'ASKING_GENDER': {
      const normalized = (userInput || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      let gender = null;
      if (normalized.includes('menino') || normalized.includes('male') || userInput === 'gender_male') gender = 'male';
      if (normalized.includes('menina') || normalized.includes('female') || userInput === 'gender_female') gender = 'female';
      if (!gender) {
        return { valid: false, error: 'Escolhe uma das opções: 👦 Menino ou 👧 Menina' };
      }
      return {
        valid: true,
        updates: { baby_gender: gender },
        next_step: 'ASKING_BIRTHDATE'
      };
    }
    case 'ASKING_BIRTHDATE': {
      const dateMatch = (userInput || '').match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
      if (!dateMatch) {
        return { valid: false, error: 'Me manda a data assim: *DD/MM/AAAA* 📅\nPor exemplo: 15/10/2025' };
      }
      const [, day, month, year] = dateMatch;
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const now = new Date();
      if (isNaN(birthDate.getTime()) || birthDate > now) {
        return { valid: false, error: 'Essa data não parece certa 🤔\nMe manda a data de nascimento do bebê: *DD/MM/AAAA*' };
      }
      const ageMs = now - birthDate;
      const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
      const ageMonths = Math.floor(ageDays / 30.44);
      const ageWeeks = Math.floor(ageDays / 7);
      let ageText;
      if (ageMonths < 1) ageText = `${ageWeeks} semana${ageWeeks !== 1 ? 's' : ''}`;
      else if (ageMonths < 24) ageText = `${ageMonths} ${ageMonths === 1 ? 'mês' : 'meses'}`;
      else ageText = `${Math.floor(ageMonths / 12)} anos`;
      const isoDate = birthDate.toISOString().split('T')[0];
      return {
        valid: true,
        updates: {
          baby_birthdate: isoDate,
          onboarding_completed: true,
          journey_week: ageWeeks
        },
        next_step: 'COMPLETE',
        age_text: ageText,
        age_months: ageMonths,
        age_weeks: ageWeeks
      };
    }
    default:
      return { valid: false, error: 'Estado de onboarding inválido' };
  }
}

function getOnboardingMessage(step, stateData = {}) {
  const msg = ONBOARDING_MESSAGES[step];
  if (!msg) return null;
  if (typeof msg.text === 'function') {
    const name = stateData.baby_name || 'bebê';
    const gender = stateData.baby_gender;
    const genderPronoun = gender === 'female' ? 'dela' : 'dele';
    if (step === 'COMPLETE') {
      return { text: msg.text(name, stateData.age_text || '', genderPronoun), buttons: msg.buttons || [] };
    }
    return { text: msg.text(name), buttons: msg.buttons || [] };
  }
  return { text: msg.text, buttons: msg.buttons || [] };
}

function resolveContextSelection(buttonId) {
  const mapping = {
    ctx_child: { active_context: 'child', assistant_name: 'TitiNauta' },
    ctx_mother: { active_context: 'mother', assistant_name: 'TitiNauta Materna' },
    '1': { active_context: 'child', assistant_name: 'TitiNauta' },
    '2': { active_context: 'mother', assistant_name: 'TitiNauta Materna' }
  };
  if (mapping[buttonId]) return mapping[buttonId];

  const normalized = (buttonId || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('bebe') || normalized.includes('bebê') || normalized.includes('child') || normalized.includes('crianca')) {
    return mapping.ctx_child;
  }
  if (normalized.includes('mae') || normalized.includes('mãe') || normalized.includes('mother') || normalized.includes('sobre mim') || normalized.includes('saude') || normalized.includes('materna')) {
    return mapping.ctx_mother;
  }
  return null;
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
    action_continue: { action: 'continue_conversation' },
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
  if (mapping[buttonId]) return mapping[buttonId];

  const normalized = (buttonId || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const textMapping = {
    'quiz': mapping.action_quiz,
    'conteudo': mapping.action_content,
    'conteúdo': mapping.action_content,
    'trocar': mapping.action_change,
    'mudar contexto': mapping.action_change,
    'sair': mapping.action_exit,
    'pausar': mapping.action_exit,
    'registro': mapping.action_log,
    'suporte': mapping.action_support,
    'ajuda': mapping.action_support,
    'continuar': mapping.action_continue,
    'biometria': mapping.log_biometrics,
    'peso': mapping.log_biometrics,
    'altura': mapping.log_biometrics,
    'sono': mapping.log_sleep,
    'dormir': mapping.log_sleep,
    'vacina': mapping.log_vaccine,
    'problema': mapping.support_problem,
    'sugestao': mapping.support_suggestion,
    'voltar': mapping.support_back
  };
  for (const [keyword, result] of Object.entries(textMapping)) {
    if (normalized.includes(keyword)) return result;
  }
  return null;
}

module.exports = {
  VALID_STATES,
  TRANSITIONS,
  ONBOARDING_MESSAGES,
  isValidTransition,
  getValidTransitions,
  getStateMessage,
  transition,
  resolveContextSelection,
  resolveFeedbackScore,
  resolveActionButton,
  resolveOnboardingStep,
  getOnboardingMessage
};
