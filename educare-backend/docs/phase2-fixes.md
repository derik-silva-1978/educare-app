# Phase 2 — Critical Fixes Report

**Date:** 2026-02-07  
**Workflow:** Educare app-chat (`iLDio0CFRs2Qa1VM`)  
**Status:** Patches generated — require manual apply via n8n UI or REST API with admin key

---

## Summary of Issues & Fixes

| # | Severity | Node | Issue | Fix |
|---|----------|------|-------|-----|
| F1 | 🔴 Critical | API: Child Content | URL broken — missing `{{ $vars. }}` | Correct URL expression |
| F2 | 🔴 Critical | Prepare Response | References non-existent `Merge: Unified Data` | Rewrite to use `$input` pipeline data |
| F3 | 🔴 Critical | Prepare: Inactive Msg | References non-existent `Merge: Unified Data` | Rewrite to use pipeline-available data |
| F4 | 🔴 Critical | Router: Menu Options | References non-existent `Merge: Unified Data` | Change to `$input.item.json.message` |
| F5 | 🟡 Medium | Router: Intent Switch | `question` and `appointment` → wrong branch (Vaccines) | Add new branches + connections |
| F6 | 🟢 Low | API: Check User | Uses `Global Constants` instead of `$vars` | Migrate to `$vars` pattern |
| F7 | 🟢 Low | Edit Fields1 | Empty assignments | Verify if needed or configure |

---

## Fix F1: API: Child Content — Broken URL

### Problem
```
CURRENT:  =EDUCARE_API_URL/api/n8n/content/child
EXPECTED: ={{ $vars.EDUCARE_API_URL }}/api/n8n/content/child
```

The URL is a literal string `EDUCARE_API_URL/api/n8n/content/child` instead of resolving the variable. HTTP requests go to an invalid hostname.

### Fix (n8n UI)
1. Open node **API: Child Content**
2. Change URL field from:
   ```
   =EDUCARE_API_URL/api/n8n/content/child
   ```
   To:
   ```
   ={{ $vars.EDUCARE_API_URL }}/api/n8n/content/child
   ```
3. Save

### Fix (JSON patch)
```json
{
  "node": "API: Child Content",
  "field": "parameters.url",
  "old": "=EDUCARE_API_URL/api/n8n/content/child",
  "new": "={{ $vars.EDUCARE_API_URL }}/api/n8n/content/child"
}
```

---

## Fix F2: Prepare Response — Replace `Merge: Unified Data` References

### Problem
The node references `$('Merge: Unified Data')` which doesn't exist, causing `NodeNotFoundError` at runtime.

### Current Code
```javascript
const item = $input.item;
const source = item.json.source || $('Merge: Unified Data').item.json.source || 'evolution';
const responseText = item.json.response_text || item.json.answer || item.json.message || 'Mensagem recebida!';
const mediaType = item.json.media_type || 'text';

return [{
  json: {
    ...item.json,
    source,
    response_text: responseText,
    media_type: mediaType,
    phone: $('Merge: Unified Data').item.json.phone,
    conversation_id: $('Merge: Unified Data').item.json.conversation_id,
    inbox_id: $('Merge: Unified Data').item.json.inbox_id,
    account_id: $('Merge: Unified Data').item.json.account_id
  }
}];
```

### Fixed Code
```javascript
// Prepara resposta unificada para roteamento de saída
// Busca dados do pipeline — extractor (Chatwoot/Evolution) → Check User → Calc Weeks → API
const item = $input.item;

// Tenta recuperar dados de fonte do extractor que originou este fluxo
let extractorData = {};
try { extractorData = $('Chatwoot Extractor').item.json; } catch(e) {
  try { extractorData = $('Evolution Extractor').item.json; } catch(e2) {
    // Fallback: usar dados do input atual
    extractorData = {};
  }
}

const source = item.json.source || extractorData.source || 'evolution';
const responseText = item.json.response_text || item.json.answer || item.json.message || 'Mensagem recebida!';
const mediaType = item.json.media_type || 'text';

return [{
  json: {
    ...item.json,
    source,
    response_text: responseText,
    media_type: mediaType,
    phone: item.json.phone || extractorData.phone,
    conversation_id: item.json.conversation_id || extractorData.conversation_id || null,
    inbox_id: item.json.inbox_id || extractorData.inbox_id || null,
    account_id: item.json.account_id || extractorData.account_id || null
  }
}];
```

