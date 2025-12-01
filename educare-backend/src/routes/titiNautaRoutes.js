/**
 * Rotas para o TitiNauta Journey
 */

const express = require('express');
const router = express.Router();
const titiNautaController = require('../controllers/titiNautaController');
const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * /api/journey/ai/status:
 *   get:
 *     summary: Verifica o status da integração de IA
 *     tags: [TitiNauta]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status da IA
 *       500:
 *         description: Erro interno
 */
router.get('/ai/status', verifyToken, titiNautaController.getAIStatus);

/**
 * @swagger
 * /api/journey/chat:
 *   post:
 *     summary: Chat geral com TitiNauta usando IA
 *     tags: [TitiNauta]
 *     security:
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
 *               conversationHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Resposta da IA
 *       503:
 *         description: Serviço de IA não configurado
 */
router.post('/chat', verifyToken, titiNautaController.chat);

/**
 * @swagger
 * /api/journey/ai/feedback:
 *   post:
 *     summary: Gera feedback de IA para uma resposta
 *     tags: [TitiNauta]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - userAnswer
 *             properties:
 *               questionId:
 *                 type: string
 *               userAnswer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback gerado
 *       503:
 *         description: Serviço de IA não configurado
 */
router.post('/ai/feedback', verifyToken, titiNautaController.generateAIFeedback);

/**
 * @swagger
 * /api/journey/{childId}:
 *   get:
 *     summary: Busca o conteúdo da jornada para uma criança
 *     tags: [TitiNauta]
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
router.get('/:childId', verifyToken, titiNautaController.getJourneyContent);

/**
 * @swagger
 * /api/journey/{childId}/progress:
 *   post:
 *     summary: Salva o progresso da jornada
 *     tags: [TitiNauta]
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
router.post('/:childId/progress', verifyToken, titiNautaController.saveProgress);

/**
 * @swagger
 * /api/journey/{childId}/answers:
 *   post:
 *     summary: Salva resposta de quiz
 *     tags: [TitiNauta]
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
router.post('/:childId/answers', verifyToken, titiNautaController.saveAnswer);

/**
 * @swagger
 * /api/journey/{childId}/history:
 *   get:
 *     summary: Busca o histórico de respostas de uma criança
 *     tags: [TitiNauta]
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
router.get('/:childId/history', verifyToken, titiNautaController.getAnswerHistory);

/**
 * @swagger
 * /api/journey/{childId}/chat:
 *   post:
 *     summary: Chat com TitiNauta usando IA (contexto de criança específica)
 *     tags: [TitiNauta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da criança para contextualização
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
 *               conversationHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Resposta da IA
 *       503:
 *         description: Serviço de IA não configurado
 */
router.post('/:childId/chat', verifyToken, titiNautaController.chat);

/**
 * @swagger
 * /api/journey/{childId}/analyze:
 *   get:
 *     summary: Analisa o progresso de desenvolvimento da criança
 *     tags: [TitiNauta]
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
 *         description: Análise de progresso
 *       404:
 *         description: Criança não encontrada
 *       503:
 *         description: Serviço de IA não configurado
 */
router.get('/:childId/analyze', verifyToken, titiNautaController.analyzeProgress);

module.exports = router;
