# RAG Educare - Documentação Técnica

## Fase 1: Relatório de Análise (09/12/2025)

### 1. Mapa da Estrutura do Projeto

```
educare-backend/src/
├── config/           # Configurações (database, auth, swagger)
├── controllers/      # 24 controllers (MVC pattern)
├── middlewares/      # auth.js (JWT), apiKey.js, subscription.js
├── models/           # 27 modelos Sequelize
├── routes/           # 26 arquivos de rotas
├── services/         # openaiService, stripeService, webhookHandlers
├── database/         # migrations e seeders
└── server.js         # Entry point Express
```

### 2. Padrões Identificados

| Aspecto | Padrão Atual |
|---------|--------------|
| **ORM** | Sequelize com PostgreSQL |
| **Naming** | snake_case para DB, camelCase para JS |
| **Auth** | JWT com roles: user, professional, admin, owner |
| **API** | RESTful com prefixo `/api/` |
| **Middleware Super Admin** | `isOwner` em `middlewares/auth.js` |
| **Services** | Módulos simples em `src/services/` |

### 3. Integração com PostgreSQL

- **Biblioteca**: Sequelize ORM
- **Conexão**: `src/config/database.js` via variáveis de ambiente
- **Migrations**: Padrão Sequelize em `src/database/migrations/`
- **Modelos**: Definidos individualmente, exportados via `models/index.js`

### 4. Tabelas Existentes (84 total)

Tabelas relevantes para RAG:
- `users` - Usuários com roles
- `children` - Dados das crianças
- `journey_bot_questions` - Perguntas do bot
- `journey_bot_responses` - Respostas dos usuários
- `journey_bot_sessions` - Sessões do bot

**Não existe** nenhuma tabela `knowledge_documents`, `rag_*` ou `prompt_*`.

### 5. OpenAI Service Existente

Arquivo: `src/services/openaiService.js`
- Usa `gpt-4o-mini`
- Já tem prompt do TitiNauta definido
- Funções: `chat()`, `generateFeedback()`, `analyzeProgress()`

### 6. Recomendação de Arquitetura RAG

```
src/services/
├── openaiService.js       # Existente - manter
├── fileSearchService.js   # NOVO - integração File Search
└── ragService.js          # NOVO - orquestração RAG

src/models/
├── KnowledgeDocument.js   # NOVO - metadados documentos
└── PromptTemplate.js      # NOVO - prompts versionados (Fase 7)

src/controllers/
└── ragController.js       # NOVO - endpoints RAG

src/routes/
├── adminKnowledgeRoutes.js # NOVO - /admin/knowledge/*
└── ragRoutes.js            # NOVO - /rag/*
```

### 7. Decisão: RAG no Backend (não no n8n)

**Recomendação**: Implementar RAG totalmente no backend porque:
- Melhor manutenção e versionamento
- Performance superior (menos hops)
- Segurança centralizada
- n8n apenas consome via endpoint REST `/rag/ask`

### 8. Plano de Execução

| Fase | Escopo | Status |
|------|--------|--------|
| 1 | Análise | ✅ Completo |
| 2 | knowledge_documents + fileSearchService + upload | 🔄 Iniciando |
| 3 | ragService + /rag/ask | Pendente |
| 4 | Personalização bebê | Pendente |
| 5 | Integração n8n | Pendente |
| 6 | Frontend Super Admin | Pendente |
| 7 | Prompt Templates | Pendente |
| 8 | Refinamento | Pendente |
| 9 | QA e Testes | Pendente |

---

## Fase 2: Implementação Base

### Tabela: knowledge_documents

```sql
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL, -- 'educare', 'oms', 'bncc', 'outro'
  file_search_id TEXT,       -- ID do File Search (OpenAI ou Gemini)
  file_path TEXT,            -- Caminho do arquivo no storage
  tags TEXT[],               -- ['0-3m', 'motor', 'sensorial']
  age_range TEXT,            -- '0-3m', '4-6m', 'gestante'
  domain TEXT,               -- 'motor', 'cognitivo', 'social', 'sensorial'
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Endpoint: POST /admin/knowledge/upload

- **Auth**: JWT + isOwner (Super Admin only)
- **Body**: multipart/form-data
- **Campos**: file, title, description, source_type, age_range, domain, tags

### Service: fileSearchService

Responsável por:
- Upload de documentos para OpenAI Assistants File Search
- Retorno do file_id para referência
- Deleção de documentos quando necessário
