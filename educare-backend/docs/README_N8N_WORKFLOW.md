# Workflow n8n - Integração WhatsApp + Educare+

Este documento descreve a arquitetura e configuração do workflow n8n para integrar o WhatsApp com a API Externa do Educare+.

---

## Visão Geral

O workflow n8n atua como camada de orquestração entre o WhatsApp e o sistema Educare+, processando mensagens recebidas, consultando a API Externa, utilizando OpenAI para processamento de linguagem natural, e enviando respostas personalizadas.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   WhatsApp   │────▶│     n8n      │────▶│  API Externa │
│  (Webhook)   │◀────│  (Workflow)  │◀────│   Educare+   │
└──────────────┘     └──────┬───────┘     └──────────────┘
                           │
                   ┌───────▼───────┐
                   │    OpenAI     │
                   │ (Formatação)  │
                   └───────────────┘
```

---

## Pré-requisitos

### 1. Instância n8n

**Opções de Hospedagem:**

| Opção | Descrição | Custo |
|-------|-----------|-------|
| n8n.cloud | Gerenciado, fácil setup | $20-50/mês |
| Self-hosted VPS | Controle total | $5-20/mês + setup |
| Docker local | Desenvolvimento | Gratuito |

### 2. Credenciais Necessárias

```env
# API Externa Educare+ (Replit)
EDUCARE_API_URL=https://[SEU-REPLIT].replit.dev:3001
EDUCARE_API_KEY=educare_external_api_key_2025

# Evolution API (Servidor WhatsApp)
EVOLUTION_API_URL=https://api.educareapp.com.br
EVOLUTION_API_KEY=eff3ea025256694c10422fd0fc5ff169
EVOLUTION_INSTANCE_NAME=evolution

# n8n Webhook
N8N_WEBHOOK_URL=https://webhook.educareapp.com.br/whatsapp-educare

# OpenAI (Integrado no Backend)
OPENAI_API_KEY=sk-... (gerenciado pelo backend)
```

---

## Endpoints da API Externa

### Base URL
```
https://your-api-url.com/api/external
```

### Autenticação
Todas as requisições requerem API Key via:
- Query param: `?api_key=YOUR_KEY`
- Header: `X-API-Key: YOUR_KEY`

### Endpoints Utilizados no Workflow

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/users/search?phone={phone}` | GET | Identificar usuário por telefone |
| `/users/by-phone/{phone}/active-child` | GET | Obter criança ativa |
| `/children/{childId}/unanswered-questions` | GET | Próxima pergunta |
| `/children/{childId}/save-answer` | POST | Salvar resposta |
| `/children/{childId}/progress` | GET | Progresso atual |
| `/children/{childId}/quiz-responses` | GET | Histórico de respostas |

---

## Estrutura do Workflow

### Nó 1: Webhook (Trigger)

**Configuração:**
```json
{
  "httpMethod": "POST",
  "path": "whatsapp-webhook",
  "responseMode": "responseNode"
}
```

**Dados Recebidos (Twilio):**
```json
{
  "From": "whatsapp:+5511999999999",
  "Body": "Sim",
  "ProfileName": "João Silva"
}
```

### Nó 2: Extrair Telefone

**Função JavaScript:**
```javascript
const from = $input.item.json.From;
const phone = from.replace('whatsapp:', '').replace(/\D/g, '');
const phoneFormatted = phone.startsWith('55') ? `+${phone}` : `+55${phone}`;
return {
  phone: phoneFormatted,
  message: $input.item.json.Body,
  userName: $input.item.json.ProfileName
};
```

### Nó 3: Buscar Usuário (HTTP Request)

**Configuração:**
```json
{
  "method": "GET",
  "url": "={{$env.EDUCARE_API_URL}}/users/search",
  "qs": {
    "phone": "={{$node.ExtractPhone.json.phone}}",
    "api_key": "={{$env.EXTERNAL_API_KEY}}"
  }
}
```

### Nó 4: Verificar Usuário (Switch)

**Condições:**
- Se `success === true` e `data.user` existe → Continuar
- Senão → Enviar mensagem de cadastro

### Nó 5: Buscar Criança Ativa (HTTP Request)

