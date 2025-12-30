# Hybrid RAG Architecture

## Overview

The Educare+ platform uses a hybrid RAG (Retrieval-Augmented Generation) system that combines multiple providers for optimal document processing and retrieval. This document describes the architecture, ingestion flow, and configuration.

## Architecture Components

### 1. RAG Providers

| Provider | Role | Timeout |
|----------|------|---------|
| **Gemini** | OCR processing for images and PDFs | 120 seconds |
| **Qdrant** | Vector embeddings storage | 30 seconds per chunk |
| **OpenAI** | File Search fallback | Standard API timeout |

### 2. Ingestion Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DOCUMENT UPLOAD                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  1. FILE VALIDATION                                                      │
│     - Check file type (PDF, TXT, PNG, JPG, DOC, DOCX, etc.)             │
│     - Check file size (max 50MB)                                         │
│     - Validate required fields (title, source_type)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. SAVE DOCUMENT (IMMEDIATE RESPONSE - 201)                             │
│     - Save file to disk                                                  │
│     - Create database record with status: "pending"                      │
│     - Return document ID to frontend                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌──────────────────────────────┐   ┌──────────────────────────────────────┐
│  FRONTEND POLLING            │   │  BACKGROUND INGESTION                 │
│  GET /api/admin/knowledge/   │   │  (Async - does not block response)   │
│      {id}/status             │   │                                       │
│  Every 2 seconds             │   │  3. OCR PROCESSING (Gemini)          │
│                              │   │     - Extract text from images/PDFs   │
│  Status values:              │   │     - Timeout: 120 seconds            │
│  - pending                   │   │                                       │
│  - processing                │   │  4. CHUNKING                          │
│  - completed                 │   │     - Split text into chunks          │
│  - failed                    │   │     - Apply overlap strategy          │
│                              │   │                                       │
└──────────────────────────────┘   │  5. EMBEDDING (Qdrant)                │
                                   │     - Generate embeddings              │
                                   │     - Timeout: 30s per chunk          │
                                   │                                       │
                                   │  6. INDEXING                          │
                                   │     - Store in vector database         │
                                   │     - Update document metadata         │
                                   │                                       │
                                   │  7. UPDATE STATUS                     │
                                   │     - Set status: "completed"          │
                                   │     - Or status: "failed" with error   │
                                   └──────────────────────────────────────┘
```

## Ingestion Status Flow

```
pending → processing → completed
              ↓
            failed
```

### Status Definitions

| Status | Description |
|--------|-------------|
| `pending` | Document saved, waiting to start processing |
| `processing` | OCR and embedding in progress |
| `completed` | Successfully indexed in RAG providers |
| `failed` | Error during processing (check `ingestion_error`) |

## API Endpoints

### Upload Document
```
POST /api/admin/knowledge/upload
Content-Type: multipart/form-data

Fields:
- file: File (required)
- title: string (required)
- source_type: string (required)
- knowledge_category: string (required)
- description: string (optional)
- age_range: string (optional)
- domain: string (optional)
- tags: string (optional, comma-separated)

Response (201):
{
  "success": true,
  "message": "Documento salvo com sucesso. Indexação em andamento.",
  "data": {
    "id": "uuid",
    "title": "Document Title",
    "ingestion_status": "pending",
    "category": "baby"
  }
}
```

### Check Ingestion Status
```
GET /api/admin/knowledge/{id}/status
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Document Title",
    "ingestion_status": "processing",
    "rag_providers": [],
    "gemini_file_id": null,
    "qdrant_document_id": null,
    "ingestion_started_at": "2024-12-14T10:00:00.000Z",
    "ingestion_completed_at": null,
    "ingestion_time_ms": null,
    "ingestion_error": null
  }
}
```

## Timeout Configuration

| Operation | Timeout | Location |
|-----------|---------|----------|
| Gemini OCR | 120 seconds | `hybridIngestionService.js` |
| Gemini Embedding | 30 seconds per chunk | `hybridIngestionService.js` |
| Total Ingestion | 600 seconds | `hybridIngestionService.js` |
| Frontend Polling | 2 seconds interval | `KnowledgeBaseManagement.tsx` |

## Frontend Polling Mechanism

The frontend implements a polling mechanism to track ingestion progress:

1. After successful upload (201 response), start polling
2. Poll `GET /api/admin/knowledge/{id}/status` every 2 seconds
3. Update UI with current step (uploading → saving → processing → indexing → completed)
4. Stop polling when status is `completed` or `failed`
5. Show success/error toast and refresh document list

## Frontend-Backend Communication

The frontend (port 5000) communicates with the backend (port 3001) via a Vite proxy configured in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    },
  },
},
```

