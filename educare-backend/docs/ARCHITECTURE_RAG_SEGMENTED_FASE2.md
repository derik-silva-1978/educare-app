# ARQUITETURA RAG SEGMENTADA — FASE 2-UPGRADE
## Definição Formal da Nova Arquitetura Educare+

**Data:** Dezembro 2025  
**Status:** Documento de Especificação (Nenhuma Implementação)  
**Referência:** AUDIT_RAG_UPGRADE_FASE1.md

---

## 1. VISÃO GERAL DA ARQUITETURA

### 1.1 Objetivo

Segmentar a base de conhecimento única (`knowledge_documents`) em três bases especializadas:

| Base | Audiência | Conteúdo |
|------|-----------|----------|
| `kb_baby` | TitiNauta / Pais | Desenvolvimento infantil, marcos, atividades, saúde do bebê |
| `kb_mother` | Mães / Gestantes | Saúde materna, gestação, pós-parto, bem-estar |
| `kb_professional` | Profissionais | Protocolos, avaliações técnicas, PEI, guias clínicos |

### 1.2 Diagrama da Arquitetura

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                         NOVA ARQUITETURA RAG SEGMENTADA                        │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌───────────────┐  │
│  │  TitiNauta  │    │  Minha      │    │ Profissional│    │   n8n/        │  │
│  │  Chat       │    │  Saúde      │    │ Dashboard   │    │   WhatsApp    │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └───────┬───────┘  │
│         │                  │                  │                   │          │
│         ▼                  ▼                  ▼                   ▼          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         RAG Controller                                  │ │
│  │  POST /rag/ask  |  POST /rag/external/ask  |  POST /rag/ask-simple     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                       KnowledgeBaseSelector (NOVO)                       │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  INPUT:                                                            │ │ │
│  │  │  - module_type: "baby" | "mother" | "professional"                 │ │ │
│  │  │  - baby_id (opcional)                                              │ │ │
│  │  │  - user_role (opcional)                                            │ │ │
│  │  │                                                                    │ │ │
│  │  │  OUTPUT:                                                           │ │ │
│  │  │  - target_table: "kb_baby" | "kb_mother" | "kb_professional"       │ │ │
│  │  │  - fallback_table: "knowledge_documents" (se necessário)           │ │ │
│  │  └────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         RAGService (Adaptado)                           │ │
│  │                                                                         │ │
│  │   selectKnowledgeDocuments() ─► Consulta tabela selecionada             │ │
│  │   retrieveFromFileSearch() ───► OpenAI File Search                      │ │
│  │   buildLLMPrompt() ───────────► Monta prompt com contexto               │ │
│  │   callLLM() ──────────────────► GPT-4o-mini                             │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                         │
│                  ┌─────────────────┼─────────────────┐                       │
│                  ▼                 ▼                 ▼                       │
│         ┌────────────┐    ┌────────────────┐    ┌──────────────────┐         │
│         │  kb_baby   │    │   kb_mother    │    │ kb_professional  │         │
│         │ (NOVA)     │    │   (NOVA)       │    │    (NOVA)        │         │
│         └────────────┘    └────────────────┘    └──────────────────┘         │
│                                    │                                         │
│                                    ▼                                         │
│         ┌──────────────────────────────────────────────────────────┐         │
│         │              knowledge_documents (LEGADO)                 │         │
│         │                     FALLBACK                              │         │
│         └──────────────────────────────────────────────────────────┘         │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. ESTRUTURA DAS NOVAS TABELAS VETORIAIS

### 2.1 Schema Comum (kb_baby, kb_mother, kb_professional)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        SCHEMA: kb_baby / kb_mother / kb_professional         │
├──────────────────────────────────────────────────────────────────────────────┤

