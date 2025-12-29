const express = require('express');
const router = express.Router();
const assistantPromptController = require('../controllers/assistantPromptController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('owner'), assistantPromptController.getPrompts);

router.get('/active/:module_type', authenticate, authorize('owner'), assistantPromptController.getActivePromptByModule);

router.get('/history/:module_type', authenticate, authorize('owner'), assistantPromptController.getPromptHistory);

router.get('/:id', authenticate, authorize('owner'), assistantPromptController.getPromptById);

router.post('/', authenticate, authorize('owner'), assistantPromptController.createPrompt);

router.put('/:id', authenticate, authorize('owner'), assistantPromptController.updatePrompt);

router.post('/:id/activate', authenticate, authorize('owner'), assistantPromptController.activatePrompt);

module.exports = router;
