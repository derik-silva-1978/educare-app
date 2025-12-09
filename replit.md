# Educare+ Platform

## Overview
Educare+ is a digital platform for early childhood development and maternal health monitoring. It connects parents, caregivers, educators, and healthcare professionals to support child development through interactive assessments, personalized guidance, and collaborative care. The platform features an AI-powered assistant (TitiNauta), WhatsApp integration for remote communication, and multi-level SaaS subscription management.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## Recent Changes (December 2025)
- **FASE 7-UPGRADE Completa (December 9)**: Testes end-to-end + Migração assistida + 4 endpoints admin
- **FASE 6-UPGRADE Completa (December 9)**: Métricas RAG automáticas, 6 endpoints REST, health check
- **FASE 5-UPGRADE Completa (December 8)**: RAG com seleção inteligente de bases segmentadas
- **FASE 4-UPGRADE Completa (December 8)**: Dual write com inferência automática de categoria
- **FASE 3-UPGRADE Completa (December 8)**: 3 tabelas segmentadas (kb_baby, kb_mother, kb_professional)
- **Database Migration (December 9)**: Migrado para novo servidor PostgreSQL (86.48.30.74, user: educareapp, database: educareapp)
- **n8n Workflow v2.0**: Criado `n8n-educare-v2.json` - versão otimizada com 28 nós
- **External API 100% Complete**: All 13 endpoints validated and functional for n8n/WhatsApp integration

## Development Status (December 2025)

### Completed (100%)
✅ **API Externa** - All 13 endpoints implemented and tested
✅ **Frontend UI** - React components with Radix UI + Tailwind
✅ **Authentication** - JWT-based with role-based access control
✅ **Stripe Integration** - Webhook configured and operational
✅ **OpenAI Integration** - API key configured
✅ **Database Models** - Sequelize ORM with 20+ models defined
✅ **Role-based Sidebar** - Proper access levels for Owner/Admin/Professional/Parent

## RAG Segmented Architecture (PHASES 1-7 ✅ COMPLETE)

### Fase 1 - Auditoria ✅
- Análise completa do RAG atual (11 seções)
- Identificação de gaps: single knowledge base, sem segmentação por user type
- Recomendação: arquitetura segmentada (kb_baby, kb_mother, kb_professional)

### Fase 2 - Arquitetura ✅
- Design de 3 tabelas segmentadas + routing inteligente
- Estratégia dual write + fallback automático
- Feature flags para rollback seguro
- Zero regression com sistema legado

### Fase 3 - Tabelas & Models ✅
- 3 tabelas criadas: kb_baby, kb_mother, kb_professional
- Models Sequelize + repositórios
- Índices para performance
- Suporte a OpenAI File Search (file_search_id)

### Fase 4 - Dual Ingestion ✅
- Método insertDualWithCategory() com inferência automática
- Classificação por campos: age_range/domain → baby, specialty → mother/professional
- Rastreamento via migrated_from para auditoria
- Feature flag ENABLE_SEGMENTED_KB para controle

### Fase 5 - RAG Integration ✅
- selectKnowledgeDocuments() com seletor inteligente
- ask() e askWithBabyId() com contexto de módulo
- Fallback automático quando base primária vazia
- Compatibilidade reversa 100%

### Fase 6 - Métricas ✅
- ragMetricsService.js com 6 métodos públicos
- 6 endpoints REST: /api/metrics/rag/*
- Health check com status (healthy/degraded/unhealthy)
- Tracking: success_rate, response_time, fallback_rate, KB usage

### Fase 7 - Testes & Migração ✅
- Suite de testes end-to-end (19 testes)
- migrationService.js: analyze, migrate, validate, rollback
- 4 endpoints admin: /api/admin/migration/*
- Documentação completa (FASE7_UPGRADE_TESTS_MIGRATION.md)

### Priority 2 - Important (Verification & Testing)
4. **Stripe Webhook Verification** ⚠️
   - Task: Verify webhook URL registration in Stripe Dashboard
   - Files: `educare-backend/src/services/webhookHandlers.js`
   - Scope: Test payment events flow (checkout, subscription, invoice)
   - Status: Implementation done, testing pending
   - Impact: Ensures subscription billing works correctly

5. **n8n Workflow Implementation** ✅ **READY v2.0**
   - Task: Import optimized v2 blueprint in n8n
   - Files: 
     - `educare-backend/docs/n8n-educare-v2.json` ✅ (28 nós, otimizado e seguro)
     - `educare-backend/docs/N8N_BLUEPRINT_SETUP.md` ✅ (Guia atualizado para v2)
   - Status: Blueprint v2 pronto com todas as branches conectadas
   - Next Step: Importar no n8n → Configurar credentials → Ativar

6. **Production Deployment Checklist** ⚠️
   - Task: Prepare deployment configuration
   - Scope: Environment variables, database migration, SSL setup
   - Files: `deploy_config_tool` configuration needed
   - Status: Pending
   - Impact: Required for going live

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
