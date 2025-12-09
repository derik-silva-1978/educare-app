/**
 * Admin Routes
 * FASE 09-UPGRADE: Endpoints para gerenciamento do legacy shutdown
 */

const express = require('express');
const router = express.Router();
const { verifyToken, isOwner } = require('../middlewares/auth');
const legacyShutdownService = require('../services/legacyShutdownService');

/**
 * @swagger
 * /api/admin/legacy/pre-conditions:
 *   get:
 *     summary: Verifica pre-condicoes para desligamento do legacy
 *     tags: [Admin Legacy Shutdown]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Status das pre-condicoes
 */
router.get('/legacy/pre-conditions', verifyToken, isOwner, async (req, res) => {
  try {
    const result = await legacyShutdownService.checkPreConditions();
    return res.json(result);
  } catch (error) {
    console.error('[Admin] Erro ao verificar pre-condicoes:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao verificar pre-condicoes'
    });
  }
});

/**
 * @swagger
 * /api/admin/legacy/backup:
 *   post:
 *     summary: Cria backup imutavel da base legado
 *     tags: [Admin Legacy Shutdown]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Backup criado com sucesso
 */
router.post('/legacy/backup', verifyToken, isOwner, async (req, res) => {
  try {
    const result = await legacyShutdownService.createBackup(req.body);
    return res.json(result);
  } catch (error) {
    console.error('[Admin] Erro ao criar backup:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao criar backup'
    });
  }
});

/**
 * @swagger
 * /api/admin/legacy/deactivate:
 *   post:
 *     summary: Desativa logicamente a base legado
 *     tags: [Admin Legacy Shutdown]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Base legado desativada
 */
router.post('/legacy/deactivate', verifyToken, isOwner, async (req, res) => {
  try {
    const result = await legacyShutdownService.deactivateLegacy();
    return res.json(result);
  } catch (error) {
    console.error('[Admin] Erro ao desativar legacy:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao desativar base legado'
    });
  }
});

/**
 * @swagger
 * /api/admin/legacy/consistency-tests:
 *   get:
 *     summary: Executa testes de consistencia pos-desligamento
 *     tags: [Admin Legacy Shutdown]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resultados dos testes
 */
router.get('/legacy/consistency-tests', verifyToken, isOwner, async (req, res) => {
  try {
    const result = await legacyShutdownService.runConsistencyTests();
    return res.json(result);
  } catch (error) {
    console.error('[Admin] Erro nos testes de consistencia:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao executar testes'
    });
  }
});

/**
 * @swagger
 * /api/admin/legacy/rollback:
 *   post:
 *     summary: Executa rollback e reativa a base legado
 *     tags: [Admin Legacy Shutdown]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Rollback executado
 */
router.post('/legacy/rollback', verifyToken, isOwner, async (req, res) => {
  try {
    const result = await legacyShutdownService.rollback();
    return res.json(result);
  } catch (error) {
    console.error('[Admin] Erro no rollback:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao executar rollback'
    });
  }
});

/**
 * @swagger
 * /api/admin/legacy/status:
 *   get:
 *     summary: Status atual do desligamento do legacy
 *     tags: [Admin Legacy Shutdown]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Status do desligamento
 */
router.get('/legacy/status', verifyToken, isOwner, async (req, res) => {
  try {
    const result = legacyShutdownService.getStatus();
    return res.json(result);
  } catch (error) {
    console.error('[Admin] Erro ao obter status:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter status'
    });
  }
});

/**
 * @swagger
 * /api/admin/legacy/report:
 *   get:
 *     summary: Gera relatorio completo de desligamento
 *     tags: [Admin Legacy Shutdown]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Relatorio de desligamento
 */
router.get('/legacy/report', verifyToken, isOwner, async (req, res) => {
  try {
    const result = await legacyShutdownService.generateShutdownReport();
    return res.json(result);
  } catch (error) {
    console.error('[Admin] Erro ao gerar relatorio:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatorio'
    });
  }
});

module.exports = router;