**Configuração:**
```json
{
  "method": "GET",
  "url": "={{$env.EDUCARE_API_URL}}/users/by-phone/{{$node.ExtractPhone.json.phone}}/active-child",
  "headers": {
    "X-API-Key": "={{$env.EXTERNAL_API_KEY}}"
  }
}
```

### Nó 6: Buscar Perguntas (HTTP Request)

**Configuração:**
```json
{
  "method": "GET",
  "url": "={{$env.EDUCARE_API_URL}}/children/{{$node.GetActiveChild.json.data.active_child.id}}/unanswered-questions",
  "qs": {
    "api_key": "={{$env.EXTERNAL_API_KEY}}"
  }
}
```

### Nó 7: Verificar Resposta do Usuário (Switch)

**Condições:**
- Se mensagem é "1", "2", "3" ou variantes → Processar resposta
- Se mensagem é "oi", "olá", "começar" → Iniciar jornada
- Senão → Enviar ajuda

### Nó 8: Salvar Resposta (HTTP Request)

**Configuração:**
```json
{
  "method": "POST",
  "url": "={{$env.EDUCARE_API_URL}}/children/{{$node.GetActiveChild.json.data.active_child.id}}/save-answer",
  "headers": {
    "Content-Type": "application/json",
    "X-API-Key": "={{$env.EXTERNAL_API_KEY}}"
  },
  "body": {
    "question_id": "={{$node.GetQuestions.json.data.questions[0].id}}",
    "answer": "={{$node.ParseAnswer.json.answerValue}}",
    "answer_text": "={{$node.ExtractPhone.json.message}}",
    "metadata": {
      "source": "whatsapp",
      "timestamp": "={{$now.toISO()}}"
    }
  }
}
```

### Nó 9: Formatar com OpenAI

**Prompt do Sistema:**
```
Você é a TitiNauta, assistente virtual amigável do Educare+.
Seu papel é ajudar pais a acompanhar o desenvolvimento de seus filhos.
Seja acolhedora, use emojis moderadamente e linguagem simples.
Responda sempre em português brasileiro.
```

**Prompt do Usuário:**
```
Contexto:
- Nome da criança: {{childName}}
- Idade: {{ageMonths}} meses
- Pergunta atual: {{currentQuestion}}
- Resposta do usuário: {{userAnswer}}
- Feedback da resposta: {{feedback}}

Gere uma mensagem de WhatsApp:
1. Agradeça a resposta
2. Forneça o feedback apropriado
3. Se houver próxima pergunta, apresente-a
4. Se não houver, parabenize pela conclusão
5. Mantenha tom amigável e acolhedor
```

### Nó 10: Enviar WhatsApp (Twilio)

**Configuração:**
```json
{
  "to": "={{$node.ExtractPhone.json.phone}}",
  "from": "={{$env.TWILIO_WHATSAPP_NUMBER}}",
  "body": "={{$node.FormatWithOpenAI.json.text}}"
}
```

---

## Fluxo de Decisões

```
                    ┌─────────────────┐
                    │  Webhook Entry  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Extrair Telefone│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Buscar Usuário  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       Não encontrado   Encontrado    Encontrado
       (Novo usuário)   (Sem filho)   (Com filho)
              │              │              │
              ▼              ▼              ▼
       Msg Cadastro    Msg Cadastrar   Processar
                       Filho          Mensagem
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                     Saudação         Resposta        Ajuda
                     "oi/olá"         "1/2/3"        Outros
                          │               │               │
                          ▼               ▼               ▼
                    Iniciar          Salvar           Enviar
                    Jornada          Resposta         Instruções
                          │               │               │
                          └───────────────┼───────────────┘
                                          │
                                  ┌───────▼───────┐
                                  │ Buscar Próxima│
                                  │   Pergunta    │
                                  └───────┬───────┘
                                          │
                              ┌───────────┼───────────┐
                              │                       │
                        Tem pergunta            Sem perguntas
                              │                       │
                              ▼                       ▼
                        OpenAI Format           Parabenizar
                              │                       │
                              └───────────┬───────────┘
                                          │
                                  ┌───────▼───────┐
                                  │    Enviar     │
                                  │   WhatsApp    │
                                  └───────────────┘
```

