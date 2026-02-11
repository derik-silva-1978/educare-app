# Educare+ Platform

## Overview
Educare+ is a digital platform designed to enhance early childhood development and maternal health monitoring. It connects parents, caregivers, educators, and healthcare professionals through interactive assessments, personalized guidance, and advanced communication tools. Key features include an AI-powered assistant (TitiNauta) and WhatsApp integration. The platform aims to improve developmental and health outcomes through AI and seamless communication, leveraging a multi-level SaaS subscription model to become a leading market solution.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## System Architecture

### UI/UX Decisions
The frontend utilizes React 18, TypeScript, Vite, and `shadcn/ui` (Radix UI + Tailwind CSS) to deliver a professional and WCAG-compliant user interface. Dynamic content is provided via components like `WelcomeHub` and `ProfessionalWelcomeHub`.

### Technical Implementations
- **Frontend**: React, `@tanstack/react-query`, React Router, `react-hook-form` with Zod, and JWT-based authentication.
- **Backend**: Node.js with Express.js, Sequelize ORM, MVC architecture, and JWT-based authentication with access/refresh tokens and Row-Level Security (RLS). APIs are RESTful.
- **AI/RAG Architecture**: An 11-phase RAG system with segmented knowledge bases (`kb_baby`, `kb_mother`, `kb_professional`), neural re-ranking, confidence scoring, intelligent chunking, data augmentation, context safety, and KB versioning. Includes short and long-term child memory for personalized AI responses.
- **Authentication**: Robust JWT-based authentication with role-based access control (Owner, Admin, Professional, Parent), supporting email/phone registration and password recovery. Auth security hardened (Phase 10): separate refresh token secret, 1h access token TTL, 12-round bcrypt, password policy enforcement, crypto-secure random generation throughout.
- **AI Assistant (TitiNauta)**: A multimodal, masculine AI assistant integrated with the RAG system, offering contextual greetings and quick topic access. Variants include TitiNauta (Parents, `kb_baby`), TitiNauta Materna (Maternal health, `kb_mother`), and TitiNauta Especialista (Professionals, `kb_professional`).
- **AI Agents Control Center (Owner-exclusive)**: Centralized dashboard for managing all AI prompts across 16 agents categorized into Assistentes TitiNauta, Pré-vendas, Geradores de Conteúdo, Curadoria em Lote, and Utilitários de IA. Features prompt versioning, multi-provider LLM configuration, model ranking, live prompt testing, and RAG configuration (enable/disable vector database queries per agent, select knowledge base). All AI-powered features must use prompts managed through this center.
- **Journey V2 Content System**: CMS for educational maternal health and baby development content, including topics and interactive quizzes. Organized by dual trails (baby/mother), 5 months, 20 weeks, with admin CRUD.
- **Journey V2 Curation System (4-Axis)**: Specialized content curation for baby and mother topics and quizzes using a rule-based heuristic classifier, batch JSON import, and AI auto-fill/content generation.
- **WhatsApp Integration**: Direct integration with Evolution API for messages, password recovery, AI reports, and user access approval notifications, including a user recognition system for n8n workflows.
- **WhatsApp Conversation State Machine**: A 10-state conversation machine with vector-based long-term memory using `pgvector` for knowledge embeddings and conversation memory. Includes APIs for managing conversation state, feedback, and memory search.
- **n8n Workflow System**: Interconnected workflows for WhatsApp message processing, including `Educare app-chat` (63 nodes) for message ingestion, user verification, intent classification, and response routing; `Lead CRM` for unregistered users; and `Inactive User Reactivation`.
    - **n8n State Machine v2.1 (Feb 2026)**: Complete 10-state conversation flow orchestrated in n8n (65 nodes): State Router v2.1 with nested API response access (`{success, state: {user_phone, state, ...}}`), 5-rule Switch routing (normal→buffer→intent, entry, feedback, exit, button_resolve), 6-rule Intent Classifier (menu, biometrics, sleep, vaccine, question, appointment), interactive context buttons (Bebê/Mãe) via Evolution API with corrected `jsonBody` payloads, button resolution API, message buffer with TTL-based concatenation (12s, min 15 chars), short-message wait prompts, and memory/feedback/context API connections. Global Constants v2.1 includes Brazilian phone 9th digit normalization (559891628206 → 5598991628206) to handle Evolution API phone format inconsistencies. All Evolution API send nodes (Context Buttons, Feedback Buttons, Feedback Ack) use `specifyBody: json` with full payload in `jsonBody`. Workflow backup: `educare-backend/docs/n8n-educare-chat-v2-state-machine.json`.
    - **n8n Known Issue**: Intermittent "password authentication failed for user postgres" errors from n8n's internal PostgreSQL database on Contabo VPS. Affects workflow saves and execution recording. Does not affect the Educare backend API. Requires Contabo VPS database investigation.
