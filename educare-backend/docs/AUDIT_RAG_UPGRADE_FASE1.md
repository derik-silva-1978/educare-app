# RELATÓRIO DE AUDITORIA — FASE 1-UPGRADE
## Segmentação da Base de Conhecimento Educare+

**Data:** Dezembro 2025  
**Status:** ✅ Auditoria Completa (Nenhuma Alteração Realizada)

---

## 1. MAPA DAS DEPENDÊNCIAS ATUAIS DO RAG

### 1.1 Arquivos Envolvidos

| Arquivo | Função | Criticidade |
|---------|--------|-------------|
| `services/ragService.js` | Core do RAG - consulta, prompt building, LLM | 🔴 ALTA |
| `services/babyContextService.js` | Contexto personalizado do bebê | 🟡 MÉDIA |
| `services/fileSearchService.js` | Upload/delete de arquivos no OpenAI | 🟡 MÉDIA |
| `controllers/ragController.js` | Endpoints `/rag/ask`, `/rag/ask-simple` | 🔴 ALTA |
| `controllers/knowledgeController.js` | Upload de documentos Super Admin | 🟡 MÉDIA |
| `models/KnowledgeDocument.js` | Modelo Sequelize da tabela vetorial | 🔴 ALTA |
| `routes/ragRoutes.js` | Definição de rotas RAG | 🔴 ALTA |
| `routes/adminKnowledgeRoutes.js` | Rotas de ingestão Super Admin | 🟡 MÉDIA |

### 1.2 Funções Centrais

| Serviço | Função | Descrição |
|---------|--------|-----------|
| `ragService` | `selectKnowledgeDocuments()` | Seleciona docs da tabela `knowledge_documents` |
| `ragService` | `retrieveFromFileSearch()` | Busca semântica via OpenAI File Search |
| `ragService` | `buildLLMPrompt()` | Monta prompt com contexto + docs |
| `ragService` | `callLLM()` | Chama OpenAI GPT-4o-mini |
| `ragService` | `ask()` | Pipeline completo RAG |
| `ragService` | `askWithBabyId()` | RAG com contexto personalizado do bebê |
| `babyContextService` | `getBabyContext()` | Obtém contexto completo do bebê |
| `babyContextService` | `formatContextForPrompt()` | Formata contexto para o prompt |
| `fileSearchService` | `uploadDocumentToFileSearch()` | Envia arquivo para OpenAI |

### 1.3 Fluxos Críticos

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO RAG ATUAL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Request → ragController.ask()                               │
│       ↓                                                         │
│  2. ragService.askWithBabyId(question, babyId)                  │
│       ↓                                                         │
│  3. babyContextService.getBabyContext(babyId)                   │
│       ↓                                                         │
│  4. ragService.selectKnowledgeDocuments(filters)                │
│       ↓ (consulta knowledge_documents)                          │
│  5. ragService.retrieveFromFileSearch(question, fileSearchIds)  │
│       ↓ (OpenAI Assistants API)                                 │
│  6. ragService.buildLLMPrompt(question, chunks, context)        │
│       ↓                                                         │
│  7. ragService.callLLM(systemPrompt, userMessage)               │
│       ↓                                                         │
│  8. Response → {answer, metadata}                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Módulos que Consomem a Base Vetorial

| Módulo | Forma de Consumo | Observação |
|--------|------------------|------------|
| TitiNauta (Chat) | Via `/rag/ask` | Consulta principal |
| n8n Workflow | Via `/rag/external/ask` | API Key auth |
| WhatsApp Bot | Via n8n → API externa | Indireto |
| Super Admin | Upload apenas | Não consulta |

---

## 2. PONTO EXATO ONDE O RAG CONSULTA A BASE ATUAL

### 2.1 Tabela Atual

| Campo | Valor |
|-------|-------|
| **Nome da Tabela** | `knowledge_documents` |
| **Modelo Sequelize** | `KnowledgeDocument` |
| **Arquivo** | `models/KnowledgeDocument.js` |
| **Schema** | Ver abaixo |

### 2.2 Schema da Tabela `knowledge_documents`

