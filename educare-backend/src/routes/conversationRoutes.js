const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const apiKeyMiddleware = require('../middlewares/apiKey');

router.use(apiKeyMiddleware.validateApiKey);

router.get('/state', conversationController.getState);

router.put('/state', conversationController.updateState);

router.post('/feedback', conversationController.saveFeedback);

router.post('/report', conversationController.saveReport);

router.get('/reports', conversationController.getReports);

router.post('/memory/search', conversationController.searchMemory);

module.exports = router;
