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

## Próximos Passos

1. ✅ Variáveis criadas
2. → Configure o webhook na Evolution API
3. → Ative o workflow
4. → Teste com mensagem WhatsApp
