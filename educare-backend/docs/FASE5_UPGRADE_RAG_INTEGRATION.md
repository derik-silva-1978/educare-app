# Fase 5-UPGRADE: Integração do RAG com Bases Segmentadas

**Data:** Dezembro 9, 2025  
**Status:** ✅ CONCLUÍDA  
**Dependências:** FASE 3, FASE 4 completadas

---

## 1. VISÃO GERAL

A Fase 5 integra o RAG Service com o novo sistema de bases segmentadas. O RAG agora:
- Seleciona automaticamente qual base de conhecimento usar (baby/mother/professional)
- Consulta a base primária apropriada
- Fallback automático para tabela legada se base primária vazia
- Rastreia qual base foi usada nos metadados da resposta

---

## 2. ARQUITETURA IMPLEMENTADA

```
┌────────────────────────────────────────────────────────────────────────┐
│                    RAG ASK FLOW COM SELEÇÃO INTELIGENTE                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ask(question, options)                                               │
│  ├─ options.module_type: 'baby'|'mother'|'professional'              │
│  ├─ options.baby_id, user_role, route_context, force_legacy          │
│  │                                                                    │
│  └─> selectKnowledgeDocuments(filters)                              │
│      │                                                                │
│      ├─> KnowledgeBaseSelector.select()                              │
│      │   ├─ Analisa module_type, baby_id, route_context              │
│      │   └─ Retorna: primary_table + fallback_table + reasoning      │
│      │                                                                │
│      ├─ KnowledgeBaseRepository.queryByTable(primary_table)           │
│      │   ├─ Consulta kb_baby / kb_mother / kb_professional           │
│      │   └─ Retorna documentos com metadata                          │
│      │                                                                │
│      ├─ Se vazio E fallback habilitado:                              │
│      │   └─> KnowledgeBaseRepository.queryByTable(knowledge_documents) │
│      │                                                                │
│      └─ Retorna: {documents, used_table, fallback_used}             │
│      │                                                                │
│      └─> retrieveFromFileSearch()                                    │
│          └─ Busca trechos no OpenAI File Search                      │
│      │                                                                │
│      └─> callLLM() com prompt + contexto da criança + trechos       │
│          └─ Retorna resposta finalizada                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. MODIFICAÇÕES IMPLEMENTADAS

### 3.1 selectKnowledgeDocuments() - Completamente refatorizado

**Arquivo:** `services/ragService.js`

**Alterações:**
1. Importa `knowledgeBaseSelector` e `knowledgeBaseRepository`
2. Chama `selector.select()` com contexto para determinar qual base usar
3. Usa `repository.queryByTable()` em vez de query Sequelize direta
4. Implementa fallback automático: tenta legado se base primária vazia
5. Retorna `metadata` com informações sobre qual base foi usada

**Resposta agora inclui:**
```javascript
metadata: {
  primary_table: 'kb_baby',        // Tabela definida
  used_table: 'kb_baby',           // Tabela realmente consultada
  fallback_used: false,            // Se fallback foi acionado
  selection_reason: '...'          // Motivo da seleção
}
```

### 3.2 ask() - Adiciona contexto de módulo

**Arquivo:** `services/ragService.js`

**Alterações:**
1. Aceita novos parâmetros de contexto:
   - `module_type`: força uso de base específica
   - `baby_id`: infere base baby
   - `user_role`: pode influenciar seleção
   - `route_context`: mapeia rota para base
   - `force_legacy`: força tabela legado
2. Default: `module_type='baby'` se não fornecido
3. Passa metadata do KB para resposta final

### 3.3 askWithBabyId() - Força módulo baby

**Arquivo:** `services/ragService.js`

**Alterações:**
1. Força `module_type='baby'` sempre que contexto infantil é fornecido
2. Garante que documento da criança consulta base baby

---

## 4. EXEMPLOS DE USO

### 4.1 Pergunta sobre desenvolvimento infantil (Baby)

```javascript
const result = await ragService.ask(
  "Como estimular desenvolvimento motor nos 3 primeiros meses?",
  {
    module_type: 'baby',          // Consulta kb_baby
    age_range: '0-3m',            // Filtro: documentos 0-3m
    domain: 'motor',              // Filtro: desenvolvimento motor
    baby_id: 'child-uuid',        // Contexto personalizado
    childContext: { ... }         // Dados da criança
  }
);
// Usa: kb_baby (primária) → fallback para knowledge_documents se vazio
```

### 4.2 Pergunta de saúde materna (Mother)

```javascript
const result = await ragService.ask(
  "Que alimentos são seguros no primeiro trimestre?",
  {
    module_type: 'mother',        // Consulta kb_mother
    domain: 'nutrição',           // Filtro: nutrição
    user_role: 'parent'
  }
);
// Usa: kb_mother (primária) → fallback para knowledge_documents se vazio
```

### 4.3 Pergunta profissional

```javascript
const result = await ragService.ask(
  "Qual protocolo de avaliação usar para atraso motor?",
  {
    module_type: 'professional',  // Consulta kb_professional
    user_role: 'professional',
    domain: 'protocolos'
  }
);
// Usa: kb_professional (primária) → fallback se vazio
```

### 4.4 Força tabela legado (backwards compatibility)

```javascript
const result = await ragService.ask(
  "Pergunta genérica",
  {
    force_legacy: true            // Ignora segmentação
  }
);
// Usa: knowledge_documents (legado)
```

---

## 5. INTEGRAÇÃO COM CONTROLLERS

### 5.1 RAG Routes - Adicionar parâmetros

Endpoints `/api/rag/ask` e `/api/rag/external/ask` podem aceitar:

```javascript
POST /api/rag/ask
{
  "question": "...",
  "module_type": "baby|mother|professional",  // Novo
  "age_range": "0-3m",
  "domain": "motor",
  "baby_id": "...",                           // Novo
  "childContext": { ... }
}
```

---

## 6. FEATURE FLAGS E COMPORTAMENTO

| Cenário | ENABLE_SEGMENTED_KB | Resultado |
|---------|-------------------|-----------|
| Upload novo com categoria | true | Insere em legado + segmentada |
| Upload novo sem categoria | true | Insere apenas em legado |
| Upload legado | false | Insere apenas em legado |
| RAG query com module_type | true | Consulta base segmentada |
| RAG query sem module_type | false | Consulta legado |
| RAG query, KB vazia | true | Fallback automático para legado |

---

## 7. METADADOS DE RESPOSTA

```json
{
  "success": true,
  "answer": "...",
  "metadata": {
    "documents_found": 3,
    "documents_used": [
      {"id": "...", "title": "...", "source_type": "educare"}
    ],
    "file_search_used": true,
    "chunks_retrieved": 1,
    "knowledge_base": {
      "primary_table": "kb_baby",
      "used_table": "kb_baby",
      "fallback_used": false,
      "selection_reason": "module_type is baby"
    },
    "processing_time_ms": 2150
  }
}
```

---

## 8. COMPATIBILIDADE REVERSA

✅ **Zero Breaking Changes:**
- RAG continua funcionando normalmente sem parâmetros novos
- Default: `module_type='baby'` se não fornecido
- Se `ENABLE_SEGMENTED_KB=false`: comportamento 100% legado
- Documentos sem categoria vão para legado automaticamente
- Fallback automático garante respostas mesmo com KB vazia

---

## 9. IMPACTO NO FLUXO

### Antes (Fase 4):
```
Upload → knowledge_documents SEMPRE
        + kb_baby/mother/professional (se categoria)

