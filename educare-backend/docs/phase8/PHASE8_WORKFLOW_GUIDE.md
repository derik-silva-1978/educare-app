# Phase 8 – Complete n8n Workflow Wiring Guide

## Date: 2026-02-10

## Overview

This guide describes how to evolve the "Educare app-chat" n8n workflow from its current 57 nodes (Phase 4) to a fully-wired conversational system that uses ALL backend APIs built across Phases 3-7.

**Goal**: Every message received on WhatsApp flows through a complete pipeline:
1. Message buffering (fragmented message handling)
2. State machine routing (10-state conversation)
3. Enriched context for AI responses
4. Specialized flows (content, quiz, log, support)
5. Feedback triggers (smart, contextual)
6. Session summary on exit/pause
7. Memory persistence

---

## Current Workflow State (57 nodes)

```
Webhook → Source Detector → É humano? → Router: Source Type
  → [Chatwoot Extractor | Evolution Extractor]
  → Gate: Not Skipped? → Router: Input Type
    → [audio: Transcribe → Normalize | text: Global Constants]
  → Global Constants → API: Check User → Gate: User Exists?
    → [NO]: Lead CRM sub-workflow
    → [YES]: Gate: Active Sub?
      → [NO]: Inactive Reactivation sub-workflow
      → [YES]: API: Get State → Gate: Is Feedback? 
        → [fb_*]: Feedback: Direct Save → Feedback: Send Ack
        → [normal]: State Router → Router: State Flow
          → [ENTRY]: Entry Transition → Send Context Buttons
          → [NORMAL]: Engine: Calc Weeks → Intent Classifier → Router: Intent
          → [FEEDBACK]: Save Feedback → Thank You
          → [EXIT]: Reset State → Goodbye
        → API: Get Context Prompt → Merge: Context + RAG
        → [RAG/Intent responses] → Prepare Response → Router: Response Source
          → [evolution]: Evo: Send Text → API: Send Feedback Buttons
          → API: Save Memory (parallel)
```

---

## Target Workflow (Phase 8 — ~80+ nodes)

### Architecture Changes

1. **Insert Message Buffer** after state check, before processing
2. **Expand State Router** from 4-way to full 10-state routing
3. **Replace context prompt** with enriched context endpoint
4. **Add feedback triggers** after key events (quiz, content, exit, pause)
5. **Add session summary** before PAUSE/EXIT transitions
6. **Wire specialized flows** (content, quiz, log, support)

---

## Section 1: Message Buffer Integration

### Where: After `Gate: Is Feedback?` [normal path], BEFORE `State Router`

### New Nodes (3 nodes):

#### Node 1: `API: Buffer Add` (HTTP Request)
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/conversation/buffer
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}",
  "message": "{{$json.message}}"
}
```

**Response fields:**
- `ready_to_process` (boolean): true = buffer ready, process now
- `combined_text` (string): concatenated messages when ready
- `needs_prompt` (boolean): true = message too short, send prompt
- `prompt_message` (string): "Oi 😊 Me conta um pouquinho mais..."

#### Node 2: `Gate: Buffer Ready?` (IF Node)
```
Condition: {{$json.ready_to_process}} equals true
  → TRUE: Continue to State Router (with $json.combined_text as the message)
  → FALSE: Check needs_prompt
```

#### Node 3: `Gate: Needs Prompt?` (IF Node)
```
Condition: {{$json.needs_prompt}} equals true
  → TRUE: Evo: Send Buffer Prompt (send prompt_message via Evolution API) → STOP
  → FALSE: STOP (wait for more messages, TTL will expire)
```

#### Node 4: `Evo: Send Buffer Prompt` (HTTP Request)
```
Method: POST
URL: {{$json.EVOLUTION_API_URL}}/message/sendText/{{$json.EVOLUTION_INSTANCE}}
Headers: apikey: {{$json.EVOLUTION_API_KEY}}
Body (JSON):
{
  "number": "{{$json.phone}}",
  "text": "{{$json.prompt_message}}"
}
```

### Flow After Buffer:
```
Gate: Is Feedback? [normal] 
  → API: Buffer Add 
    → Gate: Buffer Ready?
      → [YES]: API: Buffer Consume → Merge: Buffer Result → State Router
      → [NO]: Gate: Needs Prompt?
        → [YES]: Evo: Send Buffer Prompt → END
        → [NO]: END (silent wait)