This ensures all API requests from the frontend are correctly routed to the backend.

## Troubleshooting

### Upload stuck on first stage ("Enviando arquivo...")
- Ensure Vite proxy is configured in `vite.config.ts`
- Verify backend is running on port 3001
- Check browser console for network errors
- Verify authentication token is valid

### Document stays in "processing" state
- Check backend logs for errors
- Verify Gemini/Qdrant API keys are configured
- Check for timeout errors (large files may exceed limits)

### Document fails with timeout error
- Reduce file size (max 50MB)
- For large PDFs, consider splitting into smaller documents
- Check network connectivity to API providers

### No RAG providers available
- Verify environment variables:
  - `GEMINI_API_KEY`
  - `QDRANT_URL`
  - `QDRANT_API_KEY`
  - `OPENAI_API_KEY`
- Check `hybridIngestionService.getActiveProviders()` output

## Knowledge Categories

| Category | Description | Target KB |
|----------|-------------|-----------|
| `baby` | Baby development (0-24 months) | `kb_baby` |
| `mother` | Maternal health | `kb_mother` |
| `professional` | Professional/specialist content | `kb_professional` |

## File Types Supported

- PDF (text and scanned)
- TXT (plain text)
- DOC/DOCX (Microsoft Word)
- PNG, JPG, JPEG, WEBP (images with OCR)
- CSV, JSON, MD (structured data)

## Security Considerations

- All endpoints require JWT authentication
- Owner role required for document management
- Files are validated for type and size before processing
- API keys are stored as environment secrets

---

# Vector Store Storage Locations

## Current Implementation: Qdrant Cloud

### Storage Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    QDRANT CLOUD                              │
│                   (Remote Vector DB)                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Collection: kb_baby                                 │   │
│  │  - Embeddings for 0-24 month baby development       │   │
│  │  - Dimension: 768 (text-embedding-004)              │   │
│  │  - Size: Scalable (grows with documents)            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Collection: kb_mother                               │   │
│  │  - Embeddings for maternal health topics            │   │
│  │  - Dimension: 768 (text-embedding-004)              │   │
│  │  - Size: Scalable (grows with documents)            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Collection: kb_professional                         │   │
│  │  - Embeddings for healthcare professional content   │   │
│  │  - Dimension: 768 (text-embedding-004)              │   │
│  │  - Size: Scalable (grows with documents)            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
         ▲                                      ▲
         │                                      │
    UPSERT VECTORS                        SIMILARITY SEARCH
   (During Ingestion)                    (During RAG Query)
         │                                      │
┌────────┴──────────────────────────────────────┴─────────────┐
│                   BACKEND (ragService.js)                    │
│                                                              │
│  • hybridIngestionService.js (upload & index)               │
│  • ragQueryService.js (semantic search)                     │
│  • Qdrant client initialization in llmProviderRegistry.js   │
└──────────────────────────────────────────────────────────────┘
```

### Qdrant Configuration

**Environment Variables:**
```bash
QDRANT_URL=https://your-cluster.qdrant.io:6333
QDRANT_API_KEY=<your-api-key>
```

**Connection Details:**
- **Host**: `your-cluster.qdrant.io:6333` (Qdrant Cloud endpoint)
- **Authentication**: API key-based
- **Protocol**: HTTPS (secure connection)
- **Collections**: 3 segmented (kb_baby, kb_mother, kb_professional)
- **Embedding Model**: Google Gemini `text-embedding-004` (768 dimensions)
- **Vector Metric**: Cosine similarity

**Qdrant Client Usage in Code:**

```javascript
// In llmProviderRegistry.js
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// Upload vectors during ingestion
await qdrantClient.upsert("kb_baby", {
  points: vectors.map((v, i) => ({
    id: generateId(),
    vector: v.embedding,
    payload: {
      chunk_index: i,
      document_id: doc.id,
      chunk_text: v.text,
      metadata: { ... }
    }
  }))
});

