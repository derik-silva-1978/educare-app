# Fase 6-UPGRADE: Métricas e Ajuste Fino

**Data:** Dezembro 9, 2025  
**Status:** ✅ CONCLUÍDA  
**Dependências:** FASE 5 completada

---

## 1. VISÃO GERAL

A Fase 6 implementa um sistema completo de métricas e monitoramento do RAG:
- Coleta automática de dados de cada query
- Agregações em tempo real
- Endpoints REST para consulta de métricas
- Health check do RAG
- Rastreamento por módulo e base de conhecimento

---

## 2. COMPONENTES IMPLEMENTADOS

### 2.1 RAG Metrics Service

**Arquivo:** `services/ragMetricsService.js`

**Funcionalidades:**
- `recordQuery()` - Registra dados de cada query
- `getAggregates()` - Métricas agregadas gerais
- `getRecentQueries(limit)` - Últimas N queries
- `getModuleStats()` - Estatísticas por módulo (baby/mother/professional)
- `getKnowledgeBaseStats()` - Uso de cada base de conhecimento
- `getHealthCheck()` - Status geral do RAG

**Dados Registrados por Query:**
```javascript
{
  timestamp: ISO timestamp,
  question: (primeiros 100 chars),
  module_type: 'baby|mother|professional|unknown',
  success: boolean,
  response_time_ms: number,
  documents_found: number,
  knowledge_base: {
    primary_table: 'kb_baby|kb_mother|kb_professional|knowledge_documents',
    used_table: idem,
    fallback_used: boolean
  },
  file_search_used: boolean,
  chunks_retrieved: number,
  error: string|null
}
```

### 2.2 Integração com RAG Service

**Arquivo:** `services/ragService.js`

**Alterações:**
- Importa `ragMetricsService`
- Registra cada query (sucesso e falha)
- Passa contexto completo (module_type, KB stats, processing time)
- Tratamento de erros com logging

### 2.3 Endpoints REST de Métricas

**Arquivo:** `routes/metricsRoutes.js`

