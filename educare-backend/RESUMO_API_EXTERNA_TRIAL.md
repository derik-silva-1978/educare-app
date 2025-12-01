# API Externa - Suporte a Assinaturas Trial

**Data:** 09/10/2025  
**Versão:** 1.1  
**Atualização:** Adicionado suporte a assinaturas trial

## ✅ O que foi implementado

### Novos Parâmetros no Endpoint POST /api/external/users

1. **`subscription_status`** (string, opcional)
   - Valores: `active` ou `trial`
   - Padrão: `active`
   - Define o tipo de assinatura a ser criada

2. **`trial_days`** (integer, opcional)
   - Quantidade de dias do período de trial
   - Usado apenas quando `subscription_status = "trial"`
   - Se não informado, usa o valor padrão do plano (`subscription_plans.trial_days`)
   - Fallback: 7 dias

## 📊 Lógica de Cálculo de Datas

### Assinatura Ativa
```javascript
// Data de término baseada no billing_cycle do plano
if (billing_cycle === 'monthly') {
  end_date = start_date + 1 mês
} else if (billing_cycle === 'yearly') {
  end_date = start_date + 1 ano
} else if (billing_cycle === 'quarterly') {
  end_date = start_date + 3 meses
} else if (billing_cycle === 'semester') {
  end_date = start_date + 6 meses
}
```

### Assinatura Trial
```javascript
// Data de término baseada em trial_days
trial_days = req.body.trial_days || plan.trial_days || 7
end_date = start_date + trial_days (dias)
```

## 🎯 Casos de Uso

### Caso 1: Venda Direta (Assinatura Ativa)
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "plan_id": "550e8400-e29b-41d4-a716-446655440000",
  "subscription_status": "active"
}
```
**Resultado:** Assinatura ativa por 1 mês (se plano for mensal)

### Caso 2: Trial Customizado (14 dias)
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha456",
  "plan_id": "550e8400-e29b-41d4-a716-446655440000",
  "subscription_status": "trial",
  "trial_days": 14
}
```
**Resultado:** Assinatura trial por 14 dias

### Caso 3: Trial Padrão do Plano
```json
{
  "name": "Pedro Costa",
  "email": "pedro@example.com",
  "password": "senha789",
  "plan_id": "550e8400-e29b-41d4-a716-446655440000",
  "subscription_status": "trial"
}
```
**Resultado:** Assinatura trial pelo período definido no plano (ex: 7 dias)

### Caso 4: Sem Plano (Apenas Usuário)
```json
{
  "name": "Ana Lima",
  "email": "ana@example.com",
  "password": "senha012"
}
```
**Resultado:** Usuário criado sem assinatura

## 📋 Estrutura da Resposta

### Assinatura Ativa
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "profile": { ... },
    "subscription": {
      "id": "...",
      "plan_id": "...",
      "plan_name": "Plano Premium",
      "status": "active",
      "start_date": "2025-10-09T20:00:00.000Z",
      "end_date": "2025-11-09T20:00:00.000Z",
      "next_billing_date": "2025-11-09T20:00:00.000Z",
      "auto_renew": true,
      "trial_days": null
    }
  }
}
```

### Assinatura Trial
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "profile": { ... },
    "subscription": {
      "id": "...",
      "plan_id": "...",
      "plan_name": "Plano Premium",
      "status": "trial",
      "start_date": "2025-10-09T20:00:00.000Z",
      "end_date": "2025-10-16T20:00:00.000Z",
      "next_billing_date": "2025-10-16T20:00:00.000Z",
      "auto_renew": true,
      "trial_days": 7
    }
  }
}
```

## 🗄️ Dados Salvos no Banco

### Tabela: `subscriptions`

