const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');
const hybridRagController = require('../controllers/hybridRagController');
const { verifyToken } = require('../middlewares/auth');
const apiKeyMiddleware = require('../middlewares/apiKey');

router.get('/health', ragController.healthCheck);

router.post('/ask', verifyToken, ragController.ask);

router.post('/ask-simple', verifyToken, ragController.askSimple);

router.get('/documents', verifyToken, ragController.getKnowledgeDocuments);

router.post('/hybrid/query', verifyToken, hybridRagController.query);

router.get('/hybrid/status', verifyToken, hybridRagController.getStatus);

router.get('/hybrid/providers', verifyToken, hybridRagController.getProviders);

router.get('/hybrid/test', verifyToken, hybridRagController.testConnection);

router.post('/external/ask', apiKeyMiddleware.validateApiKey, ragController.ask);

router.post('/external/ask-simple', apiKeyMiddleware.validateApiKey, ragController.askSimple);

router.post('/external/ask-multimodal', apiKeyMiddleware.validateApiKey, ragController.askMultimodal);

router.post('/external/hybrid/query', apiKeyMiddleware.validateApiKey, hybridRagController.query);

module.exports = router;
