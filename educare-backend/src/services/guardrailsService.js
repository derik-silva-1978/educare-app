/**
 * Guardrails Service
 * Proteção multicamada para agentes n8n do Educare+
 * 
 * Responsabilidades:
 * - Validação de entrada (PII, prompt injection, tópicos proibidos)
 * - Validação de contexto (dados de crianças, saúde materna)
 * - Validação de saída (disclaimers médicos, mascaramento)
 * - Rate limiting e escalação de emergências
 */

const fs = require('fs');
const path = require('path');

// Carregar configurações
let guardrailsConfig = {};
try {
  const configPath = path.join(__dirname, '../config/guardrails.config.json');
  if (fs.existsSync(configPath)) {
    guardrailsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (error) {
  console.warn('[Guardrails] Config not found, using defaults');
}

// ============================================
// CONFIGURAÇÕES PADRÃO
// ============================================

const DEFAULT_CONFIG = {
  enabled: true,
  strictMode: process.env.GUARDRAILS_STRICT_MODE === 'true',
  logEvents: process.env.LOG_GUARDRAILS_EVENTS !== 'false',
  blockOnViolation: true,
  
  pii: {
    detectCPF: true,
    detectPhone: true,
    detectEmail: true,
    detectCreditCard: true,
    detectChildNames: true,
    maskInLogs: true
  },
  
  promptInjection: {
    enabled: true,
    patterns: [
      /ignore.*previous.*instructions/i,
      /ignore.*system.*prompt/i,
      /ignore.*instruç/i,
      /ignore.*instruc/i,
      /você.*agora.*é/i,
      /voce.*agora.*e/i,
      /atue.*como/i,
      /finja.*que/i,
      /esqueça.*tudo/i,
      /esqueca.*tudo/i,
      /novo.*objetivo/i,
      /override.*instructions/i,
      /bypass.*safety/i,
      /jailbreak/i,
      /DAN.*mode/i,
      /developer.*mode/i,
      /me.*diga.*dados.*de.*todas/i,
      /lista.*todos.*os.*usuarios/i,
      /mostre.*todos.*os.*dados/i,
      /acesso.*ao.*banco/i,
      /dados.*sensiveis/i
    ]
  },
  
  topics: {
    allowed: [
      'desenvolvimento_infantil',
      'marcos_desenvolvimento',
      'alimentacao_infantil',
      'sono_bebe',
      'amamentacao',
      'saude_materna',
      'estimulacao_cognitiva',
      'motricidade',
      'linguagem',
      'socializacao'
    ],
    blocked: [
      'medicamentos',
      'dosagem',
      'diagnostico',
      'tratamento_medico',
      'financeiro',
      'juridico',
      'politica',
      'religiao'
    ]
  },
  
  emergencyTerms: [
    'emergência', 'urgente', 'grave', 'hospital',
    'sangramento intenso', 'sangramento forte',
    'febre alta', 'febre muito alta', 'convulsão', 'convulsao',
    'desmaio', 'desmaiou', 'não respira', 'nao respira',
    'intoxicação', 'intoxicacao', 'envenenamento',
    'acidente', 'caiu', 'engasgou', 'engasgo',
    'não acorda', 'nao acorda', 'inconsciente',
    'roxo', 'azul', 'parou de respirar'
  ],
  
  rateLimit: {
    enabled: true,
    maxRequestsPerMinute: 30,
    maxRequestsPerHour: 200
  }
};

// Merge config preservando estruturas críticas do DEFAULT_CONFIG
const config = { 
  ...DEFAULT_CONFIG, 
  ...guardrailsConfig,
  // Preservar patterns como RegExp (não sobrescrever com strings do JSON)
  promptInjection: {
    ...DEFAULT_CONFIG.promptInjection,
    ...(guardrailsConfig.promptInjection || {}),
    patterns: DEFAULT_CONFIG.promptInjection.patterns // Sempre usar os patterns RegExp
  },
  // Preservar emergencyTerms como array simples
  emergencyTerms: DEFAULT_CONFIG.emergencyTerms
};

// ============================================
// PADRÕES DE DETECÇÃO (PII BRASILEIRO)
// ============================================

const PII_PATTERNS = {
  cpf: /\b(\d{3}\.?\d{3}\.?\d{3}-?\d{2})\b/g,
  cnpj: /\b(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
  phone: /\b(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}[-.\s]?\d{4}\b/g,
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  birthDate: /\b(\d{2}\/\d{2}\/\d{4})\b/g,
  rg: /\b(\d{2}\.?\d{3}\.?\d{3}-?[0-9Xx])\b/g
};

const CHILD_DATA_PATTERNS = {
  childName: /\b(meu\s+filho|minha\s+filha|o\s+beb[êe]|a\s+beb[êe])\s+([A-ZÀ-Ú][a-zà-ú]+)/gi,
  healthData: /\b(peso|altura|circunferência|perímetro|vacina|medicamento|diagnóstico)\s*:?\s*\d+/gi,
  medicalRecord: /\b(prontuário|registro\s+médico|carteira\s+de\s+vacinação)\s*:?\s*\w+/gi
};

// ============================================
// MÉTRICAS E LOGGING
// ============================================

const metrics = {
  totalValidations: 0,
  piiDetections: 0,
  promptInjectionBlocks: 0,
  topicViolations: 0,
  emergencyEscalations: 0,
  rateLimit: {
    violations: 0,
    requests: new Map()
  },
  lastReset: new Date()
};

function logEvent(type, details) {
  if (!config.logEvents) return;
  
  const event = {
    timestamp: new Date().toISOString(),
    type,
    ...details
  };
  
  console.log(`[Guardrails] ${type}:`, JSON.stringify(event, null, 2));
}

// ============================================
// VALIDAÇÃO DE ENTRADA
// ============================================

/**
 * Detecta PII no texto
 */
function detectPII(text) {
  const findings = [];
  
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      findings.push({
        type,
        count: matches.length,
        samples: matches.slice(0, 2).map(m => maskValue(m, type))
      });
    }
  }
  
  return findings;
}

/**
 * Detecta dados de crianças
 */
function detectChildData(text) {
  const findings = [];
  
  for (const [type, pattern] of Object.entries(CHILD_DATA_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      findings.push({
        type,
        count: matches.length,
        masked: true
      });
    }
  }
  
  return findings;
}

/**
 * Detecta tentativas de prompt injection
 */
function detectPromptInjection(text) {
  if (!config.promptInjection.enabled) return { detected: false, patterns: [] };
  
  const detected = [];
  const lowerText = text.toLowerCase();
  
  for (const pattern of config.promptInjection.patterns) {
    if (pattern.test(text)) {
      detected.push(pattern.toString());
    }
  }
  
  const suspiciousPatterns = [
    lowerText.includes('sistema:') && lowerText.includes('usuário:'),
    lowerText.includes('[system]') || lowerText.includes('[user]'),
    lowerText.includes('```') && lowerText.includes('prompt'),
    (text.match(/\n/g) || []).length > 10 && text.includes('instructions')
  ];
  
  if (suspiciousPatterns.some(p => p)) {
    detected.push('suspicious_structure');
  }
  
  return {
    detected: detected.length > 0,
    patterns: detected
  };
}

/**
 * Verifica tópicos bloqueados
 */
function checkBlockedTopics(text) {
  const lowerText = text.toLowerCase();
  const violations = [];
  
  const blockedPatterns = {
    medicamentos: /\b(medicamento|remédio|remedio|antibiótico|antibiotico|paracetamol|ibuprofeno|dipirona)\b/i,
    dosagem: /\b(dose|dosagem|mg|ml|gotas|comprimido|quantos?\s+ml)\b/i,
    diagnostico: /\b(diagnóstico|diagnostico|diagnosticar|o\s+que\s+ele?\s+tem|qual\s+doença|qual\s+doenca)\b/i,
    tratamento_medico: /\b(tratamento|tratar|curar|receita\s+médica|receita\s+medica)\b/i,
    financeiro: /\b(dinheiro|pix|conta\s+bancária|empréstimo|investimento)\b/i,
    juridico: /\b(advogado|processo|tribunal|lei|jurídico|juridico)\b/i
  };
  
  for (const [topic, pattern] of Object.entries(blockedPatterns)) {
    if (pattern.test(text)) {
      violations.push(topic);
    }
  }
  
  return violations;
}

/**
 * Detecta termos de emergência médica
 */
function detectEmergency(text) {
  const lowerText = text.toLowerCase();
  const found = config.emergencyTerms.filter(term => lowerText.includes(term));
  
  const urgencyScore = found.length >= 3 ? 'critical' :
                       found.length >= 2 ? 'high' :
                       found.length >= 1 ? 'medium' : 'low';
  
  return {
    isEmergency: found.length > 0,
    terms: found,
    urgencyScore,
    requiresEscalation: urgencyScore === 'critical' || urgencyScore === 'high'
  };
}

// ============================================
// VALIDAÇÃO DE SAÍDA (OUTPUT)
// ============================================

/**
 * Valida resposta do LLM antes de enviar ao usuário
 */
function validateOutput(response, context = {}) {
  const issues = [];
  const warnings = [];
  
  const dangerousAdvice = [
    /não\s+precisa\s+(ir\s+ao\s+)?médico/i,
    /pode\s+dar\s+\d+\s*(mg|ml|gotas)/i,
    /automedicação/i,
    /ignore\s+(o\s+)?profissional/i,
    /não\s+leve\s+ao\s+hospital/i,
    /tratamento\s+caseiro\s+é\s+suficiente/i
  ];
  
  for (const pattern of dangerousAdvice) {
    if (pattern.test(response)) {
      issues.push({
        type: 'dangerous_medical_advice',
        pattern: pattern.toString()
      });
    }
  }
  
  const piiInResponse = detectPII(response);
  if (piiInResponse.length > 0) {
    issues.push({
      type: 'pii_in_response',
      details: piiInResponse
    });
  }
  
  const healthKeywords = ['febre', 'dor', 'sangue', 'vômito', 'vomito', 'diarreia', 'alergia'];
  const hasHealthContent = healthKeywords.some(k => response.toLowerCase().includes(k));
  const hasDisclaimer = response.includes('profissional de saúde') || 
                        response.includes('consulte um médico') ||
                        response.includes('pediatra');
  
  if (hasHealthContent && !hasDisclaimer) {
    warnings.push({
      type: 'missing_medical_disclaimer',
      suggestion: 'Adicione aviso para consultar profissional de saúde'
    });
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
    sanitizedResponse: issues.length > 0 ? null : response
  };
}

// ============================================
// RATE LIMITING
// ============================================

function checkRateLimit(identifier) {
  if (!config.rateLimit.enabled) return { allowed: true };
  
  const now = Date.now();
  const minuteAgo = now - 60000;
  const hourAgo = now - 3600000;
  
  if (!metrics.rateLimit.requests.has(identifier)) {
    metrics.rateLimit.requests.set(identifier, []);
  }
  
  const requests = metrics.rateLimit.requests.get(identifier);
  const recentRequests = requests.filter(t => t > minuteAgo);
  const hourlyRequests = requests.filter(t => t > hourAgo);
  
  metrics.rateLimit.requests.set(identifier, hourlyRequests);
  
  if (recentRequests.length >= config.rateLimit.maxRequestsPerMinute) {
    metrics.rateLimit.violations++;
    return { 
      allowed: false, 
      reason: 'rate_limit_minute',
      retryAfter: 60 - Math.floor((now - recentRequests[0]) / 1000)
    };
  }
  
  if (hourlyRequests.length >= config.rateLimit.maxRequestsPerHour) {
    metrics.rateLimit.violations++;
    return { 
      allowed: false, 
      reason: 'rate_limit_hour',
      retryAfter: 3600 - Math.floor((now - hourlyRequests[0]) / 1000)
    };
  }
  
  requests.push(now);
  return { allowed: true };
}

// ============================================
// MASCARAMENTO DE DADOS
// ============================================

function maskValue(value, type) {
  if (!value) return value;
  
  switch (type) {
    case 'cpf':
      return value.substring(0, 3) + '.***.***-**';
    case 'email':
      const [user, domain] = value.split('@');
      return user.substring(0, 2) + '***@' + domain;
    case 'phone':
      return value.substring(0, 4) + '****' + value.substring(value.length - 4);
    case 'creditCard':
      return '**** **** **** ' + value.substring(value.length - 4);
    case 'childName':
      return '[NOME_CRIANÇA]';
    default:
      return value.substring(0, 3) + '***';
  }
}

/**
 * Sanitiza texto para logs (remove PII)
 */
function sanitizeForLogs(text) {
  if (!config.pii.maskInLogs) return text;
  
  let sanitized = text;
  
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    sanitized = sanitized.replace(pattern, (match) => maskValue(match, type));
  }
  
  for (const [type, pattern] of Object.entries(CHILD_DATA_PATTERNS)) {
    sanitized = sanitized.replace(pattern, '[DADOS_SENSÍVEIS]');
  }
  
  return sanitized;
}