```

### Important: Buffer Consume & Flush

When `ready_to_process` is `true`, you MUST call the **consume** endpoint to atomically read and clear the buffer. This prevents the same messages from being processed again on the next webhook trigger.

#### Node 5: `API: Buffer Consume` (HTTP Request)
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/conversation/buffer/consume
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}"
}
```

**Response:**
```json
{
  "success": true,
  "combined_text": "oi quero saber sobre sono do bebê",
  "message_count": 3
}
```

The consume endpoint returns `combined_text` (all buffered messages joined) and clears the buffer atomically. If you skip this step and use `combined_text` from the `addToBuffer` response directly, the buffer will NOT be cleared and the same messages will accumulate again on the next incoming message.

#### Node 6: `Merge: Buffer Result` (Code Node)

After consuming, replace the `message` field with the consumed text:

```javascript
// Code Node: "Merge: Buffer Result"
const consumeResult = $input.first().json;
const previousData = $('Global Constants').first().json;

return [{
  json: {
    ...previousData,
    phone: consumeResult.phone || previousData.phone,
    message: consumeResult.combined_text || previousData.message,
    original_messages: consumeResult.message_count || 1
  }
}];
```

### Buffer vs. Buttons/Feedback

Buttons and feedback callbacks (`fb_*`, `ctx_*`, `action_*`, etc.) should **bypass the buffer entirely**. These are single, complete interactions that don't need accumulation. The Gate: Is Feedback? check (for `fb_*`) already runs before the buffer. For other button types, add a check before API: Buffer Add:

```javascript
// In Gate: Is Button? (before buffer)
const msg = $json.message || '';
const isButton = /^(ctx_|action_|fb_|quiz_|log_|support_|content_)/.test(msg);
// If isButton → skip buffer, go directly to button resolution
// If not → proceed to API: Buffer Add
```

---

## Section 2: Expanded State Router (10-State)

### Where: Replace existing `Router: State Flow` (4-way Switch)

### Current (Phase 4):
4 outputs: ENTRY, NORMAL (FREE_CONVERSATION), FEEDBACK, EXIT

### Target (Phase 8):
10 outputs covering ALL conversation states.

#### Node: `Router: State Flow v2` (Switch Node)
```
Property: {{$json.current_state}}
Outputs:
  0: ENTRY
  1: CONTEXT_SELECTION
  2: FREE_CONVERSATION (default/fallback)
  3: CONTENT_FLOW
  4: QUIZ_FLOW
  5: LOG_FLOW
  6: SUPPORT
  7: FEEDBACK
  8: PAUSE
  9: EXIT
```

### Message Routing Precedence (CRITICAL)

The routing order below MUST be followed exactly. Incorrect ordering causes buttons to be treated as free text or duplicate processing.

```
Message arrives (after source extraction)
  │
  ├─ Step 1: Gate: Is Feedback? ─── fb_[1-5] ──→ API: Save Contextual Feedback → Evo: Send Ack → END
  │
  ├─ Step 2: Gate: Is Button? ──── any prefix ──→ API: Resolve Button → Route by action → END
  │                                 (ctx_, action_, quiz_, log_, support_, content_)
  │
  ├─ Step 3: API: Buffer Add ──── free text ──→ Gate: Buffer Ready?
  │                                              → [NO]: prompt or wait → END
  │                                              → [YES]: API: Buffer Consume → Merge
  │
  └─ Step 4: State Router ──────────────────────→ 10-state routing
```

**Why this order matters:**
- **Step 1 (feedback)** runs first because `fb_*` callbacks are the most time-sensitive — they arrive in response to feedback buttons and should never enter the buffer or state router.
- **Step 2 (buttons)** runs second because ALL button callbacks (`ctx_*`, `action_*`, `quiz_*`, etc.) are single, complete interactions that must bypass the buffer. They get resolved by the backend API which handles state transitions and returns the response to send.
- **Step 3 (buffer)** only runs for free text messages. These may be fragmented and need accumulation before processing.
- **Step 4 (state router)** only runs after the buffer produces a complete message.

### Button Detection Node

#### Node: `Gate: Is Button?` (IF Node)
```
Condition: matches regex /^(ctx_|action_|quiz_|log_|support_|content_)/
Property: {{$json.message}}

  → TRUE: API: Resolve Button
  → FALSE: API: Buffer Add (free text path)
```

Note: `fb_*` buttons are already handled in Step 1 (`Gate: Is Feedback?` which exists from Phase 4). This node catches ALL remaining button types.

### Button Resolution