// Search vectors during RAG query
const results = await qdrantClient.search("kb_baby", {
  vector: queryEmbedding,
  limit: 5,
  score_threshold: 0.5
});
```

### Data Flow

```
Document Upload
    │
    ▼
Gemini OCR (extract text from images)
    │
    ▼
Text Chunking (intelligent segmentation)
    │
    ▼
Google Gemini Embedding (text-embedding-004)
    │
    ▼
Qdrant Upsert (store vectors with metadata)
    │
    ▼
Document indexed ✅

User Query
    │
    ▼
Google Gemini Embedding (embed user query)
    │
    ▼
Qdrant Similarity Search (find relevant chunks)
    │
    ▼
OpenAI LLM (generate response with context)
    │
    ▼
Response to User ✅
```

---

# Migration Guide: Alternative Vector Stores

## Overview

This guide provides step-by-step instructions to migrate from Qdrant Cloud to alternative vector database solutions. Choose the option that best fits your infrastructure needs.

## Option 1: PostgreSQL with pgvector Extension

### When to Use
- You want a single database for both relational and vector data
- You prefer integrated backup and replication
- You use PostgreSQL already for your main application
- Your scale is < 1M embeddings

### Step 1: Install pgvector Extension

```bash
# Connect to your PostgreSQL database
psql -U postgres -d educare_db

# Create extension
CREATE EXTENSION IF NOT EXISTS vector;

# Verify installation
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### Step 2: Create Vector Tables

```sql
-- Table for kb_baby vectors
CREATE TABLE kb_baby_vectors (
  id SERIAL PRIMARY KEY,
  document_id UUID NOT NULL,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (document_id) REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  UNIQUE(document_id, chunk_index)
);

-- Table for kb_mother vectors
CREATE TABLE kb_mother_vectors (
  id SERIAL PRIMARY KEY,
  document_id UUID NOT NULL,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (document_id) REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  UNIQUE(document_id, chunk_index)
);

-- Table for kb_professional vectors
CREATE TABLE kb_professional_vectors (
  id SERIAL PRIMARY KEY,
  document_id UUID NOT NULL,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (document_id) REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  UNIQUE(document_id, chunk_index)
);

-- Create indexes for similarity search (HNSW for better performance)
CREATE INDEX ON kb_baby_vectors USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON kb_mother_vectors USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON kb_professional_vectors USING hnsw (embedding vector_cosine_ops);

-- Create indexes for metadata search
CREATE INDEX ON kb_baby_vectors USING gin (metadata);
CREATE INDEX ON kb_mother_vectors USING gin (metadata);
CREATE INDEX ON kb_professional_vectors USING gin (metadata);
```

### Step 3: Update Backend Configuration

**Create new file: `src/services/vectorStores/pgvectorStore.js`**

```javascript
const { Client } = require('pg');
const cosineDistance = require('ml-distance').cosine;

class PgVectorStore {
  constructor() {
    this.client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  async upsertVectors(kbType, vectors) {
    const tableName = `${kbType}_vectors`;
    
    for (const vector of vectors) {
      const query = `
        INSERT INTO ${tableName} 
        (document_id, chunk_index, chunk_text, embedding, metadata)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (document_id, chunk_index) 
        DO UPDATE SET 
          chunk_text = EXCLUDED.chunk_text,
          embedding = EXCLUDED.embedding,
          metadata = EXCLUDED.metadata
      `;
      
      await this.client.query(query, [
        vector.documentId,
        vector.chunkIndex,
        vector.chunkText,
        JSON.stringify(vector.embedding),
        JSON.stringify(vector.metadata)
      ]);
    }
  }

  async searchVectors(kbType, queryEmbedding, limit = 5, threshold = 0.5) {
    const tableName = `${kbType}_vectors`;
    
    const query = `
      SELECT 
        id,
        document_id,
        chunk_index,
        chunk_text,
        metadata,
        1 - (embedding <=> $1::vector) as similarity
      FROM ${tableName}
      WHERE 1 - (embedding <=> $1::vector) > $2
      ORDER BY similarity DESC
      LIMIT $3
    `;
    
    const result = await this.client.query(query, [
      JSON.stringify(queryEmbedding),
      threshold,
      limit
    ]);
    
    return result.rows;
  }

  async deleteDocumentVectors(kbType, documentId) {
    const tableName = `${kbType}_vectors`;
    const query = `DELETE FROM ${tableName} WHERE document_id = $1`;
    await this.client.query(query, [documentId]);
  }
}

module.exports = PgVectorStore;
```

