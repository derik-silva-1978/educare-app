const express = require('express');
const router = express.Router();
const ragMetricsService = require('../services/ragMetricsService');
const ragService = require('../services/ragService');
const { verifyToken, isOwner } = require('../middlewares/auth');

/**
 * @swagger
 * /api/metrics/rag/aggregates:
 *   get:
 *     summary: Retorna agregações gerais de métricas do RAG
 *     tags: [Métricas RAG]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Agregações de métricas
 *       401:
 *         description: Não autenticado
 */
router.get('/rag/aggregates', verifyToken, (req, res) => {
  try {
    const data = ragMetricsService.getAggregates();
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Metrics] Erro ao obter agregações:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter agregações'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/recent:
 *   get:
 *     summary: Retorna últimas N queries do RAG
 *     tags: [Métricas RAG]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Últimas queries
 */
router.get('/rag/recent', verifyToken, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const data = ragMetricsService.getRecentQueries(limit);
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Metrics] Erro ao obter queries recentes:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter queries recentes'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/by-module:
 *   get:
 *     summary: Retorna estatísticas por módulo (baby/mother/professional)
 *     tags: [Métricas RAG]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas por módulo
 */
router.get('/rag/by-module', verifyToken, (req, res) => {
  try {
    const data = ragMetricsService.getModuleStats();
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Metrics] Erro ao obter stats por módulo:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter stats por módulo'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/knowledge-bases:
 *   get:
 *     summary: Retorna estatísticas de uso de bases de conhecimento
 *     tags: [Métricas RAG]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de bases de conhecimento
 */
router.get('/rag/knowledge-bases', verifyToken, (req, res) => {
  try {
    const data = ragMetricsService.getKnowledgeBaseStats();
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Metrics] Erro ao obter KB stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter KB stats'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/health:
 *   get:
 *     summary: Retorna health check do RAG
 *     tags: [Métricas RAG]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Status de saúde do RAG
 */
router.get('/rag/health', verifyToken, (req, res) => {
  try {
    const data = ragMetricsService.getHealthCheck();
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Metrics] Erro ao obter health:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter health'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/shutdown-readiness:
 *   get:
 *     summary: FASE 08 - Verifica prontidão de módulos para desligar fallback legacy
 *     tags: [Métricas RAG]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *           enum: [baby, mother, professional]
 *         description: Módulo específico (opcional, retorna todos se omitido)
 *     responses:
 *       200:
 *         description: Status de prontidão para desligamento do fallback
 */
router.get('/rag/shutdown-readiness', verifyToken, isOwner, (req, res) => {
  try {
    const moduleType = req.query.module;
    const data = ragMetricsService.getShutdownReadiness(moduleType);
    return res.json(data);
  } catch (error) {
    console.error('[Metrics] Erro ao verificar shutdown readiness:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao verificar prontidão'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/fallback-status:
 *   get:
 *     summary: FASE 08 - Retorna status atual das flags de fallback por módulo
 *     tags: [Métricas RAG]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Status das flags de fallback
 */
router.get('/rag/fallback-status', verifyToken, (req, res) => {
  try {
    const data = ragService.getFallbackStatus();
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Metrics] Erro ao obter fallback status:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter status de fallback'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/reset:
 *   post:
 *     summary: Reseta métricas (apenas Super Admin)
 *     tags: [Métricas RAG]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas resetadas
 *       403:
 *         description: Não é Super Admin
 */
router.post('/rag/reset', verifyToken, isOwner, (req, res) => {
  try {
    const result = ragMetricsService.reset();
    return res.json(result);
  } catch (error) {
    console.error('[Metrics] Erro ao resetar:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao resetar métricas'
    });
  }
});

module.exports = router;
