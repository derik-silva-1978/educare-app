# Fase 11-UPGRADE: RAG Auto-Melhoramento

**Data:** Dezembro 9, 2025  
**Status:** ✅ IMPLEMENTADA  
**Dependências:** FASES 1-10 completas

---

## 1. VISÃO GERAL

A Fase 11 implementa o **sistema de auto-melhoramento do RAG** através de:

- ✅ Coleta e análise de feedback
- ✅ Rastreamento de eventos
- ✅ Análise de qualidade automatizada
- ✅ Geração de sugestões de melhoria via LLM
- ✅ Dashboard de maturidade
- ✅ Exportação de dados para análise

---

## 2. ARQUITETURA

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│  Usuário/App    │────▶│  RAG Response    │────▶│  Feedback Submit   │
└─────────────────┘     └──────────────────┘     └────────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│  LLM Analysis   │◀────│  Quality Job     │◀────│  Feedback Store    │
└─────────────────┘     └──────────────────┘     └────────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Suggestions    │────▶│  Human Review    │
└─────────────────┘     └──────────────────┘
```

---

## 3. COMPONENTES

### 3.1 Feedback Service

**Arquivo:** `ragFeedbackService.js`

| Método | Descrição |
|--------|-----------|
| `submitFeedback()` | Registra feedback do usuário |
| `logEvent()` | Rastreia eventos do RAG |
| `getFeedbackStats()` | Estatísticas agregadas |
| `getEventStats()` | Estatísticas de eventos |
| `analyzeQuality()` | Análise automática de qualidade |
| `generateImprovementSuggestions()` | Gera sugestões via LLM |
| `getMaturityDashboard()` | Dashboard completo |
| `exportData()` | Exporta dados para análise |

---

## 4. COLETA DE FEEDBACK

### 4.1 Estrutura de Feedback

```javascript
{
  response_id: "uuid",
  query: "Quando o bebê começa a andar?",
  rating: 4,              // 1-5
  feedback_type: "helpful", // helpful, not_helpful, incorrect, missing_info
  comment: "Resposta clara!",
  user_id: "uuid",
  module: "baby"
}
```

### 4.2 Tipos de Feedback

| Tipo | Significado |
|------|-------------|
| `helpful` | Resposta útil |
| `not_helpful` | Não ajudou |
| `incorrect` | Informação errada |
| `missing_info` | Faltou informação |
| `irrelevant` | Fora do assunto |

### 4.3 Endpoint

```bash
POST /api/metrics/rag/feedback
Content-Type: application/json

{
  "response_id": "...",
  "query": "...",
  "rating": 4,
  "feedback_type": "helpful",
  "comment": "Ótima resposta!"
}
```

---

## 5. RASTREAMENTO DE EVENTOS

### 5.1 Tipos de Eventos

| Evento | Quando Ocorre |
|--------|---------------|
| `query_received` | Nova consulta |
| `kb_selected` | Base selecionada |
| `fallback_used` | Fallback acionado |
| `response_generated` | Resposta pronta |
| `feedback_submitted` | Feedback recebido |
| `error_occurred` | Erro no pipeline |

### 5.2 Uso Interno

```javascript
const { logEvent } = require('./ragFeedbackService');

