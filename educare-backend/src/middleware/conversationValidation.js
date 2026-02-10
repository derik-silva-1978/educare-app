const VALID_STATES = [
  'ENTRY', 'CONTEXT_SELECTION', 'FREE_CONVERSATION', 'CONTENT_FLOW',
  'QUIZ_FLOW', 'LOG_FLOW', 'SUPPORT', 'FEEDBACK', 'PAUSE', 'EXIT'
];

const VALID_CONTEXTS = ['child', 'mother'];
const VALID_AUDIO_PREFERENCES = ['text', 'audio'];

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

const validators = {
  isValidPhone: (phone) => {
    if (!phone) return false;
    const clean = String(phone).replace(/\D/g, '');
    return clean.length >= 12 && clean.length <= 13;
  },

  isValidScore: (score) => {
    const num = parseInt(score, 10);
    return Number.isInteger(num) && num >= 1 && num <= 5;
  },

  isValidState: (state) => {
    return VALID_STATES.includes(state);
  },

  isValidActiveContext: (context) => {
    return context === null || context === undefined || VALID_CONTEXTS.includes(context);
  },

  isValidAudioPreference: (preference) => {
    return VALID_AUDIO_PREFERENCES.includes(preference);
  }
};

const middleware = {
  validatePhone: (req, res, next) => {
    const phone = req.body.phone || req.query.phone || req.params.phone;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Parâmetro phone é obrigatório' });
    }
    const normalized = sanitizePhone(phone);
    if (!validators.isValidPhone(normalized)) {
      return res.status(400).json({ success: false, error: 'Formato de telefone inválido. Use formato brasileiro com DDD (ex: +5511999999999)' });
    }
    req.cleanPhone = normalized;
    next();
  },

  validateScore: (req, res, next) => {
    const { score } = req.body;
    if (score !== undefined && !validators.isValidScore(score)) {
      return res.status(400).json({ success: false, error: 'Score deve ser um inteiro entre 1 e 5' });
    }
    next();
  },

  validateState: (req, res, next) => {
    const state = req.body.to_state || req.body.state;
    if (state && !validators.isValidState(state)) {
      return res.status(400).json({
        success: false,
        error: `Estado inválido: ${state}`,
        valid_states: VALID_STATES
      });
    }
    next();
  },

  validateActiveContext: (req, res, next) => {
    const { active_context } = req.body;
    if (active_context !== undefined && !validators.isValidActiveContext(active_context)) {
      return res.status(400).json({
        success: false,
        error: 'active_context deve ser "child", "mother" ou null'
      });
    }
    next();
  },

  validateAudioPreference: (req, res, next) => {
    const { preference } = req.body;
    if (preference && !validators.isValidAudioPreference(preference)) {
      return res.status(400).json({
        success: false,
        error: 'Preferência de áudio deve ser "text" ou "audio"'
      });
    }
    next();
  }
};

module.exports = {
  ...middleware,
  ...validators,
  sanitizePhone,
  VALID_STATES,
  VALID_CONTEXTS,
  VALID_AUDIO_PREFERENCES
};
