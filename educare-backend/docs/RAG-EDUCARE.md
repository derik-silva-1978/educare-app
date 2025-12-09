# RAG Educare - Documentação Técnica

## Status Geral (09/12/2025)

| Fase | Escopo | Status |
|------|--------|--------|
| 1 | Análise | ✅ Completo |
| 2 | knowledge_documents + fileSearchService + upload | ✅ Completo |
| 3 | ragService + /rag/ask | ✅ Completo |
| 4 | Personalização bebê (babyContextService) | ✅ Completo |
| 5 | Integração n8n | Pendente |
| 6 | Frontend Super Admin | Pendente |
| 7 | Prompt Templates | Pendente |
| 8 | Refinamento | Pendente |
| 9 | QA e Testes | Pendente |

---

## Arquitetura Implementada

```
educare-backend/src/
├── models/
│   └── KnowledgeDocument.js    # ✅ Modelo de documentos de conhecimento
├── services/
│   ├── fileSearchService.js    # ✅ Integração OpenAI File Search
│   ├── babyContextService.js   # ✅ NEW - Contexto personalizado do bebê
│   └── ragService.js           # ✅ Orquestração RAG com personalização
├── controllers/
│   ├── knowledgeController.js  # ✅ CRUD de documentos (Super Admin)
│   └── ragController.js        # ✅ Endpoints de consulta RAG
└── routes/
    ├── adminKnowledgeRoutes.js # ✅ /api/admin/knowledge/*
    └── ragRoutes.js            # ✅ /api/rag/*
```

---

## Fase 4: Personalização com Dados do Bebê

### Novo Serviço: babyContextService.js

O serviço recupera e formata o contexto completo do bebê para personalização das respostas do RAG.

#### Dados Recuperados:
- **Dados básicos**: nome, data de nascimento, idade (dias/semanas/meses), gênero
- **Marcos de desenvolvimento**: atingidos, pendentes, atrasados (via JourneyBotResponse)
- **Resumo de quizzes**: sessões, scores, domínios fortes/fracos
- **Trilha Educare**: etapa atual baseada na idade
- **Cuidador**: nome e relação (pai/mãe/responsável)

#### Funções Disponíveis:
```javascript
const { 
  getBabyContext,        // Recupera contexto completo do bebê
  calculateAge,          // Calcula idade a partir da data de nascimento
  getMilestones,         // Busca marcos de desenvolvimento
  getQuizSummary,        // Resumo das sessões de quiz
  getEducareTrack,       // Determina etapa Educare pela idade
  formatContextForPrompt // Formata contexto para o prompt LLM
} = require('./babyContextService');
```

### Novo Método: ragService.askWithBabyId()

```javascript
// Consulta RAG com contexto automático do bebê
const result = await ragService.askWithBabyId(question, babyId, {
  domain: 'motor',           // opcional
  tags: ['desenvolvimento'], // opcional
  use_file_search: true      // default: true
});
```

O método automaticamente:
1. Busca o contexto completo do bebê via `babyContextService`
2. Infere a faixa etária para filtrar documentos
3. Formata o contexto no prompt para personalização
4. Retorna resposta personalizada

---

## Endpoints Disponíveis

### Gestão de Conhecimento (Super Admin Only)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/admin/knowledge/upload` | Upload de documento |
| GET | `/api/admin/knowledge` | Listar documentos |
| GET | `/api/admin/knowledge/:id` | Obter documento |
| PUT | `/api/admin/knowledge/:id` | Atualizar documento |
| DELETE | `/api/admin/knowledge/:id` | Deletar documento |
| PATCH | `/api/admin/knowledge/:id/toggle-active` | Ativar/desativar |

### Consulta RAG

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/rag/health` | Público | Status do RAG |
| POST | `/api/rag/ask` | JWT | Consulta completa com personalização |
| POST | `/api/rag/ask-simple` | JWT | Consulta simplificada |
| GET | `/api/rag/documents` | JWT | Listar documentos ativos |
| POST | `/api/rag/external/ask` | API Key | Consulta via n8n |
| POST | `/api/rag/external/ask-simple` | API Key | Consulta simples via n8n |

---

## Uso do Endpoint /rag/ask (Fase 4)

### Request com Personalização

```json
POST /api/rag/external/ask?api_key=sua_api_key
Content-Type: application/json

