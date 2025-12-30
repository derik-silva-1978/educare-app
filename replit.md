# Educare+ Platform

## Overview
Educare+ is a digital platform for early childhood development and maternal health monitoring. It connects parents, caregivers, educators, and healthcare professionals to facilitate collaborative care through interactive assessments, personalized guidance, and advanced communication. The platform features an AI-powered assistant (TitiNauta) and integrates with WhatsApp for remote engagement. Its vision is to become a leading solution in its domain by leveraging AI and seamless communication to empower stakeholders and improve outcomes through a multi-level SaaS subscription model.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## System Architecture

### UI/UX Decisions
The frontend, built with React 18, TypeScript, and Vite, uses `shadcn/ui` (Radix UI + Tailwind CSS) for a professional, WCAG-compliant interface. Key components like `WelcomeHub` and `ProfessionalWelcomeHub` provide dynamic, audience-filtered content carousels and navigation.

### Technical Implementations
- **Frontend**: React, `@tanstack/react-query`, React Router, `react-hook-form` with Zod for validation, and a custom JWT-based authentication context.
- **Backend**: Node.js with Express.js, Sequelize ORM, a layered MVC architecture, and JWT-based authentication with access/refresh tokens and Row-Level Security (RLS). APIs are RESTful.
- **AI/RAG Architecture**: A sophisticated 11-phase Retrieval-Augmented Generation (RAG) system featuring segmented knowledge bases (`kb_baby`, `kb_mother`, `kb_professional`), dual ingestion/routing, neural re-ranking, confidence scoring, intelligent chunking, data augmentation, context safety, and KB versioning.
- **Authentication**: JWT-based with comprehensive role-based access control (Owner, Admin, Professional, Parent).
- **Knowledge Base Management**: Owner panel for managing documents across segmented KBs, supporting cloud storage uploads.
- **Content Management**: Admin/Owner system for creating and publishing dynamic content with audience targeting, rich text editing, and visual badges.
- **TitiNauta AI Assistant**: A masculine AI assistant with a multimodal chat interface, integrated RAG, quick topic access, context-aware greetings, and a dedicated "Jornada do Desenvolvimento" experience.
- **Baby Health Dashboard**: Real-time health monitoring for babies (growth charts, sleep patterns, vaccine checklists), visible only to parents.
- **Dynamic Contextual FAQ**: A query-based FAQ system with dynamic ranking and suggestions based on a child's development week.
- **Professional Portal**: Comprehensive portal for healthcare professionals including tailored `ProfessionalWelcomeHub`, simplified dashboard, child management, a specialized `TitiNauta Especialista` (RAG access to `kb_professional`), and a professional qualification module.
- **Training Content System**: Video-based training platform with public browsing, admin/owner management, Vimeo integration, and Stripe one-time payment checkout.
- **Prompt Management System (Owner-exclusive)**: System for customizing AI assistant behavior with versioning, module-type specific prompts, dynamic variable substitution, visual API key status, and cache management.
- **LLM Configuration System (Owner-exclusive)**: Extensible system for per-agent model selection, supporting 9 built-in providers (OpenAI, Google Gemini, DeepSeek, Groq, xAI, Anthropic, Together AI, OpenRouter, Custom) with configurable parameters and dynamic validation of provider availability.

### System Design Choices
- **Scalability**: Designed for cloud deployment on Digital Ocean using multiple droplets, PostgreSQL, and Redis.
- **Modularity**: Distinct services for independent development and deployment.
- **Observability**: Extensive metrics and logging for RAG performance and system health.
- **Controlled Rollout**: Feature flags enable safe, phased rollouts and easy rollback.

### 2025-12-30: Authentication & WhatsApp Integration Fixes

**1. Double Password Hashing (CRITICAL FIX)**
- **Problem**: Temporary passwords via WhatsApp never verified correctly
- **Cause**: authController was hashing passwords before saving, but User model hooks also hash automatically → double hashing
- **Solution**: Removed manual `bcrypt.hash` calls; model hooks now handle all hashing
- **Result**: Password verification now passes ("OK" in logs)

**2. Phone Number Format Handling**
- **Problem**: Login by phone `+5598991628206` failed even though user had `98991628206`
- **Solution**: Created `phoneUtils.js` with intelligent multi-format lookup (searches 7 variants) and E.164 normalization
- **Features**: 
  - Supports formats: `98991628206`, `5598991628206`, `+5598991628206`
  - Handles legacy 8-9 digit formats with DDD detection
  - Automatic normalization to E.164 on save
  - Validation function: `isValidBrazilianPhone()`

**3. WhatsApp Integration Resilience (NEW)**
- **Problem**: Webhook calls to Evolution API/Chatwoot lacked retry logic and timeout handling
- **Solution**: Created `whatsappService.js` with enterprise-grade reliability:
  - **Retry Logic**: Automatic 3 retries with exponential backoff (configurable)
  - **Timeouts**: 10s default, 15s for passwords/verification codes
  - **Error Handling**: Detailed logging with status codes and error messages
  - **Protocol Support**: Both HTTP and HTTPS
- **Methods**: 
  - `sendTemporaryPassword()` - WhatsApp temporary password delivery
  - `sendVerificationCode()` - Phone verification code delivery
  - `sendMessage()` - Custom message delivery
- **Updated**: authController now uses WhatsappService instead of direct webhook calls

**Files Created/Modified**:
- `educare-backend/src/services/whatsappService.js` (NEW)
- `educare-backend/src/utils/phoneUtils.js` (enhanced)
- `educare-backend/src/controllers/authController.js` (refactored)
- `educare-backend/.env.example` (template)

**Testing**: ✅ All flows working
- Login: email, phone (all formats)
- Registration: Phone normalization working
- Temporary password: Retry + hash verification passing
- Phone verification: Sent via WhatsApp with retry

## External Dependencies

- **Database**: PostgreSQL
- **Automation Platform**: n8n Workflow (for WhatsApp ingestion, AI processing, context management, and response delivery)
- **Messaging**: WhatsApp (via Evolution API + Chatwoot at api.educareapp.com.br)
- **Payment Gateway**: Stripe
- **AI/ML**: OpenAI API (File Search, LLM), Google Gemini (OCR, Embeddings)
- **Vector Database**: Qdrant Cloud
- **Cloud Provider**: Digital Ocean
- **UI Libraries**: Radix UI, Tailwind CSS (via shadcn/ui)
- **Frontend State Management**: `@tanstack/react-query`
