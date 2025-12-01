# Educare+ - Diagnóstico Completo de Integrações

**Data do Diagnóstico:** 01 de Dezembro de 2025

---

## Sumário Executivo

Este documento apresenta uma análise completa do estado atual das integrações do Educare+ e as ações necessárias para produção.

### Status Geral das Integrações

| Integração | Status | Prioridade |
|------------|--------|------------|
| Banco de Dados PostgreSQL | ⚠️ Parcial - Tabelas faltando | P1 - Crítico |
| Stripe (Pagamentos) | ✅ Implementado | P2 - Verificar |
| n8n (Automação) | ❌ Não implementado | P3 - Desenvolver |
| WhatsApp Business API | ❌ Apenas UI stubs | P4 - Desenvolver |
| RAG (IA Contextual) | ❌ Não implementado | P5 - Futuro |

---

## 1. BANCO DE DADOS POSTGRESQL

### 1.1 Estado Atual

**Conexão:** Configurada via Sequelize ORM  
**Localização:** `educare-backend/src/config/database.js`

### 1.2 PROBLEMA CRÍTICO

A tabela `journey_bot_questions` **NÃO EXISTE** no banco de dados, mesmo tendo modelo definido.

```sql
-- Erro retornado:
ERROR: relation "journey_questions" does not exist
```

### 1.3 Modelos Definidos (Sequelize)

Arquivo: `educare-backend/src/models/index.js`

**Modelos Principais:**
- User, Profile, Child
- Team, TeamMember, License
- SubscriptionPlan, Subscription
- Quiz, Question, QuizQuestion, QuizSession, Answer
- Achievement, UserAchievement
- Journey, UserJourney
- ChatGroup, ChatMessage, ChatInvite
- JourneyBotSession, JourneyBotResponse, **JourneyBotQuestion**
- Activity

**Modelos Jornada 2.0:**
- JourneyV2, JourneyV2Week, JourneyV2Topic
- JourneyV2Quiz, JourneyV2Badge
- UserJourneyV2Progress, UserJourneyV2Badge

### 1.4 Ação Necessária

```bash
# Sincronizar tabelas com o banco (Sequelize)
cd educare-backend
node -e "const { sequelize } = require('./src/config/database'); sequelize.sync({ alter: true }).then(() => console.log('Sync complete'));"
```

---

## 2. STRIPE (PAGAMENTOS)

### 2.1 Estado Atual: ✅ IMPLEMENTADO

**Integração Replit:** `connection:conn_stripe_01KBCT0D7PTRK8SFTNAY2ABFK1` (Sandbox)

### 2.2 Secrets Configurados

- `STRIPE_WEBHOOK_SECRET` ✅ Existe

### 2.3 Arquivos de Implementação

| Arquivo | Descrição |
|---------|-----------|
| `educare-backend/src/routes/stripeRoutes.js` | Rotas de API |
| `educare-backend/src/services/stripeClient.js` | Cliente Stripe |
| `educare-backend/src/services/webhookHandlers.js` | Handlers de Webhook |

### 2.4 Endpoints Stripe Disponíveis

```
GET  /api/stripe/config              - Configuração pública
GET  /api/stripe/products            - Lista produtos
GET  /api/stripe/products-with-prices - Produtos com preços
GET  /api/stripe/prices              - Lista preços
GET  /api/stripe/products/:id/prices - Preços de produto
POST /api/stripe/checkout            - Criar sessão checkout [AUTH]
POST /api/stripe/customer-portal     - Portal do cliente [AUTH+OWNER]
GET  /api/stripe/subscription        - Status assinatura [AUTH]
POST /api/stripe/subscription/:id/cancel     - Cancelar [AUTH+OWNER]
POST /api/stripe/subscription/:id/resume     - Reativar [AUTH+OWNER]
POST /api/stripe/subscription/:id/change-plan - Trocar plano [AUTH+OWNER]
POST /api/stripe/seed-plans          - Seed dos planos [AUTH+OWNER]
GET  /api/stripe/test-webhook        - Testar webhook
POST /api/stripe/simulate-webhook    - Simular webhook
```

### 2.5 Eventos de Webhook Suportados

```javascript
// webhookHandlers.js - Eventos tratados:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed
- checkout.session.completed
```

### 2.6 Verificações Pendentes

1. [ ] Registrar webhook URL no Stripe Dashboard
2. [ ] Verificar se planos estão sincronizados
3. [ ] Testar fluxo completo de checkout
4. [ ] Validar portal do cliente

