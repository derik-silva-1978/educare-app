const express = require('express');
const router = express.Router();
const mediaResourceController = require('../controllers/mediaResourceController');
const { verifyToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middleware/authorization');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    'audio': ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
    'video': ['video/mp4', 'video/webm', 'video/ogg'],
    'pdf': ['application/pdf']
  };

  const allAllowedTypes = Object.values(allowedTypes).flat();

  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB padrão
  }
});

/**
 * @route   GET /api/media-resources
 * @desc    Listar recursos com filtros
 * @access  Private (Owner, Admin)
 */
router.get(
  '/',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  mediaResourceController.list
);

/**
 * @route   GET /api/media-resources/stats
 * @desc    Obter estatísticas dos recursos
 * @access  Private (Owner, Admin)
 */
router.get(
  '/stats',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  mediaResourceController.getStats
);

/**
 * @route   GET /api/media-resources/category/:category
 * @desc    Buscar recursos por categoria
 * @access  Private (Owner, Admin)
 */
router.get(
  '/category/:category',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  mediaResourceController.getByCategory
);

/**
 * @route   GET /api/media-resources/:id
 * @desc    Buscar recurso por ID
 * @access  Private (Owner, Admin)
 */
router.get(
  '/:id',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  mediaResourceController.getById
);

/**
 * @route   POST /api/media-resources
 * @desc    Criar novo recurso
 * @access  Private (Owner, Admin)
 */
router.post(
  '/',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  upload.single('file'),
  mediaResourceController.create
);

/**
 * @route   PUT /api/media-resources/:id
 * @desc    Atualizar recurso
 * @access  Private (Owner, Admin)
 */
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  upload.single('file'),
  mediaResourceController.update
);

/**
 * @route   DELETE /api/media-resources/:id
 * @desc    Deletar recurso
 * @access  Private (Owner, Admin)
 */
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  mediaResourceController.delete
);

/**
 * @route   POST /api/media-resources/:id/tts
 * @desc    Gerar áudio via TTS
 * @access  Private (Owner, Admin)
 */
router.post(
  '/:id/tts',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  mediaResourceController.generateTTS
);

module.exports = router;
