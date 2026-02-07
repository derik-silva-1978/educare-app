# Phase 5 — Database Verification & Intent Classifier

**Date:** 2026-02-07  
**Workflow:** Educare app-chat (`iLDio0CFRs2Qa1VM`)  
**Status:** ✅ COMPLETED  
**Final version:** `8930c704-2207-487e-bfab-bab59e73678c`

---

## 1. Database Tables Created

4 tables required by n8n endpoints were missing from the database and have been created:

| Table | Model | Foreign Key | Indexes |
|-------|-------|-------------|---------|
| `biometrics_logs` | BiometricsLog | `child_id → children(id) CASCADE` | `idx_biometrics_child` |
| `sleep_logs` | SleepLog | `child_id → children(id) CASCADE` | `idx_sleep_child` |
| `appointments` | Appointment | `child_id → children(id) CASCADE` | `idx_appointments_child`, `idx_appointments_date` |
| `vaccine_history` | VaccineHistory | `child_id → children(id) CASCADE` | `idx_vaccine_child`, `idx_vaccine_status` |

**Pre-existing confirmed:**
- `content_items`: 14 rows (used by Child/Mother Content endpoints)
- `nlpParserService.js`: Already exists with OpenAI-powered parsers for biometrics, sleep, appointments, and vaccines

---

## 2. Intent Switch Expression Fix

**Before:** `={{ $json.message.content.trim().toLowerCase() }}`  
**After:** `={{ ($json.intent || $json.message || '').toString().trim().toLowerCase() }}`

The old expression called `.content` on a string (since extractors set `message` as a string, not an object), which returned `undefined` and broke all intent routing.

The new expression:
- First checks `$json.intent` (set by the new classifier)
- Falls back to `$json.message` (raw user text)
- Uses `.toString()` for safety
- Fallback output remains `4` (RAG/question)

---

## 3. Deterministic Intent Classifier

Replaced the disabled AI Intent Classifier (empty OpenAI node) with a deterministic keyword-based Code node.

**Why deterministic over AI:**
- **Speed:** No API call needed (instant)
- **Cost:** Zero (no OpenAI charges per message)
- **Reliability:** No hallucinations or unpredictable outputs
- **Maintainability:** Easy to add/modify keyword patterns

**Intent routing rules:**

| Intent | Keywords/Patterns | Route |
|--------|------------------|-------|
| `menu_nav` | menu, opções, ajuda, help, início, single digit | → Router: Menu Options |
| `biometrics` | peso, kg, altura, cm, perímetro, cefálico | → API: Biometrics |
| `sleep` | sono, dormiu, acordou, cochilo, soneca, noite | → API: Sleep Log |
| `vaccine` | vacina, bcg, hepatite, pentavalente, dose | → API: Vaccines |
| `appointment` | consulta, médico, pediatra, agendar, exame | → API: Appointments |
| `question` (fallback) | Everything else | → API: RAG (TitiNauta) |

---

## 4. Workflow Evolution Summary

| Phase | Version | Fixes |
|-------|---------|-------|
| Pre-Phase 2 | `150410df` | Original (broken) |
| Phase 2 | `9130c532` | 6 critical fixes (URLs, dead refs, routing) |
| Phase 4 | `6b09e194` | 13 API/send node fixes (methods, params, body) |
| Phase 4 hotfix | `2244dd2f` | RAG context serialization + contentType |
| Phase 5 | `d6e44006` | Intent Switch expression fix |
| Phase 5 final | `8930c704` | Deterministic Intent Classifier |

**Total fixes applied: 22**
