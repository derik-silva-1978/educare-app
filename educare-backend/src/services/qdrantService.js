const { QdrantClient } = require('@qdrant/js-client-rest');

let qdrantInstance = null;

const COLLECTION_NAME = 'educare_knowledge';
const VECTOR_SIZE = 768; // Gemini embedding dimension

function getQdrant() {
  if (!qdrantInstance && process.env.QDRANT_URL && process.env.QDRANT_API_KEY) {
    qdrantInstance = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY
    });
  }
  return qdrantInstance;
}

async function ensureCollection() {
  const client = getQdrant();
  if (!client) {
    throw new Error('Qdrant não configurado');
  }

  try {
    const collections = await client.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine'
        }
      });

      await client.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'knowledge_category',
        field_schema: 'keyword'
      });

      await client.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'source_type',
        field_schema: 'keyword'
      });

      await client.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'domain',
        field_schema: 'keyword'
      });

      console.log(`[Qdrant] Collection '${COLLECTION_NAME}' criada com índices`);
    }

    return true;
  } catch (error) {
    console.error('[Qdrant] Erro ao garantir collection:', error);
    throw error;
  }
}

async function upsertDocument(documentId, embedding, metadata = {}) {
  const startTime = Date.now();

  try {
    const client = getQdrant();
    if (!client) {
      return {
        success: false,
        error: 'Qdrant não configurado (QDRANT_URL ou QDRANT_API_KEY não definidos)'
      };
    }

    await ensureCollection();

    await client.upsert(COLLECTION_NAME, {
      points: [{
        id: documentId,
        vector: embedding,
        payload: {
          title: metadata.title || 'Sem título',
          description: metadata.description || null,
          source_type: metadata.source_type || 'document',
          knowledge_category: metadata.knowledge_category || 'general',
          age_range: metadata.age_range || null,
          domain: metadata.domain || null,
          file_path: metadata.file_path || null,
          gemini_file_id: metadata.gemini_file_id || null,
          created_at: new Date().toISOString()
        }
      }]
    });

    const upsertTime = Date.now() - startTime;
    console.log(`[Qdrant] ✓ Documento inserido: ${documentId} (${upsertTime}ms)`);

    return {
      success: true,
      document_id: documentId,
      upsert_time_ms: upsertTime
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[Qdrant] ✗ Erro no upsert (${errorTime}ms):`, error.message);

    return {
      success: false,
      error: error.message || 'Erro ao inserir documento no Qdrant',
      upsert_time_ms: errorTime
    };
  }
}

async function batchUpsert(documents) {
  const startTime = Date.now();
  const { v5: uuidv5 } = require('uuid');
  const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

  try {
    const client = getQdrant();
    if (!client) {
      return {
        success: false,
        error: 'Qdrant não configurado'
      };
    }

    await ensureCollection();

    const points = documents.map((doc, index) => {
      const pointId = uuidv5(doc.id, NAMESPACE);
      
      if (!doc.embedding || !Array.isArray(doc.embedding)) {
        console.error(`[Qdrant] Embedding inválido para doc ${index}:`, typeof doc.embedding);
        throw new Error(`Embedding inválido para documento ${index}`);
      }
      
      console.log(`[Qdrant] Preparando ponto ${index}: id=${pointId}, embedding_dim=${doc.embedding.length}, original_id=${doc.id}`);
      
      return {
        id: pointId,
        vector: doc.embedding,
        payload: {
          original_id: doc.id,
          title: doc.title || 'Sem título',
          description: doc.description || null,
          source_type: doc.source_type || 'document',
          knowledge_category: doc.knowledge_category || 'general',
          age_range: doc.age_range || null,
          domain: doc.domain || null,
          chunk_index: doc.chunk_index || 0,
          parent_document_id: doc.parent_document_id || null,
          content_preview: doc.content_preview || null,
          created_at: new Date().toISOString()
        }
      };
    });

    console.log(`[Qdrant] Enviando ${points.length} pontos para upsert...`);
    await client.upsert(COLLECTION_NAME, { points });

    const upsertTime = Date.now() - startTime;
    console.log(`[Qdrant] ✓ Batch inserido: ${documents.length} documentos (${upsertTime}ms)`);

    return {
      success: true,
      count: documents.length,
      upsert_time_ms: upsertTime
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[Qdrant] ✗ Erro no batch upsert (${errorTime}ms):`, error.message);

    return {
      success: false,
      error: error.message,
      upsert_time_ms: errorTime
    };
  }
}

