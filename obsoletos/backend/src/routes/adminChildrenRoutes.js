const express = require('express');
const router = express.Router();
const adminChildrenController = require('../controllers/adminChildrenController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     GlobalChildrenResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             children:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   birth_date:
 *                     type: string
 *                     format: date
 *                   progress:
 *                     type: number
 *                   quizCount:
 *                     type: number
 *                   parent:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   teams:
 *                     type: array
 *                     items:
 *                       type: object
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalItems:
 *                   type: number
 *                 itemsPerPage:
 *                   type: number
 *     
 *     GlobalStatsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             totalChildren:
 *               type: number
 *             ageGroups:
 *               type: object
 *               properties:
 *                 0-12m:
 *                   type: number
 *                 13-24m:
 *                   type: number
 *                 25-36m:
 *                   type: number
 *                 3-5y:
 *                   type: number
 *             teamParticipation:
 *               type: object
 *               properties:
 *                 inTeams:
 *                   type: number
 *                 withoutTeams:
 *                   type: number
 *             quizStats:
 *               type: object
 *               properties:
 *                 totalSessions:
 *                   type: number
 *                 averageScore:
 *                   type: number
 *             recentGrowth:
 *               type: object
 *               properties:
 *                 last30Days:
 *                   type: number
 */

/**
 * @swagger
 * /api/admin/children:
 *   get:
 *     summary: Listar todas as crianças do sistema (Admin/Owner/Professional)
 *     tags: [Admin - Gestão de Crianças]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome da criança
 *       - in: query
 *         name: ageGroup
 *         schema:
 *           type: string
 *           enum: [0-12m, 13-24m, 25-36m, 3-5y]
 *         description: Filtrar por faixa etária
 *       - in: query
 *         name: hasTeam
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrar por participação em equipes
 *       - in: query
 *         name: progressRange
 *         schema:
 *           type: string
 *           example: "0-25"
 *         description: Filtrar por faixa de progresso (ex: 0-25, 26-50, 51-75, 76-100)
 *       - in: query
 *         name: professionalId
 *         schema:
 *           type: string
 *         description: Filtrar por profissional específico (apenas admin/owner)
 *     responses:
 *       200:
 *         description: Lista de crianças obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GlobalChildrenResponse'
 *       401:
 *         description: Token de autenticação inválido
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', auth, adminChildrenController.getAllChildren);

/**
 * @swagger
 * /api/admin/children/stats:
 *   get:
 *     summary: Obter estatísticas globais do sistema (Admin/Owner apenas)
 *     tags: [Admin - Gestão de Crianças]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas globais obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GlobalStatsResponse'
 *       401:
 *         description: Token de autenticação inválido
 *       403:
 *         description: Acesso negado (apenas admin/owner)
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/stats', auth, adminChildrenController.getGlobalStats);

/**
 * @swagger
 * /api/admin/children/{childId}:
 *   get:
 *     summary: Obter detalhes de uma criança específica
 *     tags: [Admin - Gestão de Crianças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da criança
 *     responses:
 *       200:
 *         description: Detalhes da criança obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     birth_date:
 *                       type: string
 *                       format: date
 *                     progress:
 *                       type: number
 *                     quizSessions:
 *                       type: array
 *                     quizCount:
 *                       type: number
 *                     parent:
 *                       type: object
 *                     teams:
 *                       type: array
 *       401:
 *         description: Token de autenticação inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Criança não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:childId', auth, adminChildrenController.getChildDetails);

module.exports = router;
