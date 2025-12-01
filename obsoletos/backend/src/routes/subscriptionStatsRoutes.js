const express = require('express');
const router = express.Router();
const subscriptionStatsController = require('../controllers/subscriptionStatsController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Subscription Stats
 *   description: Estatísticas de assinaturas e métricas do dashboard
 */

/**
 * @swagger
 * /api/subscription-stats/by-plan:
 *   get:
 *     summary: Busca estatísticas de assinaturas agrupadas por plano
 *     tags: [Subscription Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de assinaturas por plano
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
 *                     planStats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           planId:
 *                             type: string
 *                           planName:
 *                             type: string
 *                           price:
 *                             type: number
 *                           currency:
 *                             type: string
 *                           totalSubscriptions:
 *                             type: integer
 *                           activeSubscriptions:
 *                             type: integer
 *                           trialSubscriptions:
 *                             type: integer
 *                           subscriberCount:
 *                             type: integer
 *                           revenue:
 *                             type: number
 *                           growthPercentage:
 *                             type: number
 *                     totalStats:
 *                       type: object
 *                       properties:
 *                         totalPlans:
 *                           type: integer
 *                         totalSubscriptions:
 *                           type: integer
 *                         activeSubscriptions:
 *                           type: integer
 *                         totalRevenue:
 *                           type: number
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/by-plan', auth, subscriptionStatsController.getSubscriptionStatsByPlan);

/**
 * @swagger
 * /api/subscription-stats/dashboard-metrics:
 *   get:
 *     summary: Busca métricas gerais para o dashboard
 *     tags: [Subscription Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas gerais do dashboard
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
 *                     totalUsers:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                     totalSubscriptions:
 *                       type: integer
 *                     activeSubscriptions:
 *                       type: integer
 *                     monthlyRevenue:
 *                       type: number
 *                     churnRate:
 *                       type: number
 *                     systemHealth:
 *                       type: number
 *                     uptime:
 *                       type: number
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/dashboard-metrics', auth, subscriptionStatsController.getDashboardMetrics);

module.exports = router;
