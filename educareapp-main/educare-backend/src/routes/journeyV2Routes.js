const express = require('express');
const router = express.Router();
const journeyV2Controller = require('../controllers/journeyV2Controller');
const { verifyToken } = require('../middlewares/auth');

/**
 * Rotas para a Jornada 2.0
 * Base: /api/journey-v2
 */

// Rotas públicas (sem autenticação)
router.get('/journeys', journeyV2Controller.getAllJourneys);
router.get('/journeys/:id', journeyV2Controller.getJourneyById);
router.get('/journeys/:journeyId/weeks', journeyV2Controller.getJourneyWeeks);
router.get('/weeks/:id', journeyV2Controller.getWeekById);
router.get('/weeks/:weekId/topics', journeyV2Controller.getWeekTopics);
router.get('/weeks/:weekId/quizzes', journeyV2Controller.getWeekQuizzes);

// Rotas protegidas (com autenticação)
router.get('/users/:userId/progress/:journeyId', verifyToken, journeyV2Controller.getUserJourneyProgress);
router.post('/users/:userId/weeks/:weekId/progress', verifyToken, journeyV2Controller.updateUserWeekProgress);
router.post('/users/:userId/badges', verifyToken, journeyV2Controller.awardUserBadge);
router.get('/users/:userId/badges', verifyToken, journeyV2Controller.getUserBadges);

module.exports = router;