#### Node: `API: Resolve Button` (HTTP Request)
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/conversation/buttons/resolve
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}",
  "buttonId": "{{$json.message}}"
}
```

**Response fields:**
- `action`: what to do — `transition`, `save_feedback`, `select_context`
- `transition_to`: target state (when action is `transition`)
- `state_message`: `{ text, buttons }` for the new state (send via Evolution API)
- `feedback_data`: score data (when action is `save_feedback`)

#### Node: `Router: Button Action` (Switch Node)
```
Property: {{$json.action}}
Outputs:
  0: "transition" → Evo: Send State Message (send state_message.text + buttons)
  1: "select_context" → Evo: Send Context Confirmation (send state_message)
  2: "save_feedback" → Evo: Send Feedback Ack (already saved by resolver)
  3: fallback → Evo: Send Error ("Não entendi essa opção, tente novamente")
```

### CONTEXT_SELECTION Handling

When a `ctx_child` or `ctx_mother` button arrives:
1. `API: Resolve Button` detects it as context selection
2. Backend sets `active_context` and transitions state to `FREE_CONVERSATION`
3. Returns confirmation text + menu buttons
4. n8n sends the response — no additional state routing needed

After resolving, route based on `action`:
- `transition` → Send state_message via Evolution API
- `save_feedback` → Already saved, send acknowledgment
- `select_context` → Already saved, send confirmation + menu

---

## Section 3: Enriched Context (Replace Phase 4 Context Prompt)

### Where: BEFORE RAG/TitiNauta call in FREE_CONVERSATION state

### Replace `API: Get Context Prompt` with `API: Get Enriched Context`

#### Node: `API: Get Enriched Context` (HTTP Request)
```
Method: GET
URL: {{$json.EDUCARE_API_URL}}/api/conversation/context/enriched?phone={{$json.phone}}
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
```

**Response:**
```json
{
  "success": true,
  "prompt": "CONTEXTO DO USUÁRIO:\n- Estado: FREE_CONVERSATION...\n\nHISTÓRICO RECENTE:\n...\n\nPERSONALIZAÇÕES: Bebê com 4 meses | ...",
  "child": { "name": "...", "age_months": 4 },
  "state": { "state": "FREE_CONVERSATION", "active_context": "child" }
}
```

### Update `Merge: Context + RAG` Code Node:
```javascript
const enrichedContext = $('API: Get Enriched Context').first().json;
const message = $('Merge: Buffer Result').first().json.message;

// Use the enriched prompt as system context for TitiNauta
const systemPrompt = enrichedContext.prompt || '';
const activeContext = enrichedContext.state?.active_context || 'child';
const childName = enrichedContext.child?.name || '';

return [{
  json: {
    system_prompt: systemPrompt,
    user_message: message,
    active_context: activeContext,
    child_name: childName
  }
}];
```

---

## Section 4: Specialized Flow Wiring

### 4.1 CONTENT_FLOW

```
Router: State Flow v2 [CONTENT_FLOW]
  → Gate: Is Content Button?
    → [content_view_*]: API: Get Topic Detail → Format → Evo: Send
    → [content_quiz]: Transition to QUIZ_FLOW
    → [content_back]: Transition to FREE_CONVERSATION
    → [else/first entry]: API: Get Current Content → Format Topics → Evo: Send Content List
```

#### API: Get Current Content (HTTP Request)
```
Method: GET
URL: {{$json.EDUCARE_API_URL}}/api/whatsapp-flow/content/current?phone={{$json.phone}}&active_context={{$json.active_context}}
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
```

#### Format: Content Message (Code Node)
```javascript
const data = $json.data;
const topics = data.topics || [];

if (topics.length === 0) {
  return [{
    json: {
      text: "Não encontrei conteúdos novos para esta semana 📚\nQuer fazer outra coisa?",
      buttons: [
        { buttonId: "action_quiz", buttonText: { displayText: "🧩 Fazer quiz" } },
        { buttonId: "action_change", buttonText: { displayText: "🔄 Trocar contexto" } }
      ]
    }
  }];
}

let text = `📚 Conteúdos da Semana ${data.week || ''}:\n\n`;
topics.forEach((t, i) => {
  text += `${i + 1}. ${t.title}\n`;
});
text += "\nEscolha um conteúdo para ler:";

const buttons = topics.slice(0, 3).map((t, i) => ({
  buttonId: `content_view_${t.id}`,
  buttonText: { displayText: `📖 ${t.title.substring(0, 20)}` }
}));

