# Fase 10-UPGRADE: Otimizações Enterprise do RAG

**Data:** Dezembro 9, 2025  
**Status:** ✅ IMPLEMENTADA  
**Dependências:** FASES 1-9 completas

---

## 1. VISÃO GERAL

A Fase 10 implementa **otimizações de nível enterprise** para o sistema RAG:

| Componente | Arquivo | Função |
|------------|---------|--------|
| Re-ranking Neural | `rerankingService.js` | Ordenação semântica pós-busca |
| Confidence Score | `confidenceService.js` | Níveis de confiança (high/medium/low) |
| LLM-Assisted Chunking | `chunkingService.js` | Divisão inteligente de documentos |
| Data Augmentation | `dataAugmentationService.js` | Enriquecimento automático |
| Context Safety | `contextSafetyService.js` | Auditor de segurança |
| KB Versioning | `kbVersioningService.js` | Controle de versões |

---

## 2. RE-RANKING NEURAL

### 2.1 Conceito

Após a busca vetorial inicial, o re-ranking usa LLM para reordenar resultados por relevância semântica real.

### 2.2 Configuração

```bash
RERANKING_ENABLED=true
RERANKING_MODEL=gpt-4o-mini
RERANKING_MAX_CANDIDATES=20
RERANKING_TOP_K=5
```

### 2.3 Uso

```javascript
const { rerank } = require('./services/rerankingService');

const result = await rerank(query, documents, {
  module: 'baby',
  topK: 5,
  diversify: true
});

// result.documents - documentos reordenados
// result.stats.avg_score - score médio de relevância
```

### 2.4 Diversificação

O algoritmo agrupa documentos similares e seleciona representantes diversos para evitar redundância.

---

## 3. CONFIDENCE SCORE LAYER

### 3.1 Níveis

| Nível | Score | Significado |
|-------|-------|-------------|
| HIGH | ≥ 0.80 | Alta confiança, múltiplas fontes confirmam |
| MEDIUM | ≥ 0.50 | Confiança moderada, suporte parcial |
| LOW | < 0.50 | Baixa confiança, considerar escalação |

### 3.2 Fatores de Cálculo

- Quantidade de documentos encontrados
- Relevância média dos documentos
- Uso de fallback
- Match do módulo
- Tempo de resposta
- Frases de incerteza na resposta

### 3.3 Configuração

```bash
CONFIDENCE_HIGH_THRESHOLD=0.80
CONFIDENCE_MEDIUM_THRESHOLD=0.50
REQUIRE_HUMAN_BELOW=0.30
```

### 3.4 Uso

```javascript
const { analyzeRAGResponse } = require('./services/confidenceService');

const analysis = analyzeRAGResponse({
  documents,
  query,
  responseText,
  usedFallback: false,
  context: { healthRelated: true }
});

// analysis.level - 'high', 'medium', 'low'
// analysis.requires_human - se precisa escalação
// analysis.recommendations - ações sugeridas
```

---

## 4. LLM-ASSISTED CHUNKING

### 4.1 Estratégias

| Estratégia | Quando Usar |
|------------|-------------|
| `simple` | Textos uniformes, logs |
| `hierarchical` | Documentos com seções (Markdown) |
| `semantic` | Conteúdo complexo, alto custo |

### 4.2 Configuração

```bash
CHUNKING_ENABLED=true
MIN_CHUNK_SIZE=250
MAX_CHUNK_SIZE=1200
CHUNK_OVERLAP_SIZE=100
CHUNKING_LLM_ASSISTED=false  # true para semântico
```

### 4.3 Uso

```javascript
const { prepareForIngestion } = require('./services/chunkingService');

const chunks = await prepareForIngestion(document, {
  strategy: 'hierarchical',
  maxSize: 1000
});

// chunks[0].content - conteúdo do chunk
// chunks[0].section_title - título da seção (se hierarchical)
```

---

## 5. DATA AUGMENTATION

### 5.1 Recursos

- **Perguntas Geradas**: FAQs que o documento responde
- **Entidades Extraídas**: Marcos, idades, sintomas
- **Resumo Automático**: Brief, detailed, bullet
- **Audiência Identificada**: Parents, healthcare, etc.
- **Tags Geradas**: Keywords para indexação

### 5.2 Configuração

```bash
AUGMENTATION_ENABLED=true
AUGMENTATION_MODEL=gpt-4o-mini
```

### 5.3 Uso

```javascript
const { augmentDocument } = require('./services/dataAugmentationService');

const enriched = await augmentDocument(document, {
  skipQuestions: false,
  skipEntities: false,
  skipSummary: false
});

// enriched.augmentation.generated_questions
// enriched.augmentation.entities
// enriched.augmentation.summary
// enriched.augmentation.tags
```

---

## 6. CONTEXT SAFETY AUDITOR

### 6.1 Detecções

| Tipo | O Que Detecta |
|------|---------------|
| Personal Data | CPF, email, telefone, cartão |
| Emergency Terms | Emergência, urgente, grave |
| Harmful Content | Automedicação, ignore médico |
| Quality Issues | Docs antigos, baixa relevância |

### 6.2 Configuração

