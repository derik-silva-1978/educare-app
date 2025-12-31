const express = require('express');
const router = express.Router();
const developmentReportController = require('../controllers/developmentReportController');
const aiReportController = require('../controllers/aiReportController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, developmentReportController.listReports);

router.get('/:id', verifyToken, developmentReportController.getReport);

router.post('/generate', verifyToken, developmentReportController.generateReport);

router.post('/generate-ai', verifyToken, aiReportController.generateAIReport);

router.post('/send-whatsapp', verifyToken, aiReportController.sendReportViaWhatsApp);

router.patch('/:id/share', verifyToken, developmentReportController.shareWithProfessionals);

router.delete('/:id', verifyToken, developmentReportController.deleteReport);

module.exports = router;
