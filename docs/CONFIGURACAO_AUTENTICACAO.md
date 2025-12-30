# Configuração do Sistema de Autenticação - Educare+

Este documento explica como configurar completamente o sistema de autenticação, incluindo cadastro, login, recuperação de senha e envio de emails.

---

## Diagnóstico Atual (30/12/2025)

### ✅ O que está funcionando:
- Conexão com banco de dados externo (86.48.30.74)
- Cadastro de novos usuários
- Login com email/senha
- Login com telefone (senha temporária)
- Geração de tokens JWT
- Reset de senha (lógica implementada)
- Verificação de email/telefone já existentes

### ❌ O que precisa ser configurado:
| Variável | Status | Função |
|----------|--------|--------|
| `EMAIL_WEBHOOK` | **NÃO CONFIGURADA** | Envio de emails (reset de senha, confirmações) |
| `FRONTEND_URL` | **NÃO CONFIGURADA** | URLs corretas nos emails |
| `SMS_WEBHOOK` | Verificar | Envio de SMS para verificação por telefone |

---

## Variáveis de Ambiente Necessárias

### 1. EMAIL_WEBHOOK (Obrigatório para emails)

O sistema usa um webhook externo (n8n, Zapier, Make, etc) para enviar emails.

```env
# URL do webhook que receberá os dados do email
EMAIL_WEBHOOK=https://seu-n8n.com/webhook/email
```

**Payload enviado ao webhook:**
```json
{
  "email": "destinatario@email.com",
  "subject": "Assunto do email",
  "message": "<html>Conteúdo HTML do email</html>"
}
```

### 2. FRONTEND_URL (Obrigatório para links)

URL base do frontend para gerar links corretos nos emails.

```env
# URL do frontend em produção
FRONTEND_URL=https://seu-dominio.com

# Ou para desenvolvimento
FRONTEND_URL=https://1d35ed6a-d635-41d2-8d11-7db8db84ce29-00-28ylqytrll200.picard.replit.dev
```

### 3. SMS_WEBHOOK (Opcional - para SMS)

Para envio de SMS de verificação por telefone:

```env
SMS_WEBHOOK=https://seu-n8n.com/webhook/sms
```

---

## Fluxos de Autenticação

### 1. Cadastro com Email

```
Usuário preenche formulário
    ↓
Backend verifica se email/telefone já existem
    ↓
Se já existe → Retorna erro "E-mail já está em uso"
    ↓
Se não existe → Cria usuário com status='active'
    ↓
Cria perfil do usuário
    ↓
Cria assinatura (plano gratuito ou selecionado)
    ↓
Retorna token JWT
```

**Nota:** Atualmente os usuários são criados diretamente como `active` sem necessidade de confirmação de email.

### 2. Login com Email

```
Usuário informa email + senha
    ↓
Backend busca usuário por email
    ↓
Verifica senha com bcrypt
    ↓
Se OK → Gera token JWT
    ↓
Atualiza last_login
    ↓
Retorna token + dados do usuário
```

### 3. Esqueci Minha Senha

```
Usuário informa email
    ↓
Backend busca usuário por email
    ↓
Gera token aleatório (crypto.randomBytes)
    ↓
Salva token + expiração (1 hora) no usuário
    ↓
Envia email com link (EMAIL_WEBHOOK)
    ↓
Link: {FRONTEND_URL}/educare-app/auth/reset-password?token={token}
```

**Rota no frontend:** `/educare-app/auth/reset-password`

### 4. Redefinir Senha

```
Usuário clica no link do email
    ↓
Frontend carrega página de reset com token na URL
    ↓
Usuário digita nova senha
    ↓
Backend valida token + expiração
    ↓
Atualiza senha (com hash bcrypt)
    ↓
Limpa token
    ↓
Retorna sucesso
```

---

## Como Configurar o Webhook de Email

### Opção 1: n8n (Recomendado)

1. Crie um workflow no n8n com trigger "Webhook"
2. Configure o nó de "Send Email" (Gmail, SMTP, SendGrid, etc)
3. Copie a URL do webhook para a variável `EMAIL_WEBHOOK`

**Exemplo de workflow n8n:**
```
[Webhook] → [Send Email]
  ↓
  Recebe: { email, subject, message }
  ↓
  Envia email
```

### Opção 2: SendGrid (Direto)

Se preferir integração direta com SendGrid, será necessário modificar o `emailSender.js`:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, body) => {
  const msg = {
    to,
    from: 'noreply@educareapp.com',
    subject,
    html: body
  };
  await sgMail.send(msg);
};
```

### Opção 3: Nodemailer (SMTP)

Para enviar direto via SMTP:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, body) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html: body
  });
};
```

---

## Troubleshooting

### Problema: "E-mail já está em uso"
**Solução:** O email já está cadastrado. Use "Esqueci minha senha" para recuperar acesso.

### Problema: Senha incorreta no login
**Solução:** A senha pode ter sido definida em um cadastro anterior. Use "Esqueci minha senha".

### Problema: Email de reset não chega
**Verificar:**
1. `EMAIL_WEBHOOK` está configurado?
2. Webhook está funcionando?
3. Email está na pasta de spam?

**Como testar:**
```bash
cd educare-backend
node -e "
const { sendEmail } = require('./src/utils/emailSender');
sendEmail('teste@email.com', 'Teste', '<h1>Teste</h1>')
  .then(console.log)
  .catch(console.error);
"
```

### Problema: Link de reset aponta para localhost
**Solução:** Configure `FRONTEND_URL` com a URL correta do frontend.

---

## Endpoints de Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Cadastro de novo usuário |
| POST | `/api/auth/login` | Login com email/senha |
| POST | `/api/auth/logout` | Logout (invalida sessão) |
| GET | `/api/auth/me` | Dados do usuário autenticado |
| POST | `/api/auth/refresh-token` | Renovar token JWT |
| POST | `/api/auth/forgot-password` | Solicitar reset de senha |
| POST | `/api/auth/reset-password` | Redefinir senha com token |
| POST | `/api/auth/login-phone` | Enviar senha temporária por SMS |

---

## Verificação de Saúde

O endpoint `/api/health` mostra o status das configurações:

```json
{
  "email": {
    "configured": true,
    "webhookUrl": "configured"
  },
  "frontendUrl": "https://...",
  "database": "connected"
}
```

---

## Checklist de Configuração

- [ ] `EMAIL_WEBHOOK` - URL do webhook para envio de emails
- [ ] `FRONTEND_URL` - URL do frontend em produção
- [ ] `JWT_SECRET` - Chave secreta para tokens JWT
- [ ] `SESSION_SECRET` - Chave secreta para sessões
- [ ] Testar envio de email de reset
- [ ] Testar fluxo completo de "Esqueci minha senha"
- [ ] Verificar que links nos emails funcionam

---

## Arquivos Relevantes

- **Backend:**
  - `src/controllers/authController.js` - Lógica de autenticação
  - `src/utils/emailSender.js` - Envio de emails via webhook
  - `src/routes/authRoutes.js` - Rotas de autenticação
  - `src/routes/healthRoutes.js` - Endpoint de saúde

- **Frontend:**
  - `src/components/educare-app/auth/EducareLoginForm.tsx` - Formulário de login
  - `src/components/educare-app/auth/EducareRegisterForm.tsx` - Formulário de cadastro
  - `src/components/educare-app/auth/ResetPasswordForm.tsx` - Reset de senha
  - `src/providers/CustomAuthProvider.tsx` - Provider de autenticação
