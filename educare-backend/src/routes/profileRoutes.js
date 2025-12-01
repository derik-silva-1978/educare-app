const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do perfil
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID do usuário associado
 *         name:
 *           type: string
 *           description: Nome do perfil
 *         type:
 *           type: string
 *           enum: [personal, professional, parent]
 *           description: Tipo do perfil
 *         phone:
 *           type: string
 *           description: Número de telefone
 *         address:
 *           type: string
 *           description: Endereço
 *         city:
 *           type: string
 *           description: Cidade
 *         state:
 *           type: string
 *           description: Estado
 *         country:
 *           type: string
 *           description: País
 *         zip_code:
 *           type: string
 *           description: CEP
 *         bio:
 *           type: string
 *           description: Biografia ou descrição
 *         professional_id:
 *           type: string
 *           description: ID profissional (CRM, CRP, etc)
 *         professional_specialty:
 *           type: string
 *           description: Especialidade profissional
 *         is_primary:
 *           type: boolean
 *           description: Indica se é o perfil principal do usuário
 *         is_verified:
 *           type: boolean
 *           description: Indica se o perfil foi verificado
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
 *   name: Perfis
 *   description: Gerenciamento de perfis de usuário
 */



// Middleware para verificar se o usuário está autenticado
const isAuthenticated = authMiddleware.verifyToken;

// Middleware para verificar se o usuário é admin ou owner
const isAdminOrOwner = [
  authMiddleware.verifyToken,
  authMiddleware.isAdminOrOwner
];

// Rota para listar todos os perfis (apenas admin/owner)
router.get('/', isAdminOrOwner, profileController.listProfiles);

// Rota para obter o perfil do usuário logado
router.get('/me', isAuthenticated, profileController.getMyProfile);

// Rota para obter um perfil pelo ID (próprio usuário ou admin/owner)
router.get('/:id', isAuthenticated, profileController.getProfileById);

// Rota para atualizar o perfil do usuário logado
router.put(
  '/me',
  isAuthenticated,
  [
    body('firstName').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('lastName').optional().notEmpty().withMessage('Sobrenome não pode ser vazio'),
    body('phone').optional(),
    body('address').optional(),
    body('birthDate').optional().isDate().withMessage('Data de nascimento inválida'),
    body('gender').optional(),
    body('bio').optional(),
    body('avatarUrl').optional().isURL().withMessage('URL de avatar inválida'),
    body('preferences').optional().isObject().withMessage('Preferências devem ser um objeto')
  ],
  profileController.updateMyProfile
);

// Rota para atualizar um perfil pelo ID (apenas admin/owner)
router.put(
  '/:id',
  isAdminOrOwner,
  [
    body('firstName').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('lastName').optional().notEmpty().withMessage('Sobrenome não pode ser vazio'),
    body('phone').optional(),
    body('address').optional(),
    body('birthDate').optional().isDate().withMessage('Data de nascimento inválida'),
    body('gender').optional(),
    body('bio').optional(),
    body('avatarUrl').optional().isURL().withMessage('URL de avatar inválida'),
    body('preferences').optional().isObject().withMessage('Preferências devem ser um objeto'),
    body('isVerified').optional().isBoolean().withMessage('isVerified deve ser um booleano')
  ],
  profileController.updateProfileById
);

// Rota para verificar um perfil (apenas admin/owner)
router.patch(
  '/:id/verify',
  isAdminOrOwner,
  [
    body('isVerified').isBoolean().withMessage('isVerified deve ser um booleano')
  ],
  profileController.verifyProfile
);

// Rota para atualizar preferências do perfil
router.patch(
  '/me/preferences',
  isAuthenticated,
  [
    body('preferences').isObject().withMessage('Preferências devem ser um objeto')
  ],
  profileController.updatePreferences
);

module.exports = router;