### Rationale
- Uses `try/catch` to safely access the extractor that was active in the current execution
- Falls back to `$input.item.json` if extractors are not accessible (e.g., data was passed forward)
- Preserves all existing field semantics

---

## Fix F3: Prepare: Inactive Msg — Replace `Merge: Unified Data` Reference

### Problem
Line 2 references `$('Merge: Unified Data').item.json` which doesn't exist.

### Current Code
```javascript
const base = $input.item.json;
const unified = $('Merge: Unified Data').item.json;

return [{
  json: {
    channel: base.source || unified.source || 'evolution',
    source: base.source || unified.source || 'evolution',
    message_id: base.message_id || base.id || String(base.timestamp || $execution.id),
    phone: unified.phone,
    text: base.text || base.message || base.body || '',
    user: {
      user_id: base.user_id || base.user?.id || base.user?.user_id,
      name: base.user_name || base.user?.name || '',
      subscription_status: base.subscription_status || base.user?.subscription_status || 'inactive',
      stripe_customer_id: base.stripe_customer_id || base.user?.stripe_customer_id || '',
      stripe_checkout_url: base.stripe_checkout_url || ''
    },
    ctx: {
      locale: base.locale || 'pt-BR',
      campaign_id: base.campaign_id || 'inactive_reactivation_v1',
      conversation_id: unified.conversation_id || null,
      inbox_id: unified.inbox_id || null,
      account_id: unified.account_id || null
    }
  }
}];
```

### Fixed Code
```javascript
const base = $input.item.json;

// Recuperar dados do extractor ativo nesta execução
let extractorData = {};
try { extractorData = $('Chatwoot Extractor').item.json; } catch(e) {
  try { extractorData = $('Evolution Extractor').item.json; } catch(e2) {
    extractorData = {};
  }
}

const phone = base.phone || extractorData.phone || '';

return [{
  json: {
    channel: base.source || extractorData.source || 'evolution',
    source: base.source || extractorData.source || 'evolution',
    message_id: base.message_id || base.id || String(base.timestamp || $execution.id),
    phone,
    text: base.text || base.message || base.body || '',
    user: {
      user_id: base.user_id || base.user?.id || base.user?.user_id,
      name: base.user_name || base.user?.name || '',
      subscription_status: base.subscription_status || base.user?.subscription_status || 'inactive',
      stripe_customer_id: base.stripe_customer_id || base.user?.stripe_customer_id || '',
      stripe_checkout_url: base.stripe_checkout_url || ''
    },
    ctx: {
      locale: base.locale || 'pt-BR',
      campaign_id: base.campaign_id || 'inactive_reactivation_v1',
      conversation_id: extractorData.conversation_id || null,
      inbox_id: extractorData.inbox_id || null,
      account_id: extractorData.account_id || null
    }
  }
}];
```

---

## Fix F4: Router: Menu Options — Replace `Merge: Unified Data` Reference

### Problem
`value1` expression references non-existent node.

### Current
```
={{ $('Merge: Unified Data').item.json.message }}
```

### Fixed
```
={{ $input.item.json.message }}
```

### Rationale
At this point in the flow, the message has been passed through the pipeline from the extractor → Check User → Calc Weeks → Intent Switch. The `$input` contains the accumulated data.

If `$input` doesn't carry `message`, alternative:
```
={{ $('Engine: Calc Weeks').item.json.message }}
```

---

## Fix F5: Router: Intent Switch — Correct Branch Mappings

### Problem
| Value | Current Branch | Current Target | Correct Target |
|-------|---------------|----------------|----------------|
| `question` | 3 | API: Vaccines | API: RAG (TitiNauta) |
| `appointment` | 3 | API: Vaccines | API: Appointments |

All three (`vaccine`, `question`, `appointment`) go to branch 3 (Vaccines).

### Fix — Option A (Add new branches)

Add output branches 4 and 5 to the Switch node:

```json
{
  "parameters": {
    "dataType": "string",
    "value1": "={{ $json.message.content.trim().toLowerCase() }}",
    "rules": {
      "rules": [
        { "value2": "menu_nav" },
        { "value2": "biometrics", "output": 1 },
        { "value2": "sleep", "output": 2 },
        { "value2": "vaccine", "output": 3 },
        { "value2": "question", "output": 4 },
        { "value2": "appointment", "output": 5 }
      ]
    },
    "fallbackOutput": 6
  }
}
```

