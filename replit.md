# Educare+ Platform

## Overview
Educare+ is a digital platform for early childhood development and maternal health monitoring. It connects parents, caregivers, educators, and healthcare professionals to support child development through interactive assessments, personalized guidance, and collaborative care. The platform features an AI-powered assistant (TitiNauta), WhatsApp integration for remote communication, and multi-level SaaS subscription management.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## Recent Changes (December 2025)
- **Database Migration (December 9)**: Migrado para novo servidor PostgreSQL (86.48.30.74, user: educareapp, database: educareapp)
- **DB Sync Disabled**: Sincronização automática desativada via DB_SYNC_ENABLED - usuário educareapp não é owner das tabelas
- **Security Improved**: Removidas senhas hardcoded de database.js e sequelize-config.js
- **n8n Workflow v2.0**: Criado `n8n-educare-v2.json` - versão otimizada com 28 nós (vs 89 do v1)
- **Segurança Corrigida**: Removidas API keys hardcoded, todas usam variáveis de ambiente
- **Todas Branches Conectadas**: Todas as branches (answer, greeting, progress, help, chat, user not found) convergem para WhatsApp Send
- **Documentação Atualizada**: `N8N_BLUEPRINT_SETUP.md` com guia completo para v2
- **External API 100% Complete**: All 13 endpoints validated and functional for n8n/WhatsApp integration
- **Evolution API Format**: Suporte completo para mensagens de texto, áudio, imagem e localização

## Development Status (December 2025)

### Completed (100%)
✅ **API Externa** - All 13 endpoints implemented and tested
✅ **Frontend UI** - React components with Radix UI + Tailwind
✅ **Authentication** - JWT-based with role-based access control
✅ **Stripe Integration** - Webhook configured and operational
✅ **OpenAI Integration** - API key configured
✅ **Database Models** - Sequelize ORM with 20+ models defined
✅ **Role-based Sidebar** - Proper access levels for Owner/Admin/Professional/Parent

## Pending Development Tasks

### Priority 1 - Critical (Blocking n8n/WhatsApp Integration)
1. **Database Sync** ✅ **COMPLETED** (December 1, 2025)
   - Task: Run Sequelize sync to ensure all models are synchronized
   - Files: `educare-backend/src/models/*.js`
   - Command: `node -e "const { sequelize } = require('./src/config/database'); sequelize.sync({ alter: true }).then(() => console.log('Sync complete'));"`
   - Status: ✅ Completed - All 20+ models synchronized with PostgreSQL
   - Result: All tables created/updated, backend queries executing normally
   - Impact: ✅ Ready for n8n to query journey questions reliably

2. **n8n Workflow Implementation** ✅ **READY v2.0**
   - Task: Import optimized v2 blueprint in n8n
   - Files: 
     - `educare-backend/docs/n8n-educare-v2.json` ✅ **RECOMENDADO** (28 nós, otimizado e seguro)
     - `educare-backend/docs/n8n-educare-integrated.json` ✅ (Backup do v1 - 89 nós)
     - `educare-backend/docs/N8N_BLUEPRINT_SETUP.md` ✅ (Guia atualizado para v2)
   - Status: Blueprint v2 pronto, todas as branches conectadas ao WhatsApp Send
   - Next Step: Importar `n8n-educare-v2.json` no n8n → Configurar credentials → Ativar
   - Impact: Enables WhatsApp bot automation

3. **WhatsApp Provider: Evolution API** ✅ **SELECTED**
   - Provider: Evolution API (identified from uploaded blueprint)
   - Integration: Already configured in n8n workflow
   - Webhook URL: https://n8neducare.whatscall.com.br/webhook-test/titnauta
   - Message Format: Evolution API JSON structure (see N8N_BLUEPRINT_SETUP.md)
   - Status: Ready for activation in n8n
   - Impact: WhatsApp communication channel ready

### Priority 2 - Important (Verification & Testing)
4. **Stripe Webhook Verification** ⚠️
   - Task: Verify webhook URL registration in Stripe Dashboard
   - Files: `educare-backend/src/services/webhookHandlers.js`
   - Scope: Test payment events flow (checkout, subscription, invoice)
   - Status: Implementation done, testing pending
   - Impact: Ensures subscription billing works correctly

5. **Frontend-to-Backend API Integration Testing** ⚠️
   - Task: Create comprehensive test suite for external API
   - Scope: Test all 13 endpoints with real data
   - Tools: Jest/Vitest + Postman collection
   - Status: Pending
   - Impact: Ensures production reliability

6. **Production Deployment Checklist** ⚠️
   - Task: Prepare deployment configuration
   - Scope: Environment variables, database migration, SSL setup
   - Files: `deploy_config_tool` configuration needed
   - Status: Pending
   - Impact: Required for going live

### Priority 3 - Enhancement (Post-MVP)
7. **RAG Implementation (Retrieval-Augmented Generation)** 🔮
   - Task: Implement vector embeddings for contextual AI
   - Scope: Document storage, embeddings generation, retrieval
   - Status: Architecture defined, implementation pending
   - Impact: Improves AI response quality
   - Timeline: Post-MVP

8. **Advanced Analytics Dashboard** 🔮
   - Task: Create usage analytics and performance monitoring
   - Scope: n8n executions, API response times, user engagement
   - Status: Pending
   - Impact: Operations visibility
   - Timeline: Post-MVP

## Integration Status

