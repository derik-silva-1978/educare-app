# Arquitetura do Sistema RAG Híbrido

## Visão Geral

O Educare+ utiliza uma arquitetura de RAG (Retrieval-Augmented Generation) híbrida que combina múltiplos provedores para maximizar a qualidade das respostas e a robustez do sistema.

## Provedores Suportados

### 1. Gemini (Google AI)
- **Função**: OCR e extração de texto de documentos
- **Embedding**: Modelo `text-embedding-004` (768 dimensões)
- **Configuração**: `ENABLE_GEMINI_RAG=true`
- **Secrets**: `GEMINI_API_KEY`

### 2. Qdrant (Vector Database)
- **Função**: Armazenamento e busca vetorial
- **Coleção**: `educare_knowledge`
- **Índices**: `knowledge_category`, `source_type`, `domain`
- **Configuração**: `ENABLE_QDRANT_RAG=true`
- **Secrets**: `QDRANT_URL`, `QDRANT_API_KEY`

### 3. OpenAI File Search (Fallback)
- **Função**: Backup quando Gemini/Qdrant não disponíveis
- **Configuração**: Ativado automaticamente se outros provedores falharem
- **Secrets**: `OPENAI_API_KEY`

## Fluxo de Ingestão

```
Documento Upload
      │
      ▼
┌─────────────────┐
│  hybridIngestion│
│    Service      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│Gemini │ │Qdrant │
│ OCR   │ │Vectors│
└───────┘ └───────┘
```

1. **Recebimento**: Arquivo enviado via `POST /api/knowledge/upload`
2. **OCR/Extração**: Gemini extrai texto de PDFs/imagens
3. **Chunking**: Texto dividido em segmentos de ~1000 caracteres
4. **Embedding**: Gemini gera embeddings para cada chunk
5. **Indexação**: Chunks inseridos no Qdrant com metadados

## Fluxo de Query

```
Query do Usuário
      │
      ▼
┌─────────────────┐
│  hybridRag      │
│    Service      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│Qdrant │ │Gemini │
│Search │ │Context│
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         ▼
   ┌───────────┐
   │   Fusão   │
   │  RRF/Score│
   └─────┬─────┘
         ▼
   Resposta Final
```

1. **Query**: Recebida via `POST /api/hybrid-rag/query`
2. **Embedding**: Query convertida em vetor
3. **Busca Paralela**: Qdrant + Gemini buscam contextos
4. **Fusão RRF**: Resultados combinados por Reciprocal Rank Fusion
5. **Resposta**: Contexto enriquecido retornado ao TitiNauta

## Endpoints

### Públicos (requer autenticação JWT)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/hybrid-rag/health` | Status dos provedores |
| GET | `/api/hybrid-rag/status` | Estatísticas detalhadas |
| POST | `/api/hybrid-rag/query` | Busca híbrida |
| POST | `/api/hybrid-rag/ingest` | Ingestão manual |

### Internos (requer role owner/admin)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/rag/hybrid/health` | Health check interno |
| GET | `/api/rag/hybrid/status` | Status interno |
| POST | `/api/rag/hybrid/query` | Query interno |

### Externos (requer API Key)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/rag/external/hybrid/query` | Query via n8n/WhatsApp |

## Variáveis de Ambiente

```env
# Controle de provedores
ENABLE_GEMINI_RAG=true
ENABLE_QDRANT_RAG=true
RAG_PRIMARY_PROVIDER=gemini

# Gemini
GEMINI_API_KEY=your_key

# Qdrant
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_key

# OpenAI (fallback)
OPENAI_API_KEY=your_key
```

## Timeouts Configurados

| Operação | Timeout | Arquivo |
|----------|---------|---------|
| Gemini OCR | 120s | `hybridIngestionService.js` |
| Gemini Embedding | 30s | `hybridIngestionService.js` |
| Total Ingestão | 600s | `hybridIngestionService.js` |
| Query Qdrant | 30s | `qdrantService.js` |

## Arquivos Principais

```
educare-backend/src/
├── services/
│   ├── hybridIngestionService.js  # Ingestão multi-provedor
│   ├── hybridRagService.js        # Query híbrida
│   ├── qdrantService.js           # Client Qdrant
│   ├── geminiFileSearchService.js # Client Gemini
│   └── fileSearchService.js       # Client OpenAI (fallback)
├── controllers/
│   ├── hybridRagController.js     # Controller de query
│   └── knowledgeController.js     # Upload/delete docs
└── routes/
    ├── hybridRagRoutes.js         # Rotas públicas
    └── ragRoutes.js               # Rotas internas
```

## Categorias de Conhecimento

O sistema segmenta documentos em três knowledge bases:

- **baby**: Desenvolvimento infantil (0-312 semanas)
- **mother**: Saúde materna e gestação
- **professional**: Protocolos e guidelines médicos

## Métricas e Monitoramento

O endpoint `/api/hybrid-rag/status` retorna:

```json
{
  "success": true,
  "data": {
    "gemini": {
      "configured": true,
      "enabled": true,
      "stats": { "files_count": 42 }
    },
    "qdrant": {
      "configured": true,
      "enabled": true,
      "stats": {
        "vectors_count": 1250,
        "points_count": 1250,
        "status": "green"
      }
    }
  }
}
```

## Tratamento de Erros

- **Timeout de ingestão**: Retorna erro HTTP 504 com detalhes
- **Provedor indisponível**: Sistema continua com provedores restantes
- **Todos falharam**: Fallback para OpenAI File Search
- **Sem provedores**: Documento salvo localmente (sem indexação)
