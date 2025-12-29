const express = require('express');
const router = express.Router();
const assistantPromptController = require('../controllers/assistantPromptController');
const { verifyToken, isOwner } = require('../middlewares/auth');

router.get('/', verifyToken, isOwner, assistantPromptController.getPrompts);

router.get('/active/:module_type', verifyToken, isOwner, assistantPromptController.getActivePromptByModule);

router.get('/history/:module_type', verifyToken, isOwner, assistantPromptController.getPromptHistory);

router.get('/:id', verifyToken, isOwner, assistantPromptController.getPromptById);

router.post('/', verifyToken, isOwner, assistantPromptController.createPrompt);

router.put('/:id', verifyToken, isOwner, assistantPromptController.updatePrompt);

router.post('/:id/activate', verifyToken, isOwner, assistantPromptController.activatePrompt);

module.exports = router;