```javascript
{
  id: UUID (PK),
  title: TEXT (NOT NULL),
  description: TEXT,
  source_type: STRING(50) ['educare', 'oms', 'bncc', 'ministerio_saude', 'outro'],
  file_search_id: STRING(255),      // ID do arquivo no OpenAI
  file_path: STRING(500),           // Caminho local
  original_filename: STRING(255),
  file_size: INTEGER,
  mime_type: STRING(100),
  tags: ARRAY(TEXT),
  age_range: STRING(50),            // Faixa etária: "0-3m", "4-6m", etc.
  domain: STRING(50),               // Domínio: "motor", "cognitivo", etc.
  is_active: BOOLEAN (default: true),
  created_by: UUID,
  metadata: JSONB,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### 2.3 Função Responsável pela Busca

```javascript
// Arquivo: services/ragService.js, linha 46-90
async function selectKnowledgeDocuments(filters = {}) {
  const where = { is_active: true };
  
  if (filters.age_range) where.age_range = filters.age_range;
  if (filters.domain) where.domain = filters.domain;
  if (filters.tags) where.tags = { [Op.overlap]: filters.tags };
  if (filters.source_type) where.source_type = filters.source_type;
  
  const documents = await KnowledgeDocument.findAll({
    where,
    attributes: ['id', 'title', 'file_search_id', 'tags', 'age_range', 'domain', 'source_type'],
    order: [['created_at', 'DESC']],
    limit: filters.limit || 10
  });
  
  return { success: true, data: documents, count: documents.length };
}
```

**Observação Importante:** A busca vetorial real acontece via OpenAI File Search, não diretamente no PostgreSQL. O PostgreSQL armazena metadados e `file_search_id`, que são usados para filtrar quais documentos enviar para o OpenAI.

---

## 3. PONTO EXATO ONDE ACONTECE A INGESTÃO

### 3.1 Serviço Principal

| Campo | Valor |
|-------|-------|
| **Controller** | `knowledgeController.uploadDocument()` |
| **Arquivo** | `controllers/knowledgeController.js` |
| **Rota** | `POST /api/admin/knowledge/upload` |
| **Autenticação** | JWT + `isOwner` (Super Admin only) |

### 3.2 Fluxo de Ingestão Atual

```
┌─────────────────────────────────────────────────────────────────┐
│                  FLUXO DE INGESTÃO ATUAL                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Super Admin → POST /admin/knowledge/upload                  │
│       ↓                                                         │
│  2. Multer processa arquivo (max 50MB)                          │
│       ↓                                                         │
│  3. Validações:                                                 │
│       - MIME type permitido (PDF, PNG, JPG, TXT, DOC)           │
│       - Campos obrigatórios (title, source_type)                │
│       ↓                                                         │
│  4. fileSearchService.uploadDocumentToFileSearch()              │
│       ↓ (envia para OpenAI, retorna file_search_id)             │
│  5. KnowledgeDocument.create({...})                             │
│       ↓ (salva metadados no PostgreSQL)                         │
│  6. Response → {document, file_search_status}                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Validações Existentes

- ✅ Tipo de arquivo (PDF, PNG, JPG, TXT, DOC, DOCX)
- ✅ Tamanho máximo (50MB)
- ✅ Campos obrigatórios (title, source_type)
- ✅ Autenticação Super Admin
- ✅ Log de quem fez upload (created_by)

### 3.4 Pontos que Serão Expandidos

| Ponto | Expansão Necessária |
|-------|---------------------|
| Payload do upload | Adicionar `knowledge_category` (baby/mother/professional) |
| Após salvar em `knowledge_documents` | Também salvar na tabela segmentada correspondente |
| Logs | Indicar em qual base foi salvo |

---

## 4. AVALIAÇÃO DOS RISCOS TÉCNICOS

### 4.1 Possíveis Regressões

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebrar endpoint `/rag/ask` | Baixa | 🔴 ALTO | Não alterar assinatura |
| Quebrar ingestão Super Admin | Baixa | 🟡 MÉDIO | Campo `knowledge_category` opcional |
| Quebrar n8n workflow | Baixa | 🔴 ALTO | Manter `/rag/external/ask` idêntico |
| Performance degradada | Média | 🟡 MÉDIO | Bases menores = mais rápido |
| Dados inconsistentes | Média | 🟡 MÉDIO | Ingestão dupla (legado + segmentada) |

### 4.2 Partes Sensíveis

