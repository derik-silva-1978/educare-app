const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

let genaiInstance = null;
let fileSearchStore = null;

const STORE_NAME = 'educare-knowledge-base';
const MODEL_NAME = 'gemini-2.5-flash';

// Timeouts para evitar loops infinitos
const POLLING_INTERVAL_MS = 2000; // 2 segundos entre tentativas
const MAX_POLLING_TIME_MS = 30000; // 30 segundos máximo de polling
const STORE_CREATION_TIMEOUT_MS = 15000; // 15 segundos para criar store

function getGenAI() {
  if (!genaiInstance && process.env.GEMINI_API_KEY) {
    genaiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genaiInstance;
}

async function ensureFileSearchStore() {
  if (fileSearchStore) {
    return fileSearchStore;
  }

  const ai = getGenAI();
  if (!ai) {
    throw new Error('Gemini API not configured');
  }

  try {
    const stores = await ai.fileSearchStores.list();
    const existing = stores.fileSearchStores?.find(s => 
      s.displayName === STORE_NAME || s.name?.includes(STORE_NAME)
    );

    if (existing) {
      fileSearchStore = existing;
      console.log(`[GeminiFileSearch] Using existing store: ${existing.name}`);
      return fileSearchStore;
    }

    fileSearchStore = await ai.fileSearchStores.create({
      displayName: STORE_NAME
    });
    console.log(`[GeminiFileSearch] Created new store: ${fileSearchStore.name}`);
    return fileSearchStore;
  } catch (error) {
    console.error('[GeminiFileSearch] Error ensuring store:', error);
    throw error;
  }
}

async function uploadDocument(filePath, fileName, metadata = {}) {
  const startTime = Date.now();

  try {
    const ai = getGenAI();
    if (!ai) {
      return {
        success: false,
        error: 'Gemini API não configurado (GEMINI_API_KEY não definida)'
      };
    }

    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: `Arquivo não encontrado: ${filePath}`
      };
    }

    const stats = fs.statSync(filePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`[GeminiFileSearch] Iniciando upload: ${fileName} (${fileSizeMB}MB)`);

    const store = await ensureFileSearchStore();

    const operation = await ai.fileSearchStores.uploadToFileSearchStore({
      file: filePath,
      fileSearchStoreName: store.name,
      displayName: fileName,
      customMetadata: {
        title: metadata.title || fileName,
        source_type: metadata.source_type || 'document',
        knowledge_category: metadata.knowledge_category || 'general',
        age_range: metadata.age_range || null,
        domain: metadata.domain || null,
        upload_timestamp: new Date().toISOString()
      },
      chunkingConfig: {
        maxTokensPerChunk: 500,
        maxOverlapTokens: 100
      }
    });

    console.log(`[GeminiFileSearch] Aguardando indexação (max ${MAX_POLLING_TIME_MS/1000}s)...`);
    
    let result = operation;
    const pollingStartTime = Date.now();

    while (!result.done) {
      const elapsedTime = Date.now() - pollingStartTime;
      
      if (elapsedTime >= MAX_POLLING_TIME_MS) {
        console.warn(`[GeminiFileSearch] Timeout de polling após ${elapsedTime}ms - retornando status pendente`);
        return {
          success: true,
          status: 'pending',
          gemini_file_id: operation.name || null,
          store_name: store.name,
          filename: fileName,
          bytes: stats.size,
          upload_time_ms: Date.now() - startTime,
          provider: 'gemini',
          message: 'Documento enviado, indexação em andamento (verifique o status posteriormente)'
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
      
      try {
        result = await ai.operations.get(operation);
      } catch (pollError) {
        console.warn(`[GeminiFileSearch] Erro no polling: ${pollError.message}`);
        break;
      }
    }

    const uploadTime = Date.now() - startTime;
    console.log(`[GeminiFileSearch] ✓ Documento indexado: ${fileName} (${uploadTime}ms)`);

    return {
      success: true,
      gemini_file_id: result.result?.name || result.name,
      store_name: store.name,
      filename: fileName,
      bytes: stats.size,
      upload_time_ms: uploadTime,
      provider: 'gemini'
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[GeminiFileSearch] ✗ Erro no upload (${errorTime}ms):`, error.message);

    return {
      success: false,
      error: error.message || 'Erro ao enviar arquivo para Gemini File Search',
      upload_time_ms: errorTime
    };
  }
}

async function queryKnowledgeBase(query, options = {}) {
  const startTime = Date.now();

  try {
    const ai = getGenAI();
    if (!ai) {
      return {
        success: false,
        error: 'Gemini API não configurado'
      };
    }

    const store = await ensureFileSearchStore();

    const config = {
      tools: [{
        fileSearch: {
          fileSearchStoreNames: [store.name]
        }
      }]
    };

    if (options.metadataFilter) {
      config.tools[0].fileSearch.metadataFilter = options.metadataFilter;
    }

    const systemPrompt = options.systemPrompt || `Você é TitiNauta, assistente especializado em desenvolvimento infantil e saúde materna.
Responda com base nos documentos da base de conhecimento.
Sempre cite as fontes quando possível.
Se não encontrar informação relevante, diga que não tem essa informação na base de conhecimento.`;

    const response = await ai.models.generateContent({
      model: options.model || MODEL_NAME,
      contents: query,
      systemInstruction: systemPrompt,
      config
    });

    const queryTime = Date.now() - startTime;

    const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return {
      success: true,
      answer: response.text,
      citations: citations.map(chunk => ({
        content: chunk.retrievedContext?.text || chunk.content,
        source: chunk.retrievedContext?.uri || chunk.source,
        title: chunk.retrievedContext?.title || 'Documento'
      })),
      query_time_ms: queryTime,
      provider: 'gemini'
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[GeminiFileSearch] Erro na query (${errorTime}ms):`, error.message);

    return {
      success: false,
      error: error.message || 'Erro ao consultar base de conhecimento',
      query_time_ms: errorTime
    };
  }
}

async function deleteDocument(fileId) {
  try {
    const ai = getGenAI();
    if (!ai) {
      return {
        success: false,
        error: 'Gemini API não configurado'
      };
    }

    await ai.files.delete({ name: fileId });
    console.log(`[GeminiFileSearch] Documento deletado: ${fileId}`);

    return {
      success: true,
      message: 'Documento deletado com sucesso'
    };
  } catch (error) {
    console.error('[GeminiFileSearch] Erro ao deletar:', error);
    return {
      success: false,
      error: error.message || 'Erro ao deletar documento'
    };
  }
}

async function listDocuments() {
  try {
    const ai = getGenAI();
    if (!ai) {
      return {
        success: false,
        error: 'Gemini API não configurado'
      };
    }

    const store = await ensureFileSearchStore();
    const files = await ai.fileSearchStores.listFiles({ fileSearchStoreName: store.name });

    return {
      success: true,
      data: files.files || [],
      store_name: store.name
    };
  } catch (error) {
    console.error('[GeminiFileSearch] Erro ao listar:', error);
    return {
      success: false,
      error: error.message || 'Erro ao listar documentos'
    };
  }
}

async function getStoreStats() {
  try {
    const ai = getGenAI();
    if (!ai) {
      return {
        success: false,
        error: 'Gemini API não configurado'
      };
    }

    const store = await ensureFileSearchStore();
    const files = await ai.fileSearchStores.listFiles({ fileSearchStoreName: store.name });

    const totalSize = (files.files || []).reduce((sum, f) => sum + (f.sizeBytes || 0), 0);

    return {
      success: true,
      stats: {
        store_name: store.name,
        total_documents: (files.files || []).length,
        total_size_bytes: totalSize,
        total_size_mb: (totalSize / (1024 * 1024)).toFixed(2)
      }
    };
  } catch (error) {
    console.error('[GeminiFileSearch] Erro ao obter stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function isConfigured() {
  return !!process.env.GEMINI_API_KEY;
}

function getProvider() {
  return 'gemini';
}

module.exports = {
  uploadDocument,
  queryKnowledgeBase,
  deleteDocument,
  listDocuments,
  getStoreStats,
  isConfigured,
  getProvider,
  ensureFileSearchStore
};
