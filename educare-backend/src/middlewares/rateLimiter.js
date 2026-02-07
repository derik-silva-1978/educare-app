const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Muitas requisições. Aguarde um momento.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite no endpoint de autenticação ${req.path}`);
    res.status(429).json(options.message);
  }
});

const externalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Limite de requisições da API externa atingido. Tente novamente em 1 minuto.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite no endpoint externo ${req.path}`);
    res.status(429).json(options.message);
  }
});

const faqFeedbackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 1 minuto.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  handler: (req, res, next, options) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite no endpoint ${req.path}`);
    res.status(429).json(options.message);
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  externalLimiter,
  faqFeedbackLimiter
};