RAG Query → knowledge_documents SEMPRE
```

### Depois (Fase 5):
```
Upload → knowledge_documents SEMPRE
        + kb_baby/mother/professional (se categoria)

RAG Query → Seleciona base inteligentemente
          → Consulta base primária
          → Fallback para legado se vazio
          → Retorna metadata com rastreamento
```

---

## 10. STATUS DA IMPLEMENTAÇÃO

| Componente | Status | Detalhes |
|------------|--------|----------|
| selectKnowledgeDocuments() | ✅ Refatorizado | Com seletor + fallback |
| ask() | ✅ Adaptado | Novo contexto de módulo |
| askWithBabyId() | ✅ Melhorado | Force baby module |
| Metadata tracking | ✅ Implementado | Qual base foi usada |
| Backward Compatibility | ✅ Validado | Default behavior mantido |

---

## 11. PRÓXIMOS PASSOS

1. **FASE 6-UPGRADE**: Métricas e monitoramento (opção)
2. **FASE 7-UPGRADE**: Testes end-to-end e migração assistida

---

## 12. OBSERVAÇÕES IMPORTANTES

### Para Desenvolvedores
- Sempre forneça `module_type` quando contexto é claro
- Fallback automático = respostas confiáveis mesmo em transição
- Consulte metadados para debug de qual base foi usada

### Para Operações
- Monitor qual base está sendo usada via logs `[RAG] Selecionando documentos`
- Se muitos fallbacks: documentos podem estar faltando na base primária
- Feature flag `ENABLE_SEGMENTED_KB` pode ser alterada em runtime via env var

---

*Documento gerado automaticamente - Fase 5-UPGRADE*