return [{ json: { text, buttons } }];
```

#### Send via Evolution API with interactive buttons:
```
Method: POST
URL: {{$json.EVOLUTION_API_URL}}/message/sendText/{{$json.EVOLUTION_INSTANCE}}
Body: standard Evolution API button format
```

### 4.2 QUIZ_FLOW

```
Router: State Flow v2 [QUIZ_FLOW]
  → Gate: Is Quiz Answer?
    → [quiz_answer_*]: API: Save Quiz Answer → API: Get Next Question
    → [else/first entry]: API: Get Next Question
  → Gate: Quiz Complete?
    → [YES]: API: Feedback Trigger (quiz_completed) → Maybe send feedback
    → [NO]: Format Quiz Question → Evo: Send Quiz Buttons
```

#### API: Get Next Question (HTTP Request)
```
Method: GET
URL: {{$json.EDUCARE_API_URL}}/api/whatsapp-flow/quiz/next?phone={{$json.phone}}&active_context={{$json.active_context}}
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
```

#### API: Save Quiz Answer (HTTP Request)
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/whatsapp-flow/quiz/answer
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}",
  "question_id": "{{$json.question_id}}",
  "answer": "{{$json.answer_index}}",
  "answer_text": "{{$json.answer_text}}"
}
```

#### Format: Quiz Question (Code Node)
```javascript
const data = $json.data;

if (data.completed) {
  return [{
    json: {
      completed: true,
      text: "🎉 Quiz finalizado!\nObrigado por participar 💙",
      transition_to: "FEEDBACK"
    }
  }];
}

const question = data.question;
let text = `🧩 Pergunta ${data.current}/${data.total}:\n\n${question.text}`;

const buttons = question.options.slice(0, 3).map((opt, i) => ({
  buttonId: `quiz_answer_${question.id}_${i}`,
  buttonText: { displayText: opt.text.substring(0, 20) }
}));

return [{ json: { text, buttons, question_id: question.id, completed: false } }];
```

### 4.3 LOG_FLOW

```
Router: State Flow v2 [LOG_FLOW]
  → Gate: Is Log Selection?
    → [log_*]: Collect user data → API: Save Log → Confirm → Back to FREE_CONVERSATION
    → [else/first entry]: API: Get Log Options → Evo: Send Log Menu
```

#### API: Get Log Options (HTTP Request)
```
Method: GET
URL: {{$json.EDUCARE_API_URL}}/api/whatsapp-flow/log/options?phone={{$json.phone}}
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
```

#### API: Save Log (HTTP Request)
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/whatsapp-flow/log/save
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}",
  "log_type": "{{$json.selected_log_type}}",
  "data": {{$json.log_data}}
}
```

### 4.4 SUPPORT

```
Router: State Flow v2 [SUPPORT]
  → Gate: Is Support Type?
    → [support_problem/support_suggestion]: Set type → Wait for text → API: Save Report
    → [else/first entry]: Evo: Send Support Menu (problem/suggestion/back buttons)
```

#### API: Save Report (HTTP Request)
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/whatsapp-flow/support/report
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}",
  "type": "{{$json.report_type}}",
  "content": "{{$json.message}}",
  "state": "SUPPORT",
  "active_context": "{{$json.active_context}}"
}
```

---

## Section 5: Feedback Trigger Integration

### Where: After key events (quiz completion, content viewing, exit, pause)

#### Node: `API: Check Feedback Trigger` (HTTP Request)
```
Method: GET
URL: {{$json.EDUCARE_API_URL}}/api/conversation/feedback/trigger?phone={{$json.phone}}&trigger_event={{$json.trigger_event}}
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
```

**trigger_event values:**
- `quiz_completed` — after quiz finishes
- `content_viewed` — after reading content
- `exit` — when transitioning to EXIT
- `pause` — when transitioning to PAUSE
- `session_long` — after extended conversation (>15 messages)

**Response:**
```json
{
  "success": true,
  "should_trigger": true,
  "feedback_message": {
    "text": "Antes de sair, como foi sua experiência? ⭐",
    "buttons": [
      { "buttonId": "fb_1", "buttonText": { "displayText": "⭐" } },
      { "buttonId": "fb_2", "buttonText": { "displayText": "⭐⭐" } },
      { "buttonId": "fb_3", "buttonText": { "displayText": "⭐⭐⭐" } }
    ]
  }
}
```