Then add connections:
- Branch 4 → `API: RAG (TitiNauta)`
- Branch 5 → `API: Appointments`
- Branch 6 (fallback) → Consider routing to `API: RAG (TitiNauta)` as default

### Fix — Option B (Reuse existing connections)

Since the AI Intent Classifier is disabled and `Engine: Calc Weeks` → `AI Intent Classifier` is the only path, the entire Intent Switch might be dead code. In this case:

1. Verify if the disabled `AI Intent Classifier` means the `Router: Intent Switch` is never reached
2. If so, the Menu Options path is the actual routing logic, and Intent Switch can be left as-is

### Recommendation
Check execution logs to confirm whether `Router: Intent Switch` is actively used. If the AI Intent Classifier is disabled, messages likely bypass this path entirely via `Engine: Calc Weeks` → some other route.

---

## Fix F6: API: Check User — Migrate to `$vars` Pattern

### Current
```json
{
  "url": "={{$node[\"Global Constants\"].json.constants.educare.api.base_url + $node[\"Global Constants\"].json.constants.educare.api.endpoints.users_check.path}}",
  "requestMethod": "={{$node[\"Global Constants\"].json.constants.educare.api.endpoints.users_check.method}}",
  "headerParametersUi": {
    "parameter": [{
      "name": "x-api-key",
      "value": "{{$node[\"Global Constants\"].json.constants.educare.api.auth.api_key}}"
    }]
  }
}
```

### Fixed
```json
{
  "url": "={{ $vars.EDUCARE_API_URL }}/api/n8n/users/check",
  "requestMethod": "GET",
  "headerParametersUi": {
    "parameter": [{
      "name": "x-api-key",
      "value": "={{ $vars.EDUCARE_API_KEY }}"
    }]
  }
}
```

### Prerequisites
- Ensure `EDUCARE_API_KEY` exists as an n8n variable (or use the existing `Global Constants` for auth only)
- Verify the correct HTTP method (GET vs POST)

---

## Fix F7: Edit Fields1 — Empty Node

### Problem
`Edit Fields1` has no assignments configured. It receives output from `Prepare: Inactive Msg` and passes it to `Call 'Agente Lead - long memory'1`.

### Analysis
Since `Prepare: Inactive Msg` already structures the data correctly (channel, source, phone, user, ctx), the `Edit Fields1` node may be passing data through unchanged via n8n's default behavior.

### Recommendation
- **If working:** Leave as-is (n8n passes data through even without assignments)
- **If not working:** Configure assignments matching the agent's expected input schema

---

## Application Priority

| Priority | Fix | Risk | Effort |
|----------|-----|------|--------|
| 1 | F1 (Child Content URL) | 🔴 Non-functional endpoint | 1 min |
| 2 | F2 (Prepare Response) | 🔴 Runtime crash on every response | 5 min |
| 3 | F3 (Inactive Msg) | 🔴 Runtime crash for inactive users | 5 min |
| 4 | F4 (Menu Options ref) | 🔴 Runtime crash on menu selection | 1 min |
| 5 | F5 (Intent routing) | 🟡 Incorrect routing (if path is active) | 10 min |
| 6 | F6 (Check User pattern) | 🟢 Functional but inconsistent | 5 min |
| 7 | F7 (Edit Fields1) | 🟢 Likely functional as passthrough | 2 min |

---

## Rollback Plan

Before applying any fix:
1. In n8n, click on the workflow → **Tags** → Add tag `pre-phase2-backup`
2. Export workflow JSON (Settings → Download)
3. Save exported file as `n8n-educare-chat-pre-phase2.json`

If any fix causes issues:
1. Import the saved JSON file
2. Activate the restored workflow
3. Deactivate the broken version

---

## n8n Variables Required (New)

If migrating API: Check User (Fix F6), ensure these n8n variables exist:

| Variable | Value | Status |
|----------|-------|--------|
| `EDUCARE_API_URL` | `https://educareapp.com.br` | ✅ Already exists |
| `EDUCARE_API_KEY` | `{api_key}` | ⚠️ May need to create |
| `EVOLUTION_API_URL` | `https://api.educareapp.com.br` | ✅ Already exists |
| `EVOLUTION_INSTANCE` | `educare-chat` | ✅ Already exists |
| `CHATWOOT_API_URL` | `https://chatwoot.educareapp.com.br` | ✅ Already exists |
