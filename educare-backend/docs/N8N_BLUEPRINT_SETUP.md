# 🤖 N8N Blueprint Setup Guide - Educare+ TitiNauta

**Status:** ✅ Ready for Production  
**Last Updated:** December 1, 2025  
**Webhook Test URL:** https://n8neducare.whatscall.com.br/webhook-test/titnauta

---

## 🚀 Quick Start

### 1. Import the Blueprint

1. Go to your n8n instance (https://n8neducare.whatscall.com.br)
2. Click **"New Workflow"** → **"Import"**
3. Select the file: `n8n-workflow-template.json` (from this folder)
4. Click **Import**

### 2. Configure Environment Variables

Before activating the workflow, set these credentials:

#### Required - Educare+ API
```
EDUCARE_API_URL=https://your-educare-backend-domain.com
EXTERNAL_API_KEY=educare_external_api_key_2025
```

#### Required - Twilio WhatsApp (choose ONE provider)
**Option A: Twilio (Recommended)**
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Option B: Meta Cloud API**
```
WHATSAPP_PHONE_NUMBER_ID=102xxx...
WHATSAPP_ACCESS_TOKEN=EAAxxx...
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

#### Optional - AI Enhancement
```
OPENAI_API_KEY=sk-xxx...  (already configured in Educare+)
```

### 3. Set Credentials in n8n

In n8n UI, go to **Credentials** and add:

1. **Twilio API** (or Meta Webhooks)
   - Name: `Twilio API` (or `Meta Cloud API`)
   - Account SID: `${TWILIO_ACCOUNT_SID}`
   - Auth Token: `${TWILIO_AUTH_TOKEN}`

2. **OpenAI API** (if using AI formatting)
   - API Key: `${OPENAI_API_KEY}`

### 4. Test the Webhook

**Test URL:** https://n8neducare.whatscall.com.br/webhook-test/titnauta

```bash
# Send a test message
curl -X POST "https://n8neducare.whatscall.com.br/webhook-test/titnauta" \
  -H "Content-Type: application/json" \
  -d '{
    "From": "whatsapp:+5511988888888",
    "Body": "Oi",
    "ProfileName": "João Silva"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Webhook received"
}
```

### 5. Activate the Workflow

1. Click **Execute** on the canvas
2. Workflow starts running in production
3. WhatsApp messages will now trigger the bot

---

## 📊 Workflow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WhatsApp Message                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Webhook Entry (Listen for WhatsApp messages)               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Extract Phone (Parse phone number from WhatsApp)           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Search User (Query: GET /api/external/users/search)        │
└────────────────────┬────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
    ✅ Found          ❌ Not Found
          │                     │
          ▼                     ▼
    Get Active Child    Format Not Found
          │                     │
          ▼                     └──────────┐
    Get Unanswered Questions              │
          │                               │
          ▼                               │
    Parse Message                         │
          │                               │
    ┌─────┼─────┐                         │
    │     │     │                         │
Answer  Greeting Help                     │
    │     │     │                         │
    ▼     ▼     ▼                         │
  Save  Format Format                     │
Answer Greeting Help                      │
    │     │     │                         │
    ▼     ▼     ▼                         │
Get Progress                              │
    │                                     │
    ▼                                     │
Format with OpenAI                        │
    │                                     │
    └─────────────┬───────────────────────┘
                  │
                  ▼
        Merge Response
                  │
                  ▼
        Send WhatsApp
                  │
                  ▼
        Respond Webhook
```

---

## 🔄 Message Flow Examples

### Example 1: User Greeting
```
User: "Oi"
  → Search user by phone
  → Get active child
  → Fetch first unanswered question
  → Format greeting with question
  → Send WhatsApp response
  
Response: "Olá João! Eu sou TitiNauta... 
Pergunta: Seu filho dorme bem? 
Responda: 1=Não, 2=Às vezes, 3=Sim"
```

### Example 2: User Answer
```
User: "3"
  → Search user by phone
  → Get active child
  → Parse answer (3 = Sim/Sempre)
  → Save answer to database
  → Get child progress
  → Format feedback with OpenAI
  → Send WhatsApp response
  
Response: "Ótimo! Que bom que seu filho dorme bem! 
Isso contribui muito para seu desenvolvimento. 
Progresso: 45% - Perguntas restantes: 11"
```

### Example 3: User Not Registered
```
User: "+5521999999999" (not in system)
  → Search user returns empty
  → Format not found message
  → Send WhatsApp response
  
Response: "Olá! Não encontrei seu cadastro no Educare+...
Acesse: https://educareapp.com/register"
```

---

## 🛠️ Troubleshooting

### Webhook not triggering
**Solution:**
1. Verify webhook URL is correct in WhatsApp provider settings
2. Check n8n workflow is **activated** (not paused)
3. Test with: `curl -X POST "https://your-n8n-url/webhook-test/titnauta"`

### API returns 401 Unauthorized
**Solution:**
1. Verify `EXTERNAL_API_KEY` environment variable is set
2. Check API key matches value in Educare+ backend
3. Ensure X-API-Key header is in request

### WhatsApp messages not sending
**Solution:**
1. Verify Twilio/Meta credentials are correct
2. Check phone number format (must include country code: +55...)
3. Verify Twilio/Meta account has active WhatsApp integration

### AI formatting not working
**Solution:**
1. Check OpenAI API key is valid
2. Verify account has available credits
3. Check model name is correct: `gpt-4o-mini`

---

## 📈 Monitoring

### View Workflow Executions
1. Go to n8n Dashboard
2. Click **Executions** tab
3. Filter by date/status
4. Click any execution to see details

### Check Error Logs
```bash
# In n8n logs
docker logs n8n-container | tail -50
```

### Monitor Educare+ API
```bash
# Check external API logs
curl -X GET "https://your-api.com/api/external/logs" \
  -H "X-API-Key: $EXTERNAL_API_KEY"
```

---

## 🔐 Security Best Practices

1. **Keep API Key Secret**
   - Never commit `EXTERNAL_API_KEY` to version control
   - Use n8n environment variables

2. **Use HTTPS Only**
   - All webhook URLs should be HTTPS
   - Verify SSL certificates

3. **Rate Limiting**
   - n8n workflow has built-in timeout (10s per request)
   - Educare+ API enforces rate limits

4. **Audit Trail**
   - All executions logged in n8n
   - All API calls logged in Educare+ backend

---

## 📞 Support

**Questions about the workflow?**
- Check logs: n8n Executions tab
- Test API directly: Use Postman collection in `/docs/POSTMAN_COLLECTION.json`
- Review API docs: `/api-docs` endpoint

**Setup Issues?**
- Webhook not registered: Click "Execute" button on canvas
- API credentials wrong: Verify in n8n Credentials tab
- WhatsApp not sending: Check Twilio/Meta account status

---

## 🎯 Next Steps

1. ✅ Import blueprint
2. ✅ Configure environment variables
3. ✅ Test webhook
4. ✅ Activate workflow
5. ✅ Monitor first executions
6. 📈 Optimize based on real-world usage

---

*Last Updated: December 1, 2025 by Educare+ Platform Team*
