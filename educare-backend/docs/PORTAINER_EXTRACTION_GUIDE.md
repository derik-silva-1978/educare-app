# 🐳 Guia: Extrair Informações do Portainer

Você tem tudo no Portainer! Este guia mostra **exatamente onde clicar** para obter cada informação.

---

## 📍 URLs dos Serviços (do Portainer)

### Via Portainer UI:

1. **Abra Portainer** → Menu esquerdo → **Services**
2. Procure por: `n8n_n8n_editor` e `evolution_evolution_api`
3. Clique em cada um para obter a URL

**O que você vai ver:**

```
Serviço: n8n_n8n_editor
├─ Status: Running
├─ Published Port: 5678 (ou outro)
├─ Image: n8nio/n8n:latest
└─ Network: n8n_default (ou seu network)

Serviço: evolution_evolution_api
├─ Status: Running
├─ Published Port: 3333 (ou outro)
├─ Image: evolution-api:latest
└─ Network: evolution_default (ou seu network)
```

---

### Para Encontrar a URL Completa:

#### **n8n:**
```
https://seu-dominio.com:5678
OU
https://seu-ip-servidor:5678
```

#### **Evolution API:**
```
https://seu-dominio.com:3333
OU
https://seu-ip-servidor:3333
```

**Substitua:**
- `seu-dominio.com` = seu domínio real
- `seu-ip-servidor` = IP do servidor (ex: 192.168.1.10)
- Os números de porta podem variar!

---

## 🔑 PARTE 1: Extrair API Key do n8n

### Passo 1: Acesse n8n pelo browser

```
https://seu-dominio.com:5678
```

### Passo 2: Faça login

- Email: seu email
- Senha: sua senha n8n

### Passo 3: Obtenha a API Key

1. Clique no seu **avatar** (canto superior direito)
2. Selecione **"Settings"**
3. Vá para **"API"** ou **"Access Tokens"**
4. Clique em **"Generate"** ou copie a chave existente
5. **Copie** a API Key completa

**Resultado:**
```
CHAVE n8n: sk_live_xxxxxxxxxxxxxxxxxxxxx
```

---

## 🔑 PARTE 2: Extrair Informações da Evolution API

### Opção A: Via Portainer (Mais Fácil)

1. Acesse **Portainer** → **Containers**
2. Procure por **`evolution_evolution_api`**
3. Clique nele
4. Vá para **"Inspect"** → **"Env"** (Environment Variables)

**Procure por:**
```
EVOLUTION_WEBHOOK_URL=https://seu-n8n.com/webhook/
EVOLUTION_INSTANCE_NAME=educare-whatsapp
API_KEY_MASTER=sua-chave-evolution-xxxxx
```

---

### Opção B: Via CLI do Portainer

1. Acesse **Portainer** → seu serviço **evolution_evolution_api**
2. Clique em **"Logs"** para ver logs
3. Procure por mensagens como:
   ```
   Evolution API iniciando...
   API Key: xxxxx
   Instance: educare-whatsapp
   ```

---

### Opção C: Acesse Evolution Admin Panel

**Se Evolution tem painel web:**

1. Abra: `https://seu-dominio.com:3333/admin` (ou similar)
2. Faça login com credenciais Evolution
3. Vá para **Settings** → **API Keys**
4. Copie a chave

---

## 🌐 PARTE 3: Nome da Instância WhatsApp

No Evolution Admin ou via Portainer:

1. **Portainer** → **evolution_evolution_api** → **Inspect**
2. Procure na seção **Env** por:
   ```
   EVOLUTION_INSTANCE_NAME=educare-whatsapp
   ```

**Ou manualmente no Evolution:**
1. Evolution Admin → **Instances**
2. Procure a instância WhatsApp conectada
3. O nome aparecerá como: `educare-whatsapp` (ou qual você criou)

---

## ✅ Checklist Portainer

Abra Portainer agora e preencha:

