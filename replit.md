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

### 2025-12-31: Dashboard & Settings Improvements

**1. User Context Refresh**
- **Implementation**: Added `refreshUser()` method to CustomAuthProvider
- **Purpose**: Allows profile updates to reflect immediately in Dashboard name and context
- **Usage**: Called after profile save in Settings page

**2. Dashboard Child Switching**
- **Fix**: Removed navigation on child selection in ChildrenTopBar
- **Behavior**: Selecting a child now only updates dashboard data locally
- **Context**: Uses SelectedChildContext for state management

**3. Child Profile Tabs Simplified**
- **Removed**: TitiNauta tab from ChildProfileTabs
- **Access**: TitiNauta now accessed only via "Jornada do Desenvolvimento" in sidebar
- **Tabs**: Info, Relatórios, Chat (3 tabs instead of 4)

**4. AI Report Generator (Draft)**
- **Component**: `src/components/educare-app/child/AIReportGenerator.tsx`
- **Features**:
  - Field selection UI with 6 categories (Personal, Biometrics, Birth, Vaccines, Development, Health)
  - 30+ selectable fields for customizable reports
  - Section toggle and select-all functionality
  - Ready for backend integration (feature flagged as "Em breve")
- **Integration**: Added to ChildReportsTab with tabbed interface

**5. Welcome Hub for Parents**
- **Added**: "Início" link to parent sidebar navigation
- **Route**: `/educare-app/welcome`
- **Purpose**: Parents now have access to WelcomeHub content

### 2025-12-31: WhatsApp Integration & Password Recovery Complete

**1. Evolution API Direct Integration**
- **Implementation**: Replaced webhook fallback with direct Evolution API calls
- **API**: https://api.educareapp.com.br (instance: `educare-chat`)
- **Version**: 2.3.7 (verified)
- **Features**:
  - Direct message sending via `/message/sendText` endpoint
  - Automatic retry with exponential backoff
  - Timeout handling (10s default, 15s for sensitive messages)
  - Fallback to webhook if Evolution API fails
  - Detailed logging with message IDs

**2. Password Recovery via WhatsApp (NEW)**
- **Endpoint**: `POST /api/auth/forgot-password-by-phone`
- **Flow**:
  1. User provides phone number
  2. System generates secure reset token (1 hour expiration)
  3. Sends formatted WhatsApp message with reset link
  4. User clicks link and updates password via `/api/auth/reset-password`
- **Features**:
  - Same security as email-based recovery (token validation, expiration)
  - Formatted messages with emojis and formatting
  - Fallback error handling (doesn't leak user existence)
  - Phone number normalization applied

**3. Complete Authentication Flows Implemented**
- ✅ Register: Email/Phone with normalization
- ✅ Login: Email, Phone, or Temporary Password
- ✅ Password Recovery: Email (`/forgot-password`) or WhatsApp (`/forgot-password-by-phone`)
- ✅ Phone Verification: Code sent via WhatsApp
- ✅ Temporary Password: For phone-based login

**Files Updated**:
- `educare-backend/src/controllers/authController.js` (added `forgotPasswordByPhone`)
- `educare-backend/src/routes/authRoutes.js` (added `/forgot-password-by-phone`)
- `educare-backend/src/services/whatsappService.js` (updated with Evolution API integration)

**Testing Results**: ✅
- Forgot password by phone: Message sent via Evolution API (ID: 3EB02D586DF61C4BEF285A)
- Reset token generated and stored
- Message format: Formatted with emojis, clear instructions, 1-hour expiration notice

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
