const express = require('express');
const router = express.Router();
const migrationController = require('../controllers/migrationController');
const { verifyToken, isOwner } = require('../middlewares/auth');

/**
 * @swagger
 * /api/admin/migration/analyze:
 *   get:
 *     summary: Analisa e classifica documentos legados
 *     tags: [Migração]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Análise completa
 */
router.get('/analyze', verifyToken, isOwner, migrationController.analyzeDocuments);

/**
 * @swagger
 * /api/admin/migration/start:
 *   post:
 *     summary: Inicia migração de documentos
 *     tags: [Migração]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               auto_classify:
 *                 type: boolean
 *               skip_ambiguous:
 *                 type: boolean
 *               batch_size:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Migração iniciada
 */
router.post('/start', verifyToken, isOwner, migrationController.startMigration);

/**
 * @swagger
 * /api/admin/migration/validate:
 *   get:
 *     summary: Valida integridade da migração
 *     tags: [Migração]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resultado da validação
 */
router.get('/validate', verifyToken, isOwner, migrationController.validateMigration);

/**
 * @swagger
 * /api/admin/migration/rollback:
 *   post:
 *     summary: Faz rollback de migração
 *     tags: [Migração]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Rollback concluído
 */
router.post('/rollback', verifyToken, isOwner, migrationController.rollback);

module.exports = router;
