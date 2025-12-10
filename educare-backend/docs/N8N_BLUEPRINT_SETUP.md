# 🤖 N8N Blueprint Setup Guide - Educare+ TitiNauta v2.0

**Status:** ✅ Ready for Production  
**Last Updated:** December 10, 2025  
**n8n Server:** https://n8n.educareapp.com.br
**Webhook URL:** https://webhook.educareapp.com.br/whatsapp-educare
**Evolution API:** https://api.educareapp.com.br

---

## 🚀 Quick Start (5 minutos)

### Passo 1: Importar Blueprint Atualizado

1. Acesse seu n8n: https://n8n.educareapp.com.br
2. Clique em **"Workflows"** → **"Import"** ou **"New"**
3. Escolha: **"Import from JSON"**
4. Cole o conteúdo de: **`n8n-workflow-template.json`** ⭐ (versão 2025)
5. Clique **Import**

> 💡 O arquivo v2 é uma versão **otimizada e limpa** com apenas os nós necessários para o Educare+.

### Passo 2: Configurar Variáveis de Ambiente

No n8n, vá em **Settings → Variables** e adicione:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `EDUCARE_API_URL` | `https://[SEU-REPLIT].replit.dev:3001` | URL Backend Replit (preencher com seu Replit) |
| `EDUCARE_API_KEY` | `educare_external_api_key_2025` | Chave de autenticação da API Externa |
| `EVOLUTION_API_URL` | `https://api.educareapp.com.br` | URL da Evolution API (WhatsApp) |
| `EVOLUTION_API_KEY` | `eff3ea025256694c10422fd0fc5ff169` | Chave da Evolution API |
| `EVOLUTION_INSTANCE_NAME` | `evolution` | Nome da instância WhatsApp |

### Passo 3: Webhook Configurado

✅ Webhook já está pré-configurado:
- **Path:** `whatsapp-educare`
- **Method:** POST
- **Full URL:** `https://webhook.educareapp.com.br/whatsapp-educare`
- **Response:** onReceived

Nenhuma configuração adicional de webhook é necessária - o template já inclui isso.

### Passo 4: Ativar e Testar

1. Clique **"Save"** para salvar o workflow
2. Clique **"Active"** (toggle no canto superior direito)
3. Envie uma mensagem de teste no WhatsApp: **"Oi"**

---

## 📂 Arquivos Disponíveis

| Arquivo | Descrição | Usar Para |
|---------|-----------|-----------|
| **`n8n-educare-v2.json`** ⭐ | Blueprint otimizado e limpo | **Produção** |
| `n8n-educare-integrated.json` | Blueprint original com nós extras | Referência |

### Diferenças entre v1 e v2

| Aspecto | v1 (Integrated) | v2 (Novo) |
|---------|-----------------|-----------|
| Total de nós | 89 | 28 |
| APIs Keys | Hardcoded | Variáveis de ambiente |
| Nós irrelevantes | Sim (taxi, etc) | Removidos |
| Conexões WhatsApp | Parciais | Todas conectadas |
| Documentação inline | Mínima | Completa |

---

## 📊 Arquitetura do Blueprint v2

### Total: 28 Nós

```
FLUXO PRINCIPAL:

WhatsApp (Evolution API)
         │
         ▼
┌─────────────────────────────────────────┐
│  Webhook: "titnauta"                    │
│  Recebe mensagens do WhatsApp           │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Filter: Valid Messages                 │
│  - Ignora grupos (@g.us)                │
│  - Ignora mensagens próprias (fromMe)   │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Extract Data                           │
│  - userPhone, userName                  │
│  - messageBody, messageType             │
│  - backendURL, instanceApiKey           │
└───────────────────┬─────────────────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
       Audio     Imagem      Texto
         │          │          │
         ▼          ▼          │
     OpenAI      OpenAI       │
     Whisper   GPT-4 Vision   │
         │          │          │
         └──────────┼──────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  INTEGRAÇÃO EDUCARE+                    │
├─────────────────────────────────────────┤
│  1. Buscar Usuário por Telefone         │
│  2. Verificar se Encontrou              │
│  3. Obter Criança Ativa                 │
│  4. Buscar Perguntas Pendentes          │
│  5. Analisar e Classificar Mensagem     │
│  6. Rotear por Tipo                     │
└───────────────────┬─────────────────────┘
                    │
    ┌───────────────┼───────────────┬───────────────┐
    │               │               │               │
 Answer         Greeting       Progress/Help     Chat IA
    │               │               │               │
    ▼               ▼               ▼               ▼
 Save Answer    Format MSG     Format MSG     AI Agent
    │               │               │               │
    ▼               │               │               ▼
 Get Progress       │               │         Format Response
    │               │               │               │
    ▼               │               │               │
 Format Answer      │               │               │
    │               │               │               │
    └───────────────┴───────────────┴───────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  WhatsApp: Send Message                 │
│  POST /api/messages/whatsmeow/sendTextPRO│
│  Todas as branches convergem aqui       │
└─────────────────────────────────────────┘
```

