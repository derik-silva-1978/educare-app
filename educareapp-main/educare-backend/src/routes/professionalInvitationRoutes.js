const express = require('express');
const router = express.Router();
const professionalInvitationController = require('../controllers/professionalInvitationController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /api/professional/invitations/{inviteId}/accept:
 *   post:
 *     summary: Aceitar convite para acompanhar uma criança
 *     tags: [Professional Invitations]
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: Convite não encontrado
 *       401:
 *         description: Não autorizado
 */
router.post('/:inviteId/accept', auth, professionalInvitationController.acceptInvitation);

/**
 * @swagger
 * /api/professional/invitations/{inviteId}/reject:
 *   post:
 *     summary: Recusar convite para acompanhar uma criança
 *     tags: [Professional Invitations]
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
 *                 data:
 *                   type: object
 *       404:
 *         description: Convite não encontrado
 *       401:
 *         description: Não autorizado
 */
router.post('/:inviteId/reject', auth, professionalInvitationController.rejectInvitation);

/**
 * @swagger
 * /api/professional/invitations:
 *   get:
 *     summary: Listar convites pendentes do profissional
 *     tags: [Professional Invitations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de convites pendentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       childId:
 *                         type: string
 *                       childName:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Não autorizado
 */
router.get('/', auth, professionalInvitationController.getPendingInvitations);

module.exports = router;
