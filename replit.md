# Educare+ Platform

## Overview
Educare+ is a digital platform designed for early childhood development and maternal health monitoring. It serves as a comprehensive hub connecting parents, caregivers, educators, and healthcare professionals to foster collaborative care. The platform offers interactive assessments, personalized guidance, and advanced communication tools, including an AI-powered assistant (TitiNauta) and WhatsApp integration for remote engagement. Its core mission is to leverage AI and seamless communication to empower stakeholders, improve developmental and health outcomes, and establish itself as a leading solution in the market through a multi-level SaaS subscription model.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## System Architecture

### UI/UX Decisions
The frontend, built with React 18, TypeScript, and Vite, utilizes `shadcn/ui` (Radix UI + Tailwind CSS) to ensure a professional and WCAG-compliant user interface. Key components like `WelcomeHub` and `ProfessionalWelcomeHub` deliver dynamic, audience-filtered content and navigation.

### Technical Implementations
- **Frontend**: React, `@tanstack/react-query`, React Router, `react-hook-form` with Zod for validation, and a custom JWT-based authentication context.
- **Backend**: Node.js with Express.js, Sequelize ORM, a layered MVC architecture, and JWT-based authentication featuring access/refresh tokens and Row-Level Security (RLS). APIs are RESTful.
- **AI/RAG Architecture**: An 11-phase Retrieval-Augmented Generation (RAG) system with segmented knowledge bases (`kb_baby`, `kb_mother`, `kb_professional`), dual ingestion/routing, neural re-ranking, confidence scoring, intelligent chunking, data augmentation, context safety, and KB versioning. This system also incorporates short and long-term child memory for personalized AI responses.
- **Authentication**: Robust JWT-based authentication with role-based access control (Owner, Admin, Professional, Parent), supporting email and phone-based registration and password recovery via email or WhatsApp.
- **Content Management**: Includes an Owner panel for managing knowledge base documents (with cloud storage uploads) and an Admin/Owner system for creating dynamic, audience-targeted content with rich text editing.
- **AI Assistant (TitiNauta)**: A multimodal, masculine AI assistant integrated with the RAG system, offering contextual greetings, quick topic access, and a dedicated "Jornada do Desenvolvimento" experience. It supports child-specific context for personalized responses and suggestions. Includes three variants:
    - **TitiNauta** (Parents): Child development focus with baby-specific memory context, accessing `kb_baby`
    - **TitiNauta Materna**: Maternal health journey with pink/rose visual theme, accessing `kb_mother` with null child context for pregnancy, postpartum, nutrition, sleep, and mental health questions
    - **TitiNauta Especialista** (Professionals): Clinical protocols and evidence-based practices, accessing `kb_professional`
- **Baby & Mother Health Dashboards**: Real-time monitoring for babies (growth charts, vaccine checklists) and mothers (wellness metrics, appointments, mood tracking). The Maternal Health system uses 4 database tables (maternal_health_profiles, maternal_daily_health, maternal_mental_health, maternal_appointments) with full REST API at `/api/maternal-health/*`, React Query hooks, and functional Health Diary dialogs for symptom, sleep, meal, mood, and appointment logging.
- **Admin Children Management**: Global admin panel for managing all children across users with search, detail view, and delete functionality (admin/owner only).
- **Child Limit Upgrade Flow**: When child creation hits the subscription plan limit, a ChildLimitUpgradeDialog shows available Stripe plans for upgrade instead of a generic error.
- **Dynamic Contextual FAQ**: A query-based FAQ system with suggestions adapted to a child's developmental stage.
- **Professional Portal**: Provides tailored dashboards, child management features, a specialized `TitiNauta Especialista` (accessing `kb_professional`), and a professional qualification module.
- **Training Content System**: A video-based platform with public browsing, admin management, Vimeo integration, and Stripe for one-time payments.
- **AI Configuration Systems (Owner-exclusive)**:
    - **Prompt Management**: Customization of AI assistant behavior with versioning and dynamic variable substitution.
    - **LLM Configuration**: Extensible system for per-agent model selection across 9 providers (OpenAI, Google Gemini, DeepSeek, Groq, xAI, Anthropic, Together AI, OpenRouter, Custom) with configurable parameters.
