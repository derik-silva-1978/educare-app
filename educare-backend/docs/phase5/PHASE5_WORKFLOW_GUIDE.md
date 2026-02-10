# Phase 5 – Specialized State Flows (n8n Workflow Guide)

## Overview
This document describes the new backend API endpoints and the n8n workflow nodes needed to implement the specialized conversation states: CONTENT_FLOW, QUIZ_FLOW, LOG_FLOW, SUPPORT, FEEDBACK, PAUSE, and EXIT.

## New API Endpoints

### Base URL: `{BACKEND_URL}/api/whatsapp-flow`
### Authentication: `?api_key={EXTERNAL_API_KEY}` or Header `x-api-key`

### CONTENT_FLOW
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/content/current?phone={phone}&active_context={child\|mother}` | Get current week content |
| GET | `/content/topic/{topicId}` | Get full topic detail |

### QUIZ_FLOW
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quiz/next?phone={phone}&active_context={child\|mother}` | Get next unanswered question |
| POST | `/quiz/answer` | Save quiz answer (`{phone, question_id, answer, answer_text}`) |

### LOG_FLOW
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/log/options?phone={phone}` | Get available log types |
| POST | `/log/save` | Save log entry (`{phone, log_type, data}`) |

### SUPPORT
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/support/report` | Save support report (`{phone, type, content, state, active_context}`) |

---

## n8n Workflow Modifications

### State Router Enhancement
The existing `Router: State Flow` node (4-way routing) needs to be expanded to handle all 10 states:

```
State Router (Switch Node)
├── ENTRY → Existing ENTRY flow
├── CONTEXT_SELECTION → Existing context selection flow
├── FREE_CONVERSATION → Existing RAG flow
├── CONTENT_FLOW → NEW: Content delivery flow
├── QUIZ_FLOW → NEW: Quiz execution flow
├── LOG_FLOW → NEW: Log collection flow
├── SUPPORT → NEW: Support/report flow
├── FEEDBACK → Existing feedback flow (enhanced)
├── PAUSE → NEW: Pause flow
└── EXIT → NEW: Exit flow
```

### New Node Groups

#### CONTENT_FLOW Nodes (4 nodes)
1. **API: Get Content** (HTTP Request)
   - GET `{BACKEND_URL}/api/whatsapp-flow/content/current?phone={{$json.phone}}&active_context={{$json.active_context}}&api_key={EXTERNAL_API_KEY}`
   
2. **Format: Content Message** (Code Node)
   - Formats topic list as WhatsApp message with numbered items
   - Creates CTA buttons: [▶️ Ver conteúdo] [🧩 Fazer quiz] [⏸️ Voltar depois]

3. **Evo: Send Content** (HTTP Request)
   - Send formatted content via Evolution API with interactive buttons

4. **Gate: Content Action** (Switch Node)
   - Routes user response: view topic → API: Get Topic Detail, quiz → transition to QUIZ_FLOW, pause → transition to PAUSE

#### QUIZ_FLOW Nodes (5 nodes)
1. **API: Get Next Question** (HTTP Request)
   - GET `{BACKEND_URL}/api/whatsapp-flow/quiz/next?phone={{$json.phone}}&active_context={{$json.active_context}}&api_key={EXTERNAL_API_KEY}`

2. **Gate: Quiz Complete?** (If Node)
   - Check if `data.completed === true` → transition to FEEDBACK
   - Otherwise → continue to format question

3. **Format: Quiz Question** (Code Node)
   - Formats question as WhatsApp interactive buttons (3 options)
   - Stores question_id in state metadata for answer processing

4. **Evo: Send Quiz** (HTTP Request)
   - Send quiz question via Evolution API with interactive buttons

5. **API: Save Quiz Answer** (HTTP Request)
   - POST `{BACKEND_URL}/api/whatsapp-flow/quiz/answer`
   - Body: `{phone, question_id, answer, answer_text}`
   - On success: loop back to API: Get Next Question

#### LOG_FLOW Nodes (4 nodes)
1. **API: Get Log Options** (HTTP Request)
   - GET `{BACKEND_URL}/api/whatsapp-flow/log/options?phone={{$json.phone}}&api_key={EXTERNAL_API_KEY}`

2. **Evo: Send Log Options** (HTTP Request)
   - Send options as interactive buttons via Evolution API

3. **Collect: Log Data** (Code Node)
   - Parse user response for structured data (weight, height, sleep hours, etc.)
   - Use NLP patterns for natural language input

4. **API: Save Log** (HTTP Request)
   - POST `{BACKEND_URL}/api/whatsapp-flow/log/save`
   - Body: `{phone, log_type, data}`

#### SUPPORT Nodes (3 nodes)
1. **Evo: Send Support Prompt** (HTTP Request)
   - Send "Quer me contar o que aconteceu? 🛠️" with buttons

2. **API: Save Report** (HTTP Request)
   - POST `{BACKEND_URL}/api/whatsapp-flow/support/report`
   - Body: `{phone, type, content, state, active_context}`

3. **Evo: Confirm Report** (HTTP Request)
   - Send "Recebi, sim 🙏 Vou encaminhar isso para o time cuidar."
   - Transition back to FREE_CONVERSATION

#### PAUSE & EXIT Nodes (2 nodes each)
1. **PAUSE: Save & Send** (Code + HTTP Request)
   - Transition state to PAUSE
   - Send "Tudo bem 💙 Quando quiser, é só me chamar."
   
2. **EXIT: Close & Send** (Code + HTTP Request)
   - Transition state to EXIT
   - Send "Estarei por aqui sempre que precisar 🌷"

---

## Button Callback Routing

All button callbacks from WhatsApp follow the pattern:
```
buttonId → Gate: Is Feedback? → if fb_* → feedback flow
                              → else → State-specific routing
```

### Button ID Conventions
| Prefix | State | Description |
|--------|-------|-------------|
| `ctx_` | CONTEXT_SELECTION | Context selection (child/mother) |
| `action_` | FREE_CONVERSATION | Menu actions (quiz, content, change, exit) |
| `fb_` | FEEDBACK | Feedback scores |
| `quiz_` | QUIZ_FLOW | Quiz answer options |
| `log_` | LOG_FLOW | Log type selection |
| `support_` | SUPPORT | Support type selection |
| `content_` | CONTENT_FLOW | Content actions |

### Action Button Mapping
| Button ID | Action |
|-----------|--------|
| `action_quiz` | Transition to QUIZ_FLOW |
| `action_content` | Transition to CONTENT_FLOW |
| `action_change` | Transition to CONTEXT_SELECTION |
| `action_exit` | Transition to PAUSE/EXIT |
| `action_log` | Transition to LOG_FLOW |
| `action_support` | Transition to SUPPORT |

---

## State Transition API Calls

All state transitions use:
```
POST {BACKEND_URL}/api/conversation/state/transition?api_key={EXTERNAL_API_KEY}
Body: { "phone": "...", "to_state": "...", ...additionalUpdates }
```

The response includes `state_message` with text and buttons for the new state.

---

## Implementation Priority
1. CONTENT_FLOW + QUIZ_FLOW (highest user value)
2. FEEDBACK + PAUSE + EXIT (UX completeness)
3. LOG_FLOW (structured data collection)
4. SUPPORT (problem reporting)
