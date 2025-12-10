# ✅ Educare+ + n8n + Evolution - PRONTO PARA DEPLOY

**Status:** Todas as informações coletadas ✓

---

## 📊 DADOS FINAIS (CONFIRMADOS)

### Educare Backend (Replit)
```
URL: https://[SEU-REPLIT].replit.dev:3001
API Key: educare_external_api_key_2025
```

### n8n (Seu Servidor)
```
URL: https://n8n.educareapp.com.br/
Webhook Base: https://webhook.educareapp.com.br/
Protocol: HTTPS
```

### Evolution API (Seu Servidor)
```
URL: https://api.educareapp.com.br/
API Key: eff3ea025256694c10422fd0fc5ff169
Instance Name: evolution
Database: PostgreSQL
N8N Integration: ENABLED ✓
```

---

## 🚀 PASSO-A-PASSO DE IMPLEMENTAÇÃO

### PASSO 1: Teste de Conectividade Rápido

Execute no terminal do seu servidor:

```bash
# Teste 1: n8n acessível
curl -I https://n8n.educareapp.com.br/
# Esperado: HTTP 200

# Teste 2: Evolution API acessível
curl -I https://api.educareapp.com.br/
# Esperado: HTTP 200

# Teste 3: API Key Evolution válida
curl -X GET "https://api.educareapp.com.br/instance/fetchInstances" \
  -H "apikey: eff3ea025256694c10422fd0fc5ff169"
# Esperado: JSON com instâncias, uma delas "evolution"
```

Se todos retornarem OK, continue. Se algum falhar, avise antes de prosseguir.

---

### PASSO 2: Importar Workflow no n8n

#### 2.1 Acesse n8n
```
https://n8n.educareapp.com.br/
```
Faça login com suas credenciais.

#### 2.2 Importe o workflow

1. Clique em **"Workflows"** (lado esquerdo)
2. Clique em **"New"** ou **"Import"**
3. Escolha **"Import from JSON"**
4. Cole o conteúdo do arquivo:
   ```
   educare-backend/docs/n8n-workflow-template.json
   ```
5. Clique em **"Import"**

#### 2.3 Configure as 5 Variáveis

Após importar, você verá um botão **"Variables"** (lado esquerdo, ícone de chave 🔑)

Clique nele e preencha **EXATAMENTE** assim:

| Variável | Valor |
|----------|-------|
| `EDUCARE_API_URL` | `https://[SEU-REPLIT].replit.dev:3001` |
| `EDUCARE_API_KEY` | `educare_external_api_key_2025` |
| `EVOLUTION_API_URL` | `https://api.educareapp.com.br` |
| `EVOLUTION_API_KEY` | `eff3ea025256694c10422fd0fc5ff169` |
| `EVOLUTION_INSTANCE_NAME` | `evolution` |

**⚠️ Importante:** 
- `EDUCARE_API_URL`: Substitua `[SEU-REPLIT]` pela URL exata do seu Replit
- Exemplo: `https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001`

#### 2.4 Salve o Workflow

Clique em **"Save"** (lado superior direito)

---

### PASSO 3: Configurar Webhook na Evolution API

Evolution precisa saber para onde enviar as mensagens do WhatsApp.

#### 3.1 Via API (Recomendado)

Execute no terminal:

```bash
curl -X POST "https://api.educareapp.com.br/webhook/set" \
  -H "apikey: eff3ea025256694c10422fd0fc5ff169" \
  -H "Content-Type: application/json" \
  -d '{
    "global": true,
    "webhook": "https://webhook.educareapp.com.br/whatsapp-educare",
    "events": ["MESSAGES_UPSERT"]
  }'
```

**Resposta esperada:**
```json
{
  "status": 201,
  "message": "Webhook configured successfully"
}
```

#### 3.2 Ou via Painel Evolution (Se tiver UI)

1. Abra `https://api.educareapp.com.br/` (seu painel)
2. Vá para **Settings** → **Webhooks**
3. Adicione novo webhook:
   - **URL:** `https://webhook.educareapp.com.br/whatsapp-educare`
   - **Events:** `MESSAGES_UPSERT` (mínimo)
   - **Active:** Sim
4. Salve

---

### PASSO 4: Teste o Fluxo Completo

#### 4.1 Prepare n8n para receber

