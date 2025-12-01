# Educare+ Platform

## Overview

Educare+ is a comprehensive digital platform for early childhood development and maternal health monitoring. It connects parents, caregivers, educators, and healthcare professionals to support child development through interactive assessments, personalized guidance, and collaborative care.

The platform features an AI-powered assistant called TitiNauta that guides families through developmental milestones, provides WhatsApp integration for remote communication, and offers multi-level subscription management for SaaS operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite build tooling

The frontend is a single-page application using:
- **UI Components**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: React hooks for local state, @tanstack/react-query for server state caching and synchronization
- **Routing**: React Router for client-side navigation
- **Forms**: react-hook-form with zod validation via @hookform/resolvers
- **Authentication**: Custom auth context provider wrapping JWT token management

**Key Design Patterns**:
- Component-based architecture with clear separation between presentational and container components
- Custom hooks for shared business logic (e.g., `useTitiNautaJourneyQuestions`, `useJourneyContent`)
- TypeScript interfaces for type safety across the application
- Responsive-first design using Tailwind's utility classes

**Major Features**:
- **TitiNauta Journey Interface**: Interactive chat-style interface for child development tracking, organized by age-based milestones with quiz functionality
- **Quiz System**: Multi-domain developmental assessments (motor, cognitive, language, social, sensory, emotional) with progress tracking
- **Child Management**: Profile creation and management with health records, diary entries, and developmental milestone tracking
- **Maternal Health**: Pregnancy tracking with automatic week calculation, health metrics monitoring, and symptom logging
- **Professional Collaboration**: Team-based child assignments, secure data sharing, and integrated communication

### Backend Architecture

**Framework**: Node.js with Express.js and Sequelize ORM

The backend follows a layered MVC architecture:
- **Controllers**: Handle HTTP requests, input validation, business logic orchestration
- **Models**: Sequelize models defining database schema and relationships
- **Routes**: Express routers organizing endpoints by feature domain
- **Middleware**: Authentication, authorization (RBAC), request validation, error handling

**Authentication**: JWT-based with access tokens (1-hour expiry) and refresh tokens. Row-Level Security (RLS) enforced at the database layer ensures users can only access authorized data.

**API Design**:
- RESTful endpoints with consistent naming conventions
- Separate internal (`/api/`) and external (`/api/external/`) API routes
- OpenAPI/Swagger documentation for external APIs
- Comprehensive error handling with structured error responses

**Key Endpoints**:
- Auth: `/api/auth/*` - login, register, password reset
- Children: `/api/children/*` - CRUD operations, health records
- Journey/Quiz: `/api/journey/*`, `/api/journey-bot/*` - developmental assessments and progress
- External Integration: `/api/external/*` - API-key authenticated endpoints for third-party systems
- Admin: `/api/admin/*` - content management, user administration

### Data Storage

**Primary Database**: PostgreSQL accessed via Sequelize ORM

**Schema Highlights**:
- **Users & Roles**: `users`, `profiles`, `roles`, `permissions` with many-to-many relationships for RBAC
- **Children**: `children` linked to parent profiles with one-to-many relationships
- **Assessments**: `quiz_questions`, `user_quiz_progress`, `journey_bot_responses` tracking developmental evaluations
- **Journey System**: `journey_v2*` tables organizing content by weeks, topics, and quizzes with user progress tracking
- **Health**: `maternal_health_records`, `pregnancy_tracking`, `child_health_records`, `child_diary_entries`
- **Subscriptions**: `subscription_plans`, `user_subscriptions` supporting SaaS billing cycles and trial periods

**Database Triggers**: Automatic pregnancy week calculation on insert/update of `pregnancy_tracking` records

**Row-Level Security**: Policies ensure parents see only their children's data and professionals see only assigned children

### Automation Layer

**n8n Workflow**: Complex automation defined in `IA MAvi Titinauta.json` (77 nodes)

The workflow orchestrates:
- WhatsApp message ingestion via webhooks
- AI processing using OpenAI (chat completions, audio transcription, image analysis)
- Conversation context management with chat memory
- Conditional routing based on message type and sender
- Response generation and delivery back to WhatsApp
- Group management for specialized parent communities

