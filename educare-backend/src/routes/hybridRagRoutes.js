const express = require('express');
const router = express.Router();
const hybridRagController = require('../controllers/hybridRagController');
const { verifyToken } = require('../middlewares/auth');

router.get('/health', hybridRagController.healthCheck);

router.post('/query', verifyToken, hybridRagController.query);

router.get('/status', verifyToken, hybridRagController.status);

router.post('/ingest', verifyToken, hybridRagController.ingest);

module.exports = router;
