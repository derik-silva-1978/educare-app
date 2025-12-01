# 🤖 N8N Blueprint Setup Guide - Educare+ TitiNauta

**Status:** ✅ Ready for Production  
**Last Updated:** December 1, 2025  
**Webhook Test URL:** https://n8neducare.whatscall.com.br/webhook-test/titnauta

---

## 🚀 Quick Start

### 1. Import the Blueprint

1. Go to your n8n instance (https://n8neducare.whatscall.com.br)
2. Click **"New Workflow"** → **"Import"**
3. Select the file: `n8n-educare-chat-original.json` (uploaded blueprint)
4. Click **Import**
5. Import also: `n8n-educare-api-integration.json` (API integration nodes)

### 2. Configure Environment Variables

Before activating the workflow, set these credentials:

#### Required - Educare+ External API
```
EDUCARE_API_URL=https://your-educare-backend-domain.com/api/external
EXTERNAL_API_KEY=educare_external_api_key_2025
```

#### Required - Evolution API (WhatsApp Provider)
```
EVOLUTION_API_URL=https://your-evolution-instance.com
EVOLUTION_API_KEY=your_evolution_api_key
EVOLUTION_INSTANCE=your_instance_name
```

#### Optional - AI Enhancement
```
OPENAI_API_KEY=sk-xxx...  (already configured in Educare+)
GROQ_API_KEY=gsk_xxx...   (for audio transcription & image analysis)
GEMINI_API_KEY=AIzaSy...  (alternative for audio/image)
```

### 3. Set Credentials in n8n

In n8n UI, go to **Credentials** and add:

1. **OpenAI API**
   - API Key: `${OPENAI_API_KEY}`

2. **Postgres (Chat Memory)**
   - Host: your-postgres-host
   - Database: n8n_chat_memory
   - User: postgres
   - Password: your-password

### 4. Add API Integration Nodes

The original blueprint doesn't include Educare+ API calls. Add the nodes from:
`n8n-educare-api-integration.json`

**Key nodes to add:**
| Node Name | Purpose | Connect After |
|-----------|---------|---------------|
| `Educare: Search User by Phone` | Find user in Educare+ | `Dados` node |
| `Educare: Check User Found` | Route found/not found | Search User |
| `Educare: Get Active Child` | Fetch active child | Check User (TRUE) |
| `Educare: Get Unanswered Questions` | Get quiz questions | Get Active Child |
| `Educare: Parse User Answer` | Classify message | Get Unanswered Questions |
| `Educare: Route Message` | Route by type | Parse User Answer |
| `Educare: Save Answer` | Save quiz response | Route (answer) |
| `Educare: Get Progress` | Fetch progress | Save Answer |

### 5. Test the Webhook

**Test URL:** https://n8neducare.whatscall.com.br/webhook-test/titnauta

```bash
# Send a test message (Evolution API format)
curl -X POST "https://n8neducare.whatscall.com.br/webhook-test/titnauta" \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "mensagem": {
        "body": "Oi",
        "mediaType": "textMessage",
        "contact": {
          "name": "João Silva",
          "number": "5511988888888"
        },
        "fromMe": false
      },
      "data": {
        "key": {
          "remoteJid": "5511988888888@s.whatsapp.net",
          "id": "test-message-123"
        },
        "pushName": "João Silva",
        "message": {
          "conversation": "Oi"
        },
        "messageType": "textMessage"
      },
      "server_url": "https://evolution-api.example.com",
      "apikey": "test-api-key",
      "instance": "educare"
    }
  }'
```

### 6. Activate the Workflow

1. Click **Execute** on the canvas
2. Workflow starts running in production
3. WhatsApp messages will now trigger the bot

---

## 📊 Blueprint Architecture (Original)

The uploaded blueprint `Educare+ Ch@t` includes:

```
ORIGINAL BLUEPRINT COMPONENTS:

┌─────────────────────────────────────────────────────────────┐
│ Webhook Entry - Path: "titnauta"                            │
│ Receives Evolution API messages                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Code1: Get Current Date/Time (Spanish locale)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ If3: Filter (ignore groups, own messages)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ se_enviador_por_mim: Check if message from bot             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Tipo de mensaje? (Switch): Route by message type           │
│ - textMessage → mensagem                                   │
│ - conversation → mensagem                                  │
│ - extendedTextMessage → mensagem                           │
│ - audioMessage → audio transcription (Groq/Gemini)         │
│ - imageMessage → image analysis (Groq Vision)              │
│ - locationMessage → address resolution (Google Maps)       │
│ - documentMessage → process document                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AI Agent1: TitiNauta Persona (OpenAI)                      │
│ - Postgres Chat Memory                                     │
│ - Calculator tool                                          │
│ - Custom system prompt                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ HTTP Request6: Send WhatsApp via Evolution API             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 API Integration Flow (NEW)

Add these nodes to integrate with Educare+ External API:

```
ENHANCED FLOW WITH API INTEGRATION:

┌─────────────────────────────────────────────────────────────┐
│                  WhatsApp Message (Evolution API)           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Webhook Entry → Code1 → If3 → Dados                        │
│ (Original nodes - keep as is)                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Educare: Search User by Phone                              │
│ GET /api/external/users/search?phone={phone}               │
└────────────────────┬────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
    ✅ Found          ❌ Not Found
          │                     │
          ▼                     ▼
┌──────────────────┐   ┌────────────────────┐
│ Get Active Child │   │ Format Not Found   │
│ GET /by-phone/.../│   │ "Cadastre-se em..."│
│ active-child     │   └─────────┬──────────┘
└────────┬─────────┘             │
         │                       │
         ▼                       │
┌──────────────────┐             │
│ Get Questions    │             │
│ GET /children/   │             │
│ .../unanswered   │             │
└────────┬─────────┘             │
         │                       │
         ▼                       │
┌──────────────────┐             │
│ Parse User Answer│             │
│ (Code node)      │             │
└────────┬─────────┘             │
         │                       │
    ┌────┼────┬─────┬────┐       │
    │    │    │     │    │       │
 Answer Greet Help Prog Chat     │
    │    │    │     │    │       │
    ▼    ▼    ▼     ▼    ▼       │
┌──────┐ ┌──────┐ ┌──────┐ ┌────┐│
│ Save │ │Format│ │Format│ │ AI ││
│Answer│ │Greet │ │ Help │ │Agnt││
└──┬───┘ └──┬───┘ └──┬───┘ └─┬──┘│
   │        │        │       │   │
   ▼        │        │       │   │
┌──────┐    │        │       │   │
│ Get  │    │        │       │   │
│Progrs│    │        │       │   │
└──┬───┘    │        │       │   │
   │        │        │       │   │
   └────────┴────────┴───────┴───┤
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Format Response → Send WhatsApp (HTTP Request6)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Message Flow Examples

### Example 1: User Greeting
```
User: "Oi"
  → Webhook receives Evolution API message
  → Extract phone from remoteJid
  → Educare API: Search user by phone
  → Educare API: Get active child
  → Educare API: Get unanswered questions
  → Parse message type: greeting
  → Format greeting with next question
  → Send WhatsApp response via Evolution API
  
Response: "Olá João! 👋 Eu sou TitiNauta... 
📝 Pergunta: Seu filho dorme bem? 
1️⃣ Não/Raramente  2️⃣ Às vezes  3️⃣ Sim/Frequentemente"
```

### Example 2: User Answer
```
User: "3"
  → Parse answer: 3 = Sim/Frequentemente (value: 2)
  → Educare API: Save answer (POST /save-answer)
  → Educare API: Get progress
  → Format feedback with progress
  → Send WhatsApp response
  
Response: "✨ Que ótimo saber que seu filho dorme bem! 
📊 Progresso de Maria: 45%
📝 Perguntas restantes: 11
Envie *oi* para a próxima pergunta! 💜"
```

### Example 3: Audio Message
```
User: [voice message]
  → Download audio from Evolution API URL
  → Convert to base64
  → Transcribe with Groq Whisper
  → Parse transcription as text message
  → Continue normal flow
```

### Example 4: User Not Registered
```
User: "+5521999999999" (not in system)
  → Educare API: Search user returns empty
  → Format not found message
  
Response: "Olá! 👋 Não encontrei seu cadastro no Educare+...
🔗 Cadastre-se em: https://educareapp.com/register
Use este mesmo número de telefone! 📱"
```

---

## 📝 Evolution API Message Format

The blueprint expects messages in this format:

```json
{
  "body": {
    "mensagem": {
      "body": "Message text",
      "mediaType": "textMessage",
      "mediaUrl": "https://...", // for audio/image
      "contact": {
        "name": "User Name",
        "number": "5511988888888"
      },
      "fromMe": false,
      "participant": "",
      "dataJson": "{...}"
    },
    "data": {
      "key": {
        "remoteJid": "5511988888888@s.whatsapp.net",
        "id": "message-uuid"
      },
      "pushName": "User Name",
      "message": {
        "conversation": "Message text"
      },
      "messageType": "textMessage"
    },
    "server_url": "https://evolution-api.example.com",
    "apikey": "instance-api-key",
    "instance": "instance-name",
    "backendURL": "https://evolution-api.example.com"
  }
}
```

### Supported Message Types:
- `textMessage` - Regular text
- `extendedTextMessage` - Text with links/mentions
- `conversation` - Simple conversation
- `audioMessage` - Voice notes
- `imageMessage` - Photos
- `documentMessage` - Documents/PDFs
- `locationMessage` - Location sharing

---

## 🛠️ Troubleshooting

### Webhook not triggering
**Solution:**
1. Verify webhook URL is registered in Evolution API settings
2. Check n8n workflow is **activated** (not paused)
3. Verify Evolution API is sending to correct URL
4. Test with: `curl -X POST "https://n8neducare.whatscall.com.br/webhook-test/titnauta"`

### Educare+ API returns 401 Unauthorized
**Solution:**
1. Verify `EXTERNAL_API_KEY` environment variable is set
2. Check API key matches value in Educare+ backend
3. Ensure X-API-Key header or api_key query param is in request

### User not found but exists in database
**Solution:**
1. Check phone format matches (with/without +55)
2. Verify phone is stored correctly in Educare+ database
3. Test API directly:
```bash
curl "https://your-backend/api/external/users/search?phone=5511988888888&api_key=$API_KEY"
```

### Audio transcription failing
**Solution:**
1. Verify Groq or Gemini API key is valid
2. Check audio URL is accessible
3. Verify audio format (supports ogg, mp3, m4a)
4. Check Groq account has available credits

### AI responses incomplete
**Solution:**
1. Check OpenAI API key is valid
2. Verify Postgres Chat Memory connection
3. Review system prompt configuration
4. Check token limits in AI Agent settings

---

## 📈 Monitoring

### View Workflow Executions
1. Go to n8n Dashboard
2. Click **Executions** tab
3. Filter by date/status
4. Click any execution to see node-by-node details

### Check Error Logs
```bash
# In n8n logs (if self-hosted)
docker logs n8n-container | tail -50

# Or in n8n UI: Settings → Execution History
```

### Monitor Educare+ API Health
```bash
# Check backend health
curl -X GET "https://your-api.com/api/health"

# Check external API
curl -X GET "https://your-api.com/api/external/users/search?phone=test&api_key=$EXTERNAL_API_KEY"
```

---

## 🔐 Security Best Practices

1. **Keep API Keys Secret**
   - Never commit `EXTERNAL_API_KEY` or `OPENAI_API_KEY` to version control
   - Use n8n environment variables
   - Rotate keys periodically

2. **Use HTTPS Only**
   - All webhook URLs should be HTTPS
   - Verify SSL certificates

3. **Rate Limiting**
   - n8n workflow has built-in timeout (10s per request)
   - Educare+ API enforces rate limits

4. **Message Filtering**
   - Blueprint filters out group messages (`@g.us`)
   - Ignores messages sent by bot (`fromMe: true`)
   - Validates message structure before processing

---

## 📂 Files Reference

| File | Purpose |
|------|---------|
| `n8n-educare-chat-original.json` | Original uploaded blueprint |
| `n8n-educare-api-integration.json` | API integration nodes to add |
| `README_N8N_WORKFLOW.md` | Detailed workflow documentation |
| `WHATSAPP_INTEGRATION.md` | WhatsApp provider options |
| `ENV_CONFIG.md` | Environment variables reference |

---

## 🎯 Checklist

- [ ] Import `n8n-educare-chat-original.json` blueprint
- [ ] Configure `EDUCARE_API_URL` environment variable
- [ ] Configure `EXTERNAL_API_KEY` environment variable
- [ ] Add API integration nodes from `n8n-educare-api-integration.json`
- [ ] Connect nodes following the suggested connections
- [ ] Configure OpenAI credentials
- [ ] Configure Postgres Chat Memory
- [ ] Test webhook with sample message
- [ ] Activate workflow
- [ ] Monitor first executions

---

*Last Updated: December 1, 2025 by Educare+ Platform Team*
