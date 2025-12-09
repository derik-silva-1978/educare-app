# Base de Conhecimento Segmentada - Documentação do Banco de Dados

**Data:** Dezembro 2025  
**Status:** Fase 3-UPGRADE Concluída  
**Referência:** ARCHITECTURE_RAG_SEGMENTED_FASE2.md

---

## 1. VISÃO GERAL

A base de conhecimento do Educare+ foi segmentada em 3 tabelas especializadas para melhorar a precisão das respostas do RAG:

| Tabela | Audiência | Propósito |
|--------|-----------|-----------|
| `kb_baby` | Pais / TitiNauta | Desenvolvimento infantil, marcos, atividades |
| `kb_mother` | Mães / Gestantes | Saúde materna, gestação, pós-parto |
| `kb_professional` | Profissionais | Protocolos, avaliações técnicas, PEI |

---

## 2. ESTRUTURA DAS TABELAS

### 2.1 kb_baby

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| title | TEXT (NOT NULL) | Título do documento |
| content | TEXT | Texto completo extraído |
| description | TEXT | Descrição do conteúdo |
| embedding | FLOAT8[] | Vetor de embedding (busca vetorial local) |
| source_type | VARCHAR(50) | Origem: educare, oms, bncc, ministerio_saude, outro |
| file_search_id | VARCHAR(255) | ID do arquivo no OpenAI File Search |
| file_path | VARCHAR(500) | Caminho local do arquivo |
| original_filename | VARCHAR(255) | Nome original do arquivo |
| file_size | INTEGER | Tamanho em bytes |
| mime_type | VARCHAR(100) | Tipo MIME |
| tags | TEXT[] | Array de tags para filtragem |
| age_range | VARCHAR(50) | Faixa etária: 0-3m, 4-6m, etc. |
| domain | VARCHAR(50) | Domínio: motor, cognitivo, social, linguagem |
| subcategory | VARCHAR(100) | Subcategoria específica |
| is_active | BOOLEAN | Ativo/Inativo (default: true) |
| created_by | UUID | ID do usuário que fez upload |
| migrated_from | UUID | ID do documento legado (para migração) |
| metadata | JSONB | Dados adicionais flexíveis |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

**Índices:**
- idx_kb_baby_is_active
- idx_kb_baby_file_search_id
- idx_kb_baby_age_range
- idx_kb_baby_domain
- idx_kb_baby_tags (GIN)
- idx_kb_baby_created_at

---

### 2.2 kb_mother

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| title | TEXT (NOT NULL) | Título do documento |
| content | TEXT | Texto completo extraído |
| description | TEXT | Descrição do conteúdo |
| embedding | FLOAT8[] | Vetor de embedding (busca vetorial local) |
| source_type | VARCHAR(50) | Origem: educare, oms, bncc, ministerio_saude, outro |
| file_search_id | VARCHAR(255) | ID do arquivo no OpenAI File Search |
| file_path | VARCHAR(500) | Caminho local do arquivo |
| original_filename | VARCHAR(255) | Nome original do arquivo |
| file_size | INTEGER | Tamanho em bytes |
| mime_type | VARCHAR(100) | Tipo MIME |
| tags | TEXT[] | Array de tags para filtragem |
| **trimester** | VARCHAR(20) | Trimestre gestacional: 1, 2, 3, pós-parto |
| domain | VARCHAR(50) | Domínio: nutrição, emocional, físico, amamentação |
| subcategory | VARCHAR(100) | Subcategoria específica |
| is_active | BOOLEAN | Ativo/Inativo (default: true) |
| created_by | UUID | ID do usuário que fez upload |
| migrated_from | UUID | ID do documento legado (para migração) |
| metadata | JSONB | Dados adicionais flexíveis |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

**Índices:**
- idx_kb_mother_is_active
- idx_kb_mother_file_search_id
- idx_kb_mother_trimester
- idx_kb_mother_domain
- idx_kb_mother_tags (GIN)
- idx_kb_mother_created_at

---

### 2.3 kb_professional

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| title | TEXT (NOT NULL) | Título do documento |
| content | TEXT | Texto completo extraído |
| description | TEXT | Descrição do conteúdo |
| embedding | FLOAT8[] | Vetor de embedding (busca vetorial local) |
| source_type | VARCHAR(50) | Origem: educare, oms, bncc, ministerio_saude, outro |
| file_search_id | VARCHAR(255) | ID do arquivo no OpenAI File Search |
| file_path | VARCHAR(500) | Caminho local do arquivo |
| original_filename | VARCHAR(255) | Nome original do arquivo |
| file_size | INTEGER | Tamanho em bytes |
| mime_type | VARCHAR(100) | Tipo MIME |
| tags | TEXT[] | Array de tags para filtragem |
| **specialty** | VARCHAR(100) | Especialidade: pediatra, terapeuta, educador |
| domain | VARCHAR(50) | Domínio: protocolos, PEI, avaliações, relatórios |
| subcategory | VARCHAR(100) | Subcategoria específica |
| is_active | BOOLEAN | Ativo/Inativo (default: true) |
| created_by | UUID | ID do usuário que fez upload |
| migrated_from | UUID | ID do documento legado (para migração) |
| metadata | JSONB | Dados adicionais flexíveis |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