| Campo             | Tipo           | Obrigatório | Descrição                           |
|-------------------|----------------|-------------|-------------------------------------|
| id                | UUID           | ✓ PK        | Identificador único                 |
| title             | TEXT           | ✓           | Título do documento                 |
| description       | TEXT           | ✗           | Descrição do conteúdo               |
| source_type       | VARCHAR(50)    | ✓           | educare, oms, bncc, ministerio_saude, outro |
| file_search_id    | VARCHAR(255)   | ✗           | ID do arquivo no OpenAI File Search |
| file_path         | VARCHAR(500)   | ✗           | Caminho local do arquivo            |
| original_filename | VARCHAR(255)   | ✗           | Nome original do arquivo            |
| file_size         | INTEGER        | ✗           | Tamanho em bytes                    |
| mime_type         | VARCHAR(100)   | ✗           | Tipo MIME do arquivo                |
| tags              | TEXT[]         | ✗           | Tags para filtragem                 |
| age_range         | VARCHAR(50)    | ✗           | Faixa etária (0-3m, 4-6m, etc.)     |
| domain            | VARCHAR(50)    | ✗           | Domínio (motor, cognitivo, etc.)    |
| subcategory       | VARCHAR(100)   | ✗           | Subcategoria específica (NOVO)      |
| is_active         | BOOLEAN        | ✓           | Ativo/Inativo (default: true)       |
| created_by        | UUID           | ✗           | FK → users.id                       |
| migrated_from     | UUID           | ✗           | ID do doc legado (NOVO para migração) |
| metadata          | JSONB          | ✗           | Dados adicionais flexíveis          |
| created_at        | TIMESTAMPTZ    | ✓           | Data de criação                     |
| updated_at        | TIMESTAMPTZ    | ✓           | Data de atualização                 |

└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Campos Específicos por Tabela

#### kb_baby
| Campo Adicional | Uso |
|-----------------|-----|
| age_range | Obrigatório (faixa etária do bebê) |
| domain | Importante (motor, cognitivo, social, linguagem) |
| subcategory | Marcos, atividades, alertas, sono, alimentação |

#### kb_mother
| Campo Adicional | Uso |
|-----------------|-----|
| age_range | Não aplicável |
| trimester | Trimestre gestacional (1, 2, 3, pós-parto) |
| subcategory | Nutrição, emocional, físico, amamentação |

#### kb_professional
| Campo Adicional | Uso |
|-----------------|-----|
| age_range | Opcional |
| specialty | Especialidade (pediatra, terapeuta, educador) |
| subcategory | Protocolos, PEI, avaliações, relatórios |

### 2.3 Índices Recomendados

```sql
-- Para cada tabela (kb_baby, kb_mother, kb_professional):
CREATE INDEX idx_{table}_is_active ON {table}(is_active);
CREATE INDEX idx_{table}_file_search_id ON {table}(file_search_id);
CREATE INDEX idx_{table}_age_range ON {table}(age_range);
CREATE INDEX idx_{table}_domain ON {table}(domain);
CREATE INDEX idx_{table}_tags ON {table} USING GIN(tags);
CREATE INDEX idx_{table}_created_at ON {table}(created_at DESC);
```

---

## 3. ESPECIFICAÇÃO DO KnowledgeBaseSelector

### 3.1 Responsabilidades

1. Determinar qual base vetorial consultar com base no contexto
2. Evitar contaminação de dados entre módulos
3. Fornecer fallback controlado para base legado
4. Ser transparente para as rotas existentes

