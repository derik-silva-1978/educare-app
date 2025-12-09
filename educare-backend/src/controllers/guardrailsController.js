/**
 * Guardrails Controller
 * Endpoints para validação de guardrails via n8n
 */

const guardrailsService = require('../services/guardrailsService');

/**
 * POST /api/guardrails/validate
 * Valida mensagem de entrada (para uso no n8n antes do LLM)
 */
async function validateInput(req, res) {
  try {
    const { message, context = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'message é obrigatório'
      });
    }
    
    const validationContext = {
      sessionId: context.sessionId || req.headers['x-session-id'],
      userId: context.userId || context.userPhone,
      module: context.module || 'chat',
      source: context.source || 'n8n'
    };
    
    const result = guardrailsService.validateInput(message, validationContext);
    
    let responseMessage = null;
    if (!result.valid && result.issues.length > 0) {
      const primaryIssue = result.issues[0];
      responseMessage = guardrailsService.getBlockedResponse(primaryIssue.type, primaryIssue);
    }
    
    if (result.actions.includes('escalate_emergency')) {
      responseMessage = guardrailsService.BLOCKED_RESPONSES.emergency;
    }
    
    res.json({
      success: true,
      valid: result.valid,
      checks: result.checks,
      issues: result.issues,
      warnings: result.warnings,
      actions: result.actions,
      sanitizedMessage: result.sanitizedMessage,
      blockedResponse: responseMessage
    });
    
  } catch (error) {
    console.error('[Guardrails] Validate error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao validar mensagem'
    });
  }
}

/**
 * POST /api/guardrails/validate-output
 * Valida resposta do LLM antes de enviar ao usuário
 */
async function validateOutput(req, res) {
  try {
    const { response, context = {} } = req.body;
    
    if (!response) {
      return res.status(400).json({
        success: false,
        error: 'response é obrigatório'
      });
    }
    
    const result = guardrailsService.validateOutput(response, context);
    
    let finalResponse = response;
    
    if (result.warnings.some(w => w.type === 'missing_medical_disclaimer')) {
      const disclaimer = '\n\n💡 Lembre-se: Esta informação não substitui a orientação de um profissional de saúde.';
      finalResponse = response + disclaimer;
    }
    
    if (!result.valid) {
      finalResponse = 'Desculpe, houve um problema ao processar a resposta. Por favor, consulte um profissional de saúde para orientações específicas.';
    }
    
    res.json({
      success: true,
      valid: result.valid,
      issues: result.issues,
      warnings: result.warnings,
      originalResponse: response,
      finalResponse,
      disclaimerAdded: finalResponse !== response
    });
    
  } catch (error) {
    console.error('[Guardrails] Validate output error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao validar resposta'
    });
  }
}

/**
 * POST /api/guardrails/validate-full
 * Validação completa (entrada + saída)
 */
async function validateFull(req, res) {
  try {
    const { input, output, context = {} } = req.body;
    
    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'input é obrigatório'
      });
    }
    
    const result = guardrailsService.validate(input, output, context);
    
    res.json({
      success: true,
      ...result
    });
    
  } catch (error) {
    console.error('[Guardrails] Full validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na validação completa'
    });
  }
}

/**
 * POST /api/guardrails/escalate
 * Escala emergência médica para atendimento humano
 */
async function escalateEmergency(req, res) {
  try {
    const { 
      userPhone, 
      userName, 
      message, 
      emergencyTerms,
      urgencyScore,
      childId,
      childName,
      sessionId 
    } = req.body;
    
    if (!userPhone || !message) {
      return res.status(400).json({
        success: false,
        error: 'userPhone e message são obrigatórios'
      });
    }
    
    const escalation = {
      id: `ESC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      urgencyScore: urgencyScore || 'high',
      user: {
        phone: guardrailsService.maskValue(userPhone, 'phone'),
        name: userName || 'Usuário'
      },
      child: childId ? {
        id: childId,
        name: childName || '[Nome protegido]'
      } : null,
      message: guardrailsService.sanitizeForLogs(message),
      emergencyTerms: emergencyTerms || [],
      sessionId,
      actions: ['notified_user', 'logged']
    };
    
    console.log('[EMERGENCY ESCALATION]', JSON.stringify(escalation, null, 2));
    
    const escalationWebhook = process.env.ESCALATION_WEBHOOK_URL;
    if (escalationWebhook) {
      try {
        const fetch = require('node-fetch');
        await fetch(escalationWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(escalation)
        });
        escalation.actions.push('webhook_sent');
      } catch (webhookError) {
        console.error('[Guardrails] Webhook error:', webhookError);
      }
    }
    
    res.json({
      success: true,
      escalation,
      userResponse: guardrailsService.BLOCKED_RESPONSES.emergency
    });
    
  } catch (error) {
    console.error('[Guardrails] Escalate error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao escalar emergência'
    });
  }
}

/**
 * POST /api/guardrails/sanitize
 * Sanitiza texto removendo PII
 */
async function sanitize(req, res) {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'text é obrigatório'
      });
    }
    
    const sanitized = guardrailsService.sanitizeForLogs(text);
    const piiDetected = guardrailsService.detectPII(text);
    
    res.json({
      success: true,
      original: text,
      sanitized,
      piiDetected: piiDetected.length > 0,
      piiTypes: piiDetected.map(p => p.type)
    });
    
  } catch (error) {
    console.error('[Guardrails] Sanitize error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao sanitizar texto'
    });
  }
}

/**
 * GET /api/guardrails/metrics
 * Retorna métricas de guardrails
 */
async function getMetrics(req, res) {
  try {
    const metrics = guardrailsService.getMetrics();
    
    res.json({
      success: true,
      metrics
    });
    
  } catch (error) {
    console.error('[Guardrails] Metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter métricas'
    });
  }
}

/**
 * POST /api/guardrails/metrics/reset
 * Reseta métricas (admin only)
 */
async function resetMetrics(req, res) {
  try {
    guardrailsService.resetMetrics();
    
    res.json({
      success: true,
      message: 'Métricas resetadas'
    });
    
  } catch (error) {
    console.error('[Guardrails] Reset metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao resetar métricas'
    });
  }
}

/**
 * GET /api/guardrails/config
 * Retorna configuração atual (sem dados sensíveis)
 */
async function getConfig(req, res) {
  try {
    const config = { ...guardrailsService.config };
    
    delete config.promptInjection?.patterns;
    
    res.json({
      success: true,
      config
    });
    
  } catch (error) {
    console.error('[Guardrails] Get config error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter configuração'
    });
  }
}

/**
 * GET /api/guardrails/health
 * Health check do serviço de guardrails
 */
async function healthCheck(req, res) {
  try {
    const metrics = guardrailsService.getMetrics();
    
    const status = guardrailsService.config.enabled ? 'healthy' : 'disabled';
    
    res.json({
      success: true,
      status,
      enabled: guardrailsService.config.enabled,
      strictMode: guardrailsService.config.strictMode,
      uptime: metrics.uptime,
      totalValidations: metrics.totalValidations
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      error: error.message
    });
  }
}

module.exports = {
  validateInput,
  validateOutput,
  validateFull,
  escalateEmergency,
  sanitize,
  getMetrics,
  resetMetrics,
  getConfig,
  healthCheck
};
