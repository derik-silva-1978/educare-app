# Educare+ n8n Integration - Guia de Deploy

**Status:** PRONTO PARA PRODUÇÃO
**Última Atualização:** 10 de Dezembro de 2025

---

## Dados de Produção Confirmados

### Educare Backend (Replit)
| Campo | Valor |
|-------|-------|
| URL | `https://[SEU-REPLIT].replit.dev:3001` |
| API Key | `educare_external_api_key_2025` |

### n8n
| Campo | Valor |
|-------|-------|
| URL | `https://n8n.educareapp.com.br/` |
| Webhook Path | `/whatsapp-educare` |

### Evolution API
| Campo | Valor |
|-------|-------|
| URL | `https://api.educareapp.com.br` |
| API Key | `eff3ea025256694c10422fd0fc5ff169` |
| Instance Name | `evolution` |

---

## Passo 1: Importe o Workflow no n8n

1. Acesse: `https://n8n.educareapp.com.br/`
2. Faça login
3. Clique em **Workflows** no menu lateral
4. Clique no botão **+** ou **Import**
5. Escolha **Import from File** ou **Import from JSON**
6. Cole o conteúdo do arquivo:
   ```
   educare-backend/docs/n8n-workflow-template.json
   ```
7. Clique em **Import**

---

## Passo 2: Configure as Variáveis

O n8n moderno usa variáveis globais. Você precisa criar 5 variáveis:

### 2.1 Acesse Configurações
1. Clique no ícone de **Engrenagem** (Settings) no menu lateral esquerdo
2. Clique em **Variables**

### 2.2 Crie Cada Variável
Clique em **+ Add Variable** para cada uma:

| Key | Value |
|-----|-------|
| `EDUCARE_API_URL` | `https://[SEU-REPLIT].replit.dev:3001` |
| `EDUCARE_API_KEY` | `educare_external_api_key_2025` |
| `EVOLUTION_API_URL` | `https://api.educareapp.com.br` |
| `EVOLUTION_API_KEY` | `eff3ea025256694c10422fd0fc5ff169` |
| `EVOLUTION_INSTANCE_NAME` | `evolution` |

**IMPORTANTE:** Substitua `[SEU-REPLIT]` pela URL real do seu Replit!

---

## Passo 3: Configure Webhook na Evolution API

Execute este comando no terminal:

```bash
curl -X POST "https://api.educareapp.com.br/webhook/set/evolution" \
  -H "apikey: eff3ea025256694c10422fd0fc5ff169" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook": {
      "enabled": true,
      "url": "https://webhook.educareapp.com.br/webhook/chat",
      "webhookByEvents": true,
      "events": ["MESSAGES_UPSERT"]
    }
  }'
```

**Resposta esperada:**
```json
{
  "webhook": {
    "enabled": true,
    "url": "https://webhook.educareapp.com.br/webhook/chat"
  }
}
```

---

## Passo 4: Ative o Workflow

1. Volte para o workflow importado no n8n
2. Clique no toggle **Active** no canto superior direito
3. O workflow agora está ativo e pronto para receber mensagens

---

## Passo 5: Teste a Integração

### 5.1 Teste de Webhook (Opcional)
No n8n, clique no nó **"Evolution Webhook"** e depois em **"Listen for Test Event"**

### 5.2 Envie Mensagem de Teste
De qualquer WhatsApp, envie uma mensagem para o número conectado à instância Evolution:
```
Olá TitiNauta!
```

### 5.3 Verifique o Resultado
- O n8n deve processar a mensagem
- Você deve receber uma resposta do TitiNauta via WhatsApp

---

## Fluxo do Workflow

```
WhatsApp Message
      ↓
Evolution API (webhook)
      ↓
n8n: Evolution Webhook
      ↓
n8n: Extract WhatsApp Data
      ↓
n8n: Valid Message? ──No──→ Stop
      │
     Yes
      ↓
n8n: Search User by Phone
      ↓
n8n: User Exists? ──No──→ Create User → Send Welcome
      │
     Yes
      ↓
n8n: Get Active Child
      ↓
n8n: Child Selected? ──No──→ Send "Select Child" Message
      │
     Yes
      ↓
n8n: Ask TitiNauta AI (RAG)
      ↓
n8n: Send AI Response
      ↓
WhatsApp: User receives response
```

---

## Nós do Workflow

| Nó | Função |
|----|--------|
| **Evolution Webhook** | Recebe mensagens do WhatsApp via Evolution API |
| **Extract WhatsApp Data** | Extrai phone, message, senderName do payload |
| **Valid Message?** | Verifica se a mensagem tem dados válidos |
| **Search User by Phone** | Busca usuário no Educare pelo telefone |
| **User Exists?** | Verifica se usuário foi encontrado |
| **Create New User** | Cria novo usuário se não existir |
| **Send Welcome Message** | Envia mensagem de boas-vindas para novos usuários |
| **Merge User Data** | Prepara dados do usuário para próximos passos |
| **Get Active Child** | Busca criança ativa do usuário |
| **Child Selected?** | Verifica se tem criança selecionada |
| **Ask TitiNauta AI** | Envia pergunta para o RAG do TitiNauta |
| **Send AI Response** | Envia resposta do TitiNauta via WhatsApp |
| **Send Select Child Message** | Pede para usuário selecionar criança |

---

## Troubleshooting

### Webhook não recebe mensagens
1. Verifique se Evolution API está configurada corretamente
2. Teste o webhook:
   ```bash
   curl -X POST "https://webhook.educareapp.com.br/webhook/chat" \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

### Variáveis não funcionam
1. Verifique se criou todas as 5 variáveis em Settings > Variables
2. Certifique-se de que os nomes estão EXATAMENTE iguais (case-sensitive)

### TitiNauta não responde
1. Verifique se o backend Educare está rodando
2. Teste o endpoint diretamente:
   ```bash
   curl -X POST "https://[SEU-REPLIT].replit.dev:3001/api/rag/external/ask?api_key=educare_external_api_key_2025" \
     -H "Content-Type: application/json" \
     -d '{"question": "Olá, como você pode me ajudar?"}'
   ```

---

## Arquivos de Referência

| Arquivo | Descrição |
|---------|-----------|
| `n8n-workflow-template.json` | Workflow completo para importar |
| `N8N_VARIABLES_CONFIG.md` | Guia detalhado de configuração de variáveis |
| `N8N_INTEGRATION_GUIDE.md` | Documentação completa dos 15 endpoints |
| `DEPLOYMENT_SUMMARY.md` | Resumo executivo do deploy |

---

## Checklist Final

- [ ] Workflow importado no n8n
- [ ] 5 variáveis criadas (EDUCARE_API_URL, EDUCARE_API_KEY, EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE_NAME)
- [ ] Webhook configurado na Evolution API
- [ ] Workflow ativado
- [ ] Mensagem de teste enviada
- [ ] Resposta recebida via WhatsApp

**Integração completa!**
