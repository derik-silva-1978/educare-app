# Checklist de Configuração n8n + Evolution API

## 🔴 ANTES DE COMEÇAR: Validação de Servidor

Antes de prosseguir, verifique se ambos os servidores estão **acessíveis publicamente**:

```bash
# Teste n8n (substitua pela URL do seu servidor)
curl -I https://seu-n8n-servidor.com

# Teste Evolution API
curl -I https://seu-evolution-servidor.com
```

Resposta esperada: **HTTP 200** ou **HTTP 301** (redirecionamento é OK)

---

## 📋 PARTE 1: Informações do n8n

### 1.1 Acesso ao n8n

| Item | Valor | Status |
|------|-------|--------|
| **URL do n8n** | `https://n8n.educareapp.com.br` | ✅ Confirmado |
| **User/Email** | *(suas credenciais)* | ☐ Verificado |
| **Senha** | `*****` | ☐ Verificado |
| **Acesso ao Admin** | Sim / Não | ☐ Verificado |

**Como obter:**
- Acesse seu painel n8n
- Menu → Settings → User Management
- Verifique seu email e permissões

---

### 1.2 Credenciais da API n8n

| Item | Valor | Obrigatório | Status |
|------|-------|------------|--------|
| **API Key n8n** | `sk_live_xxxxx` | ⚠️ Condicional | ☐ Coletado |
| **Webhook URL Base** | `https://seu-n8n.com/webhook/` | ✅ Sim | ☐ Coletado |

**Como obter API Key:**
1. Acesse n8n → Seu avatar (canto superior direito)
2. Clique em **"Settings"**
3. Vá para **"API"** ou **"Tokens"**
4. Gere nova chave ou copie existente
5. ⚠️ **Guarde em local seguro** - não reutilize!

**Como obter Webhook URL Base:**
1. Abra qualquer workflow
2. Clique no nó **"Webhook"**
3. Copie a URL completa exibida
4. Base será: `https://seu-n8n.com/webhook/`

---

### 1.3 Versão do n8n

| Item | Valor | Status |
|------|-------|--------|
| **Versão n8n** | v1.x.x | ☐ Coletado |
| **Docker/Cloud/Self-hosted** | Qual? | ☐ Informado |

**Como obter:**
- Acesse n8n → Avatar → About
- Verifique versão exibida
- Anote tipo de deployment

---

### 1.4 Permissões de Webhook

⚠️ **CRÍTICO**: Webhook deve aceitar **POST** sem autenticação básica

```bash
# Teste se webhook aceita POST
curl -X POST "https://seu-n8n.com/webhook/test-path" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Resposta esperada: 
# {"success": true} OU "404 Not Found" (webhook não criado ainda)
# ❌ NÃO deve ser: "401 Unauthorized" ou "403 Forbidden"
```

Se retornar 401/403:
- ✅ **Solução**: Desative autenticação no webhook do n8n
- Vá para: Settings → Webhooks → Disable Auth

---

## 📱 PARTE 2: Informações da Evolution API

### 2.1 Acesso à Evolution API

| Item | Valor | Status |
|------|-------|--------|
| **URL Evolution** | `https://api.educareapp.com.br` | ✅ Confirmado |
| **Admin URL** | `https://api.educareapp.com.br/` | ✅ Confirmado |
| **Usuário Admin** | *(suas credenciais)* | ☐ Verificado |
| **Senha Admin** | `*****` | ☐ Verificado |

**Como obter:**
1. Acesse painel Evolution
2. Menu → Settings → API
3. Copie base URL
4. Verifique credenciais de acesso

---

### 2.2 Chave de API Evolution

| Item | Valor | Status |
|------|-------|--------|
| **API Key** | `eff3ea025256694c10422fd0fc5ff169` | ✅ Confirmado |
| **Bearer Token** | `apikey: eff3ea025256694c10422fd0fc5ff169` | ✅ Confirmado |
| **Instance Name** | `evolution` | ✅ Confirmado |

