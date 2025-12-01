const express = require('express');
const router = express.Router();
const adminJourneyQuestionsController = require('../controllers/adminJourneyQuestionsController');
const { verifyToken, isAdminOrOwner } = require('../middlewares/auth');
const { body } = require('express-validator');
const multer = require('multer');

// Configuração do multer para upload de CSV
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos CSV são permitidos'), false);
    }
  }
});

// Middleware de autenticação e autorização (apenas admin/owner)
router.use(verifyToken);
router.use(isAdminOrOwner);

/**
 * @swagger
 * /api/admin/journey-questions:
 *   get:
 *     summary: Listar perguntas da jornada com filtros
 *     tags: [Admin - Journey Questions]
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
 *                     $ref: '#/components/schemas/JourneyBotQuestion'
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
 * /api/admin/journey-questions/statistics:
 *   get:
 *     summary: Obter estatísticas das perguntas
 *     tags: [Admin - Journey Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas das perguntas
 */
router.get('/statistics', adminJourneyQuestionsController.getStatistics);

/**
 * @swagger
 * /api/admin/journey-questions/export:
 *   get:
 *     summary: Exportar perguntas para CSV
 *     tags: [Admin - Journey Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Arquivo CSV das perguntas
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/export', adminJourneyQuestionsController.exportToCSV);

/**
 * @swagger
 * /api/admin/journey-questions/{id}:
 *   get:
 *     summary: Obter pergunta por ID
 *     tags: [Admin - Journey Questions]
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

/**
 * @swagger
 * /api/admin/journey-questions:
 *   post:
 *     summary: Criar nova pergunta
 *     tags: [Admin - Journey Questions]
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
 *               - min_age_months
 *               - max_age_months
 *               - category
 *             properties:
 *               question_text:
 *                 type: string
 *               question_type:
 *                 type: string
 *                 default: multiple_choice
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                     label:
 *                       type: string
 *               min_age_months:
 *                 type: integer
 *               max_age_months:
 *                 type: integer
 *               category:
 *                 type: string
 *               order_index:
 *                 type: integer
 *                 default: 0
 *               is_active:
 *                 type: boolean
 *                 default: true
 *               feedback_positive:
 *                 type: string
 *               feedback_negative:
 *                 type: string
 *               feedback_neutral:
 *                 type: string
 *               tips:
 *                 type: object
 *     responses:
 *       201:
 *         description: Pergunta criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', [
  body('question_text').notEmpty().withMessage('Texto da pergunta é obrigatório'),
  body('min_age_months').isInt({ min: 0 }).withMessage('Idade mínima deve ser um número inteiro positivo'),
  body('max_age_months').isInt({ min: 0 }).withMessage('Idade máxima deve ser um número inteiro positivo'),
  body('category').notEmpty().withMessage('Categoria é obrigatória'),
  body('order_index').optional().isInt({ min: 0 }).withMessage('Índice de ordem deve ser um número inteiro positivo')
], adminJourneyQuestionsController.createQuestion);

/**
 * @swagger
 * /api/admin/journey-questions/{id}:
 *   put:
 *     summary: Atualizar pergunta
 *     tags: [Admin - Journey Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pergunta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JourneyBotQuestion'
 *     responses:
 *       200:
 *         description: Pergunta atualizada com sucesso
 *       404:
 *         description: Pergunta não encontrada
 */
router.put('/:id', [
  body('question_text').optional().notEmpty().withMessage('Texto da pergunta não pode estar vazio'),
  body('min_age_months').optional().isInt({ min: 0 }).withMessage('Idade mínima deve ser um número inteiro positivo'),
  body('max_age_months').optional().isInt({ min: 0 }).withMessage('Idade máxima deve ser um número inteiro positivo'),
  body('category').optional().notEmpty().withMessage('Categoria não pode estar vazia')
], adminJourneyQuestionsController.updateQuestion);

/**
 * @swagger
 * /api/admin/journey-questions/{id}:
 *   delete:
 *     summary: Excluir pergunta
 *     tags: [Admin - Journey Questions]
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
 *         description: Pergunta excluída com sucesso
 *       404:
 *         description: Pergunta não encontrada
 */
router.delete('/:id', adminJourneyQuestionsController.deleteQuestion);

/**
 * @swagger
 * /api/admin/journey-questions/import:
 *   post:
 *     summary: Importar perguntas via CSV
 *     tags: [Admin - Journey Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo CSV com perguntas
 *     responses:
 *       200:
 *         description: Perguntas importadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 imported:
 *                   type: integer
 *                 errors:
 *                   type: integer
 *                 errorDetails:
 *                   type: array
 *       400:
 *         description: Arquivo CSV inválido
 */
router.post('/import', upload.single('file'), adminJourneyQuestionsController.importFromCSV);

module.exports = router;
