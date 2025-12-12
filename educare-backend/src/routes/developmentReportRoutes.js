const express = require('express');
const router = express.Router();
const developmentReportController = require('../controllers/developmentReportController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, developmentReportController.listReports);

router.get('/:id', verifyToken, developmentReportController.getReport);

router.post('/generate', verifyToken, developmentReportController.generateReport);

router.patch('/:id/share', verifyToken, developmentReportController.shareWithProfessionals);

router.delete('/:id', verifyToken, developmentReportController.deleteReport);

module.exports = router;
