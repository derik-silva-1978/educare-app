# 🤖 N8N + RAG Integration Guide (Fase 5)

**Status:** ✅ Ready for Production  
**Last Updated:** December 9, 2025  
**RAG Endpoints:** Tested and fully functional

---

## 📌 Overview

A **Fase 5** integra o RAG (Retrieval-Augmented Generation) com o workflow n8n, permitindo que o TitiNauta forneça respostas personalizadas ao bebê durante conversas no WhatsApp.

### Fluxo de Integração

```
WhatsApp Message
       │
       ▼
  n8n Webhook
       │
       ├─ Extrair phone + message
       │
       ├─ Buscar user (API Externa)
       │
       ├─ Buscar child ativo (API Externa)
       │
       ├─ Chamar RAG endpoint
       │  └─ Passar baby_id + question
       │
       ▼
  TitiNauta Response (Personalizada)
       │
       ▼
  Enviar no WhatsApp
```

---

## 🎯 Endpoints RAG Disponíveis

### 1. **Consulta RAG Completa (Com File Search)**

```
POST /api/rag/external/ask
Content-Type: application/json
Authorization: X-API-Key: {EXTERNAL_API_KEY}
```

**Request:**
```json
{
  "question": "Como estimular o desenvolvimento motor do bebê?",
  "baby_id": "uuid-da-crianca",
  "age_range": "0-3m",
  "domain": "motor",
  "tags": ["desenvolvimento"],
  "use_file_search": true
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Para o pequeno João, com 3 meses... [resposta personalizada]",
  "metadata": {
    "documents_found": 3,
    "documents_used": [
      {
        "id": "uuid",
        "title": "Guia de Desenvolvimento Motor OMS",
        "source_type": "oms"
      }
    ],
    "file_search_used": true,
    "chunks_retrieved": 2,
    "model": "gpt-4o-mini",
    "usage": {
      "prompt_tokens": 300,
      "completion_tokens": 200,
      "total_tokens": 500
    },
    "processing_time_ms": 4500
  }
}
```

### 2. **Consulta RAG Simples (Sem File Search)**

```
POST /api/rag/external/ask-simple
Content-Type: application/json
Authorization: X-API-Key: {EXTERNAL_API_KEY}
```

**Request:**
```json
{
  "question": "Quanto tempo de sono o bebê precisa?",
  "baby_id": "uuid-da-crianca"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Para o João, com 3 meses... [resposta personalizada, sem File Search]"
}
```

---

## 🔧 Integração no N8N Blueprint v2

### Passo 1: Adicionar HTTP Request Node

No seu workflow n8n (após buscar o child_id):

**Node Name:** `Call RAG Endpoint`

**Configuration:**

| Campo | Valor |
|-------|-------|
| **Method** | POST |
| **URL** | `{{ $env.EDUCARE_API_URL }}/rag/external/ask` |
| **Authentication** | Header Auth |
| **Header Name** | `X-API-Key` |
| **Header Value** | `{{ $env.EXTERNAL_API_KEY }}` |
| **Request Body Type** | JSON |

**Request Body:**
```json
{
  "question": "{{ $node['Extract Message'].json.messageBody }}",
  "baby_id": "{{ $node['Get Active Child'].json.id }}",
  "use_file_search": true
}
```

### Passo 2: Usar Resposta do RAG

Após receber a resposta, enviar no WhatsApp:

**Response Path:** `{{ $node['Call RAG Endpoint'].json.answer }}`

---

## 📝 Exemplo Completo de N8N Node

```json
{
  "name": "Call RAG Endpoint",
  "type": "n8n-nodes-base.httpRequest",
  "position": [900, 500],
  "parameters": {
    "url": "{{ $env.EDUCARE_API_URL }}/rag/external/ask",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "X-API-Key": "{{ $env.EXTERNAL_API_KEY }}"
    },
    "bodyParametersJson": {
      "question": "{{ $node['Extract Message'].json.messageBody }}",
      "baby_id": "{{ $node['Get Active Child'].json.id }}",
      "use_file_search": true
    }
  }
}
```

---

## 🧪 Teste Manual

### Via cURL:

```bash
curl -X POST https://seu-backend/api/rag/external/ask \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua_api_key" \
  -d '{
    "question": "Qual é o melhor alimento para iniciar diversificação?",
    "baby_id": "12345678-1234-1234-1234-123456789012",
    "domain": "alimentacao",
    "use_file_search": true
  }'
```

### Response Esperada:

```json
{
  "success": true,
  "answer": "Para a pequena Maria, com 6 meses... [resposta personalizada baseada em documentos OMS]",
  "metadata": {
    "documents_found": 5,
    "file_search_used": true,
    "processing_time_ms": 4200
  }
}
```

---

## 🔐 Segurança

### API Key Management
- A chave `EXTERNAL_API_KEY` é validada em cada request
- Use variáveis de ambiente no n8n (Settings → Variables)
- Nunca exponha a chave no código

### Rate Limiting
- Limite de 100 requests/minuto por API key
- File Search pode levar até 10 segundos

### Error Handling

No n8n, adicione um node de error handling:

```json
{
  "name": "Handle RAG Error",
  "type": "n8n-nodes-base.if",
  "condition": "{{ $node['Call RAG Endpoint'].json.success === false }}",
  "thenBranch": [
    {
      "name": "Send Error Message",
      "message": "Desculpe, não consegui processar sua pergunta. Tente novamente."
    }
  ]
}
```

---

## 📊 Fluxo Completo no N8N

```
┌─────────────────────────┐
│  Webhook: WhatsApp      │
│  Recebe: phone, msg     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Search User (API)       │
│ GET /external/users/... │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Get Active Child        │
│ GET /external/users/... │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Call RAG Endpoint ⭐    │
│ POST /rag/external/ask  │
│ + baby_id + question    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Extract Answer          │
│ $.answer                │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Send WhatsApp Message   │
│ Resposta personalizada  │
└─────────────────────────┘
```

---

## 🚀 Próximas Fases

### Fase 6: Frontend Super Admin
- Interface para upload de documentos
- Gerenciamento da base de conhecimento

### Fase 7: Prompt Templates
- Versioning de prompts
- Customização per-organization

### Fase 8-9: Refinement e QA
- Testes end-to-end
- Performance optimization

---

## 📚 Referências

- **RAG Documentation**: `RAG-EDUCARE.md`
- **External API**: `README_DIAGNOSTICO.md`
- **N8N Setup**: `N8N_BLUEPRINT_SETUP.md`
