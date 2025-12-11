const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter para endpoints sensíveis do Educare+
 * 
 * Protege contra spam e abuso, especialmente em endpoints de feedback.
 */

const faqFeedbackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 requisições por minuto por IP
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 1 minuto.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true, // Retorna info do rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  validate: { xForwardedForHeader: false }, // Desabilita validação IPv6 para keyGenerator customizado
  handler: (req, res, next, options) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite no endpoint ${req.path}`);
    res.status(429).json(options.message);
  }
});

const generalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // máximo 100 requisições por minuto por IP
  message: {
    success: false,
    message: 'Muitas requisições. Aguarde um momento.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // máximo 5 requisições por minuto (para endpoints muito sensíveis)
  message: {
    success: false,
    message: 'Limite de requisições atingido. Tente novamente em 1 minuto.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  faqFeedbackLimiter,
  generalApiLimiter,
  strictLimiter
};
