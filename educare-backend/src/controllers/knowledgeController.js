const KnowledgeDocument = require('../models/KnowledgeDocument');
const fileSearchService = require('../services/fileSearchService');
const hybridIngestionService = require('../services/hybridIngestionService');
const knowledgeBaseRepository = require('../repositories/knowledgeBaseRepository');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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

// Status de ingestão possíveis
const INGESTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Função para processar ingestão em background (não bloqueia resposta HTTP)
async function processIngestionInBackground(documentId, finalPath, originalFilename, metadata, category, requestId) {
  const startTime = Date.now();
  
  try {
    console.log(`[Knowledge:${requestId}] [BG] Iniciando ingestão em background para doc ${documentId}`);
    
    // Atualiza status para "processing"
    await KnowledgeDocument.update(
      { 
        metadata: { 
          ...(await KnowledgeDocument.findByPk(documentId))?.metadata,
          ingestion_status: INGESTION_STATUS.PROCESSING,
          ingestion_started_at: new Date().toISOString()
        } 
      },
      { where: { id: documentId } }
    );
    
    const activeProviders = hybridIngestionService.getActiveProviders();
    let hybridProviders = [];
    let geminiFileId = null;
    let qdrantDocumentId = null;
    let fileSearchError = null;
    
    if (activeProviders.length > 0) {
      console.log(`[Knowledge:${requestId}] [BG] Provedores ativos: [${activeProviders.join(', ')}]`);
      
      const ingestionResult = await hybridIngestionService.ingestDocument(
        finalPath,
        originalFilename,
        metadata
      );

      console.log(`[Knowledge:${requestId}] [BG] Resultado da ingestão:`, JSON.stringify(ingestionResult, null, 2));
      
      if (ingestionResult.success) {
        hybridProviders = ingestionResult.providers;
        
        if (ingestionResult.gemini?.success) {
          geminiFileId = ingestionResult.gemini.gemini_file_id;
        }
        
        if (ingestionResult.qdrant?.success) {
          qdrantDocumentId = metadata.document_id;
        }
        
        console.log(`[Knowledge:${requestId}] [BG] ✓ Ingestão OK: providers=[${hybridProviders.join(', ')}] (${ingestionResult.ingestion_time_ms}ms)`);
      } else {
        fileSearchError = 'Nenhum provedor RAG conseguiu indexar o documento';
        console.warn(`[Knowledge:${requestId}] [BG] ⚠ Falha na ingestão híbrida`);
      }
    } else if (fileSearchService.isConfigured()) {
      try {
        console.log(`[Knowledge:${requestId}] [BG] Fallback para OpenAI File Search`);
        const uploadResult = await fileSearchService.uploadDocumentToFileSearch(
          finalPath,
          originalFilename,
          { title: metadata.title, source_type: metadata.source_type, age_range: metadata.age_range, domain: metadata.domain }
        );

        if (uploadResult.success) {
          hybridProviders = ['openai'];
          console.log(`[Knowledge:${requestId}] [BG] ✓ Documento indexado no OpenAI: ${uploadResult.file_search_id}`);
        } else {
          fileSearchError = uploadResult.error;
        }
      } catch (fileSearchErr) {
        fileSearchError = fileSearchErr.message || 'Erro desconhecido no File Search';
        console.error(`[Knowledge:${requestId}] [BG] ✗ Exceção ao indexar: ${fileSearchError}`);
      }
    } else {
      console.warn(`[Knowledge:${requestId}] [BG] Nenhum provedor RAG configurado`);
    }
    
    // Atualiza documento com resultado final
    const processingTime = Date.now() - startTime;
    const finalStatus = hybridProviders.length > 0 ? INGESTION_STATUS.COMPLETED : INGESTION_STATUS.FAILED;
    
    await KnowledgeDocument.update(
      {
        file_search_id: geminiFileId || null,
        metadata: {
          ingestion_status: finalStatus,
          ingestion_completed_at: new Date().toISOString(),
          ingestion_time_ms: processingTime,
          rag_providers: hybridProviders,
          gemini_file_id: geminiFileId,
          qdrant_document_id: qdrantDocumentId,
          file_search_error: fileSearchError
        }
      },
      { where: { id: documentId } }
    );
    
    console.log(`[Knowledge:${requestId}] [BG] ✓ Ingestão finalizada: status=${finalStatus}, providers=[${hybridProviders.join(', ')}] (${processingTime}ms)`);
    
  } catch (error) {
    console.error(`[Knowledge:${requestId}] [BG] ✗ Erro fatal na ingestão:`, error);
    
    // Atualiza status para falha
    try {
      await KnowledgeDocument.update(
        {
          metadata: {
            ingestion_status: INGESTION_STATUS.FAILED,
            ingestion_error: error.message,
            ingestion_completed_at: new Date().toISOString()
          }
        },
        { where: { id: documentId } }
      );
    } catch (updateError) {
      console.error(`[Knowledge:${requestId}] [BG] Erro ao atualizar status de falha:`, updateError);
    }
  }
}

