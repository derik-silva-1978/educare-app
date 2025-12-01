# Educare+ Platform

## Overview
Educare+ is a digital platform for early childhood development and maternal health monitoring. It connects parents, caregivers, educators, and healthcare professionals to support child development through interactive assessments, personalized guidance, and collaborative care. The platform features an AI-powered assistant (TitiNauta), WhatsApp integration for remote communication, and multi-level SaaS subscription management.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## Recent Changes (December 2025)
- **External API 100% Complete**: All 13 endpoints validated and functional for n8n/WhatsApp integration
- **Bug Fix**: Corrected model reference from `JourneyQuestion` to `JourneyBotQuestion` in progress/quiz-responses endpoints
- **Database Compatibility**: Resolved type incompatibility (VARCHAR vs UUID) using separate queries instead of JOIN
- **Null Safety**: Added birth_date null handling to prevent NaN errors in age calculations
- **New Endpoint**: Added `/api/external/children/:childId/quiz-responses` for historical answer queries
- **Documentation**: Created comprehensive integration docs (n8n workflow, WhatsApp, ENV config)
- **EXTERNAL_API_KEY**: Configured in environment for API authentication
- **Cleanup**: Removed all obsolete TitiNauta components and the src/components/titinauta/ folder
- **Journey consolidation**: TitiNautaJourney (2.0) and WhatsAppJourneyBotPage are the only journey interfaces
- **Theme toggle**: Simplified to single-button toggle between dark/light modes
- **DevBadge component**: New component (src/components/ui/dev-badge.tsx) for marking incomplete modules
- **Sidebar Fix**: Updated role description display to show Proprietário/Administrador/Responsável/Profissional correctly

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

2. **n8n Workflow Implementation** ❌
   - Task: Create and test n8n workflow for WhatsApp integration
   - Files: `educare-backend/docs/n8n-workflow-template.json`, `educare-backend/docs/README_N8N_WORKFLOW.md`
   - Scope: Message ingestion → API calls → Response generation
   - Status: Documentation ready, implementation pending
   - Impact: Enables WhatsApp bot automation

3. **WhatsApp Provider Selection & Setup** ❌
   - Task: Choose and configure WhatsApp provider (Twilio recommended)
   - Options: 
     - **Twilio** (Recommended): Has Replit integration, simpler setup
     - **Meta Cloud API**: More features, complex setup
   - Env vars needed:
     - Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`
     - Meta: `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_VERIFY_TOKEN`
   - Status: Decision pending
   - Impact: Enables WhatsApp communication channel

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

### n8n Workflow (Documented)
- **Template**: `educare-backend/docs/n8n-workflow-template.json` ✅
- **Documentation**: `educare-backend/docs/README_N8N_WORKFLOW.md` ✅
- **Setup Guide**: `educare-backend/docs/N8N_BLUEPRINT_SETUP.md` ✅ **NEW**
- **Webhook Test**: https://n8neducare.whatscall.com.br/webhook-test/titnauta
- **Status**: Blueprint ready for import and deployment

### WhatsApp (Documented)
- **Documentation**: `educare-backend/docs/WHATSAPP_INTEGRATION.md`
- **Options**: Twilio (recommended) or Meta Cloud API
- **Status**: Awaiting provider selection

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
