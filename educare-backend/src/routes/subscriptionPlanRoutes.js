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

router.get('/diagnose-db', async (req, res) => {
  try {
    const authHeader = req.headers['x-seed-key'];
    if (authHeader !== process.env.OPENAI_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { sequelize } = require('../config/database');
    const results = {};

    const tables = ['users', 'profiles', 'subscription_plans', 'subscriptions'];
    for (const table of tables) {
      try {
        const [cols] = await sequelize.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '${table}' ORDER BY ordinal_position`);
        results[table] = { exists: true, columns: cols };
      } catch (e) {
        results[table] = { exists: false, error: e.message };
      }
    }

    try {
      const [enums] = await sequelize.query(`SELECT t.typname, e.enumlabel FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid ORDER BY t.typname, e.enumsortorder`);
      results.enums = enums;
    } catch (e) {
      results.enums_error = e.message;
    }

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/test-register', async (req, res) => {
  try {
    const authHeader = req.headers['x-seed-key'];
    if (authHeader !== process.env.OPENAI_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { User, Profile, SubscriptionPlan, Subscription } = require('../models');
    const bcrypt = require('bcryptjs');
    const { normalizePhoneNumber } = require('../utils/phoneUtils');
    const crypto = require('crypto');

    const { email, phone, password, name, role, plan_id } = req.body;
    const steps = [];

    try {
      steps.push('1. Normalizing phone');
      const phoneToSave = phone ? normalizePhoneNumber(phone) : null;
      steps.push(`   Phone normalized: ${phoneToSave}`);

      steps.push('2. Creating user');
      const approvalToken = crypto.randomBytes(24).toString('hex');
      const user = await User.create({
        email,
        phone: phoneToSave,
        password,
        name,
        role: role === 'parent' ? 'user' : role,
        status: 'pending',
        reset_token: approvalToken,
        reset_token_expires: new Date(Date.now() + 30 * 24 * 3600000)
      });
      steps.push(`   User created: ${user.id}`);

      steps.push('3. Creating profile');
      await Profile.create({
        user_id: user.id,
        name: name,
        type: 'parent',
        phone: phoneToSave
      });
      steps.push('   Profile created');

      steps.push('4. Finding plan');
      let selectedPlanId = plan_id;
      if (!plan_id) {
        const freePlan = await SubscriptionPlan.findOne({
          where: { is_active: true, is_public: true },
          order: [['price', 'ASC']]
        });
        selectedPlanId = freePlan ? freePlan.id : null;
      }
      steps.push(`   Plan ID: ${selectedPlanId}`);

      if (selectedPlanId) {
        steps.push('5. Creating subscription');
        const plan = await SubscriptionPlan.findByPk(selectedPlanId);
        if (plan) {
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);
          await Subscription.create({
            userId: user.id,
            planId: selectedPlanId,
            status: plan.trial_days > 0 ? 'trial' : 'active',
            startDate,
            endDate,
            nextBillingDate: new Date(endDate),
            autoRenew: true,
            childrenCount: 0,
            usageStats: {},
            paymentDetails: {}
          });
          steps.push('   Subscription created');
        }
      }

      steps.push('6. Cleaning up test user');
      await Subscription.destroy({ where: { userId: user.id } });
      await Profile.destroy({ where: { user_id: user.id } });
      await User.destroy({ where: { id: user.id }, force: true });
      steps.push('   Test user cleaned up');

      return res.json({ success: true, steps });
    } catch (innerError) {
      steps.push(`ERROR: ${innerError.message}`);
      steps.push(`STACK: ${innerError.stack?.split('\n').slice(0, 5).join(' | ')}`);
      if (innerError.parent) {
        steps.push(`SQL ERROR: ${innerError.parent.message}`);
        steps.push(`SQL DETAIL: ${innerError.parent.detail || 'none'}`);
      }
      return res.json({ success: false, steps, error: innerError.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack?.split('\n').slice(0, 5) });
  }
});

router.post('/seed-initial', async (req, res) => {
  try {
    const authHeader = req.headers['x-seed-key'];
    if (authHeader !== process.env.OPENAI_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { sequelize } = require('../config/database');
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM subscription_plans');
    const count = parseInt(results[0].count, 10);

    if (count > 0) {
      return res.json({ message: `Plans already exist (${count} found)`, seeded: false });
    }

    await sequelize.query(`
      INSERT INTO subscription_plans (id, name, description, price, currency, billing_cycle, trial_days, features, limits, is_active, is_public, sort_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), 'Plano Gratuito', 'Plano básico com recursos limitados para experimentar a plataforma.', 0.00, 'BRL', 'monthly', 0, '{"ai_whatsapp":true,"basic_assessments":true,"chat_support":true,"blog_access":true}', '{"max_children":1,"max_quizzes":5,"max_journeys":2}', true, true, 1, NOW(), NOW()),
        (gen_random_uuid(), 'Plano Básico', 'Acesso a recursos essenciais para acompanhamento do desenvolvimento infantil.', 29.90, 'BRL', 'monthly', 7, '{"ai_web":true,"basic_reports":true,"notifications":true,"academy_access":true,"blog_access":true}', '{"max_children":1,"max_quizzes":15,"max_journeys":5,"max_documents":10}', true, true, 2, NOW(), NOW()),
        (gen_random_uuid(), 'Plano Premium', 'Acesso completo a todos os recursos para famílias.', 59.90, 'BRL', 'monthly', 7, '{"ai_web":true,"ai_whatsapp":true,"detailed_reports":true,"professional_sharing":true,"support_groups":true,"live_sessions":true,"mentoring":true,"academy_access":true,"blog_access":true}', '{"max_children":1,"max_quizzes":"unlimited","max_journeys":"unlimited","max_documents":50,"max_professionals":3}', true, true, 3, NOW(), NOW()),
        (gen_random_uuid(), 'Plano Empresarial', 'Solução completa para escolas, clínicas e instituições.', 199.90, 'BRL', 'monthly', 14, '{"ai_enterprise":true,"dashboard":true,"advanced_reports":true,"academy_full_access":true,"group_mentoring":true,"priority_support":true,"api_access":true,"custom_branding":true}', '{"max_children":5,"max_quizzes":"unlimited","max_journeys":"unlimited","max_documents":"unlimited","max_professionals":10,"max_teams":3}', true, true, 4, NOW(), NOW())
    `);

    return res.json({ message: '4 plans seeded successfully', seeded: true });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