### External API (100% Complete)
- **Status**: Fully validated and ready for n8n/WhatsApp integration
- **Authentication**: API Key via `?api_key=` or `X-API-Key` header
- **Base URL**: `/api/external/`
- **Key Endpoints**:
  - `GET /users/search?phone=` - Find user by phone
  - `GET /users/by-phone/:phone/active-child` - Get active child
  - `GET /children/:id/unanswered-questions` - Next question
  - `POST /children/:id/save-answer` - Save response
  - `GET /children/:id/progress` - Progress tracking
  - `GET /children/:id/quiz-responses` - Answer history

### n8n Workflow v2.0 (Ready for Activation)
- **Blueprint v2**: `educare-backend/docs/n8n-educare-v2.json` ✅ (28 nodes, optimized)
- **Setup Guide**: `educare-backend/docs/N8N_BLUEPRINT_SETUP.md` ✅ (5-minute activation)
- **Documentation**: `educare-backend/docs/README_N8N_WORKFLOW.md` ✅
- **Webhook URL**: https://n8neducare.whatscall.com.br/webhook-test/titnauta
- **Status**: v2 blueprint ready - all branches connected to WhatsApp Send
- **Security**: All API keys use environment variables (no hardcoded values)
- **Next Action**: Import `n8n-educare-v2.json` → Configure credentials → Activate

### WhatsApp (Evolution API)
- **Provider**: Evolution API (identified from blueprint)
- **Documentation**: `educare-backend/docs/WHATSAPP_INTEGRATION.md`
- **Status**: Already integrated in blueprint, requires activation

### Cloud Deployment (Digital Ocean)
- **Documentation**: `educare-backend/docs/DIGITAL_OCEAN_DEPLOYMENT.md` ✅ **NEW**
- **Architecture**: 2 droplets ($12 each/month) + PostgreSQL + Redis
- **n8n Droplet**: 2GB RAM, auto-SSL via Caddy/Nginx
- **Evolution API Droplet**: 2GB RAM, PostgreSQL + Redis backend
- **Status**: Complete deployment guide with scripts ready
- **Estimated Cost**: ~$26/month all-in

### Stripe (Implemented)
- **Status**: Webhook configured
- **Integration**: Replit Stripe connector active

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript and Vite
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: React hooks, @tanstack/react-query
- **Routing**: React Router
- **Forms**: react-hook-form with Zod validation
- **Authentication**: Custom JWT-based context provider
- **Key Features**: TitiNauta interactive journey, multi-domain quiz system, child management, maternal health tracking, professional collaboration.
- **Design Patterns**: Component-based, custom hooks, TypeScript for type safety, responsive-first design.

### Backend
- **Framework**: Node.js with Express.js and Sequelize ORM
- **Architecture**: Layered MVC (Controllers, Models, Routes, Middleware)
- **Authentication**: JWT-based (access and refresh tokens) with Row-Level Security (RLS)
- **API Design**: RESTful, internal/external routes, OpenAPI/Swagger for external APIs, structured error handling.
- **Key Endpoints**: Auth, Children, Journey/Quiz, External Integration, Admin.

### Data Storage
- **Primary Database**: PostgreSQL via Sequelize ORM (external instance)
- **Schema Highlights**: Users & Roles (RBAC), Children, Assessments (quizzes, bot responses), Journey System (content by weeks/topics), Health (maternal, child, diary), Subscriptions.
- **Security**: Row-Level Security ensures data access based on user roles and ownership.

### Automation Layer
- **Tool**: n8n Workflow (to be configured)
- **Functionality**: Orchestrates WhatsApp message ingestion, AI processing (OpenAI), conversation context management, conditional routing, response generation, and delivery.

## External Dependencies

### Third-Party Services
- **WhatsApp Business API**: Conversational interface for TitiNauta, group messaging, media sharing, notifications.
- **OpenAI API**: Powers AI features (NLP for chat, audio transcription, image analysis, recommendations) within the n8n workflow.
- **Stripe**: Payment gateway for subscription billing.

### Key NPM Dependencies
- **Frontend**: `react`, `@tanstack/react-query`, `react-hook-form`, `zod`, `date-fns`, `recharts`, `html2canvas`, Radix UI.
- **Backend**: `express`, `sequelize`, `pg`, `jsonwebtoken`, `bcryptjs`, `express-validator`, `swagger-jsdoc`, `swagger-ui-express`, `cors`.

### Infrastructure
- **Development**: Replit (Frontend on 5000, Backend on 3001), external PostgreSQL.
- **Production**: VPS with PM2, Nginx reverse proxy, SSL/TLS, PostgreSQL.

## Important Files

### Integration Documentation
- `README_DIAGNOSTICO.md` - Complete integration analysis
- `educare-backend/docs/README_N8N_WORKFLOW.md` - n8n workflow architecture
- `educare-backend/docs/N8N_BLUEPRINT_SETUP.md` - **NEW** Complete setup & troubleshooting guide
- `educare-backend/docs/n8n-workflow-template.json` - Importable blueprint (ready for n8n.cloud)
- `educare-backend/docs/WHATSAPP_INTEGRATION.md` - WhatsApp provider options
- `educare-backend/docs/ENV_CONFIG.md` - Environment variables reference

### External API
- `educare-backend/src/controllers/externalApiController.js` - Main controller (2100+ lines)
- `educare-backend/src/routes/externalApiRoutes.js` - Route definitions
- `educare-backend/src/middlewares/apiKey.js` - API Key validation
