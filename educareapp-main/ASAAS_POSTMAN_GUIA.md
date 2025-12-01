# 📦 Guia da Coleção Postman - API Asaas

Coleção completa para integração com a API do Asaas (Gateway de Pagamentos)

---

## 📋 Conteúdo da Coleção

### **1. Clientes** (5 endpoints)
- ✅ Criar Cliente
- ✅ Listar Clientes
- ✅ Buscar Cliente por ID
- ✅ Atualizar Cliente
- ✅ Deletar Cliente

### **2. Cobranças** (8 endpoints)
- ✅ Criar Cobrança (Boleto)
- ✅ Criar Cobrança (PIX)
- ✅ Criar Cobrança (Cartão de Crédito)
- ✅ Listar Cobranças
- ✅ Buscar Cobrança por ID
- ✅ Atualizar Cobrança
- ✅ Deletar Cobrança
- ✅ Confirmar Recebimento em Dinheiro
- ✅ Estornar Cobrança

### **3. Assinaturas** (6 endpoints)
- ✅ Criar Assinatura
- ✅ Listar Assinaturas
- ✅ Buscar Assinatura por ID
- ✅ Atualizar Assinatura
- ✅ Deletar Assinatura
- ✅ Listar Cobranças da Assinatura

### **4. PIX** (2 endpoints)
- ✅ Gerar QR Code PIX
- ✅ Buscar Chaves PIX

### **5. Webhooks** (5 endpoints)
- ✅ Criar Webhook
- ✅ Listar Webhooks
- ✅ Buscar Webhook por ID
- ✅ Atualizar Webhook
- ✅ Deletar Webhook

### **6. Transferências** (2 endpoints)
- ✅ Criar Transferência
- ✅ Listar Transferências

### **7. Saldo e Extrato** (2 endpoints)
- ✅ Consultar Saldo
- ✅ Extrato Financeiro

---

## 🚀 Como Usar

### **Passo 1: Importar no Postman**

1. Abra o **Postman**
2. Clique em **Import**
3. Selecione o arquivo `Asaas_API.postman_collection.json`
4. Clique em **Import**

### **Passo 2: Configurar Variáveis**

Após importar, configure as variáveis de ambiente:

#### **Variáveis Disponíveis:**

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `asaas_base_url` | `https://www.asaas.com/api/v3` | URL da API (produção) |
| `asaas_api_key` | `sua_api_key_aqui` | Sua chave de API |

#### **Para Ambiente de Testes (Sandbox):**

| Variável | Valor |
|----------|-------|
| `asaas_base_url` | `https://sandbox.asaas.com/api/v3` |
| `asaas_api_key` | Chave do sandbox |

### **Passo 3: Obter API Key**

#### **Produção:**
1. Acesse https://www.asaas.com
2. Faça login na sua conta
3. Vá em **Configurações** → **Integrações** → **API Key**
4. Copie sua chave de API

#### **Sandbox (Testes):**
1. Crie uma conta em https://sandbox.asaas.com
2. Faça login
3. Vá em **Configurações** → **Integrações** → **API Key**
4. Copie a chave do sandbox

---

## 📖 Exemplos de Uso

### **1. Criar um Cliente**

```http
POST {{asaas_base_url}}/customers
Header: access_token: {{asaas_api_key}}
Content-Type: application/json

Body:
{
  "name": "João da Silva",
  "email": "joao@example.com",
  "phone": "11999999999",
  "mobilePhone": "11999999999",
  "cpfCnpj": "12345678909",
  "postalCode": "01310-100",
  "address": "Av. Paulista",
  "addressNumber": "1000",
  "externalReference": "user_123"
}
```

**Resposta:**
```json
{
  "object": "customer",
  "id": "cus_000000000000",
  "name": "João da Silva",
  "email": "joao@example.com",
  "cpfCnpj": "12345678909"
}
```

---

### **2. Criar Cobrança via PIX**

```http
POST {{asaas_base_url}}/payments
Header: access_token: {{asaas_api_key}}

Body:
{
  "customer": "cus_000000000000",
  "billingType": "PIX",
  "value": 50.00,
  "dueDate": "2025-12-31",
  "description": "Mensalidade Educare"
}
```

**Resposta:**
```json
{
  "object": "payment",
  "id": "pay_000000000000",
  "customer": "cus_000000000000",
  "billingType": "PIX",
  "value": 50.00,
  "status": "PENDING",
  "invoiceUrl": "https://..."
}
```

---

### **3. Gerar QR Code PIX**

```http
GET {{asaas_base_url}}/payments/pay_000000000000/pixQrCode
Header: access_token: {{asaas_api_key}}
```

**Resposta:**
```json
{
  "encodedImage": "iVBORw0KGgoAAAANSUhEUgAA...",
  "payload": "00020126580014br.gov.bcb.pix...",
  "expirationDate": "2025-12-31"
}
```