### 3.2 Interface do Componente

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       KnowledgeBaseSelector                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ENTRADA (SelectionContext):                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  {                                                                     │  │
│  │    module_type: "baby" | "mother" | "professional" | undefined,        │  │
│  │    baby_id: UUID | undefined,                                          │  │
│  │    user_role: "parent" | "professional" | "admin" | undefined,         │  │
│  │    route_context: string | undefined,  // ex: "/meu-bebe", "/saude"    │  │
│  │    force_legacy: boolean               // forçar uso da base antiga    │  │
│  │  }                                                                     │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  SAÍDA (SelectionResult):                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  {                                                                     │  │
│  │    primary_table: "kb_baby" | "kb_mother" | "kb_professional",         │  │
│  │    fallback_table: "knowledge_documents",                              │  │
│  │    use_fallback: boolean,                                              │  │
│  │    selection_reason: string   // log de auditoria                      │  │
│  │  }                                                                     │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Regras de Seleção (Decisão Tree)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         ÁRVORE DE DECISÃO                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. force_legacy === true?                                                   │
│     └─ SIM → return { primary: knowledge_documents, fallback: null }         │
│                                                                              │
│  2. ENABLE_SEGMENTED_KB === false? (Feature Flag)                            │
│     └─ SIM → return { primary: knowledge_documents, fallback: null }         │
│                                                                              │
│  3. module_type fornecido?                                                   │
│     └─ SIM →                                                                 │
│        ├─ "baby" → { primary: kb_baby, fallback: knowledge_documents }       │
│        ├─ "mother" → { primary: kb_mother, fallback: knowledge_documents }   │
│        └─ "professional" → { primary: kb_professional, fallback: kd }        │
│                                                                              │
│  4. baby_id fornecido?                                                       │
│     └─ SIM → { primary: kb_baby, fallback: knowledge_documents }             │
│                                                                              │
│  5. route_context disponível?                                                │
│     └─ SIM →                                                                 │
│        ├─ "/meu-bebe*" → { primary: kb_baby }                                │
│        ├─ "/saude*" → { primary: kb_mother }                                 │
│        └─ "/profissional*" → { primary: kb_professional }                    │
│                                                                              │
│  6. Nenhuma condição atendida                                                │
│     └─ { primary: knowledge_documents, fallback: null }                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Feature Flag

| Flag | Descrição | Default |
|------|-----------|---------|
| `ENABLE_SEGMENTED_KB` | Ativa consultas nas bases segmentadas | `false` |
| `KB_FALLBACK_ENABLED` | Permite fallback para base legado | `true` |
| `KB_LOG_SELECTIONS` | Loga todas as seleções de base | `true` |

---

## 4. PIPELINE DE INGESTÃO SEGMENTADA

### 4.1 Fluxo de Ingestão (Com Segmentação)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    PIPELINE DE INGESTÃO SEGMENTADA                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Super Admin → POST /api/admin/knowledge/upload                           │
│       ↓                                                                      │
│  2. Validações Existentes (Multer, MIME, etc.)                               │
│       ↓                                                                      │
│  3. ★ NOVO: Extrair knowledge_category do payload                            │
│       │   - "baby" | "mother" | "professional"                               │
│       │   - Default: indetected → base legado apenas                         │
│       ↓                                                                      │
│  4. fileSearchService.uploadDocumentToFileSearch()                           │
│       ↓ (retorna file_search_id)                                             │
│  5. ★ INGESTÃO DUPLA:                                                        │
│       │                                                                      │
│       ├─► knowledge_documents.create({...})  // SEMPRE (legado)              │
│       │                                                                      │
│       └─► Se knowledge_category fornecida:                                   │
│           ├─ "baby" → kb_baby.create({...})                                  │
│           ├─ "mother" → kb_mother.create({...})                              │
│           └─ "professional" → kb_professional.create({...})                  │
│       ↓                                                                      │
│  6. Response → {document, segmented_base, file_search_status}                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Modos de Compatibilidade

#### Modo A: Ingestão Dupla (RECOMENDADO)

| Aspecto | Comportamento |
|---------|---------------|
| Base Legado | Sempre recebe o documento |
| Base Segmentada | Recebe se `knowledge_category` fornecida |
| Rollback | Instantâneo (basta desligar flag) |
| Duplicação | Temporária, durante transição |

#### Modo B: Ingestão Única (Futuro)

| Aspecto | Comportamento |
|---------|---------------|
| Base Legado | Não recebe mais documentos |
| Base Segmentada | Única destino |
| Rollback | Não disponível |
| Migração | Fase 7-UPGRADE |

### 4.3 Payload do Upload Expandido

