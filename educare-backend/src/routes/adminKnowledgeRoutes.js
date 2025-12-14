const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const knowledgeController = require('../controllers/knowledgeController');
const { verifyToken, isOwner } = require('../middlewares/auth');

const UPLOAD_DIR = process.env.KNOWLEDGE_UPLOAD_PATH || './uploads/knowledge';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

router.post('/upload', verifyToken, isOwner, upload.single('file'), knowledgeController.uploadDocument);

router.get('/', verifyToken, isOwner, knowledgeController.listDocuments);

router.get('/:id', verifyToken, isOwner, knowledgeController.getDocument);

router.get('/:id/status', verifyToken, isOwner, knowledgeController.getIngestionStatus);

router.put('/:id', verifyToken, isOwner, knowledgeController.updateDocument);

router.delete('/:id', verifyToken, isOwner, knowledgeController.deleteDocument);

router.patch('/:id/toggle-active', verifyToken, isOwner, knowledgeController.toggleActive);

module.exports = router;
