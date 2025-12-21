# 🚀 Integração Educare+ + n8n + Evolution API - Configuração Final

**Status:** Pronto para implementação com dados reais

---

## 📊 INFORMAÇÕES COLETADAS DO SEU SERVIDOR

### n8n (Portainer)
```
Domínio: n8n.educareapp.com.br
URL Base: https://n8n.educareapp.com.br/
Protocolo: HTTPS
Webhook Base URL: https://webhook.educareapp.com.br/webhook/
Host: n8n.educareapp.com.br
```

### Evolution API (Portainer)
```
Domínio: api.educareapp.com.br
URL Base: https://api.educareapp.com.br/
API Key: eff3ea025256694c10422fd0fc5ff169
Database: PostgreSQL (postgres:5432)
N8N Integration: ENABLED (true)
```

### Educare Backend (Replit)
```
URL: https://[SEU-REPLIT].replit.dev:3001
API Key (Externa): educare_external_api_key_2025
```

---

## 🔧 PASSO 1: Instância WhatsApp Confirmada

✅ **INFORMAÇÃO COLETADA DO PORTAINER:**

Nome da instância WhatsApp: **`evolution`**

### Verificação:
```bash
curl -X GET "https://api.educareapp.com.br/instance/fetchInstances" \
  -H "apikey: eff3ea025256694c10422fd0fc5ff169"

# Resposta contém:
# {
#   "data": {
#     "instances": [
#       {
#         "instanceName": "evolution",
#         "status": "open"
#       }
#     ]
#   }
# }
```

**Status:** ✅ Confirmado e validado

---

## 📋 PASSO 2: Verificar Webhook URL no n8n

A Evolution API pode ser apontada para diferentes webhooks. Precisamos confirmar:

### Webhook para Evolution enviar mensagens:
```
https://webhook.educareapp.com.br/webhook/webhook/chat
```

Esse webhook será **criado no n8n** quando importarmos o workflow.

---

## 🔗 PASSO 3: Teste de Conectividade (Execute Agora)

Execute esses comandos no terminal do seu servidor para validar:

### Teste 1: n8n está acessível
```bash
curl -I https://n8n.educareapp.com.br/
# Esperado: HTTP 200 ou 301
```

### Teste 2: Evolution API está acessível
```bash
curl -I https://api.educareapp.com.br/
# Esperado: HTTP 200 ou 301
```

### Teste 3: API Key Evolution válida
```bash
curl -X GET "https://api.educareapp.com.br/instance/fetchInstances" \
  -H "apikey: eff3ea025256694c10422fd0fc5ff169"
# Esperado: JSON com instâncias
```

### Teste 4: Webhook n8n receptor
```bash
curl -X POST "https://webhook.educareapp.com.br/webhook/webhook/chat" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
# Esperado: Webhook receberá no n8n (ainda não criado, mas URL must be accessible)
```

---

## 📝 PASSO 4: Variáveis para o Workflow n8n

Quando importar `n8n-workflow-template.json`, preencha **EXATAMENTE** assim:

| Variável | Valor | Origem |
|----------|-------|--------|
| **EDUCARE_API_URL** | `https://[SEU-REPLIT].replit.dev:3001` | Seu Replit |
| **EDUCARE_API_KEY** | `educare_external_api_key_2025` | Pré-configurado |
| **EVOLUTION_API_URL** | `https://api.educareapp.com.br` | Portainer Evolution |
| **EVOLUTION_API_KEY** | `eff3ea025256694c10422fd0fc5ff169` | Portainer Evolution |
| **EVOLUTION_INSTANCE_NAME** | `[NOME_EXATO_INSTANCIA]` | ⚠️ Você fornece! |

---

## 🎯 PASSO 5: Como Importar o Workflow no n8n

### 5.1 Acesse n8n
```
https://n8n.educareapp.com.br/
```

### 5.2 Importe o workflow

1. Menu → **Workflows** (ou tela inicial)
2. Clique em **"Import"**
3. Escolha **"Import from JSON"**
4. Cole o conteúdo de: `educare-backend/docs/n8n-workflow-template.json`
5. Clique em **"Import"**

### 5.3 Configure as variáveis

1. Abra o workflow importado
2. Clique no botão **"Variables"** (lado esquerdo, ícone de chave)
3. Preencha **5 variáveis**:

```
EDUCARE_API_URL = https://[SEU-REPLIT].replit.dev:3001
EDUCARE_API_KEY = educare_external_api_key_2025
EVOLUTION_API_URL = https://api.educareapp.com.br
EVOLUTION_API_KEY = eff3ea025256694c10422fd0fc5ff169
EVOLUTION_INSTANCE_NAME = [NOME_EXATO_DA_INSTANCIA]
```

