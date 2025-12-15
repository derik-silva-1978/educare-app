# Arquitetura RAG Completa - Educare+

**Última Atualização:** Dezembro 2025  
**Status:** Produção

---

## 1. VISÃO GERAL

O sistema RAG (Retrieval-Augmented Generation) do Educare+ utiliza uma arquitetura **híbrida** com múltiplos provedores para garantir respostas precisas e contextualizadas sobre desenvolvimento infantil e saúde materna.

### 1.1 Componentes Principais

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA RAG HÍBRIDA EDUCARE+                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐ │
│  │  Frontend   │    │  n8n/       │    │      Backend API            │ │
│  │  TitiNauta  │───▶│  WhatsApp   │───▶│      (Express.js)           │ │
│  └─────────────┘    └─────────────┘    └──────────────┬──────────────┘ │
│                                                        │                │
│                                                        ▼                │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                    HYBRID INGESTION SERVICE                         ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  ││
│  │  │ Gemini OCR   │  │ Gemini       │  │ OpenAI File Search       │  ││
│  │  │ (Extração)   │  │ Embeddings   │  │ (Indexação)              │  ││
│  │  │ 2.5-flash    │  │ text-004     │  │ gpt-4o-mini              │  ││
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                    │                                    │
│                  ┌─────────────────┼─────────────────┐                  │
│                  ▼                 ▼                 ▼                  │
│         ┌────────────┐    ┌────────────────┐    ┌──────────────────┐   │
│         │  QDRANT    │    │   PostgreSQL   │    │  OpenAI Files    │   │
│         │  Cloud     │    │   (Metadata)   │    │  (Assistants)    │   │
│         │  Vetorial  │    │   knowledge_*  │    │  File Search     │   │
│         └────────────┘    └────────────────┘    └──────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. ARMAZENAMENTO VETORIAL - QDRANT CLOUD

### 2.1 Configuração

| Parâmetro | Valor |
|-----------|-------|
| **Provedor** | Qdrant Cloud |
| **URL** | Configurado via secret `QDRANT_URL` |
| **API Key** | Configurado via secret `QDRANT_API_KEY` |
| **Collection** | `educare_knowledge` |
| **Dimensão dos Vetores** | 768 (Gemini text-embedding-004) |
| **Métrica de Distância** | Cosine Similarity |
| **Score Threshold** | 0.5 (padrão) |

### 2.2 Índices Criados

```javascript
// Índices para filtragem eficiente
- knowledge_category (keyword) → baby, mother, professional
- source_type (keyword) → article, protocol, guideline, etc.
- domain (keyword) → motor, cognitivo, linguagem, etc.
```

### 2.3 Estrutura do Payload

Cada ponto (chunk) no Qdrant contém:

```json
{
  "id": "uuid_chunk_0",
  "vector": [0.123, 0.456, ...],  // 768 dimensões
  "payload": {
    "title": "Nome do Documento",
    "description": "Descrição opcional",
    "source_type": "article",
    "knowledge_category": "baby",
    "age_range": "0-12",
    "domain": "motor",
    "file_path": "/uploads/document.pdf",
    "gemini_file_id": "gemini-file-id",
    "chunk_index": 0,
    "parent_document_id": "uuid-parent",
    "content_preview": "Primeiros 500 caracteres...",
    "created_at": "2025-12-15T00:00:00.000Z"
  }
}
```

---

## 3. PROCESSO DE INGESTÃO

### 3.1 Fluxo de Upload

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Upload     │────▶│  Gemini OCR  │────▶│   Chunking   │────▶│  Embedding   │
│   PDF/Image  │     │  2.5-flash   │     │  1000 chars  │     │  text-004    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                       │
                     ┌──────────────┐     ┌──────────────┐             │
                     │   OpenAI     │◀────│   Qdrant     │◀────────────┘
                     │  File Search │     │   Upsert     │
                     └──────────────┘     └──────────────┘
```

### 3.2 Timeouts Configurados

| Operação | Timeout | Descrição |
|----------|---------|-----------|
| **OCR Gemini** | 120 segundos | Extração de texto de PDFs/imagens |
| **Embedding Gemini** | 30 segundos | Por chunk de texto |
| **Ingestão Total** | 600 segundos | Limite total por upload |

### 3.3 Chunking

- **Tamanho máximo**: 1000 caracteres por chunk
- **Overlap**: 200 caracteres (20%)
- **Divisão inteligente**: Prioriza quebras em pontos finais ou quebras de linha
- **Mínimo**: Chunks < 50 caracteres são descartados

---

## 4. COMO VERIFICAR A BASE DE DADOS

### 4.1 Via API REST

#### Verificar Status do Sistema RAG

```bash
# Health Check Básico
curl -X GET http://localhost:3001/api/rag/health

