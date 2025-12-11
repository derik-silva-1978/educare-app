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

// Verificar um mapeamento
router.post('/mappings/:id/verify', verifyToken, requireCuratorRole, milestonesController.verifyMapping);

// Remover um mapeamento
router.delete('/mappings/:id', verifyToken, requireCuratorRole, milestonesController.deleteMapping);

// Estatísticas de curadoria
router.get('/stats', verifyToken, requireCuratorRole, milestonesController.getCurationStats);

// === ROTAS DE SETUP (Apenas Owner) ===

// Seed dos marcos oficiais
router.post('/setup/seed', verifyToken, requireOwnerRole, milestonesController.seedOfficialMilestones);

// Auto-Linker
router.post('/setup/auto-link', verifyToken, requireOwnerRole, milestonesController.autoLinkMilestones);

module.exports = router;