{
  "question": "Quais são os marcos de desenvolvimento de um bebê de 3 meses?",
  "baby_id": "uuid-da-crianca",
  "child_id": "uuid-da-crianca",
  "age_range": "0-3m",
  "domain": "motor",
  "tags": ["desenvolvimento", "marcos"],
  "use_file_search": true
}
```

**Nota**: `baby_id` e `child_id` são equivalentes. Use qualquer um.

### Response Personalizada

```json
{
  "success": true,
  "answer": "Olá! Para o pequeno João, que está com 3 meses, os principais marcos...",
  "metadata": {
    "documents_found": 3,
    "documents_used": [
      {"id": "uuid", "title": "Guia OMS", "source_type": "oms"}
    ],
    "file_search_used": true,
    "chunks_retrieved": 2,
    "model": "gpt-4o-mini",
    "usage": {"total_tokens": 500},
    "processing_time_ms": 4500
  }
}
```

---

## Estrutura do Contexto do Bebê

```javascript
{
  baby_id: "uuid",
  name: "João",
  gender: "M",
  birth_date: "2025-09-01",
  age_days: 100,
  age_weeks: 14,
  age_months: 3,
  age_formatted: "3 meses",
  special_needs: null,
  observations: "Prematuro 2 semanas",
  
  milestones: {
    achieved: [
      { domain: "motor", question: "Sustenta a cabeça...", age_range: "0-3m" }
    ],
    pending: [
      { domain: "social", question: "Sorri em resposta...", age_range: "0-3m" }
    ],
    delayed: [],
    total_responses: 15,
    domains_evaluated: ["motor", "social", "sensorial"],
    domain_counts: { motor: 5, social: 4, sensorial: 6 }
  },
  
  quiz_summary: {
    total_sessions: 3,
    strongest_domain: "sensorial",
    weakest_domain: "motor",
    last_score: 8.5,
    last_session_date: "2025-12-08"
  },
  
  educare_track: {
    current_stage: "Recém-nascido (0-3m)",
    age_range: "0-3m",
    recommended_domains: ["sensorial", "motor", "social"]
  },
  
  caregiver: {
    name: "Maria Silva",
    relationship: "mae"
  }
}
```

---

## Prompt LLM Personalizado (Fase 4)

O prompt enviado ao LLM agora inclui:

```
SYSTEM:
Você é TitiNauta, a assistente oficial do Educare App...

REGRAS DE SEGURANÇA EDUCARE:
- Nunca crie diagnósticos...
- Sempre ofereça orientações práticas...

REGRAS RAG:
- Use exclusivamente os trechos recuperados...

CONTEXTO DO BEBÊ:
- Nome: João
- Idade: 3 meses
- Gênero: Masculino
- Etapa Educare: Recém-nascido (0-3m)
- Domínios prioritários: sensorial, motor, social
- Marcos atingidos recentes: motor, sensorial
- Áreas que precisam de atenção: social

DOCUMENTOS DE REFERÊNCIA (FILE SEARCH):
[Trecho 1]: ...conteúdo do documento...

INSTRUÇÕES:
- Personalize a resposta para a criança acima.
- Use os trechos fornecidos como base.
- Aplique o tom acolhedor Educare.

QUESTION: Quais são os marcos de desenvolvimento...
```

---

## Tabela: knowledge_documents

```sql
CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  source_type VARCHAR(50) NOT NULL,
  file_search_id VARCHAR(255),
  file_path VARCHAR(500),
  original_filename VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  tags TEXT[],
  age_range VARCHAR(50),
  domain VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Faixas Etárias e Etapas Educare

| Código | Faixa | Etapa Educare |
|--------|-------|---------------|
| 0-3m | 0 a 3 meses | Recém-nascido |
| 4-6m | 4 a 6 meses | Explorador Inicial |
| 7-9m | 7 a 9 meses | Descobridor |
| 10-12m | 10 a 12 meses | Aventureiro |
| 13-18m | 13 a 18 meses | Explorador Avançado |
| 19-24m | 19 a 24 meses | Pequeno Comunicador |
| 2-3a | 2 a 3 anos | Construtor de Mundo |
| 3-4a | 3 a 4 anos | Pensador Criativo |
| 4-5a | 4 a 5 anos | Preparador Escolar |
| 5-6a | 5 a 6 anos | Pré-escolar Avançado |

---

## Domínios de Desenvolvimento

- `motor` - Desenvolvimento motor (grosso e fino)
- `cognitivo` - Desenvolvimento cognitivo
- `social` - Desenvolvimento social e emocional
- `sensorial` - Desenvolvimento sensorial
- `linguagem` - Desenvolvimento da linguagem
- `adaptativo` - Habilidades adaptativas

---

## Variáveis de Ambiente

```env
OPENAI_API_KEY=sk-...           # Obrigatório para RAG
KNOWLEDGE_UPLOAD_PATH=./uploads/knowledge  # Pasta de uploads
EXTERNAL_API_KEY=...            # API Key para endpoints externos
```

---

## Próximos Passos

### Fase 5: Integração n8n
- Endpoint `/api/rag/external/ask` pronto para uso
- Documentar formato de mensagem para WhatsApp
- Atualizar blueprint n8n v2

### Fase 6: Frontend Super Admin
- Interface para upload de documentos
- Visualização e gerenciamento da base de conhecimento

### Fase 7: Prompt Templates
- Criar tabela `prompt_templates` com versionamento
- Permitir edição de prompts via Super Admin
