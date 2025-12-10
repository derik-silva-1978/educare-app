const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

let openaiInstance = null;

function getOpenAI() {
  if (!openaiInstance && process.env.OPENAI_API_KEY) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiInstance;
}

const UPLOAD_TIMEOUT_MS = 120000;

async function uploadDocumentToFileSearch(filePath, fileName, metadata = {}) {
  const startTime = Date.now();

  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado'
      };
    }

    const stats = fs.statSync(filePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`[FileSearch] Iniciando upload: ${fileName} (${fileSizeMB}MB)`);

    const fileStream = fs.createReadStream(filePath);

    const uploadPromise = openai.files.create({
      file: fileStream,
      purpose: 'assistants'
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Upload timeout: excedeu 120 segundos')), UPLOAD_TIMEOUT_MS)
    );

    const uploadedFile = await Promise.race([uploadPromise, timeoutPromise]);

    const uploadTime = Date.now() - startTime;
    console.log(`[FileSearch] Upload concluído: ${fileName}, ID: ${uploadedFile.id}, tempo: ${uploadTime}ms`);

    return {
      success: true,
      file_search_id: uploadedFile.id,
      filename: uploadedFile.filename,
      bytes: uploadedFile.bytes,
      created_at: uploadedFile.created_at,
      upload_time_ms: uploadTime
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[FileSearch] Erro no upload após ${errorTime}ms:`, error.message);
    return {
      success: false,
      error: error.message || 'Erro ao enviar arquivo para File Search',
      upload_time_ms: errorTime
    };
  }
}

async function deleteDocumentFromFileSearch(fileSearchId) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado'
      };
    }

    await openai.files.del(fileSearchId);

    console.log(`[FileSearch] Arquivo deletado: ${fileSearchId}`);

    return {
      success: true,
      message: 'Arquivo deletado com sucesso'
    };
  } catch (error) {
    console.error('[FileSearch] Erro ao deletar arquivo:', error);
    return {
      success: false,
      error: error.message || 'Erro ao deletar arquivo do File Search'
    };
  }
}

async function getFileInfo(fileSearchId) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado'
      };
    }

    const fileInfo = await openai.files.retrieve(fileSearchId);

    return {
      success: true,
      data: fileInfo
    };
  } catch (error) {
    console.error('[FileSearch] Erro ao obter info do arquivo:', error);
    return {
      success: false,
      error: error.message || 'Erro ao obter informações do arquivo'
    };
  }
}

async function listFiles() {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado'
      };
    }

    const files = await openai.files.list();

    return {
      success: true,
      data: files.data.filter(f => f.purpose === 'assistants')
    };
  } catch (error) {
    console.error('[FileSearch] Erro ao listar arquivos:', error);
    return {
      success: false,
      error: error.message || 'Erro ao listar arquivos'
    };
  }
}

function isConfigured() {
  return !!process.env.OPENAI_API_KEY;
}

module.exports = {
  uploadDocumentToFileSearch,
  deleteDocumentFromFileSearch,
  getFileInfo,
  listFiles,
  isConfigured
};
