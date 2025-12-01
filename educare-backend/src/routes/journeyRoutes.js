const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const journeyController = require('../controllers/journeyController');
const authMiddleware = require('../middlewares/auth');
const subscriptionMiddleware = require('../middlewares/subscription');

/**
 * @swagger
 * components:
 *   schemas:
 *     Journey:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da jornada
 *         name:
 *           type: string
 *           description: Nome da jornada
 *         description:
 *           type: string
 *           description: Descrição da jornada
 *         type:
 *           type: string
 *           enum: [development, educational, therapeutic]
 *           description: Tipo da jornada
 *         category:
 *           type: string
 *           description: Categoria da jornada
 *         age_range_min:
 *           type: integer
 *           description: Idade mínima recomendada (em meses)
 *         age_range_max:
 *           type: integer
 *           description: Idade máxima recomendada (em meses)
 *         steps:
 *           type: array
 *           description: Etapas da jornada
 *         duration:
 *           type: integer
 *           description: Duração estimada (em dias)
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Nível de dificuldade
 *         is_active:
 *           type: boolean
 *           description: Indica se a jornada está ativa
 *         is_public:
 *           type: boolean
 *           description: Indica se a jornada é pública
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
 *   name: Jornadas
 *   description: Gerenciamento de jornadas de desenvolvimento
 */



// Middleware para verificar se o usuário está autenticado
const isAuthenticated = authMiddleware.verifyToken;

// Middleware para verificar se o usuário é admin, owner ou professional
const isAdminOwnerOrProfessional = [
  authMiddleware.verifyToken,
  authMiddleware.isAdminOwnerOrProfessional
];

// Middleware para verificar se o usuário tem assinatura ativa
const hasActiveSubscription = subscriptionMiddleware.hasActiveSubscription;

// Rota para listar jornadas disponíveis
router.get('/', isAuthenticated, journeyController.listJourneys);

// Rota para obter uma jornada pelo ID
router.get('/:id', isAuthenticated, journeyController.getJourneyById);

// Rota para criar uma nova jornada (admin/owner/professional)
router.post(
  '/',
  [
    ...isAdminOwnerOrProfessional,
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('description').notEmpty().withMessage('Descrição é obrigatória'),
    body('type').notEmpty().withMessage('Tipo é obrigatório'),
    body('category').optional(),
    body('ageRangeMin').optional().isInt().withMessage('Idade mínima deve ser um número inteiro'),
    body('ageRangeMax').optional().isInt().withMessage('Idade máxima deve ser um número inteiro'),
    body('iconUrl').optional().isURL().withMessage('URL do ícone inválida'),
    body('coverImageUrl').optional().isURL().withMessage('URL da imagem de capa inválida'),
    body('steps').isArray().withMessage('Etapas devem ser um array'),
    body('duration').optional().isInt().withMessage('Duração deve ser um número inteiro'),
    body('difficulty').optional(),
    body('isPublic').optional().isBoolean().withMessage('isPublic deve ser um booleano')
  ],
  journeyController.createJourney
);

// Rota para atualizar uma jornada
router.put(
  '/:id',
  [
    ...isAdminOwnerOrProfessional,
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('description').optional().notEmpty().withMessage('Descrição não pode ser vazia'),
    body('type').optional().notEmpty().withMessage('Tipo não pode ser vazio'),
    body('category').optional(),
    body('ageRangeMin').optional().isInt().withMessage('Idade mínima deve ser um número inteiro'),
    body('ageRangeMax').optional().isInt().withMessage('Idade máxima deve ser um número inteiro'),
    body('iconUrl').optional().isURL().withMessage('URL do ícone inválida'),
    body('coverImageUrl').optional().isURL().withMessage('URL da imagem de capa inválida'),
    body('steps').optional().isArray().withMessage('Etapas devem ser um array'),
    body('duration').optional().isInt().withMessage('Duração deve ser um número inteiro'),
    body('difficulty').optional(),
    body('isActive').optional().isBoolean().withMessage('isActive deve ser um booleano'),
    body('isPublic').optional().isBoolean().withMessage('isPublic deve ser um booleano')
  ],
  journeyController.updateJourney
);

// Rota para excluir uma jornada
router.delete('/:id', isAdminOwnerOrProfessional, journeyController.deleteJourney);

// Rota para iniciar uma jornada para uma criança (requer assinatura ativa)
router.post(
  '/start',
  [
    isAuthenticated,
    hasActiveSubscription,
    body('journeyId').isInt().withMessage('ID da jornada inválido'),
    body('childId').isInt().withMessage('ID da criança inválido')
  ],
  journeyController.startJourney
);

// Rota para atualizar progresso em uma jornada
router.put(
  '/progress/:id',
  [
    isAuthenticated,
    body('currentStep').optional().isInt().withMessage('Etapa atual deve ser um número inteiro'),
    body('progress').optional().isInt().withMessage('Progresso deve ser um número inteiro'),
    body('status').optional().isIn(['not_started', 'in_progress', 'completed', 'abandoned']).withMessage('Status inválido'),
    body('notes').optional()
  ],
  journeyController.updateJourneyProgress
);

// Rota para listar jornadas de uma criança
router.get('/child/:childId', isAuthenticated, journeyController.listChildJourneys);

module.exports = router;