1. **ragService.selectKnowledgeDocuments()** - Ponto de seleção da base
2. **ragService.ask()** - Pipeline principal
3. **ragRoutes.js** - Rotas consumidas externamente
4. **KnowledgeDocument model** - Schema da tabela legado

### 4.3 Módulos que Precisam de Compatibilidade Total

| Módulo | Motivo |
|--------|--------|
| **n8n Workflow** | Integração externa via API Key |
| **WhatsApp Bot** | Depende do n8n |
| **TitiNauta Chat** | Interface principal do app |
| **Super Admin** | Upload de documentos |

### 4.4 Impacto no Prompt Builder

- **Impacto:** Mínimo
- A função `buildLLMPrompt()` não precisa ser alterada
- Apenas a ORIGEM dos chunks muda (qual tabela)
- O formato do prompt permanece o mesmo

### 4.5 Impacto no Fluxo do Aplicativo

| Módulo App | Impacto | Observação |
|------------|---------|------------|
| Meu Bebê | Nenhum (transparente) | RAG retorna respostas mais precisas |
| Minha Saúde | Nenhum (transparente) | RAG retorna respostas mais precisas |
| Profissional | Nenhum (transparente) | RAG retorna respostas mais precisas |

---

## 5. RECOMENDAÇÃO DOS CAMINHOS MAIS SEGUROS

### ABORDAGEM A: Adicionar Segmentação Sem Alterar Tabela Antiga (✅ RECOMENDADA)

**Descrição:** Criar 3 novas tabelas (`kb_baby`, `kb_mother`, `kb_professional`) e implementar ingestão dupla. A tabela `knowledge_documents` continua funcionando como fallback.

| Aspecto | Avaliação |
|---------|-----------|
| **Vantagens** | Zero risco de regressão; rollback instantâneo; migração gradual |
| **Riscos** | Dados duplicados temporariamente; mais espaço em disco |
| **Impacto no Código** | Aditivo apenas; nenhum código existente é alterado |
| **Complexidade** | 🟢 Baixa |

### ABORDAGEM B: Criar 3 Novas Tabelas e Substituir Gradualmente

**Descrição:** Criar novas tabelas e migrar documentos existentes. Após migração completa, parar de alimentar a tabela antiga.

| Aspecto | Avaliação |
|---------|-----------|
| **Vantagens** | Menos duplicação a longo prazo |
| **Riscos** | Período de transição mais arriscado |
| **Impacto no Código** | Médio; precisa de script de migração |
| **Complexidade** | 🟡 Média |

### ABORDAGEM C: Migrar Tudo de Uma Vez (❌ NÃO RECOMENDADA)

**Descrição:** Criar novas tabelas, migrar todos os documentos, desligar tabela antiga.

| Aspecto | Avaliação |
|---------|-----------|
| **Vantagens** | Solução final mais limpa |
| **Riscos** | Alto risco de regressão; sem fallback |
| **Impacto no Código** | Alto; muitas alterações simultâneas |
| **Complexidade** | 🔴 Alta |

---

## 6. PLANO PRELIMINAR DE MIGRAÇÃO (ALTO NÍVEL)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FASES DO UPGRADE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FASE 1-UPGRADE ✅ (Atual)                                       │
│  └── Auditoria e mapeamento                                     │
│                                                                 │
│  FASE 2-UPGRADE                                                 │
│  └── Definição formal da arquitetura                            │
│       - Schema das novas tabelas                                │
│       - Especificação do KnowledgeBaseSelector                  │
│       - Fluxo de ingestão segmentada                            │
│                                                                 │
│  FASE 3-UPGRADE                                                 │
│  └── Criação das tabelas e camada de acesso                     │
│       - Migrations: kb_baby, kb_mother, kb_professional         │
│       - Models/Repositories novos                               │
│       - RAG NÃO É ALTERADO                                      │
│                                                                 │
│  FASE 4-UPGRADE                                                 │
│  └── Integração da ingestão segmentada                          │
│       - Campo knowledge_category no upload                      │
│       - Ingestão dupla (legado + nova base)                     │
│       - RAG continua usando base legado                         │
│                                                                 │
│  FASE 5-UPGRADE                                                 │
│  └── Adaptação do RAG com fallback                              │
│       - KnowledgeBaseSelector implementado                      │
│       - RAG consulta bases segmentadas                          │
│       - Fallback para base legado                               │
│       - Feature flag ENABLE_SEGMENTED_KB                        │
│                                                                 │
│  FASE 6-UPGRADE                                                 │
│  └── Ajuste fino e ranking                                      │
│       - Ranking por módulo                                      │
│       - Métricas e observabilidade                              │
│       - Flags de controle por módulo                            │
│                                                                 │
│  FASE 7-UPGRADE                                                 │
│  └── Migração assistida da base legado                          │
│       - Script de migração em batches                           │
│       - Classificação assistida por LLM                         │
│       - Tabela de auditoria kb_migration_audit                  │
│       - NENHUMA exclusão da base legado                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. CHECKLIST DE SEGURANÇA