```json
{
  "file": "<arquivo>",
  "title": "Título do documento",
  "description": "Descrição",
  "source_type": "educare | oms | bncc | ministerio_saude | outro",
  "knowledge_category": "baby | mother | professional",  // ★ NOVO (opcional)
  "age_range": "0-3m | 4-6m | ...",
  "domain": "motor | cognitivo | ...",
  "subcategory": "marcos | atividades | ...",            // ★ NOVO (opcional)
  "tags": ["tag1", "tag2"]
}
```

---

## 5. NOVO FLUXO RAG

### 5.1 Fluxo Completo com Segmentação

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         FLUXO RAG SEGMENTADO                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Request → ragController.ask()                                            │
│       │                                                                      │
│       ▼                                                                      │
│  2. ★ KnowledgeBaseSelector.select(context)                                  │
│       │   - Analisa module_type, baby_id, route_context                      │
│       │   - Retorna: { primary_table, fallback_table, use_fallback }         │
│       │                                                                      │
│       ▼                                                                      │
│  3. babyContextService.getBabyContext(babyId) (se baby_id)                   │
│       │                                                                      │
│       ▼                                                                      │
│  4. ragService.selectKnowledgeDocuments(filters, ★ target_table)             │
│       │   - Consulta PRIMARY: kb_baby/kb_mother/kb_professional              │
│       │   - Se vazio E use_fallback → consulta knowledge_documents           │
│       │                                                                      │
│       ▼                                                                      │
│  5. ragService.retrieveFromFileSearch(question, fileSearchIds)               │
│       │   - OpenAI File Search                                               │
│       │                                                                      │
│       ▼                                                                      │
│  6. ragService.buildLLMPrompt(question, chunks, context)                     │
│       │   - Prompt 100% compatível (mesmo formato)                           │
│       │                                                                      │
│       ▼                                                                      │
│  7. ragService.callLLM(systemPrompt, userMessage)                            │
│       │                                                                      │
│       ▼                                                                      │
│  8. Response → {answer, metadata: {selected_base, fallback_used, ...}}       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Alterações no RAGService

| Função | Alteração | Impacto |
|--------|-----------|---------|
| `selectKnowledgeDocuments` | Aceita parâmetro `target_table` | Aditivo |
| `ask` | Chama KnowledgeBaseSelector antes | Aditivo |
| `askWithBabyId` | Passa `module_type: "baby"` | Aditivo |
| `buildLLMPrompt` | Nenhuma alteração | Zero |
| `callLLM` | Nenhuma alteração | Zero |

### 5.3 Metadados Adicionados na Resposta

```json
{
  "success": true,
  "answer": "Resposta personalizada...",
  "metadata": {
    "documents_found": 3,
    "documents_used": [...],
    "file_search_used": true,
    "selected_base": "kb_baby",        // ★ NOVO
    "fallback_used": false,             // ★ NOVO
    "fallback_base": "knowledge_documents", // ★ NOVO
    "model": "gpt-4o-mini",
    "processing_time_ms": 4500
  }
}
```

---

## 6. COMPATIBILIDADE COM PROMPT MANAGEMENT

### 6.1 Estado Atual

| Componente | Localização | Alteração Necessária |
|------------|-------------|----------------------|
| DEFAULT_SYSTEM_PROMPT | ragService.js | Nenhuma |
| buildLLMPrompt() | ragService.js | Nenhuma |
| formatContextForPrompt() | babyContextService.js | Nenhuma |

### 6.2 Extensões Futuras (Opcional)

| Recurso | Descrição | Fase |
|---------|-----------|------|
| Prompts por Módulo | System prompts específicos para mother/professional | 6+ |
| Template Registry | Tabela de templates versionados | 7+ |
| A/B Testing | Testes de diferentes prompts | 8+ |

### 6.3 Garantias

1. **Zero Breaking Changes** - Nenhum prompt existente é alterado
2. **Backward Compatible** - Código atual funciona sem modificação
3. **Future Ready** - Arquitetura permite expansão