### Step 4: Update hybridIngestionService.js

```javascript
// Replace Qdrant client with pgvector
const PgVectorStore = require('./vectorStores/pgvectorStore');

class HybridIngestionService {
  constructor() {
    this.vectorStore = new PgVectorStore();
  }

  async initialize() {
    await this.vectorStore.connect();
  }

  async ingestDocument(doc, embeddings) {
    // Determine KB type
    const kbType = doc.knowledge_category; // 'baby', 'mother', or 'professional'
    
    // Store vectors
    await this.vectorStore.upsertVectors(kbType, embeddings);
    
    // Update document status
    doc.ingestion_status = 'completed';
    await doc.save();
  }
}
```

### Step 5: Update ragQueryService.js

```javascript
// Replace Qdrant search with pgvector
async function queryVectorStore(kbType, queryEmbedding) {
  const results = await vectorStore.searchVectors(
    kbType,
    queryEmbedding,
    5, // limit
    0.5 // threshold
  );

  return results.map(r => ({
    content: r.chunk_text,
    similarity: r.similarity,
    metadata: r.metadata
  }));
}
```

### Advantages
✅ Single database for all data  
✅ Native transaction support  
✅ Integrated backup/restore  
✅ No additional infrastructure  

### Disadvantages
❌ Slower for very large datasets (>1M embeddings)  
❌ Limited to PostgreSQL (vendor lock-in)  
❌ Performance degrades with scale  

---

## Option 2: Redis with Redis Stack

### When to Use
- You want fast, in-memory vector storage
- You already use Redis for caching
- Your scale is small to medium (< 500K embeddings)
- You need low-latency search

### Step 1: Install Redis Stack

```bash
# Docker installation (recommended)
docker run -d \
  -p 6379:6379 \
  redis/redis-stack:latest

# Or install directly on Ubuntu/Debian
curl https://packages.redis.io/gpg | apt-key add -
echo "deb https://packages.redis.io/deb $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/redis.list
apt-get update && apt-get install redis-stack-server
```

### Step 2: Create Vector Indexes

```bash
# Connect to Redis
redis-cli

# Create index for kb_baby
FT.CREATE idx:kb_baby ON HASH PREFIX 1 "doc:baby:" SCHEMA chunk_text TEXT embedding VECTOR COSINE 768

# Create index for kb_mother
FT.CREATE idx:kb_mother ON HASH PREFIX 1 "doc:mother:" SCHEMA chunk_text TEXT embedding VECTOR COSINE 768

# Create index for kb_professional
FT.CREATE idx:kb_professional ON HASH PREFIX 1 "doc:prof:" SCHEMA chunk_text TEXT embedding VECTOR COSINE 768
```

### Step 3: Create Redis Vector Store Client

**File: `src/services/vectorStores/redisVectorStore.js`**