| Campo | Valor (Active) | Valor (Trial) |
|-------|----------------|---------------|
| `status` | `active` | `trial` |
| `start_date` | Data atual | Data atual |
| `end_date` | start + billing_cycle | start + trial_days |
| `last_billing_date` | Data atual | Data atual |
| `next_billing_date` | end_date | end_date |
| `auto_renew` | `true` | `true` |
| `payment_method` | `external` | `external` |
| `payment_details` | `{ external_id, created_via }` | `{ external_id, trial_days, created_via }` |
| `usage_stats` | metadata | metadata |

## 🔄 Fluxo de Conversão Trial → Active

### Opção 1: Atualização Manual
```bash
# Endpoint futuro (a ser implementado)
PUT /api/external/subscriptions/{id}
{
  "status": "active"
}
```

### Opção 2: Job Automático
```javascript
// Cron job que roda diariamente
async function convertExpiredTrials() {
  const expiredTrials = await Subscription.findAll({
    where: {
      status: 'trial',
      end_date: { [Op.lte]: new Date() }
    }
  });
  
  for (const subscription of expiredTrials) {
    // Verificar se há pagamento confirmado
    const hasPayment = await checkPayment(subscription.id);
    
    if (hasPayment) {
      // Converter para active
      await subscription.update({
        status: 'active',
        end_date: calculateNewEndDate(subscription.planId)
      });
    } else {
      // Cancelar assinatura
      await subscription.update({
        status: 'canceled',
        canceled_at: new Date()
      });
    }
  }
}
```

## 🧪 Testes

### Teste 1: Criar Assinatura Ativa
```bash
curl -X POST http://localhost:3001/api/external/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: educare_external_api_key_2025" \
  -d '{
    "name": "Teste Active",
    "email": "teste.active@example.com",
    "password": "senha123",
    "plan_id": "PLAN_ID_AQUI",
    "subscription_status": "active"
  }'
```

### Teste 2: Criar Assinatura Trial (7 dias)
```bash
curl -X POST http://localhost:3001/api/external/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: educare_external_api_key_2025" \
  -d '{
    "name": "Teste Trial 7",
    "email": "teste.trial7@example.com",
    "password": "senha123",
    "plan_id": "PLAN_ID_AQUI",
    "subscription_status": "trial",
    "trial_days": 7
  }'
```

### Teste 3: Criar Assinatura Trial (Padrão do Plano)
```bash
curl -X POST http://localhost:3001/api/external/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: educare_external_api_key_2025" \
  -d '{
    "name": "Teste Trial Default",
    "email": "teste.trial.default@example.com",
    "password": "senha123",
    "plan_id": "PLAN_ID_AQUI",
    "subscription_status": "trial"
  }'
```

### Verificar Assinatura Criada
```bash
curl -X GET "http://localhost:3001/api/external/users?email=teste.trial7@example.com" \
  -H "X-API-Key: educare_external_api_key_2025"
```

## 📝 Checklist de Implementação

- [x] Adicionar parâmetros `subscription_status` e `trial_days`
- [x] Implementar lógica de cálculo de datas para trial
- [x] Salvar `trial_days` em `payment_details`
- [x] Atualizar documentação Swagger
- [x] Atualizar documentação markdown
- [x] Criar exemplos de uso
- [ ] Testar com dados reais
- [ ] Implementar endpoint de conversão trial → active
- [ ] Criar job para expiração de trials
- [ ] Implementar webhook de notificação de trial expirando

## 🚀 Próximos Passos

1. **Endpoint de Atualização de Assinatura**
   - `PUT /api/external/subscriptions/{id}`
   - Permitir converter trial em active
   - Permitir cancelar assinatura

2. **Webhook de Notificação**
   - Notificar sistema externo quando trial expirar
   - Notificar quando assinatura for cancelada

3. **Dashboard de Assinaturas**
   - Visualizar assinaturas trial expirando
   - Relatório de conversão trial → active

4. **Email Automático**
   - Email de boas-vindas ao trial
   - Email 3 dias antes do trial expirar
   - Email de conversão para assinatura paga

---

**Desenvolvedor:** Cascade AI  
**Última Atualização:** 09/10/2025  
**Status:** ✅ Implementado e pronto para testes
