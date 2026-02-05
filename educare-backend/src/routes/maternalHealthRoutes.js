const express = require('express');
const router = express.Router();
const maternalHealthController = require('../controllers/maternalHealthController');
const { verifyToken } = require('../middlewares/auth');

router.use(verifyToken);

router.get('/profile', maternalHealthController.getProfile);
router.put('/profile', maternalHealthController.updateProfile);

router.post('/daily-health', maternalHealthController.addDailyHealth);
router.get('/daily-health', maternalHealthController.getDailyHealth);

router.post('/mental-health', maternalHealthController.addMentalHealth);
router.get('/mental-health', maternalHealthController.getMentalHealth);
router.get('/mental-health/summary', maternalHealthController.getMentalHealthSummary);

router.post('/appointments', maternalHealthController.addAppointment);
router.get('/appointments', maternalHealthController.getAppointments);
router.put('/appointments/:appointmentId', maternalHealthController.updateAppointment);

router.get('/dashboard', maternalHealthController.getDashboardSummary);

module.exports = router;