### 5.4 Salve o workflow

Clique em **"Save"**

---

## 🔗 PASSO 6: Configurar Webhook na Evolution API

Evolution precisa saber para onde enviar as mensagens.

### 6.1 Configure webhook global (se não existir)

Na Evolution API, você pode usar API ou painel:

**Via API (recomendado):**
```bash
curl -X POST "https://api.educareapp.com.br/webhook/set" \
  -H "apikey: eff3ea025256694c10422fd0fc5ff169" \
  -H "Content-Type: application/json" \
  -d {
    "global": true,
    "webhook": "https://webhook.educareapp.com.br/webhook/webhook/chat",
    "events": ["MESSAGES_UPSERT"]
  }
```

**Ou manualmente no painel Evolution** (se tiver UI):
1. Settings → Webhooks
2. Adicione: `https://webhook.educareapp.com.br/webhook/webhook/chat`
3. Eventos: `MESSAGES_UPSERT` (mínimo)
4. Salve

---

## ✅ PASSO 7: Teste o Fluxo Completo

### 7.1 No n8n, ative o webhook

1. Abra seu workflow
2. Nó **"Evolution API Webhook"**
3. Clique em **"Listen for Test Event"**

### 7.2 Envie mensagem WhatsApp de teste

De qualquer WhatsApp para seu número registrado na instância:
```
Olá, tudo bem?
```

### 7.3 Verifique se n8n recebeu

No n8n:
- Deve aparecer em **"Listen for Test Event"** os dados da mensagem
- Phone, message, sender name devem estar visíveis

### 7.4 Se recebeu: Fluxo está funcionando! 🎉

---

## 🚨 Troubleshooting Rápido

### Problema: "Webhook not responding" na Evolution

**Causa:** Webhook URL não acessível ou incorreta

**Solução:**
```bash
# Teste a URL
curl -I https://webhook.educareapp.com.br/webhook/webhook/chat

# Se retornar 404/502:
# 1. Verifique se webhook.educareapp.com.br está configurado no DNS
# 2. Verifique se apontado para o n8n correto
# 3. Verifique se n8n está rodando
```

---

### Problema: "API Key inválida" na Evolution

**Solução:**
```bash
# Verifique se API Key está correta
curl -X GET "https://api.educareapp.com.br/instance/fetchInstances" \
  -H "apikey: eff3ea025256694c10422fd0fc5ff169"

# Se retornar 401:
# API Key expirou ou está errada
# Gere nova em Evolution Admin
```

---

### Problema: Mensagem enviada mas n8n não recebe

**Causas possíveis:**
- ❌ Webhook Evolution não configurado apontando para n8n
- ❌ n8n não está escutando o webhook
- ❌ URL do webhook incorreta

**Solução:**
1. Evolution → Settings → Webhooks → Confirme URL
2. n8n → Workflow → Webhook Node → "Listen for Test Event" ativo
3. Teste webhook manualmente:
   ```bash
   curl -X POST "https://webhook.educareapp.com.br/webhook/webhook/chat" \
     -H "Content-Type: application/json" \
     -d '{"test": "message"}'
   ```

---

## 📋 Checklist Final

Antes de considerar implementado:

- [ ] Teste 1-4 executados com sucesso
- [ ] Instance Name da Evolution coletado
- [ ] Workflow importado no n8n
- [ ] 5 variáveis preenchidas corretamente
- [ ] Webhook Evolution configurado
- [ ] Webhook n8n em modo "Listen"
- [ ] Mensagem WhatsApp de teste enviada
- [ ] n8n recebeu a mensagem
- [ ] Resposta TitiNauta retornou via WhatsApp

---

## 📞 Próximos Passos

1. **Compartilhe o instance name** da Evolution (resultado do Teste 3 ou Opção B)
2. **Execute os testes 1-4** e avise se houve problemas
3. **Importe o workflow** e preencha variáveis
4. **Teste o webhook** e envie mensagem WhatsApp
5. **Pronto!** Sistema estará integrado

---

## 🎯 Resumo Visual do Fluxo

```
WhatsApp do Usuário
       ↓
Evolution API (recebe mensagem)
       ↓
Webhook → n8n (webhook.educareapp.com.br/whatsapp-educare)
       ↓
n8n Workflow
  ├─ Extrai dados (phone, message)
  ├─ Busca usuário no Educare
  ├─ Cria usuário se não existir
  ├─ Busca criança ativa
  ├─ Envia pergunta para TitiNauta (Educare AI)
  └─ Resposta → Evolution API → WhatsApp
```

**Tudo pronto do lado Educare Backend!**
