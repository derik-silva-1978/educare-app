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

**WelcomeHub** (`/educare-app/welcome`): Entry screen after login featuring WelcomeHero (gradient banner with CTA), NewsCarousel (image-based news cards), AcademyCourses (course listings), TitiNautaWidget (AI assistant), FeedbackPanel, and DonationCTA. IconToolbar with 6 minimalist icons (theme, notifications, feedback, activities, TitiNauta, profile).

**Dashboard**: Clean, focused layout showing MetricsCards, DomainProgressChart (recharts bar chart with color-coded domains), StrengthsOpportunities, MilestonesTimeline, AIInsightsCard, ParentalResourcesCarousel, and children list. Removed: "Acesso Rápido à Plataforma", empty state messages, and "Primeiros Passos" for minimalist aesthetic. Social media icons (WhatsApp, Instagram, Facebook) in header.

### Technical Implementations
- **Frontend**: React hooks, `@tanstack/react-query` for state management, React Router for navigation, and `react-hook-form` with Zod for form validation. Custom JWT-based context provider handles authentication.
- **Backend**: Node.js with Express.js, Sequelize ORM following a layered MVC architecture. Authentication is JWT-based, incorporating access and refresh tokens, and Row-Level Security (RLS). APIs are RESTful, with distinct internal and external routes.
- **AI/RAG Architecture**: A sophisticated, segmented Retrieval-Augmented Generation (RAG) system with an 11-phase architecture. This includes:
    - **Segmented Knowledge Bases**: `kb_baby`, `kb_mother`, `kb_professional` for targeted information retrieval.
    - **Dual Ingestion & Routing**: Intelligent categorization and `dual-write` strategy for populating segmented KBs with automatic fallback.
    - **Enterprise Optimizations**: Neural re-ranking, confidence scoring with human escalation, intelligent chunking, data augmentation, context safety (sensitive data/emergency detection), and KB versioning.
    - **Auto-Improvement**: Feedback system, automated quality analysis, LLM-generated improvement suggestions, and a maturity dashboard.
    - **Legacy Management**: Controlled transition from legacy RAG with feature flags, migration services, and a robust legacy shutdown service including backup and rollback capabilities.

### Feature Specifications
- **Authentication**: JWT-based with comprehensive role-based access control (Owner, Admin, Professional, Parent).
- **Knowledge Base Management**: Owner panel for uploading, listing, deleting, and activating/deactivating documents across the three segmented KBs.
- **RAG Metrics & Monitoring**: Dedicated RAGMetricsDashboard for owners, displaying success rates, response times, fallback rates, and KB usage. Health checks provide status (healthy/degraded/unhealthy).
- **External API**: 13 endpoints for integration with external systems like WhatsApp via n8n.
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
- **AI/ML**: OpenAI API (for TitiNauta, LLM-generated suggestions, and various RAG optimizations)
- **Cloud Provider**: Digital Ocean (for hosting and infrastructure)
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`