```javascript
const redis = require('redis');
const { createClient } = redis;

class RedisVectorStore {
  constructor() {
    this.client = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async upsertVectors(kbType, vectors) {
    const prefix = this.getPrefix(kbType);
    
    for (const vector of vectors) {
      const key = `${prefix}:${vector.documentId}:${vector.chunkIndex}`;
      
      await this.client.hSet(key, {
        chunk_text: vector.chunkText,
        embedding: JSON.stringify(vector.embedding),
        metadata: JSON.stringify(vector.metadata),
        document_id: vector.documentId,
        chunk_index: vector.chunkIndex
      });
      
      // Set expiration (optional)
      await this.client.expire(key, 86400 * 365); // 1 year
    }
  }

  async searchVectors(kbType, queryEmbedding, limit = 5, threshold = 0.5) {
    const indexName = `idx:${kbType}`;
    
    const query = `*=>[KNN ${limit} @embedding $vector]`;
    
    const results = await this.client.ft.search(indexName, query, {
      PARAMS: {
        vector: Buffer.from(new Float32Array(queryEmbedding).buffer)
      }
    });
    
    return results.documents.map(doc => ({
      content: doc.chunk_text,
      metadata: JSON.parse(doc.metadata),
      similarity: doc.score
    }));
  }

  async deleteDocumentVectors(kbType, documentId) {
    const prefix = this.getPrefix(kbType);
    const pattern = `${prefix}:${documentId}:*`;
    
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  getPrefix(kbType) {
    const prefixes = {
      baby: 'doc:baby',
      mother: 'doc:mother',
      professional: 'doc:prof'
    };
    return prefixes[kbType];
  }
}

module.exports = RedisVectorStore;
```

### Step 4: Configuration in Environment

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

### Advantages
✅ Very fast (in-memory)  
✅ Built-in caching layer  
✅ Simple to set up  
✅ Good for real-time applications  

### Disadvantages
❌ Data loss on restart (without persistence)  
❌ Limited to available RAM  
❌ Not ideal for very large datasets  
❌ Complex cluster setup for HA  

---

## Option 3: Weaviate (Self-Hosted Vector DB)

### When to Use
- You want a dedicated vector database
- You need enterprise features (schema, RBAC)
- Your scale is medium to large (100K - 10M+ embeddings)
- You want GraphQL interface

### Step 1: Deploy Weaviate

```bash
# Using Docker Compose
curl https://raw.githubusercontent.com/weaviate/weaviate/master/docker-compose.yml > docker-compose.yml

# Update image to latest stable
# docker-compose.yml -> weaviate:latest

docker-compose up -d

# Verify
curl http://localhost:8080/v1/.well-known/ready
```

### Step 2: Create Collections/Classes

```graphql
mutation {
  schemaCreate(
    definition: {
      class: "KbBaby"
      description: "Baby development embeddings"
      vectorizer: "text2vec-openai"
      properties: [
        {
          name: "chunkText"
          dataType: ["text"]
        }
        {
          name: "documentId"
          dataType: ["string"]
        }
        {
          name: "chunkIndex"
          dataType: ["int"]
        }
        {
          name: "metadata"
          dataType: ["object"]
        }
      ]
    }
  ) {
    class
  }
}
```

### Step 3: Weaviate Vector Store Client

**File: `src/services/vectorStores/weaviateVectorStore.js`**

```javascript
const weaviate = require('weaviate-client');

class WeaviateVectorStore {
  constructor() {
    this.client = weaviate.client({
      host: process.env.WEAVIATE_HOST || 'localhost',
      port: process.env.WEAVIATE_PORT || 8080,
      isSecure: false
    });
  }

  async upsertVectors(kbType, vectors) {
    const className = this.getClassName(kbType);
    
    for (const vector of vectors) {
      await this.client.data.creator()
        .withClassName(className)
        .withProperties({
          chunkText: vector.chunkText,
          documentId: vector.documentId,
          chunkIndex: vector.chunkIndex,
          metadata: vector.metadata
        })
        .withVector(vector.embedding)
        .do();
    }
  }

  async searchVectors(kbType, queryEmbedding, limit = 5) {
    const className = this.getClassName(kbType);
    
    const result = await this.client.graphql.get()
      .withClassName(className)
      .withLimit(limit)
      .withNearVector({
        vector: queryEmbedding
      })
      .withFields(['chunkText', 'documentId', 'metadata', '_additional { distance }'])
      .do();
    
    return result.data.Get[className].map(item => ({
      content: item.chunkText,
      metadata: item.metadata,
      similarity: 1 - item._additional.distance
    }));
  }

  getClassName(kbType) {
    const classNames = {
      baby: 'KbBaby',
      mother: 'KbMother',
      professional: 'KbProfessional'
    };
    return classNames[kbType];
  }
}

module.exports = WeaviateVectorStore;
```