// ============================================
// VALIDAÇÃO PRINCIPAL
// ============================================

/**
 * Valida entrada de mensagem do usuário (INPUT GUARDRAILS)
 */
function validateInput(message, context = {}) {
  if (!config.enabled) {
    return { valid: true, checks: {}, sanitizedMessage: message };
  }
  
  metrics.totalValidations++;
  
  const result = {
    valid: true,
    checks: {},
    issues: [],
    warnings: [],
    actions: [],
    sanitizedMessage: message
  };
  
  const piiFindings = detectPII(message);
  if (piiFindings.length > 0) {
    metrics.piiDetections++;
    result.checks.pii = { detected: true, findings: piiFindings };
    result.warnings.push({
      type: 'pii_detected',
      message: 'Dados pessoais detectados na mensagem',
      details: piiFindings
    });
    result.actions.push('mask_pii');
    result.sanitizedMessage = sanitizeForLogs(message);
  } else {
    result.checks.pii = { detected: false };
  }
  
  const childData = detectChildData(message);
  if (childData.length > 0) {
    result.checks.childData = { detected: true, findings: childData };
    result.warnings.push({
      type: 'child_data_detected',
      message: 'Dados de criança detectados'
    });
  }
  
  const injectionCheck = detectPromptInjection(message);
  if (injectionCheck.detected) {
    metrics.promptInjectionBlocks++;
    result.checks.promptInjection = injectionCheck;
    result.issues.push({
      type: 'prompt_injection_attempt',
      message: 'Tentativa de manipulação detectada',
      severity: 'high'
    });
    result.valid = false;
    result.actions.push('block');
    
    logEvent('PROMPT_INJECTION_BLOCKED', {
      patterns: injectionCheck.patterns,
      context: context.sessionId
    });
  } else {
    result.checks.promptInjection = { detected: false };
  }
  
  const blockedTopics = checkBlockedTopics(message);
  if (blockedTopics.length > 0) {
    metrics.topicViolations++;
    result.checks.topics = { violations: blockedTopics };
    result.issues.push({
      type: 'blocked_topic',
      message: `Tópico fora do escopo: ${blockedTopics.join(', ')}`,
      severity: 'medium',
      topics: blockedTopics
    });
    
    if (config.blockOnViolation && blockedTopics.some(t => 
      ['medicamentos', 'dosagem', 'diagnostico'].includes(t)
    )) {
      result.valid = false;
      result.actions.push('redirect_to_professional');
    }
  }
  
  const emergencyCheck = detectEmergency(message);
  if (emergencyCheck.isEmergency) {
    result.checks.emergency = emergencyCheck;
    result.warnings.push({
      type: 'emergency_detected',
      message: 'Termos de emergência detectados',
      terms: emergencyCheck.terms
    });
    
    if (emergencyCheck.requiresEscalation) {
      metrics.emergencyEscalations++;
      result.actions.push('escalate_emergency');
      result.actions.push('provide_emergency_response');
      
      logEvent('EMERGENCY_ESCALATION', {
        terms: emergencyCheck.terms,
        urgency: emergencyCheck.urgencyScore,
        context: context.sessionId
      });
    }
  }
  
  if (context.userId) {
    const rateLimitCheck = checkRateLimit(context.userId);
    if (!rateLimitCheck.allowed) {
      result.checks.rateLimit = rateLimitCheck;
      result.issues.push({
        type: 'rate_limit_exceeded',
        message: 'Limite de requisições excedido',
        retryAfter: rateLimitCheck.retryAfter
      });
      result.valid = false;
      result.actions.push('rate_limit');
    }
  }
  
  return result;
}

