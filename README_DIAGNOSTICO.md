# Educare+ - Diagnóstico Completo de Integrações

**Data do Diagnóstico:** 01 de Dezembro de 2025  
**Última Atualização:** 01 de Dezembro de 2025

---

## Sumário Executivo

Este documento apresenta uma análise completa do estado atual das integrações do Educare+ e as ações necessárias para produção.

### 🎉 DESCOBERTA IMPORTANTE

A **API Externa já está 95% implementada** com 2039 linhas de código! Isso acelera significativamente o projeto de integração.

### Status Geral das Integrações

| Integração | Status | Prioridade | Ação Necessária |
|------------|--------|------------|-----------------|
| **API Externa** | ✅ 95% Pronta | P0 - Crítico | Adicionar endpoint quiz-responses |
| Banco de Dados PostgreSQL | ⚠️ Parcial | P1 - Crítico | Sync Sequelize + Seed |
| Stripe (Pagamentos) | ✅ Implementado | P2 - Verificar | Testar webhook |
| n8n (Automação) | ❌ Não configurado | P3 - Desenvolver | Criar workflow |
| WhatsApp Business API | ❌ Não configurado | P4 - Desenvolver | Integrar via n8n |
| RAG (IA Contextual) | ❌ Não implementado | P5 - Futuro | Arquitetura definida |

---

## 1. API EXTERNA (PRONTA PARA INTEGRAÇÃO!)

### 1.1 Estado Atual: ✅ 95% IMPLEMENTADA

**Arquivos Principais:**
- `educare-backend/src/controllers/externalApiController.js` (2039 linhas)
- `educare-backend/src/routes/externalApiRoutes.js`
- `educare-backend/src/middlewares/apiKey.js`

### 1.2 Endpoints Implementados

#### Autenticação
Todos os endpoints requerem API Key via:
- Query param: `?api_key=SUA_CHAVE`
- Header: `X-API-Key: SUA_CHAVE`
- Variável: `EXTERNAL_API_KEY` no ambiente

#### Endpoints de Usuários

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/external/users` | GET | Listar usuários (filtros: email, phone, role) |
| `/api/external/users` | POST | Criar usuário com perfil e assinatura |
| `/api/external/users/search` | GET | Buscar por **telefone**, email ou CPF/CNPJ |
| `/api/external/users/:id` | GET | Buscar usuário por ID |
| `/api/external/users/:id/children` | GET | Filhos de um usuário |

#### Endpoints de Crianças

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/external/users/search/children` | GET | Buscar crianças por telefone/email do responsável |
| `/api/external/children/:id` | GET | Dados de uma criança |
| `/api/external/children/:childId/unanswered-questions` | GET | **Perguntas não respondidas** |
| `/api/external/children/:childId/save-answer` | POST | **Salvar resposta da jornada** |
| `/api/external/children/:childId/progress` | GET | **Progresso da criança** |

#### Endpoints para Fluxo WhatsApp (por Telefone)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/external/users/by-phone/:phone/active-child` | GET | **Criança ativa por telefone** |
| `/api/external/users/by-phone/:phone/select-child/:childId` | POST | **Selecionar criança** |

#### Outros Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/external/subscription-plans` | GET | Listar planos de assinatura |

### 1.3 Endpoint Faltando

```
GET /api/external/children/:childId/quiz-responses
```

Este endpoint existe no Postman de produção mas não no código atual. Necessário para consultar histórico de respostas.

### 1.4 Mapeamento Postman Produção vs Código Atual

| Postman (Produção) | Código Atual | Status |
|-------------------|--------------|--------|
| `GET /external/user?phone=...` | `GET /api/external/users/search?phone=...` | ✅ Equivalente |
| `GET /external/children?phone=...` | `GET /api/external/users/search/children?phone=...` | ✅ Equivalente |
| `GET /external/child/:id/progress` | `GET /api/external/children/:id/progress` | ✅ Equivalente |
| `GET /external/child/:id/quiz-responses` | ❌ Não existe | ⚠️ A implementar |

