const KnowledgeDocument = require('../models/KnowledgeDocument');
const fileSearchService = require('../services/fileSearchService');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = process.env.KNOWLEDGE_UPLOAD_PATH || './uploads/knowledge';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado'
      });
    }

    const { title, description, source_type, age_range, domain, tags } = req.body;

    if (!title || !source_type) {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: title, source_type'
      });
    }

    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: `Tipo de arquivo não permitido: ${req.file.mimetype}. Permitidos: PDF, PNG, JPG, TXT, DOC, DOCX`
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: `Arquivo muito grande. Máximo: 50MB`
      });
    }

    const timestamp = Date.now();
    const ext = path.extname(req.file.originalname);
    const safeFilename = `${timestamp}_${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const finalPath = path.join(UPLOAD_DIR, safeFilename);

    fs.renameSync(req.file.path, finalPath);

    let fileSearchId = null;
    let fileSearchError = null;

    if (fileSearchService.isConfigured()) {
      const uploadResult = await fileSearchService.uploadDocumentToFileSearch(
        finalPath,
        req.file.originalname,
        { title, source_type, age_range, domain }
      );

      if (uploadResult.success) {
        fileSearchId = uploadResult.file_search_id;
        console.log(`[Knowledge] Documento indexado no File Search: ${fileSearchId}`);
      } else {
        fileSearchError = uploadResult.error;
        console.warn(`[Knowledge] Erro ao indexar no File Search: ${fileSearchError}`);
      }
    } else {
      console.warn('[Knowledge] OpenAI não configurado, documento salvo apenas localmente');
    }

    const parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : (tags || []);

    const document = await KnowledgeDocument.create({
      title,
      description: description || null,
      source_type,
      file_search_id: fileSearchId,
      file_path: finalPath,
      original_filename: req.file.originalname,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      tags: parsedTags,
      age_range: age_range || null,
      domain: domain || null,
      is_active: true,
      created_by: req.user.id,
      metadata: {
        upload_timestamp: timestamp,
        file_search_error: fileSearchError
      }
    });

    console.log(`[Knowledge] Documento criado por ${req.user.email}: ${document.id} - ${title}`);

    return res.status(201).json({
      success: true,
      message: 'Documento de conhecimento cadastrado com sucesso',
      data: {
        id: document.id,
        title: document.title,
        file_search_id: document.file_search_id,
        file_path: document.file_path,
        indexed: !!fileSearchId,
        warning: fileSearchError ? `Arquivo salvo mas não indexado: ${fileSearchError}` : null
      }
    });
  } catch (error) {
    console.error('[Knowledge] Erro ao fazer upload:', error);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar upload'
    });
  }
};

exports.listDocuments = async (req, res) => {
  try {
    const { source_type, age_range, domain, is_active } = req.query;

    const where = {};

    if (source_type) where.source_type = source_type;
    if (age_range) where.age_range = age_range;
    if (domain) where.domain = domain;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const documents = await KnowledgeDocument.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      data: documents,
      count: documents.length
    });
  } catch (error) {
    console.error('[Knowledge] Erro ao listar documentos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar documentos'
    });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await KnowledgeDocument.findByPk(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    return res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('[Knowledge] Erro ao obter documento:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter documento'
    });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, source_type, age_range, domain, tags, is_active } = req.body;

    const document = await KnowledgeDocument.findByPk(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    const parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

    await document.update({
      title: title !== undefined ? title : document.title,
      description: description !== undefined ? description : document.description,
      source_type: source_type !== undefined ? source_type : document.source_type,
      age_range: age_range !== undefined ? age_range : document.age_range,
      domain: domain !== undefined ? domain : document.domain,
      tags: parsedTags !== undefined ? parsedTags : document.tags,
      is_active: is_active !== undefined ? is_active : document.is_active
    });

    console.log(`[Knowledge] Documento atualizado: ${id} por ${req.user.email}`);

    return res.json({
      success: true,
      message: 'Documento atualizado com sucesso',
      data: document
    });
  } catch (error) {
    console.error('[Knowledge] Erro ao atualizar documento:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao atualizar documento'
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await KnowledgeDocument.findByPk(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    if (document.file_search_id && fileSearchService.isConfigured()) {
      const deleteResult = await fileSearchService.deleteDocumentFromFileSearch(document.file_search_id);
      if (!deleteResult.success) {
        console.warn(`[Knowledge] Erro ao deletar do File Search: ${deleteResult.error}`);
      }
    }

    if (document.file_path && fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }

    await document.destroy();

    console.log(`[Knowledge] Documento deletado: ${id} por ${req.user.email}`);

    return res.json({
      success: true,
      message: 'Documento deletado com sucesso'
    });
  } catch (error) {
    console.error('[Knowledge] Erro ao deletar documento:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao deletar documento'
    });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await KnowledgeDocument.findByPk(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    await document.update({
      is_active: !document.is_active
    });

    console.log(`[Knowledge] Status alterado: ${id} -> is_active=${document.is_active}`);

    return res.json({
      success: true,
      message: `Documento ${document.is_active ? 'ativado' : 'desativado'} com sucesso`,
      data: {
        id: document.id,
        is_active: document.is_active
      }
    });
  } catch (error) {
    console.error('[Knowledge] Erro ao alterar status:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao alterar status do documento'
    });
  }
};