---

## 🔄 Fluxos de Conversação

### Fluxo 1: Saudação (greeting)
```
👤 Usuário: "Oi"

🤖 TitiNauta: "Olá, Maria! 👋

Eu sou a *TitiNauta*, sua assistente para acompanhar 
o desenvolvimento de João! 🚀

Vamos continuar nossa jornada?

📝 *Pergunta:*
Seu filho faz contato visual quando você fala com ele?

1️⃣ - Não/Raramente
2️⃣ - Às vezes
3️⃣ - Sim/Frequentemente"
```

### Fluxo 2: Resposta ao Quiz (answer)
```
👤 Usuário: "3"

🤖 TitiNauta: "✨ Que ótimo! Este é um sinal muito 
positivo do desenvolvimento!

📊 *Progresso de João:* 45%
📝 Perguntas restantes: 11

Envie *oi* para a próxima pergunta! 💜"
```

### Fluxo 3: Ver Progresso (progress)
```
👤 Usuário: "progresso"

🤖 TitiNauta: "📊 *Progresso de João*

✅ Perguntas respondidas: 9
📝 Perguntas restantes: 11
📈 Progresso: 45%

Envie *oi* para responder a próxima pergunta! 💜"
```

### Fluxo 4: Ajuda (help)
```
👤 Usuário: "ajuda"

🤖 TitiNauta: "👋 *Precisa de ajuda?*

Aqui estão suas opções:

📝 *Responder perguntas:*
  • Envie *1* = Não/Raramente
  • Envie *2* = Às vezes
  • Envie *3* = Sim/Frequentemente

🏠 *Ver próxima pergunta:* Envie "oi"
📊 *Ver progresso:* Envie "progresso"

Estou aqui para ajudar você! 💜"
```

### Fluxo 5: Usuário Não Cadastrado
```
👤 Usuário: "Oi" (telefone não cadastrado)

🤖 TitiNauta: "Olá! 👋

Não encontrei seu cadastro no Educare+.

Para começar sua jornada de acompanhamento 
do desenvolvimento infantil, acesse:
🔗 https://educareapp.com/register

Use este mesmo número de telefone para 
se cadastrar! 📱

Após o cadastro, envie "oi" para começarmos! 💜"
```

### Fluxo 6: Chat Livre (AI Agent)
```
👤 Usuário: "Como estimular a fala do meu bebê?"

🤖 TitiNauta: "Ótima pergunta! 💬

Aqui vão algumas dicas para estimular a fala:

• Converse sempre com seu bebê, mesmo que 
  ele ainda não responda
• Narre suas atividades do dia a dia
• Leia livrinhos ilustrados em voz alta
• Cante músicas infantis
• Repita os sons que ele faz

Continue acompanhando o desenvolvimento 
do seu bebê no app Educare+! 💜"
```

---

## 🧪 Testar o Webhook

```bash
# Teste básico - simular mensagem "Oi"
curl -X POST "https://n8neducare.whatscall.com.br/webhook-test/titnauta" \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "mensagem": {
        "body": "Oi",
        "mediaType": "textMessage",
        "contact": {
          "name": "Teste User",
          "number": "5511988888888"
        },
        "fromMe": false
      },
      "data": {
        "key": {
          "remoteJid": "5511988888888@s.whatsapp.net",
          "id": "test-123"
        },
        "pushName": "Teste User",
        "message": { "conversation": "Oi" },
        "messageType": "textMessage"
      },
      "server_url": "https://evolution-api.com",
      "apikey": "test-key",
      "instance": "educare",
      "backendURL": "https://evolution-api.com"
    }
  }'
```

---

## 📝 Formato de Mensagem Evolution API

```json
{
  "body": {
    "mensagem": {
      "body": "Texto da mensagem",
      "mediaType": "textMessage",
      "contact": {
        "name": "Nome do Usuário",
        "number": "5511988888888"
      },
      "fromMe": false
    },
    "data": {
      "key": {
        "remoteJid": "5511988888888@s.whatsapp.net",
        "id": "message-uuid"
      },
      "pushName": "Nome do Usuário",
      "messageType": "textMessage"
    },
    "server_url": "https://evolution-api.example.com",
    "apikey": "instance-api-key",
    "instance": "instance-name",
    "backendURL": "https://evolution-api.example.com"
  }
}
```