logEvent('query_received', {
  query: "...",
  module: "baby",
  user_id: "..."
});
```

---

## 6. ANÁLISE DE QUALIDADE

### 6.1 Métricas Calculadas

- Rating médio (últimos 30 dias)
- Distribuição por tipo de feedback
- Taxa de fallback
- Eventos por módulo

### 6.2 Níveis de Saúde

| Nível | Critério |
|-------|----------|
| `healthy` | Rating >= 4.0 |
| `moderate` | Rating >= 3.0 |
| `needs_attention` | Rating < 3.0 |

### 6.3 Endpoint

```bash
GET /api/metrics/rag/quality-analysis?days=30
Authorization: Bearer <token>
```

---

## 7. SUGESTÕES DE MELHORIA VIA LLM

### 7.1 Funcionamento

1. Coleta feedback negativo recente
2. Envia para LLM com contexto
3. Recebe padrões, gaps e sugestões
4. Armazena para revisão humana

### 7.2 Configuração

```bash
RAG_AUTO_ANALYSIS=true
RAG_IMPROVEMENT_MODEL=gpt-4o-mini
```

### 7.3 Saída

```json
{
  "patterns": [
    "Usuários perguntam sobre amamentação mas docs focam em fórmula"
  ],
  "knowledge_gaps": [
    "Falta conteúdo sobre amamentação noturna"
  ],
  "suggestions": [
    {
      "priority": "high",
      "action": "Adicionar documentos sobre amamentação noturna",
      "rationale": "3 feedbacks negativos mencionam este tópico"
    }
  ]
}
```

### 7.4 Endpoint

```bash
POST /api/metrics/rag/improvement-suggestions
Authorization: Bearer <token>
```

---

## 8. DASHBOARD DE MATURIDADE

### 8.1 Score de Maturidade

O score (0-100) é calculado com base em:

| Fator | Peso |
|-------|------|
| Rating médio | +0 a +20 |
| Volume de feedback | +0 a +10 |
| Taxa de fallback | -10 a +10 |

### 8.2 Níveis

| Nível | Score | Significado |
|-------|-------|-------------|
| `mature` | ≥80 | Sistema otimizado |
| `developing` | ≥60 | Em evolução |
| `basic` | ≥40 | Funcional básico |
| `initial` | <40 | Início |

### 8.3 Endpoint

```bash
GET /api/metrics/rag/maturity
Authorization: Bearer <token>
```

### 8.4 Resposta

```json
{
  "maturity": {
    "score": 72,
    "level": "developing",
    "factors": [...]
  },
  "feedback_summary": {
    "total_last_30_days": 150,
    "avg_rating": 4.2
  },
  "health": "healthy",
  "pending_improvements": 3,
  "top_suggestions": [...]
}
```

---

## 9. ENDPOINTS COMPLETOS

### FASE 11 - Feedback & Auto-Melhoramento

| Endpoint | Método | Descrição | Auth |
|----------|--------|-----------|------|
| `/api/metrics/rag/feedback` | POST | Submete feedback | - |
| `/api/metrics/rag/feedback/stats` | GET | Estatísticas de feedback | Token |
| `/api/metrics/rag/maturity` | GET | Dashboard de maturidade | Owner |
| `/api/metrics/rag/quality-analysis` | GET | Análise de qualidade | Owner |
| `/api/metrics/rag/improvement-suggestions` | POST | Gera sugestões LLM | Owner |
| `/api/metrics/rag/suggestions` | GET | Lista sugestões | Owner |
| `/api/metrics/rag/export` | GET | Exporta dados | Owner |

---

## 10. CONFIGURAÇÃO

### .env Variables (FASE 11)

```bash
# Feedback System
RAG_FEEDBACK_ENABLED=true
RAG_AUTO_ANALYSIS=true
RAG_IMPROVEMENT_MODEL=gpt-4o-mini
RAG_STORE_MAX_SIZE=10000
```

---

## 11. FLUXO DE MELHORIA CONTÍNUA

```
1. Usuários interagem com RAG
         ↓
2. Feedback é coletado automaticamente
         ↓
3. Sistema analisa padrões semanalmente
         ↓
4. LLM gera sugestões de melhoria
         ↓
5. Admin revisa sugestões
         ↓
6. Melhorias são implementadas
         ↓
7. Ciclo recomeça
```

---

## 12. EXEMPLO DE USO COMPLETO

```javascript
// 1. Coletar feedback após resposta do RAG
const feedbackResult = ragFeedbackService.submitFeedback({
  response_id: response.id,
  query: "Quando bebê anda?",
  rating: 4,
  feedback_type: "helpful",
  user_id: user.id,
  module: "baby"
});

// 2. Verificar estatísticas (admin)
const stats = ragFeedbackService.getFeedbackStats({
  module: "baby",
  days: 30
});

// 3. Analisar qualidade
const analysis = await ragFeedbackService.analyzeQuality();

// 4. Gerar sugestões
const suggestions = await ragFeedbackService.generateImprovementSuggestions();

// 5. Ver dashboard completo
const dashboard = await ragFeedbackService.getMaturityDashboard();
```

---

## 13. INTEGRAÇÃO COM FRONTEND

### Widget de Feedback

```jsx
function FeedbackWidget({ responseId, query }) {
  const submitFeedback = async (rating, type) => {
    await fetch('/api/metrics/rag/feedback', {
      method: 'POST',
      body: JSON.stringify({ response_id: responseId, query, rating, feedback_type: type })
    });
  };

  return (
    <div>
      <span>Esta resposta foi útil?</span>
      <button onClick={() => submitFeedback(5, 'helpful')}>👍</button>
      <button onClick={() => submitFeedback(1, 'not_helpful')}>👎</button>
    </div>
  );
}
```

---

## 14. PRÓXIMOS PASSOS (PÓS-FASE 11)

1. **Persistência em BD**: Migrar stores em memória para PostgreSQL
2. **Jobs Agendados**: Análise automática semanal
3. **Alertas**: Notificar quando saúde cair
4. **A/B Testing**: Comparar versões de KB
5. **Auto-Ingestão**: Adicionar docs automaticamente baseado em gaps

---

*Documento gerado automaticamente - Fase 11-UPGRADE*
