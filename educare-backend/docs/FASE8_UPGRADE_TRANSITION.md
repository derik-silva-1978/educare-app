# Fase 8-UPGRADE: Transição Progressiva para Base Segmentada

**Data:** Dezembro 9, 2025  
**Status:** ✅ IMPLEMENTADA  
**Dependências:** FASE 7 completada

---

## 1. VISÃO GERAL

A Fase 8 implementa a **transição progressiva** do RAG para operar totalmente nas bases segmentadas:

- ✅ Flags granulares de fallback por módulo
- ✅ Modo "strict" (sem legacy) para cada módulo
- ✅ Telemetria avançada para diagnóstico
- ✅ Endpoint de prontidão para desligamento
- ✅ Mensagem de fallback amigável
- ✅ Reversibilidade total via .env

---

## 2. FLAGS DE CONTROLE DE MIGRAÇÃO

### 2.1 Variáveis de Ambiente

Adicionar ao `.env`:

```bash
# Master switch para KB segmentada
ENABLE_SEGMENTED_KB=true

# Fallback global (backward compatibility)
KB_FALLBACK_ENABLED=true

# FASE 08: Flags granulares por módulo
USE_LEGACY_FALLBACK_FOR_BABY=true
USE_LEGACY_FALLBACK_FOR_MOTHER=true
USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=true

# Logging detalhado
KB_LOG_SELECTIONS=true
```

### 2.2 Comportamento das Flags

| Flag | Valor | Comportamento |
|------|-------|---------------|
| `USE_LEGACY_FALLBACK_FOR_BABY=true` | Habilitado | Fallback para `knowledge_documents` se `kb_baby` vazia |
| `USE_LEGACY_FALLBACK_FOR_BABY=false` | STRICT MODE | Nunca usa legacy, retorna mensagem amigável se vazio |

### 2.3 Hierarquia de Controle

```
ENABLE_SEGMENTED_KB=false → Usa apenas knowledge_documents (legacy)
    ↓ (se true)
KB_FALLBACK_ENABLED=false → Nunca usa fallback para nenhum módulo
    ↓ (se true)
USE_LEGACY_FALLBACK_FOR_<MODULE>=false → STRICT MODE para esse módulo específico
```

---

## 3. MODO STRICT

### 3.1 Como Funciona

Quando `USE_LEGACY_FALLBACK_FOR_<MODULE>=false`:

1. O RAG consulta APENAS a base segmentada do módulo
2. Se nenhum documento for encontrado, NÃO consulta a base legacy
3. Retorna mensagem amigável de baixa confiança

### 3.2 Mensagem de Fallback Amigável

```
Ainda estou aprendendo sobre este tema específico. 🌱

Posso ajudar com outras perguntas sobre desenvolvimento infantil, 
saúde materna ou orientações para profissionais. Continue me 
enviando suas dúvidas!

Se precisar de orientação urgente, recomendo consultar um 
profissional de saúde.
```

### 3.3 Metadados Retornados em Modo Strict

```json
{
  "success": true,
  "answer": "Ainda estou aprendendo...",
  "metadata": {
    "documents_found": 0,
    "low_confidence": true,
    "strict_mode": true,
    "knowledge_base": {
      "primary_table": "kb_baby",
      "used_table": "kb_baby",
      "fallback_used": false,
      "strict_mode": true
    }
  }
}
```

---

## 4. TELEMETRIA AVANÇADA

### 4.1 Dados Coletados por Query

```javascript
{
  timestamp: "2025-12-09T...",
  question: "primeiros 100 chars...",
  module_type: "baby|mother|professional",
  success: true/false,
  response_time_ms: 2145,
  documents_found: 3,
  knowledge_base: {
    primary_table: "kb_baby",
    used_table: "kb_baby",
    fallback_used: false,
    strict_mode: true  // NOVO
  },
  file_search_used: true,
  chunks_retrieved: 2,
  relevance_score: 0.85,
  empty_result: false,
  error: null
}
```

### 4.2 Estatísticas por Módulo

```javascript
{
  "baby": {
    "count": 120,
    "avg_response_time_ms": 2100,
    "success_rate": 96,
    "error_count": 5,
    "empty_result_count": 2,
    "empty_result_rate": 2,
    "strict_mode_count": 50,
    "fallback_count": 10
  }
}
```

---

## 5. ENDPOINTS DE DIAGNÓSTICO

### 5.1 Status de Fallback

