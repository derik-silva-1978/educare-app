const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { verifyToken, isAdminOrOwner } = require('../middlewares/auth');

router.get('/public', contentController.getPublishedContent);

router.post('/generate-ai', verifyToken, isAdminOrOwner, contentController.generateAIContent);

router.get('/:id/public', contentController.getPublicContentById);

router.post('/:id/view', contentController.incrementViewCount);

router.get('/', verifyToken, isAdminOrOwner, contentController.getAllContent);

router.get('/:id', verifyToken, contentController.getContentById);

router.post('/', verifyToken, isAdminOrOwner, contentController.createContent);

router.put('/:id', verifyToken, isAdminOrOwner, contentController.updateContent);

router.patch('/:id/status', verifyToken, isAdminOrOwner, contentController.updateContentStatus);

router.delete('/:id', verifyToken, isAdminOrOwner, contentController.deleteContent);

module.exports = router;
