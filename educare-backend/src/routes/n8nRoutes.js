const express = require('express');
const router = express.Router();
const n8nController = require('../controllers/n8nController');
const ragController = require('../controllers/ragController');
const apiKeyMiddleware = require('../middlewares/apiKey');

router.use(apiKeyMiddleware.validateApiKey);

router.get('/users/check', n8nController.checkUser);

router.post('/users/recognize', n8nController.recognizeWhatsAppUser);

router.post('/rag/ask', ragController.askMultimodal);

router.post('/biometrics/update', n8nController.updateBiometrics);

router.post('/sleep/log', n8nController.logSleep);

router.post('/appointments/create', n8nController.createAppointment);

router.get('/vaccines/check', n8nController.checkVaccines);

router.get('/content/child', n8nController.getChildContent);

router.get('/content/mother', n8nController.getMotherContent);

module.exports = router;