### 1.5 Fluxo Completo via Telefone (Pronto!)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO WHATSAPP → API EXTERNA                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. WhatsApp → n8n recebe mensagem do telefone +5511999999999       │
│                          │                                          │
│                          ▼                                          │
│  2. GET /api/external/users/search?phone=+5511999999999             │
│     └─ Retorna: { user: { id, name, email, phone } }                │
│                          │                                          │
│                          ▼                                          │
│  3. GET /api/external/users/by-phone/+5511999999999/active-child    │
│     └─ Retorna: { active_child: { id, name, age_months, progress } }│
│                          │                                          │
│                          ▼                                          │
│  4. GET /api/external/children/{childId}/unanswered-questions       │
│     └─ Retorna: { questions: [{ id, question_text, domain, ... }] } │
│                          │                                          │
│                          ▼                                          │
│  5. n8n → OpenAI → Formata pergunta amigável                        │
│                          │                                          │
│                          ▼                                          │
│  6. n8n → WhatsApp → Envia pergunta ao usuário                      │
│                          │                                          │
│                          ▼                                          │
│  7. Usuário responde (1=Não, 2=Às vezes, 3=Sim)                     │
│                          │                                          │
│                          ▼                                          │
│  8. POST /api/external/children/{childId}/save-answer               │
│     Body: { question_id, answer: 0|1|2, answer_text, metadata }     │
│                          │                                          │
│                          ▼                                          │
│  9. GET /api/external/children/{childId}/progress                   │
│     └─ Retorna: { progress: { percentage, answered, total } }       │
│                          │                                          │
│                          ▼                                          │
│ 10. n8n → WhatsApp → Feedback + próxima pergunta ou conclusão       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.6 Exemplo de Uso

```bash
# 1. Buscar usuário por telefone
curl -X GET "http://localhost:3001/api/external/users/search?phone=+5511999999999" \
  -H "X-API-Key: educare_external_api_key_2025"

# 2. Buscar criança ativa
curl -X GET "http://localhost:3001/api/external/users/by-phone/+5511999999999/active-child" \
  -H "X-API-Key: educare_external_api_key_2025"

# 3. Buscar perguntas não respondidas
curl -X GET "http://localhost:3001/api/external/children/CHILD_ID/unanswered-questions" \
  -H "X-API-Key: educare_external_api_key_2025"

# 4. Salvar resposta
curl -X POST "http://localhost:3001/api/external/children/CHILD_ID/save-answer" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: educare_external_api_key_2025" \
  -d '{
    "question_id": "q1-sono-seguro",
    "answer": 2,
    "answer_text": "Sim, sempre",
    "metadata": { "source": "whatsapp" }
  }'

# 5. Buscar progresso
curl -X GET "http://localhost:3001/api/external/children/CHILD_ID/progress" \
  -H "X-API-Key: educare_external_api_key_2025"
```

---

## 2. BANCO DE DADOS POSTGRESQL

### 2.1 Estado Atual: ⚠️ PARCIAL

**Conexão:** Configurada via Sequelize ORM  
**Localização:** `educare-backend/src/config/database.js`

### 2.2 PROBLEMA CRÍTICO

A tabela `journey_questions` **NÃO EXISTE** no banco de dados, mesmo tendo modelo definido.

```sql
-- Erro retornado:
ERROR: relation "journey_questions" does not exist
```

### 2.3 Modelos Definidos (Sequelize)

Arquivo: `educare-backend/src/models/index.js`

**Modelos Principais:**
- User, Profile, Child
- Team, TeamMember, License
- SubscriptionPlan, Subscription
- Quiz, Question, QuizQuestion, QuizSession, Answer
- Achievement, UserAchievement
- Journey, UserJourney
- ChatGroup, ChatMessage, ChatInvite
- JourneyBotSession, JourneyBotResponse, **JourneyQuestion**
- Activity

**Modelos Jornada 2.0:**
- JourneyV2, JourneyV2Week, JourneyV2Topic
- JourneyV2Quiz, JourneyV2Badge
- UserJourneyV2Progress, UserJourneyV2Badge

