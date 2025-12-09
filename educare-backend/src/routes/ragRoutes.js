const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');
const { verifyToken } = require('../middlewares/auth');
const apiKeyMiddleware = require('../middlewares/apiKey');

router.get('/health', ragController.healthCheck);

router.post('/ask', verifyToken, ragController.ask);

router.post('/ask-simple', verifyToken, ragController.askSimple);

router.get('/documents', verifyToken, ragController.getKnowledgeDocuments);

router.post('/external/ask', apiKeyMiddleware.validateApiKey, ragController.ask);

router.post('/external/ask-simple', apiKeyMiddleware.validateApiKey, ragController.askSimple);

module.exports = router;
