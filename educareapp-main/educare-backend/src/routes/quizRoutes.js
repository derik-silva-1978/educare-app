const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middlewares/auth');
const subscriptionMiddleware = require('../middlewares/subscription');

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do quiz
 *         title:
 *           type: string
 *           description: Título do quiz
 *         description:
 *           type: string
 *           description: Descrição do quiz
 *         type:
 *           type: string
 *           enum: [assessment, survey, educational, developmental]
 *           description: Tipo do quiz
 *         category:
 *           type: string
 *           description: Categoria do quiz
 *         age_range_min:
 *           type: integer
 *           description: Idade mínima recomendada (em meses)
 *         age_range_max:
 *           type: integer
 *           description: Idade máxima recomendada (em meses)
 *         estimated_time:
 *           type: integer
 *           description: Tempo estimado para conclusão (em minutos)
 *         is_active:
 *           type: boolean
 *           description: Indica se o quiz está ativo
 *         is_public:
 *           type: boolean
 *           description: Indica se o quiz é público
 *         created_by:
 *           type: string
 *           format: uuid
 *           description: ID do usuário que criou o quiz
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
 *   name: Quizzes
 *   description: Gerenciamento de quizzes e avaliações
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

// Rota para listar quizzes disponíveis
router.get('/', isAuthenticated, quizController.listQuizzes);

// Rota para obter um quiz pelo ID
router.get('/:id', isAuthenticated, quizController.getQuizById);

// Rota para criar um novo quiz (admin/owner/professional)
router.post(
  '/',
  [
    ...isAdminOwnerOrProfessional,
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('description').notEmpty().withMessage('Descrição é obrigatória'),
    body('type').notEmpty().withMessage('Tipo é obrigatório'),
    body('category').optional(),
    body('ageRangeMin').optional().isInt().withMessage('Idade mínima deve ser um número inteiro'),
    body('ageRangeMax').optional().isInt().withMessage('Idade máxima deve ser um número inteiro'),
    body('difficulty').optional(),
    body('estimatedTime').optional().isInt().withMessage('Tempo estimado deve ser um número inteiro'),
    body('instructions').optional(),
    body('isPublic').optional().isBoolean().withMessage('isPublic deve ser um booleano'),
    body('questionIds').optional().isArray().withMessage('IDs de perguntas deve ser um array'),
    body('passingScore').optional().isInt().withMessage('Pontuação mínima deve ser um número inteiro')
  ],
  quizController.createQuiz
);

// Rota para atualizar um quiz
router.put(
  '/:id',
  [
    ...isAdminOwnerOrProfessional,
    body('title').optional().notEmpty().withMessage('Título não pode ser vazio'),
    body('description').optional().notEmpty().withMessage('Descrição não pode ser vazia'),
    body('type').optional().notEmpty().withMessage('Tipo não pode ser vazio'),
    body('category').optional(),
    body('ageRangeMin').optional().isInt().withMessage('Idade mínima deve ser um número inteiro'),
    body('ageRangeMax').optional().isInt().withMessage('Idade máxima deve ser um número inteiro'),
    body('difficulty').optional(),
    body('estimatedTime').optional().isInt().withMessage('Tempo estimado deve ser um número inteiro'),
    body('instructions').optional(),
    body('isActive').optional().isBoolean().withMessage('isActive deve ser um booleano'),
    body('isPublic').optional().isBoolean().withMessage('isPublic deve ser um booleano'),
    body('questionIds').optional().isArray().withMessage('IDs de perguntas deve ser um array'),
    body('passingScore').optional().isInt().withMessage('Pontuação mínima deve ser um número inteiro')
  ],
  quizController.updateQuiz
);

// Rota para excluir um quiz
router.delete('/:id', isAdminOwnerOrProfessional, quizController.deleteQuiz);

// Rota para iniciar uma sessão de quiz (requer assinatura ativa)
router.post(
  '/sessions',
  [
    isAuthenticated,
    hasActiveSubscription,
    body('quizId').isInt().withMessage('ID do quiz inválido'),
    body('childId').isInt().withMessage('ID da criança inválido')
  ],
  quizController.startQuizSession
);

// Rota para submeter respostas de um quiz
router.post(
  '/sessions/:sessionId/submit',
  [
    isAuthenticated,
    body('answers').isArray().withMessage('Respostas devem ser um array'),
    body('timeSpent').optional().isInt().withMessage('Tempo gasto deve ser um número inteiro')
  ],
  quizController.submitQuizAnswers
);

module.exports = router;