---

## Mensagens Padrão

### Mensagem de Boas-vindas
```
Olá, {{userName}}! 👋

Eu sou a TitiNauta, sua assistente para acompanhar o desenvolvimento de {{childName}}!

Vamos começar? Responda com:
1️⃣ - Não/Raramente
2️⃣ - Às vezes
3️⃣ - Sim/Frequentemente

Primeira pergunta:
{{questionText}}
```

### Mensagem de Feedback
```
Obrigada pela sua resposta! 💜

{{feedbackText}}

Próxima pergunta:
{{nextQuestionText}}
```

### Mensagem de Conclusão
```
🎉 Parabéns, {{userName}}!

Você completou todas as perguntas desta semana para {{childName}}!

📊 Progresso: {{progressPercentage}}%

Continue acompanhando o desenvolvimento através do nosso app ou WhatsApp!
```

### Mensagem de Usuário Não Encontrado
```
Olá! 👋

Não encontrei seu cadastro no Educare+.

Para começar sua jornada de acompanhamento do desenvolvimento infantil, acesse:
https://educareapp.com/register

Use este mesmo número de telefone!
```

---

## Tratamento de Erros

### Erros de API
```javascript
// Nó de tratamento de erros
if ($input.item.json.success === false) {
  return {
    message: "Desculpe, tive um probleminha técnico. 🔧 Tente novamente em alguns minutos!",
    error: $input.item.json.error
  };
}
```

### Timeout
- Configurar retry automático (max 3 tentativas)
- Intervalo de 5 segundos entre tentativas
- Notificar usuário após falha definitiva

---

## Variáveis de Ambiente

```env
# Obrigatórias
EDUCARE_API_URL=https://your-api-url.com/api/external
EXTERNAL_API_KEY=educare_external_api_key_2025
OPENAI_API_KEY=sk-...

# WhatsApp - Escolher UMA opção

# Opção 1: Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Opção 2: Meta Cloud API
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_BUSINESS_ACCOUNT_ID=...
```

---

## Testes

### 1. Testar Webhook
```bash
curl -X POST https://your-n8n-url.com/webhook/whatsapp-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "From": "whatsapp:+5511999999999",
    "Body": "oi",
    "ProfileName": "Teste"
  }'
```

### 2. Testar Fluxo Completo
1. Enviar "oi" → Deve receber primeira pergunta
2. Responder "3" → Deve salvar e receber próxima pergunta
3. Continuar até finalizar → Deve receber mensagem de conclusão

---

## Monitoramento

### Métricas Importantes
- Tempo de resposta médio
- Taxa de sucesso/erro
- Quantidade de mensagens processadas
- Usuários ativos por dia

### Logs
- Habilitar logs detalhados em produção
- Configurar alertas para erros críticos
- Monitorar uso de créditos OpenAI

---

## Segurança

### Boas Práticas
1. Usar HTTPS em todos os endpoints
2. Validar origem das requisições
3. Implementar rate limiting
4. Armazenar credenciais em variáveis de ambiente
5. Rotacionar API Keys periodicamente

### Validação de Webhook
```javascript
// Verificar assinatura Twilio (exemplo)
const crypto = require('crypto');
const signature = req.headers['x-twilio-signature'];
const url = 'https://your-n8n-url.com/webhook/whatsapp-webhook';
const params = req.body;

const expectedSignature = crypto
  .createHmac('sha1', TWILIO_AUTH_TOKEN)
  .update(Buffer.from(url + Object.keys(params).sort().map(k => k + params[k]).join('')))
  .digest('base64');

if (signature !== expectedSignature) {
  return { error: 'Invalid signature' };
}
```

---

## Próximos Passos

1. **Configurar n8n** - Escolher hosting e criar instância
2. **Importar workflow** - Usar template JSON fornecido
3. **Configurar credenciais** - API keys e webhooks
4. **Configurar WhatsApp** - Twilio ou Meta Cloud API
5. **Testar fluxo** - Validar todos os cenários
6. **Monitorar** - Configurar alertas e logs

---

*Documentação Educare+ - Dezembro 2025*