- **Journey V2 Content System**: A comprehensive content management system for educational maternal health and baby development content. Features two content types: educational topics (weeks 1-4 orientation) and interactive quizzes (week 5+). Organized by dual trails (baby/mother), 5 months, 20 weeks. Backend admin CRUD at `/api/admin/journey-v2/*` with server-side Week 5 rule enforcement and trail/domain consistency. Frontend admin page at `/admin/journey-questions` with tabs, filters, statistics, view/edit/create dialogs, and reimport. Database models: `JourneyV2`, `JourneyV2Week`, `JourneyV2Topic`, `JourneyV2Quiz`, `JourneyV2QuizDomain`, `JourneyV2Badge`. Import script at `educare-backend/scripts/importJourneyV2.js`. Source data in `conteudo_quiz/` folder.
- **Journey V2 Curation System (4-Axis)**: A specialized curation and classification system for Journey V2 content, operating across 4 independent axes:
    - **Baby Content** (topics): Classified by 6 baby dev domains (motor, cognitivo, linguagem, social, emocional, sensorial) using TitiNauta Criança
    - **Mother Content** (topics): Classified by 6 maternal domains (nutricao, saude_mental, recuperacao, amamentacao, saude_fisica, autocuidado) using TitiNauta Materna
    - **Baby Quiz** (week 5+): Same baby dev domains, linked to existing OfficialMilestone system via extended `milestone_mappings`
    - **Mother Quiz** (week 5+): Same maternal domains, with independent `maternal_curation_mappings` table
    - Backend REST API at `/api/admin/curation/*` with endpoints for classification, domain management, milestone mappings (baby), maternal mappings (mother), media linking, and batch import
    - `domainClassifierService.js`: Rule-based heuristic classifier with keyword dictionaries for both baby (6 domains) and mother (6 domains), SHA-256 content hashing for anti-duplication
    - Batch JSON Import: `POST /api/admin/curation/batch-import` accepts `{ axis, items }` for bulk content ingestion per axis. Resolves week_id from month+week (week is relative 1-4), auto-classifies, deduplicates, returns detailed report. Auto-creates JourneyV2 and JourneyV2Week records for months beyond the initial 5 that don't exist yet. Batch import dialog includes JSON validation preview showing valid/invalid item counts before import.
    - AI Auto-Fill: `classifyAll` endpoint extended to auto-fill empty quiz fields via OpenAI (gpt-4o-mini). Generates 3 short contextual options (5-15 words), welcoming positive feedback, and respectful negative feedback without right/wrong judgment. Contextualizes by trail (baby/mother), domain, and week number. Detects string-array options and reformats them. Checks both PT and EN feedback keys to prevent overwrites. Backend service: `educare-backend/src/services/quizAIService.js`.
    - AI Content Generator: `POST /api/admin/curation/generate-ai` endpoint generates quiz/content using OpenAI with TitiNauta Infantil (baby) and TitiNauta Materna (mother) personas. Supports full 0-6 year range (72 months) with age-appropriate developmental context via `getAgeDescription()` and `getDevStageContext()` helpers. Frontend: AI Generator dialog with Year (1-6) + Month (1-12) selectors, week buttons (1-4 relative), age info bar, domain filtering, custom instructions, editable JSON preview, and direct import via batch import.
    - Frontend: `src/services/curationService.ts` connects to all curation endpoints with typed interfaces including `AIGenerateParams` and `AIGenerateResult`
    - Frontend: `JourneyQuestionsManagement.tsx` fully restructured with 4-axis tabs, domain classification badges (colored), confidence indicators, inline domain editing, batch import dialog with JSON validation preview, AI Content Generator dialog, milestone ranking panel (baby quiz), maternal curation panel (mother quiz), MediaSelector for linking media resources, visual quiz option builder, and separated feedback fields
    - New models: `MaternalCurationMapping`, `JourneyV2Media` (bridge to MediaResource)
    - Extended models: `JourneyV2Quiz` and `JourneyV2Topic` (added `dev_domain`, `content_hash`, `classification_source`, `classification_confidence`), `MilestoneMapping` (added `journey_v2_quiz_id`, `source_type`)
    - Audit document: `docs/ingestion-curation-audit.md`
- **AI Report Generator**: Enables generation of customizable health and development reports for children across multiple categories, with an option to send reports via WhatsApp.
- **WhatsApp Integration**: Direct integration with Evolution API for sending messages, including password recovery links and AI-generated reports. It also includes a user recognition system for seamless interaction within n8n workflows.

### System Design Choices
- **Scalability**: Designed for cloud deployment on Digital Ocean using multiple droplets, PostgreSQL, and Redis.
- **Modularity**: Distinct services to facilitate independent development and deployment.
- **Observability**: Comprehensive metrics and logging for RAG performance and system health.
- **Controlled Rollout**: Utilizes feature flags for safe, phased feature rollouts and easy rollbacks.

## External Dependencies

- **Database**: PostgreSQL
- **Automation Platform**: n8n Workflow (for WhatsApp ingestion, AI processing, context management, and response delivery)
- **Messaging**: WhatsApp (via Evolution API at api.educareapp.com.br, instance: educare-chat)
- **Payment Gateway**: Stripe
- **AI/ML**: OpenAI API (File Search, LLM), Google Gemini (OCR, Embeddings)
- **Vector Database**: Qdrant Cloud
- **Cloud Provider**: Digital Ocean
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`