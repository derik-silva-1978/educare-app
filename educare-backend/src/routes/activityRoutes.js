const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken, isAdminOrOwner } = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - min_age_months
 *         - max_age_months
 *         - category
 *         - difficulty_level
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da atividade
 *         title:
 *           type: string
 *           description: Título da atividade
 *         description:
 *           type: string
 *           description: Descrição detalhada da atividade
 *         min_age_months:
 *           type: integer
 *           minimum: 0
 *           maximum: 60
 *           description: Idade mínima em meses
 *         max_age_months:
 *           type: integer
 *           minimum: 1
 *           maximum: 60
 *           description: Idade máxima em meses
 *         category:
 *           type: string
 *           enum: [motor, cognitive, sensory, communication, social_emotional, nutrition, baby_health, maternal_health, maternal_self_care]
 *           description: Categoria da atividade
 *         difficulty_level:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Nível de dificuldade
 *         duration_minutes:
 *           type: integer
 *           minimum: 1
 *           maximum: 120
 *           description: Duração em minutos
 *         materials_needed:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de materiais necessários
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de instruções passo-a-passo
 *         benefits:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de benefícios da atividade
 *         safety_tips:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de dicas de segurança
 *         is_active:
 *           type: boolean
 *           description: Status da atividade (ativa/inativa)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *     CreateActivityRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - min_age_months
 *         - max_age_months
 *         - category
 *         - difficulty_level
 *       properties:
 *         title:
 *           type: string
 *           description: Título da atividade
 *         description:
 *           type: string
 *           description: Descrição detalhada da atividade
 *         min_age_months:
 *           type: integer
 *           minimum: 0
 *           maximum: 60
 *           description: Idade mínima em meses
 *         max_age_months:
 *           type: integer
 *           minimum: 1
 *           maximum: 60
 *           description: Idade máxima em meses
 *         category:
 *           type: string
 *           enum: [motor, cognitive, sensory, communication, social_emotional, nutrition, baby_health, maternal_health, maternal_self_care]
 *           description: Categoria da atividade
 *         difficulty_level:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Nível de dificuldade
 *         duration_minutes:
 *           type: integer
 *           minimum: 1
 *           maximum: 120
 *           description: Duração em minutos
 *         materials_needed:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de materiais necessários
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de instruções passo-a-passo
 *         benefits:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de benefícios da atividade
 *         safety_tips:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de dicas de segurança
 *         is_active:
 *           type: boolean
 *           default: true
 *           description: Status da atividade (ativa/inativa)
 */

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Listar atividades
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por título ou descrição
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [motor, cognitive, sensory, communication, social_emotional, nutrition, baby_health, maternal_health, maternal_self_care]
 *         description: Filtrar por categoria
 *       - in: query
 *         name: difficulty_level
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filtrar por nível de dificuldade
 *       - in: query
 *         name: min_age_months
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Idade mínima em meses
 *       - in: query
 *         name: max_age_months
 *         schema:
 *           type: integer
 *           maximum: 60
 *         description: Idade máxima em meses
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status (ativo/inativo)
 *     responses:
 *       200:
 *         description: Lista de atividades
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
 *                     activities:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Activity'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Token de acesso inválido
 *       500:
 *         description: Erro interno do servidor
 *   post:
 *     summary: Criar nova atividade
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivityRequest'
 *     responses:
 *       201:
 *         description: Atividade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Activity'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token de acesso inválido
 *       403:
 *         description: Acesso negado (apenas admin/owner)
 *       500:
 *         description: Erro interno do servidor
 */

// Listar atividades (todos os usuários autenticados)
router.get('/', verifyToken, activityController.getActivities);

// Criar atividade (apenas admin/owner)
router.post('/', verifyToken, isAdminOrOwner, activityController.createActivity);

/**
 * @swagger
 * /api/activities/stats:
 *   get:
 *     summary: Obter estatísticas das atividades
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas das atividades
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
 *                     total_activities:
 *                       type: integer
 *                     active_activities:
 *                       type: integer
 *                     inactive_activities:
 *                       type: integer
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     difficulty_distribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           difficulty_level:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     age_range_distribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           age_range:
 *                             type: string
 *                           count:
 *                             type: integer
 *       401:
 *         description: Token de acesso inválido
 *       403:
 *         description: Acesso negado (apenas admin/owner)
 *       500:
 *         description: Erro interno do servidor
 */

// Estatísticas (apenas admin/owner)
router.get('/stats', verifyToken, isAdminOrOwner, activityController.getActivityStats);

/**
 * @swagger
 * /api/activities/for-age/{ageInMonths}:
 *   get:
 *     summary: Obter atividades para uma idade específica
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ageInMonths
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 60
 *         description: Idade em meses
 *     responses:
 *       200:
 *         description: Atividades para a idade especificada
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
 *                     activities:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Activity'
 *       400:
 *         description: Idade inválida
 *       401:
 *         description: Token de acesso inválido
 *       500:
 *         description: Erro interno do servidor
 */

// Atividades para idade específica (todos os usuários autenticados)
router.get('/for-age/:ageInMonths', verifyToken, activityController.getActivitiesForAge);

/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     summary: Obter atividade por ID
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Detalhes da atividade
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Activity'
 *       404:
 *         description: Atividade não encontrada
 *       401:
 *         description: Token de acesso inválido
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualizar atividade
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da atividade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivityRequest'
 *     responses:
 *       200:
 *         description: Atividade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Activity'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Atividade não encontrada
 *       401:
 *         description: Token de acesso inválido
 *       403:
 *         description: Acesso negado (apenas admin/owner)
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Excluir atividade
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade excluída com sucesso
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
 *         description: Atividade não encontrada
 *       401:
 *         description: Token de acesso inválido
 *       403:
 *         description: Acesso negado (apenas admin/owner)
 *       500:
 *         description: Erro interno do servidor
 */

// Obter atividade específica (todos os usuários autenticados)
router.get('/:id', verifyToken, activityController.getActivity);

// Atualizar atividade (apenas admin/owner)
router.put('/:id', verifyToken, isAdminOrOwner, activityController.updateActivity);

// Excluir atividade (apenas admin/owner)
router.delete('/:id', verifyToken, isAdminOrOwner, activityController.deleteActivity);

/**
 * @swagger
 * /api/activities/{id}/toggle-status:
 *   patch:
 *     summary: Alternar status da atividade (ativo/inativo)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Status da atividade alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Activity'
 *       404:
 *         description: Atividade não encontrada
 *       401:
 *         description: Token de acesso inválido
 *       403:
 *         description: Acesso negado (apenas admin/owner)
 *       500:
 *         description: Erro interno do servidor
 */

// Alternar status da atividade (apenas admin/owner)
router.patch('/:id/toggle-status', verifyToken, isAdminOrOwner, activityController.toggleActivityStatus);

module.exports = router;
