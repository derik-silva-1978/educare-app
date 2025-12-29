const express = require('express');
const router = express.Router();
const llmConfigController = require('../controllers/llmConfigController');
const { verifyToken, isOwner } = require('../middlewares/auth');

router.get('/', verifyToken, isOwner, llmConfigController.getAllConfigs);

router.get('/providers', verifyToken, isOwner, llmConfigController.getAvailableProviders);

router.get('/:module_type', verifyToken, isOwner, llmConfigController.getConfigByModule);

router.put('/:module_type', verifyToken, isOwner, llmConfigController.updateConfig);

module.exports = router;