#### Node: `Gate: Should Trigger Feedback?` (IF Node)
```
Condition: {{$json.should_trigger}} equals true
  → TRUE: Evo: Send Feedback Request (send feedback_message with buttons)
  → FALSE: Continue without feedback
```

### Integration Points:

1. **After Quiz Completion**:
   ```
   Gate: Quiz Complete? [YES] 
     → API: Check Feedback Trigger (trigger_event=quiz_completed)
     → Gate: Should Trigger? 
       → [YES]: Evo: Send Feedback → Transition to FEEDBACK
       → [NO]: Transition to FREE_CONVERSATION
   ```

2. **Before PAUSE/EXIT Transitions**:
   ```
   [PAUSE requested]
     → API: Check Feedback Trigger (trigger_event=pause)
     → Gate: Should Trigger?
       → [YES]: Evo: Send Feedback → Wait for response → Then PAUSE
       → [NO]: Direct PAUSE transition
   ```

3. **After Content Viewing**:
   ```
   [Content topic displayed]
     → API: Check Feedback Trigger (trigger_event=content_viewed)
     → Gate: Should Trigger?
       → [YES]: Evo: Send Feedback Buttons (appended after content)
       → [NO]: Show next action buttons
   ```

### Contextual Feedback Save

When a feedback button (fb_1 through fb_5) is received, use the contextual endpoint:

#### Node: `API: Save Contextual Feedback` (HTTP Request)
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/conversation/feedback/contextual
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}",
  "score": {{$json.feedback_score}},
  "state": "{{$json.current_state}}",
  "active_context": "{{$json.active_context}}",
  "trigger_event": "{{$json.trigger_event}}"
}
```

**Response includes contextual reply:**
- Score 4-5: `"Que bom saber disso 💙 Obrigado por compartilhar."`
- Score 1-3: `"Obrigado por me contar 🤍 Se quiser, pode me dizer o que posso melhorar."`

---

## Section 6: Session Summary on Exit/Pause

### Where: During PAUSE and EXIT transitions

#### Node: `API: Save Session Summary` (HTTP Request)
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/conversation/session/summary
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}"
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total_interactions": 12,
    "user_messages": 6,
    "assistant_messages": 6,
    "contexts_used": ["child"],
    "topics_covered": ["sono", "alimentação"],
    "last_exchange": { "user": "...", "assistant": "..." },
    "duration_minutes": 15
  }
}
```

The summary is automatically saved to `conversation_memory` as a `[SESSION_SUMMARY]` entry, making it available for the next welcome message personalization.

### PAUSE Flow:
```
[PAUSE requested]
  → API: Check Feedback Trigger (trigger_event=pause)
  → Gate: Should Trigger?
    → [YES]: Send Feedback → Wait → API: Save Session Summary → Transition PAUSE → Send goodbye
    → [NO]: API: Save Session Summary → Transition PAUSE → Send goodbye
```

### EXIT Flow:
```
[EXIT requested]
  → API: Check Feedback Trigger (trigger_event=exit)
  → Gate: Should Trigger?
    → [YES]: Send Feedback → Wait → API: Save Session Summary → Transition EXIT → Send goodbye
    → [NO]: API: Save Session Summary → Transition EXIT → Send goodbye
```

---

## Section 7: Welcome Message (Returning Users)

### Where: ENTRY state handler

#### Node: `API: Get Welcome` (HTTP Request)
```
Method: GET
URL: {{$json.EDUCARE_API_URL}}/api/conversation/welcome?phone={{$json.phone}}
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
```

**Response (first visit):**
```json
{
  "success": true,
  "type": "first_visit",
  "message": {
    "text": "Oi! Eu sou o TitiNauta 🚀👶\nVou te acompanhar...",
    "buttons": [
      { "buttonId": "ctx_child", "buttonText": { "displayText": "👶 Sobre meu bebê" } },
      { "buttonId": "ctx_mother", "buttonText": { "displayText": "💚 Sobre mim" } }
    ]
  }
}
```

**Response (returning with context):**
```json
{
  "success": true,
  "type": "returning_with_context",
  "message": {
    "text": "Que bom te ver de volta! 💙\nDa última vez falamos sobre...",
    "buttons": [
      { "buttonId": "action_continue", "buttonText": { "displayText": "▶️ Continuar" } },
      { "buttonId": "action_change", "buttonText": { "displayText": "🔄 Trocar contexto" } }
    ]
  }
}
```

### Replace existing ENTRY flow:
```
Router: State Flow v2 [ENTRY]
  → API: Get Welcome 
  → Evo: Send Welcome (with buttons from response)
  → API: Entry Transition (POST /state/transition → CONTEXT_SELECTION or FREE_CONVERSATION)
```

