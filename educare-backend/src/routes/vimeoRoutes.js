const express = require('express');
const router = express.Router();
const vimeoController = require('../controllers/vimeoController');
const { verifyToken, isAdminOrOwner } = require('../middlewares/auth');

router.get('/status', verifyToken, isAdminOrOwner, vimeoController.checkStatus);

router.get('/videos', verifyToken, isAdminOrOwner, vimeoController.listVideos);
router.get('/videos/search', verifyToken, isAdminOrOwner, vimeoController.searchVideos);
router.get('/videos/synced', verifyToken, isAdminOrOwner, vimeoController.getSyncedVideos);
router.get('/videos/:videoId', verifyToken, isAdminOrOwner, vimeoController.getVideoInfo);
router.get('/videos/:videoId/embed', verifyToken, isAdminOrOwner, vimeoController.generateEmbed);
router.post('/videos/:videoId/sync', verifyToken, isAdminOrOwner, vimeoController.syncVideo);

module.exports = router;