# Status Híbrido (Qdrant + Gemini)
curl -X GET http://localhost:3001/api/rag/hybrid/status \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta esperada:**
```json
{
  "success": true,
  "providers": {
    "gemini": { "enabled": true, "configured": true },
    "qdrant": { 
      "enabled": true, 
      "configured": true,
      "stats": {
        "collection_name": "educare_knowledge",
        "vectors_count": 150,
        "points_count": 150,
        "status": "green"
      }
    }
  }
}
```

### 4.2 Via Qdrant Dashboard

1. Acesse o Qdrant Cloud Dashboard usando sua `QDRANT_URL`
2. Navegue até Collections → `educare_knowledge`
3. Visualize:
   - **Vectors Count**: Número total de chunks indexados
   - **Points Count**: Número de documentos/chunks
   - **Status**: `green` = saudável

### 4.3 Via Logs do Backend

```bash
# Procurar logs de ingestão bem-sucedida
grep -i "qdrant.*sucesso\|qdrant.*chunk" educare-backend/logs/*.log
```

---

## 5. COMO TESTAR O RAG

### 5.1 Teste de Query Simples

```bash
# Teste via TitiNauta
curl -X POST http://localhost:3001/api/rag/ask \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Quais são os marcos de desenvolvimento aos 6 meses?",
    "module_type": "baby"
  }'
```

### 5.2 Teste Híbrido (Qdrant + Gemini)

```bash
curl -X POST http://localhost:3001/api/rag/hybrid/query \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Como estimular o desenvolvimento motor do bebê?",
    "knowledge_category": "baby",
    "limit": 5
  }'
```

### 5.3 Teste via Frontend

1. Login como Owner: `owner@educareapp.com` / `abc123`
2. Acesse TitiNauta via `/educare-app/titinauta`
3. Faça perguntas relacionadas ao conteúdo ingerido
4. Verifique se as respostas usam o contexto dos documentos

---

## 6. CUSTOS E ESTIMATIVAS

### 6.1 Provedores e Preços (Dezembro 2025)

| Provedor | Operação | Custo Estimado |
|----------|----------|----------------|
| **Gemini** | OCR (2.5-flash) | ~$0.0001/página |
| **Gemini** | Embedding (text-004) | ~$0.00001/1K tokens |
| **OpenAI** | GPT-4o-mini | ~$0.00015/1K input tokens |
| **OpenAI** | GPT-4o-mini | ~$0.0006/1K output tokens |
| **OpenAI** | File Search | ~$0.10/GB/dia de storage |
| **Qdrant** | Cloud Free Tier | 1GB grátis |

### 6.2 Estimativa por Documento

Para um PDF de 10 páginas (~5000 palavras):

| Etapa | Custo Estimado |
|-------|----------------|
| OCR Gemini | ~$0.001 |
| Embeddings (5 chunks) | ~$0.0005 |
| Qdrant Storage | Grátis (Free Tier) |
| **Total Ingestão** | **~$0.0015** |

### 6.3 Estimativa por Query RAG

| Etapa | Custo Estimado |
|-------|----------------|
| Embedding da Query | ~$0.00001 |
| Busca Qdrant | Grátis |
| GPT-4o-mini (resposta) | ~$0.001 |
| **Total Query** | **~$0.001** |

### 6.4 Monitoramento de Custos

O sistema não rastreia custos automaticamente, mas você pode:

1. **OpenAI Dashboard**: https://platform.openai.com/usage
2. **Google AI Studio**: https://aistudio.google.com/ (uso de Gemini)
3. **Qdrant Cloud Dashboard**: Uso de storage

---

## 7. MÉTRICAS E MONITORAMENTO

### 7.1 Endpoint de Métricas

