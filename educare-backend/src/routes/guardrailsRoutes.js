/**
 * Guardrails Routes
 * Endpoints para validação de guardrails via n8n
 */

const express = require('express');
const router = express.Router();
const guardrailsController = require('../controllers/guardrailsController');
const { verifyToken } = require('../middlewares/auth');
const { validateApiKey } = require('../middlewares/apiKey');

/**
 * Middleware de autenticação flexível
 * Aceita JWT token OU API Key para permitir uso via n8n
 */
const flexibleAuth = (req, res, next) => {
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  
  if (apiKey) {
    return validateApiKey(req, res, next);
  }
  
  return verifyToken(req, res, next);
};

/**
 * @swagger
 * /api/guardrails/validate:
 *   post:
 *     summary: Valida mensagem de entrada
 *     tags: [Guardrails]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Mensagem do usuário para validar
 *               context:
 *                 type: object
 *                 properties:
 *                   sessionId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   module:
 *                     type: string
 *     responses:
 *       200:
 *         description: Resultado da validação
 */
router.post('/validate', flexibleAuth, guardrailsController.validateInput);

/**
 * @swagger
 * /api/guardrails/validate-output:
 *   post:
 *     summary: Valida resposta do LLM antes de enviar
 *     tags: [Guardrails]
 */
router.post('/validate-output', flexibleAuth, guardrailsController.validateOutput);

/**
 * @swagger
 * /api/guardrails/validate-full:
 *   post:
 *     summary: Validação completa (entrada + saída)
 *     tags: [Guardrails]
 */
router.post('/validate-full', flexibleAuth, guardrailsController.validateFull);

/**
 * @swagger
 * /api/guardrails/escalate:
 *   post:
 *     summary: Escala emergência médica
 *     tags: [Guardrails]
 */
router.post('/escalate', flexibleAuth, guardrailsController.escalateEmergency);

/**
 * @swagger
 * /api/guardrails/sanitize:
 *   post:
 *     summary: Sanitiza texto removendo PII
 *     tags: [Guardrails]
 */
router.post('/sanitize', flexibleAuth, guardrailsController.sanitize);

/**
 * @swagger
 * /api/guardrails/metrics:
 *   get:
 *     summary: Retorna métricas de guardrails
 *     tags: [Guardrails]
 */
router.get('/metrics', flexibleAuth, guardrailsController.getMetrics);

/**
 * @swagger
 * /api/guardrails/metrics/reset:
 *   post:
 *     summary: Reseta métricas (admin only)
 *     tags: [Guardrails]
 */
router.post('/metrics/reset', verifyToken, guardrailsController.resetMetrics);

/**
 * @swagger
 * /api/guardrails/config:
 *   get:
 *     summary: Retorna configuração atual
 *     tags: [Guardrails]
 */
router.get('/config', flexibleAuth, guardrailsController.getConfig);

/**
 * @swagger
 * /api/guardrails/health:
 *   get:
 *     summary: Health check do serviço
 *     tags: [Guardrails]
 */
router.get('/health', guardrailsController.healthCheck);

module.exports = router;
