const express = require('express');
const router = express.Router();
const cloudController = require('../controllers/cloudController');
const { verifyToken, isAdminOrOwner } = require('../middlewares/auth');

// Rotas para Google Drive
router.get('/google-drive/file-info', verifyToken, isAdminOrOwner, cloudController.getGoogleDriveFileInfo);
router.post('/google-drive/download', verifyToken, isAdminOrOwner, cloudController.downloadGoogleDriveFile);

// Rotas para OneDrive
router.get('/onedrive/file-info', verifyToken, isAdminOrOwner, cloudController.getOneDriveFileInfo);
router.post('/onedrive/download', verifyToken, isAdminOrOwner, cloudController.downloadOneDriveFile);

module.exports = router;
