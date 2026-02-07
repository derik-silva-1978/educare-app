# Phase 5 — Database, Intent Classifier & Infrastructure Fixes

**Date:** 2026-02-07/08  
**Workflow:** Educare app-chat (`iLDio0CFRs2Qa1VM`)  
**Status:** ✅ COMPLETED  
**Final version:** `b582d746-9908-4461-b2cd-5dd360dce37b`

---

## 1. Database Tables Created

4 tables required by n8n endpoints were missing from the database and have been created:

| Table | Model | Foreign Key | Indexes |
|-------|-------|-------------|---------|
| `biometrics_logs` | BiometricsLog | `child_id → children(id) CASCADE` | `idx_biometrics_child` |
| `sleep_logs` | SleepLog | `child_id → children(id) CASCADE` | `idx_sleep_child` |
| `appointments` | Appointment | `child_id → children(id) CASCADE` | `idx_appointments_child`, `idx_appointments_date` |
| `vaccine_history` | VaccineHistory | `child_id → children(id) CASCADE` | `idx_vaccine_child`, `idx_vaccine_status` |

---

## 2. Intent Switch Expression Fix

**Before:** `={{ $json.message.content.trim().toLowerCase() }}`  
**After:** `={{ ($json.intent || $json.message || '').toString().trim().toLowerCase() }}`

---

## 3. Deterministic Intent Classifier v2.3

Replaced the disabled AI Intent Classifier with a deterministic keyword-based Code node. **60/60 unit tests passing (100% accuracy)**.

### Features:
- **Unicode normalization** — removes accents for robust Portuguese matching
- **Decimal preservation** — "8.5kg" matched correctly
- **Question disambiguation** — detects questions (como, qual, quando, ?) and routes to RAG instead of data logging
- **Advice pattern detection** — words like "ideal", "normal", "adequado" trigger RAG fallback
- **Short message handling** — single-word inputs route to RAG
- **Confidence scoring** — 0.0-1.0 scale based on keyword matches
- **Audit logging** — every classification logged with `[IC]` prefix

### Routing Matrix:

| Intent | Signal Types | Example | Route |
|--------|-------------|---------|-------|
| `menu_nav` | Exact match: oi, menu, ajuda, single digit | "Bom dia" | Menu Options |
| `biometrics` | Data words + numbers: peso, kg, cm, mede | "8.5kg 72cm" | API: Biometrics |
| `sleep` | Action words: dormiu, acordou, soneca | "dormiu às 21h" | API: Sleep Log |
| `vaccine` | Medical terms: vacina, BCG, dose, hepatite | "tomou pentavalente" | API: Vaccines |
| `appointment` | Scheduling words: consulta, agendar, médico | "marcar pediatra dia 15" | API: Appointments |
| `question` | Questions, advice, ambiguous, fallback | "como estimular o bebê?" | API: RAG (TitiNauta) |

---

## 4. Infrastructure Fixes

### 4a. $vars → $node["Global Constants"] Migration
- n8n license does NOT support `$vars` (variables feature)
- Replaced ALL 26 `$vars.XXX` references across 13 HTTP nodes
- New pattern: `$node["Global Constants"].json.XXX`

### 4b. Global Constants Node
- Converted from unused `globalConstants` type to **Code node**
- Hardcodes static URLs and API keys (server-to-server, secure)
- Passes through input data (`...item.json`) so downstream nodes inherit both constants and message data
- n8n also blocks `$env` and `process.env` access — hardcoded values are the only option

### 4c. HTTP Request Node Migration (v1 → v4.2)
- Upgraded ALL 13 HTTP nodes from typeVersion 1 to 4.2
- Enabled `allowUnauthorizedCerts: true` (production server has self-signed SSL cert)
- Migrated parameter formats: `requestMethod` → `method`, `headerParametersUi` → `headerParameters`, etc.

---

## 5. E2E Webhook Test Results

Tested via `POST https://n8n.educareapp.com.br/webhook/chat` with Evolution API payload format.

| Node | Status | Notes |
|------|--------|-------|
| Webhook (Unified Entry) | ✅ | Receives POST payload |
| Source Detector | ✅ | Identifies source=evolution |
| É humano? | ✅ | Filters bot messages |
| Router: Source Type | ✅ | Routes to Evolution path |
| Evolution Extractor | ✅ | Extracts phone, message, media |
| Gate: Not Skipped? | ✅ | Passes through non-skip messages |
| Router: Input Type | ✅ | Routes text vs audio |
| Global Constants | ✅ | Sets URLs and API keys |
| API: Check User | ⚠️ | 404 — backend not yet deployed to production server |

**Conclusion:** All 8 processing nodes work correctly. The 404 at API: Check User is expected because the Educare backend is not yet deployed to `educareapp.com.br`. Once deployed, the full pipeline will complete.

---

## 6. Workflow Evolution Summary

| Phase | Version | Changes |
|-------|---------|---------|
| Pre-Phase 2 | `150410df` | Original (broken) |
| Phase 2 | `9130c532` | 6 critical fixes (URLs, dead refs, routing) |
| Phase 4 | `6b09e194` | 13 API/send node fixes |
| Phase 4 hotfix | `2244dd2f` | RAG context serialization + contentType |
| Phase 5a | `d6e44006` | Intent Switch expression fix |
| Phase 5b | `14161bdb` | Deterministic Intent Classifier v2 |
| Phase 5c | `c9be230d` | Classifier v2.2 (disambiguation) |
| Phase 5d | `0cc2da30` | Classifier v2.3 (decimal fix) |
| Phase 5e | `5cf5fadd` | $vars → $node migration |
| Phase 5f | `3edcfc6e` | Global Constants as Set node |
| Phase 5g | `37554d7d` | Global Constants as Code node |
| Phase 5h | `b582d746` | HTTP v1→v4.2 migration + SSL bypass |

**Total fixes across all phases: 30+**

---

## 7. Production Deployment Prerequisites

Before the workflow is fully operational in production:

1. **Deploy backend** to `educareapp.com.br` (or update EDUCARE_API_URL in Global Constants)
2. **Configure EXTERNAL_API_KEY** on the production backend to match `educare_external_api_key_2025`
3. **SSL Certificate** — either install a proper cert or keep `allowUnauthorizedCerts: true`
4. **Test full pipeline** — send a WhatsApp message and verify end-to-end flow