---

## 3. N8N (AUTOMAÇÃO DE WORKFLOWS)

### 3.1 Estado Atual: ❌ NÃO IMPLEMENTADO

**Referências no código:** 0 (zero)  
**Variáveis de ambiente:** Nenhuma configurada

### 3.2 Propósito Documentado (replit.md)

> "Orchestrates WhatsApp message ingestion, AI processing (OpenAI), conversation context management, conditional routing, response generation, and delivery."

### 3.3 Arquitetura Esperada

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WhatsApp API  │───▶│   n8n Workflow  │───▶│  Educare API    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │    OpenAI API   │
                       └─────────────────┘
```

### 3.4 Implementação Necessária

#### 3.4.1 No Backend Educare

```javascript
// Novo arquivo: educare-backend/src/routes/n8nWebhookRoutes.js
// Endpoints para receber callbacks do n8n:

POST /api/webhooks/n8n/message-received    - Mensagem recebida do WhatsApp
POST /api/webhooks/n8n/ai-response         - Resposta gerada pela IA
POST /api/webhooks/n8n/context-update      - Atualização de contexto
GET  /api/webhooks/n8n/user-context/:phone - Buscar contexto do usuário
```

#### 3.4.2 Variáveis de Ambiente Necessárias

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com
N8N_API_KEY=your_n8n_api_key
N8N_WEBHOOK_SECRET=your_webhook_secret
```

#### 3.4.3 Hosting do n8n

| Opção | Descrição | Custo Estimado |
|-------|-----------|----------------|
| n8n.cloud | Managed, fácil setup | $20-50/mês |
| Self-hosted VPS | Controle total | $5-20/mês + setup |
| Docker (Replit) | Não recomendado | N/A |

---

## 4. WHATSAPP BUSINESS API

### 4.1 Estado Atual: ❌ APENAS UI STUBS

### 4.2 Código Existente

**Frontend (apenas UI):**
- `src/components/whatsapp/WhatsAppChatContainer.tsx`
- Componentes de interface sem integração real

**Backend:**
- Nenhuma implementação de API WhatsApp

### 4.3 Integrações Replit Disponíveis

| Integração | Status | Descrição |
|------------|--------|-----------|
| Twilio | Disponível | SMS, voz, WhatsApp via Twilio |
| Meta Cloud API | Não disponível | Requer setup manual |

### 4.4 Implementação Necessária

#### Opção A: Twilio (Recomendado - Integração Replit)

```javascript
// Novo arquivo: educare-backend/src/services/twilioWhatsApp.js

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendWhatsAppMessage(to, message) {
  return client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
    body: message
  });
}
```

#### Opção B: Meta Cloud API (Setup Manual)

```javascript
// Novo arquivo: educare-backend/src/services/metaWhatsApp.js

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
```

### 4.5 Endpoints Necessários

```
POST /api/whatsapp/webhook         - Receber mensagens (webhook Meta/Twilio)
GET  /api/whatsapp/webhook         - Verificação do webhook
POST /api/whatsapp/send            - Enviar mensagem
POST /api/whatsapp/send-template   - Enviar template
GET  /api/whatsapp/conversations   - Listar conversas
```

### 4.6 Variáveis de Ambiente

**Para Twilio:**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Para Meta Cloud API:**
```env
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id
```

---

## 5. RAG (RETRIEVAL-AUGMENTED GENERATION)

### 5.1 Estado Atual: ❌ NÃO IMPLEMENTADO

**Referências no código:** 0 (zero)

### 5.2 OpenAI Status

**Secret:** `OPENAI_API_KEY` ✅ Disponível  
**Uso atual:** Apenas em `openaiService.js` (limitado)

### 5.3 Arquitetura RAG Proposta

```
┌─────────────────┐
│   Documentos    │
│  (Conteúdo Ed.) │
└────────┬────────┘
         │ Ingestão
         ▼
┌─────────────────┐    ┌─────────────────┐
│   Embeddings    │───▶│   Vector Store  │
│   (OpenAI)      │    │   (Postgres)    │
└─────────────────┘    └────────┬────────┘
                                │ Busca
         ┌──────────────────────┤
         │                      ▼
┌────────┴────────┐    ┌─────────────────┐
│   User Query    │───▶│    Retrieval    │
└─────────────────┘    └────────┬────────┘
                                │ Contexto
                                ▼
                       ┌─────────────────┐
                       │   OpenAI Chat   │
                       │  + Contexto RAG │
                       └─────────────────┘
```