| Verificação | Status |
|-------------|--------|
| Nenhuma tabela foi alterada | ✅ |
| Nenhum código foi modificado | ✅ |
| Nenhuma rota foi alterada | ✅ |
| Nenhuma migration foi executada | ✅ |
| RAG continua funcionando normalmente | ✅ |
| n8n continua operando | ✅ |
| Frontend/App inalterados | ✅ |

---

## 8. PROMPT MANAGEMENT LAYER (Objetivo 2.3)

### 8.1 Componentes de Prompt

| Arquivo | Função | Descrição |
|---------|--------|-----------|
| `ragService.js` | `DEFAULT_SYSTEM_PROMPT` | Prompt padrão TitiNauta (linhas 17-44) |
| `ragService.js` | `buildLLMPrompt()` | Monta prompt dinâmico com contexto |
| `openaiService.js` | `TITINAUTA_SYSTEM_PROMPT` | Prompt alternativo para chat direto |
| `babyContextService.js` | `formatContextForPrompt()` | Formata contexto do bebê |

### 8.2 Estrutura Atual do Prompt

```
┌─────────────────────────────────────────────────────────────────┐
│                  ESTRUTURA DO PROMPT RAG                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SYSTEM PROMPT (DEFAULT_SYSTEM_PROMPT)                          │
│  ├── Instruções de comportamento TitiNauta                      │
│  ├── Regras de segurança Educare                                │
│  ├── Regras RAG (uso de trechos)                                │
│  └── Formatação (parágrafos, listas, emojis)                    │
│                                                                 │
│  + CONTEXTO DA CRIANÇA (se babyId fornecido)                    │
│  ├── Nome, idade, gênero                                        │
│  ├── Necessidades especiais                                     │
│  ├── Etapa Educare                                              │
│  ├── Marcos atingidos/pendentes                                 │
│  └── Cuidador                                                   │
│                                                                 │
│  + DOCUMENTOS DE REFERÊNCIA (File Search chunks)                │
│  ├── [Trecho 1]: conteúdo                                       │
│  ├── [Trecho 2]: conteúdo                                       │
│  └── Instruções de personalização                               │
│                                                                 │
│  + USER MESSAGE (pergunta do usuário)                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Impacto da Segmentação no Prompt

| Componente | Impacto | Ação Necessária |
|------------|---------|-----------------|
| SYSTEM PROMPT | Nenhum | Não alterar |
| Contexto da Criança | Nenhum | Não alterar |
| Documentos de Referência | **Muda origem** | Chunks virão da base segmentada |
| Instruções de personalização | Opcional | Pode adaptar por módulo futuramente |

**Conclusão:** O Prompt Builder permanece **100% compatível** com a segmentação. Apenas a origem dos chunks muda (kb_baby/kb_mother/kb_professional vs knowledge_documents).

---

## 9. FRONTEND SUPER ADMIN (Objetivo 2.5)

### 9.1 Situação Atual

| Componente | Status | Arquivo |
|------------|--------|---------|
| Tela de Materiais | ⚠️ Mock Data | `src/pages/admin/AdminMaterials.tsx` |
| Integração API Upload | ❌ Não implementada | - |
| Seletor de Categoria | ❌ Não existe | - |

### 9.2 Payload Atual do Backend (API)

```json
POST /api/admin/knowledge/upload
Content-Type: multipart/form-data

