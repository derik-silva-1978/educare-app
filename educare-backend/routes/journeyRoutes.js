/**
 * Rotas para o TitiNauta Journey
 */

const express = require('express');
const router = express.Router();
const journeyController = require('../controllers/journeyController');
const { authenticateJWT } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/journey/{childId}:
 *   get:
 *     summary: Busca o conteúdo da jornada para uma criança
 *     tags: [Journey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da criança
 *       - in: query
 *         name: ageInMonths
 *         schema:
 *           type: integer
 *         required: true
 *         description: Idade da criança em meses
 *     responses:
 *       200:
 *         description: Conteúdo da jornada
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Conteúdo não encontrado
 *       500:
 *         description: Erro interno
 */
router.get('/:childId', authenticateJWT, journeyController.getJourneyContent);

/**
 * @swagger
 * /api/journey/{childId}/progress:
 *   post:
 *     summary: Salva o progresso da jornada
 *     tags: [Journey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da criança
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               journeyId:
 *                 type: string
 *               currentStep:
 *                 type: integer
 *               completedSteps:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Progresso salvo com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Sessão não encontrada
 *       500:
 *         description: Erro interno
 */
router.post('/:childId/progress', authenticateJWT, journeyController.saveProgress);

/**
 * @swagger
 * /api/journey/{childId}/answers:
 *   post:
 *     summary: Salva resposta de quiz
 *     tags: [Journey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da criança
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *               selectedOptionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resposta salva com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
router.post('/:childId/answers', authenticateJWT, journeyController.saveAnswer);

/**
 * @swagger
 * /api/journey/{childId}/history:
 *   get:
 *     summary: Busca o histórico de respostas de uma criança
 *     tags: [Journey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da criança
 *     responses:
 *       200:
 *         description: Histórico de respostas
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
router.get('/:childId/history', authenticateJWT, journeyController.getAnswerHistory);

module.exports = router;
