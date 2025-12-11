const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardMetrics:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *           description: Total de usuários cadastrados
 *         activeSubscriptions:
 *           type: integer
 *           description: Número de assinaturas ativas
 *         monthlyRevenue:
 *           type: number
 *           description: Receita mensal
 *         churnRate:
 *           type: number
 *           description: Taxa de churn em porcentagem
 *         systemHealth:
 *           type: number
 *           description: Saúde do sistema em porcentagem
 *         newUsersToday:
 *           type: integer
 *           description: Novos usuários hoje
 *         conversionRate:
 *           type: number
 *           description: Taxa de conversão em porcentagem
 *         uptime:
 *           type: number
 *           description: Uptime do sistema em porcentagem
 */

/**
 * @swagger
 * /api/dashboard/user-metrics:
 *   get:
 *     summary: Busca métricas do dashboard do usuário (parent/professional)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas do dashboard do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metrics:
 *                   type: object
 *                   properties:
 *                     totalChildren:
 *                       type: integer
 *                     childrenInProgress:
 *                       type: integer
 *                     completedJourneys:
 *                       type: integer
 *                     totalSessions:
 *                       type: integer
 *                     activeSessions:
 *                       type: integer
 *                     completedSessions:
 *                       type: integer
 *                     totalReports:
 *                       type: integer
 *                     averageProgress:
 *                       type: integer
 *                 rawData:
 *                   type: object
 *                   properties:
 *                     children:
 *                       type: array
 *                       items:
 *                         type: object
 *                     subscription:
 *                       type: object
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/user-metrics', authMiddleware.verifyToken, dashboardController.getUserDashboardMetrics);

/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Busca métricas principais do dashboard (admin/owner)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardMetrics'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/metrics', authMiddleware.verifyToken, dashboardController.getMetrics);

/**
 * @swagger
 * /api/dashboard/subscription-plans-metrics:
 *   get:
 *     summary: Busca métricas dos planos de assinatura
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas dos planos de assinatura
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plans:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       planName:
 *                         type: string
 *                       subscriberCount:
 *                         type: integer
 *                       revenue:
 *                         type: number
 *                       growthPercentage:
 *                         type: number
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/subscription-plans-metrics', authMiddleware.verifyToken, dashboardController.getSubscriptionPlanMetrics);

/**
 * @swagger
 * /api/dashboard/user-growth:
 *   get:
 *     summary: Busca dados de crescimento de usuários
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Número de dias para análise
 *     responses:
 *       200:
 *         description: Dados de crescimento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 growth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       users:
 *                         type: integer
 *                       subscriptions:
 *                         type: integer
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/user-growth', authMiddleware.verifyToken, dashboardController.getUserGrowthData);

/**
 * @swagger
 * /api/dashboard/system-stats:
 *   get:
 *     summary: Busca estatísticas gerais do sistema
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 activeUsers:
 *                   type: integer
 *                 totalSubscriptions:
 *                   type: integer
 *                 activeSubscriptions:
 *                   type: integer
 *                 totalRevenue:
 *                   type: number
 *                 monthlyRevenue:
 *                   type: number
 *                 totalPlans:
 *                   type: integer
 *                 activePlans:
 *                   type: integer
 *                 totalTeams:
 *                   type: integer
 *                 activeTeams:
 *                   type: integer
 *                 totalProfiles:
 *                   type: integer
 *                 verifiedProfiles:
 *                   type: integer
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/system-stats', authMiddleware.verifyToken, dashboardController.getSystemStats);

/**
 * @swagger
 * /api/dashboard/revenue-analytics:
 *   get:
 *     summary: Busca análise de receita
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: monthly
 *         description: Período para análise
 *     responses:
 *       200:
 *         description: Análise de receita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analytics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       period:
 *                         type: string
 *                       revenue:
 *                         type: number
 *                       subscriptions:
 *                         type: integer
 *                 period:
 *                   type: string
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/revenue-analytics', authMiddleware.verifyToken, dashboardController.getRevenueAnalytics);

/**
 * @swagger
 * /api/dashboard/users-by-role:
 *   get:
 *     summary: Busca usuários agrupados por role
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuários por role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usersByRole:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                       count:
 *                         type: integer
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/users-by-role', authMiddleware.verifyToken, dashboardController.getUsersByRole);

/**
 * @swagger
 * /api/dashboard/subscriptions-by-status:
 *   get:
 *     summary: Busca assinaturas agrupadas por status
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assinaturas por status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscriptionsByStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       count:
 *                         type: integer
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/subscriptions-by-status', authMiddleware.verifyToken, dashboardController.getSubscriptionsByStatus);

/**
 * @swagger
 * /api/dashboard/baby-health-summary:
 *   get:
 *     summary: Resumo completo de saúde do bebê (biometria, sono, vacinas, consultas)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: childId
 *         schema:
 *           type: string
 *         description: ID da criança (opcional, usa a criança ativa se não informado)
 *     responses:
 *       200:
 *         description: Resumo de saúde do bebê
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/baby-health-summary', authMiddleware.verifyToken, dashboardController.getBabyHealthSummary);

module.exports = router;
