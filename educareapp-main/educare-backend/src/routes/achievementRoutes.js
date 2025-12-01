const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Achievement:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da conquista
 *         name:
 *           type: string
 *           description: Nome da conquista
 *         description:
 *           type: string
 *           description: Descrição da conquista
 *         type:
 *           type: string
 *           enum: [milestone, badge, reward]
 *           description: Tipo da conquista
 *         category:
 *           type: string
 *           description: Categoria da conquista
 *         icon_url:
 *           type: string
 *           description: URL do ícone da conquista
 *         points:
 *           type: integer
 *           description: Pontos atribuídos à conquista
 *         conditions:
 *           type: object
 *           description: Condições para obter a conquista
 *         is_active:
 *           type: boolean
 *           description: Indica se a conquista está ativa
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
 *   name: Conquistas
 *   description: Gerenciamento de conquistas e recompensas
 */



// Middleware para verificar se o usuário está autenticado
const isAuthenticated = authMiddleware.verifyToken;

// Middleware para verificar se o usuário é admin ou owner
const isAdminOrOwner = [
  authMiddleware.verifyToken,
  authMiddleware.isAdminOrOwner
];

// Rota para listar todas as conquistas disponíveis
router.get('/', isAuthenticated, achievementController.listAchievements);

// Rota para obter uma conquista pelo ID
router.get('/:id', isAuthenticated, achievementController.getAchievementById);

// Rota para criar uma nova conquista (apenas admin/owner)
router.post(
  '/',
  [
    ...isAdminOrOwner,
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('description').notEmpty().withMessage('Descrição é obrigatória'),
    body('type').notEmpty().withMessage('Tipo é obrigatório'),
    body('category').optional(),
    body('iconUrl').optional().isURL().withMessage('URL do ícone inválida'),
    body('points').isInt().withMessage('Pontos deve ser um número inteiro'),
    body('conditions').optional().isObject().withMessage('Condições deve ser um objeto'),
    body('isActive').optional().isBoolean().withMessage('isActive deve ser um booleano')
  ],
  achievementController.createAchievement
);

// Rota para atualizar uma conquista (apenas admin/owner)
router.put(
  '/:id',
  [
    ...isAdminOrOwner,
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('description').optional().notEmpty().withMessage('Descrição não pode ser vazia'),
    body('type').optional().notEmpty().withMessage('Tipo não pode ser vazio'),
    body('category').optional(),
    body('iconUrl').optional().isURL().withMessage('URL do ícone inválida'),
    body('points').optional().isInt().withMessage('Pontos deve ser um número inteiro'),
    body('conditions').optional().isObject().withMessage('Condições deve ser um objeto'),
    body('isActive').optional().isBoolean().withMessage('isActive deve ser um booleano')
  ],
  achievementController.updateAchievement
);

// Rota para excluir uma conquista (apenas admin/owner)
router.delete('/:id', isAdminOrOwner, achievementController.deleteAchievement);

// Rota para atribuir uma conquista a um usuário/criança
router.post(
  '/award',
  [
    isAuthenticated,
    body('achievementId').isInt().withMessage('ID da conquista inválido'),
    body('childId').optional().isInt().withMessage('ID da criança inválido'),
    body('progress').optional().isInt().withMessage('Progresso deve ser um número inteiro'),
    body('metadata').optional().isObject().withMessage('Metadata deve ser um objeto')
  ],
  achievementController.awardAchievement
);

// Rota para listar conquistas de uma criança
router.get('/child/:childId', isAuthenticated, achievementController.listChildAchievements);

// Rota para marcar uma conquista como visualizada
router.patch('/:id/viewed', isAuthenticated, achievementController.markAchievementAsViewed);

module.exports = router;