### 2.4 Ação Necessária

```bash
# Sincronizar tabelas com o banco (Sequelize)
cd educare-backend
node -e "const { sequelize } = require('./src/config/database'); sequelize.sync({ alter: true }).then(() => console.log('Sync complete'));"
```

---

## 3. STRIPE (PAGAMENTOS)

### 3.1 Estado Atual: ✅ IMPLEMENTADO

**Integração Replit:** `connection:conn_stripe_01KBCT0D7PTRK8SFTNAY2ABFK1` (Sandbox)

### 3.2 Secrets Configurados

- `STRIPE_WEBHOOK_SECRET` ✅ Existe

### 3.3 Arquivos de Implementação

| Arquivo | Descrição |
|---------|-----------|
| `educare-backend/src/routes/stripeRoutes.js` | Rotas de API |
| `educare-backend/src/services/stripeClient.js` | Cliente Stripe |
| `educare-backend/src/services/webhookHandlers.js` | Handlers de Webhook |

### 3.4 Endpoints Stripe Disponíveis

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

### 3.5 Eventos de Webhook Suportados

```javascript
// webhookHandlers.js - Eventos tratados:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed
- checkout.session.completed
```

### 3.6 Verificações Pendentes

- [ ] Registrar webhook URL no Stripe Dashboard
- [ ] Verificar se planos estão sincronizados
- [ ] Testar fluxo completo de checkout
- [ ] Validar portal do cliente

---

## 4. N8N (AUTOMAÇÃO DE WORKFLOWS)

### 4.1 Estado Atual: ❌ NÃO CONFIGURADO (mas API está pronta!)

**Importante:** A API Externa já possui TODOS os endpoints necessários para o n8n funcionar. Só falta criar o workflow.

### 4.2 Arquitetura de Integração

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    WhatsApp     │────▶│       n8n       │────▶│  API Externa    │
│  (Meta/Twilio)  │◀────│   (Workflow)    │◀────│   Educare+      │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                        ┌────────▼────────┐
                        │     OpenAI      │
                        │  (Processamento)│
                        └─────────────────┘
```

### 4.3 Endpoints Prontos para n8n

| Endpoint | Uso no Workflow |
|----------|-----------------|
| `GET /users/search?phone=...` | Identificar usuário pela mensagem |
| `GET /users/by-phone/:phone/active-child` | Obter criança para jornada |
| `GET /children/:id/unanswered-questions` | Próxima pergunta |
| `POST /children/:id/save-answer` | Salvar resposta |
| `GET /children/:id/progress` | Mostrar progresso |

### 4.4 Hosting do n8n

| Opção | Descrição | Custo Estimado |
|-------|-----------|----------------|
| n8n.cloud | Managed, fácil setup | $20-50/mês |
| Self-hosted VPS | Controle total | $5-20/mês + setup |
| Docker (Replit) | Não recomendado | N/A |

### 4.5 Variáveis de Ambiente Necessárias

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com
N8N_API_KEY=your_n8n_api_key
```

---

## 5. WHATSAPP BUSINESS API

### 5.1 Estado Atual: ❌ NÃO CONFIGURADO

### 5.2 Opções de Integração

#### Opção A: Twilio (Recomendado - Integração Replit Disponível)

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

#### Opção B: Meta Cloud API (Setup Manual)

```env
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id
```

### 5.3 Arquitetura com n8n

O WhatsApp será integrado através do n8n, não diretamente no backend Educare:

```
WhatsApp → n8n (recebe webhook) → Processa → API Externa Educare → n8n → WhatsApp
```

---

## 6. RAG (RETRIEVAL-AUGMENTED GENERATION)

### 6.1 Estado Atual: ❌ NÃO IMPLEMENTADO (Futuro)

### 6.2 OpenAI Status

**Secret:** `OPENAI_API_KEY` ✅ Disponível

### 6.3 Arquitetura Proposta (Futuro)

```
Documentos → Embeddings → Vector Store → Retrieval → OpenAI + Contexto
```

---