**Como obter:**
1. Acesse Evolution Admin Panel
2. Menu → API Keys / Tokens
3. Crie nova chave ou copie existente
4. Formato será: `X-API-Key: sua-chave`

**Teste de conexão:**
```bash
curl -X GET "https://seu-evolution-servidor.com/api/version" \
  -H "X-API-Key: sua-chave-evolution"

# Resposta esperada: {"status": "active", "version": "x.x.x"}
# ❌ Se retornar 401: Chave inválida ou expirada
```

---

### 2.3 Instância WhatsApp

| Item | Valor | Status |
|------|-------|--------|
| **Instance Name** | `educare-whatsapp` | ☐ Coletado |
| **Instance ID** | `uuid-da-instancia` | ☐ Coletado |
| **QR Code Status** | Conectado / Pendente | ☐ Verificado |
| **Phone Number** | `5511999999999` | ☐ Registrado |

**Como obter:**
1. Acesse Evolution Admin
2. Menu → Instances / WhatsApp
3. Selecione sua instância
4. Copie o Instance Name e ID

**Verificar status:**
```bash
curl -X GET "https://seu-evolution-servidor.com/api/instances/educare-whatsapp" \
  -H "X-API-Key: sua-chave-evolution"

# Resposta esperada:
{
  "instanceName": "educare-whatsapp",
  "status": "connected",
  "qrCode": null,  # null = conectado, string = QR code pendente
  "phoneNumber": "5511999999999"
}
```

---

### 2.4 Webhook Evolution Configurado

| Item | Valor | Status |
|------|-------|--------|
| **Webhook URL** | `https://seu-n8n.com/webhook/whatsapp-educare` | ☐ Configurado |
| **Eventos** | messages, status | ☐ Selecionados |

**Como configurar:**
1. Evolution Admin → Instances → educare-whatsapp
2. Vá para **"Webhooks"**
3. Clique em **"Add Webhook"**
4. **URL**: `https://seu-n8n.com/webhook/whatsapp-educare`
5. **Events**: Selecione `messages` (mínimo obrigatório)
6. **Teste**: Clique em "Test Webhook"

**Resposta esperada do teste:**
```
✅ Webhook received
Status: 200 OK
Response: Successfully processed
```

---

## 🔗 PARTE 3: Teste de Conectividade

### 3.1 Teste Educare API ↔ n8n

```bash
# Teste se Educare API é acessível do n8n
curl "https://SEU-REPLIT.replit.dev:3001/api/external/subscription-plans?api_key=educare_external_api_key_2025"

# Resposta esperada:
{"success": true, "data": [...]}
```

### 3.2 Teste n8n ↔ Evolution API

```bash
# Teste se Evolution API é acessível do n8n
curl -X GET "https://seu-evolution-servidor.com/api/instances" \
  -H "X-API-Key: sua-chave-evolution"

# Resposta esperada:
[{"instanceName": "educare-whatsapp", "status": "connected"}]
```

### 3.3 Teste Evolution API ↔ n8n Webhook

```bash
# Evolution envia para n8n (faça manualmente em Evolution Admin)
# Webhook Settings → "Test Webhook"
# Verifique se n8n recebe a requisição

# No n8n:
# 1. Abra o workflow
# 2. Clique no nó "Webhook"
# 3. Clique em "Listen for Test Event"
# 4. Envie teste de Evolution
# 5. Verifique se dados aparecem no n8n
```

---

## 🚨 PARTE 4: Problemas Comuns

### Problema: "webhook not responding"

**Causas:**
- ❌ URL do webhook n8n incorreta
- ❌ Webhook desativado no n8n
- ❌ Firewall bloqueando requisições
- ❌ n8n não está rodando

