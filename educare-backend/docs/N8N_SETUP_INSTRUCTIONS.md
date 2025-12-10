# Instruções de Configuração do Workflow n8n

## 1. Preparação Pré-Importação

### 1.1 Obtenha as Credenciais Necessárias

**Educare+ Backend:**
- 🔑 **EDUCARE_API_KEY**: `educare_external_api_key_2025`
- 🌐 **EDUCARE_API_URL**: URL do seu backend (ex: `https://seu-replit.replit.dev:3001`)

**Evolution API (WhatsApp):**
- 🔑 **EVOLUTION_API_KEY**: `eff3ea025256694c10422fd0fc5ff169`
- 🌐 **EVOLUTION_API_URL**: `https://api.educareapp.com.br`
- 📱 **EVOLUTION_INSTANCE_NAME**: `evolution`

---

## 2. Importando o Workflow no n8n

### Opção A: Importar via JSON (Recomendado)

1. Abra seu n8n em `https://seu-n8n.com`
2. Clique em **"Workflows"** no menu lateral
3. Clique em **"+ New"**
4. Clique em **"Import from JSON"**
5. Cole o conteúdo do arquivo `n8n-workflow-template.json`
6. Clique em **"Import"**

### Opção B: Importar via URL

1. No n8n, vá para **"Workflows"**
2. Clique em **"+ New"** → **"Import from URL"**
3. Cole a URL do arquivo JSON (se hospedado):
   ```
   https://seu-servidor/n8n-workflow-template.json
   ```

---

## 3. Configurando Variáveis de Ambiente

Após importar, configure as variáveis do workflow:

### 3.1 Acesse as Configurações

1. Abra o workflow importado
2. Clique em **"Settings"** (ícone de engrenagem)
3. Vá para a aba **"Variables"**

### 3.2 Configure cada Variável

| Variável | Exemplo | Obrigatória |
|----------|---------|------------|
| `EDUCARE_API_URL` | `https://[SEU-REPLIT].replit.dev:3001` | ✅ Sim (Preencher) |
| `EDUCARE_API_KEY` | `educare_external_api_key_2025` | ✅ Sim (Pré-preenchido) |
| `EVOLUTION_API_URL` | `https://api.educareapp.com.br` | ✅ Sim (Pré-preenchido) |
| `EVOLUTION_API_KEY` | `eff3ea025256694c10422fd0fc5ff169` | ✅ Sim (Pré-preenchido) |
| `EVOLUTION_INSTANCE_NAME` | `evolution` | ✅ Sim (Pré-preenchido) |

---

## 4. Nós do Workflow Explicados

### Estrutura do Fluxo

```
┌─────────────────────────┐
│ 1. Evolution Webhook    │  ← Recebe mensagem WhatsApp
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ 2. Extract WhatsApp Data│  ← Extrai phone e mensagem
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ 3. Search User by Phone │  ← GET /users/search
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ 4. User Exists Check    │  ← Verifica se usuário existe
└───┬──────────┬──────────┘
    │ SIM      │ NÃO
    │          │
    │    ┌─────▼──────────┐
    │    │ 5. Create User │  ← POST /users (novo usuário)
    │    └─────┬──────────┘
    │          │
    └──┬───┬───┘
       │   │
┌──────▼───▼──────────────┐
│ 6. Get Active Child     │  ← GET /users/by-phone/:phone/active-child
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ 7. Child Selected Check │  ← Verifica se há criança selecionada
└───┬──────────┬──────────┘
    │ SIM      │ NÃO
    │          │
    │    ┌─────▼────────────────┐
    │    │ 9. Send Select Child │  ← Pede para selecionar criança
    │    └────────────────────────┘
    │
┌───▼────────────────────┐
│ 8. Ask TitiNauta AI    │  ← POST /rag/external/ask
└──────────┬─────────────┘
           │
┌──────────▼──────────────┐
│ 10. Send WhatsApp       │  ← Evolution API (resposta)
│     Response            │
└─────────────────────────┘
```

---

## 5. Testando o Workflow

### 5.1 Teste Manual no n8n

1. Clique em **"Test"** (botão de play)
2. No webhook, clique em **"Send Test Data"**
3. Cole um payload de teste:

```json
{
  "data": {
    "key": {
      "remoteJid": "5598991801628@s.whatsapp.net"
    },
    "message": {
      "conversation": "Quando meu bebê deve começar a engatinhar?"
    },
    "pushName": "João Silva"
  }
}
```

### 5.2 Teste Real via WhatsApp

1. Configure o Evolution Webhook apontando para seu n8n
2. Envie uma mensagem via WhatsApp
3. Verifique se a resposta retorna corretamente

---

## 6. Verificação de Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| **"API key inválida"** | EDUCARE_API_KEY incorreta | Verifique se é `educare_external_api_key_2025` |
| **"Connection refused"** | EDUCARE_API_URL incorrea | Confirme URL do backend está acessível |
| **"User not found"** | Telefone em formato errado | Remove caracteres especiais, use apenas números |
| **"No active child"** | Usuário não selecionou criança | Mensagem pede para selecionar criança no app |
| **"Request timeout"** | TitiNauta levando muito tempo | Normal para primeiras requisições, aumentar timeout |

---

## 7. Customizações Futuras

### Adicionar Suporte a Quiz/Jornada

Substitua o nó "Ask TitiNauta AI" por um switch que detecte intenção:

```javascript
// Detecta se é pergunta ou quiz
if ($json.message.includes("quiz") || $json.message.includes("jornada")) {
  // GET /children/:childId/unanswered-questions
} else {
  // POST /rag/external/ask
}
```

### Adicionar Logs/Auditoria

Antes do nó de resposta final, adicione:

```javascript
POST /webhooks/log
{
  "user_phone": $json.phone,
  "message": $json.message,
  "response": $json.body.answer,
  "timestamp": new Date()
}
```

---

## 8. Suporte

### Documentação Completa
Veja `N8N_INTEGRATION_GUIDE.md` para:
- Descrição detalhada de cada endpoint
- Formatos de requisição/resposta
- Códigos de erro

### Teste de Conectividade
```bash
# Verifique se o backend está acessível
curl "https://API_URL/api/external/subscription-plans?api_key=educare_external_api_key_2025"

# Resposta esperada
{"success": true, "data": [...]}
```

---

## Variáveis de Ambiente - Resumo Rápido

```
EDUCARE_API_URL=https://seu-replit.replit.dev:3001
EDUCARE_API_KEY=educare_external_api_key_2025
EVOLUTION_API_URL=https://evolution.seu-dominio.com
EVOLUTION_API_KEY=sua-chave-evolution
EVOLUTION_INSTANCE_NAME=educare-whatsapp
```

**Status após configuração:**
- ✅ Webhook Evolution recebe mensagens
- ✅ n8n identifica/cria usuários automaticamente
- ✅ TitiNauta responde via RAG
- ✅ Respostas enviadas via WhatsApp