async function search(queryEmbedding, options = {}) {
  const startTime = Date.now();

  try {
    const client = getQdrant();
    if (!client) {
      return {
        success: false,
        error: 'Qdrant não configurado'
      };
    }

    const filter = buildFilter(options);

    const results = await client.search(COLLECTION_NAME, {
      vector: queryEmbedding,
      limit: options.limit || 10,
      filter: filter,
      with_payload: true,
      score_threshold: options.score_threshold || 0.5
    });

    const searchTime = Date.now() - startTime;

    return {
      success: true,
      results: results.map(r => ({
        id: r.id,
        score: r.score,
        payload: r.payload
      })),
      search_time_ms: searchTime
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[Qdrant] ✗ Erro na busca (${errorTime}ms):`, error.message);

    return {
      success: false,
      error: error.message,
      search_time_ms: errorTime
    };
  }
}

function buildFilter(options) {
  const must = [];

  if (options.knowledge_category) {
    must.push({
      key: 'knowledge_category',
      match: { value: options.knowledge_category }
    });
  }

  if (options.source_type) {
    must.push({
      key: 'source_type',
      match: { value: options.source_type }
    });
  }

  if (options.domain) {
    must.push({
      key: 'domain',
      match: { value: options.domain }
    });
  }

  if (must.length === 0) {
    return undefined;
  }

  return { must };
}

async function deleteDocument(parentDocumentId) {
  try {
    const client = getQdrant();
    if (!client) {
      return {
        success: false,
        error: 'Qdrant não configurado'
      };
    }

    await client.delete(COLLECTION_NAME, {
      filter: {
        must: [{
          key: 'parent_document_id',
          match: { value: parentDocumentId }
        }]
      }
    });

    console.log(`[Qdrant] Chunks do documento ${parentDocumentId} deletados`);

    return {
      success: true,
      message: 'Documento e chunks deletados com sucesso'
    };
  } catch (error) {
    console.error('[Qdrant] Erro ao deletar:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function getCollectionStats() {
  try {
    const client = getQdrant();
    if (!client) {
      return {
        success: false,
        error: 'Qdrant não configurado'
      };
    }

    const info = await client.getCollection(COLLECTION_NAME);

    return {
      success: true,
      stats: {
        collection_name: COLLECTION_NAME,
        vectors_count: info.vectors_count,
        points_count: info.points_count,
        status: info.status,
        optimizer_status: info.optimizer_status
      }
    };
  } catch (error) {
    if (error.status === 404) {
      return {
        success: true,
        stats: {
          collection_name: COLLECTION_NAME,
          vectors_count: 0,
          points_count: 0,
          status: 'not_created'
        }
      };
    }

    console.error('[Qdrant] Erro ao obter stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function scrollDocuments(options = {}) {
  try {
    const client = getQdrant();
    if (!client) {
      return {
        success: false,
        error: 'Qdrant não configurado'
      };
    }

    const filter = buildFilter(options);

    const result = await client.scroll(COLLECTION_NAME, {
      limit: options.limit || 100,
      with_payload: true,
      with_vector: false,
      filter: filter
    });

    return {
      success: true,
      points: result.points,
      next_page_offset: result.next_page_offset
    };
  } catch (error) {
    console.error('[Qdrant] Erro ao scroll:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function isConfigured() {
  return !!(process.env.QDRANT_URL && process.env.QDRANT_API_KEY);
}

module.exports = {
  upsertDocument,
  batchUpsert,
  search,
  deleteDocument,
  getCollectionStats,
  scrollDocuments,
  ensureCollection,
  isConfigured,
  COLLECTION_NAME,
  VECTOR_SIZE
};
