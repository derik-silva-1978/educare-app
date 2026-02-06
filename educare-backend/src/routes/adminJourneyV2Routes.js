const express = require('express');
const router = express.Router();
const adminJourneyV2Controller = require('../controllers/adminJourneyV2Controller');
const { verifyToken, isAdminOrOwner } = require('../middlewares/auth');

router.use(verifyToken);
router.use(isAdminOrOwner);

router.get('/statistics', adminJourneyV2Controller.getStatistics);
router.get('/content', adminJourneyV2Controller.listContent);
router.get('/weeks', adminJourneyV2Controller.listWeeks);

router.get('/topics/:id', adminJourneyV2Controller.getTopic);
router.post('/topics', adminJourneyV2Controller.createTopic);
router.put('/topics/:id', adminJourneyV2Controller.updateTopic);
router.delete('/topics/:id', adminJourneyV2Controller.deleteTopic);

router.get('/quizzes/:id', adminJourneyV2Controller.getQuiz);
router.post('/quizzes', adminJourneyV2Controller.createQuiz);
router.put('/quizzes/:id', adminJourneyV2Controller.updateQuiz);
router.delete('/quizzes/:id', adminJourneyV2Controller.deleteQuiz);

router.post('/reimport', adminJourneyV2Controller.reimport);

module.exports = router;
