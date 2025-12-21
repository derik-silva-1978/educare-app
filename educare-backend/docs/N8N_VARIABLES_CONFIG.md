# Configuração de Variáveis no n8n

## Como Configurar

Após importar o workflow, você precisa criar as variáveis no n8n.

### Passo 1: Acesse Variáveis

1. Abra n8n: `https://n8n.educareapp.com.br/`
2. Clique no ícone de **Engrenagem** (Settings) no menu lateral
3. Clique em **Variables**

### Passo 2: Crie as 5 Variáveis

Clique em **+ Add Variable** para cada uma:

---

#### 1. EDUCARE_API_URL
```
Key: EDUCARE_API_URL
Value: https://[SEU-REPLIT-ID].replit.dev:3001
```
**⚠️ Substitua `[SEU-REPLIT-ID]` pela URL real do seu Replit**

---

#### 2. EDUCARE_API_KEY
```
Key: EDUCARE_API_KEY
Value: educare_external_api_key_2025
```

---

#### 3. EVOLUTION_API_URL
```
Key: EVOLUTION_API_URL
Value: https://api.educareapp.com.br
```

---

#### 4. EVOLUTION_API_KEY
```
Key: EVOLUTION_API_KEY
Value: eff3ea025256694c10422fd0fc5ff169
```

---

#### 5. EVOLUTION_INSTANCE_NAME
```
Key: EVOLUTION_INSTANCE_NAME
Value: evolution
```

---

## Verificação

Após criar todas as variáveis, você deve ver na lista:

| Key | Value |
|-----|-------|
| EDUCARE_API_URL | https://[seu-replit].replit.dev:3001 |
| EDUCARE_API_KEY | educare_external_api_key_2025 |
| EVOLUTION_API_URL | https://api.educareapp.com.br |
| EVOLUTION_API_KEY | eff3ea025256694c10422fd0fc5ff169 |
| EVOLUTION_INSTANCE_NAME | evolution |

---

## Uso no Workflow

No workflow, as variáveis são acessadas usando `$vars.NOME_DA_VARIAVEL`:

```javascript
// Exemplos de uso
$vars.EDUCARE_API_URL        // → https://[seu-replit].replit.dev:3001
$vars.EDUCARE_API_KEY        // → educare_external_api_key_2025
$vars.EVOLUTION_API_URL      // → https://api.educareapp.com.br
$vars.EVOLUTION_API_KEY      // → eff3ea025256694c10422fd0fc5ff169
$vars.EVOLUTION_INSTANCE_NAME // → evolution
```

---

## Variáveis Chatwoot (v4.0 - Novo)

Para o workflow v4.0 com suporte dual-source, adicione também:

#### 6. CHATWOOT_API_URL
```
Key: CHATWOOT_API_URL
Value: https://chatwoot.educareapp.com.br
```

---

#### 7. CHATWOOT_API_KEY
```
Key: CHATWOOT_API_KEY
Value: [SEU_ACCESS_TOKEN_CHATWOOT]
```

**Como obter:**
1. Acesse Chatwoot → **Settings** → **Profile Settings**
2. Role até **Access Token**
3. Copie o token

---

## Verificação Completa (v4.0)

Após criar todas as variáveis para dual-source, você deve ver:

| Key | Value | Obrigatório |
|-----|-------|-------------|
| EDUCARE_API_URL | https://[seu-replit].replit.dev:3001 | Sim |
| EDUCARE_API_KEY | educare_external_api_key_2025 | Sim |
| EVOLUTION_API_URL | https://api.educareapp.com.br | Sim |
| EVOLUTION_API_KEY | eff3ea025256694c10422fd0fc5ff169 | Sim |
| EVOLUTION_INSTANCE_NAME | evolution | Sim |
| CHATWOOT_API_URL | https://chatwoot.educareapp.com.br | Sim (v4.0) |
| CHATWOOT_API_KEY | [seu_token] | Sim (v4.0) |

---

## Uso no Workflow v4.0

```javascript
// Variáveis Evolution (existentes)
$vars.EDUCARE_API_URL        // → https://[seu-replit].replit.dev:3001
$vars.EDUCARE_API_KEY        // → educare_external_api_key_2025
$vars.EVOLUTION_API_URL      // → https://api.educareapp.com.br
$vars.EVOLUTION_API_KEY      // → eff3ea025256694c10422fd0fc5ff169
$vars.EVOLUTION_INSTANCE     // → evolution

// Variáveis Chatwoot (novas v4.0)
$vars.CHATWOOT_API_URL       // → https://chatwoot.educareapp.com.br
$vars.CHATWOOT_API_KEY       // → [seu_access_token]
```

---

## Próximos Passos

1. ✅ Variáveis criadas
2. → Configure o webhook na Evolution API
3. → Configure o webhook no Chatwoot (Settings > Integrations > Webhooks)
4. → Importe o workflow v4.0 (`n8n-workflow-template-v4.json`)
5. → Ative o workflow
6. → Teste com mensagem WhatsApp (via Evolution ou Chatwoot)
