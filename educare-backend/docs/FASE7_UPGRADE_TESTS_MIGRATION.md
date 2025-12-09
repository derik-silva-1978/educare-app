# Fase 7-UPGRADE: Testes End-to-End e Migração Assistida

**Data:** Dezembro 9, 2025  
**Status:** ✅ CONCLUÍDA  
**Dependências:** FASE 6 completada

---

## 1. VISÃO GERAL

A Fase 7 finaliza o upgrade do RAG com:
- **Testes end-to-end** completos da arquitetura segmentada
- **Serviço de migração assistida** para documentos legados
- **Endpoints de administração** para gerenciar migração
- **Validação de integridade** dos dados

---

## 2. TESTES END-TO-END

**Arquivo:** `tests/rag.integration.test.js`

### 2.1 Categorias de Testes

#### A. Seleção de Conhecimento
```
✅ Seleciona kb_baby para module_type=baby
✅ Seleciona kb_mother para module_type=mother
✅ Seleciona kb_professional para module_type=professional
✅ Fallback para knowledge_documents quando base primária vazia
✅ Força uso de legacy com force_legacy=true
```

#### B. Funcionalidade RAG
```
✅ Retorna resposta para pergunta simples
✅ Registra query nas métricas
✅ Trata erro quando OpenAI não configurado
```

#### C. Coleta de Métricas
```
✅ Coleta metadata completa de query bem-sucedida
✅ Retorna health check com status válido
✅ Calcula estatísticas por módulo corretamente
```

#### D. Fluxo de Migração
```
✅ Classifica documentos corretamente
✅ Valida integridade após análise
```

#### E. Compatibilidade Reversa
```
✅ askSimple funciona com nova arquitetura
✅ askWithBabyId força módulo baby
✅ Endpoints RAG antigos continuam funcionando
```

#### F. Tratamento de Erros
```
✅ Trata erro de pergunta vazia graciosamente
✅ Recupera de falha de File Search
✅ Registra erro nas métricas quando falha
```

---

## 3. SERVIÇO DE MIGRAÇÃO

**Arquivo:** `services/migrationService.js`

### 3.1 Funcionalidades

#### analyzeAndClassifyDocuments()
**Propósito:** Analisa base legado e classifica documentos por categoria

**Lógica de Classificação:**
```javascript
if (age_range || domain in ['cognitive', 'motor', 'social', 'language'])
  → Categoria: 'baby'
else if (specialty in ['obstetrics', 'nutrition', 'mental_health', 'postpartum'])
  → Categoria: 'mother'
else if (specialty in ['pediatrics', 'psychology', 'education', 'nursing'])
  → Categoria: 'professional'
else
  → Categoria: 'ambiguous' (ignorado por padrão)
```

**Resposta:**
```json
{
  "success": true,
  "total_documents": 150,
  "classification": {
    "baby_count": 85,
    "mother_count": 35,
    "professional_count": 20,
    "ambiguous_count": 10
  },
  "classified": {
    "baby": [...],
    "mother": [...],
    "professional": [...],
    "ambiguous": [...]
  }
}
```

#### migrateDocuments(options)
**Propósito:** Migra documentos classificados para tabelas segmentadas

**Opções:**
```javascript
{
  auto_classify: true,      // Classifica automaticamente (vs. manual)
  skip_ambiguous: true,     // Pula documentos ambíguos
  batch_size: 10           // Documentos por batch
}
```

**Processo:**
1. Classifica todos os documentos
2. Para cada categoria (baby, mother, professional):
   - Itera em batches de `batch_size`
   - Usa `knowledgeBaseRepository.insertDualWithCategory()`
   - Registra `migrated_from` como referência
3. Registra cada sucesso/erro
4. Retorna resumo com estatísticas

**Resposta:**
```json
{
  "success": true,
  "summary": {
    "total_attempted": 150,
    "migrated": 145,
    "skipped": 5,
    "errors": 0
  },
  "error_details": []
}
```

#### validateMigration()
**Propósito:** Valida integridade após migração

