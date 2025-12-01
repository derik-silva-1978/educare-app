const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middlewares/auth');
const { body, param, query } = require('express-validator');
const { validate } = require('../middlewares/validation');

// Validações
const createActivityValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Título deve ter entre 3 e 255 caracteres'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
  
  body('ageMinMonths')
    .isInt({ min: 0, max: 72 })
    .withMessage('Idade mínima deve ser entre 0 e 72 meses'),
  
  body('ageMaxMonths')
    .isInt({ min: 0, max: 72 })
    .withMessage('Idade máxima deve ser entre 0 e 72 meses')
    .custom((value, { req }) => {
      if (value < req.body.ageMinMonths) {
        throw new Error('Idade máxima deve ser maior ou igual à idade mínima');
      }
      return true;
    }),
  
  body('category')
    .isIn(['motor_grosso', 'motor_fino', 'cognitivo', 'linguagem', 'social', 'sensorial'])
    .withMessage('Categoria inválida'),
  
  body('difficultyLevel')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Nível de dificuldade deve ser 1, 2 ou 3'),
  
  body('durationMinutes')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('Duração deve ser entre 1 e 120 minutos'),
  
  body('materialsNeeded')
    .optional()
    .isArray()
    .withMessage('Materiais necessários deve ser um array'),
  
  body('instructions')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Instruções devem ter entre 10 e 5000 caracteres'),
  
  body('benefits')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Benefícios deve ter no máximo 2000 caracteres'),
  
  body('safetyTips')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Dicas de segurança deve ter no máximo 2000 caracteres'),
  
  body('variations')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Variações deve ter no máximo 2000 caracteres'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('URL da imagem inválida'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive deve ser um boolean')
];

const updateActivityValidation = [
  param('id')
    .isUUID()
    .withMessage('ID inválido'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Título deve ter entre 3 e 255 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
  
  body('ageMinMonths')
    .optional()
    .isInt({ min: 0, max: 72 })
    .withMessage('Idade mínima deve ser entre 0 e 72 meses'),
  
  body('ageMaxMonths')
    .optional()
    .isInt({ min: 0, max: 72 })
    .withMessage('Idade máxima deve ser entre 0 e 72 meses'),
  
  body('category')
    .optional()
    .isIn(['motor_grosso', 'motor_fino', 'cognitivo', 'linguagem', 'social', 'sensorial'])
    .withMessage('Categoria inválida'),
  
  body('difficultyLevel')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Nível de dificuldade deve ser 1, 2 ou 3'),
  
  body('durationMinutes')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('Duração deve ser entre 1 e 120 minutos'),
  
  body('materialsNeeded')
    .optional()
    .isArray()
    .withMessage('Materiais necessários deve ser um array'),
  
  body('instructions')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Instruções devem ter entre 10 e 5000 caracteres'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('URL da imagem inválida'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive deve ser um boolean')
];

const listActivitiesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número maior que 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit deve ser entre 1 e 100'),
  
  query('age_months')
    .optional()
    .isInt({ min: 0, max: 72 })
    .withMessage('Idade deve ser entre 0 e 72 meses'),
  
  query('category')
    .optional()
    .isIn(['motor_grosso', 'motor_fino', 'cognitivo', 'linguagem', 'social', 'sensorial'])
    .withMessage('Categoria inválida'),
  
  query('difficulty_level')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Nível de dificuldade deve ser 1, 2 ou 3'),
  
  query('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active deve ser um boolean')
];

// Rotas públicas (para o TitiNauta)
/**
 * @swagger
 * /api/activities/by-age:
 *   get:
 *     summary: Buscar atividades por faixa etária
 *     description: Retorna atividades adequadas para a idade especificada (usado pelo TitiNauta)
 *     tags: [Activities]
 *     parameters:
 *       - in: query
 *         name: age_months
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 72
 *         description: Idade da criança em meses
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [motor_grosso, motor_fino, cognitivo, linguagem, social, sensorial]
 *         description: Categoria de desenvolvimento
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           default: 3
 *         description: Número máximo de atividades a retornar
 *     responses:
 *       200:
 *         description: Lista de atividades encontradas
 *       400:
 *         description: Parâmetros inválidos
 */
router.get('/by-age', [
  query('age_months')
    .isInt({ min: 0, max: 72 })
    .withMessage('age_months deve ser entre 0 e 72'),
  query('category')
    .optional()
    .isIn(['motor_grosso', 'motor_fino', 'cognitivo', 'linguagem', 'social', 'sensorial'])
    .withMessage('Categoria inválida'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Limit deve ser entre 1 e 10'),
  validate
], activityController.getActivitiesByAge);

/**
 * @swagger
 * /api/activities/categories:
 *   get:
 *     summary: Listar categorias disponíveis
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/categories', activityController.getCategories);

/**
 * @swagger
 * /api/activities/difficulty-levels:
 *   get:
 *     summary: Listar níveis de dificuldade
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: Lista de níveis de dificuldade
 */
router.get('/difficulty-levels', activityController.getDifficultyLevels);

// Rotas protegidas (admin)
/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Listar todas as atividades (admin)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por título, descrição ou instruções
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [motor_grosso, motor_fino, cognitivo, linguagem, social, sensorial]
 *       - in: query
 *         name: difficulty_level
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: Lista paginada de atividades
 *       401:
 *         description: Não autorizado
 */
router.get('/', auth, listActivitiesValidation, validate, activityController.listActivities);

/**
 * @swagger
 * /api/activities/stats:
 *   get:
 *     summary: Estatísticas das atividades
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas das atividades
 */
router.get('/stats', auth, activityController.getActivityStats);

/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     summary: Buscar atividade por ID
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Atividade encontrada
 *       404:
 *         description: Atividade não encontrada
 */
router.get('/:id', auth, [
  param('id').isUUID().withMessage('ID inválido'),
  validate
], activityController.getActivityById);

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Criar nova atividade
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - ageMinMonths
 *               - ageMaxMonths
 *               - category
 *               - instructions
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *               ageMinMonths:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 72
 *               ageMaxMonths:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 72
 *               category:
 *                 type: string
 *                 enum: [motor_grosso, motor_fino, cognitivo, linguagem, social, sensorial]
 *               difficultyLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *                 default: 1
 *               durationMinutes:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *               materialsNeeded:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *               benefits:
 *                 type: string
 *                 maxLength: 2000
 *               safetyTips:
 *                 type: string
 *                 maxLength: 2000
 *               variations:
 *                 type: string
 *                 maxLength: 2000
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Atividade criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', auth, createActivityValidation, validate, activityController.createActivity);

/**
 * @swagger
 * /api/activities/{id}:
 *   put:
 *     summary: Atualizar atividade
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *               ageMinMonths:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 72
 *               ageMaxMonths:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 72
 *               category:
 *                 type: string
 *                 enum: [motor_grosso, motor_fino, cognitivo, linguagem, social, sensorial]
 *               difficultyLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *               durationMinutes:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *               materialsNeeded:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *               benefits:
 *                 type: string
 *                 maxLength: 2000
 *               safetyTips:
 *                 type: string
 *                 maxLength: 2000
 *               variations:
 *                 type: string
 *                 maxLength: 2000
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Atividade atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Atividade não encontrada
 */
router.put('/:id', auth, updateActivityValidation, validate, activityController.updateActivity);

/**
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     summary: Desativar atividade
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Atividade desativada com sucesso
 *       404:
 *         description: Atividade não encontrada
 */
router.delete('/:id', auth, [
  param('id').isUUID().withMessage('ID inválido'),
  validate
], activityController.deleteActivity);

module.exports = router;
