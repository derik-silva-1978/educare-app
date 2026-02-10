# Educare+ Platform

## Overview
Educare+ is a digital platform for early childhood development and maternal health monitoring, connecting parents, caregivers, educators, and healthcare professionals. It provides interactive assessments, personalized guidance, and advanced communication tools, including an AI-powered assistant (TitiNauta) and WhatsApp integration. The platform aims to improve developmental and health outcomes through AI and seamless communication, establishing itself as a leading market solution via a multi-level SaaS subscription model.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## System Architecture

### UI/UX Decisions
The frontend uses React 18, TypeScript, Vite, and `shadcn/ui` (Radix UI + Tailwind CSS) for a professional, WCAG-compliant interface. Components like `WelcomeHub` and `ProfessionalWelcomeHub` provide dynamic, audience-filtered content.

### Technical Implementations
- **Frontend**: React, `@tanstack/react-query`, React Router, `react-hook-form` with Zod, and JWT-based authentication.
- **Backend**: Node.js with Express.js, Sequelize ORM, MVC architecture, and JWT-based authentication with access/refresh tokens and Row-Level Security (RLS). APIs are RESTful.
- **AI/RAG Architecture**: An 11-phase RAG system with segmented knowledge bases (`kb_baby`, `kb_mother`, `kb_professional`), neural re-ranking, confidence scoring, intelligent chunking, data augmentation, context safety, and KB versioning. It includes short and long-term child memory for personalized AI responses.
- **Authentication**: Robust JWT-based authentication with role-based access control (Owner, Admin, Professional, Parent), supporting email/phone registration and password recovery.
- **API Security**: Rate limiting, CORS restrictions, Helmet.js security headers, payload size limits, and sanitized logging.
- **Content Management**: Owner panel for knowledge base document management (with cloud storage) and Admin/Owner system for dynamic, audience-targeted content creation.
- **AI Assistant (TitiNauta)**: A multimodal, masculine AI assistant integrated with the RAG system, offering contextual greetings and quick topic access. Three variants exist:
    - **TitiNauta** (Parents): Child development focus, `kb_baby`.
    - **TitiNauta Materna**: Maternal health focus, `kb_mother`.
    - **TitiNauta Especialista** (Professionals): Clinical protocols, `kb_professional`.
- **Baby & Mother Health Dashboards**: Real-time monitoring for babies (growth, vaccines) and mothers (wellness, appointments, mood).
- **Admin Children Management**: Global admin panel for managing all children across users.
- **Child Limit Upgrade Flow**: Guides users to Stripe for subscription upgrades when child creation limits are reached.
- **Dynamic Contextual FAQ**: Query-based FAQ system with suggestions adapted to a child's developmental stage.
- **Professional Portal**: Tailored dashboards, child management, `TitiNauta Especialista`, and a professional qualification module.
- **Training Content System**: Video-based platform with public browsing, admin management, Vimeo integration, and Stripe for payments.
- **AI Agents Control Center (Owner-exclusive)**: Centralized dashboard for managing ALL AI prompts across the platform (16 agents), organized into 5 categories: Assistentes TitiNauta (baby, mother, professional), Pré-vendas (landing_chat), Geradores de Conteúdo (quiz_baby, quiz_mother, content_generator), Curadoria em Lote (curation_baby_quiz, curation_mother_quiz, curation_baby_content, curation_mother_content), and Utilitários de IA (media_metadata, nlp_biometric, nlp_sleep, nlp_appointment, nlp_vaccine). Features prompt versioning, multi-provider LLM configuration, model ranking, live prompt testing playground, and **RAG configuration** (enable/disable vector database queries per agent, select knowledge base: kb_baby, kb_mother, kb_professional, landing). RAG config stored in `assistant_llm_configs` table (`rag_enabled`, `rag_knowledge_base` columns) and read dynamically by ragService. **Architecture Rule: ALL AI-powered features MUST have their prompts managed through the Agent Control Center — no hardcoded prompts in service code. Services use promptService.getProcessedPrompt() with fallback to local defaults.**
- **Journey V2 Content System**: CMS for educational maternal health and baby development content, including topics and interactive quizzes. Organized by dual trails (baby/mother), 5 months, 20 weeks, with admin CRUD and server-side rule enforcement.
- **Journey V2 Curation System (4-Axis)**: Specialized curation for Journey V2 content across baby topics (6 domains), mother topics (6 domains), baby quizzes (6 domains linked to OfficialMilestone), and mother quizzes (6 domains). Features a rule-based heuristic classifier, batch JSON import, and AI auto-fill/content generation for quizzes using OpenAI.
- **AI Report Generator**: Generates customizable health and development reports for children, with WhatsApp delivery.
- **WhatsApp Integration**: Direct integration with Evolution API for messages, password recovery, AI reports, and user access approval notifications, including a user recognition system for n8n workflows.
- **User Access Approval Workflow**: New users are 'pending' until an Owner approves via a WhatsApp link.
- **n8n Workflow System**: Interconnected workflows for WhatsApp message processing:
    - **Educare app-chat**: Handles message ingestion, user verification, intent classification, and response routing.
    - **Lead CRM**: Manages unregistered users through a 3-stage sales funnel with an AI agent.
    - **Inactive User Reactivation**: Manages users with inactive subscriptions through a 3-stage reactivation funnel with an AI agent, Stripe integration, and opt-out detection.
