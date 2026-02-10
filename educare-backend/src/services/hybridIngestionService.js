const geminiFileSearchService = require('./geminiFileSearchService');
const pgvectorService = require('./pgvectorService');
const ragMetricsService = require('./ragMetricsService');
const { v4: uuidv4 } = require('uuid');

const ENABLE_GEMINI = process.env.ENABLE_GEMINI_RAG !== 'false';
const ENABLE_PGVECTOR = process.env.ENABLE_PGVECTOR_RAG !== 'false' && process.env.ENABLE_QDRANT_RAG !== 'false';

const GEMINI_OCR_TIMEOUT = 120000;
const GEMINI_EMBEDDING_TIMEOUT = 30000;
const INGESTION_TOTAL_TIMEOUT = 600000;

function withTimeout(promise, timeoutMs, operationName) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout após ${timeoutMs}ms em ${operationName}`)), timeoutMs)
    )
  ]);
}

async function generateEmbedding(text) {
  try {
    const { GoogleGenAI } = require('@google/genai');
    
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: 'GEMINI_API_KEY não configurada'
      };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const result = await withTimeout(
      ai.models.embedContent({
        model: 'text-embedding-004',
        contents: text
      }),
      GEMINI_EMBEDDING_TIMEOUT,
      'Gemini embedding'
    );

    const embedding = result.embeddings?.[0]?.values || result.embedding?.values;
    
    if (!embedding || !Array.isArray(embedding)) {
      console.error('[HybridIngestion] Resposta de embedding inesperada:', JSON.stringify(result, null, 2));
      return {
        success: false,
        error: 'Formato de resposta de embedding inválido'
      };
    }

    return {
      success: true,
      embedding: embedding,
      dimension: embedding.length
    };
  } catch (error) {
    console.error('[HybridIngestion] Erro ao gerar embedding:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function extractTextFromFile(filePath, mimeType) {
  const fs = require('fs');
  const path = require('path');
  
  try {
    if (mimeType === 'text/plain') {
      const content = fs.readFileSync(filePath, 'utf-8');
      return { success: true, text: content };
    }
    
    if (mimeType === 'application/pdf' || mimeType.startsWith('image/')) {
      if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: 'Gemini não configurado para OCR' };
      }
      
      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');
      
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{
            parts: [
              { 
                inlineData: { 
                  mimeType: mimeType, 
                  data: base64Data 
                } 
              },
              { 
                text: 'Extraia todo o texto deste documento. Inclua texto de tabelas, imagens e gráficos. Retorne apenas o texto extraído, sem formatação adicional.' 
              }
            ]
          }]
        }),
        GEMINI_OCR_TIMEOUT,
        'Gemini OCR'
      );
      
      return { success: true, text: response.text };
    }
    
    return { success: false, error: `Tipo de arquivo não suportado para extração: ${mimeType}` };
  } catch (error) {
    console.error('[HybridIngestion] Erro na extração de texto:', error.message);
    return { success: false, error: error.message };
  }
}

function chunkText(text, maxChunkSize = 1000, overlap = 200) {
  if (!text || text.length <= maxChunkSize) {
    return [text];
  }
  
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    let end = Math.min(start + maxChunkSize, text.length);
    
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const breakPoint = Math.max(lastPeriod, lastNewline);
      
      if (breakPoint > start + maxChunkSize / 2) {
        end = breakPoint + 1;
      }
    }
    
    chunks.push(text.substring(start, end).trim());
    start = end - overlap;
    
    if (start >= text.length - overlap) break;
  }
  
  return chunks.filter(c => c.length > 50);
}

async function ingestDocument(filePath, fileName, metadata = {}) {
  const startTime = Date.now();
  const results = {
    gemini: null,
    pgvector: null,
    success: false,
    providers: [],
    chunks_indexed: 0
  };

  console.log(`[HybridIngestion] Iniciando ingestão: ${fileName}`);

  try {
    await withTimeout(
      (async () => {
        if (ENABLE_GEMINI && geminiFileSearchService.isConfigured()) {
          try {
            console.log(`[HybridIngestion] → Gemini File Search...`);
            const geminiResult = await geminiFileSearchService.uploadDocument(filePath, fileName, metadata);
            results.gemini = geminiResult;
            
            if (geminiResult.success) {
              results.providers.push('gemini');
              metadata.gemini_file_id = geminiResult.gemini_file_id;
            }
          } catch (error) {
            console.error('[HybridIngestion] Erro no Gemini:', error.message);
            results.gemini = { success: false, error: error.message };
          }
        }

        if (ENABLE_PGVECTOR && pgvectorService.isConfigured()) {
          try {
            console.log(`[HybridIngestion] → PgVector embeddings com extração de texto...`);
            
            const parentDocumentId = metadata.document_id || uuidv4();
            const mimeType = metadata.mime_type || 'application/pdf';
            
            const extractionResult = await extractTextFromFile(filePath, mimeType);
            
            if (!extractionResult.success) {
              console.warn(`[HybridIngestion] Extração de texto falhou: ${extractionResult.error}`);
              results.pgvector = { success: false, error: extractionResult.error };
            } else {
              const extractedText = extractionResult.text;
              console.log(`[HybridIngestion] Texto extraído: ${extractedText.length} caracteres`);
              
              const chunks = chunkText(extractedText, 1000, 200);
              console.log(`[HybridIngestion] Chunks criados: ${chunks.length}`);
              
              const documentsToIndex = [];
              
              for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                const chunkId = `${parentDocumentId}_chunk_${i}`;
                
                const embeddingResult = await generateEmbedding(chunk);
                
                if (embeddingResult.success) {
                  documentsToIndex.push({
                    id: chunkId,
                    embedding: embeddingResult.embedding,
                    title: metadata.title || fileName,
                    description: metadata.description,
                    source_type: metadata.source_type,
                    knowledge_category: metadata.knowledge_category,
                    age_range: metadata.age_range,
                    domain: metadata.domain,
                    chunk_index: i,
                    parent_document_id: parentDocumentId,
                    content_preview: chunk.substring(0, 500)
                  });
                } else {
                  console.warn(`[HybridIngestion] Falha ao gerar embedding para chunk ${i}: ${embeddingResult.error}`);
                }
              }
              
              if (documentsToIndex.length > 0) {
                const batchResult = await pgvectorService.batchUpsert(documentsToIndex);
                
                if (batchResult.success) {
                  results.providers.push('pgvector');
                  results.chunks_indexed = documentsToIndex.length;
                  results.pgvector = { 
                    success: true, 
                    chunks_count: documentsToIndex.length,
                    parent_document_id: parentDocumentId
                  };
                } else {
                  results.pgvector = batchResult;
                }
              } else {
                results.pgvector = { success: false, error: 'Nenhum chunk pôde ser indexado' };
              }
            }
          } catch (error) {
            console.error('[HybridIngestion] Erro no PgVector:', error.message);
            results.pgvector = { success: false, error: error.message };
          }
        }
      })(),
      INGESTION_TOTAL_TIMEOUT,
      'Ingestão híbrida completa'
    );
  } catch (timeoutError) {
    console.error('[HybridIngestion] Timeout na ingestão:', timeoutError.message);
    results.success = results.providers.length > 0;
    if (results.providers.length === 0) {
      results.pgvector = { success: false, error: timeoutError.message };
    }
  }

  results.success = results.providers.length > 0;
  results.ingestion_time_ms = Date.now() - startTime;

  console.log(`[HybridIngestion] ✓ Concluído: ${fileName} → providers: [${results.providers.join(', ')}], chunks: ${results.chunks_indexed} (${results.ingestion_time_ms}ms)`);

  ragMetricsService.recordIngestion({
    filename: fileName,
    title: metadata.title || fileName,
    knowledge_category: metadata.knowledge_category,
    success: results.success,
    ingestion_time_ms: results.ingestion_time_ms,
    chunks_indexed: results.chunks_indexed,
    providers: results.providers,
    file_size: metadata.file_size || 0,
    error: results.success ? null : (results.pgvector?.error || results.gemini?.error || 'Falha desconhecida')
  });

  return results;
}

async function deleteDocument(metadata) {
  const results = {
    gemini: null,
    pgvector: null,
    success: false
  };

  if (metadata.gemini_file_id && geminiFileSearchService.isConfigured()) {
    results.gemini = await geminiFileSearchService.deleteDocument(metadata.gemini_file_id);
  }

  if (metadata.document_id && pgvectorService.isConfigured()) {
    results.pgvector = await pgvectorService.deleteDocument(metadata.document_id);
  }

  results.success = (results.gemini?.success || !metadata.gemini_file_id) && 
                    (results.pgvector?.success || !metadata.document_id);

  return results;
}

async function getSystemStatus() {
  const status = {
    gemini: {
      configured: geminiFileSearchService.isConfigured(),
      enabled: ENABLE_GEMINI,
      stats: null
    },
    pgvector: {
      configured: pgvectorService.isConfigured(),
      enabled: ENABLE_PGVECTOR,
      stats: null
    }
  };

  if (status.gemini.configured && status.gemini.enabled) {
    try {
      status.gemini.stats = await geminiFileSearchService.getStoreStats();
    } catch (error) {
      status.gemini.error = error.message;
    }
  }

  if (status.pgvector.configured && status.pgvector.enabled) {
    try {
      status.pgvector.stats = await pgvectorService.getCollectionStats();
    } catch (error) {
      status.pgvector.error = error.message;
    }
  }

  return status;
}

function getActiveProviders() {
  const providers = [];
  
  if (ENABLE_GEMINI && geminiFileSearchService.isConfigured()) {
    providers.push('gemini');
  }
  
  if (ENABLE_PGVECTOR && pgvectorService.isConfigured()) {
    providers.push('pgvector');
  }
  
  return providers;
}

module.exports = {
  ingestDocument,
  deleteDocument,
  getSystemStatus,
  getActiveProviders,
  generateEmbedding
};