**Flow**: Webhook → Media Processing → AI Analysis → Response Generation → WhatsApp Send

## External Dependencies

### Third-Party Services

**Supabase**: Mentioned in documentation as alternative backend for auth and database, though current implementation uses custom Node/Express backend. Project includes Supabase client SDK but may not be actively used.

**WhatsApp Business API**: Integration for conversational interfaces enabling:
- TitiNauta assistant chat via WhatsApp
- Group messaging for parents and professionals
- Media sharing (images, videos, documents)
- Real-time notifications and reminders

**OpenAI API**: Powers AI features in the n8n workflow:
- Natural language processing for chat responses
- Audio transcription for voice messages
- Image analysis for uploaded photos
- Context-aware recommendations

**Asaas Payment Gateway**: Payment processing for subscription billing (Postman collection included for API testing)

### Key NPM Dependencies

**Frontend**:
- `react` v18+ and `react-dom` - UI framework
- `@tanstack/react-query` - Server state management
- `react-hook-form` + `zod` - Form handling and validation
- `@supabase/supabase-js` - Supabase client (if used)
- `date-fns` - Date manipulation
- `recharts` - Data visualization
- `html2canvas` - Progress sharing feature
- Radix UI components - Accessible UI primitives

**Backend**:
- `express` - Web framework
- `sequelize` + `pg` - PostgreSQL ORM and driver
- `jsonwebtoken` + `bcryptjs` - Authentication
- `express-validator` - Input validation
- `swagger-jsdoc` + `swagger-ui-express` - API documentation
- `cors` - Cross-origin request handling

### Infrastructure

**Development (Replit)**:
- Frontend: Vite dev server on port 5000 (proxied via Replit)
- Backend: Node.js/Express on port 3001
- External PostgreSQL database at `app.voipsimples.com.br`

**Replit Workflow Configuration**:
- Backend workflow uses `OPENAI_API_KEY=$(printenv OPENAI_API_KEY)` pattern to propagate Replit integration secrets to child processes
- When editing workflow commands, preserve environment variable propagation to avoid breaking integrations

**Health Check Endpoints**:
- `/health` - Basic health status
- `/health/detailed` - Full status including database, integrations (OpenAI, WhatsApp, Stripe)

**Production Deployment**: 
- VPS hosting recommended with PM2 process manager
- Nginx reverse proxy for frontend and API routing
- SSL/TLS via Let's Encrypt
- PostgreSQL database server

**Domains**: 
- Frontend: `educare.whatscall.com.br`
- API: `api.educare.whatscall.com.br`

## Recent Changes

**2025-12-01 (Stripe Integration)**: 
- Implemented full Stripe integration replacing Asaas payment gateway
- Created stripeClient.js with credential caching (5-min TTL) using Replit connector API
- Created stripeService.js for Stripe business logic (customers, checkout, subscriptions, products)
- Created stripeRoutes.js with endpoints: /config, /checkout, /portal, /subscriptions
- Created webhookHandlers.js with event handlers for subscription lifecycle
- Webhook routes added BEFORE express.json() middleware for signature verification
- Added User model fields: stripeCustomerId, stripeSubscriptionId
- Health check endpoint shows Stripe integration status

**2025-12-01 (Stripe Frontend Integration)**:
- Created stripeService.ts with types and API functions for frontend-backend communication
- Created SubscriptionPage.tsx with role-based access control (owner-only management)
- Added subscription routes to App.tsx: /educare-app/subscription, /success, /cancel
- Fixed vite.config.ts with allowedHosts: true for Replit proxy compatibility
- Fixed redirect URLs in stripeRoutes.js to include /educare-app prefix
- Added isOwner middleware to subscription management endpoints (portal, cancel, resume, change-plan)
- Updated index.ts exports with aliases to avoid conflicts with legacy subscriptionService

