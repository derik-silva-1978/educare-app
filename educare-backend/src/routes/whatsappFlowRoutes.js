const express = require('express');
const router = express.Router();
const whatsappFlowController = require('../controllers/whatsappFlowController');
const apiKeyMiddleware = require('../middlewares/apiKey');

router.use(apiKeyMiddleware.validateApiKey);

router.get('/content/current', whatsappFlowController.getCurrentContent);
router.get('/content/topic/:topicId', whatsappFlowController.getTopicDetail);

router.get('/quiz/next', whatsappFlowController.getNextQuestion);
router.post('/quiz/answer', whatsappFlowController.saveAnswer);

router.get('/log/options', whatsappFlowController.getLogOptions);
router.post('/log/save', whatsappFlowController.saveLog);

router.post('/support/report', whatsappFlowController.saveReport);

module.exports = router;
