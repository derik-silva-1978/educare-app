const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ragController = require('../controllers/ragController');
const hybridRagController = require('../controllers/hybridRagController');
const { verifyToken } = require('../middlewares/auth');
const apiKeyMiddleware = require('../middlewares/apiKey');

const uploadDir = path.join(__dirname, '../../uploads/audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const audioUpload = multer({
  storage: audioStorage,
  limits: {
    fileSize: 25 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    const allowedMimes = [
      'audio/webm',
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      'audio/x-m4a',
      'audio/flac'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de áudio não suportado. Use WebM, MP3, WAV, OGG, M4A ou FLAC.'));
    }
  }
});

router.get('/health', ragController.healthCheck);

router.post('/ask', verifyToken, ragController.ask);

router.post('/ask-simple', verifyToken, ragController.askSimple);

router.get('/documents', verifyToken, ragController.getKnowledgeDocuments);

router.post('/hybrid/query', verifyToken, hybridRagController.query);

router.get('/hybrid/status', verifyToken, hybridRagController.status);

router.get('/hybrid/health', hybridRagController.healthCheck);

router.post('/external/ask', apiKeyMiddleware.validateApiKey, ragController.ask);

router.post('/external/ask-simple', apiKeyMiddleware.validateApiKey, ragController.askSimple);

router.post('/external/ask-multimodal', apiKeyMiddleware.validateApiKey, ragController.askMultimodal);

router.post('/external/hybrid/query', apiKeyMiddleware.validateApiKey, hybridRagController.query);

router.post('/transcribe', verifyToken, audioUpload.single('audio'), ragController.transcribeAudio);

module.exports = router;
