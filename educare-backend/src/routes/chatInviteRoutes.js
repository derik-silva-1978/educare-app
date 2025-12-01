const express = require('express');
const router = express.Router();
const chatInviteController = require('../controllers/chatInviteController');
const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Chat Invites
 *   description: Gerenciamento de convites de chat/equipes
 */

/**
 * @swagger
 * /api/chat-invites/received:
 *   get:
 *     summary: Listar convites recebidos
 *     tags: [Chat Invites]
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
 *         description: Lista de convites recebidos
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
 *                           invited_by_name:
 *                             type: string
 *                           message:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [pending, accepted, declined]
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
router.get('/received', verifyToken, chatInviteController.getReceivedInvites);

/**
 * @swagger
 * /api/chat-invites/{inviteId}/accept:
 *   post:
 *     summary: Aceitar convite de chat/equipe
 *     tags: [Chat Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do convite
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
router.post('/:inviteId/accept', verifyToken, chatInviteController.acceptInvite);

/**
 * @swagger
 * /api/chat-invites/{inviteId}/decline:
 *   post:
 *     summary: Recusar convite de chat/equipe
 *     tags: [Chat Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do convite
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
router.post('/:inviteId/decline', verifyToken, chatInviteController.declineInvite);

/**
 * @swagger
 * /api/chat-invites/pending/count:
 *   get:
 *     summary: Contar convites pendentes
 *     tags: [Chat Invites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Número de convites pendentes
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
router.get('/pending/count', verifyToken, chatInviteController.getPendingInvitesCount);

module.exports = router;