**Endpoints Disponíveis:**

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/metrics/rag/aggregates` | GET | Agregações gerais |
| `/api/metrics/rag/recent` | GET | Últimas N queries |
| `/api/metrics/rag/by-module` | GET | Stats por módulo |
| `/api/metrics/rag/knowledge-bases` | GET | Stats de KBs |
| `/api/metrics/rag/health` | GET | Health check |
| `/api/metrics/rag/reset` | POST | Reset de métricas (Super Admin) |

---

## 3. EXEMPLOS DE USO

### 3.1 Obter Agregações Gerais

```bash
curl -X GET http://localhost:3001/api/metrics/rag/aggregates \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "aggregated": {
      "total_queries": 150,
      "avg_response_time_ms": 2145,
      "knowledge_base_usage": {
        "kb_baby": 85,
        "kb_mother": 35,
        "kb_professional": 20,
        "knowledge_documents": 10
      },
      "fallback_count": 5,
      "error_count": 3,
      "file_search_success_rate": 92,
      "last_updated": "2025-12-09T14:33:22.000Z"
    },
    "recorded_queries_sample": [...]
  }
}
```

### 3.2 Verificar Health do RAG

```bash
curl -X GET http://localhost:3001/api/metrics/rag/health \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "success": true,
  "status": "healthy",
  "metrics": {
    "success_rate_percent": 95,
    "avg_response_time_ms": 2050,
    "fallback_rate_percent": 3,
    "recent_queries_analyzed": 100,
    "total_queries_recorded": 5240
  }
}
```

### 3.3 Estatísticas por Módulo

```bash
curl -X GET http://localhost:3001/api/metrics/rag/by-module \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "baby": {
      "count": 120,
      "avg_response_time_ms": 2100,
      "success_rate": 96,
      "error_count": 5
    },
    "mother": {
      "count": 40,
      "avg_response_time_ms": 2200,
      "success_rate": 92,
      "error_count": 3
    },
    "professional": {
      "count": 25,
      "avg_response_time_ms": 2300,
      "success_rate": 88,
      "error_count": 3
    },
    "unknown": {
      "count": 0,
      "avg_response_time_ms": 0,
      "success_rate": 0,
      "error_count": 0
    }
  }
}
```

### 3.4 Uso de Bases de Conhecimento

```bash
curl -X GET http://localhost:3001/api/metrics/rag/knowledge-bases \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "kb_baby": {
      "primary_count": 85,
      "used_count": 82,
      "avg_documents_found": 3.2,
      "avg_chunks_retrieved": 1.8
    },
    "kb_mother": {
      "primary_count": 35,
      "used_count": 35,
      "avg_documents_found": 2.9,
      "avg_chunks_retrieved": 1.5
    },
    "kb_professional": {
      "primary_count": 20,
      "used_count": 18,
      "avg_documents_found": 2.5,
      "avg_chunks_retrieved": 1.2
    },
    "knowledge_documents": {
      "primary_count": 10,
      "used_count": 15,
      "avg_documents_found": 2.1,
      "avg_chunks_retrieved": 0.8
    }
  }
}
```

---

## 4. HEALTH CHECK STATUS

O endpoint `/api/metrics/rag/health` retorna um status geral:

| Status | Condição | Ação Recomendada |
|--------|----------|-----------------|
| `healthy` | Success rate ≥ 80% | Nenhuma ação necessária |
| `degraded` | Success rate 50-80% | Monitorar e investigar |
| `unhealthy` | Success rate < 50% | Ação imediata necessária |
| `no-data` | Sem queries recentes | Aguardar dados |

---

## 5. ARMAZENAMENTO DE MÉTRICAS

**Características:**
- In-memory (não persistente entre reinicializações)
- Últimas 1000 queries mantidas
- Agregações atualizadas a cada nova query
- Reseta com `POST /api/metrics/rag/reset` (Super Admin)

**Para Persistência (Fase 7+):**
- Considerar armazenar em PostgreSQL
- Tabelas: `rag_queries` e `rag_aggregates`
- Purga automática de dados antigos

---

## 6. INTEGRAÇÃO COM RAG SERVICE

```javascript
// Dentro de ask() e catch()
ragMetricsService.recordQuery({
  question,
  module_type: filters.module_type,
  success: true/false,
  response_time_ms: processingTime,
  primary_table: docsResult.metadata?.primary_table,
  used_table: docsResult.metadata?.used_table,
  fallback_used: docsResult.metadata?.fallback_used,
  documents_found: docsResult.data.length,
  file_search_used: fileSearchUsed,
  chunks_retrieved: retrievedChunks.length,
  error: error?.message || null
});
```

---

## 7. LOGGING

Cada query registra no console:
```
[RAGMetrics] Query registrada - módulo: baby, tempo: 2145ms, sucesso: true
```

---

## 8. STATUS DA IMPLEMENTAÇÃO

| Componente | Status | Detalhes |
|------------|--------|----------|
| ragMetricsService.js | ✅ Criado | 6 métodos públicos |
| Integração RAG | ✅ Implementada | Registra queries automático |
| Routes metricsRoutes.js | ✅ Criadas | 6 endpoints REST |
| Health Check | ✅ Implementado | Status + métricas |
| Autenticação | ✅ Validada | Requer token JWT |
| Autorização reset | ✅ Validada | Apenas Super Admin |

---

## 9. PRÓXIMOS PASSOS (Fase 7)

1. **Persistência de Métricas**
   - Migração para PostgreSQL
   - Tabelas: `rag_queries`, `rag_aggregates`
   - Limpeza automática de dados antigos

2. **Dashboard de Métricas**
   - Frontend React component
   - Gráficos de tendência
   - Alertas em tempo real

3. **Testes End-to-End**
   - Validação de coleta de métricas
   - Testes de saúde do sistema

---

## 10. OBSERVAÇÕES OPERACIONAIS

### Monitoramento Recomendado
- Verifique `/health` a cada 5 minutos
- Alerte se `success_rate < 80%`
- Alerte se `avg_response_time_ms > 5000`
- Verifique `fallback_rate` - alto pode indicar falta de documentos na KB primária

### Debug
- Use `/recent?limit=50` para ver últimas queries e erros
- Use `/by-module` para identificar qual módulo tem problemas
- Use `/knowledge-bases` para balancear documentos entre tabelas

---

*Documento gerado automaticamente - Fase 6-UPGRADE*
