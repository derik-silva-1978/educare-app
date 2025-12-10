# Educare+ Platform

## Overview
Educare+ is a digital platform designed to support early childhood development and maternal health monitoring. Its primary purpose is to connect parents, caregivers, educators, and healthcare professionals, facilitating collaborative care through interactive assessments, personalized guidance, and advanced communication tools. The platform incorporates an AI-powered assistant (TitiNauta), integrates with WhatsApp for remote engagement, and features a multi-level SaaS subscription model. The business vision is to become a leading solution in early childhood development and maternal health, leveraging AI and seamless communication to empower stakeholders and improve outcomes.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## System Architecture

### UI/UX Decisions
The frontend is built with React 18, TypeScript, and Vite, utilizing `shadcn/ui` (Radix UI + Tailwind CSS) for a professional and WCAG-compliant interface. 

**WelcomeHub** (`/educare-app/welcome`): **Default authenticated landing page** - always displayed after login. Features sticky IconToolbar with 6 functional icons (left to right):
1. **Theme Toggle** (Sun/Moon) - Dark/light mode switch
2. **Messages** (MessageCircle) - Badge with unread count, navigates to communication
3. **Feedback** (MessageSquarePlus) - Modal form with type selection (suggestion/bug/praise) and text area
4. **Donations** (Coffee) - Stripe-integrated modal with preset values (R$5-200), single payments
5. **Onboarding Chat** (Bot) - Interactive assistant with navigation to key platform features
6. **Profile** (Avatar) - Dropdown with user info, photo support, settings, help, and logout

Main content (minimalist design - no redundancy): WelcomeHero (gradient banner with greeting & CTAs), NewsCarousel (dynamically loaded news cards with diverse fallback images), and TrainingSection (training content with diverse fallback images). 

**Content Integration**: All content fetches real data from `/api/content/public` endpoint via React Query with loading states. Content Management System allows owners/admins to create, edit, publish, and manage news, training, and course content with image URLs, categories, and audience targeting. 

**Image Diversification**: 
- **News Cards**: 6 unique Unsplash images (educational, creative, research themes)
- **Training Cards**: 6 unique Unsplash images (learning, mentoring, development themes)  
- **Course Cards**: 6 unique Unsplash images (professional, skill-building themes)
- **Seed Data**: Backend seed script includes pre-populated content with diversified images for immediate use
- **Fallback System**: Frontend implements rotating fallback images via modulo indexing to ensure no image repetition

Dashboard and other routes automatically redirect to WelcomeHub as the primary screen.

**Dashboard**: Clean, focused layout showing MetricsCards, DomainProgressChart (recharts bar chart with color-coded domains), StrengthsOpportunities, MilestonesTimeline, AIInsightsCard, ParentalResourcesCarousel, and children list. Removed: "Acesso Rápido à Plataforma", empty state messages, and "Primeiros Passos" for minimalist aesthetic. Social media icons (WhatsApp, Instagram, Facebook) in header.

### Technical Implementations
- **Frontend**: React hooks, `@tanstack/react-query` for state management, React Router for navigation, and `react-hook-form` with Zod for form validation. Custom JWT-based context provider handles authentication.
- **Backend**: Node.js with Express.js, Sequelize ORM following a layered MVC architecture. Authentication is JWT-based, incorporating access and refresh tokens, and Row-Level Security (RLS). APIs are RESTful, with distinct internal and external routes.
- **AI/RAG Architecture**: A sophisticated, segmented Retrieval-Augmented Generation (RAG) system with an 11-phase architecture. This includes:
    - **Segmented Knowledge Bases**: `kb_baby`, `kb_mother`, `kb_professional` for targeted information retrieval.
    - **Dual Ingestion & Routing**: Intelligent categorization and `dual-write` strategy for populating segmented KBs with automatic fallback.
    - **Enterprise Optimizations**: Neural re-ranking, confidence scoring with human escalation, intelligent chunking, data augmentation, context safety (sensitive data/emergency detection), and KB versioning.
    - **Timeout Management**: File Search operations have 60-second timeout with custom polling (1s intervals, max 60 attempts). Upload operations have 120-second timeout with proper cleanup on failure.
    - **Logging & Observability**: Detailed logging at each step (assistant creation, thread creation, run initiation, polling progress, completion) with elapsed time tracking.
    - **Auto-Improvement**: Feedback system, automated quality analysis, LLM-generated improvement suggestions, and a maturity dashboard.
    - **Legacy Management**: Controlled transition from legacy RAG with feature flags, migration services, and a robust legacy shutdown service including backup and rollback capabilities.
    - **Table Sync Script**: `src/scripts/createKnowledgeTables.js` ensures all KB tables exist before document ingestion.

