# Phase 10 - Production Readiness Guide

**Date:** February 10, 2026  
**Status:** IMPLEMENTED  
**Dependencies:** Phases 1-9 complete

---

## 1. Overview

Phase 10 ensures the WhatsApp conversation system is production-ready with:
- Auth security best practices (JWT refresh token separation, password policies)
- Global error handling (unhandledRejection, uncaughtException)
- Database indexes verified for all conversation tables
- Comprehensive API test suite (40 tests)

---

## 2. Auth Security Improvements

| Change | Before | After |
|--------|--------|-------|
| Access Token TTL | 24h | 1h |
| Refresh Token | Same as access token | Separate secret, 7d TTL |
| Password Salt Rounds | 10 | 12 |
| Password Policy | None | Min 6, Max 128 chars |
| Random Generation | Math.random() | crypto.randomInt/randomBytes |
| Password Logging | Logged first 2 chars | Removed entirely |

### Files Changed
- `src/config/auth.js` - Added refreshSecret, passwordPolicy, shorter TTL
- `src/controllers/authController.js` - generateRefreshToken, validatePasswordStrength, crypto-secure randoms
- `src/models/User.js` - Removed password info logging

---

## 3. Environment Variables

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Access token signing key | Random 64+ char string |
| `JWT_REFRESH_SECRET` | Refresh token signing key (separate) | Random 64+ char string |
| `JWT_EXPIRATION` | Access token TTL | `1h` |
| `EXTERNAL_API_KEY` | API key for conversation endpoints | Secure random string |
| `OPENAI_API_KEY` | OpenAI API for TitiNauta | `sk-...` |
| `ELEVENLABS_API_KEY` | ElevenLabs for TTS | API key |
| `GEMINI_API_KEY` | Google Gemini for embeddings | API key |
| `EVOLUTION_API_KEY` | Evolution API for WhatsApp | API key |
| `EVOLUTION_API_URL` | Evolution API base URL | `https://api.evolution.example.com` |
| `OWNER_PHONE` | Owner phone for approval notifications | `+5598991628206` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend base URL | `https://educareapp.com.br` |
| `BACKEND_URL` | Backend base URL | `https://educareapp.com.br` |

---

## 4. Database Tables & Indexes

All tables are created automatically at startup by `pgvectorService.initialize()`.

### conversation_states
- `idx_cs_user_phone` (user_phone) - Primary lookup
- `idx_cs_state` (state) - State filtering
- UNIQUE constraint on user_phone

### conversation_memory
- `idx_cm_user_phone` (user_phone) - Memory retrieval
- `idx_cm_user_id` (user_id)
- `idx_cm_context` (active_context)
- `idx_cm_type` (interaction_type)

### ux_feedback
- `idx_uf_user_phone` (user_phone)
- `idx_uf_score` (score)

### support_reports
- `idx_sr_user_phone` (user_phone)
- `idx_sr_type` (type)
- `idx_sr_status` (status)

### knowledge_embeddings
- `idx_ke_category` (knowledge_category)
- `idx_ke_source_type` (source_type)
- `idx_ke_domain` (domain)
- `idx_ke_parent_doc` (parent_document_id)

---

## 5. Health Check

**Endpoint:** `GET /api/conversation/health`  
**Auth:** None required (public)  
**Response:**
```json
{
  "success": true,
  "services": {
    "database": { "status": "ok" },
    "state_machine": { "status": "ok", "detail": "conversation_states table exists" },
    "memory": { "status": "ok", "detail": "conversation_memory table exists" },
    "tts": { "status": "ok", "detail": "ElevenLabs configured" },
    "buffer": { "status": "ok", "detail": "Message buffer service available" }
  },
  "timestamp": "2026-02-10T20:33:04.010Z"
}
```

---

## 6. n8n Webhook Configuration

### Required n8n Variables
Set these in n8n Settings > Variables:

| Variable | Value |
|----------|-------|
| `EDUCARE_API_URL` | `https://educareapp.com.br/api` |
| `EDUCARE_EXTERNAL_API_KEY` | Same as `EXTERNAL_API_KEY` env var |
| `EVOLUTION_INSTANCE` | WhatsApp instance name |

### Webhook Endpoints (n8n → Backend)
- `POST /api/conversation/buffer` - Buffer incoming messages
- `POST /api/conversation/buffer/consume` - Consume and combine messages
- `POST /api/conversation/state/transition` - Transition conversation state
- `GET /api/conversation/context/enriched` - Get enriched context for AI
- `POST /api/conversation/feedback/contextual` - Save contextual feedback
- `POST /api/conversation/buttons/resolve` - Resolve button clicks

### Message Routing Precedence
1. **Feedback** - Check if message is feedback response (fb_1 through fb_5)
2. **Buttons** - Check if message matches a button ID (ctx_*, action_*, menu_*)
3. **Buffer** - Add message to buffer, wait for TTL
4. **State Router** - Route based on current conversation state

---

## 7. Docker Deployment

### docker-compose.yml Services
```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: educare
      POSTGRES_USER: educare_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    image: educare-backend:latest
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: postgresql://educare_user:${DB_PASSWORD}@postgres:5432/educare
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      EXTERNAL_API_KEY: ${EXTERNAL_API_KEY}
    depends_on:
      - postgres

  frontend:
    image: educare-frontend:latest
    ports:
      - "3000:80"
```

---

## 8. Test Suite

Run the full 40-test API test suite:
```bash
API_KEY=<EXTERNAL_API_KEY> node tests/conversation-api-test.js
```

**Note:** The global rate limiter allows 100 requests per 15 minutes. Wait between consecutive test runs or restart the backend to reset the counter.

---

## 9. Monitoring Checklist

- [ ] Health check endpoint accessible: `GET /api/conversation/health`
- [ ] All 5 services reporting `"ok"` status
- [ ] Rate limiter configured (100 req/15min general, 30 req/min external)
- [ ] ElevenLabs API key configured for TTS
- [ ] Evolution API connected for WhatsApp
- [ ] n8n workflows active and connected
- [ ] JWT secrets are unique, not using defaults
- [ ] CORS configured for production domain
