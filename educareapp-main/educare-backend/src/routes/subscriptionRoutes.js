const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da assinatura
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID do usuário assinante
 *         plan_id:
 *           type: string
 *           format: uuid
 *           description: ID do plano de assinatura
 *         status:
 *           type: string
 *           enum: [active, canceled, expired, trial, pending]
 *           description: Status da assinatura
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Data de início da assinatura
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Data de término da assinatura
 *         trial_end_date:
 *           type: string
 *           format: date-time
 *           description: Data de término do período de teste
 *         payment_method:
 *           type: string
 *           description: Método de pagamento
 *         payment_details:
 *           type: object
 *           description: Detalhes do pagamento
 *         auto_renew:
 *           type: boolean
 *           description: Indica se a assinatura renova automaticamente
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionPlan:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - currency
 *         - billing_cycle
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do plano de assinatura
 *         name:
 *           type: string
 *           description: Nome do plano
 *         description:
 *           type: string
 *           description: Descrição detalhada do plano
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do plano
 *         currency:
 *           type: string
 *           description: "Moeda do preço (ex: BRL, USD)"
 *         billing_cycle:
 *           type: string
 *           enum: [monthly, yearly]
 *           description: Ciclo de cobrança
 *         trial_days:
 *           type: integer
 *           description: Dias de teste gratuito
 *         features:
 *           type: object
 *           description: Recursos incluídos no plano
 *         limits:
 *           type: object
 *           description: "Limites do plano (ex: número máximo de crianças)"
 *         is_active:
 *           type: boolean
 *           description: Indica se o plano está ativo
 *         is_public:
 *           type: boolean
 *           description: Indica se o plano é visível publicamente
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         role:
 *           type: string
 *           enum: [user, professional, admin, owner]
 *           description: Papel do usuário no sistema
 *         status:
 *           type: string
 *           enum: [active, inactive, pending, blocked]
 *           description: Status da conta do usuário
 *         email_verified:
 *           type: boolean
 *           description: Indica se o email foi verificado
 *         last_login:
 *           type: string
 *           format: date-time
 *           description: Data e hora do último login
 */

/**
 * @swagger
 * tags:
 *   name: Assinaturas
 *   description: Gerenciamento de assinaturas de usuários
 */



// Middleware para verificar se o usuário está autenticado
const isAuthenticated = authMiddleware.verifyToken;

// Middleware para verificar se o usuário é admin ou owner
const isAdminOrOwner = [
  authMiddleware.verifyToken,
  authMiddleware.isAdminOrOwner
];

// Rota para listar assinaturas do usuário logado
router.get('/me', isAuthenticated, subscriptionController.getMySubscriptions);

// Rota para obter assinatura ativa do usuário logado
router.get('/me/active', isAuthenticated, subscriptionController.getMyActiveSubscription);

// Rota para criar uma nova assinatura para o usuário logado
router.post(
  '/',
  [
    isAuthenticated,
    body('planId').isInt().withMessage('ID do plano inválido'),
    body('paymentMethodId').optional(),
    body('couponCode').optional()
  ],
  subscriptionController.createSubscription
);

// Rota para cancelar uma assinatura do usuário logado
router.post(
  '/:id/cancel',
  [
    isAuthenticated,
    body('reason').optional()
  ],
  subscriptionController.cancelSubscription
);

// Rota para renovar uma assinatura do usuário logado
router.post(
  '/:id/renew',
  [
    isAuthenticated,
    body('paymentMethodId').optional()
  ],
  subscriptionController.renewSubscription
);

// ========== ROTAS ADMINISTRATIVAS ==========

