const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const faqController = require('../controllers/faqController');
const { verifyToken, isAdminOrOwner } = require('../middlewares/auth');
const { faqFeedbackLimiter } = require('../middlewares/rateLimiter');

/**
 * @swagger
 * components:
 *   schemas:
 *     AppFaq:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da FAQ
 *         category:
 *           type: string
 *           enum: [child, mother, system]
 *           description: Categoria da FAQ
 *         question_text:
 *           type: string
 *           description: Texto da pergunta
 *         answer_rag_context:
 *           type: string
 *           description: Contexto para injetar no RAG
 *         min_week:
 *           type: integer
 *           description: Semana mínima de vigência
 *         max_week:
 *           type: integer
 *           description: Semana máxima de vigência
 *         is_seed:
 *           type: boolean
 *           description: Se foi inserida pelo sistema
 *         usage_count:
 *           type: integer
 *           description: Quantas vezes foi acessada
 *         upvotes:
 *           type: integer
 *           description: Número de upvotes
 *         downvotes:
 *           type: integer
 *           description: Número de downvotes
 */

/**
 * GET /api/faqs/suggestions?week=X
 * 
 * Retorna 5 FAQs mais relevantes para a semana da criança.
 * 
 * Algoritmo de ranqueamento:
 * score = (usage_count * 1.0) + (upvotes * 2.0) - (downvotes * 5.0)
 * 
 * @swagger
 * /api/faqs/suggestions:
 *   get:
 *     tags: [FAQ]
 *     summary: Obter sugestões de FAQs por semana da criança
 *     parameters:
 *       - in: query
 *         name: week
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 999
 *         required: true
 *         description: Semana atual da criança
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [child, mother, system]
 *         description: Filtro opcional por categoria
 *     responses:
 *       200:
 *         description: Top 5 FAQs por score de relevância
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
 *                     $ref: '#/components/schemas/AppFaq'
 *       400:
 *         description: Parâmetro week obrigatório ou inválido
 */
router.get('/suggestions',
  query('week')
    .isInt({ min: 0, max: 999 })
    .withMessage('week deve ser um inteiro entre 0 e 999'),
  query('category')
    .optional()
    .isIn(['child', 'mother', 'system'])
    .withMessage('category inválida'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  faqController.getSuggestionsByWeek
);

/**
 * GET /api/faqs
 * 
 * Lista todas as FAQs (paginado). Apenas para admin/owner.
 * 
 * @swagger
 * /api/faqs:
 *   get:
 *     tags: [FAQ]
 *     summary: Listar todas as FAQs (admin/owner)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de FAQs com paginação
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (admin/owner)
 */
router.get('/', verifyToken, isAdminOrOwner, faqController.listAll);

/**
 * POST /api/faqs
 * 
 * Criar nova FAQ. Apenas para admin/owner.
 * 
 * @swagger
 * /api/faqs:
 *   post:
 *     tags: [FAQ]
 *     summary: Criar nova FAQ
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_text
 *               - category
 *               - min_week
 *               - max_week
 *             properties:
 *               question_text:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [child, mother, system]
 *               answer_rag_context:
 *                 type: string
 *               min_week:
 *                 type: integer
 *               max_week:
 *                 type: integer
 *     responses:
 *       201:
 *         description: FAQ criada com sucesso
 *       400:
 *         description: Validação falhou
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.post('/',
  verifyToken,
  isAdminOrOwner,
  body('question_text')
    .trim()
    .notEmpty()
    .withMessage('question_text é obrigatório'),
  body('category')
    .isIn(['child', 'mother', 'system'])
    .withMessage('category deve ser: child, mother, ou system'),
  body('min_week')
    .isInt({ min: 0, max: 999 })
    .withMessage('min_week deve ser inteiro entre 0 e 999'),
  body('max_week')
    .isInt({ min: 0, max: 999 })
    .withMessage('max_week deve ser inteiro entre 0 e 999'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  faqController.create
);

/**
 * PUT /api/faqs/:id
 * 
 * Atualizar FAQ existente. Apenas para admin/owner.
 */
router.put('/:id',
  verifyToken,
  isAdminOrOwner,
  param('id').isUUID().withMessage('ID deve ser UUID válido'),
  body('question_text')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('question_text não pode ser vazio'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  faqController.update
);

/**
 * GET /api/faqs/analytics
 * 
 * Métricas agregadas de uso das FAQs. Apenas admin/owner.
 */
router.get('/analytics', verifyToken, isAdminOrOwner, faqController.getAnalytics);

/**
 * GET /api/faqs/search?q=termo
 * 
 * Busca full-text em FAQs. Público.
 */
router.get('/search',
  query('q')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Termo de busca deve ter pelo menos 2 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  faqController.search
);

/**
 * DELETE /api/faqs/:id
 * 
 * Soft delete FAQ. Apenas para admin/owner.
 */
router.delete('/:id',
  verifyToken,
  isAdminOrOwner,
  param('id').isUUID().withMessage('ID deve ser UUID válido'),
  faqController.delete
);

/**
 * PUT /api/faqs/:id/restore
 * 
 * Restaurar FAQ deletada. Apenas admin/owner.
 */
router.put('/:id/restore',
  verifyToken,
  isAdminOrOwner,
  param('id').isUUID().withMessage('ID deve ser UUID válido'),
  faqController.restore
);

/**
 * POST /api/faqs/:id/feedback
 * 
 * Registrar feedback do usuário (upvote/downvote).
 * Incrementa counters para algoritmo de ranqueamento.
 * 
 * @swagger
 * /api/faqs/{id}/feedback:
 *   post:
 *     tags: [FAQ]
 *     summary: Registrar feedback (upvote/downvote)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *     responses:
 *       200:
 *         description: Feedback registrado com sucesso
 *       404:
 *         description: FAQ não encontrada
 */
router.post('/:id/feedback',
  faqFeedbackLimiter, // Rate limit: 10 req/min por IP
  param('id').isUUID().withMessage('ID deve ser UUID válido'),
  body('type')
    .isIn(['upvote', 'downvote'])
    .withMessage('type deve ser: upvote ou downvote'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  faqController.recordFeedback
);

module.exports = router;
