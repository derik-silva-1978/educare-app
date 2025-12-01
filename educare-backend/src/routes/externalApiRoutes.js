const express = require('express');
const router = express.Router();
const externalApiController = require('../controllers/externalApiController');
const apiKeyMiddleware = require('../middlewares/apiKey');

/**
 * @swagger
 * tags:
 *   name: API Externa
 *   description: Endpoints para integração com sistemas externos
 */

// Middleware para validar API key em todas as rotas externas
router.use(apiKeyMiddleware.validateApiKey);

// Rota para listar planos de assinatura
router.get('/subscription-plans', externalApiController.getSubscriptionPlans);

// Rotas para usuários
router.get('/users/search/children', externalApiController.searchUserChildren); // NOVO: Buscar crianças por telefone ou CPF/CNPJ
router.get('/users/search', externalApiController.searchUser); // Buscar usuário por telefone ou CPF/CNPJ
router.get('/users', externalApiController.getUsers);
router.post('/users', externalApiController.createUser);
router.get('/users/:id', externalApiController.getUserById);
router.get('/users/:id/children', externalApiController.getUserChildren);

// Rotas para crianças
router.get('/children/:id', externalApiController.getChildById);

// Rotas para jornada e quiz
router.get('/children/:childId/unanswered-questions', externalApiController.getUnansweredQuestions);
router.post('/children/:childId/save-answer', externalApiController.saveQuestionAnswer);
router.get('/children/:childId/progress', externalApiController.getChildProgress);
router.get('/children/:childId/quiz-responses', externalApiController.getQuizResponses);

// Rotas para seleção de criança ativa
router.get('/users/by-phone/:phone/active-child', externalApiController.getActiveChildByPhone);
router.post('/users/by-phone/:phone/select-child/:childId', externalApiController.selectChildByPhone);

module.exports = router;