{
  "file": "<arquivo>",
  "title": "Título do documento",
  "description": "Descrição opcional",
  "source_type": "educare | oms | bncc | ministerio_saude | outro",
  "age_range": "0-3m | 4-6m | 7-9m | ...",
  "domain": "motor | cognitivo | social | ...",
  "tags": "tag1, tag2, tag3"
}
```

### 9.3 Payload Expandido (Para Fase 4)

```json
POST /api/admin/knowledge/upload
Content-Type: multipart/form-data

{
  "file": "<arquivo>",
  "title": "Título do documento",
  "description": "Descrição opcional",
  "source_type": "educare | oms | bncc | ministerio_saude | outro",
  "knowledge_category": "baby | mother | professional",  // NOVO CAMPO
  "age_range": "0-3m | 4-6m | 7-9m | ...",
  "domain": "motor | cognitivo | social | ...",
  "tags": "tag1, tag2, tag3"
}
```

### 9.4 Ações Necessárias no Frontend (Fase 6-UPGRADE)

1. Integrar `AdminMaterials.tsx` com API real
2. Adicionar dropdown "Categoria do Conhecimento" (Bebê / Mãe / Profissional)
3. Filtros por categoria na listagem
4. Indicador visual de qual base o documento foi salvo

**Observação:** O frontend **NÃO será alterado** nas Fases 1-5. Alterações no Super Admin ocorrerão apenas na Fase 6-UPGRADE.

---

## 10. INTEGRAÇÃO N8N (Objetivo 2.6)

### 10.1 Endpoints Consumidos pelo n8n

| Endpoint | Método | Autenticação | Status |
|----------|--------|--------------|--------|
| `/api/rag/external/ask` | POST | API Key | ✅ Ativo |
| `/api/rag/external/ask-simple` | POST | API Key | ✅ Ativo |

### 10.2 Documentação Existente

- **Arquivo:** `educare-backend/docs/N8N_RAG_INTEGRATION.md`
- **Status:** ✅ Completo (301 linhas)
- **Última Atualização:** Dezembro 2025

### 10.3 Fluxo n8n → RAG

```
┌─────────────────────────────────────────────────────────────────┐
│                  INTEGRAÇÃO N8N → RAG                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WhatsApp → n8n Webhook                                         │
│       ↓                                                         │
│  Extrair phone + mensagem                                       │
│       ↓                                                         │
│  GET /api/external/users/search?phone=...                       │
│       ↓                                                         │
│  GET /api/external/users/by-phone/:phone/active-child           │
│       ↓                                                         │
│  POST /api/rag/external/ask                                     │
│  {                                                              │
│    "question": "mensagem do usuário",                           │
│    "baby_id": "child_id do passo anterior",                     │
│    "use_file_search": true                                      │
│  }                                                              │
│       ↓                                                         │
│  Resposta TitiNauta personalizada                               │
│       ↓                                                         │
│  Evolution API → WhatsApp                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.4 Garantias de Compatibilidade

| Aspecto | Garantia |
|---------|----------|
| Assinatura do endpoint | ❌ NÃO ALTERAR |
| Payload de entrada | ❌ NÃO ALTERAR (novos campos opcionais OK) |
| Formato de resposta | ❌ NÃO ALTERAR |
| API Key auth | ❌ NÃO ALTERAR |
| URL base | ❌ NÃO ALTERAR |

### 10.5 Impacto da Segmentação no n8n

| Fase | Impacto no n8n |
|------|----------------|
| Fase 1-3 | Nenhum |
| Fase 4 | Nenhum (ingestão apenas) |
| Fase 5 | **Transparente** - RAG consulta bases segmentadas internamente |
| Fase 6-7 | Nenhum |

**Conclusão:** O n8n **continuará funcionando sem alterações**. A segmentação é interna ao backend.

---

## 11. CONCLUSÃO

A **Abordagem A** (adicionar segmentação sem alterar tabela antiga) é a mais segura e alinhada com os requisitos do PRD:

1. **Zero regressão** - Tabela legado permanece intocada
2. **Rollback instantâneo** - Basta desligar feature flag
3. **Migração gradual** - Fase 7 migra documentos existentes
4. **Compatibilidade total** - n8n, WhatsApp, TitiNauta funcionam igual

**Próximo Passo:** Iniciar Fase 2-UPGRADE para definição formal da arquitetura.

---

*Documento gerado automaticamente - Fase 1-UPGRADE*
