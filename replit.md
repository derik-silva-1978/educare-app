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
- **Authentication**: Robust JWT-based authentication with role-based access control (Owner, Admin, Professional, Parent), supporting email/phone registration and password recovery.
- **AI Assistant (TitiNauta)**: A multimodal, masculine AI assistant integrated with the RAG system, offering contextual greetings and quick topic access. Variants include TitiNauta (Parents, `kb_baby`), TitiNauta Materna (Maternal health, `kb_mother`), and TitiNauta Especialista (Professionals, `kb_professional`).
- **AI Agents Control Center (Owner-exclusive)**: Centralized dashboard for managing all AI prompts across 16 agents categorized into Assistentes TitiNauta, Pré-vendas, Geradores de Conteúdo, Curadoria em Lote, and Utilitários de IA. Features prompt versioning, multi-provider LLM configuration, model ranking, live prompt testing, and RAG configuration (enable/disable vector database queries per agent, select knowledge base). All AI-powered features must use prompts managed through this center.
- **Journey V2 Content System**: CMS for educational maternal health and baby development content, including topics and interactive quizzes. Organized by dual trails (baby/mother), 5 months, 20 weeks, with admin CRUD.
- **Journey V2 Curation System (4-Axis)**: Specialized content curation for baby and mother topics and quizzes using a rule-based heuristic classifier, batch JSON import, and AI auto-fill/content generation.
- **WhatsApp Integration**: Direct integration with Evolution API for messages, password recovery, AI reports, and user access approval notifications, including a user recognition system for n8n workflows.
- **WhatsApp Conversation State Machine**: A 10-state conversation machine with vector-based long-term memory using `pgvector` for knowledge embeddings and conversation memory. Includes APIs for managing conversation state, feedback, and memory search.
- **n8n Workflow System**: Interconnected workflows for WhatsApp message processing, including `Educare app-chat` for message ingestion, user verification, intent classification, and response routing; `Lead CRM` for unregistered users; and `Inactive User Reactivation`.
- **API Enhancements**:
    - **WhatsApp Flow APIs**: New endpoints for specialized conversation states including content, quiz, logging, and support flows.
    - **Multimodal, Menu & Observability**: API endpoints for Text-to-Speech (TTS), user audio preferences, contextual menus, and personalized welcome messages. Implements `CorrelationId` for conversation-level observability.
    - **Feedback Triggers, Enriched Context, Session Summary & Analytics**: APIs for smart feedback triggers, saving contextual feedback, generating enriched context for TitiNauta, creating session summaries, and user conversation analytics.
    - **Message Buffer & n8n Workflow Wiring**: Integration of a message buffer with TTL-based concatenation and intent detection.

### System Design Choices
- **Scalability**: Designed for Contabo VPS with Docker containers, PostgreSQL, and internal networking.
- **Modularity**: Distinct services for independent development.
- **Observability**: Metrics and logging for RAG performance and system health.
- **Controlled Rollout**: Uses feature flags for phased feature rollouts.

### Deployment Architecture
- **Infrastructure**: Contabo VPS with Docker Swarm and Portainer.
- **Containers**: Three services (postgres, backend, frontend) on an overlay network.
- **Reverse Proxy**: Traefik v3.4.0 with automatic HTTPS via Let's Encrypt, routing API and static file requests to the backend, and all other traffic to the frontend.

## External Dependencies

- **Database**: PostgreSQL (with pgvector)
- **Automation Platform**: n8n Workflow
- **Messaging**: WhatsApp (via Evolution API)
- **Payment Gateway**: Stripe
- **AI/ML**: OpenAI API (File Search, LLM), Google Gemini (OCR, Embeddings), ElevenLabs (Text-to-Speech)
- **Cloud Provider**: Contabo VPS
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`