/**
 * @swagger
 * /api/subscriptions/admin/all:
 *   get:
 *     summary: Listar todas as assinaturas (Admin/Owner)
 *     tags: [Admin - Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas as assinaturas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscriptions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subscription'
 *                 total:
 *                   type: integer
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/admin/all', isAdminOrOwner, subscriptionController.getAllSubscriptions);

/**
 * @swagger
 * /api/subscriptions/admin/stats:
 *   get:
 *     summary: Obter estatísticas de assinaturas (Admin/Owner)
 *     tags: [Admin - Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de assinaturas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSubscriptions:
 *                   type: integer
 *                 activeSubscriptions:
 *                   type: integer
 *                 trialSubscriptions:
 *                   type: integer
 *                 expiredSubscriptions:
 *                   type: integer
 *                 cancelledSubscriptions:
 *                   type: integer
 *                 newThisMonth:
 *                   type: integer
 *                 monthlyRevenue:
 *                   type: number
 *                 revenueGrowth:
 *                   type: number
 *                 conversionRate:
 *                   type: number
 *                 churnRate:
 *                   type: number
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/admin/stats', isAdminOrOwner, subscriptionController.getSubscriptionStats);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Obter detalhes de uma assinatura
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da assinatura
 *     responses:
 *       200:
 *         description: Detalhes da assinatura
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Assinatura não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', isAuthenticated, subscriptionController.getSubscriptionDetails || subscriptionController.getMyActiveSubscription);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Atualizar assinatura (Admin/Owner)
 *     tags: [Admin - Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da assinatura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, trial, expired, cancelled, suspended]
 *               endDate:
 *                 type: string
 *                 format: date
 *               nextBillingDate:
 *                 type: string
 *                 format: date
 *               autoRenew:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Assinatura atualizada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Assinatura não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', isAdminOrOwner, subscriptionController.updateSubscription);

/**
 * @swagger
 * /api/subscriptions/{id}/suspend:
 *   post:
 *     summary: Suspender assinatura (Admin/Owner)
 *     tags: [Admin - Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da assinatura
 *     responses:
 *       200:
 *         description: Assinatura suspensa com sucesso
 *       400:
 *         description: Assinatura já está suspensa
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Assinatura não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:id/suspend', isAdminOrOwner, subscriptionController.suspendSubscription);

/**
 * @swagger
 * /api/subscriptions/{id}/reactivate:
 *   post:
 *     summary: Reativar assinatura (Admin/Owner)
 *     tags: [Admin - Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da assinatura
 *     responses:
 *       200:
 *         description: Assinatura reativada com sucesso
 *       400:
 *         description: Assinatura já está ativa ou foi cancelada
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Assinatura não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:id/reactivate', isAdminOrOwner, subscriptionController.reactivateSubscription);

// Rota para mudar o plano de uma assinatura do usuário logado
router.post(
  '/:id/change-plan',
  [
    isAuthenticated,
    body('newPlanId').isInt().withMessage('ID do novo plano inválido'),
    body('immediate').optional().isBoolean().withMessage('immediate deve ser um booleano')
  ],
  subscriptionController.changePlan
);

// Rota para obter assinatura ativa de um usuário específico (apenas admin/owner)
router.get('/user/:userId/active', isAdminOrOwner, subscriptionController.getUserActiveSubscription);

// ROTA TEMPORÁRIA PARA TESTE - SEM AUTENTICAÇÃO
router.get('/test/user/:userId/active', subscriptionController.getUserActiveSubscription);

// Rota para listar todas as assinaturas (apenas admin/owner)
router.get('/', isAdminOrOwner, subscriptionController.listAllSubscriptions);

// Rota para obter uma assinatura pelo ID (próprio usuário ou admin/owner)
router.get('/:id', isAuthenticated, subscriptionController.getSubscriptionById);

// Rota para atualizar o status de uma assinatura (apenas admin/owner)
router.patch(
  '/:id/status',
  [
    ...isAdminOrOwner,
    body('status').isIn(['active', 'canceled', 'expired', 'pending', 'failed']).withMessage('Status inválido'),
    body('reason').optional()
  ],
  subscriptionController.updateSubscriptionStatus
);

// Rota para processar webhook de pagamento
router.post('/webhook', subscriptionController.processPaymentWebhook);

module.exports = router;