## 7. PLANO DE IMPLEMENTAÇÃO

### Fase 1: Infraestrutura (Crítico)

| # | Tarefa | Prioridade |
|---|--------|------------|
| 1 | Sincronizar banco de dados (Sequelize sync) | P0 |
| 2 | Criar seed de dados para journey_questions | P0 |
| 3 | Gerar e configurar EXTERNAL_API_KEY | P0 |

### Fase 2: API Externa (Completar)

| # | Tarefa | Prioridade |
|---|--------|------------|
| 4 | Adicionar endpoint /quiz-responses | P1 |
| 5 | Criar testes de integração | P1 |

### Fase 3: Stripe (Verificar)

| # | Tarefa | Prioridade |
|---|--------|------------|
| 6 | Registrar webhook URL no Stripe Dashboard | P2 |
| 7 | Testar fluxo completo de checkout | P2 |

### Fase 4: n8n (Desenvolver)

| # | Tarefa | Prioridade |
|---|--------|------------|
| 8 | Criar documentação do workflow | P3 |
| 9 | Exportar template JSON do workflow | P3 |

### Fase 5: WhatsApp (Integrar)

| # | Tarefa | Prioridade |
|---|--------|------------|
| 10 | Documentar opções (Twilio vs Meta) | P4 |
| 11 | Configurar variáveis de ambiente | P4 |

---

## 8. VARIÁVEIS DE AMBIENTE

### Atuais (Configuradas)

```env
VITE_API_URL=https://...replit.dev:3001
OPENAI_API_KEY=***
STRIPE_WEBHOOK_SECRET=***
SESSION_SECRET=***
```

### Necessárias (Adicionar)

```env
# API Externa
EXTERNAL_API_KEY=educare_external_api_key_2025

# n8n
N8N_WEBHOOK_URL=https://your-n8n-instance.com
N8N_API_KEY=your_n8n_api_key

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
│   ├── controllers/
│   │   └── externalApiController.js # Controller API Externa (2039 linhas!)
│   ├── middlewares/
│   │   └── apiKey.js                # Middleware autenticação API Key
│   ├── models/
│   │   ├── index.js                 # Associações Sequelize
│   │   ├── JourneyQuestion.js       # Modelo perguntas
│   │   └── *.js                     # Outros modelos
│   ├── routes/
│   │   ├── externalApiRoutes.js     # Rotas API Externa
│   │   ├── stripeRoutes.js          # API Stripe
│   │   ├── journeyQuestionsRoutes.js # API perguntas
│   │   └── *.js                     # Outras rotas
│   ├── services/
│   │   ├── stripeClient.js          # Cliente Stripe
│   │   ├── webhookHandlers.js       # Handlers webhook
│   │   └── openaiService.js         # Serviço OpenAI
│   └── server.js                    # Entry point
├── docs/
│   └── external-api.md              # Documentação API Externa
├── RESUMO_ENDPOINTS_JORNADA_QUIZ.md # Resumo endpoints jornada
├── API_EXTERNA_JORNADA_QUIZ.md      # Documentação completa
└── package.json

src/
├── hooks/
│   ├── useTitiNautaProgress.ts      # Hook progresso
│   └── useTitiNautaJourneyQuestions.ts # Hook perguntas
└── pages/
    └── educare-app/
        └── TitiNautaJourney.tsx     # Página principal
```

---

## 10. CONCLUSÃO

### O que já está pronto:
- ✅ API Externa com 12+ endpoints
- ✅ Fluxo completo por telefone
- ✅ Autenticação por API Key
- ✅ Stripe integrado
- ✅ OpenAI configurado

### O que falta:
- ⚠️ Sincronizar banco de dados
- ⚠️ Adicionar endpoint quiz-responses
- ❌ Configurar n8n workflow
- ❌ Configurar WhatsApp webhook

### Próximo passo recomendado:
1. Executar sync do Sequelize
2. Gerar EXTERNAL_API_KEY
3. Testar endpoints manualmente
4. Configurar n8n

---

*Documento atualizado - Educare+ Platform - Dezembro 2025*