---

## Section 8: Contextual Menu

### Where: FREE_CONVERSATION when intent is unclear

#### Node: `API: Get Menu` (HTTP Request)
```
Method: GET
URL: {{$json.EDUCARE_API_URL}}/api/conversation/menu?phone={{$json.phone}}
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
```

**Response:**
```json
{
  "success": true,
  "menu": {
    "text": "Como posso te ajudar agora? ✨",
    "buttons": [
      { "buttonId": "action_content", "buttonText": { "displayText": "📚 Ver conteúdos" } },
      { "buttonId": "action_quiz", "buttonText": { "displayText": "🧩 Fazer quiz" } },
      { "buttonId": "action_exit", "buttonText": { "displayText": "⏸️ Voltar depois" } }
    ]
  }
}
```

### When to show menu:
- Intent classifier returns `menu_nav` or low confidence
- User sends "menu", "opções", "ajuda"
- User returns from PAUSE without clear intent

---

## Section 9: Memory Persistence (Enhanced)

### Where: After EVERY assistant response

The existing `API: Save Memory` node should remain, but ensure it captures:

#### Node: `API: Save Memory` (HTTP Request)
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/conversation/memory
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}",
  "entries": [
    {
      "role": "user_message",
      "content": "{{$json.user_message}}",
      "interaction_type": "{{$json.interaction_type}}",
      "active_context": "{{$json.active_context}}"
    },
    {
      "role": "assistant_response",
      "content": "{{$json.assistant_response}}",
      "interaction_type": "{{$json.interaction_type}}",
      "active_context": "{{$json.active_context}}"
    }
  ]
}
```

**interaction_type values:**
- `conversation` — free conversation with TitiNauta
- `quiz` — quiz interactions
- `journey` — content/journey interactions
- `feedback` — feedback exchanges

### Save Memory in Parallel
Memory should be saved in parallel with sending the response (no need to wait):

```
Prepare Response
  ├── → Router: Response Source → Evo: Send Text
  └── → API: Save Memory (parallel, fire-and-forget)
```

---

## Section 10: TTS/Audio Integration

### Where: After TitiNauta response, before sending via Evolution API

#### Node: `Gate: Wants Audio?` (Code Node)
```javascript
const audioPreference = $json.audio_preference || 'text';
const responseLength = ($json.assistant_response || '').length;

// Only offer audio for substantial responses
const isSubstantial = responseLength > 100;

return [{
  json: {
    ...($json),
    should_send_audio: audioPreference === 'audio' && isSubstantial
  }
}];
```

#### Node: `API: Generate TTS` (HTTP Request) — conditional
```
Method: POST
URL: {{$json.EDUCARE_API_URL}}/api/conversation/tts/whatsapp
Headers: x-api-key: {{$json.EDUCARE_API_KEY}}
Body (JSON):
{
  "phone": "{{$json.phone}}",
  "text": "{{$json.assistant_response}}",
  "check_preference": false
}
```

**Response:**
```json
{
  "success": true,
  "audio_url": "https://educareapp.com.br/api/conversation/tts/audio/abc123",
  "send_audio": true
}
```

#### Then send audio via Evolution API:
```
Method: POST
URL: {{$json.EVOLUTION_API_URL}}/message/sendMedia/{{$json.EVOLUTION_INSTANCE}}
Body (JSON):
{
  "number": "{{$json.phone}}",
  "mediatype": "audio",
  "media": "{{$json.audio_url}}"
}
```

### Audio Preference Flow:
After first audio response, send preference buttons:
```
Evo: Send Audio → Evo: Send Preference Buttons
  → "Preparei um áudio 🎧 Prefere receber assim?"
  → Buttons: [🔊 Prefiro áudio] [💬 Prefiro texto]
