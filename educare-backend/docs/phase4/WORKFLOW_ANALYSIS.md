# Phase 4: n8n Workflow Analysis

## Date: 2026-02-10

## Existing Workflows

### 1. Educare app-chat (ID: iLDio0CFRs2Qa1VM) — ACTIVE
**41 nodes, main WhatsApp processing workflow**

#### Current Flow:
```
Webhook (Unified Entry)
  → Source Detector (code: detect Chatwoot vs Evolution)
  → É humano? (IF: filter bot messages)
  → Router: Source Type (switch: Chatwoot=0, Evolution=1)
  → [Chatwoot Extractor | Evolution Extractor] (code: extract phone, message, media)
  → Gate: Not Skipped? (IF: skip fromMe/status messages)
  → Router: Input Type (switch: audio=0, text=1)
      → [audio path: Transcribe → Normalize Audio]
      → [text path: Global Constants]
  → Global Constants (code: adds API URLs and keys)
  → API: Check User (HTTP: GET /api/n8n/users/check?phone=...)
  → Gate: User Exists? (IF: exists=true)
      → [NO]: Prepare: No User Msg → Edit Fields → Call 'Agente Lead' (Lead CRM sub-workflow)
      → [YES]: Gate: Active Sub? (IF: subscription_status=active|trialing)
          → [NO]: Prepare: Inactive Msg → Edit Fields1 → Call 'Inactive Reactivation' sub-workflow
          → [YES]: Engine: Calc Weeks (code: calculate child age in weeks)
              → Intent Classifier (code: deterministic PT-BR intent classification)
              → Router: Intent Switch (switch: menu_nav, biometrics, sleep, vaccine, question, appointment)
                  → [menu_nav]: Router: Menu Options → [Child Content | Mother Content | Vaccines | RAG]
                  → [biometrics]: API: Biometrics
                  → [sleep]: API: Sleep Log
                  → [vaccine]: API: Vaccines
                  → [question]: API: RAG (TitiNauta)
                  → [appointment]: API: Appointments
              → Prepare Response (code: unify response format)
              → Router: Response Source (switch: chatwoot=0, evolution=1)
                  → [chatwoot]: Chatwoot: Send Text
                  → [evolution]: Router: Evo Output Type (switch: text, image, audio, document)
                      → [Evo: Send Text | Evo: Send Image | Evo: Send Audio | Evo: Send Document]
```

#### Key Constants (from Global Constants node):
- EDUCARE_API_URL: (from env/secrets)
- EDUCARE_API_KEY: (from env/secrets)
- EVOLUTION_API_URL: (from env/secrets)
- EVOLUTION_INSTANCE: (from env/secrets)

### 2. Lead CRM (ID: n6ZpQvp96iPCaIvG) — ACTIVE
**32 nodes, unregistered user sales funnel**
- Triggered as sub-workflow from Educare app-chat
- Uses: AI Agent (OpenAI), PGVector Store, Postgres Chat Memory
- 3-stage sales funnel with context management
- Sends responses via Evolution API

### 3. Inactive User Reactivation (ID: jGZCuPWlkZa8v9OB) — ACTIVE
**29 nodes, inactive subscription reactivation**
- Triggered as sub-workflow from Educare app-chat
- Uses: AI Agent (OpenAI), Stripe checkout, PG memory
- Dedup, opt-out detection, cooldown gates
- Creates Stripe checkout sessions for reactivation

## Phase 4 Integration Points

### Where State Machine Integrates:
- **AFTER** Gate: Active Sub? (YES path) — before Engine: Calc Weeks
- Insert: GET /api/conversation/state?phone=...
- Insert: POST /api/conversation/state/transition (if needed)
- The state determines which flow path the message takes

### Where Message Buffer Integrates:
- **AFTER** state check, **BEFORE** processing
- POST /api/conversation/buffer (add message)
- Wait/check if buffer ready (10-15s TTL)
- GET /api/conversation/buffer/consume (get aggregated message)

### Where Context Prompt Integrates:
- **BEFORE** API: RAG (TitiNauta) call
- GET /api/conversation/context/{phone}/prompt
- Use enriched prompt as system message for RAG

### Where Buttons Integrate:
- **AFTER** ENTRY state (send context selection buttons)
- **AFTER** responses (send feedback buttons)
- POST /api/conversation/buttons/send

### Where Feedback Handling Integrates:
- **IN** Evolution Extractor — detect button callback IDs (fb_1, fb_3, fb_5)
- Route to POST /api/conversation/feedback
- Skip normal processing for feedback messages

### Where Memory Persistence Integrates:
- **AFTER** Prepare Response — save conversation summary
- POST /api/conversation/memory

## New Conversation API Endpoints (Phase 3)
Base: {EDUCARE_API_URL}/api/conversation
Auth: x-api-key header

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /state?phone=... | Get current conversation state |
| PUT | /state | Update state fields |
| POST | /state/transition | Transition to new state |
| GET | /state-machine | Get full state machine definition |
| POST | /buffer | Add message to buffer |
| GET | /buffer/:phone | Check buffer status |
| POST | /buffer/consume | Consume buffered messages |
| GET | /context/:phone | Get aggregated context |
| GET | /context/:phone/prompt | Get context as system prompt |
| POST | /feedback | Save UX feedback |
| POST | /memory | Save conversation memory |
| POST | /memory/search | Search conversation memory |
| POST | /tts | Generate text-to-speech |
| POST | /buttons/format | Format button payload |
| POST | /buttons/send | Send buttons via Evolution API |