- **API Enhancements**:
    - **WhatsApp Flow APIs**: New endpoints for specialized conversation states including content, quiz, logging, and support flows.
    - **Multimodal, Menu & Observability**: API endpoints for Text-to-Speech (TTS), user audio preferences, contextual menus, and personalized welcome messages. Implements `CorrelationId` for conversation-level observability.
    - **Feedback Triggers, Enriched Context, Session Summary & Analytics**: APIs for smart feedback triggers, saving contextual feedback, generating enriched context for TitiNauta, creating session summaries, and user conversation analytics.
    - **Message Buffer & n8n Workflow Wiring**: Integration of a message buffer with TTL-based concatenation and intent detection.
    - **Input Validation & Phone Sanitization (Phase 9)**: Comprehensive validation middleware for phone numbers (Brazilian format normalization with +55 prefix), scores (1-5), states (10 valid values), contexts, and audio preferences. Phone sanitization applied to 22+ conversation endpoints.
    - **Health Check & Monitoring (Phase 9)**: `GET /api/conversation/health` endpoint (public, no auth) validating database connectivity, table existence (conversation_states, conversation_memory), TTS configuration, and buffer service availability.
    - **End-to-End API Test Suite (Phase 9)**: 40-test comprehensive script (`conversation-api-test.js`) covering state machine, state CRUD, validation, phone sanitization, buffer, memory, context, feedback, buttons, audio preferences, welcome/menu, TTS, reports, session summary, and analytics endpoints.
    - **Auth Security Hardening (Phase 10)**: Separate JWT refresh token with dedicated secret, reduced access token TTL (24h→1h), increased bcrypt salt rounds (10→12), password strength validation (min 6 chars), crypto-secure random generation replacing all `Math.random()` calls, removed password info logging.
    - **Production Error Handling (Phase 10)**: Global `unhandledRejection` and `uncaughtException` handlers in server.js. Graceful degradation for non-critical service failures.
    - **Production Deployment Guide (Phase 10)**: Comprehensive deployment documentation covering environment variables, Docker setup, n8n webhook configuration, monitoring checklist, and database index reference.
    - **URL Link Shortener (Phase 10)**: Integrated is.gd link shortener into registration approval messages and welcome messages sent via WhatsApp. Approval links (7/14/30 days) and login URLs are shortened for better mobile UX. Falls back to original URL on failure.

### System Design Choices
- **Scalability**: Designed for Contabo VPS with Docker containers, PostgreSQL, and internal networking.
- **Modularity**: Distinct services for independent development.
- **Observability**: Metrics and logging for RAG performance and system health.
- **Controlled Rollout**: Uses feature flags for phased feature rollouts.

### Deployment Architecture
- **Production Domain**: `educareapp.com.br` (NOT educareplus.com.br)
- **Infrastructure**: Contabo VPS with Docker Swarm and Portainer.
- **Containers**: Three services (postgres, backend, frontend) on an overlay network, plus Traefik reverse proxy.
- **Reverse Proxy**: Traefik v3.4.0 with automatic HTTPS via Let's Encrypt, routing API and static file requests to the backend, and all other traffic to the frontend.
- **External API Key**: `EXTERNAL_API_KEY` env var required for external API access (e.g., n8n webhooks).
- **Production Bug Fix (Feb 2026)**: URL shortener import made safe with try/catch fallback to prevent auth controller crash when utility not deployed.
- **Production DB Fix (Feb 11, 2026)**: Fixed WhatsApp user lookup by adding admin endpoints for schema fixes and user management. Added `preferences` and `avatar_url` columns to profiles table. Rewrote n8n user lookup to use raw SQL with multi-layer fallback (users.phone → profiles.phone → email). Admin endpoints: `/api/admin/fix-schema`, `/api/admin/create-user`, `/api/admin/set-user-phone`, `/api/admin/list-users`, `/api/admin/db-status`. Security: TODO - remove superuser_password body parameter, add rate limiting and IP allowlist to admin endpoints.
- **Phone 9th Digit Fix (Feb 11, 2026)**: Evolution API sometimes sends Brazilian mobile numbers without the 9th digit (e.g., `559891628206` instead of `5598991628206`). Updated `extractPhoneVariants()` in phoneUtils.js to generate variants with the 9th digit added (DDD + 9 + 8-digit number) in addition to the existing removal logic. This enables bidirectional phone format matching.
- **Lead CRM n8n Fix (Feb 11, 2026)**: Fixed "No session ID found" error in Lead CRM subflow. Added `sessionId: contato` (phone number) to the Code node output before AI Agent1/Postgres Chat Memory. The fix was applied directly via n8n REST API.
- **GitHub Repo**: `derik-silva-1978/educare-app` (main branch)
- **Deploy Process**: GitHub Actions builds Docker image → Portainer pulls and redeploys on Contabo VPS

## External Dependencies

- **Database**: PostgreSQL (with pgvector)
- **Automation Platform**: n8n Workflow
- **Messaging**: WhatsApp (via Evolution API)
- **Payment Gateway**: Stripe
- **AI/ML**: OpenAI API (File Search, LLM), Google Gemini (OCR, Embeddings), ElevenLabs (Text-to-Speech)
- **Cloud Provider**: Contabo VPS
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`