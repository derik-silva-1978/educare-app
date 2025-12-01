/**
 * Utilitário de logging seguro
 * Remove dados sensíveis dos logs em produção
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Remove campos sensíveis de um objeto
 */
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveFields = [
    'password',
    'api_key',
    'token',
    'refresh_token',
    'reset_token',
    'phone_verification_code',
    'cpf_cnpj',
    'phone'
  ];
  
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  
  for (const key in sanitized) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  
  return sanitized;
};

/**
 * Logger seguro para desenvolvimento
 */
const logger = {
  info: (message, data = null) => {
    if (!isProduction) {
      console.log(`ℹ️ [INFO] ${message}`, data ? sanitizeData(data) : '');
    }
  },
  
  debug: (message, data = null) => {
    if (!isProduction) {
      console.log(`🔍 [DEBUG] ${message}`, data ? sanitizeData(data) : '');
    }
  },
  
  warn: (message, data = null) => {
    console.warn(`⚠️ [WARN] ${message}`, data ? sanitizeData(data) : '');
  },
  
  error: (message, error = null) => {
    console.error(`❌ [ERROR] ${message}`);
    if (error) {
      if (isProduction) {
        // Em produção, apenas mensagem de erro
        console.error('Error:', error.message);
      } else {
        // Em desenvolvimento, stack trace completo
        console.error(error);
      }
    }
  },
  
  api: (method, endpoint, status, duration = null) => {
    const emoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️';
    const durationStr = duration ? ` (${duration}ms)` : '';
    console.log(`${emoji} [API] ${method} ${endpoint} - ${status}${durationStr}`);
  }
};

module.exports = logger;
