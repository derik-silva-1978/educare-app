# Phase 4 — Smoke Test Report

**Date:** 2026-02-07  
**Workflow:** Educare app-chat (`iLDio0CFRs2Qa1VM`)  
**Status:** ✅ 13 FIXES APPLIED AND VALIDATED  
**Previous version:** `9130c532-37ef-4fb6-a1ba-bb1f4ad46e40`  
**New version:** `6b09e194-6213-4a09-9cb4-bb8b6740adff`

---

## 1. Backend Endpoint Tests

All `/api/n8n/*` endpoints tested against local backend (port 3001):

| Test | Endpoint | Result |
|------|----------|--------|
| T1 | `GET /api/n8n/users/check?phone=5511999999999` (fake) | ✅ `{exists: false}` |
| T2 | `GET /api/n8n/users/check` (no API key) | ✅ `401 API key não fornecida` |
| T3 | `GET /api/n8n/users/check` (no phone) | ✅ `400 Parâmetro phone é obrigatório` |
| T4 | `GET /api/n8n/users/check?phone=98991801628` (real owner) | ✅ `{exists: true, user_id: "04a89..."}`|
| T5 | `GET /api/n8n/content/child?weeks=10` | ✅ Returns content with media |
| T6 | `GET /api/n8n/content/mother?weeks=10` | ✅ Returns content with media |
| T7 | `GET /api/n8n/vaccines/check` (no age_weeks) | ✅ `400 age_weeks é obrigatório` |

**Auth:** Backend uses `EXTERNAL_API_KEY` env var, matched via `x-api-key` header.  
**Key finding:** n8n `$vars.EDUCARE_API_KEY` must equal `EXTERNAL_API_KEY` in backend.

---

## 2. Issues Found & Fixed

### Critical: API Method Mismatches (F8-F11)

4 API nodes were using GET but their backend routes require POST:

| Fix | Node | Was | Now | Body Params |
|-----|------|-----|-----|-------------|
| F8 | API: Biometrics | GET | POST | `{child_id, raw_text}` |
| F9 | API: Sleep Log | GET | POST | `{child_id, raw_text}` |
| F10 | API: RAG (TitiNauta) | GET | POST | `{question, context}` |
| F11 | API: Appointments | GET | POST | `{child_id, raw_text}` |

### Critical: Missing Parameters (F7, F12)

| Fix | Node | Issue | Resolution |
|-----|------|-------|------------|
| F7 | API: Check User | No `phone` query param | Added `phone={{ $input.item.json.phone }}` |
| F12a | API: Vaccines | No query params, no API key | Added `{childId, age_weeks}` + `x-api-key` |
| F12b | API: Child Content | No query params, no API key | Added `{weeks}` + `x-api-key` |
| F12c | API: Mother Content | No query params, no API key | Added `{weeks}` + `x-api-key` |

### Critical: Send Nodes Misconfigured (F13-F14)

All 5 send nodes (4 Evolution + 1 Chatwoot) had no method, body, or headers:

| Fix | Node | Body Params |
|-----|------|-------------|
| F13a | Evo: Send Text | `{number, text}` |
| F13b | Evo: Send Image | `{number, mediatype, media, caption}` |
| F13c | Evo: Send Audio | `{number, audio}` |
| F13d | Evo: Send Document | `{number, mediatype, media, caption}` |
| F14 | Chatwoot: Send Text | `{content, message_type, content_type}` |

---

## 3. Post-Fix Validation

All 13 HTTP nodes validated:

| Node | Method | API Key | Query Params | Body |
|------|--------|---------|-------------|------|
| API: Check User | GET | ✅ | ✅ phone | - |
| API: Biometrics | POST | ✅ | - | ✅ |
| API: Sleep Log | POST | ✅ | - | ✅ |
| API: Vaccines | GET | ✅ | ✅ childId, age_weeks | - |
| API: RAG (TitiNauta) | POST | ✅ | - | ✅ |
| API: Appointments | POST | ✅ | - | ✅ |
| API: Child Content | GET | ✅ | ✅ weeks | - |
| API: Mother Content | GET | ✅ | ✅ weeks | - |
| Chatwoot: Send Text | POST | ✅ | - | ✅ |
| Evo: Send Text | POST | ✅* | - | ✅ |
| Evo: Send Image | POST | ✅* | - | ✅ |
| Evo: Send Audio | POST | ✅* | - | ✅ |
| Evo: Send Document | POST | ✅* | - | ✅ |

*Evo nodes use `$vars.EVOLUTION_API_KEY` — must be configured in n8n variables.

---

## 4. Required n8n Variables (Updated)

| Variable | Purpose | Used By |
|----------|---------|---------|
| `EDUCARE_API_URL` | Backend base URL | 8 API nodes |
| `EDUCARE_API_KEY` | Backend auth (must match `EXTERNAL_API_KEY`) | All 8 API nodes |
| `EVOLUTION_API_URL` | Evolution API base URL | 4 Evo nodes |
| `EVOLUTION_INSTANCE` | WhatsApp instance name | 4 Evo nodes |
| `EVOLUTION_API_KEY` | Evolution API auth key | 4 Evo nodes |
| `CHATWOOT_API_URL` | Chatwoot base URL | 1 Chatwoot node |
| `CHATWOOT_API_TOKEN` | Chatwoot API access token | 1 Chatwoot node |

**Note:** Added 2 new variables: `EVOLUTION_API_KEY` and `CHATWOOT_API_TOKEN`.

---

## 5. Remaining Risks

| Risk | Severity | Description |
|------|----------|-------------|
| AI Intent Classifier disabled | 🟡 Medium | Intent routing depends on message text, not AI classification |
| n8n variables not verified | 🟡 Medium | Cannot check via API (license), must verify in n8n UI |
| httpRequest v1 quirks | ✅ Resolved | POST nodes now use `contentType: json` explicitly; RAG uses raw JSON body |
| No error handling on send | 🟢 Low | If Evo/Chatwoot send fails, user gets no response |

---

## 6. Hotfix Applied

After architect review, two additional fixes were applied:

| Hotfix | Node | Issue | Resolution |
|--------|------|-------|------------|
| H1 | API: Biometrics, Sleep Log, Appointments | Missing `contentType: json` | Added explicit JSON content type |
| H2 | API: RAG (TitiNauta) | `context` sent as string, not object | Switched to raw JSON body (`jsonParameters: true`) with proper nested object |

**Final version:** `2244dd2f-8f72-428a-99f4-e0ef533cf24f`

---

## 6. Next Steps

1. **Verify n8n variables** in Settings → Variables (especially new `EVOLUTION_API_KEY`, `CHATWOOT_API_TOKEN`)
2. **Live smoke test** — Send a real WhatsApp message to validate end-to-end
3. **Decide on AI Intent Classifier** — Enable or replace with deterministic routing
4. **Add error handling** for send node failures (retry or fallback)