```

---

## Section 11: Complete Flow Diagram (Target State)

```
Webhook (Entry)
  → Source Detector → É humano? → Router: Source Type
  → [Chatwoot | Evolution] Extractor → Gate: Not Skipped?
  → Router: Input Type → [audio: Transcribe | text: pass]
  → Global Constants
  → API: Check User → Gate: User Exists?
    → [NO]: Lead CRM (unchanged)
    → [YES]: Gate: Active Sub?
      → [NO]: Inactive Reactivation (unchanged)
      → [YES]:
        → API: Get State
        │
        ├─ Step 1: Gate: Is Feedback? [fb_*]
        │   → [YES]: API: Save Contextual Feedback → Evo: Send Ack → END
        │
        ├─ Step 2: Gate: Is Button? [ctx_/action_/quiz_/log_/support_/content_]
        │   → [YES]: API: Resolve Button → Router: Button Action
        │       → [transition]: Evo: Send State Message → END
        │       → [select_context]: Evo: Send Context Confirm → END
        │       → [save_feedback]: Evo: Send Feedback Ack → END
        │
        ├─ Step 3: API: Buffer Add (free text only)
        │   → Gate: Buffer Ready?
        │     → [NO]: Gate: Needs Prompt?
        │       → [YES]: Evo: Send Buffer Prompt → END
        │       → [NO]: END (silent wait for TTL)
        │     → [YES]: API: Buffer Consume → Merge: Buffer Result
        │
        └─ Step 4: Router: State Flow v2 (10-way, buffered message)
                    
            → [ENTRY]: API: Get Welcome → Evo: Send Welcome → Transition
            
            → [CONTEXT_SELECTION]: (handled by button resolution in Step 2)
            
            → [FREE_CONVERSATION]:
                → API: Get Enriched Context
                → Engine: Calc Weeks → Intent Classifier
                → Gate: Intent Clear?
                  → [menu/vague]: API: Get Menu → Evo: Send Menu
                  → [question]: Merge Context + RAG → TitiNauta → 
                    → Gate: Wants Audio?
                      → [YES]: API: TTS → Evo: Send Audio
                      → [NO]: Evo: Send Text
                    → API: Save Memory (parallel)
                    → API: Check Feedback Trigger (session_long, if >15 msgs)
                  → [biometrics/sleep/vaccine/appointment]: Existing API flows
            
            → [CONTENT_FLOW]:
                → API: Get Content → Format → Evo: Send Content
                → (on topic view): API: Get Topic → Format → Evo: Send
                → API: Check Feedback Trigger (content_viewed)
            
            → [QUIZ_FLOW]:
                → API: Get Next Question → Format → Evo: Send Quiz
                → (on answer): API: Save Answer → Loop
                → (on complete): API: Check Feedback Trigger (quiz_completed)
            
            → [LOG_FLOW]:
                → API: Get Log Options → Evo: Send Options
                → (on data): API: Save Log → Confirm → Back to FREE_CONVERSATION
            
            → [SUPPORT]:
                → Evo: Send Support Menu
                → (on text): API: Save Report → Confirm → Back to FREE_CONVERSATION
            
            → [FEEDBACK]: (handled by fb_* detection in Step 1)
            
            → [PAUSE]:
                → API: Check Feedback Trigger (pause)
                → API: Save Session Summary
                → Transition PAUSE → Evo: Send "Tudo bem 💙"
            
            → [EXIT]:
                → API: Check Feedback Trigger (exit)
                → API: Save Session Summary
                → Transition EXIT → Evo: Send "Estarei por aqui 🌷"
