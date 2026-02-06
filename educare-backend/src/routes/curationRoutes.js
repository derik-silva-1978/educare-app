const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { requireCuratorRole, requireOwnerRole } = require('../middleware/curatorAuth');
const curationController = require('../controllers/curationController');

router.get('/domains', verifyToken, curationController.getDomainValues);

router.get('/statistics', verifyToken, requireCuratorRole, curationController.getStatistics);

router.get('/axis/:axis', verifyToken, requireCuratorRole, curationController.listByAxis);

router.post('/classify-all', verifyToken, requireOwnerRole, curationController.classifyAll);

router.put('/domain/:id', verifyToken, requireCuratorRole, curationController.updateDomain);

router.get('/baby/milestone-mappings', verifyToken, requireCuratorRole, curationController.getBabyMilestoneMappings);
router.post('/baby/milestone-mappings', verifyToken, requireCuratorRole, curationController.createBabyMilestoneMapping);
router.post('/baby/milestone-mappings/:id/verify', verifyToken, requireCuratorRole, curationController.verifyBabyMilestoneMapping);
router.delete('/baby/milestone-mappings/:id', verifyToken, requireCuratorRole, curationController.deleteBabyMilestoneMapping);

router.get('/mother/mappings', verifyToken, requireCuratorRole, curationController.getMaternalMappings);
router.post('/mother/mappings', verifyToken, requireCuratorRole, curationController.createMaternalMapping);
router.post('/mother/mappings/:id/verify', verifyToken, requireCuratorRole, curationController.verifyMaternalMapping);
router.delete('/mother/mappings/:id', verifyToken, requireCuratorRole, curationController.deleteMaternalMapping);

router.get('/media/:type/:id', verifyToken, requireCuratorRole, curationController.getMediaForItem);
router.post('/media/:type/:id', verifyToken, requireCuratorRole, curationController.linkMedia);
router.delete('/media/:mediaId', verifyToken, requireCuratorRole, curationController.unlinkMedia);

router.post('/batch-import', verifyToken, requireOwnerRole, curationController.batchImport);

module.exports = router;
