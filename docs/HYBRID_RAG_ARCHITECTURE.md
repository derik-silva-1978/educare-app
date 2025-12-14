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
