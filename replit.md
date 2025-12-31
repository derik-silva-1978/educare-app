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
- **Baby & Mother Health Dashboards**: Real-time monitoring for babies (growth charts, vaccine checklists) and mothers (wellness metrics, appointments, mood tracking).
- **Dynamic Contextual FAQ**: A query-based FAQ system with suggestions adapted to a child's developmental stage.
- **Professional Portal**: Provides tailored dashboards, child management features, a specialized `TitiNauta Especialista` (accessing `kb_professional`), and a professional qualification module.
- **Training Content System**: A video-based platform with public browsing, admin management, Vimeo integration, and Stripe for one-time payments.
- **AI Configuration Systems (Owner-exclusive)**:
    - **Prompt Management**: Customization of AI assistant behavior with versioning and dynamic variable substitution.
    - **LLM Configuration**: Extensible system for per-agent model selection across 9 providers (OpenAI, Google Gemini, DeepSeek, Groq, xAI, Anthropic, Together AI, OpenRouter, Custom) with configurable parameters.
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