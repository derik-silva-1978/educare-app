# Integração WhatsApp - Educare+

**Status:** ✅ **IMPLEMENTAÇÃO CONFIRMADA COM EVOLUTION API**

Este documento descreve a integração WhatsApp para o sistema Educare+ usando Evolution API + n8n.

---

## Visão Geral

A integração WhatsApp permite que usuários do Educare+ respondam às perguntas de acompanhamento do desenvolvimento infantil diretamente pelo WhatsApp, sem precisar acessar o aplicativo web.

### Solução Adotada: Evolution API + n8n

**Configuração Atual:**
- **Servidor Evolution API:** `https://api.educareapp.com.br`
- **API Key Evolution:** `eff3ea025256694c10422fd0fc5ff169`
- **Instance Name:** `evolution`
- **n8n Server:** `https://n8n.educareapp.com.br`
- **Webhook n8n:** `https://n8n.educareapp.com.br/webhook-test/chat`
- **Backend Educare:** `https://[SEU-REPLIT].replit.dev:3001`
- **Status:** ✅ Pronto para Deploy

---

## Opções de Integração

### Opção 1: Twilio (Recomendado)

**Vantagens:**
- Integração Replit disponível
- API robusta e bem documentada
- Suporte a webhooks simplificado
- Sandbox gratuito para desenvolvimento
- Escalabilidade comprovada

**Desvantagens:**
- Custo por mensagem ($0.005 - $0.05 por msg)
- Requer aprovação para número próprio

**Custo Estimado:** $20-100/mês para uso moderado

### Opção 2: Meta Cloud API (WhatsApp Business API)

**Vantagens:**
- Integração direta com Meta/Facebook
- Preços competitivos
- Acesso a recursos avançados
- Templates de mensagem

**Desvantagens:**
- Setup mais complexo
- Requer verificação de negócio
- Curva de aprendizado maior

**Custo Estimado:** $0.005-$0.08 por conversa (primeiras 1000 grátis/mês)

---

## Configuração Twilio

### 1. Criar Conta Twilio

1. Acesse [twilio.com](https://www.twilio.com/)
2. Crie uma conta gratuita
3. Verifique seu número de telefone

### 2. Ativar WhatsApp Sandbox

1. No console Twilio, vá para **Messaging > Try it out > Send a WhatsApp message**
2. Siga as instruções para ativar o sandbox
3. Anote o número do sandbox: `+14155238886`

### 3. Configurar Webhook

No console Twilio:
1. Vá para **Messaging > Settings > WhatsApp Sandbox Settings**
2. Configure "When a message comes in":
   ```
   https://your-n8n-url.com/webhook/whatsapp-webhook
   ```
3. Método: POST

### 4. Obter Credenciais

No console Twilio:
1. Vá para **Account > Keys & Credentials**
2. Copie:
   - **Account SID**: `AC...`
   - **Auth Token**: `...`

### 5. Variáveis de Ambiente

```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## Configuração Meta Cloud API

### 1. Pré-requisitos

- Conta Facebook Business
- Conta Meta for Developers
- Verificação de negócio aprovada

### 2. Criar App no Meta for Developers

1. Acesse [developers.facebook.com](https://developers.facebook.com/)
2. Crie um novo app do tipo **Business**
3. Adicione o produto **WhatsApp**

### 3. Configurar WhatsApp Business

1. Vincule sua conta WhatsApp Business
2. Adicione um número de telefone de teste
3. Obtenha o **Phone Number ID**

### 4. Gerar Token de Acesso

1. Vá para **App Dashboard > WhatsApp > Getting Started**
2. Clique em **Generate Token**
3. Copie o token (válido por 24h no modo desenvolvimento)

Para produção:
1. Vá para **App Dashboard > Settings > Basic**
2. Configure um System User
3. Gere um token permanente

### 5. Configurar Webhook

1. Vá para **App Dashboard > WhatsApp > Configuration**
2. Clique em **Edit** no Webhook
3. Configure:
   - **Callback URL**: `https://your-n8n-url.com/webhook/whatsapp-meta`
   - **Verify Token**: um token secreto de sua escolha
4. Assine os campos: `messages`

### 6. Variáveis de Ambiente

```env
WHATSAPP_ACCESS_TOKEN=EAAGz...
WHATSAPP_PHONE_NUMBER_ID=123456789...
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321...
WHATSAPP_VERIFY_TOKEN=seu_token_secreto
```

---

## Formato das Mensagens

### Mensagem Recebida (Twilio)

```json
{
  "SmsMessageSid": "SM...",
  "NumMedia": "0",
  "ProfileName": "João Silva",
  "SmsSid": "SM...",
  "WaId": "5511999999999",
  "SmsStatus": "received",
  "Body": "Sim",
  "To": "whatsapp:+14155238886",
  "NumSegments": "1",
  "ReferralNumMedia": "0",
  "MessageSid": "SM...",
  "AccountSid": "AC...",
  "From": "whatsapp:+5511999999999",
  "ApiVersion": "2010-04-01"
}
```

### Mensagem Recebida (Meta)

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "5511999999999",
          "phone_number_id": "PHONE_NUMBER_ID"
        },
        "contacts": [{
          "profile": { "name": "João Silva" },
          "wa_id": "5511999999999"
        }],
        "messages": [{
          "from": "5511999999999",
          "id": "wamid.xxx",
          "timestamp": "1234567890",
          "text": { "body": "Sim" },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

---

## Enviar Mensagens

### Via Twilio (Node.js)

```javascript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendWhatsAppMessage(to, message) {
  const response = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:${to}`,
    body: message
  });
  return response;
}
```

### Via Meta Cloud API (Node.js)

```javascript
const axios = require('axios');

