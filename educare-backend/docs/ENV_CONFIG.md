# Configuração de Variáveis de Ambiente - Educare+

Este documento lista todas as variáveis de ambiente necessárias para o funcionamento completo do Educare+.

---

## Variáveis Obrigatórias

### Backend Core

```env
# Porta do servidor
PORT=3001

# Ambiente (development, production, test)
NODE_ENV=development

# Secret para JWT
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_here

# URL do Frontend (para CORS)
FRONTEND_URL=http://localhost:5000
```

### Banco de Dados

```env
# PostgreSQL (Escolher uma opção)

# Opção 1: URL completa
DATABASE_URL=postgresql://user:password@host:5432/database

# Opção 2: Variáveis separadas
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=educare
```

---

## API Externa

```env
# Chave de autenticação para API Externa
# CRÍTICO: Use uma chave forte em produção
EXTERNAL_API_KEY=educare_external_api_key_2025
```

---

## Stripe (Pagamentos)

```env
# Chaves de API Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_...

# ID do Preço (para testes)
STRIPE_PRICE_ID=price_...
```

---

## OpenAI (IA)

```env
# Chave de API OpenAI
OPENAI_API_KEY=sk-...

# Modelo padrão (opcional)
OPENAI_MODEL=gpt-4o-mini
```

---

## n8n (Automação)

```env
# URL da instância n8n
N8N_WEBHOOK_URL=https://your-n8n-instance.com

# API Key do n8n (para gerenciamento)
N8N_API_KEY=your_n8n_api_key
```

---

## WhatsApp

### Opção 1: Twilio

```env
# Credenciais Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...

# Número do WhatsApp (formato whatsapp:+...)
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Opção 2: Meta Cloud API

```env
# Token de Acesso
WHATSAPP_ACCESS_TOKEN=EAAGz...

# IDs
WHATSAPP_PHONE_NUMBER_ID=123456789...
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321...

# Token de verificação do Webhook
WHATSAPP_VERIFY_TOKEN=seu_token_secreto
```

---

## Email (Futuro)

```env
# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
SMTP_FROM=noreply@educareapp.com
```

---

## Storage (Futuro)

```env
# AWS S3 ou compatível
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=sa-east-1
AWS_S3_BUCKET=educare-files
```

---

## Arquivo .env Completo (Template)

Copie e cole no seu arquivo `.env`:

```env
# ==================================
# EDUCARE+ ENVIRONMENT CONFIGURATION
# ==================================

# ---- CORE ----
PORT=3001
NODE_ENV=development
JWT_SECRET=change_this_to_a_secure_random_string
SESSION_SECRET=change_this_to_another_secure_string
FRONTEND_URL=http://localhost:5000

# ---- DATABASE ----
DATABASE_URL=postgresql://user:password@host:5432/educare
# Or use individual variables:
# PGHOST=localhost
# PGPORT=5432
# PGUSER=postgres
# PGPASSWORD=your_password
# PGDATABASE=educare

# ---- API EXTERNA ----
EXTERNAL_API_KEY=educare_external_api_key_2025

# ---- STRIPE ----
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ---- OPENAI ----
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# ---- N8N ----
N8N_WEBHOOK_URL=https://your-n8n-instance.com
N8N_API_KEY=your_n8n_api_key

# ---- WHATSAPP (Choose one) ----

# Option 1: Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Option 2: Meta Cloud API
# WHATSAPP_ACCESS_TOKEN=EAAGz...
# WHATSAPP_PHONE_NUMBER_ID=123456789...
# WHATSAPP_BUSINESS_ACCOUNT_ID=987654321...
# WHATSAPP_VERIFY_TOKEN=seu_token_secreto

# ---- EMAIL (Future) ----
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=your_email@example.com
# SMTP_PASSWORD=your_email_password
# SMTP_FROM=noreply@educareapp.com

# ---- STORAGE (Future) ----
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# AWS_REGION=sa-east-1
# AWS_S3_BUCKET=educare-files
```

---

## Checklist de Segurança

- [ ] Nunca commitar o arquivo `.env` no Git
- [ ] Usar `.env.example` como template sem valores reais
- [ ] Rotacionar secrets periodicamente
- [ ] Usar secrets diferentes para dev/staging/prod
- [ ] Armazenar secrets em gerenciador seguro (Vault, AWS Secrets Manager)
- [ ] Validar que todas as variáveis críticas estão definidas no startup

---

## Variáveis por Ambiente

### Desenvolvimento

```env
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...
# Usar sandbox/test credentials
```

### Staging

```env
NODE_ENV=staging
# Usar test credentials com dados mais realistas
```

### Produção

```env
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
# Usar live credentials
# Configurar SSL/TLS
# Habilitar logs de auditoria
```

---

## Verificação de Variáveis

Script para verificar variáveis obrigatórias:

```javascript
// scripts/check-env.js
const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'SESSION_SECRET',
  'EXTERNAL_API_KEY',
  'OPENAI_API_KEY'
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('Missing required environment variables:');
  missing.forEach(key => console.error(`  - ${key}`));
  process.exit(1);
}

console.log('All required environment variables are set!');
```

---

*Documentação Educare+ - Dezembro 2025*
