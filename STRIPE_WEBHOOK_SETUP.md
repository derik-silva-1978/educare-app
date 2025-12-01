# Configuração do Webhook Stripe - Guia Prático

## 🎯 Objetivo
Conectar o Stripe ao sistema Educare+ para processar eventos de assinatura em tempo real.

---

## 📋 Passo a Passo

### 1️⃣ Acessar o Stripe Dashboard

1. Vá para https://dashboard.stripe.com
2. Faça login com sua conta Stripe
3. No menu esquerdo, clique em **Developers** → **Webhooks**

### 2️⃣ Adicionar novo Endpoint

1. Clique no botão **Add endpoint** (ou **+ Add an endpoint**)
2. Insira a URL do webhook:
   ```
   https://seu-dominio.com/api/stripe/webhook
   ```
   
   **Exemplos:**
   - Produção: `https://educare.whatscall.com.br/api/stripe/webhook`
   - Desenvolvimento: `https://seu-replit-domain.com/api/stripe/webhook`
   - Teste local (usando Stripe CLI): `http://localhost:3001/api/stripe/webhook`

### 3️⃣ Selecionar Eventos

Após adicionar a URL, você verá a opção de selecionar eventos. Marque:

- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.paid`
- ✅ `invoice.payment_failed`
- ✅ `checkout.session.completed`

### 4️⃣ Copiar Signing Secret

1. Após criar o endpoint, clique no endpoint que acabou de criar
2. Procure por **Signing secret**
3. Clique em **Reveal** para mostrar a chave
4. Copie a chave (começa com `whsec_`)

### 5️⃣ Configurar a Chave no Sistema

A chave já está configurada como `STRIPE_WEBHOOK_SECRET` no Replit.

**Para confirmar:**
```bash
curl -H "Authorization: Bearer seu-token" \
  http://localhost:3001/health/detailed
```

Você deve ver:
```json
{
  "services": {
    "integrations": {
      "stripe": {
        "configured": true,
        "status": "configured"
      }
    }
  }
}
```

---

## 🧪 Testando com Stripe CLI (Opcional)

### Instalar Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl https://files.stripe.com/stripe-cli/install.sh | sh

# Windows
choco install stripe
```

### Usar Stripe CLI para Testes
```bash
# 1. Fazer login
stripe login

# 2. Iniciar listener local
stripe listen --forward-to http://localhost:3001/api/stripe/webhook

# 3. Você receberá uma chave, configure como STRIPE_WEBHOOK_SECRET
```

---

## 📊 Eventos Processados

O sistema processa automaticamente:

| Evento | Ação |
|--------|------|
| `customer.subscription.created` | Cria assinatura no banco de dados |
| `customer.subscription.updated` | Atualiza status e datas da assinatura |
| `customer.subscription.deleted` | Marca assinatura como cancelada |
| `invoice.paid` | Atualiza status para "ativo" |
| `invoice.payment_failed` | Marca assinatura como "vencida" |
| `checkout.session.completed` | Cria cliente Stripe se necessário |

---

## ✅ Verificar Webhook

### 1. Via Dashboard Stripe
- Vá em **Developers** → **Webhooks**
- Clique no seu endpoint
- Procure por **Recent deliveries**
- Você verá todos os webhooks enviados

### 2. Via Endpoint de Status
```bash
curl http://localhost:3001/health/detailed
```

---

## 🚀 Testar Fluxo Completo

### 1. Criar Assinatura de Teste

```bash
# 1. Fazer login no sistema
# 2. Ir para /educare-app/subscription
# 3. Clicar em "Assinar Plano"
# 4. Usar cartão de teste: 4242 4242 4242 4242
# 5. Expiração: 12/25 (qualquer data futura)
# 6. CVC: 123
```

### 2. Monitorar Eventos

- Abra **Developers** → **Webhooks** no Stripe Dashboard
- Clique no seu endpoint
- Veja **Recent deliveries** - devem aparecer eventos

### 3. Verificar Banco de Dados

```bash
# Verificar assinatura criada
SELECT * FROM subscriptions WHERE user_id = 'seu-user-id';
```

---

## 🐛 Troubleshooting

### Webhook não está recebendo eventos

**Problema:** Nenhum evento aparece no Stripe Dashboard

**Solução:**
1. Verificar se URL é acessível externamente (use [webhook.site](https://webhook.site) para testar)
2. Confirmar se `STRIPE_WEBHOOK_SECRET` está correto
3. Verificar logs do backend: `curl http://localhost:3001/health`

### Erro 401: Webhook validation failed

**Problema:** Assinatura não valida no backend

**Solução:**
1. Confirmar que `STRIPE_WEBHOOK_SECRET` está exatamente igual ao do Stripe
2. Reiniciar backend após alterar secret
3. Verificar que webhook está sendo recebido como Buffer (não JSON parseado)

### Erro 404 em redirect

**Problema:** Após checkout, erro 404 na URL

**Solução:**
- URLs de redirecionamento já estão configuradas para `/educare-app/subscription/success|cancel`
- Verificar que frontend tem essas rotas definidas em `App.tsx`

---

## 📞 Suporte

Para debugar eventos:
1. Habilitar logs verbose no backend
2. Verificar `/tmp/logs/Backend_*.log`
3. Procurar por "Webhook" nos logs
