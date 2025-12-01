const express = require('express');
const router = express.Router();
const userActivitiesController = require('../controllers/userActivitiesController');
const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserWithChildren:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         role:
 *           type: string
 *           description: Role do usuário
 *         children:
 *           type: array
 *           items:
 *             type: object
 *         activities_count:
 *           type: integer
 *           description: Número de atividades disponíveis
 *     
 *     UserActivitiesStats:
 *       type: object
 *       properties:
 *         total_users:
 *           type: integer
 *           description: Total de usuários no sistema
 *         users_with_children:
 *           type: integer
 *           description: Usuários que têm crianças cadastradas
 *         total_children:
 *           type: integer
 *           description: Total de crianças no sistema
 *         age_distribution:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               age_range:
 *                 type: string
 *                 description: Faixa etária
 *               users_count:
 *                 type: integer
 *                 description: Número de usuários nesta faixa
 *               children_count:
 *                 type: integer
 *                 description: Número de crianças nesta faixa
 *               activities_count:
 *                 type: integer
 *                 description: Número de atividades para esta faixa
 *         activities_by_category:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: Categoria da atividade
 *               users_count:
 *                 type: integer
 *                 description: Usuários com crianças nesta categoria
 *               activities_count:
 *                 type: integer
 *                 description: Número de atividades nesta categoria
 */

/**
 * @swagger
 * /api/admin/user-activities:
 *   get:
 *     summary: Listar usuários com suas crianças e atividades disponíveis
 *     tags: [Admin - Gestão de Atividades]
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
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou email do usuário
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, professional, admin, owner]
 *         description: Filtrar por role do usuário
 *       - in: query
 *         name: has_children
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas usuários com crianças
 *       - in: query
 *         name: min_children_age
 *         schema:
 *           type: integer
 *         description: Idade mínima das crianças (em meses)
 *       - in: query
 *         name: max_children_age
 *         schema:
 *           type: integer
 *         description: Idade máxima das crianças (em meses)
 *     responses:
 *       200:
 *         description: Lista de usuários com atividades
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
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserWithChildren'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', verifyToken, userActivitiesController.getAllUsersWithActivities);

/**
 * @swagger
 * /api/admin/user-activities/stats:
 *   get:
 *     summary: Obter estatísticas de atividades por usuários
 *     tags: [Admin - Gestão de Atividades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de atividades por usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserActivitiesStats'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/stats', verifyToken, userActivitiesController.getUserActivitiesStats);

/**
 * @swagger
 * /api/admin/user-activities/{userId}:
 *   get:
 *     summary: Obter atividades específicas para um usuário
 *     tags: [Admin - Gestão de Atividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Atividades do usuário baseadas na idade de suas crianças
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
 *                     user:
 *                       $ref: '#/components/schemas/UserWithChildren'
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                     children_ages:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       description: Idades das crianças em meses
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:userId', verifyToken, userActivitiesController.getUserActivities);

/**
 * @swagger
 * /api/admin/user-activities/child/{childId}:
 *   get:
 *     summary: Obter atividades recomendadas para uma criança específica
 *     tags: [Admin - Gestão de Atividades]
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
 *         description: Atividades recomendadas para a criança
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
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Criança não encontrada
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/child/:childId', verifyToken, userActivitiesController.getChildActivities);

module.exports = router;