**Métricas Retornadas:**
- `documents_in_legacy` - Total ainda na base legado
- `documents_in_segmented` - Total nas tabelas segmentadas
- `migrated_marked_in_legacy` - Quantos foram marcados como migrados
- `coverage_percent` - % de cobertura

**Recomendações Automáticas:**
- ✅ Todos migrados
- ⚠️  Documentos não migrados
- ℹ️  Distribuição entre bases
- ℹ️  Status do kb_professional

#### rollbackMigration(documentIds)
**Propósito:** Desfaz migração (marcação)

**Parâmetros:**
- `documentIds` - Array de IDs (null = todos)

---

## 4. ENDPOINTS DE MIGRAÇÃO

**Rota Base:** `/api/admin/migration`  
**Autenticação:** JWT + Super Admin  
**Documentação:** Swagger disponível

### 4.1 Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/analyze` | GET | Classifica documentos legados |
| `/start` | POST | Inicia migração |
| `/validate` | GET | Valida integridade |
| `/rollback` | POST | Desfaz migração |

### 4.2 Exemplos de Uso

**Analisar documentos:**
```bash
curl -X GET http://localhost:3001/api/admin/migration/analyze \
  -H "Authorization: Bearer <token>"
```

**Iniciar migração:**
```bash
curl -X POST http://localhost:3001/api/admin/migration/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "auto_classify": true,
    "skip_ambiguous": true,
    "batch_size": 20
  }'
```

**Validar integridade:**
```bash
curl -X GET http://localhost:3001/api/admin/migration/validate \
  -H "Authorization: Bearer <token>"
```

**Rollback:**
```bash
curl -X POST http://localhost:3001/api/admin/migration/rollback \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"document_ids": ["doc-1", "doc-2"]}'
```

---

## 5. FLUXO COMPLETO DE MIGRAÇÃO

### Passo 1: Análise
```bash
GET /api/admin/migration/analyze
```
→ Retorna classificação de todos os documentos

### Passo 2: Review
Revisar:
- Quantidade por categoria
- Documentos ambíguos
- Distribuição esperada

### Passo 3: Execução
```bash
POST /api/admin/migration/start
```
→ Inicia migração com transação (rollback automático se erro)

### Passo 4: Validação
```bash
GET /api/admin/migration/validate
```
→ Verifica:
- Todos foram migrados?
- Distribuição correta?
- Recomendações do sistema

### Passo 5: Confirmação
Se tudo OK:
- ✅ Migração completa
- Base legado ainda existe (para referência)
- Dados segmentados prontos

Se há problemas:
```bash
POST /api/admin/migration/rollback
```
→ Marca documentos como não migrados

---

## 6. CONSIDERAÇÕES DE PRODUÇÃO

### Segurança
- ✅ Endpoints requerem Super Admin
- ✅ Transações atômicas (tudo ou nada)
- ✅ Logging completo de operações
- ✅ Rollback automático em erros

### Performance
- Migração em batches (não carrega tudo na memória)
- Processamento incremental
- Sem bloqueio de leitura da base

### Dados
- Referência mantida via `migrated_from`
- Dados originais preservados em `knowledge_documents`
- Duplicação é temporária (pode deletar legacy depois)

---

## 7. PÓS-MIGRAÇÃO

### Opcional: Cleanup
Após validar que tudo funciona:

```sql
-- Backup (RECOMENDADO)
SELECT * INTO knowledge_documents_backup 
FROM knowledge_documents;

-- Deletar documentos migrados
DELETE FROM knowledge_documents 
WHERE id IN (
  SELECT migrated_from FROM kb_baby 
  UNION ALL
  SELECT migrated_from FROM kb_mother 
  UNION ALL
  SELECT migrated_from FROM kb_professional
);
```

---

## 8. MONITORAMENTO PÓS-MIGRAÇÃO

