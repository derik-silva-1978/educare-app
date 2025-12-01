const express = require('express');
const router = express.Router();
const adminJourneyQuestionsController = require('../controllers/adminJourneyQuestionsController');
const { verifyToken } = require('../middlewares/auth');

// Middleware de autenticação (usuários autenticados podem acessar)
router.use(verifyToken);

/**
 * @swagger
 * /api/journey-questions:
 *   get:
 *     summary: Listar perguntas da jornada (usuários autenticados)
 *     tags: [Journey Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página atual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Itens por página
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: min_age_months
 *         schema:
 *           type: integer
 *         description: Idade mínima em meses
 *       - in: query
 *         name: max_age_months
 *         schema:
 *           type: integer
 *         description: Idade máxima em meses
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar no texto da pergunta
 *     responses:
 *       200:
 *         description: Lista de perguntas
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
 *                     type: object
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', adminJourneyQuestionsController.listQuestions);

/**
 * @swagger
 * /api/journey-questions/week/{weekNumber}/quizzes:
 *   get:
 *     summary: Obter quizzes de uma semana específica
 *     tags: [Journey Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weekNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número da semana
 *       - in: query
 *         name: min_age_months
 *         schema:
 *           type: integer
 *         description: Idade mínima em meses
 *       - in: query
 *         name: max_age_months
 *         schema:
 *           type: integer
 *         description: Idade máxima em meses
 *     responses:
 *       200:
 *         description: Quizzes encontrados
 *       400:
 *         description: Parâmetros inválidos
 */
router.get('/week/:weekNumber/quizzes', adminJourneyQuestionsController.getWeekQuizzes);

/**
 * @swagger
 * /api/journey-questions/{id}:
 *   get:
 *     summary: Obter pergunta por ID (usuários autenticados)
 *     tags: [Journey Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pergunta
 *     responses:
 *       200:
 *         description: Pergunta encontrada
 *       404:
 *         description: Pergunta não encontrada
 */
router.get('/:id', adminJourneyQuestionsController.getQuestion);

module.exports = router;