**Índices:**
- idx_kb_professional_is_active
- idx_kb_professional_file_search_id
- idx_kb_professional_specialty
- idx_kb_professional_domain
- idx_kb_professional_tags (GIN)
- idx_kb_professional_created_at

---

## 3. RELAÇÃO COM O RAG

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ARQUITETURA RAG SEGMENTADA                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  KnowledgeBaseSelector                                                      │
│       │                                                                     │
│       ├─► module_type: "baby" ─────────► kb_baby                            │
│       ├─► module_type: "mother" ───────► kb_mother                          │
│       ├─► module_type: "professional" ─► kb_professional                    │
│       └─► fallback ────────────────────► knowledge_documents (legado)       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. CAMADA DE ACESSO

### 4.1 Modelos Sequelize

| Arquivo | Tabela | Status |
|---------|--------|--------|
| `models/KbBaby.js` | kb_baby | ✅ Criado |
| `models/KbMother.js` | kb_mother | ✅ Criado |
| `models/KbProfessional.js` | kb_professional | ✅ Criado |
| `models/KnowledgeDocument.js` | knowledge_documents | Existente (legado) |

### 4.2 KnowledgeBaseSelector

| Arquivo | Função | Status |
|---------|--------|--------|
| `services/knowledgeBaseSelector.js` | Seleção dinâmica de base | ✅ Criado |

**Feature Flags:**
- `ENABLE_SEGMENTED_KB` - Ativa consultas segmentadas (default: false)
- `KB_FALLBACK_ENABLED` - Permite fallback para legado (default: true)
- `KB_LOG_SELECTIONS` - Loga seleções de base (default: true)

### 4.3 Repositório

| Arquivo | Função | Status |
|---------|--------|--------|
| `repositories/knowledgeBaseRepository.js` | Camada de acesso unificada | ✅ Criado |

**Métodos Disponíveis:**
- `insertBabyDoc(data)` - Insere documento em kb_baby
- `insertMotherDoc(data)` - Insere documento em kb_mother
- `insertProfessionalDoc(data)` - Insere documento em kb_professional
- `queryBaby(filters)` - Consulta kb_baby
- `queryMother(filters)` - Consulta kb_mother
- `queryProfessional(filters)` - Consulta kb_professional
- `queryByTable(tableName, filters)` - Consulta genérica por nome da tabela
- `insertByCategory(category, data)` - Inserção genérica por categoria
- `countByTable(tableName)` - Contagem de documentos ativos

---

## 5. SCRIPT DE MIGRAÇÃO

**Arquivo:** `migrations/001_create_kb_segmented_tables.sql`

Este script cria as 3 tabelas com todos os índices necessários. É idempotente (usa `IF NOT EXISTS`).

**Execução:**
```bash
psql -h <host> -U <user> -d <database> -f migrations/001_create_kb_segmented_tables.sql
```

---

## 6. STATUS DA IMPLEMENTAÇÃO

| Componente | Status | Observação |
|------------|--------|------------|
| Tabela kb_baby | ✅ Criada | Com índices e campos content/embedding |
| Tabela kb_mother | ✅ Criada | Com índices e campos content/embedding |
| Tabela kb_professional | ✅ Criada | Com índices e campos content/embedding |
| Model KbBaby | ✅ Criado | Sequelize com todos os campos |
| Model KbMother | ✅ Criado | Sequelize com todos os campos |
| Model KbProfessional | ✅ Criado | Sequelize com todos os campos |
| KnowledgeBaseSelector | ✅ Criado | Pronto para uso |
| KnowledgeBaseRepository | ✅ Criado | Camada de acesso completa |
| Script SQL | ✅ Criado | Idempotente |
| RAG alterado | ❌ Não | Continua usando legado |
| Ingestão alterada | ❌ Não | Continua usando legado |

---

## 7. PRÓXIMOS PASSOS

1. **Fase 4-UPGRADE**: Integrar ingestão segmentada no controller
2. **Fase 5-UPGRADE**: Adaptar RAG para usar bases segmentadas
3. **Fase 6-UPGRADE**: Ajuste fino e métricas
4. **Fase 7-UPGRADE**: Migração de dados da base legado

---

*Documento gerado automaticamente - Fase 3-UPGRADE*
