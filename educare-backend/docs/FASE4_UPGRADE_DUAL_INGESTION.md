# Fase 4-UPGRADE: Integração da Ingestão Segmentada (Dual Write)

**Data:** Dezembro 9, 2025  
**Status:** ✅ CONCLUÍDA  
**Arquitetura:** ARCHITECTURE_RAG_SEGMENTED_FASE2.md

---

## 1. VISÃO GERAL

A Fase 4 implementa **ingestão dual** (dual write) no controller de upload. Agora documentos são inseridos em:
- **Tabela legada** (`knowledge_documents`) - sempre, para backward compatibility
- **Tabela segmentada** (`kb_baby`, `kb_mother`, `kb_professional`) - opcionalmente, baseado em `knowledge_category`

---

## 2. ARQUITETURA IMPLEMENTADA

```
┌────────────────────────────────────────────────────────────────────────────┐
│                       UPLOAD DO SUPER ADMIN                                │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  POST /api/admin/knowledge/upload                                         │
│       ├─ file (obrigatório)                                              │
│       ├─ title (obrigatório)                                             │
│       ├─ source_type (obrigatório)                                       │
│       ├─ knowledge_category (opcional: baby|mother|professional)         │
│       ├─ age_range, domain, subdomain (para categoria baby)              │
│       ├─ trimester (para categoria mother)                               │
│       └─ specialty (para categoria professional)                         │
│       ↓                                                                   │
│  knowledgeController.uploadDocument()                                    │
│       ├─ Valida arquivo                                                  │
│       ├─ Faz upload para File Search (OpenAI)                           │
│       ├─ Prepara dados legados                                          │
│       ├─ Infere categoria (se não fornecida explicitamente)             │
│       ├─ Prepara dados segmentados (se ENABLE_SEGMENTED_KB=true)       │
│       └─ Chama KnowledgeBaseRepository.insertDualWithCategory()        │
│       ↓                                                                   │
│  KnowledgeBaseRepository.insertDualWithCategory()                        │
│       ├─ INSERT INTO knowledge_documents (sempre)                       │
│       └─ INSERT INTO kb_baby|kb_mother|kb_professional (se categoria) │
│       ↓                                                                   │
│  RETORNA: {legacy_id, segmented_id}                                     │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. MODIFICAÇÕES IMPLEMENTADAS

### 3.1 KnowledgeBaseRepository - Novo Método

**Arquivo:** `repositories/knowledgeBaseRepository.js`

```javascript
async insertDualWithCategory(category, legacyData, segmentedData = null) {
  // 1. Sempre insere em knowledge_documents (backward compatibility)
  // 2. Se segmentedData fornecido E categoria válida:
  //    - Insere em kb_baby (se category='baby')
  //    - Insere em kb_mother (se category='mother')
  //    - Insere em kb_professional (se category='professional')
  // 3. Retorna: { success, data: { legacy, segmented } }
}
```

**Características:**
- Dual write atômico (ambas as inserts ou falha)
- Reference tracking: `segmented_data.migrated_from = legacy_id`
- Suporta inserção apenas legada (se categoria inválida)
- Logging detalhado

---

### 3.2 Knowledge Controller - Novo Upload Flow

**Arquivo:** `controllers/knowledgeController.js`

**Alterações:**
1. Importa `knowledgeBaseRepository`
2. Extrai novos campos do request: `knowledge_category`, `trimester`, `specialty`, `subdomain`
3. Prepara `legacyData` (como antes)
4. Infere categoria se não fornecida explicitamente via `inferCategory(body)`
5. Prepara `segmentedData` (se `ENABLE_SEGMENTED_KB=true`)
6. Adiciona campos específicos da categoria:
   - **baby**: `age_range`, `domain`, `subcategory`
   - **mother**: `trimester`, `domain`, `subcategory`
   - **professional**: `specialty`, `domain`, `subcategory`
7. Chama `insertDualWithCategory()` com ambos os dados
8. Retorna resposta com `legacy_id` e `segmented_id`

**Function: inferCategory()**
```javascript
const inferCategory = (body) => {
  if (body.trimester) return 'mother';
  if (body.specialty) return 'professional';
  if (body.age_range || ['motor', 'cognitivo', 'social', 'linguagem'].includes(body.domain)) {
    return 'baby';
  }
  return null;
};
```

---

## 4. EXEMPLOS DE USO

### 4.1 Upload com Categoria Explícita (Baby)

```bash
curl -X POST http://localhost:3001/api/admin/knowledge/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@documento.pdf" \
  -F "title=Desenvolvimento Motor 0-3 Meses" \
  -F "source_type=educare" \
  -F "knowledge_category=baby" \
  -F "age_range=0-3m" \
  -F "domain=motor" \
  -F "subdomain=coordenação-motora-fina"
