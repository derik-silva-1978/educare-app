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
The frontend is built with React 18, TypeScript, and Vite, utilizing `shadcn/ui` (Radix UI + Tailwind CSS) for a professional and WCAG-compliant interface. Key components include a `WelcomeHub` (default authenticated landing page with dynamic content carousels and a sticky IconToolbar) and a `Dashboard` (focused on user metrics and baby health data visualization for parents). Content is dynamically loaded and diversified with fallback images.

### Technical Implementations
- **Frontend**: React hooks, `@tanstack/react-query`, React Router, and `react-hook-form` with Zod for validation. Authentication uses a custom JWT-based context provider.
- **Backend**: Node.js with Express.js, Sequelize ORM, and a layered MVC architecture. Authentication is JWT-based with access/refresh tokens and Row-Level Security (RLS). APIs are RESTful.
- **AI/RAG Architecture**: A sophisticated, segmented Retrieval-Augmented Generation (RAG) system with an 11-phase architecture. This includes:
    - **Segmented Knowledge Bases**: `kb_baby`, `kb_mother`, `kb_professional`.
    - **Dual Ingestion & Routing**: Intelligent categorization and `dual-write` for KBs.
    - **Enterprise Optimizations**: Neural re-ranking, confidence scoring with human escalation, intelligent chunking, data augmentation, context safety, and KB versioning.
    - **Robustness**: Timeout management for file operations, detailed logging, and a feedback-driven auto-improvement system.
    - **Legacy Management**: Controlled transition from legacy RAG with feature flags and rollback capabilities.

### Feature Specifications
- **Authentication**: JWT-based with comprehensive role-based access control (Owner, Admin, Professional, Parent).
- **Knowledge Base Management**: Owner panel for managing documents across segmented KBs.
- **RAG Metrics & Monitoring**: Dashboard for owners displaying performance metrics and health checks.
- **Content Management**: Admin/Owner system for creating, editing, and publishing dynamic content for the WelcomeHub.
- **TitiNauta AI Assistant**: A masculine AI assistant with a multimodal chat interface, integrated RAG system, and quick topic access. Features include:
    - **TitiNautaQuickAccess**: Dashboard card with quick topic icons (Desenvolvimento, Jornada do Bebê, Jornada da Mãe, Vacinas, Sono)
    - **TitiNautaAssistant**: Dedicated chat page at `/educare-app/titinauta` with topic query parameter support
    - **Context-aware greetings**: Topic-specific initial messages based on selected theme
    - **Jornada do Desenvolvimento**: Separate journey experience at `/educare-app/jornada-desenvolvimento`
- **External API**: 15 endpoints for integration with external systems like WhatsApp via n8n, secured by an API Key.
- **Subscription Management**: Stripe integration for SaaS subscriptions.
- **Baby Health Dashboard**: Real-time health monitoring for babies, including growth charts, sleep patterns, vaccine checklists (Brazilian SBP calendar), and daily summaries, visible only to parents.
- **Dynamic Contextual FAQ**: A query-based FAQ system with dynamic ranking and contextual suggestions based on a child's development week (0-312 weeks), pre-populated with 77 seed FAQs.

### System Design Choices
- **Scalability**: Designed for cloud deployment on Digital Ocean using multiple droplets, PostgreSQL, and Redis.
- **Modularity**: Distinct services for independent development and deployment.
- **Observability**: Extensive metrics and logging for RAG performance and system health.
- **Controlled Rollout**: Feature flags enable safe, phased rollouts and easy rollback.

## Recent Changes (December 2025)

### RAG System Fixes
- **OpenAI SDK v6+ Compatibility**: Updated `runs.retrieve`, `runs.cancel` to use new syntax `(runId, { thread_id })` and `assistants.delete()` method
- **Knowledge Base Ingestion**: Aligned frontend form to send required fields (`title`, `source_type`, `knowledge_category`) for successful document uploads
- **Error Handling**: Backend returns HTTP 400 for validation errors, HTTP 503 for database connection issues (instead of generic 500)
- **File Search**: End-to-end document indexing and RAG queries working with OpenAI File Search
- **Hybrid Ingestion Timeouts** (Dec 12): Fixed infinite loading issue in document uploads by adding:
  - Gemini OCR timeout: 120 seconds (2 min) per document
  - Gemini Embedding timeout: 30 seconds per chunk
  - Total ingestion timeout: 600 seconds (10 min) per upload
  - Proper error handling for timeout scenarios
  - File: `educare-backend/src/services/hybridIngestionService.js`

### Development Notes
- **OpenAI SDK v6 Breaking Changes**: 
  - `runs.retrieve(runId, { thread_id: threadId })` instead of `runs.retrieve(threadId, runId)`
  - `runs.cancel(runId, { thread_id: threadId })` instead of `runs.cancel(threadId, runId)`
  - `assistants.delete(assistantId)` instead of `assistants.del(assistantId)`
- **Database User Limitation**: User `educareapp` lacks FK constraint rights - use `constraints: false` in Sequelize associations

## External Dependencies

- **Database**: PostgreSQL (external server)
- **Automation Platform**: n8n Workflow (for WhatsApp ingestion, AI processing, context management, and response delivery)
- **Messaging**: WhatsApp (via Evolution API)
- **Payment Gateway**: Stripe
- **AI/ML**: OpenAI API (EXCLUSIVE for File Search and LLM, specifically gpt-4o-mini)
- **Cloud Provider**: Digital Ocean
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`