### Tipos de Mensagem Suportados

| Tipo | Descrição | Processamento |
|------|-----------|---------------|
| `textMessage` | Texto simples | Direto para análise |
| `audioMessage` | Áudio/voz | Transcrição OpenAI Whisper |
| `imageMessage` | Imagem | Análise GPT-4 Vision |

---

## 🛠️ Troubleshooting

### ❌ Webhook não dispara
1. Verifique se workflow está **Ativo** (toggle verde)
2. Confirme URL no Evolution API: `https://n8neducare.whatscall.com.br/webhook-test/titnauta`
3. Teste com curl (acima)

### ❌ API retorna 401 Unauthorized
1. Verifique `EXTERNAL_API_KEY` nas variáveis
2. Confirme que a chave está correta no backend Educare+

### ❌ Usuário não encontrado (mas existe)
1. Formato do telefone (com/sem +55)
2. Teste direto: `GET /api/external/users/search?phone=5511988888888&api_key=CHAVE`

### ❌ Áudio não transcreve
1. Verifique credencial OpenAI
2. Confirme URL do áudio acessível
3. Formatos: ogg, mp3, m4a

### ❌ AI Agent não responde
1. Verifique OpenAI API Key
2. Teste conexão Postgres (Chat Memory)
3. Verifique limite de tokens

### ❌ Mensagem não enviada ao WhatsApp
1. Verifique `backendURL` e `instanceApiKey` no payload
2. Confirme Evolution API funcionando
3. Teste endpoint manualmente:
```bash
curl -X POST "https://evolution-api/api/messages/whatsmeow/sendTextPRO" \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"number": "5511988888888", "body": "Teste", "openTicket": 0}'
```

---

## 📈 Monitoramento

### Ver Execuções
1. n8n Dashboard → **Executions**
2. Filtrar por data/status
3. Clique em qualquer execução para detalhes

### Logs de Erro
- n8n UI: **Settings → Execution History**
- Filtrar por status "Error"

### Health Check API
```bash
# Backend Educare+
curl https://seu-backend/api/health

# API Externa
curl "https://seu-backend/api/external/users/search?phone=test&api_key=SUA_CHAVE"
```

---

## ✅ Checklist de Ativação

- [ ] Importar `n8n-educare-v2.json`
- [ ] Configurar `EDUCARE_API_URL` 
- [ ] Configurar `EXTERNAL_API_KEY`
- [ ] Adicionar credencial OpenAI
- [ ] (Opcional) Configurar Postgres Chat Memory
- [ ] Salvar workflow
- [ ] Ativar workflow (toggle)
- [ ] Enviar "Oi" no WhatsApp para testar
- [ ] Verificar resposta da TitiNauta

---

## 🧠 RAG Integration (Fase 5)

O workflow pode agora usar o RAG (Retrieval-Augmented Generation) para respostas personalizadas baseadas na base de conhecimento.

### Endpoint RAG
```
POST /api/rag/external/ask
Header: X-API-Key: {EXTERNAL_API_KEY}
Body: { question, baby_id, use_file_search: true }
```

### Node de Integração no N8N

Após buscar o `active-child`, adicione um HTTP Request Node:

```json
{
  "name": "Call RAG Endpoint",
  "url": "{{ $env.EDUCARE_API_URL }}/rag/external/ask",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "X-API-Key": "{{ $env.EXTERNAL_API_KEY }}"
  },
  "body": {
    "question": "{{ $node['Extract Message'].json.messageBody }}",
    "baby_id": "{{ $node['Get Active Child'].json.id }}",
    "use_file_search": true
  }
}
```

A resposta será a propriedade `answer` do JSON retornado.

📖 **Documentação Completa:** `N8N_RAG_INTEGRATION.md`

---

## 🔐 Segurança

O workflow v2 segue as melhores práticas de segurança:

1. **Sem API Keys hardcoded** - Todas usam variáveis de ambiente
2. **Timeout configurado** - 15s para evitar execuções travadas
3. **NeverError** - Falhas de API não quebram o fluxo
4. **Filtragem** - Ignora grupos e mensagens próprias
5. **RAG seguro** - API Key validada em cada request

---

*Atualizado em: 9 de Dezembro de 2025 (Fase 5 - RAG Integration)*