### Advantages
✅ Dedicated vector database  
✅ Excellent performance at scale  
✅ Enterprise features  
✅ GraphQL + REST APIs  

### Disadvantages
❌ Additional infrastructure  
❌ Learning curve  
❌ More operational overhead  

---

## Option 4: Milvus (Open Source Vector DB)

### When to Use
- You want a fully open-source solution
- Your scale is large (1M+ embeddings)
- You need distributed vector search
- You want FAISS-level performance

### Quick Setup

```bash
# Docker installation
docker run -d --name milvus -p 19530:19530 -p 9091:9091 \
  milvusdb/milvus:latest

# Create collection
python -c "
from pymilvus import Collection, FieldSchema, CollectionSchema, DataType, connections

connections.connect('default', host='localhost', port=19530)

fields = [
  FieldSchema('id', DataType.INT64, is_primary=True),
  FieldSchema('embedding', DataType.FLOAT_VECTOR, dim=768),
  FieldSchema('document_id', DataType.VARCHAR, max_length=36),
  FieldSchema('chunk_text', DataType.VARCHAR, max_length=5000),
]

schema = CollectionSchema(fields, 'kb_baby')
Collection('kb_baby', schema=schema)
"
```

### JavaScript Client

```javascript
const { MilvusClient } = require('@zilliztech/milvus2-sdk-node');

class MilvusVectorStore {
  constructor() {
    this.client = new MilvusClient({
      address: process.env.MILVUS_HOST || 'localhost:19530'
    });
  }

  async upsertVectors(kbType, vectors) {
    const collectionName = `kb_${kbType}`;
    
    const data = vectors.map((v, i) => ({
      id: i,
      embedding: v.embedding,
      document_id: v.documentId,
      chunk_text: v.chunkText
    }));
    
    await this.client.upsert({
      collection_name: collectionName,
      fields_data: data
    });
  }

  async searchVectors(kbType, queryEmbedding, limit = 5) {
    const collectionName = `kb_${kbType}`;
    
    const results = await this.client.search({
      collection_name: collectionName,
      vectors: [queryEmbedding],
      search_params: {
        anns_field: 'embedding',
        metric_type: 'IP',
        params: { nprobe: 10 }
      },
      limit: limit,
      output_fields: ['document_id', 'chunk_text']
    });
    
    return results[0].results.map(r => ({
      content: r.entity.chunk_text,
      metadata: { documentId: r.entity.document_id },
      similarity: r.distance
    }));
  }
}

module.exports = MilvusVectorStore;
```

### Advantages
✅ Fully open-source  
✅ Excellent performance  
✅ Distributed/scalable  
✅ FAISS integration  

### Disadvantages
❌ Operational complexity  
❌ Smaller community than Qdrant  
❌ Setup overhead  

---

## Comparison Table

| Feature | Qdrant | pgvector | Redis | Weaviate | Milvus |
|---------|--------|----------|-------|----------|--------|
| **Scale** | 1B+ | 10M | 500K | 100M+ | 1B+ |
| **Latency** | Low | Medium | Very Low | Low | Low |
| **Setup** | Cloud | Easy | Easy | Medium | Hard |
| **Cost** | Paid | Low | Low | Self-hosted | Free |
| **Enterprise** | Yes | No | Yes* | Yes | No |
| **Learning Curve** | Low | Low | Low | Medium | Medium |

---

## Migration Checklist

- [ ] Backup current Qdrant data (export collections)
- [ ] Choose target vector store
- [ ] Set up new infrastructure
- [ ] Create vector tables/collections
- [ ] Update environment variables
- [ ] Implement new vector store client
- [ ] Update ingestion service
- [ ] Update query service
- [ ] Run data migration script
- [ ] Test with sample queries
- [ ] Run full integration tests
- [ ] Switch DNS/routing to new system
- [ ] Monitor performance
- [ ] Clean up old infrastructure

---

## Support & Further Reading

- **Qdrant**: https://qdrant.tech/documentation/
- **pgvector**: https://github.com/pgvector/pgvector
- **Redis Stack**: https://redis.io/docs/stack/
- **Weaviate**: https://weaviate.io/developers/weaviate
- **Milvus**: https://milvus.io/docs
