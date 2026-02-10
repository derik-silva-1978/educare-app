const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const { v5: uuidv5 } = require('uuid');

const COLLECTION_NAME = 'knowledge_embeddings';
const VECTOR_SIZE = 768;
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

let tablesReady = false;
let pgvectorAvailable = false;

async function checkPgvectorAvailable() {
  try {
    const [results] = await sequelize.query(
      `SELECT 1 FROM pg_extension WHERE extname = 'vector'`
    );
    return results.length > 0;
  } catch {
    return false;
  }
}

async function ensureTables() {
  if (tablesReady) return true;

  try {
    pgvectorAvailable = await checkPgvectorAvailable();
    const embeddingType = pgvectorAvailable ? 'vector(768)' : 'FLOAT8[]';
    console.log(`[PgVector] Extension available: ${pgvectorAvailable}, using embedding type: ${embeddingType}`);

    if (!pgvectorAvailable) {
      await sequelize.query(`
        CREATE OR REPLACE FUNCTION cosine_similarity_float8(a FLOAT8[], b FLOAT8[])
        RETURNS FLOAT8 AS $$
        DECLARE
          dot_product FLOAT8 := 0;
          norm_a FLOAT8 := 0;
          norm_b FLOAT8 := 0;
          i INT;
        BEGIN
          IF a IS NULL OR b IS NULL OR array_length(a, 1) != array_length(b, 1) THEN
            RETURN 0;
          END IF;
          FOR i IN 1..array_length(a, 1) LOOP
            dot_product := dot_product + (a[i] * b[i]);
            norm_a := norm_a + (a[i] * a[i]);
            norm_b := norm_b + (b[i] * b[i]);
          END LOOP;
          IF norm_a = 0 OR norm_b = 0 THEN
            RETURN 0;
          END IF;
          RETURN dot_product / (sqrt(norm_a) * sqrt(norm_b));
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
      `);
      console.log('[PgVector] Cosine similarity fallback function created');
    }

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS knowledge_embeddings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        original_id TEXT,
        title TEXT,
        description TEXT,
        content_preview TEXT,
        source_type VARCHAR(50) DEFAULT 'document',
        knowledge_category VARCHAR(50) DEFAULT 'general',
        age_range VARCHAR(50),
        domain VARCHAR(50),
        chunk_index INTEGER DEFAULT 0,
        parent_document_id TEXT,
        file_path TEXT,
        gemini_file_id TEXT,
        embedding ${embeddingType},
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    if (pgvectorAvailable) {
      await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_ke_embedding ON knowledge_embeddings USING hnsw (embedding vector_cosine_ops);`);
    }
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_ke_category ON knowledge_embeddings (knowledge_category);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_ke_source_type ON knowledge_embeddings (source_type);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_ke_domain ON knowledge_embeddings (domain);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_ke_parent_doc ON knowledge_embeddings (parent_document_id);`);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS conversation_memory (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_phone VARCHAR(20) NOT NULL,
        user_id UUID,
        role VARCHAR(20) NOT NULL CHECK (role IN ('user_message', 'assistant_response')),
        content TEXT NOT NULL,
        embedding ${embeddingType},
        interaction_type VARCHAR(30) DEFAULT 'conversation' CHECK (interaction_type IN ('conversation', 'quiz', 'journey', 'feedback')),
        active_context VARCHAR(10) CHECK (active_context IN ('child', 'mother')),
        assistant_name VARCHAR(50),
        domain VARCHAR(50),
        journey_week INTEGER,
        emotional_tone VARCHAR(30),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    if (pgvectorAvailable) {
      await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_cm_embedding ON conversation_memory USING hnsw (embedding vector_cosine_ops);`);
    }
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_cm_user_phone ON conversation_memory (user_phone);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_cm_user_id ON conversation_memory (user_id);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_cm_context ON conversation_memory (active_context);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_cm_type ON conversation_memory (interaction_type);`);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS conversation_states (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_phone VARCHAR(20) NOT NULL UNIQUE,
        user_id UUID,
        state VARCHAR(30) NOT NULL DEFAULT 'ENTRY' CHECK (state IN ('ENTRY', 'CONTEXT_SELECTION', 'FREE_CONVERSATION', 'CONTENT_FLOW', 'QUIZ_FLOW', 'LOG_FLOW', 'SUPPORT', 'FEEDBACK', 'PAUSE', 'EXIT')),
        active_context VARCHAR(10) CHECK (active_context IN ('child', 'mother')),
        active_child_id UUID,
        assistant_name VARCHAR(50),
        journey_week INTEGER,
        quiz_session_id UUID,
        buffer_messages TEXT[] DEFAULT '{}',
        buffer_started_at TIMESTAMPTZ,
        audio_preference VARCHAR(10) DEFAULT 'text' CHECK (audio_preference IN ('text', 'audio')),
        correlation_id UUID,
        metadata JSONB DEFAULT '{}',
        last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_cs_user_phone ON conversation_states (user_phone);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_cs_state ON conversation_states (state);`);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ux_feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_phone VARCHAR(20) NOT NULL,
        user_id UUID,
        score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
        state VARCHAR(30),
        active_context VARCHAR(10),
        assistant_name VARCHAR(50),
        journey_week INTEGER,
        comment TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_uf_user_phone ON ux_feedback (user_phone);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_uf_score ON ux_feedback (score);`);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS support_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_phone VARCHAR(20) NOT NULL,
        user_id UUID,
        type VARCHAR(20) NOT NULL DEFAULT 'problem' CHECK (type IN ('problem', 'suggestion')),
        content TEXT NOT NULL,
        state VARCHAR(30),
        active_context VARCHAR(10),
        assistant_name VARCHAR(50),
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_sr_user_phone ON support_reports (user_phone);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_sr_type ON support_reports (type);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_sr_status ON support_reports (status);`);

    tablesReady = true;
    console.log('[PgVector] All tables and indexes created successfully');
    return true;
  } catch (error) {
    console.error('[PgVector] Error creating tables:', error.message);
    throw error;
  }
}

async function upsertDocument(documentId, embedding, metadata = {}) {
  const startTime = Date.now();

  try {
    await ensureTables();

    const pointId = uuidv5(String(documentId), NAMESPACE);
    const embeddingStr = `[${embedding.join(',')}]`;
    const castType = pgvectorAvailable ? '::vector' : '::FLOAT8[]';

    await sequelize.query(`
      INSERT INTO knowledge_embeddings (id, original_id, title, description, source_type, knowledge_category, age_range, domain, file_path, gemini_file_id, embedding, metadata, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11${castType}, $12, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        source_type = EXCLUDED.source_type,
        knowledge_category = EXCLUDED.knowledge_category,
        age_range = EXCLUDED.age_range,
        domain = EXCLUDED.domain,
        file_path = EXCLUDED.file_path,
        gemini_file_id = EXCLUDED.gemini_file_id,
        embedding = EXCLUDED.embedding,
        metadata = EXCLUDED.metadata,
        updated_at = NOW()
    `, {
      bind: [
        pointId,
        String(documentId),
        metadata.title || 'Sem título',
        metadata.description || null,
        metadata.source_type || 'document',
        metadata.knowledge_category || 'general',
        metadata.age_range || null,
        metadata.domain || null,
        metadata.file_path || null,
        metadata.gemini_file_id || null,
        embeddingStr,
        JSON.stringify(metadata)
      ]
    });

    const upsertTime = Date.now() - startTime;
    console.log(`[PgVector] Document upserted: ${documentId} (${upsertTime}ms)`);

    return {
      success: true,
      document_id: documentId,
      upsert_time_ms: upsertTime
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[PgVector] Upsert error (${errorTime}ms):`, error.message);
    return {
      success: false,
      error: error.message,
      upsert_time_ms: errorTime
    };
  }
}

async function batchUpsert(documents) {
  const startTime = Date.now();

  try {
    await ensureTables();

    for (const doc of documents) {
      if (!doc.embedding || !Array.isArray(doc.embedding)) {
        throw new Error(`Invalid embedding for document ${doc.id}`);
      }

      const pointId = uuidv5(String(doc.id), NAMESPACE);
      const embeddingStr = `[${doc.embedding.join(',')}]`;
      const castType = pgvectorAvailable ? '::vector' : '::FLOAT8[]';

      await sequelize.query(`
        INSERT INTO knowledge_embeddings (id, original_id, title, description, content_preview, source_type, knowledge_category, age_range, domain, chunk_index, parent_document_id, embedding, metadata, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12${castType}, $13, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          content_preview = EXCLUDED.content_preview,
          source_type = EXCLUDED.source_type,
          knowledge_category = EXCLUDED.knowledge_category,
          age_range = EXCLUDED.age_range,
          domain = EXCLUDED.domain,
          chunk_index = EXCLUDED.chunk_index,
          parent_document_id = EXCLUDED.parent_document_id,
          embedding = EXCLUDED.embedding,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
      `, {
        bind: [
          pointId,
          String(doc.id),
          doc.title || 'Sem título',
          doc.description || null,
          doc.content_preview || null,
          doc.source_type || 'document',
          doc.knowledge_category || 'general',
          doc.age_range || null,
          doc.domain || null,
          doc.chunk_index || 0,
          doc.parent_document_id || null,
          embeddingStr,
          JSON.stringify({ original_id: doc.id, created_at: new Date().toISOString() })
        ]
      });
    }

    const upsertTime = Date.now() - startTime;
    console.log(`[PgVector] Batch upserted: ${documents.length} documents (${upsertTime}ms)`);

    return {
      success: true,
      count: documents.length,
      upsert_time_ms: upsertTime
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[PgVector] Batch upsert error (${errorTime}ms):`, error.message);
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
    await ensureTables();

    const limit = options.limit || 10;
    const scoreThreshold = options.score_threshold || 0.5;
    const embeddingStr = `[${queryEmbedding.join(',')}]`;

    let whereConditions = [];
    let bindParams = [embeddingStr, limit, scoreThreshold];
    let paramIndex = 4;

    if (options.knowledge_category) {
      whereConditions.push(`knowledge_category = $${paramIndex}`);
      bindParams.push(options.knowledge_category);
      paramIndex++;
    }

    if (options.source_type) {
      whereConditions.push(`source_type = $${paramIndex}`);
      bindParams.push(options.source_type);
      paramIndex++;
    }

    if (options.domain) {
      whereConditions.push(`domain = $${paramIndex}`);
      bindParams.push(options.domain);
      paramIndex++;
    }

    whereConditions.push(`embedding IS NOT NULL`);

    let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    let sql;
    if (pgvectorAvailable) {
      sql = `
        SELECT id, original_id, title, description, content_preview, source_type, knowledge_category,
               age_range, domain, chunk_index, parent_document_id, file_path, gemini_file_id, metadata, created_at,
               1 - (embedding <=> $1::vector) as score
        FROM knowledge_embeddings
        ${whereClause}
        AND 1 - (embedding <=> $1::vector) >= $3
        ORDER BY embedding <=> $1::vector
        LIMIT $2
      `;
    } else {
      sql = `
        SELECT id, original_id, title, description, content_preview, source_type, knowledge_category,
               age_range, domain, chunk_index, parent_document_id, file_path, gemini_file_id, metadata, created_at,
               cosine_similarity_float8(embedding, $1::FLOAT8[]) as score
        FROM knowledge_embeddings
        ${whereClause}
        AND cosine_similarity_float8(embedding, $1::FLOAT8[]) >= $3
        ORDER BY cosine_similarity_float8(embedding, $1::FLOAT8[]) DESC
        LIMIT $2
      `;
    }

    const results = await sequelize.query(sql, {
      bind: bindParams,
      type: QueryTypes.SELECT
    });

    const searchTime = Date.now() - startTime;

    return {
      success: true,
      results: results.map(r => ({
        id: r.id,
        score: parseFloat(r.score),
        payload: {
          original_id: r.original_id,
          title: r.title,
          description: r.description,
          content_preview: r.content_preview,
          source_type: r.source_type,
          knowledge_category: r.knowledge_category,
          age_range: r.age_range,
          domain: r.domain,
          chunk_index: r.chunk_index,
          parent_document_id: r.parent_document_id,
          file_path: r.file_path,
          gemini_file_id: r.gemini_file_id,
          metadata: r.metadata,
          created_at: r.created_at
        }
      })),
      search_time_ms: searchTime
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[PgVector] Search error (${errorTime}ms):`, error.message);
    return {
      success: false,
      error: error.message,
      search_time_ms: errorTime
    };
  }
}

async function deleteDocument(parentDocumentId) {
  try {
    await ensureTables();

    await sequelize.query(
      `DELETE FROM knowledge_embeddings WHERE parent_document_id = $1`,
      { bind: [parentDocumentId] }
    );

    console.log(`[PgVector] Document chunks deleted: ${parentDocumentId}`);

    return {
      success: true,
      message: 'Documento e chunks deletados com sucesso'
    };
  } catch (error) {
    console.error('[PgVector] Delete error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function getCollectionStats() {
  try {
    await ensureTables();

    const [result] = await sequelize.query(
      `SELECT COUNT(*) as count FROM knowledge_embeddings WHERE embedding IS NOT NULL`,
      { type: QueryTypes.SELECT }
    );

    return {
      success: true,
      stats: {
        collection_name: COLLECTION_NAME,
        vectors_count: parseInt(result.count || '0'),
        points_count: parseInt(result.count || '0'),
        status: 'active'
      }
    };
  } catch (error) {
    console.error('[PgVector] Stats error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function scrollDocuments(options = {}) {
  try {
    await ensureTables();

    const limit = options.limit || 100;
    const offset = options.offset || 0;

    let whereConditions = [];
    let bindParams = [limit, offset];
    let paramIndex = 3;

    if (options.knowledge_category) {
      whereConditions.push(`knowledge_category = $${paramIndex}`);
      bindParams.push(options.knowledge_category);
      paramIndex++;
    }

    if (options.source_type) {
      whereConditions.push(`source_type = $${paramIndex}`);
      bindParams.push(options.source_type);
      paramIndex++;
    }

    if (options.domain) {
      whereConditions.push(`domain = $${paramIndex}`);
      bindParams.push(options.domain);
      paramIndex++;
    }

    let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const results = await sequelize.query(`
      SELECT id, original_id, title, description, content_preview, source_type, knowledge_category,
             age_range, domain, chunk_index, parent_document_id, file_path, gemini_file_id, metadata, created_at
      FROM knowledge_embeddings
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, {
      bind: bindParams,
      type: QueryTypes.SELECT
    });

    return {
      success: true,
      points: results.map(r => ({
        id: r.id,
        payload: {
          original_id: r.original_id,
          title: r.title,
          description: r.description,
          content_preview: r.content_preview,
          source_type: r.source_type,
          knowledge_category: r.knowledge_category,
          age_range: r.age_range,
          domain: r.domain,
          chunk_index: r.chunk_index,
          parent_document_id: r.parent_document_id,
          file_path: r.file_path,
          gemini_file_id: r.gemini_file_id,
          metadata: r.metadata,
          created_at: r.created_at
        }
      })),
      next_page_offset: results.length === limit ? offset + limit : null
    };
  } catch (error) {
    console.error('[PgVector] Scroll error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

function isConfigured() {
  return true;
}

async function saveConversationMemory(data) {
  try {
    await ensureTables();

    const embeddingStr = data.embedding ? `[${data.embedding.join(',')}]` : null;
    const castType = pgvectorAvailable ? '::vector' : '::FLOAT8[]';

    const [result] = await sequelize.query(`
      INSERT INTO conversation_memory (user_phone, user_id, role, content, embedding, interaction_type, active_context, assistant_name, domain, journey_week, emotional_tone, metadata, created_at)
      VALUES ($1, $2, $3, $4, ${embeddingStr ? `$5${castType}` : 'NULL'}, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING id
    `, {
      bind: [
        data.user_phone,
        data.user_id || null,
        data.role,
        data.content,
        embeddingStr,
        data.interaction_type || 'conversation',
        data.active_context || null,
        data.assistant_name || null,
        data.domain || null,
        data.journey_week || null,
        data.emotional_tone || null,
        JSON.stringify(data.metadata || {})
      ],
      type: QueryTypes.SELECT
    });

    return {
      success: true,
      id: result.id
    };
  } catch (error) {
    console.error('[PgVector] Save conversation memory error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function searchConversationMemory(queryEmbedding, userPhone, options = {}) {
  const startTime = Date.now();

  try {
    await ensureTables();

    const limit = options.limit || 10;
    const embeddingStr = `[${queryEmbedding.join(',')}]`;

    let whereConditions = [`user_phone = $3`, `embedding IS NOT NULL`];
    let bindParams = [embeddingStr, limit, userPhone];
    let paramIndex = 4;

    if (options.active_context) {
      whereConditions.push(`active_context = $${paramIndex}`);
      bindParams.push(options.active_context);
      paramIndex++;
    }

    let sql;
    if (pgvectorAvailable) {
      sql = `
        SELECT id, user_phone, role, content, interaction_type, active_context, assistant_name, domain,
               journey_week, emotional_tone, metadata, created_at,
               1 - (embedding <=> $1::vector) as score
        FROM conversation_memory
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY embedding <=> $1::vector
        LIMIT $2
      `;
    } else {
      sql = `
        SELECT id, user_phone, role, content, interaction_type, active_context, assistant_name, domain,
               journey_week, emotional_tone, metadata, created_at,
               cosine_similarity_float8(embedding, $1::FLOAT8[]) as score
        FROM conversation_memory
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY cosine_similarity_float8(embedding, $1::FLOAT8[]) DESC
        LIMIT $2
      `;
    }

    const results = await sequelize.query(sql, {
      bind: bindParams,
      type: QueryTypes.SELECT
    });

    const searchTime = Date.now() - startTime;

    return {
      success: true,
      results: results.map(r => ({
        id: r.id,
        score: parseFloat(r.score),
        role: r.role,
        content: r.content,
        interaction_type: r.interaction_type,
        active_context: r.active_context,
        assistant_name: r.assistant_name,
        domain: r.domain,
        journey_week: r.journey_week,
        emotional_tone: r.emotional_tone,
        metadata: r.metadata,
        created_at: r.created_at
      })),
      search_time_ms: searchTime
    };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[PgVector] Conversation memory search error (${errorTime}ms):`, error.message);
    return {
      success: false,
      error: error.message,
      search_time_ms: errorTime
    };
  }
}

async function getConversationState(userPhone) {
  try {
    await ensureTables();

    const results = await sequelize.query(
      `SELECT * FROM conversation_states WHERE user_phone = $1`,
      { bind: [userPhone], type: QueryTypes.SELECT }
    );

    if (results.length > 0) {
      return { success: true, state: results[0] };
    }

    const [newState] = await sequelize.query(`
      INSERT INTO conversation_states (user_phone, state, created_at, updated_at, last_interaction_at)
      VALUES ($1, 'ENTRY', NOW(), NOW(), NOW())
      RETURNING *
    `, {
      bind: [userPhone],
      type: QueryTypes.SELECT
    });

    return { success: true, state: newState };
  } catch (error) {
    console.error('[PgVector] Get conversation state error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function updateConversationState(userPhone, updates) {
  try {
    await ensureTables();

    const allowedFields = [
      'state', 'user_id', 'active_context', 'active_child_id', 'assistant_name',
      'journey_week', 'quiz_session_id', 'buffer_messages', 'buffer_started_at',
      'audio_preference', 'correlation_id', 'metadata'
    ];

    let setClauses = ['updated_at = NOW()', 'last_interaction_at = NOW()'];
    let bindParams = [userPhone];
    let paramIndex = 2;

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (field === 'metadata') {
          setClauses.push(`${field} = $${paramIndex}::jsonb`);
          bindParams.push(JSON.stringify(updates[field]));
        } else if (field === 'buffer_messages') {
          setClauses.push(`${field} = $${paramIndex}::text[]`);
          bindParams.push(updates[field]);
        } else {
          setClauses.push(`${field} = $${paramIndex}`);
          bindParams.push(updates[field]);
        }
        paramIndex++;
      }
    }

    const results = await sequelize.query(`
      UPDATE conversation_states SET ${setClauses.join(', ')} WHERE user_phone = $1 RETURNING *
    `, {
      bind: bindParams,
      type: QueryTypes.SELECT
    });

    if (results.length === 0) {
      return await getConversationState(userPhone);
    }

    return { success: true, state: results[0] };
  } catch (error) {
    console.error('[PgVector] Update conversation state error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function saveFeedback(data) {
  try {
    await ensureTables();

    const [result] = await sequelize.query(`
      INSERT INTO ux_feedback (user_phone, user_id, score, state, active_context, assistant_name, journey_week, comment, metadata, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING id
    `, {
      bind: [
        data.user_phone,
        data.user_id || null,
        data.score,
        data.state || null,
        data.active_context || null,
        data.assistant_name || null,
        data.journey_week || null,
        data.comment || null,
        JSON.stringify(data.metadata || {})
      ],
      type: QueryTypes.SELECT
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('[PgVector] Save feedback error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function saveReport(data) {
  try {
    await ensureTables();

    const [result] = await sequelize.query(`
      INSERT INTO support_reports (user_phone, user_id, type, content, state, active_context, assistant_name, status, metadata, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'open', $8, NOW(), NOW())
      RETURNING id
    `, {
      bind: [
        data.user_phone,
        data.user_id || null,
        data.type || 'problem',
        data.content,
        data.state || null,
        data.active_context || null,
        data.assistant_name || null,
        JSON.stringify(data.metadata || {})
      ],
      type: QueryTypes.SELECT
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('[PgVector] Save report error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function getReports(filters = {}) {
  try {
    await ensureTables();

    let whereConditions = [];
    let bindParams = [];
    let paramIndex = 1;

    if (filters.user_phone) {
      whereConditions.push(`user_phone = $${paramIndex}`);
      bindParams.push(filters.user_phone);
      paramIndex++;
    }

    if (filters.type) {
      whereConditions.push(`type = $${paramIndex}`);
      bindParams.push(filters.type);
      paramIndex++;
    }

    if (filters.status) {
      whereConditions.push(`status = $${paramIndex}`);
      bindParams.push(filters.status);
      paramIndex++;
    }

    let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    bindParams.push(limit, offset);

    const results = await sequelize.query(`
      SELECT * FROM support_reports ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, {
      bind: bindParams,
      type: QueryTypes.SELECT
    });

    return { success: true, reports: results };
  } catch (error) {
    console.error('[PgVector] Get reports error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  ensureTables,
  upsertDocument,
  batchUpsert,
  search,
  deleteDocument,
  getCollectionStats,
  scrollDocuments,
  isConfigured,
  saveConversationMemory,
  searchConversationMemory,
  getConversationState,
  updateConversationState,
  saveFeedback,
  saveReport,
  getReports,
  COLLECTION_NAME,
  VECTOR_SIZE
};