No n8n:
1. Abra seu workflow importado
2. Clique no nó **"Evolution API Webhook"** (primeiro nó)
3. Clique em **"Listen for Test Event"**
4. Aguarde (ficará em modo de escuta)

#### 4.2 Envie mensagem de teste

De qualquer WhatsApp, envie uma mensagem para o número configurado na instância Evolution:
```
Olá TitiNauta!
```

#### 4.3 Verifique Recebimento

No n8n (em "Listen for Test Event"), você deve ver:
```json
{
  "phone": "5511999999999",
  "message": "Olá TitiNauta!",
  "senderName": "Seu Nome"
}
```

**Se apareceu:** ✅ Webhook está funcionando!

---

### PASSO 5: Ativar Workflow

Após confirmar que o webhook recebe dados:

1. No n8n, clique no botão de **"ativar"** (ou toggle)
2. Status deve mudar para **"Active"**
3. Agora o workflow está pronto para processar mensagens reais

---

## 🔄 Fluxo Completo (Resumo Visual)

```
Usuário enviando WhatsApp
         ↓
Evolution API recebe mensagem
         ↓
Evolution envia webhook para n8n
    (https://webhook.educareapp.com.br/whatsapp-educare)
         ↓
n8n Workflow processa:
  1. Extrai: phone, message, senderName
  2. Busca usuário no Educare por phone
  3. Se não existir → Cria novo usuário
  4. Busca criança ativa do usuário
  5. Se tem criança → Envia pergunta para TitiNauta AI
  6. TitiNauta responde via Educare API
  7. Resposta volta para Evolution API
  8. Evolution envia resposta via WhatsApp
         ↓
Usuário recebe resposta do TitiNauta
```

---

## ✅ Checklist de Validação

Antes de considerar "implementado com sucesso":

- [ ] Testes 1-3 executados e passaram
- [ ] Workflow importado no n8n
- [ ] 5 variáveis preenchidas corretamente
- [ ] Webhook Evolution configurado
- [ ] Webhook n8n em "Listen for Test Event"
- [ ] Mensagem WhatsApp de teste enviada
- [ ] n8n recebeu a mensagem (dados visíveis)
- [ ] Workflow ativado
- [ ] **Próxima mensagem deve retornar resposta do TitiNauta**

---

## 🚨 Troubleshooting Rápido

### "Webhook not receiving messages"

```bash
# 1. Verifique se webhook é acessível
curl -X POST "https://webhook.educareapp.com.br/whatsapp-educare" \
  -H "Content-Type: application/json" \
  -d '{"test": "message"}'

# 2. Se retornar erro 404/502:
# - Verifique se webhook.educareapp.com.br está configurado no DNS
# - Verifique se aponta para o IP/domínio correto do n8n
```

### "API Key inválida"

```bash
# Teste se API Key Evolution está correta
curl -X GET "https://api.educareapp.com.br/instance/fetchInstances" \
  -H "apikey: eff3ea025256694c10422fd0fc5ff169"

# Se retornar 401: Gere nova API Key em Evolution Admin
```

### "Instância 'evolution' não encontrada"

Significa que no seu Evolution não existe instância com esse nome.

**Solução:**
1. Verifique instâncias existentes:
   ```bash
   curl -X GET "https://api.educareapp.com.br/instance/fetchInstances" \
     -H "apikey: eff3ea025256694c10422fd0fc5ff169"
   ```
2. Copie o `instanceName` correto da resposta
3. No n8n, altere a variável `EVOLUTION_INSTANCE_NAME` com o nome correto

---

## 📝 Resumo Final

| Componente | URL | Chave/Token | Instance |
|-----------|-----|-------------|----------|
| **Educare Backend** | https://[SEU-REPLIT].replit.dev:3001 | educare_external_api_key_2025 | - |
| **n8n** | https://n8n.educareapp.com.br/ | - | - |
| **Evolution API** | https://api.educareapp.com.br/ | eff3ea025256694c10422fd0fc5ff169 | evolution |
| **Webhook** | https://webhook.educareapp.com.br/whatsapp-educare | - | - |

---

## 🎯 Próxima Ação

1. Execute os **3 testes de conectividade** (Passo 1)
2. Se todos passarem, **importe o workflow** (Passo 2-4)
3. **Configure webhook Evolution** (Passo 3)
4. **Teste fluxo** (Passo 4)
5. **Ative workflow** (Passo 5)

**Qualquer dúvida ou erro, compartilhe a mensagem de erro aqui!** 🚀
