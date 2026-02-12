const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const apiKeyMiddleware = require('../middlewares/apiKey');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { User } = require('../models');

const apiKeyOrOwnerJwt = async (req, res, next) => {
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  const validApiKey = process.env.EXTERNAL_API_KEY;
  if (apiKey && validApiKey && apiKey === validApiKey) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      try {
        const decoded = jwt.verify(parts[1], authConfig.secret, { issuer: authConfig.issuer, audience: authConfig.audience });
        const user = await User.findByPk(decoded.id);
        if (user && user.isActive !== false && user.role === 'owner') {
          req.userId = decoded.id;
          req.userRole = user.role;
          return next();
        }
      } catch (e) {}
    }
  }

  return res.status(401).json({ success: false, error: 'Autenticação necessária (API key ou Owner JWT)' });
};

router.get('/health', conversationController.healthCheck);

router.get('/report-image/:phone', conversationController.getReportImage);

router.use(apiKeyOrOwnerJwt);

router.get('/state-config', conversationController.getStateConfigs);
router.get('/state-config/:state', conversationController.getStateConfig);
router.put('/state-config/:state', conversationController.updateStateConfig);

router.get('/state', conversationController.getState);
router.put('/state', conversationController.updateState);
router.post('/state/transition', conversationController.transitionState);
router.get('/state-machine', conversationController.getStateMachine);

router.post('/onboarding', conversationController.processOnboarding);
router.get('/onboarding/status', conversationController.getOnboardingStatus);

router.post('/memory', conversationController.saveMemory);
router.post('/memory/search', conversationController.searchMemory);

router.post('/buffer', conversationController.addToBuffer);
router.get('/buffer/:phone', conversationController.getBuffer);
router.post('/buffer/consume', conversationController.consumeBuffer);

router.get('/context/enriched', conversationController.getEnrichedContext);
router.get('/context/:phone', conversationController.getContext);
router.get('/context/:phone/prompt', conversationController.getContextPrompt);

router.get('/feedback/trigger', conversationController.checkFeedbackTrigger);
router.post('/feedback/contextual', conversationController.saveFeedbackWithContext);
router.post('/feedback', conversationController.saveFeedback);

router.post('/report', conversationController.saveReport);
router.get('/reports', conversationController.getReports);

router.post('/tts', conversationController.textToSpeech);
router.post('/tts/whatsapp', conversationController.ttsForWhatsApp);
router.get('/tts/audio/:hash', conversationController.getTTSAudio);
router.get('/tts/status', conversationController.getTTSStatus);

router.get('/audio-preference', conversationController.getAudioPreference);
router.post('/audio-preference', conversationController.setAudioPreference);

router.get('/menu', conversationController.getContextualMenu);
router.get('/welcome', conversationController.getWelcome);

router.post('/buttons/format', conversationController.formatButtons);
router.post('/buttons/send', conversationController.sendButtons);
router.post('/buttons/resolve', conversationController.resolveButton);

router.post('/session/summary', conversationController.saveSessionSummary);

router.get('/analytics', conversationController.getAnalytics);

module.exports = router;
