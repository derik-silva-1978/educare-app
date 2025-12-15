const express = require('express');
const router = express.Router();
const ragMetricsService = require('../services/ragMetricsService');
const ragService = require('../services/ragService');
const ragFeedbackService = require('../services/ragFeedbackService');
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
 * /api/metrics/rag/ingestions:
 *   get:
 *     summary: Retorna estatísticas de ingestão de documentos
 *     tags: [Métricas RAG]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de ingestão
 */
router.get('/rag/ingestions', verifyToken, (req, res) => {
  try {
    const result = ragMetricsService.getIngestionStats();
    return res.json({
      success: true,
      data: result.data,
      recent_ingestions: result.recent_ingestions
    });
  } catch (error) {
    console.error('[Metrics] Erro ao obter stats de ingestão:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter estatísticas de ingestão'
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

/**
 * @swagger
 * /api/metrics/rag/feedback:
 *   post:
 *     summary: FASE 11 - Submete feedback sobre resposta do RAG
 *     tags: [RAG Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               response_id:
 *                 type: string
 *               query:
 *                 type: string
 *               rating:
 *                 type: integer
 *               feedback_type:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback registrado
 */
router.post('/rag/feedback', async (req, res) => {
  try {
    const result = await ragFeedbackService.submitFeedback(req.body);
    return res.json(result);
  } catch (error) {
    console.error('[Metrics] Erro ao submeter feedback:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao submeter feedback'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/feedback/stats:
 *   get:
 *     summary: FASE 11 - Estatisticas de feedback
 *     tags: [RAG Feedback]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estatisticas de feedback
 */
router.get('/rag/feedback/stats', verifyToken, async (req, res) => {
  try {
    const module = req.query.module;
    const days = parseInt(req.query.days) || 30;
    const stats = await ragFeedbackService.getFeedbackStats({ module, days });
    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error('[Metrics] Erro ao obter feedback stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter estatisticas'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/maturity:
 *   get:
 *     summary: FASE 11 - Dashboard de maturidade do RAG
 *     tags: [RAG Feedback]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard de maturidade
 */
router.get('/rag/maturity', verifyToken, isOwner, async (req, res) => {
  try {
    const dashboard = await ragFeedbackService.getMaturityDashboard();
    return res.json({ success: true, data: dashboard });
  } catch (error) {
    console.error('[Metrics] Erro ao obter dashboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter dashboard'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/quality-analysis:
 *   get:
 *     summary: FASE 11 - Analise de qualidade do RAG
 *     tags: [RAG Feedback]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analise de qualidade
 */
router.get('/rag/quality-analysis', verifyToken, isOwner, async (req, res) => {
  try {
    const analysis = await ragFeedbackService.analyzeQuality({
      days: parseInt(req.query.days) || 30
    });
    return res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('[Metrics] Erro na analise:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro na analise de qualidade'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/improvement-suggestions:
 *   post:
 *     summary: FASE 11 - Gera sugestoes de melhoria via LLM
 *     tags: [RAG Feedback]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sugestoes geradas
 */
router.post('/rag/improvement-suggestions', verifyToken, isOwner, async (req, res) => {
  try {
    const result = await ragFeedbackService.generateImprovementSuggestions();
    return res.json(result);
  } catch (error) {
    console.error('[Metrics] Erro ao gerar sugestoes:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao gerar sugestoes'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/suggestions:
 *   get:
 *     summary: FASE 11 - Lista sugestoes de melhoria pendentes
 *     tags: [RAG Feedback]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sugestoes
 */
router.get('/rag/suggestions', verifyToken, isOwner, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const suggestions = ragFeedbackService.getPendingSuggestions(limit);
    return res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('[Metrics] Erro ao obter sugestoes:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter sugestoes'
    });
  }
});

/**
 * @swagger
 * /api/metrics/rag/export:
 *   get:
 *     summary: FASE 11 - Exporta dados de feedback para analise
 *     tags: [RAG Feedback]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados exportados
 */
router.get('/rag/export', verifyToken, isOwner, (req, res) => {
  try {
    const type = req.query.type || 'all';
    const limit = parseInt(req.query.limit) || 1000;
    const data = ragFeedbackService.exportData(type, { limit });
    return res.json(data);
  } catch (error) {
    console.error('[Metrics] Erro ao exportar:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao exportar dados'
    });
  }
});

module.exports = router;
