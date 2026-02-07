# Payload Contract — Educare app-chat Workflow

**Version:** 1.0  
**Date:** 2026-02-07  
**Source:** MCP Export (workflow `iLDio0CFRs2Qa1VM`)  
**Purpose:** Documenta todos os esquemas de dados que fluem pelo workflow, da entrada (Webhook) até a saída (Send nodes).

---

## Table of Contents

1. [Webhook Entry Payload](#1-webhook-entry-payload)
2. [Source Detector Output](#2-source-detector-output)
3. [Chatwoot Extractor Output](#3-chatwoot-extractor-output)
4. [Evolution Extractor Output](#4-evolution-extractor-output)
5. [Unified Normalized Schema](#5-unified-normalized-schema)
6. [API: Check User — Request/Response](#6-api-check-user--requestresponse)
7. [Engine: Calc Weeks Output](#7-engine-calc-weeks-output)
8. [Intent/Menu Routing Fields](#8-intentmenu-routing-fields)
9. [API Endpoint Contracts (Educare Backend)](#9-api-endpoint-contracts-educare-backend)
10. [Prepare Response Output](#10-prepare-response-output)
11. [Send Node Payloads (Evo/Chatwoot)](#11-send-node-payloads-evochatwoot)
12. [Fallback Payloads (No User / Inactive)](#12-fallback-payloads-no-user--inactive)
13. [Critical Issues Found](#13-critical-issues-found)

---

## 1. Webhook Entry Payload

**Node:** `Webhook (Unified Entry)`  
**Method:** `POST`  
**Path:** `/chat`  
**Full URL:** `https://n8n.educareapp.com.br/webhook/chat`

The webhook receives raw payloads from two possible sources. The shape depends on the origin:

### 1a. Chatwoot Payload (inbound)

```json
{
  "event": "message_created",
  "conversation": {
    "channel": "Channel::Whatsapp",
    "id": 123
  },
  "sender": {
    "name": "João Silva",
    "phone_number": "+5511999999999"
  },
  "content": "Olá, preciso de ajuda",
  "content_type": "text",
  "id": 456,
  "inbox": {
    "name": "WhatsApp"
  }
}
```

### 1b. Evolution API Payload (inbound)

```json
{
  "instance": "educare-chat",
  "data": {
    "key": {
      "remoteJid": "5511999999999@s.whatsapp.net",
      "fromMe": false,
      "id": "ABC123DEF456"
    },
    "pushName": "João Silva",
    "message": {
      "conversation": "Olá, preciso de ajuda"
    },
    "messageType": "conversation",
    "messageTimestamp": 1707300000
  }
}
```

**Media variants (Evolution):**

```json
{
  "data": {
    "message": {
      "audioMessage": { "mimetype": "audio/ogg; codecs=opus" },
      "imageMessage": { "mimetype": "image/jpeg", "caption": "Foto do bebê" },
      "videoMessage": { "mimetype": "video/mp4", "caption": "Vídeo" },
      "documentMessage": { "mimetype": "application/pdf", "caption": "Relatório" }
    },
    "messageType": "audioMessage"
  }
}
```

---

## 2. Source Detector Output

**Node:** `Source Detector` (code v4.2)  
**Purpose:** Detecta a origem e normaliza os campos iniciais.

### Output Schema

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `source` | `string` | computed | `"chatwoot"` \| `"evolution"` \| `"unknown"` |
| `raw_body` | `object` | passthrough | Payload original completo |
| `is_chatwoot` | `boolean` | computed | `true` se origem é Chatwoot |
| `is_evolution` | `boolean` | computed | `true` se origem é Evolution |
| `nome` | `string\|null` | extracted | Nome do remetente |
| `contato` | `string\|null` | extracted | Telefone (sem `+`, sem `@s.whatsapp.net`) |
| `id_mensagem` | `string\|null` | extracted | ID único da mensagem |
| `mensagem` | `string\|null` | extracted | Texto da mensagem |
| `type_message` | `string\|null` | extracted | Tipo: `"text"`, `"audioMessage"`, `"image"`, etc. |
| `url_anexo` | `string\|null` | extracted | URL do anexo (se disponível) |
| `mime_type` | `string\|null` | extracted | MIME type do anexo |
| `canal` | `string\|null` | extracted | Canal: `"evolution"`, `"Channel::Whatsapp"`, etc. |
| `instancia` | `string` | extracted | Instância Evolution (default: `"educare-chat"`) |
| `origem` | `string\|null` | extracted | Origem: `"whatsapp"`, inbox name, etc. |
| `timestamp` | `string` | extracted | ISO 8601 timestamp |
| `is_human` | `boolean\|null` | computed | `true` se mensagem é de humano (não bot) |
| `from_me` | `boolean\|null` | evolution only | `true` se mensagem enviada pelo bot |
| `remote_jid` | `string\|null` | evolution only | JID completo (`5511...@s.whatsapp.net`) |

---

## 3. Chatwoot Extractor Output

**Node:** `Chatwoot Extractor` (code)  
**Input:** Source Detector output (when `source === "chatwoot"`)

### Output Schema

| Field | Type | Description |
|-------|------|-------------|
| `phone` | `string` | Telefone normalizado |
| `message` | `string` | Texto da mensagem |
| `sender_name` | `string` | Nome do remetente |
| `conversation_id` | `string\|number` | ID da conversa Chatwoot |
| `inbox_id` | `string\|number` | ID do inbox |
| `account_id` | `string\|number` | ID da conta Chatwoot |
| `contact_id` | `string\|number` | ID do contato |
| `source` | `string` | `"chatwoot"` |
| `source_id` | `string` | ID da mensagem no Chatwoot |
| `media_type` | `string\|null` | Tipo de mídia se houver |
| `media_url` | `string\|null` | URL da mídia |
| `is_audio` | `boolean` | `true` se é mensagem de áudio |
| `timestamp` | `string\|number` | Timestamp |
| `thumbnail` | `string\|null` | URL do thumbnail |

---

## 4. Evolution Extractor Output

**Node:** `Evolution Extractor` (code)  
**Input:** Source Detector output (when `source === "evolution"`)

### Output Schema

| Field | Type | Description |
|-------|------|-------------|
| `phone` | `string` | Telefone (sem `@s.whatsapp.net`) |
| `message` | `string` | Texto da mensagem (ou caption) |
| `sender_name` | `string` | pushName |
| `source` | `string` | `"evolution"` |
| `source_id` | `string` | message key.id |
| `media_type` | `string\|null` | `"audio"` \| `"image"` \| `"video"` \| `"document"` \| `null` |
| `media_url` | `string\|null` | URL da mídia (quando disponível) |
| `is_audio` | `boolean` | `true` se `messageType === "audioMessage"` |
| `timestamp` | `string` | ISO timestamp |
| `conversation_id` | `null` | Não aplicável (Evolution) |
| `inbox_id` | `null` | Não aplicável (Evolution) |
| `account_id` | `null` | Não aplicável (Evolution) |
| `contact_id` | `null` | Não aplicável (Evolution) |
| `thumbnail` | `null` | Não aplicável |

---

## 5. Unified Normalized Schema

After passing through `Gate: Not Skipped?` and `Router: Input Type`, both sources converge to a unified shape. This is the **canonical internal schema** used throughout the workflow.

> **⚠️ ISSUE:** O workflow referencia um node `Merge: Unified Data` em 3 nodes (`Router: Menu Options`, `Prepare Response`, `Prepare: Inactive Msg`), mas **esse node NÃO EXISTE** no workflow atual. Isso indica que o merge/unificação acontece implicitamente via passagem de dados ou que o node foi removido sem atualizar as referências.

### Expected Unified Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | `string` | ✅ | Telefone do contato (sem `+`, sem `@s.whatsapp.net`) |
| `message` | `string` | ✅ | Texto da mensagem (transcrito se era áudio) |
| `sender_name` | `string` | ✅ | Nome do remetente |
| `source` | `string` | ✅ | `"chatwoot"` \| `"evolution"` |
| `source_id` | `string` | ✅ | ID da mensagem na origem |
| `media_type` | `string\|null` | ❌ | Tipo de mídia |
| `media_url` | `string\|null` | ❌ | URL da mídia |
| `is_audio` | `boolean` | ✅ | Se era mensagem de áudio (mesmo após transcrição) |
| `timestamp` | `string\|number` | ✅ | Quando a mensagem foi recebida |
| `conversation_id` | `string\|null` | ❌ | Chatwoot only |
| `inbox_id` | `string\|null` | ❌ | Chatwoot only |
| `account_id` | `string\|null` | ❌ | Chatwoot only |
| `contact_id` | `string\|null` | ❌ | Chatwoot only |
| `thumbnail` | `string\|null` | ❌ | Thumbnail URL |

---

## 6. API: Check User — Request/Response

**Node:** `API: Check User`  
**Method:** Dynamic (via Global Constants)  
**URL:** `{base_url}{users_check.path}`  
**Auth:** `x-api-key` header (via Global Constants)

### Expected Request

```
GET/POST {EDUCARE_API_URL}/api/n8n/users/check?phone={phone}
Headers:
  x-api-key: {API_KEY}
```

### Expected Response

```json
{
  "exists": true,
  "user_id": 123,
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "5511999999999",
  "subscription_status": "active",
  "stripe_customer_id": "cus_xxx",
  "stripe_checkout_url": "https://checkout.stripe.com/...",
  "children": [
    {
      "id": 1,
      "name": "Bebê",
      "birth_date": "2025-06-15"
    }
  ]
}
```

### Fields Used Downstream

| Field | Used By | Purpose |
|-------|---------|---------|
| `exists` | `Gate: User Exists?` | Rotear para fluxo de lead se `false` |
| `subscription_status` | `Gate: Active Sub?` | Verificar `"active"` ou `"trialing"` |
| `children[0].birth_date` | `Engine: Calc Weeks` | Calcular semanas de desenvolvimento |
| `user_id`, `name` | `Prepare: Inactive Msg` | Contexto do usuário para agente |
| `stripe_customer_id`, `stripe_checkout_url` | `Prepare: Inactive Msg` | Link de reativação |

---

## 7. Engine: Calc Weeks Output

**Node:** `Engine: Calc Weeks` (code)  
**Purpose:** Calcula as semanas desde o nascimento do primeiro filho.

### Output Schema (added fields)

| Field | Type | Description |
|-------|------|-------------|
| `week_number` | `number` | Semana atual de desenvolvimento |
| `month_number` | `number` | Mês atual |
| `child_name` | `string` | Nome do filho |
| `birth_date` | `string` | Data de nascimento (ISO) |

> These fields are **merged** into the existing data flowing downstream.

---

## 8. Intent/Menu Routing Fields

### Router: Intent Switch

**Input field:** `$json.message.content.trim().toLowerCase()`  
**Values:**

| Value | Branch | Destination |
|-------|--------|-------------|
| `"menu_nav"` | 0 | Router: Menu Options |
| `"biometrics"` | 1 | API: Biometrics |
| `"sleep"` | 2 | API: Sleep Log |
| `"vaccine"` | 3 | API: Vaccines |
| `"question"` | 3 | API: Vaccines *(⚠️ same branch as vaccine)* |
| `"appointment"` | 3 | API: Vaccines *(⚠️ same branch as vaccine)* |
| *(fallback)* | 4 | *(no connected node visible)* |

> **⚠️ ISSUE:** `question` e `appointment` estão mapeados para branch 3 (same as `vaccine`), o que parece incorreto. `question` deveria ir para `API: RAG (TitiNauta)` e `appointment` para `API: Appointments`.

### Router: Menu Options

**Input field:** `$('Merge: Unified Data').item.json.message`  
**Values:**

| Value | Branch | Destination |
|-------|--------|-------------|
| `"1"` | 0 | API: Child Content |
| `"2"` | 1 | API: Mother Content |
| `"3"` | 2 | API: Vaccines |
| `"4"` | 3 | API: RAG (TitiNauta) |
| `"5"` | 3 | API: RAG (TitiNauta) |
| *(fallback)* | 0 | API: Child Content |

> **⚠️ ISSUE:** Referencia `$('Merge: Unified Data')` que NÃO existe no workflow.

---

## 9. API Endpoint Contracts (Educare Backend)

All backend APIs follow the pattern `{EDUCARE_API_URL}/api/n8n/{resource}`.

| Endpoint | Node | Method | Expected Query/Body |
|----------|------|--------|---------------------|
| `/api/n8n/users/check` | API: Check User | GET/POST | `?phone={phone}` |
| `/api/n8n/biometrics/update` | API: Biometrics | GET | `?phone={phone}&...` |
| `/api/n8n/sleep/log` | API: Sleep Log | GET | `?phone={phone}&...` |
| `/api/n8n/vaccines/check` | API: Vaccines | GET | `?phone={phone}&...` |
| `/api/n8n/rag/ask` | API: RAG (TitiNauta) | GET | `?phone={phone}&message={message}&...` |
| `/api/n8n/appointments/create` | API: Appointments | GET | `?phone={phone}&...` |
| `/api/n8n/content/child` | API: Child Content | GET | `?week={week_number}&...` |
| `/api/n8n/content/mother` | API: Mother Content | GET | `?week={week_number}&...` |

> **⚠️ NOTE:** Todos os API nodes têm `options: {}` vazio — nenhum query parameter, body ou header está configurado nos nodes visíveis. Os parâmetros provavelmente são passados via sendDataAsFormURLEncoded ou defaults do n8n, mas isso precisa ser validado.

---

## 10. Prepare Response Output

**Node:** `Prepare Response` (code)  
**Purpose:** Monta o payload padronizado para envio.

### Output Schema

| Field | Type | Description |
|-------|------|-------------|
| `source` | `string` | `"chatwoot"` \| `"evolution"` |
| `response_text` | `string` | Texto da resposta a enviar |
| `media_type` | `string` | `"text"` \| `"image"` \| `"audio"` \| `"document"` |
| `media_url` | `string\|null` | URL da mídia (se aplicável) |
| `phone` | `string` | Telefone do destinatário |
| `conversation_id` | `string\|null` | Chatwoot conversation ID |
| `account_id` | `string\|null` | Chatwoot account ID |
| `inbox_id` | `string\|null` | Chatwoot inbox ID |

---

## 11. Send Node Payloads (Evo/Chatwoot)

### 11a. Chatwoot: Send Text

**URL:** `{CHATWOOT_API_URL}/api/v1/accounts/{account_id}/conversations/{conversation_id}/messages`  
**Method:** POST (assumed)

```json
{
  "content": "{response_text}",
  "message_type": "outgoing"
}
```

### 11b. Evo: Send Text

**URL:** `{EVOLUTION_API_URL}/message/sendText/{EVOLUTION_INSTANCE}`  
**Method:** POST

```json
{
  "number": "{phone}",
  "text": "{response_text}"
}
```

### 11c. Evo: Send Image / Document

**URL:** `{EVOLUTION_API_URL}/message/sendMedia/{EVOLUTION_INSTANCE}`  
**Method:** POST

```json
{
  "number": "{phone}",
  "mediatype": "image",
  "media": "{media_url}",
  "caption": "{response_text}"
}
```

### 11d. Evo: Send Audio

**URL:** `{EVOLUTION_API_URL}/message/sendWhatsAppAudio/{EVOLUTION_INSTANCE}`  
**Method:** POST

```json
{
  "number": "{phone}",
  "audio": "{media_url}"
}
```

> **⚠️ ISSUE:** Todos os Send nodes têm `options: {}` vazio — body e headers não estão configurados nos parâmetros visíveis dos nodes. O envio provavelmente depende de configuração herdada ou defaults.

---

## 12. Fallback Payloads (No User / Inactive)

### 12a. Prepare: No User Msg → Edit Fields → Agente Lead

O node `Prepare: No User Msg` monta payload com:

| Field | Type | Description |
|-------|------|-------------|
| `phone` | `string` | Telefone do contato |
| `message` | `string` | Mensagem original |
| `source` | `string` | Canal de origem |
| `response_text` | `string` | Mensagem promocional |
| `user_found` | `boolean` | `false` |
| `lead_status` | `string` | `"novo"` |
| `media_type`, `media_url`, `is_audio` | mixed | Estado da mídia |
| `source_id`, `timestamp` | mixed | Identificadores |
| `conversation_id`, `inbox_id`, `account_id`, `contact_id` | mixed | Chatwoot IDs |
| `sender_name`, `thumbnail` | string | Dados do remetente |

O `Edit Fields` repassa esses campos para o workflow `Call 'Agente Lead'`.

### 12b. Prepare: Inactive Msg → Edit Fields1 → Agente Lead Long Memory

| Field | Type | Description |
|-------|------|-------------|
| `channel` | `string` | Canal (`evolution` default) |
| `source` | `string` | Origem |
| `message_id` | `string` | ID da mensagem |
| `phone` | `string` | Telefone |
| `text` | `string` | Mensagem original |
| `user.user_id` | `number` | ID do usuário no Educare |
| `user.name` | `string` | Nome |
| `user.subscription_status` | `string` | Status da assinatura |
| `user.stripe_customer_id` | `string` | Stripe customer ID |
| `user.stripe_checkout_url` | `string` | URL para reativar |
| `ctx.locale` | `string` | `"pt-BR"` |
| `ctx.campaign_id` | `string` | `"inactive_reactivation_v1"` |
| `ctx.conversation_id` | `string\|null` | Chatwoot ID |
| `ctx.inbox_id` | `string\|null` | Chatwoot inbox |
| `ctx.account_id` | `string\|null` | Chatwoot account |

> **⚠️ ISSUE:** `Prepare: Inactive Msg` referencia `$('Merge: Unified Data').item.json` que não existe no workflow.

---

## 13. Critical Issues Found

### Issue P1-01: Missing "Merge: Unified Data" Node

- **Severity:** 🔴 Critical
- **Nodes affected:** `Router: Menu Options`, `Prepare Response`, `Prepare: Inactive Msg`
- **Problem:** 3 nodes referenciam `$('Merge: Unified Data').item.json` mas o node NÃO EXISTE no workflow
- **Impact:** Execuções que passam por esses nodes vão falhar com `NodeNotFoundError`
- **Fix:** Criar um Merge node que consolida dados de Chatwoot/Evolution Extractors, ou alterar referências para usar o pipeline de dados nativo

### Issue P1-02: API: Child Content URL Broken

- **Severity:** 🔴 Critical
- **Node:** `API: Child Content`
- **Problem:** URL é `=EDUCARE_API_URL/api/n8n/content/child` — falta `{{ $vars. }}`
- **Impact:** Request vai para URL literal inválida
- **Fix:** Alterar para `={{ $vars.EDUCARE_API_URL }}/api/n8n/content/child`

### Issue P1-03: Router: Intent Switch Incorrect Mappings

- **Severity:** 🟡 Medium
- **Node:** `Router: Intent Switch`
- **Problem:** `question` e `appointment` mapeiam para branch 3 (API: Vaccines) em vez de seus destinos corretos
- **Impact:** Perguntas ao TitiNauta e agendamentos vão para o endpoint de vacinas
- **Fix:** Criar branches separadas: `question` → `API: RAG`, `appointment` → `API: Appointments`

### Issue P1-04: API Nodes Empty Options

- **Severity:** 🟡 Medium
- **All API nodes + Send nodes**
- **Problem:** `options: {}` vazio — sem query params, body ou headers explícitos
- **Impact:** Requests podem falhar ou enviar dados inesperados dependendo de defaults do n8n
- **Fix:** Configurar explicitamente queryParameters ou bodyParameters em cada node

### Issue P1-05: API: Check User Uses Different URL Pattern

- **Severity:** 🟢 Low (funcional, mas inconsistente)
- **Node:** `API: Check User`
- **Problem:** Usa `$node["Global Constants"]` enquanto todos os outros usam `$vars.EDUCARE_API_URL`
- **Fix:** Migrar para `$vars` pattern para consistência

### Issue P1-06: Edit Fields1 Empty

- **Severity:** 🟡 Medium
- **Node:** `Edit Fields1`
- **Problem:** Nenhum assignment configurado — passa dados sem transformação
- **Impact:** O workflow `Call 'Agente Lead - long memory'1` pode não receber os campos esperados
- **Fix:** Configurar assignments semelhantes ao `Edit Fields` ou remover se desnecessário

---

## Data Flow Diagram

```
WEBHOOK POST /chat
       │
       ▼
 ┌─────────────────┐
 │ Source Detector  │ → { source, nome, contato, mensagem, is_human, ... }
 └────────┬────────┘
          │
     ┌────┴────┐
     │ É humano│
     └────┬────┘
          │
   ┌──────┴──────┐
   │ Source Type  │
   ├─────┬───────┤
   │  CW │  EVO  │
   └──┬──┘──┬────┘
      ▼     ▼
 ┌────────┐ ┌────────┐
 │CW Extr.│ │Evo Ext.│ → Normalized: { phone, message, source, media_type, ... }
 └───┬────┘ └───┬────┘
     └─────┬────┘
           ▼
    ┌──────────────┐
    │ Not Skipped?  │
    └──────┬───────┘
           ▼
    ┌──────────────┐       ┌──────────────┐
    │ Input Type    │──────▶│ Transcribe    │──▶ Normalize Audio
    │ (audio/text)  │       └──────────────┘        │
    └──────┬───────┘                                │
           ├────────────────────────────────────────┘
           ▼
    ┌──────────────┐
    │ Check User    │ → { exists, subscription_status, children, ... }
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │ User Exists?  │──[no]──▶ No User Msg → Edit Fields → Agente Lead
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │ Active Sub?   │──[no]──▶ Inactive Msg → Edit Fields1 → Agente Lead (long)
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │ Calc Weeks    │ → { week_number, month_number, child_name }
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │Intent Switch  │ → Routes to API endpoints
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │ API: [domain] │ → { response_text, media_type?, media_url? }
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │Prepare Resp.  │ → { source, response_text, media_type, phone, ... }
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │Response Source│
    ├──────┬───────┤
    │  CW  │  EVO  │
    └──┬───┘──┬────┘
       ▼      ▼
  CW:Send  Evo Router → Send Text | Send Image | Send Audio | Send Document
```

---

## n8n Variables Required

| Variable | Purpose | Example |
|----------|---------|---------|
| `EDUCARE_API_URL` | Base URL da API Educare | `https://educareapp.com.br` |
| `EVOLUTION_API_URL` | Base URL da Evolution API | `https://api.educareapp.com.br` |
| `EVOLUTION_INSTANCE` | Nome da instância Evolution | `educare-chat` |
| `CHATWOOT_API_URL` | Base URL da API Chatwoot | `https://chatwoot.educareapp.com.br` |

---

## Global Constants Object (via `Global Constants` node)

```json
{
  "constants": {
    "educare": {
      "api": {
        "base_url": "https://educareapp.com.br",
        "auth": {
          "api_key": "..."
        },
        "endpoints": {
          "users_check": {
            "method": "GET",
            "path": "/api/n8n/users/check"
          }
        }
      }
    }
  }
}
```

> **⚠️ NOTE:** Apenas `API: Check User` usa esta estrutura. Todos os outros nodes usam `$vars`. Recomendação: migrar tudo para `$vars`.