### 5.4 Implementação Necessária (Futuro)

1. Extensão pgvector no PostgreSQL
2. Tabela de embeddings
3. Pipeline de ingestão de conteúdo
4. Serviço de retrieval
5. Integração com OpenAI Chat

---

## 6. ENDPOINTS DE API EXISTENTES

### 6.1 Autenticação (`/api/auth`)

```
POST /api/auth/register              - Registro
POST /api/auth/login                 - Login
GET  /api/auth/verify                - Verificar token [AUTH]
POST /api/auth/refresh-token         - Renovar token
POST /api/auth/forgot-password       - Esqueci senha
POST /api/auth/reset-password        - Resetar senha
POST /api/auth/logout                - Logout [AUTH]
POST /api/auth/change-password       - Trocar senha
POST /api/auth/verify-email          - Verificar email
POST /api/auth/resend-verification   - Reenviar verificação
POST /api/auth/google                - Login Google
POST /api/auth/google-one-tap        - Google One Tap
```

### 6.2 Perfis (`/api/profiles`)

```
GET  /api/profiles/                  - Listar perfis [ADMIN/OWNER]
GET  /api/profiles/me                - Meu perfil [AUTH]
GET  /api/profiles/:id               - Perfil por ID [AUTH]
PUT  /api/profiles/:id               - Atualizar perfil
PUT  /api/profiles/:id/upload-avatar - Upload avatar
```

### 6.3 Crianças (`/api/children`)

```
GET    /api/children/                - Minhas crianças [AUTH]
GET    /api/children/:id             - Criança por ID [AUTH]
POST   /api/children/                - Cadastrar criança
PUT    /api/children/:id             - Atualizar criança
DELETE /api/children/:id             - Remover criança [AUTH]
POST   /api/children/:id/professionals - Adicionar profissional
DELETE /api/children/:id/professionals/:profId - Remover profissional
POST   /api/children/:id/milestones  - Registrar marco
GET    /api/children/:id/development-notes - Notas de desenvolvimento [AUTH]
PUT    /api/children/:id/development-notes/:noteId - Atualizar nota
DELETE /api/children/:id/development-notes/:noteId - Remover nota
```

### 6.4 Jornada V2 (`/api/journey-v2`)

```
GET  /api/journey-v2/journeys                     - Listar jornadas
GET  /api/journey-v2/journeys/:id                 - Jornada por ID
GET  /api/journey-v2/journeys/:id/weeks           - Semanas da jornada
GET  /api/journey-v2/weeks/:id                    - Semana por ID
GET  /api/journey-v2/weeks/:weekId/topics         - Tópicos da semana
GET  /api/journey-v2/weeks/:weekId/quizzes        - Quizzes da semana
GET  /api/journey-v2/users/:userId/progress/:journeyId - Progresso [AUTH]
POST /api/journey-v2/users/:userId/weeks/:weekId/progress - Atualizar progresso [AUTH]
POST /api/journey-v2/users/:userId/badges         - Conceder badge [AUTH]
GET  /api/journey-v2/users/:userId/badges         - Badges do usuário [AUTH]
```

### 6.5 Journey Questions (`/api/journey-questions`)

```
GET  /api/journey-questions/                      - Listar perguntas [AUTH]
GET  /api/journey-questions/week/:weekNumber/quizzes - Quizzes da semana [AUTH]
GET  /api/journey-questions/:id                   - Pergunta por ID [AUTH]
```

### 6.6 Journey Bot (`/api/journey-bot`)

```
# Verificar implementação específica em journeyBotRoutes.js
```

### 6.7 Chat (`/api/chat`)

```
POST /api/chat/groups                    - Criar grupo [AUTH]
GET  /api/chat/groups                    - Listar grupos [AUTH]
GET  /api/chat/groups/:id                - Grupo por ID [AUTH]
GET  /api/chat/groups/:groupId/messages  - Mensagens do grupo [AUTH]
POST /api/chat/groups/:groupId/messages  - Enviar mensagem [AUTH]
GET  /api/chat/groups/:groupId/participants - Participantes [AUTH]
GET  /api/chat/admin/all-chats           - Todos os chats [OWNER]
```

### 6.8 Dashboard (`/api/dashboard`)

```
GET  /api/dashboard/users-by-role           - Usuários por papel [AUTH]
GET  /api/dashboard/subscriptions-by-status - Assinaturas por status [AUTH]
```

### 6.9 Admin (`/api/admin/*`)