```

**Resultado:**
- Insere em `knowledge_documents` (legado)
- Insere em `kb_baby` com `age_range=0-3m`, `domain=motor`
- Retorna ambos os IDs

### 4.2 Upload com Categoria Inferida (Mother)

```bash
curl -X POST http://localhost:3001/api/admin/knowledge/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@documento.pdf" \
  -F "title=Nutrição no Terceiro Trimestre" \
  -F "source_type=oms" \
  -F "trimester=3"  # <-- Infere category='mother'
  -F "domain=nutrição"
```

**Resultado:**
- Insere em `knowledge_documents`
- Insere em `kb_mother` com `trimester=3` (detectado via inferência)

### 4.3 Upload Legado (sem categoria)

```bash
curl -X POST http://localhost:3001/api/admin/knowledge/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@documento.pdf" \
  -F "title=Documento Genérico" \
  -F "source_type=outro"
```

**Resultado:**
- Insere APENAS em `knowledge_documents` (legado)
- `segmented_id` é null

---

## 5. FEATURE FLAGS

### Ativação

Para ativar a ingestão segmentada, defina:
```bash
export ENABLE_SEGMENTED_KB=true
```

### Comportamento

| Flag | Comportamento |
|------|--------------|
| `ENABLE_SEGMENTED_KB=false` (padrão) | Apenas insere em `knowledge_documents` |
| `ENABLE_SEGMENTED_KB=true` | Insere em `knowledge_documents` + base segmentada (se categoria fornecida) |

---

## 6. RESPOSTA DO ENDPOINT

```json
{
  "success": true,
  "message": "Documento de conhecimento cadastrado com sucesso",
  "data": {
    "id": "legacy-uuid",
    "title": "Documento",
    "file_search_id": "file-xyz",
    "category": "baby",
    "segmented_id": "segmented-uuid",
    "indexed": true,
    "warning": null
  }
}
```

---

## 7. COMPATIBILIDADE REVERSA

✅ **Zero Breaking Changes:**
- RAG service continua consultando APENAS `knowledge_documents` (legado)
- Documentos sem categoria vão APENAS para `knowledge_documents`
- Feature flag permite desativação completa
- Clientes que não enviam `knowledge_category` funcionam normalmente

---

## 8. STATUS DA IMPLEMENTAÇÃO

| Componente | Status | Detalhes |
|------------|--------|----------|
| Repository (insertDualWithCategory) | ✅ Implementado | Dual write com reference tracking |
| Controller (uploadDocument) | ✅ Implementado | Novo flow com inferência de categoria |
| inferCategory() | ✅ Implementado | Detecção automática via campo domain/trimester/specialty |
| API Response | ✅ Implementado | Retorna legacy_id + segmented_id |
| Backward Compatibility | ✅ Validado | Sem alterações para requests legados |
| Tests | ⏳ Próximas fases | Cobertura em FASE 7 |

---

## 9. PRÓXIMOS PASSOS

1. **FASE 5-UPGRADE**: Adaptar RAG service para consultar bases segmentadas
2. **FASE 6-UPGRADE**: Métricas e monitoramento
3. **FASE 7-UPGRADE**: Testes e validação end-to-end

---

## 10. TROUBLESHOOTING

### Documento inserido apenas em legado (não em base segmentada)

**Causa:** `ENABLE_SEGMENTED_KB != true` OU categoria inválida

**Solução:**
1. Verifique `ENABLE_SEGMENTED_KB` env var
2. Verifique se `knowledge_category` é um de: `baby`, `mother`, `professional`
3. Verifique inferência automática: se nenhuma categoria fornecida, deve detectar pelos campos

### Erro ao inserir em base segmentada

**Causa:** Campo obrigatório faltando (ex: `content` vazio em kb_baby)

**Solução:**
1. Verifique se todos os campos categoria-específicos são válidos
2. Consulte `DATABASE_KB_SEGMENTED.md` para campos obrigatórios

---

*Documento gerado automaticamente - Fase 4-UPGRADE*