/**
 * Validação completa (entrada + saída)
 */
function validate(input, output = null, context = {}) {
  const inputValidation = validateInput(input, context);
  
  const result = {
    timestamp: new Date().toISOString(),
    input: inputValidation,
    output: null,
    overallValid: inputValidation.valid,
    actions: [...inputValidation.actions]
  };
  
  if (output) {
    const outputValidation = validateOutput(output, context);
    result.output = outputValidation;
    result.overallValid = result.overallValid && outputValidation.valid;
    
    if (!outputValidation.valid) {
      result.actions.push('block_response');
    }
    
    if (outputValidation.warnings.length > 0) {
      result.actions.push('add_disclaimer');
    }
  }
  
  return result;
}

// ============================================
// RESPOSTAS PADRÃO PARA BLOQUEIOS
// ============================================

const BLOCKED_RESPONSES = {
  prompt_injection: 'Desculpe, não consigo processar essa mensagem. Por favor, faça uma pergunta sobre desenvolvimento infantil ou saúde materna.',
  
  blocked_topic_medical: 'Para questões sobre medicamentos, dosagens ou tratamentos médicos, é essencial consultar um pediatra ou profissional de saúde. A TitiNauta pode ajudar com dúvidas sobre desenvolvimento infantil, alimentação, sono e estimulação. 💜',
  
  blocked_topic_other: 'A TitiNauta é especializada em desenvolvimento infantil e saúde materna. Posso ajudar com dúvidas sobre marcos do desenvolvimento, alimentação, sono, amamentação e estimulação do bebê. Como posso ajudar nessas áreas?',
  
  rate_limit: 'Você está enviando muitas mensagens. Por favor, aguarde um momento antes de continuar. 🙏',
  
  emergency: '🚨 *ATENÇÃO - SITUAÇÃO DE EMERGÊNCIA*\n\nPelos termos que você usou, parece ser uma situação urgente.\n\n*LIGUE AGORA:*\n📞 SAMU: 192\n📞 Bombeiros: 193\n📞 Emergência: 190\n\nNão espere - procure atendimento médico IMEDIATO.\n\nA TitiNauta não substitui atendimento de emergência. 💜'
};

