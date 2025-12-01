const express = require('express');
const router = express.Router();
const teamInviteController = require('../controllers/teamInviteController');
const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Team Invites
 *   description: Gerenciamento de convites de equipes baseado em team_members
 */

/**
 * @swagger
 * /api/team-invites/received:
 *   get:
 *     summary: Listar convites de equipe recebidos
 *     tags: [Team Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limite de itens por página
 *     responses:
 *       200:
 *         description: Lista de convites de equipe recebidos
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
 *                     invites:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           team_id:
 *                             type: string
 *                           team_name:
 *                             type: string
 *                           team_description:
 *                             type: string
 *                           team_type:
 *                             type: string
 *                           invited_by_name:
 *                             type: string
 *                           role:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [invited, active]
 *                           invited_at:
 *                             type: string
 *                           joined_at:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                           updated_at:
 *                             type: string
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/received', verifyToken, teamInviteController.getReceivedTeamInvites);

/**
 * @swagger
 * /api/team-invites/{inviteId}/accept:
 *   post:
 *     summary: Aceitar convite de equipe
 *     tags: [Team Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do convite (team_member.id)
 *     responses:
 *       200:
 *         description: Convite aceito com sucesso
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
 *                     id:
 *                       type: string
 *                     team_id:
 *                       type: string
 *                     team_name:
 *                       type: string
 *                     status:
 *                       type: string
 *                     message:
 *                       type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Convite não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:inviteId/accept', verifyToken, teamInviteController.acceptTeamInvite);

/**
 * @swagger
 * /api/team-invites/{inviteId}/decline:
 *   post:
 *     summary: Recusar convite de equipe
 *     tags: [Team Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do convite (team_member.id)
 *     responses:
 *       200:
 *         description: Convite recusado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Convite não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:inviteId/decline', verifyToken, teamInviteController.declineTeamInvite);

/**
 * @swagger
 * /api/team-invites/pending/count:
 *   get:
 *     summary: Contar convites de equipe pendentes
 *     tags: [Team Invites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Número de convites de equipe pendentes
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
 *                     count:
 *                       type: integer
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/pending/count', verifyToken, teamInviteController.getPendingTeamInvitesCount);

module.exports = router;