```bash
GET /api/metrics/rag/fallback-status
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "global": true,
    "segmented_kb_enabled": true,
    "modules": {
      "baby": true,
      "mother": true,
      "professional": true
    },
    "strict_mode": {
      "baby": false,
      "mother": false,
      "professional": false
    }
  }
}
```

### 5.2 Prontidão para Desligamento

```bash
GET /api/metrics/rag/shutdown-readiness
GET /api/metrics/rag/shutdown-readiness?module=baby
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "baby": {
      "ready": true,
      "reason": "Módulo pronto para operar sem fallback",
      "metrics": {
        "query_count": 150,
        "success_rate": 95,
        "empty_rate": 2,
        "fallback_rate": 5,
        "avg_relevance_score": "0.82"
      },
      "thresholds": {
        "min_queries": 50,
        "min_success_rate": 80,
        "max_empty_rate": 5,
        "min_avg_score": 0.75,
        "max_fallback_rate": 10
      },
      "recommendation": "Pode definir USE_LEGACY_FALLBACK_FOR_BABY=false"
    }
  },
  "summary": {
    "modules_ready": 2,
    "modules_total": 3,
    "all_ready": false
  }
}
```

---

## 6. PROCEDIMENTO DE DESLIGAMENTO

### 6.1 Ordem Recomendada

1. **Módulo Bebê** (normalmente tem mais conteúdo)
2. **Módulo Mãe**
3. **Módulo Profissional** (conteúdo técnico, requer mais verificação)

### 6.2 Passos para Cada Módulo

1. **Verificar Prontidão**
   ```bash
   GET /api/metrics/rag/shutdown-readiness?module=baby
   ```

2. **Se `ready: true`**, atualizar `.env`:
   ```bash
   USE_LEGACY_FALLBACK_FOR_BABY=false
   ```

3. **Reiniciar backend** para aplicar nova flag

4. **Monitorar por 48-72 horas**:
   - Taxa de sucesso
   - Taxa de resultados vazios
   - Feedback dos usuários

5. **Se problemas detectados**, reverter:
   ```bash
   USE_LEGACY_FALLBACK_FOR_BABY=true
   ```

---

## 7. MONITORAMENTO PÓS-DESLIGAMENTO

### 7.1 Métricas Críticas

- **Taxa de sucesso** > 80%
- **Taxa de resultados vazios** < 5%
- **Tempo médio de resposta** < 5000ms

### 7.2 Logs a Observar

```
[RAG] STRICT MODE: Retornando resposta de baixa confiança para módulo baby
[KnowledgeBaseSelector] { strict_mode: true, reason: "..." }
```

### 7.3 Alertas Recomendados

Se em 24 horas:
- Taxa de `empty_result` > 10%
- Taxa de sucesso < 70%

→ **Reativar fallback imediatamente**

---

## 8. REVERSIBILIDADE

### 8.1 Rollback Instantâneo

Basta alterar a flag no `.env` e reiniciar:

```bash
USE_LEGACY_FALLBACK_FOR_BABY=true
USE_LEGACY_FALLBACK_FOR_MOTHER=true
USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=true
```

### 8.2 Sem Alteração de Código

Todo o controle é feito via variáveis de ambiente. O código detecta automaticamente as flags na inicialização.

---

## 9. CHECKLIST OBRIGATÓRIO

Antes de desligar fallback para qualquer módulo:

- [ ] Bases segmentadas têm volume suficiente de dados
- [ ] Migração da base legado preencheu documentos
- [ ] Ranking segmentado funciona bem
- [ ] Logs mostram relevância satisfatória (>0.75)
- [ ] Taxa de respostas vazias < 5%
- [ ] Flags foram testadas em ambiente de desenvolvimento
- [ ] Rollback via .env está funcionando

---

## 10. ARQUIVOS MODIFICADOS

| Arquivo | Alterações |
|---------|-----------|
| `knowledgeBaseSelector.js` | Flags granulares, modo strict |
| `ragService.js` | Suporte strict mode, mensagem fallback |
| `ragMetricsService.js` | Telemetria avançada, shutdown readiness |
| `metricsRoutes.js` | Novos endpoints de diagnóstico |

---

## 11. PRÓXIMA FASE

**FASE 09-UPGRADE**: Aposentadoria definitiva da base legado
- Backup imutável
- Desativação lógica
- Bloqueio de ingestão
- Testes de consistência

---

*Documento gerado automaticamente - Fase 8-UPGRADE*
