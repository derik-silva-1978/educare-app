const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { verifyToken } = require('../middlewares/auth');
const { body, param, query } = require('express-validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         ownerId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum: [professional, educational, family, other]
 *         logoUrl:
 *           type: string
 *         isActive:
 *           type: boolean
 *         memberCount:
 *           type: integer
 *         activeMemberCount:
 *           type: integer
 *         pendingInvites:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TeamMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         teamId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           enum: [admin, member, viewer, professional]
 *         status:
 *           type: string
 *           enum: [invited, active, inactive, removed]
 *         invitedAt:
 *           type: string
 *           format: date-time
 *         joinedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/teams/my:
 *   get:
 *     summary: Listar equipes do usuário atual
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipes onde o usuário é membro ativo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     teams:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Team'
 *                     total:
 *                       type: integer
 */
router.get('/my', verifyToken, teamController.listMyTeams);

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Listar todas as equipes (apenas admin/owner)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas as equipes do sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     teams:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Team'
 *                     total:
 *                       type: integer
 */
router.get('/', verifyToken, teamController.listTeams);

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Criar nova equipe
 *     tags: [Teams]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [professional, educational, family, other]
 *               logoUrl:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       201:
 *         description: Equipe criada com sucesso
 */
router.post('/', 
  verifyToken,
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('type').optional().isIn(['professional', 'educational', 'family', 'other']),
    body('logoUrl').optional().isURL().withMessage('URL do logo inválida')
  ],
  teamController.createTeam
);

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Obter detalhes de uma equipe
 *     tags: [Teams]
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
 *         description: Detalhes da equipe
 *       404:
 *         description: Equipe não encontrada
 */
router.get('/:id', 
  verifyToken,
  [param('id').isUUID().withMessage('ID inválido')],
  teamController.getTeam
);

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Atualizar equipe
 *     tags: [Teams]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [professional, educational, family, other]
 *               logoUrl:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Equipe atualizada com sucesso
 */
router.put('/:id',
  verifyToken,
  [
    param('id').isUUID().withMessage('ID inválido'),
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('type').optional().isIn(['professional', 'educational', 'family', 'other']),
    body('logoUrl').optional().isURL().withMessage('URL do logo inválida'),
    body('isActive').optional().isBoolean()
  ],
  teamController.updateTeam
);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Deletar equipe
 *     tags: [Teams]
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
 *         description: Equipe removida com sucesso
 */
router.delete('/:id',
  verifyToken,
  [param('id').isUUID().withMessage('ID inválido')],
  teamController.deleteTeam
);

/**
 * @swagger
 * /api/teams/{teamId}/members:
 *   get:
 *     summary: Listar membros de uma equipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de membros da equipe
 */
router.get('/:teamId/members',
  verifyToken,
  [param('teamId').isUUID().withMessage('ID da equipe inválido')],
  teamController.listMembers
);

/**
 * @swagger
 * /api/teams/{teamId}/invite:
 *   post:
 *     summary: Convidar membro para equipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
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
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *                 enum: [admin, member, viewer, professional]
 *               permissions:
 *                 type: object
 *     responses:
 *       201:
 *         description: Convite enviado com sucesso
 */
router.post('/:teamId/invite',
  verifyToken,
  [
    param('teamId').isUUID().withMessage('ID da equipe inválido'),
    body('userId').isUUID().withMessage('ID do usuário inválido'),
    body('role').optional().isIn(['admin', 'member', 'viewer', 'professional'])
  ],
  teamController.inviteMember
);

/**
 * @swagger
 * /api/teams/{teamId}/members/{memberId}:
 *   put:
 *     summary: Atualizar membro da equipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: memberId
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
 *               role:
 *                 type: string
 *                 enum: [admin, member, viewer, professional]
 *               status:
 *                 type: string
 *                 enum: [invited, active, inactive, removed]
 *               permissions:
 *                 type: object
 *     responses:
 *       200:
 *         description: Membro atualizado com sucesso
 */
router.put('/:teamId/members/:memberId',
  verifyToken,
  [
    param('teamId').isUUID().withMessage('ID da equipe inválido'),
    param('memberId').isUUID().withMessage('ID do membro inválido'),
    body('role').optional().isIn(['admin', 'member', 'viewer', 'professional']),
    body('status').optional().isIn(['invited', 'active', 'inactive', 'removed'])
  ],
  teamController.updateMember
);

/**
 * @swagger
 * /api/teams/{teamId}/members/{memberId}:
 *   delete:
 *     summary: Remover membro da equipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Membro removido com sucesso
 */
router.delete('/:teamId/members/:memberId',
  verifyToken,
  [
    param('teamId').isUUID().withMessage('ID da equipe inválido'),
    param('memberId').isUUID().withMessage('ID do membro inválido')
  ],
  teamController.removeMember
);

/**
 * @swagger
 * /api/teams/{teamId}/search-users:
 *   get:
 *     summary: Buscar usuários para convite
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [professional, user, all]
 *     responses:
 *       200:
 *         description: Lista de usuários disponíveis para convite
 */
router.get('/:teamId/search-users',
  verifyToken,
  [
    param('teamId').isUUID().withMessage('ID da equipe inválido'),
    query('role').optional().isIn(['professional', 'user', 'all'])
  ],
  teamController.searchUsersForInvite
);

module.exports = router;