---

### **4. Criar Assinatura Recorrente**

```http
POST {{asaas_base_url}}/subscriptions
Header: access_token: {{asaas_api_key}}

Body:
{
  "customer": "cus_000000000000",
  "billingType": "BOLETO",
  "value": 100.00,
  "nextDueDate": "2025-12-01",
  "cycle": "MONTHLY",
  "description": "Assinatura Mensal Educare"
}
```

**Resposta:**
```json
{
  "object": "subscription",
  "id": "sub_000000000000",
  "customer": "cus_000000000000",
  "value": 100.00,
  "cycle": "MONTHLY",
  "status": "ACTIVE"
}
```

---

### **5. Criar Webhook**

```http
POST {{asaas_base_url}}/webhooks
Header: access_token: {{asaas_api_key}}

Body:
{
  "name": "Webhook Educare",
  "url": "https://api.educare.whatscall.com.br/api/webhooks/asaas",
  "email": "dev@educare.com.br",
  "enabled": true,
  "events": [
    "PAYMENT_CREATED",
    "PAYMENT_CONFIRMED",
    "PAYMENT_RECEIVED"
  ]
}
```

---

## 🔐 Autenticação

Todos os endpoints requerem autenticação via **API Key** no header:

```http
access_token: sua_api_key_aqui
```

A API Key é configurada na variável `{{asaas_api_key}}` do Postman.

---

## 📊 Tipos de Cobrança (billingType)

| Tipo | Descrição |
|------|-----------|
| `BOLETO` | Boleto bancário |
| `PIX` | Pagamento via PIX |
| `CREDIT_CARD` | Cartão de crédito |
| `DEBIT_CARD` | Cartão de débito |
| `UNDEFINED` | Não definido |

---

## 📅 Ciclos de Assinatura (cycle)

| Ciclo | Descrição |
|-------|-----------|
| `WEEKLY` | Semanal |
| `BIWEEKLY` | Quinzenal |
| `MONTHLY` | Mensal |
| `QUARTERLY` | Trimestral |
| `SEMIANNUALLY` | Semestral |
| `YEARLY` | Anual |

---

## 📌 Status de Pagamento

| Status | Descrição |
|--------|-----------|
| `PENDING` | Aguardando pagamento |
| `RECEIVED` | Recebido |
| `CONFIRMED` | Confirmado |
| `OVERDUE` | Vencido |
| `REFUNDED` | Estornado |
| `RECEIVED_IN_CASH` | Recebido em dinheiro |
| `REFUND_REQUESTED` | Estorno solicitado |

---

## 🎯 Eventos de Webhook

Eventos disponíveis para webhooks:

- `PAYMENT_CREATED` - Cobrança criada
- `PAYMENT_UPDATED` - Cobrança atualizada
- `PAYMENT_CONFIRMED` - Pagamento confirmado
- `PAYMENT_RECEIVED` - Pagamento recebido
- `PAYMENT_OVERDUE` - Cobrança vencida
- `PAYMENT_DELETED` - Cobrança removida
- `PAYMENT_REFUNDED` - Pagamento estornado
- `PAYMENT_RECEIVED_IN_CASH` - Recebido em dinheiro

---

## 🧪 Testando no Sandbox

### **1. Criar conta no Sandbox**
```
https://sandbox.asaas.com
```

### **2. Configurar variáveis**
```
asaas_base_url: https://sandbox.asaas.com/api/v3
asaas_api_key: [sua chave do sandbox]
```

### **3. Dados de teste**

**Cartão de Crédito (Aprovado):**
```
Número: 5162306219378829
Validade: 12/2028
CVV: 123
```

**Cartão de Crédito (Recusado):**
```
Número: 5162306219378837
Validade: 12/2028
CVV: 123
```

---

## 📚 Documentação Oficial

- **API Docs:** https://docs.asaas.com
- **Portal:** https://www.asaas.com
- **Sandbox:** https://sandbox.asaas.com
- **Suporte:** suporte@asaas.com

---

## ⚠️ Observações Importantes

### **Segurança**
- ⚠️ **NUNCA** compartilhe sua API Key
- ⚠️ **NUNCA** commite a API Key no Git
- ✅ Use variáveis de ambiente
- ✅ Use HTTPS em produção

### **Limites de Taxa**
- Sandbox: 100 requisições/minuto
- Produção: Consulte sua conta

### **Taxas**
- Boleto: R$ 3,49 por cobrança
- PIX: 0,99% por transação
- Cartão de Crédito: 2,99% + R$ 0,49
- Consulte: https://www.asaas.com/precos

---

## 🎉 Pronto!

Sua coleção Postman está configurada e pronta para uso!

**Dúvidas?** Consulte a [documentação oficial](https://docs.asaas.com) ou entre em contato com o suporte.