```bash
CONTEXT_SAFETY_ENABLED=true
BLOCK_UNSAFE_CONTENT=false
LOG_SAFETY_EVENTS=true
```

### 6.3 Uso

```javascript
const { auditContext } = require('./services/contextSafetyService');

const audit = auditContext({
  query,
  documents,
  response
});

// audit.passed - se passou na auditoria
// audit.findings - problemas encontrados
// audit.recommendations - ações sugeridas
// audit.blocked - se deve bloquear resposta
```

### 6.4 Disclaimers Automáticos

```javascript
const { generateDisclaimer } = require('./services/contextSafetyService');

const disclaimers = generateDisclaimer(audit);
// ["⚠️ Se esta é uma emergência médica..."]
```

---

## 7. KB VERSIONING

### 7.1 Conceitos

- **Versão**: Snapshot lógico da KB
- **Snapshot**: Lista de IDs de documentos
- **Change Log**: Histórico de alterações

### 7.2 Configuração

```bash
KB_VERSIONING_ENABLED=true
```

### 7.3 Uso

```javascript
const versioning = require('./services/kbVersioningService');

// Criar versão
versioning.createVersion('baby', {
  description: 'Adicionados 10 novos documentos',
  created_by: 'admin'
});

// Ver histórico
const history = versioning.getVersionHistory('baby', 10);

// Comparar versões
const diff = versioning.compareVersions('baby', v1Id, v2Id);

// Preparar rollback
const plan = versioning.prepareRollback('baby', targetVersionId);
```

---

## 8. INTEGRAÇÃO NO RAG SERVICE

### 8.1 Pipeline Completo

```
Query → Safety Audit → KB Selection → Vector Search → Reranking
       → Confidence Scoring → Response Generation → Safety Check
       → Disclaimer → Final Response
```

### 8.2 Exemplo de Integração

```javascript
// Em ragService.js
const { rerank } = require('./rerankingService');
const { analyzeRAGResponse } = require('./confidenceService');
const { auditContext, generateDisclaimer } = require('./contextSafetyService');

async function askWithEnhancedRAG(query, options) {
  // 1. Audit query
  const queryAudit = auditContext({ query });
  
  // 2. Select KB & Search
  const documents = await selectKnowledgeDocuments(query, options);
  
  // 3. Rerank
  const { documents: rankedDocs } = await rerank(query, documents, options);
  
  // 4. Generate response
  const response = await generateResponse(query, rankedDocs);
  
  // 5. Confidence analysis
  const confidence = analyzeRAGResponse({
    documents: rankedDocs,
    query,
    responseText: response.text
  });
  
  // 6. Final safety audit
  const responseAudit = auditContext({ query, documents: rankedDocs, response: response.text });
  
  // 7. Add disclaimers if needed
  const disclaimers = generateDisclaimer(responseAudit);
  
  return {
    response: response.text,
    confidence,
    disclaimers,
    metadata: { rankedDocs, audits: [queryAudit, responseAudit] }
  };
}
```

---

## 9. CONFIGURAÇÃO COMPLETA

### .env Variables (FASE 10)

```bash
# Re-ranking
RERANKING_ENABLED=true
RERANKING_MODEL=gpt-4o-mini
RERANKING_MAX_CANDIDATES=20
RERANKING_TOP_K=5

# Confidence
CONFIDENCE_HIGH_THRESHOLD=0.80
CONFIDENCE_MEDIUM_THRESHOLD=0.50
REQUIRE_HUMAN_BELOW=0.30

# Chunking
CHUNKING_ENABLED=true
MIN_CHUNK_SIZE=250
MAX_CHUNK_SIZE=1200
CHUNK_OVERLAP_SIZE=100
CHUNKING_LLM_ASSISTED=false

# Augmentation
AUGMENTATION_ENABLED=true
AUGMENTATION_MODEL=gpt-4o-mini

# Safety
CONTEXT_SAFETY_ENABLED=true
BLOCK_UNSAFE_CONTENT=false
LOG_SAFETY_EVENTS=true

# Versioning
KB_VERSIONING_ENABLED=true
```

---

## 10. TESTES

### 10.1 Re-ranking

```bash
# Verificar que reordenação melhora relevância
curl -X POST localhost:3001/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "marcos de desenvolvimento 6 meses", "module": "baby"}'
```

### 10.2 Confidence

```bash
# Verificar níveis de confiança na resposta
# A resposta deve incluir confidence.level
```

### 10.3 Safety

```bash
# Testar com query contendo dados sensíveis
# Deve detectar e sanitizar
```

---

## 11. MONITORAMENTO

### Métricas a Acompanhar

- Tempo médio de reranking
- Distribuição de confidence levels
- Quantidade de escalações humanas
- Findings de segurança por tipo
- Versões criadas por KB

---

## 12. PRÓXIMA FASE

**FASE 11-UPGRADE**: RAG Auto-Melhoramento
- Tabelas `rag_events` e `rag_feedback`
- Job de análise de qualidade
- Gerador de sugestões via LLM
- Human-in-the-loop controls
- Dashboard de maturidade

---

*Documento gerado automaticamente - Fase 10-UPGRADE*
