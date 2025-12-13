/**
 * Rotas para Marcos do Desenvolvimento
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { requireCuratorRole, requireOwnerRole } = require('../middleware/curatorAuth');
const milestonesController = require('../controllers/milestonesController');

// === ROTAS PÚBLICAS (Dashboard) ===

// Gráfico de marcos para dashboard
router.get('/dashboard/milestones-chart', verifyToken, milestonesController.getMilestonesChart);

// === ROTAS DE CURADORIA (Owner/Admin/Curator) ===

// Listar marcos oficiais
router.get('/milestones', verifyToken, requireCuratorRole, milestonesController.listMilestones);

// Listar mapeamentos para curadoria
router.get('/mappings', verifyToken, requireCuratorRole, milestonesController.listMappings);

// Criar novo mapeamento (vincular pergunta a marco)
router.post('/mappings', verifyToken, requireCuratorRole, milestonesController.createMapping);

// Verificar um mapeamento
router.post('/mappings/:id/verify', verifyToken, requireCuratorRole, milestonesController.verifyMapping);

// Visão cronológica para curadoria
router.get('/curation-view', verifyToken, requireCuratorRole, milestonesController.getCurationView);

// Remover um mapeamento
router.delete('/mappings/:id', verifyToken, requireCuratorRole, milestonesController.deleteMapping);

// Estatísticas de curadoria
router.get('/stats', verifyToken, requireCuratorRole, milestonesController.getCurationStats);

// === ROTAS DE SETUP (Apenas Owner) ===

// Seed dos marcos oficiais
router.post('/setup/seed', verifyToken, requireOwnerRole, milestonesController.seedOfficialMilestones);

// Auto-Linker
router.post('/setup/auto-link', verifyToken, requireOwnerRole, milestonesController.autoLinkMilestones);

// AI Matching - Ranqueamento semântico com IA (curators can execute)
router.post('/ai-matching', verifyToken, requireCuratorRole, milestonesController.runAIMatching);

module.exports = router;