```

---

## Section 12: API Reference (All Endpoints)

### Base URL: `{EDUCARE_API_URL}`
### Auth: Header `x-api-key: {EDUCARE_API_KEY}` or query `?api_key={EDUCARE_API_KEY}`

### Conversation API (`/api/conversation`)

| Method | Endpoint | Phase | Purpose |
|--------|----------|-------|---------|
| GET | `/state?phone=X` | 3 | Get conversation state |
| PUT | `/state` | 3 | Update state fields |
| POST | `/state/transition` | 3 | Transition to new state |
| GET | `/state-machine` | 3 | Get state machine definition |
| POST | `/buffer` | 3 | Add message to buffer |
| GET | `/buffer/:phone` | 3 | Check buffer status |
| POST | `/buffer/consume` | 3 | Consume buffered messages |
| GET | `/context/enriched?phone=X` | 7 | Get enriched context (memory + RAG + personalizations) |
| GET | `/context/:phone` | 3 | Get raw context |
| GET | `/context/:phone/prompt` | 3 | Get context as prompt |
| GET | `/feedback/trigger?phone=X&trigger_event=Y` | 7 | Check if feedback should be triggered |
| POST | `/feedback/contextual` | 7 | Save feedback with contextual response |
| POST | `/feedback` | 3 | Save basic feedback |
| POST | `/report` | 3 | Save support report |
| GET | `/reports` | 3 | Get support reports |
| POST | `/memory` | 3 | Save conversation memory |
| POST | `/memory/search` | 3 | Search memory by similarity |
| POST | `/tts` | 3 | Generate text-to-speech audio |
| POST | `/tts/whatsapp` | 6 | Generate TTS for WhatsApp (returns public URL) |
| GET | `/tts/audio/:hash` | 6 | Serve cached TTS audio file |
| GET | `/tts/status` | 6 | Check TTS service status |
| GET | `/audio-preference?phone=X` | 6 | Get audio preference |
| POST | `/audio-preference` | 6 | Set audio preference |
| GET | `/menu?phone=X` | 6 | Get contextual menu |
| GET | `/welcome?phone=X` | 6 | Get welcome message |
| POST | `/buttons/resolve` | 5 | Resolve button callback |
| POST | `/buttons/format` | 3 | Format button payload |
| POST | `/buttons/send` | 3 | Send buttons via Evolution API |
| POST | `/session/summary` | 7 | Generate and save session summary |
| GET | `/analytics?phone=X` | 7 | Get conversation analytics |

### WhatsApp Flow API (`/api/whatsapp-flow`)

| Method | Endpoint | Phase | Purpose |
|--------|----------|-------|---------|
| GET | `/content/current?phone=X&active_context=Y` | 5 | Get current week content |
| GET | `/content/topic/:id` | 5 | Get topic detail |
| GET | `/quiz/next?phone=X&active_context=Y` | 5 | Get next quiz question |
| POST | `/quiz/answer` | 5 | Save quiz answer |
| GET | `/log/options?phone=X` | 5 | Get log type options |
| POST | `/log/save` | 5 | Save log entry |
| POST | `/support/report` | 5 | Save support report |

---

## Section 13: Implementation Checklist

### Priority 1 (Critical Path)
- [ ] Message Buffer integration (Section 1)
- [ ] Expand State Router to 10-way (Section 2)
- [ ] Replace context prompt with enriched context (Section 3)
- [ ] Wire Welcome endpoint to ENTRY (Section 7)

### Priority 2 (Specialized Flows)
- [ ] CONTENT_FLOW wiring (Section 4.1)
- [ ] QUIZ_FLOW wiring (Section 4.2)
- [ ] Feedback trigger after quiz/content (Section 5)

### Priority 3 (UX Polish)
- [ ] LOG_FLOW wiring (Section 4.3)
- [ ] SUPPORT flow wiring (Section 4.4)
- [ ] Session summary on PAUSE/EXIT (Section 6)
- [ ] Contextual menu integration (Section 8)
- [ ] TTS/Audio conditional sending (Section 10)

### Priority 4 (Optimization)
- [ ] Memory persistence enhancement (Section 9)
- [ ] Button resolution for all callback types (Section 2)
- [ ] Analytics endpoint for admin dashboard (future)

---

## Section 14: Testing Checklist

### Buffer Tests
1. Send "oi" → should get buffer prompt ("Me conta mais...")
2. Send "oi" then "quero saber sobre sono do bebê" → should concatenate and process
3. Send "menu" → should bypass buffer (clear intent)
4. Send fb_3 → should bypass buffer (feedback button)

### State Flow Tests
1. New user → Welcome → Context Selection → FREE_CONVERSATION
2. Returning user → Welcome (personalized) → Continue or Change
3. action_quiz button → Transition to QUIZ_FLOW → Quiz questions
4. action_content button → Transition to CONTENT_FLOW → Content list
5. action_exit → Feedback trigger check → Session summary → PAUSE

### Button Routing Tests
1. Send "ctx_child" → should bypass buffer → API: Resolve Button → context set + confirmation
2. Send "action_quiz" → should bypass buffer → API: Resolve Button → transition to QUIZ_FLOW
3. Send "quiz_answer_123_0" → should bypass buffer → API: Resolve Button → answer saved
4. Send "fb_4" → should be caught by Gate: Is Feedback? (Step 1) → feedback saved
5. Send "hello world" → should enter buffer → buffered/processed normally

### Feedback Tests
1. Complete quiz → should trigger feedback (if <3 total feedbacks)
2. fb_5 response → "Que bom saber disso 💙"
3. fb_1 response → "Obrigado por me contar 🤍 Se quiser..."
4. Second quiz in <24h → should NOT trigger feedback (cooldown)

### Memory Tests
1. Conversation → memory saved with correct active_context
2. Return next day → enriched context includes yesterday's memory
3. Session summary → captures only current session interactions

---

**Document prepared for n8n workflow implementation. All API endpoints are deployed and tested.**
