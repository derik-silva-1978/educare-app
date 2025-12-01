# Guia Prático de Teste - Integração Stripe

## 🎯 Objetivo
Testar o fluxo completo de checkout do Stripe no Educare+, da seleção de plano até o processamento de webhook.

---

## 📋 Pré-requisitos

1. **Frontend rodando**: http://localhost:5000
2. **Backend rodando**: http://localhost:3001
3. **Usuário com role "owner"** - Necessário para acessar página de assinaturas
4. **Stripe Account** - Para configurar webhooks

---

## ✅ Passo 1: Criar Usuário com Role "Owner"

### Via API

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@educare.test",
    "password": "Owner123!@",
    "name": "Proprietário Teste",
    "phone": "11987654321"
  }'
```

**Resposta esperada:**
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "email": "owner@educare.test",
    "name": "Proprietário Teste",
    "role": "user"  // Será "user" por padrão
  },
  "token": "eyJhbGc..."
}
```

### Atualizar Role para "Owner" (via SQL)

Você precisa atualizar manualmente no banco de dados para testar a funcionalidade completa:

```sql
UPDATE users 
SET role = 'owner' 
WHERE email = 'owner@educare.test';
```

---

## 🔓 Passo 2: Fazer Login como Owner

### No Frontend

1. Acesse http://localhost:5000
2. Clique em **"Entrar"** ou **"Meu App"**
3. Preencha os dados:
   - **Email**: `owner@educare.test`
   - **Senha**: `Owner123!@`
4. Clique em **"Entrar"**

**Telas esperadas após login:**
- Dashboard do usuário
- Menu com opções de navegação
- Acesso às páginas protegidas

---

## 💳 Passo 3: Acessar Página de Assinaturas

Após fazer login como owner:

1. Navegue para: http://localhost:5000/educare-app/subscription
2. **Tela esperada**: Listagem de 4 planos
   - Plano Gratuito (Grátis)
   - Plano Básico (R$ 29,90/mês)
   - Plano Premium (R$ 59,90/mês)
   - Plano Profissional (R$ 149,90/mês)

3. Cada plano deve ter botão **"Assinar Plano"**

---

## 🛒 Passo 4: Testar Checkout do Stripe

### Opção A: Checkout Teste (sem configurar webhook)

1. Na página de assinaturas, clique em **"Assinar Plano"** (qualquer um)
2. Você será redirecionado para Stripe Checkout
3. **Use cartão de teste**:
   - Número: `4242 4242 4242 4242`
   - Expiração: `12/25` (qualquer data futura)
   - CVC: `123`
   - Email: qualquer email
4. Clique em **"Pagar"** ou **"Subscribe"**
5. **Resultado esperado**: 
   - Redirecionado para `/educare-app/subscription/success`
   - Mensagem de sucesso

### Opção B: Testar Falha de Pagamento

Use um dos cartões de falha:
- `4000 0000 0000 0002` - Cartão recusado
- `4000 0000 0000 0069` - Cartão expirado
- `4000 0000 0000 0127` - CVC incorreto

---

## 🔔 Passo 5: Simular Webhook Localmente

Sem configurar no Stripe Dashboard, você pode simular um webhook:

```bash
curl -X POST http://localhost:3001/api/stripe/simulate-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "customer.subscription.created",
    "customerId": "cus_test123",
    "subscriptionId": "sub_test123",
    "planId": "price_1SZasf2ektcrjgYMzNektZH5"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Webhook simulado processado com sucesso",
  "event": "customer.subscription.created"
}
```

---

## 🧪 Passo 6: Verificar Webhook Configurado

Verifique se o webhook está pronto para produção:

```bash
curl http://localhost:3001/api/stripe/test-webhook
```

**Resposta esperada:**
```json
{
  "success": true,
  "status": "WEBHOOK_CONFIGURED",
  "webhookEndpoint": "/api/stripe/webhook",
  "methods": ["POST"],
  "expectedEvents": [
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.paid",
    "invoice.payment_failed",
    "checkout.session.completed"
  ]
}
```

---

## 🔧 Passo 7: Configurar Webhook no Stripe Dashboard

Após testar localmente, configure no Stripe:

### Via Stripe Dashboard

1. Vá para https://dashboard.stripe.com
2. **Developers** → **Webhooks**
3. Clique em **"Add endpoint"**
4. **Endpoint URL**: 
   - Teste: `http://localhost:3001/api/stripe/webhook` (via Stripe CLI)
   - Produção: `https://seu-dominio.com/api/stripe/webhook`
5. **Select events**:
   - ✅ customer.subscription.created
   - ✅ customer.subscription.updated
   - ✅ customer.subscription.deleted
   - ✅ invoice.paid
   - ✅ invoice.payment_failed
   - ✅ checkout.session.completed
6. Clique em **"Add endpoint"**
7. Na página do endpoint, clique em **"Reveal"** para copiar **Signing secret**
8. Defina como variável de ambiente:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## 📊 Passo 8: Monitorar Webhooks

### Via Stripe Dashboard

1. **Developers** → **Webhooks**
2. Clique no seu endpoint
3. Veja **"Recent deliveries"** para todos os eventos enviados
4. Clique em um evento para ver:
   - Request enviado
   - Response recebido
   - Status (success/failed)
   - Timestamps

### Via Backend Logs

```bash
# Ver logs do backend
tail -f /tmp/logs/Backend_*.log | grep -i webhook
```

---

## ✅ Teste Completo - Checklist

- [ ] Usuário owner criado e com role "owner"
- [ ] Login como owner funcionando
- [ ] Página de assinaturas carregando 4 planos
- [ ] Checkout Stripe abrindo corretamente
- [ ] Cartão de teste 4242... sendo aceito
- [ ] Redirecionamento para /success funcionando
- [ ] Webhook test-webhook respondendo
- [ ] Webhook configurado no Stripe Dashboard
- [ ] Recent deliveries mostrando eventos
- [ ] Banco de dados atualizado após checkout

---

## 🐛 Troubleshooting

### Problema: "Não consigo acessar /subscription"
**Solução**: Confirme que está logado como usuário "owner"
```bash
# Verificar role do usuário
SELECT email, role FROM users WHERE email = 'owner@educare.test';
```

### Problema: "Checkout não abre"
**Solução**: Verificar se Stripe publishable key está configurada
```bash
curl http://localhost:3001/api/stripe/config
```

### Problema: "Webhook não recebe eventos"
**Solução**: Usar Stripe CLI para forçar teste
```bash
# Instalar: brew install stripe
stripe login
stripe listen --forward-to http://localhost:3001/api/stripe/webhook
stripe trigger customer.subscription.created
```

### Problema: "Erro 401 em webhook"
**Solução**: Verificar se STRIPE_WEBHOOK_SECRET está correto
```bash
# Deve conter o secret do Stripe
echo $STRIPE_WEBHOOK_SECRET
```

---

## 🚀 Próximas Etapas

1. **Deploy para Produção**
   - Atualizar STRIPE_WEBHOOK_SECRET em produção
   - Atualizar domain em redirect URLs

2. **Monitorar**
   - Acompanhar webhook deliveries diariamente
   - Configurar alertas no Stripe Dashboard

3. **Melhorias**
   - Implementar retry de webhooks
   - Adicionar confirmação de email após assinatura
   - Dashboard de analytics de assinatura
