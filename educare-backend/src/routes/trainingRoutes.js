const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { verifyToken, isAdminOrOwner, optionalAuth } = require('../middlewares/auth');

router.get('/', optionalAuth, trainingController.listTrainings);
router.get('/user/enrollments', verifyToken, trainingController.getUserEnrollments);
router.get('/:id', optionalAuth, trainingController.getTrainingDetails);

router.get('/:trainingId/lessons/:lessonId', verifyToken, trainingController.getLessonContent);
router.put('/:trainingId/lessons/:lessonId/progress', verifyToken, trainingController.updateLessonProgress);

router.post('/:trainingId/enroll', verifyToken, trainingController.enrollUser);
router.post('/:trainingId/checkout', verifyToken, trainingController.createCheckoutSession);
router.post('/payment-success', verifyToken, trainingController.handlePaymentSuccess);

router.post('/', verifyToken, isAdminOrOwner, trainingController.createTraining);
router.put('/:id', verifyToken, isAdminOrOwner, trainingController.updateTraining);
router.delete('/:id', verifyToken, isAdminOrOwner, trainingController.deleteTraining);

module.exports = router;