```
# /api/admin/children
GET  /api/admin/children/           - Todas crianças [AUTH]
GET  /api/admin/children/stats      - Estatísticas globais [AUTH]
GET  /api/admin/children/:childId   - Detalhes criança [AUTH]

# /api/admin/journey-questions
# Rotas administrativas para gerenciar perguntas

# /api/admin/user-activities
GET  /api/admin/user-activities/                - Todos usuários com atividades [AUTH]
GET  /api/admin/user-activities/stats           - Estatísticas de atividades [AUTH]
GET  /api/admin/user-activities/:userId         - Atividades de usuário [AUTH]
GET  /api/admin/user-activities/child/:childId  - Atividades de criança [AUTH]
```

### 6.10 External API (`/api/external`)

```
# Verificar implementação específica em externalApiRoutes.js
```

### 6.11 Outros

```
# /api/quizzes - Gestão de quizzes
# /api/journeys - Jornadas v1
# /api/achievements - Conquistas
# /api/subscriptions - Assinaturas
# /api/subscription-plans - Planos
# /api/teams - Equipes
# /api/activities - Atividades
# /api/chat-invites - Convites de chat
# /api/team-invites - Convites de equipe
# /api/media-resources - Recursos de mídia
# /api/journey - TitiNauta moderno
```

---

## 7. PRÓXIMOS PASSOS

### Fase 1: Banco de Dados (Crítico)
1. [ ] Executar sync do Sequelize para criar tabelas faltantes
2. [ ] Verificar todas as migrations estão aplicadas
3. [ ] Popular dados iniciais (seed) para journey_bot_questions

### Fase 2: Stripe (Verificação)
1. [ ] Registrar webhook URL no Stripe Dashboard
2. [ ] Testar fluxo de checkout completo
3. [ ] Verificar sincronização de planos

### Fase 3: n8n (Desenvolvimento)
1. [ ] Escolher hosting (n8n.cloud recomendado)
2. [ ] Criar workflows de automação
3. [ ] Implementar endpoints de webhook no backend

### Fase 4: WhatsApp (Desenvolvimento)
1. [ ] Escolher provider (Twilio ou Meta Cloud API)
2. [ ] Configurar credenciais
3. [ ] Implementar serviço de mensagens
4. [ ] Integrar com n8n

### Fase 5: RAG (Futuro)
1. [ ] Ativar extensão pgvector
2. [ ] Implementar pipeline de embeddings
3. [ ] Criar serviço de retrieval
4. [ ] Integrar com assistente TitiNauta

---

## 8. VARIÁVEIS DE AMBIENTE

### Atuais

```env
# Configuradas
VITE_API_URL=https://...replit.dev:3001
OPENAI_API_KEY=***
STRIPE_WEBHOOK_SECRET=***
SESSION_SECRET=***
```

### Necessárias (Adicionar)

```env
# n8n
N8N_WEBHOOK_URL=
N8N_API_KEY=
N8N_WEBHOOK_SECRET=

# WhatsApp (escolher um)
# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# Ou Meta Cloud API
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=
```

---

## 9. ARQUIVOS IMPORTANTES

```
educare-backend/
├── src/
│   ├── config/
│   │   └── database.js              # Conexão PostgreSQL
│   ├── models/
│   │   ├── index.js                 # Associações Sequelize
│   │   ├── JourneyBotQuestion.js    # Modelo perguntas
│   │   └── *.js                     # Outros modelos
│   ├── routes/
│   │   ├── stripeRoutes.js          # API Stripe
│   │   ├── journeyQuestionsRoutes.js # API perguntas
│   │   ├── journeyV2Routes.js       # API Jornada 2.0
│   │   └── *.js                     # Outras rotas
│   ├── services/
│   │   ├── stripeClient.js          # Cliente Stripe
│   │   ├── webhookHandlers.js       # Handlers webhook
│   │   └── openaiService.js         # Serviço OpenAI
│   └── server.js                    # Entry point
└── package.json

src/
├── hooks/
│   ├── useTitiNautaProgress.ts      # Hook progresso
│   ├── useTitiNautaJourneyQuestions.ts # Hook perguntas
│   └── useTitiNautaWeekQuizzes.ts   # Hook quizzes
├── services/
│   └── journeyQuestionsService.ts   # Serviço frontend
└── pages/
    └── educare-app/
        └── TitiNautaJourney.tsx     # Página principal
```

---

*Documento gerado automaticamente - Educare+ Platform*