- **WhatsApp Conversation State Machine (pgvector)**: 10-state conversation machine (ENTRY → CONTEXT_SELECTION → FREE_CONVERSATION → specialized flows) with vector-based long-term memory. New tables: `knowledge_embeddings` (RAG KB, replaces Qdrant), `conversation_memory` (vectorial long-term memory), `conversation_states` (WhatsApp state machine), `ux_feedback`, `support_reports`. Service: `pgvectorService.js` with pgvector native support and FLOAT8[] fallback + `cosine_similarity_float8()` SQL function for PostgreSQL 12 compatibility. API: `/api/conversation/*` endpoints (state, feedback, reports, memory search) with API key auth. Phase 3 complete (Feb 2026).
- **n8n Workflow Integration (Phase 4)**: Updated "Educare app-chat" workflow from 41 to 57 nodes. Added 16 nodes for: state machine routing (API: Get State → State Router → Router: State Flow with 4-way routing), ENTRY state handling (transition + context selection buttons), inline feedback detection (Gate: Is Feedback? short-circuits fb_* callbacks), context-aware RAG (API: Get Context Prompt → Merge: Context + RAG before TitiNauta), memory persistence (API: Save Memory parallel with response routing), feedback buttons (API: Send Feedback Buttons after Evo: Send Text), and exit handling. Sub-workflow compatibility VERIFIED (Lead CRM and Inactive Reactivation paths unchanged). Phase 4 complete (Feb 2026).
- **WhatsApp Flow APIs (Phase 5)**: New `/api/whatsapp-flow/*` endpoints for specialized conversation states. Controller: `whatsappFlowController.js`. Routes: `whatsappFlowRoutes.js`. Endpoints: CONTENT_FLOW (`/content/current`, `/content/topic/:id`), QUIZ_FLOW (`/quiz/next`, `/quiz/answer`), LOG_FLOW (`/log/options`, `/log/save`), SUPPORT (`/support/report`). All use API key auth and phone-based user lookup. State machine enhanced with `resolveActionButton()` for all button callback routing. Button ID conventions: `ctx_*` (context), `action_*` (menu), `fb_*` (feedback), `content_*` (content), `quiz_*` (quiz), `log_*` (log), `support_*` (support). New endpoint: `POST /api/conversation/buttons/resolve` for unified button resolution (context + feedback + actions). Guide: `educare-backend/docs/phase5/PHASE5_WORKFLOW_GUIDE.md`. Phase 5 backend complete (Feb 2026).
- **Phase 6 - Multimodal, Menu & Observability**: New conversation API endpoints: `POST /api/conversation/tts/whatsapp` (generates TTS audio and returns public URL for Evolution API sending, with optional preference check), `GET/POST /api/conversation/audio-preference` (persist user text/audio preference), `GET /api/conversation/menu` (contextual menu with state-aware buttons for ALL 10 states), `GET /api/conversation/welcome` (personalized welcome: first-visit vs returning user with/without context). CorrelationId auto-generated (UUID) per ENTRY transition for conversation-level observability. `action_continue` button added to state machine for returning users. Phase 6 backend complete (Feb 2026).
- **Phase 7 - Feedback Triggers, Enriched Context, Session Summary & Analytics**: New conversation API endpoints: `GET /api/conversation/feedback/trigger?phone=X&trigger_event=Y` (smart feedback trigger system with 24h cooldown: checks if feedback should be requested based on event type, time since last feedback, total feedbacks given; events: quiz_completed, content_viewed, exit, pause, session_long; returns should_trigger boolean + pre-formatted feedback message with buttons), `POST /api/conversation/feedback/contextual` (save feedback with contextual response: high scores get positive confirmation, low scores prompt for comments), `GET /api/conversation/context/enriched?phone=X` (unified memory+RAG context: filters memory by active_context before formatting to avoid duplication, adds personalizations like child age/delayed milestones/low satisfaction, returns ready-to-use prompt for TitiNauta), `POST /api/conversation/session/summary` (generates and persists session digest scoped by state.created_at timestamp: interaction counts, contexts used, topics covered, last exchange preview; saved as [SESSION_SUMMARY] in conversation_memory for future welcome personalization), `GET /api/conversation/analytics?phone=X` (user conversation analytics: interaction stats from memory, feedback scores, support reports, session duration calculated from actual memory timestamps). Route ordering fixed to prevent `/context/enriched` collision with `/context/:phone`. Phase 7 backend complete (Feb 2026).

