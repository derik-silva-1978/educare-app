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

const UPLOAD_TIMEOUT_MS = 30000; // 30 segundos ao invés de 120
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

async function uploadDocumentToFileSearch(filePath, fileName, metadata = {}, retryCount = 0) {
  const startTime = Date.now();

  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado'
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
    console.log(`[FileSearch] Iniciando upload (tentativa ${retryCount + 1}): ${fileName} (${fileSizeMB}MB)`);

    let fileStream = null;
    try {
      fileStream = fs.createReadStream(filePath);
      
      // Definir timeout para a stream
      const uploadController = new AbortController();
      const timeoutId = setTimeout(() => {
        uploadController.abort();
        if (fileStream) fileStream.destroy();
      }, UPLOAD_TIMEOUT_MS);

      const uploadPromise = openai.files.create({
        file: fileStream,
        purpose: 'assistants'
      });

      const uploadedFile = await uploadPromise;
      clearTimeout(timeoutId);

      const uploadTime = Date.now() - startTime;
      console.log(`[FileSearch] ✓ Upload concluído: ${fileName}, ID: ${uploadedFile.id}, tempo: ${uploadTime}ms`);

      return {
        success: true,
        file_search_id: uploadedFile.id,
        filename: uploadedFile.filename,
        bytes: uploadedFile.bytes,
        created_at: uploadedFile.created_at,
        upload_time_ms: uploadTime
      };
    } finally {
      if (fileStream) {
        fileStream.destroy();
      }
    }
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[FileSearch] ✗ Erro no upload (${errorTime}ms, tentativa ${retryCount + 1}/${MAX_RETRIES + 1}):`, error.message);

    // Retry com backoff exponencial
    if (retryCount < MAX_RETRIES) {
      const delayTime = RETRY_DELAY_MS * Math.pow(2, retryCount);
      console.log(`[FileSearch] Reenviando em ${delayTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayTime));
      return uploadDocumentToFileSearch(filePath, fileName, metadata, retryCount + 1);
    }

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
