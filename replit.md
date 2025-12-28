# Educare+ Platform

## Overview
Educare+ is a digital platform designed to support early childhood development and maternal health monitoring. It connects parents, caregivers, educators, and healthcare professionals to facilitate collaborative care through interactive assessments, personalized guidance, and advanced communication tools. The platform features an AI-powered assistant (TitiNauta), integrates with WhatsApp for remote engagement, and uses a multi-level SaaS subscription model. The vision is to become a leading solution in early childhood development and maternal health by leveraging AI and seamless communication to empower stakeholders and improve outcomes.

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
- **AI/RAG Architecture**: A sophisticated, segmented Retrieval-Augmented Generation (RAG) system with an 11-phase architecture, including segmented knowledge bases (`kb_baby`, `kb_mother`, `kb_professional`), dual ingestion and routing, enterprise optimizations (neural re-ranking, confidence scoring, intelligent chunking, data augmentation, context safety, KB versioning), and robustness features.

### Feature Specifications
- **Authentication**: JWT-based with comprehensive role-based access control (Owner, Admin, Professional, Parent).
- **Knowledge Base Management**: Owner panel for managing documents across segmented KBs, supporting cloud storage uploads (Google Drive, OneDrive).
- **RAG Metrics & Monitoring**: Dashboard for owners displaying performance metrics and health checks.
- **Content Management**: Admin/Owner system for creating, editing, and publishing dynamic content for the WelcomeHub, featuring a rich text editor with extensive formatting options.
- **TitiNauta AI Assistant**: A masculine AI assistant with a multimodal chat interface, integrated RAG system, quick topic access, context-aware greetings, and a dedicated "Jornada do Desenvolvimento" experience.
- **Baby Health Dashboard**: Real-time health monitoring for babies, including growth charts, sleep patterns, vaccine checklists, and daily summaries, visible only to parents.
- **Dynamic Contextual FAQ**: A query-based FAQ system with dynamic ranking and contextual suggestions based on a child's development week (0-312 weeks).
- **Professional Portal**: Dedicated portal for healthcare professionals with TitiNauta Specialist chat (kb_professional), Resources Hub (CMS-powered news/trainings), and ChildIndicatorsPanel for viewing real developmental milestones via GET /api/milestones/child/:childId with TeamMember access verification.
- **Training Content System (Phase 2 - Complete)**: Full video-based training platform with 6 Sequelize models (ContentVideo, TrainingModule, TrainingLesson, UserContentProgress, ContentPricing, UserEnrollment). Public access to course browsing via `/educare-app/trainings` with optional authentication support. Admin/Owner management at `/educare-app/admin/trainings` and `/educare-app/owner/trainings`. Vimeo integration ready (awaiting VIMEO_ACCESS_TOKEN). Stripe one-time payment checkout implemented for paid courses.

### System Design Choices
- **Scalability**: Designed for cloud deployment on Digital Ocean using multiple droplets, PostgreSQL, and Redis.
- **Modularity**: Distinct services for independent development and deployment.
- **Observability**: Extensive metrics and logging for RAG performance and system health.
- **Controlled Rollout**: Feature flags enable safe, phased rollouts and easy rollback.

## External Dependencies

- **Database**: PostgreSQL
- **Automation Platform**: n8n Workflow (for WhatsApp ingestion, AI processing, context management, and response delivery)
- **Messaging**: WhatsApp (via Evolution API)
- **Payment Gateway**: Stripe
- **AI/ML**: OpenAI API (for File Search and LLM, specifically gpt-4o-mini)
- **Vector Database**: Qdrant Cloud
- **OCR/Embeddings**: Google Gemini (gemini-2.5-flash for OCR, text-embedding-004 for embeddings)
- **Cloud Provider**: Digital Ocean
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`