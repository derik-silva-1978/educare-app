# Constants Specification — Educare app-chat Workflow

**Version:** 1.0  
**Date:** 2026-02-07  
**Status:** ✅ Fully migrated to `$vars` pattern

---

## Current State

After Phase 2 fixes, **all 13 HTTP nodes** now use the `$vars` pattern consistently.  
The `Global Constants` node still exists in the workflow but is **no longer referenced by any node**.

---

## Required n8n Variables

These variables must be configured in n8n Settings → Variables:

| Variable | Purpose | Example Value | Used By |
|----------|---------|---------------|---------|
| `EDUCARE_API_URL` | Base URL da API Educare backend | `https://educareapp.com.br` | 8 API nodes |
| `EDUCARE_API_KEY` | API key para autenticação no backend | `(secret)` | All 8 API nodes |
| `EVOLUTION_API_URL` | Base URL da Evolution API (WhatsApp) | `https://api.educareapp.com.br` | 4 Evo send nodes |
| `EVOLUTION_INSTANCE` | Nome da instância Evolution | `educare-chat` | 4 Evo send nodes |
| `CHATWOOT_API_URL` | Base URL da API Chatwoot | `https://chatwoot.educareapp.com.br` | Chatwoot: Send Text |
| `EVOLUTION_API_KEY` | API key da Evolution API | `(secret)` | 4 Evo send nodes |
| `CHATWOOT_API_TOKEN` | Token de acesso da API Chatwoot | `(secret)` | Chatwoot: Send Text |

---

## Usage Map

### EDUCARE_API_URL (8 nodes)

| Node | Endpoint |
|------|----------|
| API: Check User | `/api/n8n/users/check` |
| API: Biometrics | `/api/n8n/biometrics/update` |
| API: Sleep Log | `/api/n8n/sleep/log` |
| API: Vaccines | `/api/n8n/vaccines/check` |
| API: RAG (TitiNauta) | `/api/n8n/rag/ask` |
| API: Appointments | `/api/n8n/appointments/create` |
| API: Child Content | `/api/n8n/content/child` |
| API: Mother Content | `/api/n8n/content/mother` |

### EVOLUTION_API_URL + EVOLUTION_INSTANCE (4 nodes)

| Node | Endpoint Pattern |
|------|-----------------|
| Evo: Send Text | `/message/sendText/{instance}` |
| Evo: Send Image | `/message/sendMedia/{instance}` |
| Evo: Send Audio | `/message/sendWhatsAppAudio/{instance}` |
| Evo: Send Document | `/message/sendMedia/{instance}` |

### CHATWOOT_API_URL (1 node)

| Node | Endpoint Pattern |
|------|-----------------|
| Chatwoot: Send Text | `/api/v1/accounts/{id}/conversations/{id}/messages` |

### EDUCARE_API_KEY (1 node)

| Node | Header |
|------|--------|
| API: Check User | `x-api-key: {value}` |

---

## Global Constants Node

The `Global Constants` node (type `n8n-nodes-globals.globalConstants`) remains in the workflow but has:
- **No parameters** configured
- **No nodes referencing it** (after Phase 2 F6 migration)
- Uses credential `Global Constants account` (ID: `I0U483eFAXTruzVB`)

**Recommendation:** This node can be safely removed in a future cleanup, or kept as a reference. It does not affect workflow execution.

---

## Notes

- The n8n license does not support the Variables REST API (`feat:variables`), so variables must be managed via the n8n UI (Settings → Variables)
- All `$vars` references follow the expression format: `={{ $vars.VARIABLE_NAME }}`
- No node uses the `$node["Global Constants"]` pattern anymore