function getBlockedResponse(type, details = {}) {
  switch (type) {
    case 'prompt_injection_attempt':
      return BLOCKED_RESPONSES.prompt_injection;
    
    case 'blocked_topic':
      if (details.topics?.some(t => ['medicamentos', 'dosagem', 'diagnostico', 'tratamento_medico'].includes(t))) {
        return BLOCKED_RESPONSES.blocked_topic_medical;
      }
      return BLOCKED_RESPONSES.blocked_topic_other;
    
    case 'rate_limit_exceeded':
      return BLOCKED_RESPONSES.rate_limit;
    
    case 'emergency_detected':
      return BLOCKED_RESPONSES.emergency;
    
    default:
      return 'Desculpe, não foi possível processar sua mensagem. Por favor, tente novamente.';
  }
}

// ============================================
// MÉTRICAS E ESTATÍSTICAS
// ============================================

function getMetrics() {
  return {
    ...metrics,
    rateLimitActiveUsers: metrics.rateLimit.requests.size,
    uptime: Date.now() - metrics.lastReset.getTime()
  };
}

function resetMetrics() {
  metrics.totalValidations = 0;
  metrics.piiDetections = 0;
  metrics.promptInjectionBlocks = 0;
  metrics.topicViolations = 0;
  metrics.emergencyEscalations = 0;
  metrics.rateLimit.violations = 0;
  metrics.rateLimit.requests.clear();
  metrics.lastReset = new Date();
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  validateInput,
  validateOutput,
  validate,
  detectPII,
  detectChildData,
  detectPromptInjection,
  detectEmergency,
  checkBlockedTopics,
  checkRateLimit,
  sanitizeForLogs,
  maskValue,
  getBlockedResponse,
  getMetrics,
  resetMetrics,
  config,
  BLOCKED_RESPONSES
};
