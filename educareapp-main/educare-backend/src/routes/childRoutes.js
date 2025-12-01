const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const childController = require('../controllers/childController');
const authMiddleware = require('../middlewares/auth');
const subscriptionMiddleware = require('../middlewares/subscription');

/**
 * @swagger
 * components:
 *   schemas:
 *     Child:
 *       type: object
 *       required:
 *         - name
 *         - birthdate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da criança
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID do usuário responsável
 *         name:
 *           type: string
 *           description: Nome da criança
 *         birthdate:
 *           type: string
 *           format: date
 *           description: Data de nascimento
 *         gender:
 *           type: string
 *           enum: [male, female, other, not_specified]
 *           description: Gênero da criança
 *         photo_url:
 *           type: string
 *           description: URL da foto
 *         notes:
 *           type: string
 *           description: Observações gerais
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *           description: Documentos associados
 *         development_notes:
 *           type: array
 *           items:
 *             type: object
 *           description: Notas de desenvolvimento
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
 *   name: Crianças
 *   description: Gerenciamento de perfis de crianças
 */



// Middleware para verificar se o usuário está autenticado
const isAuthenticated = authMiddleware.verifyToken;

// Middleware para verificar se o usuário é admin ou owner
const isAdminOrOwner = [
  authMiddleware.verifyToken,
  authMiddleware.isAdminOrOwner
];

// Middleware para verificar limite de crianças no plano
const checkChildLimit = subscriptionMiddleware.checkChildrenLimit;

// Rota para listar todas as crianças do usuário logado
router.get('/', isAuthenticated, childController.listMyChildren);

// Rota para obter uma criança pelo ID
router.get('/:id', isAuthenticated, childController.getChildById);

// Rota para criar uma nova criança (verificando limite do plano)
router.post(
  '/',
  [
    isAuthenticated,
    checkChildLimit,
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('birthDate').isDate().withMessage('Data de nascimento inválida'),
    body('gender').optional(),
    body('profileId').optional().isInt().withMessage('ID de perfil inválido')
  ],
  childController.createChild
);

// Rota para atualizar uma criança
router.put(
  '/:id',
  [
    isAuthenticated,
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('birthDate').optional().isDate().withMessage('Data de nascimento inválida'),
    body('gender').optional(),
    body('avatarUrl').optional(),
    body('notes').optional(),
    body('metadata').optional().isObject().withMessage('Metadata deve ser um objeto')
  ],
  childController.updateChild
);

// Rota para excluir uma criança
router.delete('/:id', isAuthenticated, childController.deleteChild);

// Rota para adicionar uma foto/documento da criança
router.post(
  '/:id/documents',
  [
    isAuthenticated,
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('type').notEmpty().withMessage('Tipo é obrigatório'),
    body('url').isURL().withMessage('URL inválida'),
    body('description').optional()
  ],
  childController.addChildDocument
);

// Rota para remover uma foto/documento da criança
router.delete(
  '/:id/documents/:documentId',
  isAuthenticated,
  childController.removeChildDocument
);

// Rota para adicionar uma nota de desenvolvimento
router.post(
  '/:id/development-notes',
  [
    isAuthenticated,
    body('note').notEmpty().withMessage('Nota é obrigatória'),
    body('category').optional(),
    body('milestone').optional(),
    body('date').optional().isDate().withMessage('Data inválida')
  ],
  childController.addDevelopmentNote
);

// Rota para listar notas de desenvolvimento
router.get('/:id/development-notes', isAuthenticated, childController.listDevelopmentNotes);

// Rota para atualizar uma nota de desenvolvimento
router.put(
  '/:id/development-notes/:noteId',
  [
    isAuthenticated,
    body('note').optional().notEmpty().withMessage('Nota não pode ser vazia'),
    body('category').optional(),
    body('milestone').optional(),
    body('date').optional().isDate().withMessage('Data inválida')
  ],
  childController.updateDevelopmentNote
);

// Rota para excluir uma nota de desenvolvimento
router.delete(
  '/:id/development-notes/:noteId',
  isAuthenticated,
  childController.deleteDevelopmentNote
);

module.exports = router;