---

## 7. MAPA DE COMPATIBILIDADE RETROATIVA

### 7.1 Rotas Protegidas (Não Alterar)

| Rota | Consumidor | Garantia |
|------|------------|----------|
| `POST /api/rag/ask` | Frontend TitiNauta | Assinatura intacta |
| `POST /api/rag/external/ask` | n8n/WhatsApp | Assinatura intacta |
| `POST /api/rag/ask-simple` | Frontend | Assinatura intacta |
| `POST /api/admin/knowledge/upload` | Super Admin | Campos novos opcionais |

### 7.2 Tabela Legado

| Aspecto | Garantia |
|---------|----------|
| `knowledge_documents` | Nunca excluída |
| Dados existentes | Nunca modificados |
| Ingestão | Continua recebendo documentos |
| Consulta | Disponível como fallback |

### 7.3 Feature Flags de Controle

| Flag | Valor para Rollback | Efeito |
|------|---------------------|--------|
| `ENABLE_SEGMENTED_KB` | `false` | RAG usa apenas knowledge_documents |
| `KB_FALLBACK_ENABLED` | `true` | Sempre faz fallback para legado |

### 7.4 Checklist de Não-Quebra

| Verificação | Status |
|-------------|--------|
| n8n continua funcionando sem alterações | ✓ Garantido |
| WhatsApp bot continua funcionando | ✓ Garantido |
| TitiNauta chat continua funcionando | ✓ Garantido |
| Super Admin upload funciona igual | ✓ Garantido |
| App móvel sem impacto | ✓ Garantido |
| Rotas REST sem alteração de assinatura | ✓ Garantido |

---

## 8. RESUMO DOS COMPONENTES A SEREM CRIADOS

### Fase 3-UPGRADE (Próxima)

| Componente | Tipo | Arquivo Sugerido |
|------------|------|------------------|
| Migration kb_baby | SQL | migrations/xxx-create-kb-baby.js |
| Migration kb_mother | SQL | migrations/xxx-create-kb-mother.js |
| Migration kb_professional | SQL | migrations/xxx-create-kb-professional.js |
| Model KbBaby | Sequelize | models/KbBaby.js |
| Model KbMother | Sequelize | models/KbMother.js |
| Model KbProfessional | Sequelize | models/KbProfessional.js |
| KnowledgeBaseSelector | Service | services/knowledgeBaseSelector.js |

### Fase 4-UPGRADE

| Componente | Tipo | Arquivo |
|------------|------|---------|
| knowledgeController | Controller | controllers/knowledgeController.js (editar) |
| Ingestão Dupla | Logic | Dentro do controller |

### Fase 5-UPGRADE

| Componente | Tipo | Arquivo |
|------------|------|---------|
| ragService | Service | services/ragService.js (editar) |
| Feature Flags | Config | config/featureFlags.js |

---

## 9. CHECKLIST DE SEGURANÇA DA FASE 2

| Verificação | Status |
|-------------|--------|
| Nenhuma tabela foi criada | ✅ |
| Nenhum código foi escrito | ✅ |
| Nenhuma rota foi alterada | ✅ |
| Nenhuma migration foi executada | ✅ |
| RAG continua funcionando | ✅ |
| Documento é apenas especificação | ✅ |

---

## 10. CONCLUSÃO

Este documento define completamente a arquitetura de segmentação do RAG Educare+:

1. **3 Novas Tabelas**: kb_baby, kb_mother, kb_professional
2. **KnowledgeBaseSelector**: Componente de seleção dinâmica
3. **Pipeline Segmentado**: Ingestão dupla com fallback
4. **RAG Adaptado**: Consulta bases por módulo
5. **Compatibilidade Total**: Nenhuma quebra em rotas/consumidores

**Próximo Passo**: Fase 3-UPGRADE - Implementação das tabelas e modelos.

---

*Documento de Especificação - Fase 2-UPGRADE*  
*Nenhuma implementação realizada*
