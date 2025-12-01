const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const subscriptionPlanController = require('../controllers/subscriptionPlanController');
const authMiddleware = require('../middlewares/auth');

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
 *         sort_order:
 *           type: integer
 *           description: Ordem de exibição do plano
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440000
 *         name: Plano Premium
 *         description: Acesso completo a todos os recursos para famílias
 *         price: 59.9
 *         currency: BRL
 *         billing_cycle: monthly
 *         trial_days: 7
 *         features: {"ai_web":true,"ai_whatsapp":true,"detailed_reports":true}
 *         limits: {"max_children":1,"max_quizzes":"unlimited"}
 *         is_active: true
 *         is_public: true
 *         sort_order: 3
 */

/**
 * @swagger
 * tags:
 *   name: Planos de Assinatura
 *   description: Gerenciamento de planos de assinatura
 */


// Middleware para verificar se o usuário é admin ou owner
const isAdminOrOwner = [
  authMiddleware.verifyToken,
  authMiddleware.isAdminOrOwner
];

/**
 * @swagger
 * /api/subscription-plans/public:
 *   get:
 *     summary: Lista todos os planos de assinatura públicos e ativos
 *     tags: [Planos de Assinatura]
 *     responses:
 *       200:
 *         description: Lista de planos de assinatura
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubscriptionPlan'
 */
// Rota pública para listar planos de assinatura disponíveis
router.get('/public', subscriptionPlanController.listPlans);

/**
 * @swagger
 * /api/subscription-plans:
 *   get:
 *     summary: Lista todos os planos de assinatura (incluindo não publicados)
 *     tags: [Planos de Assinatura]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de planos de assinatura
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubscriptionPlan'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas admin/owner)
 */
// Rota para listar todos os planos de assinatura (incluindo não publicados, apenas admin/owner)
router.get('/', isAdminOrOwner, subscriptionPlanController.listAllPlans);

/**
 * @swagger
 * /api/subscription-plans/{id}:
 *   get:
 *     summary: Obtém um plano de assinatura pelo ID
 *     tags: [Planos de Assinatura]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do plano de assinatura
 *     responses:
 *       200:
 *         description: Plano de assinatura encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionPlan'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Plano não encontrado
 */
// Rota para obter um plano de assinatura pelo ID
router.get('/:id', authMiddleware.verifyToken, subscriptionPlanController.getPlanById);

/**
 * @swagger
 * /api/subscription-plans:
 *   post:
 *     summary: Cria um novo plano de assinatura
 *     tags: [Planos de Assinatura]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - currency
 *               - billing_cycle
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               currency:
 *                 type: string
 *                 default: BRL
 *               billing_cycle:
 *                 type: string
 *                 enum: [monthly, yearly]
 *               trial_days:
 *                 type: integer
 *                 default: 0
 *               features:
 *                 type: object
 *               limits:
 *                 type: object
 *               is_public:
 *                 type: boolean
 *                 default: false
 *               sort_order:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Plano criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionPlan'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas admin/owner)
 */
// Rota para criar um novo plano de assinatura (apenas admin/owner)
router.post(
  '/',
  [
    ...isAdminOrOwner,
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('description').notEmpty().withMessage('Descrição é obrigatória'),
    body('price').isNumeric().withMessage('Preço deve ser um número'),
    body('currency').optional().isString().withMessage('Moeda deve ser uma string'),
    body('billing_cycle').optional().isIn(['monthly', 'quarterly', 'semiannual', 'annual']).withMessage('Ciclo de cobrança deve ser monthly, quarterly, semiannual ou annual'),
    body('trial_days').optional().isInt({ min: 0 }).withMessage('Dias de teste deve ser um número inteiro não negativo'),
    body('features').optional().isObject().withMessage('Features deve ser um objeto'),
    body('limits').optional().isObject().withMessage('Limites deve ser um objeto'),
    body('is_public').optional().isBoolean().withMessage('is_public deve ser um booleano'),
    body('is_active').optional().isBoolean().withMessage('is_active deve ser um booleano'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('Ordem de exibição deve ser um número inteiro não negativo')
  ],
  subscriptionPlanController.createPlan
);

// Rota para atualizar um plano de assinatura (apenas admin/owner)
router.put(
  '/:id',
  [
    ...isAdminOrOwner,
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('description').optional().notEmpty().withMessage('Descrição não pode ser vazia'),
    body('price').optional().isNumeric().withMessage('Preço deve ser um número'),
    body('currency').optional().isString().withMessage('Moeda deve ser uma string'),
    body('billing_cycle').optional().isIn(['monthly', 'quarterly', 'semiannual', 'annual']).withMessage('Ciclo de cobrança deve ser monthly, quarterly, semiannual ou annual'),
    body('trial_days').optional().isInt({ min: 0 }).withMessage('Dias de teste deve ser um número inteiro não negativo'),
    body('features').optional().isObject().withMessage('Features deve ser um objeto'),
    body('limits').optional().isObject().withMessage('Limites deve ser um objeto'),
    body('is_public').optional().isBoolean().withMessage('is_public deve ser um booleano'),
    body('is_active').optional().isBoolean().withMessage('is_active deve ser um booleano'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('Ordem de exibição deve ser um número inteiro não negativo')
  ],
  subscriptionPlanController.updatePlan
);

// Rota para excluir um plano de assinatura (apenas admin/owner)
router.delete('/:id', isAdminOrOwner, subscriptionPlanController.deletePlan);

// Rota para comparar planos de assinatura
router.get('/compare', subscriptionPlanController.comparePlans);

module.exports = router;