**Checklist:**
- ✅ Verificar `/api/metrics/rag/health` - deve estar `healthy`
- ✅ Verificar `/api/metrics/rag/knowledge-bases` - distribuição OK?
- ✅ Testar `/api/rag/ask` com cada módulo (baby, mother, professional)
- ✅ Validar n8n/WhatsApp com módulo baby

---

## 9. STATUS GERAL DO PROJETO

| Fase | Status | Descrição |
|------|--------|-----------|
| 1 | ✅ | Auditoria RAG |
| 2 | ✅ | Arquitetura segmentada |
| 3 | ✅ | Tabelas + models |
| 4 | ✅ | Dual write automática |
| 5 | ✅ | RAG com seleção inteligente |
| 6 | ✅ | Métricas + health check |
| **7** | **✅** | **Testes + Migração** |

---

## 10. ARQUITETURA FINAL

```
┌─────────────────────────────────────────────────────────────┐
│                    EDUCARE+ RAG SEGMENTADO                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend Apps                                               │
│  ├─ TitiNauta (baby questions)                              │
│  ├─ Maternal Health (mother questions)                      │
│  └─ Professional Portal (professional questions)            │
│                      │                                       │
│                      ▼                                       │
│         /api/rag/ask (module_type param)                    │
│                      │                                       │
│  ┌─────────────────────────────────────────┐                │
│  │      RAG Service (ragService.js)        │                │
│  ├─────────────────────────────────────────┤                │
│  │  • ask(question, {module_type, ...})    │                │
│  │  • selectKnowledgeDocuments()           │                │
│  │  • retrieveFromFileSearch()             │                │
│  │  • buildLLMPrompt()                     │                │
│  │  • callLLM()                            │                │
│  └────────┬────────────────────┬───────────┘                │
│           │                    │                             │
│           ▼                    ▼                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Knowledge Base   │  │  RAG Metrics     │               │
│  │ Selector         │  │  Service         │               │
│  └────────┬─────────┘  └──────────────────┘               │
│           │                                                │
│  ┌────────┴───────────────────────────┐                   │
│  ▼                                    ▼                   │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│ │  kb_baby     │  │kb_mother     │  │kb_professional│   │
│ ├──────────────┤  ├──────────────┤  ├──────────────┤    │
│ │• title       │  │• title       │  │• title       │    │
│ │• content     │  │• content     │  │• content     │    │
│ │• age_range   │  │• specialty   │  │• specialty   │    │
│ │• domain      │  │• domain      │  │• domain      │    │
│ │• tags        │  │• tags        │  │• tags        │    │
│ │• file_search │  │• file_search │  │• file_search │    │
│ └──────────────┘  └──────────────┘  └──────────────┘    │
│  (OpenAI File Search IDs for semantic search)            │
│                                                           │
│  ┌────────────────────────────────────┐                 │
│  │ knowledge_documents (Legacy)       │                 │
│  │ • Fallback when segmented empty    │                 │
│  │ • migrated_from tracking          │                 │
│  └────────────────────────────────────┘                 │
│                                                           │
│  ┌────────────────────────────────────┐                 │
│  │ Migration Service                  │                 │
│  │ • Analyze & classify              │                 │
│  │ • Dual write                      │                 │
│  │ • Validate integrity              │                 │
│  │ • Rollback support                │                 │
│  └────────────────────────────────────┘                 │
│                                                           │
└─────────────────────────────────────────────────────────────┘

Feature Flags:
• ENABLE_SEGMENTED_KB (master switch)
• ENABLE_KB_BABY, ENABLE_KB_MOTHER, ENABLE_KB_PROFESSIONAL
• KB_FALLBACK_ENABLED (fallback automático)
• KB_LOG_SELECTIONS (logging detalhado)
```

---

## 11. PRÓXIMAS MELHORIAS (Post-MVP)

- Persistência de métricas em PostgreSQL
- Dashboard React para visualização de métricas
- Alertas automáticos (Slack, email)
- A/B testing entre bases
- Analytics avançadas por usuário/módulo
- Recomendações automáticas de conteúdo

---

*Documento gerado automaticamente - Fase 7-UPGRADE Concluída*