exports.uploadDocument = async (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`[Knowledge:${requestId}] ========== INÍCIO UPLOAD ==========`);
  console.log(`[Knowledge:${requestId}] Usuário: ${req.user?.email} (${req.user?.role})`);
  console.log(`[Knowledge:${requestId}] Headers: Content-Type=${req.headers['content-type']}`);
  
  try {
    if (!req.file) {
      console.log(`[Knowledge:${requestId}] ERRO: Nenhum arquivo recebido`);
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado'
      });
    }
    
    console.log(`[Knowledge:${requestId}] Arquivo: ${req.file.originalname} (${req.file.size} bytes, ${req.file.mimetype})`);

    const { title, description, source_type, age_range, domain, tags, knowledge_category, trimester, specialty, subdomain } = req.body;

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
    const safeFilename = `${timestamp}_${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const finalPath = path.join(UPLOAD_DIR, safeFilename);

    fs.renameSync(req.file.path, finalPath);

    const documentId = uuidv4();
    const category = knowledge_category || inferCategory(req.body);
    const parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : (tags || []);

    // Cria o documento IMEDIATAMENTE com status "pending"
    const legacyData = {
      id: documentId,
      title,
      description: description || null,
      source_type,
      file_search_id: null,
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
        ingestion_status: INGESTION_STATUS.PENDING,
        rag_providers: []
      }
    };

    // Segmented data (optional, based on knowledge_category)
    let segmentedData = null;

    const validSegmentedCategories = ['baby', 'mother', 'professional', 'landing'];
    const categories = knowledge_category
      ? knowledge_category.split(',').map(c => c.trim()).filter(c => validSegmentedCategories.includes(c))
      : (category && validSegmentedCategories.includes(category) ? [category] : []);

    if (process.env.ENABLE_SEGMENTED_KB === 'true' && categories.length > 0) {
      const segmentedResults = [];
      for (const cat of categories) {
        const catSegData = {
          title,
          content: '',
          description: description || null,
          source_type,
          file_search_id: null,
          file_path: finalPath,
          original_filename: req.file.originalname,
          file_size: req.file.size,
          mime_type: req.file.mimetype,
          tags: parsedTags,
          is_active: true,
          created_by: req.user.id,
          metadata: {
            upload_timestamp: timestamp,
            ingestion_status: INGESTION_STATUS.PENDING,
            rag_providers: []
          }
        };

        if (cat === 'baby') {
          catSegData.age_range = age_range || null;
          catSegData.domain = domain || null;
          catSegData.subcategory = subdomain || null;
        } else if (cat === 'mother') {
          catSegData.trimester = trimester || null;
          catSegData.domain = domain || null;
          catSegData.subcategory = subdomain || null;
        } else if (cat === 'professional') {
          catSegData.specialty = specialty || null;
          catSegData.domain = domain || null;
          catSegData.subcategory = subdomain || null;
        }

        segmentedResults.push({ category: cat, data: catSegData });
      }
      segmentedData = segmentedResults.length === 1 ? segmentedResults[0].data : null;
    }

    legacyData.metadata.knowledge_categories = categories;

    if (categories.length > 1) {
      const result = await knowledgeBaseRepository.insertMultiCategory(categories, legacyData, {
        title, content: '', description: description || null, source_type,
        file_search_id: null, file_path: finalPath,
        original_filename: req.file.originalname, file_size: req.file.size,
        mime_type: req.file.mimetype, tags: parsedTags, is_active: true,
        created_by: req.user.id,
        metadata: { upload_timestamp: timestamp, ingestion_status: INGESTION_STATUS.PENDING, rag_providers: [] },
        age_range: age_range || null, domain: domain || null, subcategory: subdomain || null,
        trimester: trimester || null, specialty: specialty || null
      });
      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }
      console.log(`[Knowledge:${requestId}] Documento criado: ${documentId} - ${title} (categorias: ${categories.join(', ')})`);

      const ingestionMetadata = {
        document_id: documentId, title, description, source_type, age_range,
        domain, tags: parsedTags, knowledge_category: categories[0],
        knowledge_categories: categories, file_path: finalPath,
        original_filename: req.file.originalname, mime_type: req.file.mimetype
      };
      processIngestion(ingestionMetadata, requestId).catch(err => {
        console.error(`[Knowledge:${requestId}] Erro na ingestão em background:`, err.message);
      });

      return res.status(201).json({
        success: true, data: { id: documentId, title, status: 'processing', categories },
        message: `Documento criado e ingestão iniciada para ${categories.length} bases`
      });
    }

    // Dual write: legacy + segmented (single category)
    const result = await knowledgeBaseRepository.insertDualWithCategory(categories[0] || category, legacyData, segmentedData);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    console.log(`[Knowledge:${requestId}] Documento criado: ${documentId} - ${title} (categoria: ${category || 'legado'})`);

    // Inicia ingestão em BACKGROUND (não bloqueia resposta)
    const ingestionMetadata = {
      document_id: documentId,
      title,
      description,
      source_type,
      age_range,
      domain,
      knowledge_category: category,
      mime_type: req.file.mimetype
    };

    // Dispara processamento assíncrono SEM await
    processIngestionInBackground(documentId, finalPath, req.file.originalname, ingestionMetadata, category, requestId)
      .catch(err => console.error(`[Knowledge:${requestId}] Erro no processamento background:`, err));

    console.log(`[Knowledge:${requestId}] ========== RESPOSTA IMEDIATA (ingestão em background) ==========`);
    
    return res.status(201).json({
      success: true,
      message: 'Documento salvo com sucesso. Indexação em andamento.',
      data: {
        id: documentId,
        title: title,
        file_path: finalPath,
        ingestion_status: INGESTION_STATUS.PENDING,
        category: category || 'legado',
        segmented_id: result.data.segmented ? result.data.segmented.id : null
      }
    });
  } catch (error) {
    console.error(`[Knowledge:${requestId}] ========== ERRO NO UPLOAD ==========`);
    console.error(`[Knowledge:${requestId}] Tipo: ${error.name}, Mensagem: ${error.message}`);
    console.error(`[Knowledge:${requestId}] Stack:`, error.stack);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Handle Sequelize validation errors with specific messages
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(e => e.message).join(', ');
      return res.status(400).json({
        success: false,
        error: `Erro de validação: ${validationErrors}`,
        details: error.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }

    // Handle unique constraint violations
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Documento com este título já existe'
      });
    }

    // Handle database connection errors
    if (error.name === 'SequelizeConnectionError') {
      return res.status(503).json({
        success: false,
        error: 'Erro de conexão com o banco de dados. Tente novamente.'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao processar upload'
    });
  }
};

/**
 * Infere categoria baseado nos campos presentes no request
 */
const inferCategory = (body) => {
  if (body.trimester) return 'mother';
  if (body.specialty) return 'professional';
  if (body.age_range || body.domain === 'motor' || body.domain === 'cognitivo' || body.domain === 'social' || body.domain === 'linguagem') {
    return 'baby';
  }
  return null;
};

exports.getIngestionStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await KnowledgeDocument.findByPk(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    const metadata = document.metadata || {};
    const status = metadata.ingestion_status || 'unknown';
    
    return res.json({
      success: true,
      data: {
        id: document.id,
        title: document.title,
        ingestion_status: status,
        rag_providers: metadata.rag_providers || [],
        gemini_file_id: metadata.gemini_file_id || null,
        qdrant_document_id: metadata.qdrant_document_id || null,
        ingestion_started_at: metadata.ingestion_started_at || null,
        ingestion_completed_at: metadata.ingestion_completed_at || null,
        ingestion_time_ms: metadata.ingestion_time_ms || null,
        ingestion_error: metadata.ingestion_error || metadata.file_search_error || null
      }
    });
  } catch (error) {
    console.error('[Knowledge] Erro ao obter status de ingestão:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter status de ingestão'
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

    const metadata = document.metadata || {};
    let hybridDeleteHandled = false;

    if (metadata.gemini_file_id || metadata.qdrant_document_id) {
      try {
        console.log(`[Knowledge] Deletando do RAG híbrido: id=${id}, gemini=${metadata.gemini_file_id}, qdrant=${metadata.qdrant_document_id}`);
        const hybridDeleteResult = await hybridIngestionService.deleteDocument({
          document_id: metadata.qdrant_document_id || null,
          gemini_file_id: metadata.gemini_file_id || null
        });
        
        if (hybridDeleteResult.success) {
          console.log(`[Knowledge] ✓ Documento removido do RAG híbrido`);
          hybridDeleteHandled = true;
        } else {
          console.warn(`[Knowledge] Falha parcial na deleção do RAG híbrido:`, hybridDeleteResult);
        }
      } catch (hybridErr) {
        console.error(`[Knowledge] Erro ao deletar do RAG híbrido:`, hybridErr.message);
      }
    }

    if (!hybridDeleteHandled && document.file_search_id && fileSearchService.isConfigured()) {
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
