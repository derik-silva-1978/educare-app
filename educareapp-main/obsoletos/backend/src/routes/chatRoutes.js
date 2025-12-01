const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatGroup:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         team_id:
 *           type: string
 *           format: uuid
 *         child_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         invite_code:
 *           type: string
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     
 *     ChatMessage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         chat_group_id:
 *           type: string
 *           format: uuid
 *         sender_id:
 *           type: string
 *           format: uuid
 *         sender_name:
 *           type: string
 *         sender_role:
 *           type: string
 *           enum: [parent, professional, ai_assistant]
 *         message_content:
 *           type: string
 *         message_type:
 *           type: string
 *           enum: [text, file, image, ai_summary, system]
 *         file_url:
 *           type: string
 *         reply_to_id:
 *           type: string
 *           format: uuid
 *         is_edited:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [sent, delivered, read, failed]
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/chat/groups:
 *   post:
 *     summary: Criar grupo de chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_id
 *               - name
 *             properties:
 *               team_id:
 *                 type: string
 *                 format: uuid
 *               child_id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ChatGroup'
 */
router.post('/groups', auth, chatController.createChatGroup);

/**
 * @swagger
 * /api/chat/groups:
 *   get:
 *     summary: Listar grupos de chat do usuário
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos de chat
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
 *                     $ref: '#/components/schemas/ChatGroup'
 */
router.get('/groups', auth, chatController.getChatGroups);

/**
 * @swagger
 * /api/chat/groups/{id}:
 *   get:
 *     summary: Buscar grupo de chat por ID
 *     tags: [Chat]
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
 *         description: Dados do grupo de chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ChatGroup'
 */
router.get('/groups/:id', auth, chatController.getChatGroupById);

/**
 * @swagger
 * /api/chat/groups/{groupId}/messages:
 *   get:
 *     summary: Buscar mensagens do grupo
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Lista de mensagens
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
 *                     messages:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ChatMessage'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/groups/:groupId/messages', auth, chatController.getChatMessages);

/**
 * @swagger
 * /api/chat/groups/{groupId}/messages:
 *   post:
 *     summary: Enviar mensagem
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
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
 *               - message_content
 *             properties:
 *               message_content:
 *                 type: string
 *               message_type:
 *                 type: string
 *                 enum: [text, file, image, ai_summary, system]
 *                 default: text
 *               reply_to_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ChatMessage'
 */
router.post('/groups/:groupId/messages', auth, chatController.sendMessage);

/**
 * @swagger
 * /api/chat/groups/{groupId}/participants:
 *   get:
 *     summary: Buscar participantes do grupo
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de participantes
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
 */
router.get('/groups/:groupId/participants', auth, chatController.getChatParticipants);

module.exports = router;