```bash
# Métricas agregadas
curl -X GET http://localhost:3001/api/rag/metrics \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 7.2 Métricas Disponíveis

```json
{
  "total_queries": 1234,
  "avg_response_time_ms": 850,
  "knowledge_base_usage": {
    "kb_baby": 500,
    "kb_mother": 300,
    "kb_professional": 200,
    "knowledge_documents": 234
  },
  "fallback_count": 50,
  "error_count": 12,
  "file_search_success_rate": 95
}
```

### 7.3 Estatísticas por Módulo

```json
{
  "moduleStats": {
    "baby": {
      "queries": 500,
      "empty_results": 25,
      "avg_score": 0.78,
      "strict_mode_queries": 100
    },
    "mother": { ... },
    "professional": { ... }
  }
}
```

---

## 8. BASES DE CONHECIMENTO SEGMENTADAS

### 8.1 Categorias

| Categoria | Tabela | Audiência | Conteúdo |
|-----------|--------|-----------|----------|
| `baby` | kb_baby | Pais/TitiNauta | Desenvolvimento infantil, marcos, atividades |
| `mother` | kb_mother | Mães/Gestantes | Saúde materna, gestação, pós-parto |
| `professional` | kb_professional | Profissionais | Protocolos, avaliações técnicas, PEI |

### 8.2 Seleção Automática

O `KnowledgeBaseSelector` determina automaticamente qual base usar baseado em:

- `module_type` da requisição
- `user_role` do usuário logado
- `route_context` da página atual
- Fallback para `knowledge_documents` (legado) se necessário

---

## 9. ARQUIVOS DO SISTEMA RAG

### 9.1 Backend - Services

```
educare-backend/src/services/
├── ragService.js              # Serviço principal RAG
├── qdrantService.js           # Cliente Qdrant
├── hybridIngestionService.js  # Ingestão híbrida
├── geminiFileSearchService.js # Integração Gemini
├── ragMetricsService.js       # Métricas
├── ragFeedbackService.js      # Sistema de feedback
├── rerankingService.js        # Re-ranking neural
├── confidenceService.js       # Scores de confiança
└── contextSafetyService.js    # Validação de contexto
```

### 9.2 Backend - Controllers

```
educare-backend/src/controllers/
├── ragController.js           # Endpoints RAG
└── hybridRagController.js     # Endpoints híbridos
```

### 9.3 Backend - Routes

```
educare-backend/src/routes/
└── ragRoutes.js               # Rotas RAG
```

---

## 10. ENDPOINTS RAG

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| GET | `/api/rag/health` | Nenhuma | Health check básico |
| POST | `/api/rag/ask` | JWT Token | Query RAG completa |
| POST | `/api/rag/ask-simple` | JWT Token | Query simplificada |
| GET | `/api/rag/documents` | JWT Token | Lista documentos |
| POST | `/api/rag/hybrid/query` | JWT Token | Query híbrida |
| GET | `/api/rag/hybrid/status` | JWT Token | Status dos provedores |
| GET | `/api/rag/hybrid/health` | Nenhuma | Health check híbrido |
| POST | `/api/rag/external/ask` | API Key | Query externa (n8n/WhatsApp) |
| POST | `/api/rag/external/ask-simple` | API Key | Query simples externa |
| POST | `/api/rag/external/ask-multimodal` | API Key | Query com imagens |
| POST | `/api/rag/external/hybrid/query` | API Key | Query híbrida externa |

---

## 11. TROUBLESHOOTING

### 11.1 Upload Travado

**Sintoma**: Upload fica travado na primeira etapa  
**Solução**: Verificar proxy Vite em `vite.config.ts`:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

### 11.2 Qdrant Não Conecta

**Sintoma**: Erros de conexão com Qdrant  
**Solução**: Verificar secrets `QDRANT_URL` e `QDRANT_API_KEY`

### 11.3 OCR Timeout

**Sintoma**: Timeout ao processar PDF grande  
**Solução**: 
- Dividir PDFs grandes em partes menores
- Timeout atual: 120 segundos

### 11.4 Embeddings Falham

**Sintoma**: Erro ao gerar embeddings  
**Solução**: Verificar secret `GEMINI_API_KEY`

---

## 12. VARIÁVEIS DE AMBIENTE

### 12.1 Obrigatórias (Secrets)

| Variável | Descrição |
|----------|-----------|
| `OPENAI_API_KEY` | API Key OpenAI para LLM e File Search |
| `GEMINI_API_KEY` | API Key Google para OCR e Embeddings |
| `QDRANT_URL` | URL do cluster Qdrant Cloud |
| `QDRANT_API_KEY` | API Key Qdrant |

### 12.2 Configuração (Env Vars)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `ENABLE_GEMINI_RAG` | `true` | Habilita provider Gemini |
| `ENABLE_QDRANT_RAG` | `true` | Habilita provider Qdrant |
| `RAG_PRIMARY_PROVIDER` | `gemini` | Provider primário para buscas |

---

## 13. PRÓXIMOS PASSOS

### 13.1 Recomendados

1. **Implementar tracking de custos**: Adicionar contagem de tokens por requisição
2. **Dashboard de custos**: Painel visual com gastos por período
3. **Otimização de chunks**: Ajustar tamanho baseado em performance
4. **Cache de embeddings**: Evitar re-processamento de queries frequentes

### 13.2 Melhorias Futuras

1. **Múltiplos modelos de embedding**: Suporte a modelos alternativos
2. **Streaming de respostas**: Respostas em tempo real
3. **Feedback loop**: Melhoria contínua baseada em feedback dos usuários
