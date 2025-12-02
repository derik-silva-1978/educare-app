# 🤖 N8N Blueprint Setup Guide - Educare+ TitiNauta

**Status:** ✅ Ready for Production  
**Last Updated:** December 2, 2025  
**Webhook URL:** https://n8neducare.whatscall.com.br/webhook-test/titnauta

---

## 🚀 Quick Start (5 minutos)

### Passo 1: Importar Blueprint Integrado

1. Acesse seu n8n: https://n8neducare.whatscall.com.br
2. Clique em **"New Workflow"** → **"Import from File"**
3. Selecione: **`n8n-educare-integrated.json`** ⭐
4. Clique **Import**

> 💡 Este arquivo já contém **todos os 89 nós** (77 originais + 12 de integração com API).

### Passo 2: Configurar Variáveis de Ambiente

No n8n, vá em **Settings → Variables** e adicione:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `EDUCARE_API_URL` | `https://seu-backend/api/external` | URL da API Externa |
| `EXTERNAL_API_KEY` | `sua_chave_api` | Chave de autenticação |

### Passo 3: Configurar Credenciais

Vá em **Credentials** e configure:

1. **OpenAI API**
   - Type: OpenAI
   - API Key: sua chave OpenAI

2. **Postgres (Chat Memory)**
   - Host: host-do-postgres
   - Database: n8n_chat_memory
   - User: postgres
   - Password: sua_senha

### Passo 4: Ativar e Testar

1. Clique **"Save"** para salvar o workflow
2. Clique **"Active"** (toggle no canto superior direito)
3. Envie uma mensagem de teste no WhatsApp: **"Oi"**

---

## 📂 Arquivos Disponíveis

| Arquivo | Descrição | Usar Para |
|---------|-----------|-----------|
| **`n8n-educare-integrated.json`** ⭐ | Blueprint completo e pronto | Importação direta |
| `n8n-educare-chat-original.json` | Blueprint original (backup) | Referência |

---

## 📊 Arquitetura do Blueprint

### Total: 89 Nós

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
│  Filtros & Validação                    │
│  - Ignora grupos                        │
│  - Ignora mensagens próprias            │
│  - Classifica tipo de mídia             │
└───────────────────┬─────────────────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
     Texto       Áudio      Imagem
         │          │          │
         ▼          ▼          ▼
       Dados    Transcrição  Análise
         │      (Groq/Gemini) (Groq)
         │          │          │
         └──────────┼──────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  INTEGRAÇÃO EDUCARE+ (NOVOS NÓS)        │
├─────────────────────────────────────────┤
│  1. Buscar Usuário por Telefone         │
│  2. Verificar se Encontrou              │
│  3. Obter Criança Ativa                 │
│  4. Buscar Perguntas Pendentes          │
│  5. Analisar Mensagem                   │
│  6. Rotear por Tipo                     │
│  7. Salvar Resposta (se for quiz)       │
│  8. Obter Progresso                     │
│  9. Formatar Resposta                   │
└───────────────────┬─────────────────────┘
                    │
         ┌──────────┼──────────┬──────────┐
         │          │          │          │
     Resposta   Saudação    Ajuda     Chat IA
         │          │          │          │
         └──────────┼──────────┴──────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  AI Agent: TitiNauta                    │
│  - Personalidade amigável               │
│  - Memória de conversa (Postgres)       │
│  - Ferramentas: calculadora             │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Enviar WhatsApp (Evolution API)        │
│  POST /api/messages/sendTextPRO         │
└─────────────────────────────────────────┘
```

---

## 🔄 Fluxos de Conversação

### Fluxo 1: Saudação
```
👤 Usuário: "Oi"

🤖 TitiNauta: "Olá! 👋 Eu sou a TitiNauta, sua assistente 
para acompanhar o desenvolvimento de Maria!

📝 *Pergunta:*
Seu filho faz contato visual quando você fala com ele?

1️⃣ - Não/Raramente
2️⃣ - Às vezes
3️⃣ - Sim/Frequentemente"
```

### Fluxo 2: Resposta ao Quiz
```
👤 Usuário: "3"

🤖 TitiNauta: "✨ Que ótimo! Obrigada pela sua resposta.

📊 Progresso de Maria: 45%
📝 Perguntas restantes: 11

Envie *oi* para a próxima pergunta! 💜"
```

### Fluxo 3: Ver Progresso
```
👤 Usuário: "progresso"

🤖 TitiNauta: "📊 Progresso de Maria:

✅ Respondidas: 9 de 20
📈 Progresso: 45%
🎯 Meta semanal: 5 perguntas

Continue assim! 💜"
```

### Fluxo 4: Usuário Não Cadastrado
```
👤 Usuário: "Oi" (telefone não cadastrado)

🤖 TitiNauta: "Olá! 👋

Não encontrei seu cadastro no Educare+.

Para começar sua jornada:
🔗 https://educareapp.com/register

Use este mesmo número de telefone para se cadastrar! 📱"
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

### Tipos de Mensagem Suportados:
| Tipo | Descrição | Processamento |
|------|-----------|---------------|
| `textMessage` | Texto simples | Direto para análise |
| `audioMessage` | Áudio/voz | Transcrição Groq/Gemini |
| `imageMessage` | Imagem | Análise Groq Vision |
| `locationMessage` | Localização | Resolução Google Maps |
| `documentMessage` | Documento | Extração de texto |

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
1. Verifique Groq API Key
2. Confirme URL do áudio acessível
3. Formatos: ogg, mp3, m4a

### ❌ AI Agent não responde
1. Verifique OpenAI API Key
2. Teste conexão Postgres (Chat Memory)
3. Verifique limite de tokens

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

- [ ] Importar `n8n-educare-integrated.json`
- [ ] Configurar `EDUCARE_API_URL` 
- [ ] Configurar `EXTERNAL_API_KEY`
- [ ] Adicionar credencial OpenAI
- [ ] Configurar Postgres Chat Memory
- [ ] Salvar workflow
- [ ] Ativar workflow (toggle)
- [ ] Enviar "Oi" no WhatsApp para testar
- [ ] Verificar resposta da TitiNauta

---

*Atualizado em: 2 de Dezembro de 2025*
