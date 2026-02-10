const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const apiKeyMiddleware = require('../middlewares/apiKey');

router.use(apiKeyMiddleware.validateApiKey);

router.get('/state', conversationController.getState);
router.put('/state', conversationController.updateState);
router.post('/state/transition', conversationController.transitionState);
router.get('/state-machine', conversationController.getStateMachine);

router.post('/memory', conversationController.saveMemory);
router.post('/memory/search', conversationController.searchMemory);

router.post('/buffer', conversationController.addToBuffer);
router.get('/buffer/:phone', conversationController.getBuffer);
router.post('/buffer/consume', conversationController.consumeBuffer);

router.get('/context/:phone', conversationController.getContext);
router.get('/context/:phone/prompt', conversationController.getContextPrompt);

router.post('/feedback', conversationController.saveFeedback);
router.post('/report', conversationController.saveReport);
router.get('/reports', conversationController.getReports);

router.post('/tts', conversationController.textToSpeech);
router.get('/tts/audio/:hash', conversationController.getTTSAudio);
router.get('/tts/status', conversationController.getTTSStatus);

router.post('/buttons/format', conversationController.formatButtons);
router.post('/buttons/send', conversationController.sendButtons);
router.post('/buttons/resolve', conversationController.resolveButton);

module.exports = router;