### Feature Specifications
- **Authentication**: JWT-based with comprehensive role-based access control (Owner, Admin, Professional, Parent).
- **Knowledge Base Management**: Owner panel for uploading, listing, deleting, and activating/deactivating documents across the three segmented KBs.
- **RAG Metrics & Monitoring**: Dedicated RAGMetricsDashboard for owners, displaying success rates, response times, fallback rates, and KB usage. Health checks provide status (healthy/degraded/unhealthy).
- **Content Management**: Admin/Owner exclusive system for creating, editing, and publishing dynamic content (news, trainings, courses) that populates WelcomeHub. Features draft/published/archived status, image URLs, target audience, and sort ordering. Accessible at `/educare-app/admin/content-management` and `/educare-app/owner/content-management`.
- **WelcomeHub Dynamic Content**: Public `/api/content/public` endpoint serves published content filtered by type and audience. Components use React Query for real-time data with loading states.
- **RAG Progress Bar**: Visual feedback system with RAGProgressBar component showing retrieval/processing/generation stages (🔍 Recuperando → ⚙️ Processando → ✍️ Gerando). RAG service supports onProgress callbacks for real-time status updates. Integrated into IconToolbar modal. Components: RAGProgressBar.tsx, RAGChat.tsx.
- **TitiNauta AI Assistant**: Masculine AI assistant (tribute to user's son Thiago) with chat interface, integrated RAG system, and progress visualization. **Live in IconToolbar** (icon 5 - Bot) with modal dialog showing:
  - Real-time RAG responses using `ragService.askQuestion()`
  - Visual progress bar with 3 animated stages
  - Automatic JWT auth with external API fallback
  - Error handling with toast notifications
  - Endpoints: `/rag/ask` (authenticated), `/rag/external/ask` (external)
- **External API**: 15 endpoints for integration with external systems like WhatsApp via n8n. Full documentation at `educare-backend/docs/N8N_INTEGRATION_GUIDE.md`.
  - Authentication: API Key via `EXTERNAL_API_KEY` environment variable
  - Endpoints: Users, Children, Subscription Plans, Quiz/Journey, TitiNauta RAG
  - RAG External: `/api/rag/external/ask` and `/api/rag/external/ask-simple`
- **Subscription Management**: Stripe integration for handling SaaS subscriptions.

### System Design Choices
- **Scalability**: Designed for cloud deployment on Digital Ocean, using multiple droplets, PostgreSQL, and Redis.
- **Modularity**: Services are distinct, allowing for independent development and deployment (e.g., `knowledgeBaseSelector.js`, `ragService.js`, `legacyShutdownService.js`).
- **Observability**: Extensive metrics and logging for RAG performance and system health, including a dedicated metrics service and endpoints.
- **Controlled Rollout**: Feature flags (e.g., `USE_LEGACY_FALLBACK_FOR_*`, `ENABLE_SEGMENTED_KB`) enable safe, phased rollouts and easy rollback.

## External Dependencies

- **Database**: PostgreSQL (external server: 86.48.30.74)
- **Automation Platform**: n8n Workflow (for WhatsApp ingestion, AI processing, context management, and response delivery)
- **Messaging**: WhatsApp (via Evolution API)
- **Payment Gateway**: Stripe
- **AI/ML**: **OpenAI API (EXCLUSIVE)** - Strategic decision to use best-in-class LLM resources:
  - **File Search**: OpenAI Assistants API (primary source for RAG retrieval)
  - **LLM Model**: gpt-4o-mini (optimized for quality and performance)
  - **Features**: Neural re-ranking, confidence scoring, semantic search via File Search
  - **No Gemini**: System uses OpenAI exclusively for enterprise-grade quality assurance
- **Cloud Provider**: Digital Ocean (for hosting and infrastructure)
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`

## Strategic AI/ML Decisions (Dec 2025)

**Decision**: Maintain OpenAI API as exclusive AI provider to leverage best-in-class LLM capabilities.
- **File Search**: Uses OpenAI Assistants API (not Gemini) for superior semantic search
- **Rationale**: OpenAI's File Search + gpt-4o-mini provides optimal balance of quality, reliability, and cost-efficiency for enterprise deployments
- **Implementation**: Hybrid strategy prioritizes File Search (primary) → Local KB fallback (secondary)
- **Future**: Cost optimizations will focus on query efficiency, caching, and chunking strategies rather than provider switching

## n8n Integration (Dec 2025)

**Status**: ✅ **READY FOR IMMEDIATE DEPLOYMENT** - All configurations finalized

### Production Configuration
- **n8n URL**: https://n8n.educareapp.com.br/
- **Evolution API URL**: https://api.educareapp.com.br/
- **Evolution API Key**: eff3ea025256694c10422fd0fc5ff169
- **Evolution Instance Name**: evolution
- **Webhook URL**: https://webhook.educareapp.com.br/whatsapp-educare

### Documentation & Templates Available
- **🚀 START HERE**: `educare-backend/docs/N8N_READY_TO_DEPLOY.md` (Complete step-by-step, all data filled)
- **Reference**: `educare-backend/docs/N8N_INTEGRATION_GUIDE.md` (15 endpoints documented)
- **Template**: `educare-backend/docs/n8n-workflow-template.json` (importable workflow, variables pre-configured)
- **Portainer Guide**: `educare-backend/docs/PORTAINER_EXTRACTION_GUIDE.md` (how to extract configs from Portainer)
- **Full Checklist**: `educare-backend/docs/N8N_EVOLUTION_CONFIG_CHECKLIST.md` (validation checklist)

### Pre-Configured Workflow Features
- ✅ Evolution API Webhook (WhatsApp trigger)
- ✅ User identification/creation by phone
- ✅ Active child selection management
- ✅ TitiNauta RAG integration (gpt-4o-mini)
- ✅ Response delivery via WhatsApp
- ✅ Error handling for missing child context
- ✅ Automatic workflow activation upon import

### Ready-to-Use Variables
```
EDUCARE_API_URL=https://[SEU-REPLIT].replit.dev:3001
EDUCARE_API_KEY=educare_external_api_key_2025
EVOLUTION_API_URL=https://api.educareapp.com.br
EVOLUTION_API_KEY=eff3ea025256694c10422fd0fc5ff169
EVOLUTION_INSTANCE_NAME=evolution
```

### Implementation Steps
1. Import `n8n-workflow-template.json` into n8n
2. Fill 5 variables (URL and API keys)
3. Configure webhook in Evolution API pointing to `https://webhook.educareapp.com.br/whatsapp-educare`
4. Activate workflow
5. Test with WhatsApp message

**All integration documentation tested and validated with production URLs** ✓