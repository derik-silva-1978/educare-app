/**
 * Context Safety Service
 * FASE 10-UPGRADE: Auditor de Segurança de Contexto
 * 
 * Responsabilidades:
 * - Detectar conteúdo sensível
 * - Validar qualidade do contexto
 * - Filtrar informações inadequadas
 * - Aplicar políticas de conteúdo
 */

const SAFETY_ENABLED = process.env.CONTEXT_SAFETY_ENABLED !== 'false';
const BLOCK_UNSAFE_CONTENT = process.env.BLOCK_UNSAFE_CONTENT === 'true';
const LOG_SAFETY_EVENTS = process.env.LOG_SAFETY_EVENTS !== 'false';

const SENSITIVE_PATTERNS = {
  personal_data: /\b(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})\b/gi,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}\b/g,
  credit_card: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
};

const MEDICAL_EMERGENCY_TERMS = [
  'emergência', 'urgente', 'grave', 'sangramento intenso',
  'febre alta', 'convulsão', 'desmaio', 'não respira',
  'intoxicação', 'envenenamento', 'acidente'
];

const HARMFUL_CONTENT_PATTERNS = [
  /automedicação/i,
  /não precisa de médico/i,
  /ignore.*profissional/i,
  /dose.*medicamento/i
];

/**
 * Detecta dados pessoais sensíveis
 */
function detectPersonalData(text) {
  const findings = [];
  
  for (const [type, pattern] of Object.entries(SENSITIVE_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      findings.push({
        type,
        count: matches.length,
        masked: matches.map(m => m.substring(0, 3) + '***')
      });
    }
  }
  
  return findings;
}

/**
 * Detecta termos de emergência médica
 */
function detectEmergencyTerms(text) {
  const lowerText = text.toLowerCase();
  const found = MEDICAL_EMERGENCY_TERMS.filter(term => lowerText.includes(term));
  
  return {
    hasEmergency: found.length > 0,
    terms: found
  };
}

/**
 * Verifica conteúdo potencialmente prejudicial
 */
function checkHarmfulContent(text) {
  const issues = [];
  
  for (const pattern of HARMFUL_CONTENT_PATTERNS) {
    if (pattern.test(text)) {
      issues.push({
        pattern: pattern.toString(),
        type: 'potentially_harmful'
      });
    }
  }
  
  return issues;
}

/**
 * Valida qualidade do contexto para resposta
 */
function validateContextQuality(documents) {
  const validation = {
    valid: true,
    issues: [],
    warnings: []
  };

  if (!documents || documents.length === 0) {
    validation.warnings.push({
      code: 'no_context',
      message: 'Nenhum documento de contexto fornecido'
    });
    return validation;
  }

  const avgRelevance = documents.reduce((sum, d) => sum + (d.relevance_score || 0.5), 0) / documents.length;
  if (avgRelevance < 0.3) {
    validation.warnings.push({
      code: 'low_relevance',
      message: 'Documentos de contexto com baixa relevância'
    });
  }

  const uniqueSources = new Set(documents.map(d => d.source_type || 'unknown')).size;
  if (uniqueSources === 1 && documents.length > 3) {
    validation.warnings.push({
      code: 'single_source',
      message: 'Todos os documentos são da mesma fonte'
    });
  }

  const now = new Date();
  const oldDocs = documents.filter(d => {
    if (!d.created_at) return false;
    const docDate = new Date(d.created_at);
    const ageYears = (now - docDate) / (1000 * 60 * 60 * 24 * 365);
    return ageYears > 3;
  });
  
  if (oldDocs.length === documents.length && documents.length > 0) {
    validation.warnings.push({
      code: 'outdated_content',
      message: 'Todos os documentos têm mais de 3 anos'
    });
  }

  return validation;
}

/**
 * Remove dados sensíveis do texto
 */
function sanitizeText(text) {
  let sanitized = text;
  
  for (const [type, pattern] of Object.entries(SENSITIVE_PATTERNS)) {
    sanitized = sanitized.replace(pattern, `[${type.toUpperCase()}_REMOVIDO]`);
  }
  
  return sanitized;
}

/**
 * Audita contexto completo para segurança
 */
function auditContext(params) {
  if (!SAFETY_ENABLED) {
    return { passed: true, audited: false };
  }

  const { query, documents, response } = params;
  const startTime = Date.now();

  const audit = {
    passed: true,
    audited: true,
    timestamp: new Date().toISOString(),
    findings: [],
    recommendations: [],
    blocked: false
  };

  if (query) {
    const personalData = detectPersonalData(query);
    if (personalData.length > 0) {
      audit.findings.push({
        source: 'query',
        type: 'personal_data',
        details: personalData
      });
    }

    const emergency = detectEmergencyTerms(query);
    if (emergency.hasEmergency) {
      audit.findings.push({
        source: 'query',
        type: 'emergency_terms',
        details: emergency.terms
      });
      audit.recommendations.push({
        action: 'escalate',
        reason: 'Termos de emergência detectados - considere orientar busca de atendimento médico'
      });
    }
  }

  if (documents) {
    const contextQuality = validateContextQuality(documents);
    if (contextQuality.warnings.length > 0) {
      audit.findings.push({
        source: 'context',
        type: 'quality_warnings',
        details: contextQuality.warnings
      });
    }
  }

  if (response) {
    const harmful = checkHarmfulContent(response);
    if (harmful.length > 0) {
      audit.findings.push({
        source: 'response',
        type: 'potentially_harmful',
        details: harmful
      });

      if (BLOCK_UNSAFE_CONTENT) {
        audit.blocked = true;
        audit.passed = false;
        audit.recommendations.push({
          action: 'block',
          reason: 'Conteúdo potencialmente prejudicial detectado'
        });
      }
    }

    const responsePersonalData = detectPersonalData(response);
    if (responsePersonalData.length > 0) {
      audit.findings.push({
        source: 'response',
        type: 'personal_data_leak',
        details: responsePersonalData
      });
      audit.recommendations.push({
        action: 'sanitize',
        reason: 'Dados pessoais detectados na resposta'
      });
    }
  }

  audit.processing_time_ms = Date.now() - startTime;

  if (LOG_SAFETY_EVENTS && audit.findings.length > 0) {
    console.log(`[ContextSafety] Audit completed with ${audit.findings.length} findings`);
  }

  return audit;
}

/**
 * Gera disclaimer quando necessário
 */
function generateDisclaimer(audit) {
  const disclaimers = [];

  const hasEmergency = audit.findings.some(f => f.type === 'emergency_terms');
  if (hasEmergency) {
    disclaimers.push('⚠️ Se esta é uma emergência médica, procure atendimento profissional imediatamente.');
  }

  const hasQualityIssues = audit.findings.some(f => f.type === 'quality_warnings');
  if (hasQualityIssues) {
    disclaimers.push('ℹ️ Esta resposta é informativa. Consulte sempre um profissional de saúde.');
  }

  return disclaimers;
}

/**
 * Verifica se resposta deve ser bloqueada
 */
function shouldBlockResponse(audit) {
  return BLOCK_UNSAFE_CONTENT && audit.blocked;
}

module.exports = {
  detectPersonalData,
  detectEmergencyTerms,
  checkHarmfulContent,
  validateContextQuality,
  sanitizeText,
  auditContext,
  generateDisclaimer,
  shouldBlockResponse,
  SENSITIVE_PATTERNS
};
