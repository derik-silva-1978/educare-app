const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

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
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440000
 *         email: usuario@exemplo.com
 *         name: Nome do Usuário
 *         role: user
 *         status: active
 *         email_verified: true
 *         last_login: 2025-07-15T12:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para autenticação e gerenciamento de usuários
 */


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, professional, admin]
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já cadastrado
 */
// Rota para registro de usuário
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('phone').notEmpty().withMessage('Número de telefone é obrigatório').isMobilePhone().withMessage('Telefone inválido'),
    // Senha é opcional para profissionais criados pelo admin
    body('password').optional().isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('role').optional().isIn(['user', 'parent', 'professional', 'admin', 'owner']).withMessage('Papel inválido')
  ],
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Usuário não encontrado
 */
// Rota para login
router.post(
  '/login',
  [
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('phone').optional().isMobilePhone().withMessage('Telefone inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
    // Validação customizada para garantir que pelo menos email ou telefone seja fornecido
    body().custom((value, { req }) => {
      if (!req.body.email && !req.body.phone) {
        throw new Error('É necessário fornecer email ou telefone');
      }
      return true;
    })
  ],
  authController.login
);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verifica se o token JWT é válido
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou expirado
 */
// Rota para verificar token
router.get('/verify', authMiddleware.verifyToken, authController.verifyToken);

// Rota para aprovar acesso de usuário (via link no WhatsApp)
router.get('/approve-user/:token', authController.approveUser);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicita redefinição de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email de redefinição enviado
 *       404:
 *         description: Usuário não encontrado
 */
// Rota para solicitar redefinição de senha (email)
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Email inválido')
  ],
  authController.forgotPassword
);

/**
 * @swagger
 * /api/auth/forgot-password-by-phone:
 *   post:
 *     summary: Solicita redefinição de senha via WhatsApp
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Número de telefone/WhatsApp
 *     responses:
 *       200:
 *         description: Instruções de redefinição enviadas via WhatsApp
 */
// Rota para solicitar redefinição de senha via WhatsApp
router.post(
  '/forgot-password-by-phone',
  [
    body('phone').notEmpty().withMessage('Número de telefone é obrigatório')
  ],
  authController.forgotPasswordByPhone
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefine a senha do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
// Rota para redefinir senha
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token é obrigatório'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
  ],
  authController.resetPassword
);

// Rota para atualizar senha (usuário logado)
router.post(
  '/update-password',
  authMiddleware.verifyToken,
  [
    body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
    body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres')
  ],
  authController.updatePassword
);

// Rota para logout (opcional, depende da implementação do frontend)
router.post('/logout', authMiddleware.verifyToken, authController.logout);

/**
 * @swagger
 * /api/auth/send-phone-verification:
 *   post:
 *     summary: Envia código de verificação para telefone/WhatsApp
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Número de telefone/WhatsApp
 *     responses:
 *       200:
 *         description: Código de verificação enviado com sucesso
 *       400:
 *         description: Número de telefone inválido ou não fornecido
 *       500:
 *         description: Erro ao enviar código de verificação
 */
// Rota para enviar código de verificação para telefone
router.post(
  '/send-phone-verification',
  [
    body('phone').notEmpty().withMessage('Número de telefone é obrigatório')
  ],
  authController.sendPhoneVerification
);

/**
 * @swagger
 * /api/auth/verify-phone-code:
 *   post:
 *     summary: Verifica código enviado para telefone/WhatsApp
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - code
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Número de telefone/WhatsApp
 *               code:
 *                 type: string
 *                 description: Código de verificação de 6 dígitos
 *     responses:
 *       200:
 *         description: Telefone verificado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Código inválido ou expirado
 *       404:
 *         description: Usuário não encontrado
 */
// Rota para verificar código de telefone
router.post(
  '/verify-phone-code',
  [
    body('phone').notEmpty().withMessage('Número de telefone é obrigatório'),
    body('code').notEmpty().withMessage('Código de verificação é obrigatório')
  ],
  authController.verifyPhoneCode
);

/**
 * @swagger
 * /api/auth/login-by-phone:
 *   post:
 *     summary: Inicia o processo de login por telefone enviando uma senha temporária
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Número de telefone/WhatsApp
 *     responses:
 *       200:
 *         description: Senha temporária enviada com sucesso
 *       400:
 *         description: Número de telefone inválido ou não fornecido
 *       404:
 *         description: Usuário não encontrado com este telefone
 *       500:
 *         description: Erro ao enviar senha temporária
 */
// Rota para login por telefone com senha temporária
router.post(
  '/login-by-phone',
  [
    body('phone').notEmpty().withMessage('Número de telefone é obrigatório')
  ],
  authController.loginByPhone
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Renova o token JWT usando refresh token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token válido
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Refresh token inválido ou expirado
 */
router.post(
  '/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token é obrigatório')
  ],
  authController.refreshToken
);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Autentica usuário via Google OAuth
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *                 description: ID Token do Google
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *       401:
 *         description: Token inválido
 */
router.post(
  '/google',
  [
    body('credential').notEmpty().withMessage('Token do Google é obrigatório')
  ],
  authController.googleLogin
);

module.exports = router;
