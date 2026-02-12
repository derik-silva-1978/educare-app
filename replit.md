# Educare+ Platform

## Overview
Educare+ is a digital platform designed to enhance early childhood development and maternal health monitoring. It connects parents, caregivers, educators, and healthcare professionals through interactive assessments, personalized guidance, and advanced communication tools. The platform aims to improve developmental and health outcomes through AI and seamless communication, leveraging a multi-level SaaS subscription model to become a leading market solution. Key features include an AI-powered assistant (TitiNauta) and WhatsApp integration.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## System Architecture

### UI/UX Decisions
The frontend utilizes React 18, TypeScript, Vite, and `shadcn/ui` (Radix UI + Tailwind CSS) to deliver a professional and WCAG-compliant user interface.

### Technical Implementations
- **Frontend**: React, `@tanstack/react-query`, React Router, `react-hook-form` with Zod, and JWT-based authentication.
- **Backend**: Node.js with Express.js, Sequelize ORM, MVC architecture, and JWT-based authentication with access/refresh tokens and Row-Level Security (RLS). APIs are RESTful.
- **AI/RAG Architecture**: An 11-phase RAG system with segmented knowledge bases, neural re-ranking, confidence scoring, intelligent chunking, data augmentation, context safety, and KB versioning. Includes short and long-term child memory for personalized AI responses.
- **Authentication**: Robust JWT-based authentication with role-based access control (Owner, Admin, Professional, Parent), supporting email/phone registration and password recovery. Security hardening includes separate refresh token secret, 1-hour access token TTL, 12-round bcrypt, and password policy enforcement.
- **AI Assistant (TitiNauta)**: A multimodal, masculine AI assistant integrated with the RAG system, offering contextual greetings and quick topic access. Variants are tailored for Parents, Maternal health, and Professionals.
- **AI Agents Control Center (Owner-exclusive)**: Centralized dashboard for managing all AI prompts across 16 agents. Features prompt versioning, multi-provider LLM configuration, model ranking, live prompt testing, and RAG configuration. All AI-powered features must use prompts managed through this center.
- **Journey V2 Content System**: CMS for educational maternal health and baby development content, including topics and interactive quizzes. Organized by dual trails (baby/mother), 5 months, 20 weeks, with admin CRUD.
- **Journey V2 Curation System (4-Axis)**: Specialized content curation using a rule-based heuristic classifier, batch JSON import, and AI auto-fill/content generation.
- **WhatsApp Integration**: Direct integration with Evolution API for messages, password recovery, AI reports, and user access approval notifications, including a user recognition system for n8n workflows.
- **WhatsApp Conversation State Machine**: An 11-state conversation machine with vector-based long-term memory using `pgvector` for knowledge embeddings and conversation memory. Includes an ONBOARDING state for collecting baby data (name, gender, birthdate) for personalization.
- **Report Image Generation**: Server-side PNG report generation for developmental progress, with an ASCII text fallback.
- **Conversation Sandbox**: Owner-exclusive admin page for visualizing the state machine, simulating WhatsApp conversations, and displaying system health checks.
- **n8n Workflow System**: Interconnected workflows for WhatsApp message processing, including `Educare app-chat` for message ingestion, user verification, intent classification, and response routing; `Lead CRM` for unregistered users; and `Inactive User Reactivation`. The n8n State Machine v2.3 orchestrates a 10-state conversation flow with intent classification, interactive context buttons, and a message buffer.
- **API Enhancements**: Includes APIs for WhatsApp flows, multimodal features (TTS), user audio preferences, contextual menus, personalized welcome messages, feedback triggers, enriched context for TitiNauta, session summaries, conversation analytics, and message buffering. Features comprehensive input validation, phone sanitization, a public health check endpoint, and an end-to-end API test suite.
- **Production Error Handling**: Global `unhandledRejection` and `uncaughtException` handlers for graceful degradation.
- **URL Link Shortener**: Integrated is.gd link shortener for registration approval and welcome messages for improved mobile UX.

### System Design Choices
- **Scalability**: Designed for Contabo VPS with Docker containers, PostgreSQL, and internal networking.
- **Modularity**: Distinct services for independent development.
- **Observability**: Metrics and logging for RAG performance and system health.
- **Controlled Rollout**: Uses feature flags for phased feature rollouts.

### Deployment Architecture
- **Production Domain**: `educareapp.com.br`
- **Infrastructure**: Contabo VPS with Docker Swarm and Portainer.
- **Containers**: Three services (postgres, backend, frontend) on an overlay network, plus Traefik reverse proxy.
- **Reverse Proxy**: Traefik v3.4.0 with automatic HTTPS via Let's Encrypt, routing API and static file requests.
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