const express = require('express');
const router = express.Router();
const journeyV2Controller = require('../controllers/journeyV2Controller');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

// ==================== ROTAS ADMIN (protegidas) ====================

// Listar jornadas e semanas (para seletores no formulário)
router.get('/admin/journeys', verifyToken, isAdmin, journeyV2Controller.adminListJourneys);
router.get('/admin/weeks', verifyToken, isAdmin, journeyV2Controller.adminListWeeks);

// CRUD de Quizzes (Perguntas)
router.get('/admin/quizzes', verifyToken, isAdmin, journeyV2Controller.adminListQuizzes);
router.get('/admin/quizzes/statistics', verifyToken, isAdmin, journeyV2Controller.adminGetQuizStatistics);
router.get('/admin/quizzes/:id', verifyToken, isAdmin, journeyV2Controller.adminGetQuiz);
router.post('/admin/quizzes', verifyToken, isAdmin, journeyV2Controller.adminCreateQuiz);
router.put('/admin/quizzes/:id', verifyToken, isAdmin, journeyV2Controller.adminUpdateQuiz);
router.delete('/admin/quizzes/:id', verifyToken, isAdmin, journeyV2Controller.adminDeleteQuiz);

// Importação e Exportação CSV
router.post('/admin/quizzes/import', verifyToken, isAdmin, upload.single('file'), journeyV2Controller.adminImportQuizzes);
router.get('/admin/quizzes/export', verifyToken, isAdmin, journeyV2Controller.adminExportQuizzes);

module.exports = router;
