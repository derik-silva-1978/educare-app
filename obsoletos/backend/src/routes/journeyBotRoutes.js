const express = require('express');
const router = express.Router();
const journeyBotController = require('../controllers/journeyBotController');
const authMiddleware = require('../middlewares/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/journey-bot/questions:
 *   get:
 *     summary: Buscar perguntas por faixa etária
 *     tags: [Journey Bot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: age_months
 *         required: true
 *         schema:
 *           type: integer
 *         description: Idade da criança em meses
 *     responses:
 *       200:
 *         description: Lista de perguntas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JourneyBotQuestion'
 */
router.get('/questions', journeyBotController.getQuestionsForAge);

/**
 * @swagger
 * /api/journey-bot/sessions/active:
 *   get:
 *     summary: Buscar sessão ativa para uma criança
 *     tags: [Journey Bot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: child_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da criança
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Sessão ativa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JourneyBotSession'
 */
router.get('/sessions/active', journeyBotController.getActiveSession);

/**
 * @swagger
 * /api/journey-bot/sessions:
 *   post:
 *     summary: Criar nova sessão do journey bot
 *     tags: [Journey Bot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - child_id
 *             properties:
 *               user_id:
 *                 type: string
 *               child_id:
 *                 type: string
 *               total_questions:
 *                 type: integer
 *               answered_questions:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused]
 *               session_data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Sessão criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JourneyBotSession'
 */
router.post('/sessions', journeyBotController.createSession);

/**
 * @swagger
 * /api/journey-bot/sessions/{id}:
 *   put:
 *     summary: Atualizar sessão do journey bot
 *     tags: [Journey Bot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sessão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total_questions:
 *                 type: integer
 *               answered_questions:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused]
 *               session_data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Sessão atualizada com sucesso
 */
router.put('/sessions/:id', journeyBotController.updateSession);

/**
 * @swagger
 * /api/journey-bot/responses:
 *   get:
 *     summary: Buscar respostas de uma criança
 *     tags: [Journey Bot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: child_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da criança
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de respostas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JourneyBotResponse'
 *   post:
 *     summary: Salvar resposta do journey bot
 *     tags: [Journey Bot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - child_id
 *               - question_id
 *               - answer
 *             properties:
 *               user_id:
 *                 type: string
 *               child_id:
 *                 type: string
 *               question_id:
 *                 type: string
 *               answer:
 *                 type: integer
 *               answer_text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resposta salva com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JourneyBotResponse'
 */
router.get('/responses', journeyBotController.getChildResponses);
router.post('/responses', journeyBotController.saveResponse);

module.exports = router;