| Informação | Local no Portainer | Valor |
|------------|-------------------|-------|
| **n8n URL** | Services → n8n_n8n_editor → Published Port | https://seu-dominio.com:____ |
| **n8n API Key** | n8n Settings → API | sk_live_xxxxx |
| **Evolution URL** | Services → evolution_evolution_api → Published Port | https://seu-dominio.com:____ |
| **Evolution API Key** | evolution_evolution_api → Inspect → Env | xxxxx |
| **Evolution Instance** | evolution_evolution_api → Inspect → Env | educare-whatsapp |

---

## 🔗 Teste de Conectividade (Terminal)

Após coletar os dados, teste:

```bash
# Teste 1: n8n está acessível?
curl -I https://seu-dominio.com:5678

# Teste 2: Evolution está acessível?
curl -I https://seu-dominio.com:3333

# Teste 3: Webhook n8n funciona?
curl -X POST "https://seu-dominio.com:5678/webhook/whatsapp-educare" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Teste 4: Evolution API Key válida?
curl "https://seu-dominio.com:3333/api/version" \
  -H "X-API-Key: sua-chave-evolution"
```

**Esperado:**
- ✅ Teste 1 & 2: HTTP 200 ou 301
- ✅ Teste 3: HTTP 200 (webhook funcionando)
- ✅ Teste 4: JSON com versão da API

---

## 📋 Template para Variáveis n8n

Quando tiver tudo, preencha assim no n8n:

1. Abra o workflow importado
2. Clique no botão **"Variables"** (lado esquerdo)
3. Preencha cada uma:

```
EDUCARE_API_URL = https://seu-replit.replit.dev:3001

EDUCARE_API_KEY = educare_external_api_key_2025
(já vem preenchido)

EVOLUTION_API_URL = https://seu-dominio.com:3333

EVOLUTION_API_KEY = sua-chave-evolution-xxxxx

EVOLUTION_INSTANCE_NAME = educare-whatsapp
```

---

## 🆘 Troubleshooting Portainer

### Não consigo ver Environment Variables

1. Clique no container **evolution_evolution_api**
2. Vá para **"Inspect"**
3. Role para baixo até **"Env"** ou **"Environment"**
4. Se não aparecer nada, o container pode estar usando config file

**Alternativa:** Verifique arquivo de config no container
```bash
# Via Portainer CLI
docker exec evolution_evolution_api cat /app/config.json
```

---

### Webhook n8n retorna 401/403

1. Portainer → n8n_n8n_editor → Inspect
2. Vá para **Env** → procure por `N8N_WEBHOOK_AUTH`
3. Se = `true`, desative:
   ```
   N8N_WEBHOOK_AUTH=false
   ```
4. Restart do container

---

### Evolution API retorna 404

1. Verifique URL exata:
   - Com HTTPS? ✅
   - Porta correta? ✅
   - Sem barra final? ✅

2. Verifique se está rodando:
   ```bash
   curl -I https://seu-dominio.com:3333
   # Deve retornar 200 ou 301, não 404
   ```

---

## 📸 Screenshots para Referência

### Onde encontrar no Portainer:

```
Portainer Home
  ├─ Services (🔗)
  │   ├─ n8n_n8n_editor ← Clique aqui
  │   │   └─ Published Port: XXXX
  │   │
  │   └─ evolution_evolution_api ← E aqui
  │       └─ Published Port: XXXX
  │
  └─ Containers (🐳)
      ├─ evolution_evolution_api → Inspect
      │   └─ Env (Procure por EVOLUTION_*)
      │
      └─ n8n_n8n_editor → Inspect
          └─ Env (Procure por N8N_*)
```

---

## ✨ Resumo Rápido

1. **Portainer Services** → Obtenha URLs e portas
2. **Portainer Inspect → Env** → Obtenha API Keys
3. **n8n Settings → API** → Obtenha API Key n8n (se usar)
4. **Teste conectividade** com curl
5. **Preencha variáveis** no workflow importado
6. **Pronto!** Workflow está configurado

Qualquer dúvida, execute os testes curl acima - eles mostram exatamente o que está faltando! 🚀