async function sendWhatsAppMessage(to, message) {
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: { body: message }
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}
```

---

## Templates de Mensagem (Meta)

Para enviar mensagens proativas (fora da janela de 24h), use templates aprovados:

### Criar Template

1. Vá para **WhatsApp Manager > Message Templates**
2. Crie um novo template
3. Aguarde aprovação (geralmente 24-48h)

### Usar Template

```javascript
async function sendTemplateMessage(to, templateName, variables) {
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'pt_BR' },
        components: [{
          type: 'body',
          parameters: variables.map(v => ({ type: 'text', text: v }))
        }]
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}
```

---

## Segurança

### Validação de Webhook (Twilio)

```javascript
const crypto = require('crypto');

function validateTwilioSignature(req, authToken) {
  const twilioSignature = req.headers['x-twilio-signature'];
  const url = `https://your-domain.com${req.originalUrl}`;
  
  const params = Object.keys(req.body).sort().reduce((acc, key) => {
    return acc + key + req.body[key];
  }, url);
  
  const expectedSignature = crypto
    .createHmac('sha1', authToken)
    .update(params)
    .digest('base64');
  
  return twilioSignature === expectedSignature;
}
```

### Validação de Webhook (Meta)

```javascript
function verifyMetaWebhook(req, appSecret) {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', appSecret)
    .update(payload)
    .digest('hex');
  
  return signature === expectedSignature;
}
```

---

## Limites e Quotas

### Twilio

- **Sandbox**: 1 mensagem por segundo
- **Produção**: 200+ mensagens por segundo
- **Sem limite diário** (baseado em créditos)

### Meta Cloud API

- **Tier 1**: 1,000 conversas/dia
- **Tier 2**: 10,000 conversas/dia
- **Tier 3**: 100,000 conversas/dia
- **Tier 4**: Ilimitado

---

## Custos Comparativos

| Critério | Twilio | Meta Cloud API |
|----------|--------|----------------|
| Setup | Gratuito | Gratuito |
| Mensagens enviadas | $0.005/msg | $0.0085/msg (após 1000 grátis) |
| Mensagens recebidas | Gratuito | Gratuito |
| Janela de 24h | N/A | Grátis |
| Fora da janela | N/A | Requer template |
| Suporte | Email/Chat | Documentação |

---

## Recomendação Final

### Para Desenvolvimento
Use **Twilio Sandbox** - gratuito e fácil de configurar.

### Para Produção
1. **Baixo volume (< 1000 conversas/mês)**: Meta Cloud API (mais econômico)
2. **Alto volume (> 1000 conversas/mês)**: Avaliar custos de ambos
3. **Simplicidade**: Twilio (API mais simples)
4. **Recursos avançados**: Meta Cloud API (templates, status detalhado)

---

## Próximos Passos

1. Escolher provedor (Twilio ou Meta)
2. Criar conta e configurar
3. Obter credenciais
4. Configurar variáveis de ambiente
5. Testar webhook com n8n
6. Validar fluxo completo

---

## Integração Chatwoot (Nova - v4.0)

### Visão Geral

O Chatwoot permite gerenciar conversas do WhatsApp com interface de atendimento, histórico unificado e automações.

**Configuração Atual:**
- **Chatwoot URL:** `https://chatwoot.educareapp.com.br`
- **Account ID:** `2` (Educare+ Tech)
- **Inbox:** `Educare+ MyChat` (ID: 1)
- **Channel:** API conectada ao Evolution API

### Fluxo de Dados

```
WhatsApp → Evolution API → Chatwoot → Webhook n8n
                                          ↓
                                    Educare+ API
                                          ↓
                               Chatwoot API (resposta)
                                          ↓
                               Evolution API → WhatsApp
```

### Estrutura do Webhook Chatwoot