**2025-12-01 (OpenAI Integration)**: 
- Fixed OpenAI integration propagation in Replit workflows using $(printenv OPENAI_API_KEY) pattern
- TitiNauta AI service layer implemented with lazy initialization
- Health check endpoints added for monitoring integrations status
- Removed hardcoded localhost URLs in favor of environment variables
- Security fix: Removed debug middleware that logged credentials

## Configuration Status

### ✅ Completed
- Stripe integration fully functional (webhook configured with STRIPE_WEBHOOK_SECRET)
- Frontend subscription page with role-based access (owner-only)
- Vite configuration fixed for Replit proxy compatibility
- Redirect URLs fixed with /educare-app prefix
- Both workflows running successfully (Backend on :3001, Frontend on :5000)

## Stripe Products (Created 2025-12-01)

| Plan Name | Product ID | Price ID | Amount |
|-----------|------------|----------|--------|
| Plano Gratuito | prod_TWeBe70JHiDtAJ | N/A | Free |
| Plano Básico | prod_TWeBzLEeRuuo1n | price_1SZasf2ektcrjgYMzNektZH5 | R$29.90/month |
| Plano Premium | prod_TWeByYcEC87pue | price_1SZasg2ektcrjgYMZdsPovZv | R$59.90/month |
| Plano Profissional | prod_TWeB90T8wtxDNW | price_1SZash2ektcrjgYM8gxlStFE | R$149.90/month |

## Implementation Complete ✅

### Stripe Integration Status
- **Webhook Secret**: Configured ✅
- **Products**: Created (4 plans) ✅
- **Prices**: Created (3 paid plans) ✅
- **Frontend**: Subscription page ready ✅
- **Backend**: All endpoints implemented ✅

## Quick Start Guide

### 1. Configure Webhook in Stripe Dashboard
See detailed guide in **STRIPE_WEBHOOK_SETUP.md**

**Quick steps:**
1. Go to https://dashboard.stripe.com → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events (see STRIPE_WEBHOOK_SETUP.md for complete list)
4. Copy signing secret and set as `STRIPE_WEBHOOK_SECRET` (already done)

### 2. Test Webhook Configuration
```bash
curl http://localhost:3001/api/stripe/test-webhook
```

Expected response:
```json
{
  "success": true,
  "status": "WEBHOOK_CONFIGURED",
  "expectedEvents": ["customer.subscription.created", ...]
}
```

### 3. Test End-to-End Subscription Flow
1. Login as **owner** role user
2. Navigate to `/educare-app/subscription`
3. Click **"Assinar Plano"** button
4. Complete payment with test card: **4242 4242 4242 4242**
5. Verify webhook events in Stripe Dashboard → Developers → Webhooks
6. Check backend logs for webhook processing

### 4. View Created Plans
```bash
curl http://localhost:3001/api/stripe/products-with-prices
```

Shows all 4 plans with pricing and features.

## API Endpoints Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/stripe/config` | GET | Public | Get Stripe publishable key |
| `/api/stripe/products-with-prices` | GET | Public | List all products and prices |
| `/api/stripe/checkout` | POST | Token | Create checkout session |
| `/api/stripe/subscription` | GET | Token | Get user's current subscription |
| `/api/stripe/customer-portal` | POST | Owner | Link to Stripe billing portal |
| `/api/stripe/seed-plans` | POST | Owner | Create/verify subscription plans |
| `/api/stripe/test-webhook` | GET | Public | Test webhook configuration |
| `/api/stripe/webhook` | POST | Internal | Process webhook events |

## Troubleshooting

**Webhook not receiving events?**
- See STRIPE_WEBHOOK_SETUP.md → Troubleshooting section

**Tests cards not working?**
- Use: `4242 4242 4242 4242` (visa)
- Exp: any future date (e.g., 12/25)
- CVC: any 3 digits (e.g., 123)

**Database empty after checkout?**
- Check backend logs for webhook processing
- Verify webhook secret matches Stripe Dashboard
- Confirm webhook endpoint is receiving POST requests

## WhatsApp Integration (Future)
- Configure n8n workflow with Replit backend API endpoints
- Implement WhatsApp webhook: `/api/whatsapp/webhook`
- Test message flow: WhatsApp → n8n → Backend → OpenAI → Response