**Solução:**
```bash
# 1. Verifique se n8n está acessível
curl -I https://seu-n8n.com

# 2. Acesse o workflow e verifique webhook URL
# (deve aparecer na interface do nó)

# 3. Teste manualmente
curl -X POST "https://seu-n8n.com/webhook/whatsapp-educare" \
  -H "Content-Type: application/json" \
  -d '{"test": "message"}'
```

---

### Problema: "Authentication failed (401)"

**Causas:**
- ❌ API Key incorreta
- ❌ API Key expirada
- ❌ Header name errado (`X-API-Key` vs `x-api-key`)

**Solução:**
```bash
# Teste com chave correta
curl -X GET "https://seu-evolution-servidor.com/api/version" \
  -H "X-API-Key: SUA_CHAVE_EVOLUTION"

# Se ainda falhar:
# 1. Gere nova API Key em Evolution Admin
# 2. Aguarde 5 minutos
# 3. Teste novamente
```

---

### Problema: "Instance not found"

**Causas:**
- ❌ Nome da instância incorreto
- ❌ Instância desativada
- ❌ WhatsApp desconectado (QR Code expirado)

**Solução:**
```bash
# Liste todas as instâncias
curl -X GET "https://seu-evolution-servidor.com/api/instances" \
  -H "X-API-Key: sua-chave"

# Verifique status
curl -X GET "https://seu-evolution-servidor.com/api/instances/educare-whatsapp/status" \
  -H "X-API-Key: sua-chave"

# Se status = "disconnected":
# 1. Acesse Evolution Admin
# 2. Selecione instância
# 3. Clique em "Restart" ou "Reconnect"
# 4. Escaneie QR Code novamente
```

---

## ✅ Checklist Final de Validação

Antes de importar o workflow n8n:

- [ ] n8n está acessível (URL funciona)
- [ ] API Key n8n obtida (se necessária)
- [ ] Webhook n8n testado e funcionando
- [ ] Evolution API está acessível (URL funciona)
- [ ] API Key Evolution obtida
- [ ] Instância WhatsApp criada e conectada
- [ ] Webhook Evolution configurado em n8n URL
- [ ] Teste de webhook Evolution bem-sucedido
- [ ] Conectividade entre todos os serviços validada
- [ ] Variáveis de ambiente prontas:
  ```
  EDUCARE_API_URL=https://seu-replit.replit.dev:3001
  EDUCARE_API_KEY=educare_external_api_key_2025
  EVOLUTION_API_URL=https://seu-evolution-servidor.com
  EVOLUTION_API_KEY=sua-chave-evolution
  EVOLUTION_INSTANCE_NAME=educare-whatsapp
  ```

---

## 📞 Suporte Rápido

### Se n8n não receber mensagens:
1. Verifique Evolution Webhook está configurado corretamente
2. Teste webhook manualmente em Evolution Admin
3. Verifique logs do n8n (Menu → Execution History)

### Se resposta WhatsApp não chega:
1. Verifique se instância Evolution está conectada
2. Teste envio manual via Evolution API
3. Verifique logs de envio em Evolution Admin

### Se Educare API retorna erro:
1. Verifique se backend está rodando (porta 3001)
2. Valide API Key: `educare_external_api_key_2025`
3. Verifique CORS se necessário

---

## 🔐 Segurança: Variáveis Sensíveis

**Nunca coloque no código:**
- ❌ API Keys
- ❌ Senhas
- ❌ Bearer Tokens

**Sempre use variáveis:**
- ✅ n8n Variables (Settings → Variables)
- ✅ Environment variables (se self-hosted)
- ✅ Secrets management (se cloud)

---

## 📝 Exemplo: Valores Preenchidos

Quando completar o checklist, sua configuração ficará assim:

```
EDUCARE_API_URL=https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev:3001
EDUCARE_API_KEY=educare_external_api_key_2025
EVOLUTION_API_URL=https://evolution.seudominio.com
EVOLUTION_API_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxx
EVOLUTION_INSTANCE_NAME=educare-whatsapp
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/whatsapp-educare
```

**Salve este documento** e preencha com suas informações reais!
