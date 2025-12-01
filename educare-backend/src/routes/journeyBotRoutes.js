const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const journeyBotController = require('../controllers/journeyBotController');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(verifyToken);

/**
 * @swagger
 * /api/journey-bot/responses:
 *   get:
 *     summary: Obter respostas existentes para uma criança
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
 *         description: Respostas encontradas
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/responses', journeyBotController.getChildResponses);

/**
 * @swagger
 * /api/journey-bot/questions:
 *   get:
 *     summary: Obter perguntas por idade
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
 *         description: Perguntas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/questions', journeyBotController.getQuestionsForAge);

/**
 * @swagger
 * /api/journey-bot/sessions/active:
 *   get:
 *     summary: Obter sessão ativa para uma criança
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
 *       404:
 *         description: Sessão ativa não encontrada
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/sessions/active', journeyBotController.getActiveSession);

/**
 * @swagger
 * /api/journey-bot/sessions:
 *   post:
 *     summary: Criar nova sessão do Journey Bot
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
 *               - total_questions
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
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/sessions', [
  body('user_id').isUUID().withMessage('ID do usuário deve ser um UUID válido'),
  body('child_id').isUUID().withMessage('ID da criança deve ser um UUID válido'),
  body('total_questions').isInt({ min: 0 }).withMessage('Total de perguntas deve ser um número inteiro não negativo'),
  body('answered_questions').optional().isInt({ min: 0 }).withMessage('Perguntas respondidas deve ser um número inteiro não negativo'),
  body('status').optional().isIn(['active', 'completed', 'paused']).withMessage('Status deve ser active, completed ou paused')
], journeyBotController.createSession);

/**
 * @swagger
 * /api/journey-bot/sessions/{sessionId}:
 *   put:
 *     summary: Atualizar sessão do Journey Bot
 *     tags: [Journey Bot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
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
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused]
 *               answered_questions:
 *                 type: integer
 *               completed_at:
 *                 type: string
 *                 format: date-time
 *               session_data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Sessão atualizada com sucesso
 *       404:
 *         description: Sessão não encontrada
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/sessions/:sessionId', journeyBotController.updateSession);

/**
 * @swagger
 * /api/journey-bot/responses:
 *   post:
 *     summary: Salvar resposta do Journey Bot
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
 *               - answer_text
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
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/responses', [
  body('user_id').isUUID().withMessage('ID do usuário deve ser um UUID válido'),
  body('child_id').isUUID().withMessage('ID da criança deve ser um UUID válido'),
  body('question_id').notEmpty().withMessage('ID da pergunta é obrigatório'),
  body('answer').isInt().withMessage('Resposta deve ser um número inteiro'),
  body('answer_text').notEmpty().withMessage('Texto da resposta é obrigatório')
], journeyBotController.saveResponse);

module.exports = router;
