# Lead CRM Workflow — Audit & Fix Report

**Date:** 2026-02-08  
**Workflow:** Lead CRM (`n6ZpQvp96iPCaIvG`)  
**Status:** ✅ FIXED  
**Final version:** `927e792b-1855-4452-80ac-61af8da1b42d`

---

## 1. Workflow Architecture

The Lead CRM is a **sub-workflow** called by the main "Educare app-chat" workflow when a WhatsApp user is NOT registered in the system.

### Entry & Exit
- **Trigger:** `When Executed by Another Workflow` (called from main workflow)
- **Caller:** `Call 'Agente Lead'` node in main workflow (passes `$json` as `thisFieldAcceptsAnyType`)

### Data Flow
```
When Executed by Another Workflow
  → Normalize (sanitize input, prepare SQL-safe strings)
  → [3 parallel paths]
     ├── UPSERT lead_context → Execute a SQL query3 (debug info)
     ├── lead_summary (SELECT) → long_memory_context → Merge
     └── (direct) → Merge
  
Merge → [3 parallel paths]
  ├── lead_journey (INSERT: log incoming message)
  ├── summary_text → lead_summary1 (UPSERT: save summary)  [was DISABLED]
  └── FUNIL — Resolver etapa e objetivo
        → Code (build AI prompt)
        → AI Agent1 (gpt-4.1-mini + Structured Output Parser)
        → Code in JavaScript (parse AI response)
        → [2 parallel]
           ├── Enviar texto (Evolution API)
           └── Merge1
        → Code in JavaScript2 (normalize response for DB)
        → lead_journey2 (INSERT: log bot reply)
        → Merge2
        → Code in JavaScript1 (advance funnel)
        → Execute a SQL query2 (UPDATE lead_summary.funnel_step)
```

### Components
- **32 nodes** total: 11 Postgres, 8 Code, 3 Merge, 2 OpenAI, 1 AI Agent, 1 Evolution API, 1 Vector Store + embeddings + memory
- **AI Agent:** GPT-4.1-mini with Structured Output Parser (reply_text, contato, instancia)
- **Vector Store:** PGVector for RAG context (tool available to AI agent)
- **Chat Memory:** Postgres-backed persistent memory

---

## 2. Issues Found & Fixed

### FIX 1: UNIQUE Constraint on `lead_context.phone` (CRITICAL)
- **Problem:** `UPSERT lead_context` used `ON CONFLICT (phone)` but DDL had no UNIQUE constraint
- **Fix:** Added `UNIQUE` to `phone VARCHAR(20) NOT NULL UNIQUE`

### FIX 2-4: Credential Unification (CRITICAL)
- **Problem:** DDL nodes (CREATE TABLE) used "Postgres RAG (pgvector)" credential, but runtime nodes used "Postgres_n8n" — tables would be created in one database but queried in another
- **Fix:** Unified ALL 11 Postgres nodes to use "Postgres_n8n" credential (except PGVector Store which correctly uses RAG)

### FIX 5-6: SQL Injection — Phone Quoting
- **Problem:** `UPSERT lead_context` and `lead_summary SELECT` used raw `{{$json.phone}}` without quoting — SQL injection risk
- **Fix:** Added proper phone quoting: `{{$json.phone ? ("'" + $json.phone + "'") : 'NULL'}}`

### FIX 7-8: Re-enabled Disabled Nodes
- **Problem:** `summary_text` and `lead_summary1` were disabled — lead summaries never got saved after AI response
- **Fix:** Re-enabled both nodes, fixed `lead_summary1` credential to Postgres_n8n, added phone quoting

### FIX 9: Code Node v1 → v2
- **Problem:** "Code" node (prompt builder) was typeVersion 1 (outdated)
- **Fix:** Upgraded to typeVersion 2

### FIX 10: Main Workflow — Prepare: No User Msg (CRITICAL)
- **Problem:** `Prepare: No User Msg` hardcoded `$('Chatwoot Extractor')` reference — fails when lead comes from Evolution (WhatsApp direct)
- **Fix:** Added try/catch to support both extractors:
  ```javascript
  try { ref = $('Chatwoot Extractor').item.json; } 
  catch { try { ref = $('Evolution Extractor').item.json; } catch { ref = item.json; } }
  ```

---

## 3. Credential Mapping (Post-Fix)

| Credential | Nodes |
|------------|-------|
| Postgres_n8n | All 11 Postgres nodes (DDL + runtime) |
| Postgres RAG (pgvector) | PGVector Store only |
| OpenAI account | OpenAI Chat Model, OpenAI Chat Model1, Embeddings OpenAI |
| Evolution account | Enviar texto |

---

## 4. Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `lead_context` | Current context per lead | phone (UNIQUE), timestamp, last_message, media_type, context (JSONB) |
| `lead_journey` | Full conversation history | phone, step, message, response, is_audio, timestamp |
| `lead_summary` | AI-generated lead summary | phone (UNIQUE), summary, tags[], funnel_step |

---

## 5. Funnel Logic

The FUNIL node implements a 3-stage sales funnel:

| Stage | Step | Agent Goal |
|-------|------|-----------|
| discovery | qualificar | Qualify lead, understand main need |
| interest | explicar_valor | Explain value, remove objections |
| action | cta | Close with CTA (download link) |

Stage transitions based on:
- Tags from lead_summary (e.g., 'interesse', 'quero_conhecer')
- Keyword detection in user message (e.g., 'preço', 'cadastro', 'baixar')

---

## 6. Remaining Considerations

- **No executions:** Lead CRM has never been executed (backend not yet deployed to production)
- **Full E2E test:** Requires backend deployment to `educareapp.com.br` so API: Check User returns `{exists: false}` instead of 404
- **PGVector Store:** Connected as AI Agent tool but may need knowledge base population for lead-specific FAQs
- **Chat Memory:** Uses Postgres-backed memory for conversation continuity

---

## 7. Workflow Versions

| Version | Changes |
|---------|---------|
| `16fee0ca` | Original (with bugs) |
| `927e792b` | All 10 fixes applied |