```json
{
  "event": "message_created",
  "message_type": "incoming",
  "account": { "id": 2, "name": "Educare+ Tech" },
  "inbox": { "id": 1, "name": "Educare+ MyChat" },
  "conversation": {
    "id": 3,
    "messages": [...],
    "meta": {
      "sender": {
        "id": 2,
        "name": "Nome do Contato",
        "phone_number": "+559891628206",
        "identifier": "559891628206@s.whatsapp.net"
      }
    }
  },
  "content": "Texto da mensagem",
  "attachments": [
    {
      "file_type": "audio",
      "data_url": "https://chatwoot.../file.oga"
    }
  ],
  "sender": { "id": 2, "name": "Nome", "email": "...", "type": "user" }
}
```

### Eventos Suportados

| Evento | Descrição | Processado |
|--------|-----------|------------|
| `message_created` | Nova mensagem | Sim (apenas incoming) |
| `message_updated` | Mensagem editada | Não |
| `conversation_created` | Nova conversa | Não |
| `conversation_status_changed` | Status alterado | Não |

### Configurar Webhook no Chatwoot

1. Acesse **Settings > Integrations > Webhooks**
2. Clique em **Add New Webhook**
3. Configure:
   - **URL:** `https://n8n.educareapp.com.br/webhook-test/chat`
   - **Events:** Marque `message_created`
4. Salve

### API de Resposta Chatwoot

Para enviar mensagens de volta ao WhatsApp via Chatwoot:

```http
POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages
Headers:
  api_access_token: {CHATWOOT_API_KEY}
  Content-Type: application/json

Body:
{
  "content": "Mensagem de resposta",
  "message_type": "outgoing",
  "private": false
}
```

### Variáveis n8n para Chatwoot

```
CHATWOOT_API_URL=https://chatwoot.educareapp.com.br
CHATWOOT_API_KEY=seu_access_token_aqui
```

### Diferenças Evolution vs Chatwoot

| Aspecto | Evolution API | Chatwoot |
|---------|--------------|----------|
| Formato telefone | `559891628206@s.whatsapp.net` | `+559891628206` ou identifier |
| Mensagem | `message.conversation` | `content` |
| Áudio | `message.audioMessage.url` | `attachments[].data_url` |
| Tipo msg | Implícito | `message_type: incoming/outgoing` |
| Histórico | Não | `conversation.messages[]` |

### Vantagens do Chatwoot

1. **Interface de atendimento** - Visualize todas as conversas
2. **Histórico completo** - Mensagens persistem no Chatwoot
3. **Multi-agente** - Vários atendentes podem responder
4. **Labels e Tags** - Organize conversas por categoria
5. **Automações** - Regras de auto-assign, respostas automáticas
6. **Relatórios** - Métricas de atendimento

---

## Arquitetura Dual-Source (v4.0)

O workflow n8n v4.0 suporta **ambas as fontes simultaneamente**:

### Fluxo Unificado

```
┌─────────────────┐     ┌─────────────────┐
│  Evolution API  │     │    Chatwoot     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
          ┌─────────────────────┐
          │  Webhook Unificado  │
          │  /chat-educare-v4   │
          └──────────┬──────────┘
                     ▼
          ┌─────────────────────┐
          │   Source Detector   │
          │ (Chatwoot/Evolution)│
          └──────────┬──────────┘
                     ▼
    ┌────────────────┴────────────────┐
    ▼                                 ▼
┌──────────────┐              ┌──────────────┐
│   Chatwoot   │              │   Evolution  │
│   Extractor  │              │   Extractor  │
└──────┬───────┘              └───────┬──────┘
       │                              │
       └──────────────┬───────────────┘
                      ▼
            ┌─────────────────┐
            │  Merge: Unified │
            │     Data        │
            └────────┬────────┘
                     ▼
           [Processamento Normal]
                     ▼
            ┌─────────────────┐
            │  Router: Source │
            └────────┬────────┘
                     ▼
    ┌────────────────┴────────────────┐
    ▼                                 ▼
┌──────────────┐              ┌──────────────┐
│   Chatwoot   │              │   Evolution  │
│   Response   │              │   Response   │
└──────────────┘              └──────────────┘
```

### Estrutura Unificada

Após a extração, ambos os extratores produzem a mesma estrutura:

```javascript
{
  source: 'chatwoot' | 'evolution',
  phone: '559891628206',
  message: 'Texto da mensagem',
  is_audio: 'true' | 'false',
  media_url: 'https://...',
  media_type: 'text' | 'audio' | 'image' | 'document',
  conversation_id: 3,      // Chatwoot only
  inbox_id: 1,             // Chatwoot only
  account_id: 2,           // Chatwoot only
  contact_id: 2,           // Chatwoot only
  sender_name: 'Nome'      // Chatwoot only
}
```

---

*Documentação Educare+ - Dezembro 2025 - v4.0*