### System Design Choices
- **Scalability**: Designed for Contabo VPS with Docker containers, PostgreSQL, and internal networking.
- **Modularity**: Distinct services for independent development.
- **Observability**: Metrics and logging for RAG performance and system health.
- **Controlled Rollout**: Uses feature flags for phased feature rollouts.

## Deployment Architecture (Contabo VPS + Docker Swarm)

### Infrastructure
- **Server**: Contabo VPS with Docker Swarm + Portainer
- **Containers**: 3 services (postgres, backend, frontend) on `educarenet` overlay network
- **Domain**: `educareapp.com.br` (single domain, path-based routing)
- **Reverse Proxy**: Traefik v3.4.0 (Docker Swarm mode) with automatic HTTPS via Let's Encrypt
- **Routing**: Traefik routes `/api/*`, `/uploads/*`, `/health` to backend; everything else to frontend

### Docker Files
- `docker/Dockerfile.backend` - Node.js 20 Alpine, builds backend on port 5000
- `docker/Dockerfile.frontend` - Multi-stage: Vite build + nginx serving on port 80
- `docker/nginx.conf` - Frontend nginx config with SPA support and security headers
- `docker-compose.yml` - Docker Swarm stack with Traefik labels, health checks, resource limits
- `.env.production.template` - Template with all required environment variables
- `GUIA-DEPLOY.md` - Step-by-step deployment guide in Portuguese

### Deploy Process
1. Push code to git repository
2. In Portainer: Add Stack from Repository (or Pull and Redeploy for updates)
3. Backend auto-migrations run on startup (RAG columns, metadata backfill)
4. Auto-seed runs on startup: populates empty `subscription_plans` and `content_items` tables (disable with `AUTO_SEED_ENABLED=false`)

### Phone Search Standardization
- All n8n and external API endpoints use `findUserByPhone()` from `src/utils/phoneUtils.js`
- `extractPhoneVariants()` generates all format variations (+55, with/without 9th digit, etc.)
- Phone normalization is opt-in via `{ normalize: true }` option to avoid side effects in read endpoints
- Seeder `04-content-items.js` preserves 15 WelcomeHub content items for fresh deploys

### Traefik Configuration (confirmed from server)
- Entrypoints: `web` (80), `websecure` (443)
- Cert Resolver: `letsencryptresolver`
- Network: `educarenet` (external overlay)
- Backend priority: 10 (PathPrefix: /api, /uploads, /health)
- Frontend priority: 1 (catch-all)

## External Dependencies

- **Database**: PostgreSQL (Docker container on same server)
- **Automation Platform**: n8n Workflow
- **Messaging**: WhatsApp (via Evolution API)
- **Payment Gateway**: Stripe
- **AI/ML**: OpenAI API (File Search, LLM), Google Gemini (OCR, Embeddings), ElevenLabs (Text-to-Speech)
- **Vector Database**: pgvector (PostgreSQL native, migrating from Qdrant Cloud)
- **Cloud Provider**: Contabo VPS
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`