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
- **AI Agents Control Center (Owner-exclusive)**: Dashboard for managing TitiNauta AI agents, featuring prompt management with versioning, LLM configuration across multiple providers, model ranking, and a live prompt testing playground.
- **Journey V2 Content System**: CMS for educational maternal health and baby development content, including topics and interactive quizzes. Organized by dual trails (baby/mother), 5 months, 20 weeks, with admin CRUD and server-side rule enforcement.
- **Journey V2 Curation System (4-Axis)**: Specialized curation for Journey V2 content across baby topics (6 domains), mother topics (6 domains), baby quizzes (6 domains linked to OfficialMilestone), and mother quizzes (6 domains). Features a rule-based heuristic classifier, batch JSON import, and AI auto-fill/content generation for quizzes using OpenAI.
- **AI Report Generator**: Generates customizable health and development reports for children, with WhatsApp delivery.
- **WhatsApp Integration**: Direct integration with Evolution API for messages, password recovery, AI reports, and user access approval notifications, including a user recognition system for n8n workflows.
- **User Access Approval Workflow**: New users are 'pending' until an Owner approves via a WhatsApp link.
- **n8n Workflow System**: Interconnected workflows for WhatsApp message processing:
    - **Educare app-chat**: Handles message ingestion, user verification, intent classification, and response routing.
    - **Lead CRM**: Manages unregistered users through a 3-stage sales funnel with an AI agent.
    - **Inactive User Reactivation**: Manages users with inactive subscriptions through a 3-stage reactivation funnel with an AI agent, Stripe integration, and opt-out detection.

### System Design Choices
- **Scalability**: Designed for Digital Ocean cloud deployment with multiple droplets, PostgreSQL, and Redis.
- **Modularity**: Distinct services for independent development.
- **Observability**: Metrics and logging for RAG performance and system health.
- **Controlled Rollout**: Uses feature flags for phased feature rollouts.

## External Dependencies

- **Database**: PostgreSQL
- **Automation Platform**: n8n Workflow
- **Messaging**: WhatsApp (via Evolution API)
- **Payment Gateway**: Stripe
- **AI/ML**: OpenAI API (File Search, LLM), Google Gemini (OCR, Embeddings)
- **Vector Database**: Qdrant Cloud
- **Cloud Provider**: Digital Ocean
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`