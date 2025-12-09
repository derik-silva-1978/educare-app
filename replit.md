# Educare+ Platform

## Overview
Educare+ is a digital platform for early childhood development and maternal health monitoring. It connects parents, caregivers, educators, and healthcare professionals to support child development through interactive assessments, personalized guidance, and collaborative care. The platform features an AI-powered assistant (TitiNauta), WhatsApp integration for remote communication, and multi-level SaaS subscription management.

## User Preferences
- Preferred communication style: Simple, everyday language.
- UI/UX: Professional with WCAG-compliant contrast ratios.
- Theme toggle: Single-button dark/light mode (no system theme option).
- Incomplete modules marked with visible "Em Desenvolvimento" badges.

## Recent Changes (December 2025)
- **FASE 11-UPGRADE Completa (December 9)**: RAG Auto-Melhoramento com feedback, análise de qualidade, sugestões LLM, dashboard de maturidade
- **FASE 10-UPGRADE Completa (December 9)**: Re-ranking neural, confidence scoring, LLM chunking, data augmentation, context safety, KB versioning
- **FASE 9-UPGRADE Completa (December 9)**: Legacy shutdown service com backup, desativação, rollback, 7 endpoints admin
- **FASE 8-UPGRADE Completa (December 9)**: Flags granulares USE_LEGACY_FALLBACK_FOR_*, modo strict, telemetria avançada
- **FASE 7-UPGRADE Completa (December 9)**: Testes end-to-end + Migração assistida + 4 endpoints admin
- **FASE 6-UPGRADE Completa (December 9)**: Métricas RAG automáticas, 6 endpoints REST, health check
- **FASE 5-UPGRADE Completa (December 8)**: RAG com seleção inteligente de bases segmentadas
- **FASE 4-UPGRADE Completa (December 8)**: Dual write com inferência automática de categoria
- **FASE 3-UPGRADE Completa (December 8)**: 3 tabelas segmentadas (kb_baby, kb_mother, kb_professional)
- **Database Migration (December 9)**: Migrado para novo servidor PostgreSQL (86.48.30.74, user: educareapp, database: educareapp)
- **n8n Workflow v2.0**: Criado `n8n-educare-v2.json` - versão otimizada com 28 nós
- **External API 100% Complete**: All 13 endpoints validated and functional for n8n/WhatsApp integration

## Development Status (December 2025)

### Completed (100%)
✅ **API Externa** - All 13 endpoints implemented and tested
✅ **Frontend UI** - React components with Radix UI + Tailwind
✅ **Authentication** - JWT-based with role-based access control
✅ **Stripe Integration** - Webhook configured and operational
✅ **OpenAI Integration** - API key configured
✅ **Database Models** - Sequelize ORM with 20+ models defined
✅ **Role-based Sidebar** - Proper access levels for Owner/Admin/Professional/Parent
✅ **RAG Upgrade 11 Fases** - Arquitetura segmentada completa com auto-melhoramento

## RAG Segmented Architecture (PHASES 1-11 ✅ COMPLETE)

### Fase 1 - Auditoria ✅
- Análise completa do RAG atual (11 seções)
- Identificação de gaps: single knowledge base, sem segmentação por user type
- Recomendação: arquitetura segmentada (kb_baby, kb_mother, kb_professional)

### Fase 2 - Arquitetura ✅
- Design de 3 tabelas segmentadas + routing inteligente
- Estratégia dual write + fallback automático
- Feature flags para rollback seguro
- Zero regression com sistema legado

### Fase 3 - Tabelas & Models ✅
- 3 tabelas criadas: kb_baby, kb_mother, kb_professional
- Models Sequelize + repositórios
- Índices para performance
- Suporte a OpenAI File Search (file_search_id)

### Fase 4 - Dual Ingestion ✅
- Método insertDualWithCategory() com inferência automática
- Classificação por campos: age_range/domain → baby, specialty → mother/professional
- Rastreamento via migrated_from para auditoria
- Feature flag ENABLE_SEGMENTED_KB para controle

### Fase 5 - RAG Integration ✅
- selectKnowledgeDocuments() com seletor inteligente
- ask() e askWithBabyId() com contexto de módulo
- Fallback automático quando base primária vazia
- Compatibilidade reversa 100%

### Fase 6 - Métricas ✅
- ragMetricsService.js com 6 métodos públicos
- 6 endpoints REST: /api/metrics/rag/*
- Health check com status (healthy/degraded/unhealthy)
- Tracking: success_rate, response_time, fallback_rate, KB usage

### Fase 7 - Testes & Migração ✅
- Suite de testes end-to-end (19 testes)
- migrationService.js: analyze, migrate, validate, rollback
- 4 endpoints admin: /api/admin/migration/*
- Documentação completa (FASE7_UPGRADE_TESTS_MIGRATION.md)

### Fase 8 - Transição Controlada ✅
- Flags granulares: USE_LEGACY_FALLBACK_FOR_BABY/MOTHER/PROFESSIONAL
- Modo strict: opera sem legacy quando flag=false
- Telemetria avançada por módulo
- Endpoints: /api/metrics/rag/shutdown-readiness, /api/metrics/rag/fallback-status
- Documentação: FASE8_UPGRADE_TRANSITION.md

### Fase 9 - Legacy Shutdown ✅
- legacyShutdownService.js com backup, desativação, rollback
- Verificação de pré-condições automática
- Backup imutável (JSONL + CSV + metadata)
- 5 testes de consistência
- 7 endpoints: /api/admin/legacy/*
- Documentação: FASE9_UPGRADE_LEGACY_SHUTDOWN.md

### Fase 10 - Enterprise Optimizations ✅
- **rerankingService.js**: Re-ranking neural pós-busca com diversificação
- **confidenceService.js**: Score de confiança (high/medium/low) + escalação humana
- **chunkingService.js**: Divisão inteligente (simple/hierarchical/semantic)
- **dataAugmentationService.js**: Geração de perguntas, entidades, resumos, tags
- **contextSafetyService.js**: Detecção de dados sensíveis, emergências, conteúdo prejudicial
- **kbVersioningService.js**: Versionamento de KBs com snapshots e rollback
- Documentação: FASE10_UPGRADE_ENTERPRISE.md

### Fase 11 - Auto-Melhoramento ✅
- **ragFeedbackService.js**: Sistema completo de feedback e eventos
- Análise de qualidade automatizada
- Geração de sugestões de melhoria via LLM
- Dashboard de maturidade (score 0-100, levels: initial/basic/developing/mature)
- 7 endpoints: /api/metrics/rag/feedback, /maturity, /quality-analysis, etc.
- Documentação: FASE11_UPGRADE_SELFIMPROVING.md

## Pending Items

### Priority 1 - Testing
- **Stripe Webhook Verification** ⚠️
  - Task: Verify webhook URL registration in Stripe Dashboard
  - Status: Implementation done, testing pending

### Priority 2 - Deployment
- **n8n Workflow Implementation** ✅ READY v2.0
  - Blueprint v2: `educare-backend/docs/n8n-educare-v2.json`
  - Next Step: Import → Configure credentials → Activate

- **Production Deployment Checklist** ⚠️
  - Task: Prepare deployment configuration
  - Status: Pending

## Integration Status

### External API (100% Complete)
- **Status**: Fully validated and ready for n8n/WhatsApp integration
- **Authentication**: API Key via `?api_key=` or `X-API-Key` header
- **Base URL**: `/api/external/`
- **Key Endpoints**:
  - `GET /users/search?phone=` - Find user by phone
  - `GET /users/by-phone/:phone/active-child` - Get active child
  - `GET /children/:id/unanswered-questions` - Next question
  - `POST /children/:id/save-answer` - Save response
  - `GET /children/:id/progress` - Progress tracking

### RAG API Endpoints (Complete)
- **Metrics**: `/api/metrics/rag/*` (10+ endpoints)
- **Admin Migration**: `/api/admin/migration/*` (4 endpoints)
- **Admin Legacy Shutdown**: `/api/admin/legacy/*` (7 endpoints)
- **Feedback**: `/api/metrics/rag/feedback`, `/maturity`, `/suggestions`

### n8n Workflow v2.0 (Ready for Activation)
- **Blueprint v2**: `educare-backend/docs/n8n-educare-v2.json` ✅ (28 nodes)
- **Setup Guide**: `educare-backend/docs/N8N_BLUEPRINT_SETUP.md`
- **Status**: Ready - all branches connected

### WhatsApp (Evolution API)
- **Provider**: Evolution API
- **Documentation**: `educare-backend/docs/WHATSAPP_INTEGRATION.md`
- **Status**: Integrated in blueprint, requires activation

### Cloud Deployment (Digital Ocean)
- **Documentation**: `educare-backend/docs/DIGITAL_OCEAN_DEPLOYMENT.md`
- **Architecture**: 2 droplets ($12 each/month) + PostgreSQL + Redis
- **Estimated Cost**: ~$26/month

### Stripe (Implemented)
- **Status**: Webhook configured
- **Integration**: Replit Stripe connector active

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript and Vite
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: React hooks, @tanstack/react-query
- **Routing**: React Router
- **Forms**: react-hook-form with Zod validation
- **Authentication**: Custom JWT-based context provider

### Backend
- **Framework**: Node.js with Express.js and Sequelize ORM
- **Architecture**: Layered MVC (Controllers, Models, Routes, Middleware)
- **Authentication**: JWT-based (access and refresh tokens) with Row-Level Security (RLS)
- **API Design**: RESTful, internal/external routes, OpenAPI/Swagger

### Data Storage
- **Primary Database**: PostgreSQL via Sequelize ORM (external: 86.48.30.74)
- **Schema Highlights**: Users & Roles (RBAC), Children, Assessments, Journey System, Health, Subscriptions
- **Knowledge Bases**: kb_baby, kb_mother, kb_professional (segmented), knowledge_documents (legacy)

### Automation Layer
- **Tool**: n8n Workflow
- **Functionality**: WhatsApp ingestion, AI processing, context management, response delivery

## Important Files

### RAG Services (FASE 8-11)
- `educare-backend/src/services/knowledgeBaseSelector.js` - Seletor inteligente de KB
- `educare-backend/src/services/ragService.js` - Serviço principal de RAG
- `educare-backend/src/services/ragMetricsService.js` - Métricas e health check
- `educare-backend/src/services/legacyShutdownService.js` - Gerenciamento de shutdown
- `educare-backend/src/services/rerankingService.js` - Re-ranking neural
- `educare-backend/src/services/confidenceService.js` - Scoring de confiança
- `educare-backend/src/services/chunkingService.js` - Chunking inteligente
- `educare-backend/src/services/dataAugmentationService.js` - Data augmentation
- `educare-backend/src/services/contextSafetyService.js` - Auditor de segurança
- `educare-backend/src/services/kbVersioningService.js` - Versionamento de KB
- `educare-backend/src/services/ragFeedbackService.js` - Feedback e auto-melhoramento

### RAG Routes
- `educare-backend/src/routes/metricsRoutes.js` - Endpoints de métricas e feedback
- `educare-backend/src/routes/adminRoutes.js` - Endpoints de legacy shutdown
- `educare-backend/src/routes/migrationRoutes.js` - Endpoints de migração

### Documentation (FASE 8-11)
- `educare-backend/docs/FASE8_UPGRADE_TRANSITION.md`
- `educare-backend/docs/FASE9_UPGRADE_LEGACY_SHUTDOWN.md`
- `educare-backend/docs/FASE10_UPGRADE_ENTERPRISE.md`
- `educare-backend/docs/FASE11_UPGRADE_SELFIMPROVING.md`

### Integration Documentation
- `README_DIAGNOSTICO.md` - Complete integration analysis
- `educare-backend/docs/README_N8N_WORKFLOW.md` - n8n workflow architecture
- `educare-backend/docs/N8N_BLUEPRINT_SETUP.md` - Setup & troubleshooting guide
- `educare-backend/docs/n8n-educare-v2.json` - Importable blueprint
- `educare-backend/docs/WHATSAPP_INTEGRATION.md` - WhatsApp provider options
- `educare-backend/docs/ENV_CONFIG.md` - Environment variables reference

### External API
- `educare-backend/src/controllers/externalApiController.js` - Main controller
- `educare-backend/src/routes/externalApiRoutes.js` - Route definitions
- `educare-backend/src/middlewares/apiKey.js` - API Key validation

## Environment Variables (RAG FASE 8-11)

```bash
# FASE 8 - Transition Control
USE_LEGACY_FALLBACK_FOR_BABY=false
USE_LEGACY_FALLBACK_FOR_MOTHER=false
USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=false

# FASE 9 - Legacy Shutdown
LEGACY_INGESTION_DISABLED=false
BACKUP_PATH=./backups/rag_legacy

# FASE 10 - Enterprise
RERANKING_ENABLED=true
RERANKING_MODEL=gpt-4o-mini
CONFIDENCE_HIGH_THRESHOLD=0.80
CHUNKING_ENABLED=true
AUGMENTATION_ENABLED=true
CONTEXT_SAFETY_ENABLED=true
KB_VERSIONING_ENABLED=true

# FASE 11 - Auto-Improvement
RAG_FEEDBACK_ENABLED=true
RAG_AUTO_ANALYSIS=true
RAG_IMPROVEMENT_MODEL=gpt-4o-mini
```

## Frontend RAG Integration (December 9, 2025 - LIVE)

### New Services Created
✅ `src/services/api/ragService.ts` (200+ lines)
  - askQuestion() - Chamada ao /api/rag/ask
  - submitFeedback() - POST /api/metrics/rag/feedback
  - getAggregateMetrics() - GET /api/metrics/rag/aggregates
  - getModuleStats() - GET /api/metrics/rag/by-module
  - getFeedbackStats() - Estatísticas de feedback
  - getMaturityDashboard() - Dashboard de maturidade
  - getQualityAnalysis() - Análise de qualidade
  - getHealthCheck() - Health check do RAG

### New Components Created
✅ `src/components/educare-app/RAGFeedbackModal.tsx` (250+ lines)
  - Modal de feedback 1-5 stars
  - Tipos de feedback: helpful, not_helpful, incorrect, unclear
  - Comentários opcionais
  - Submissão anônima
  - Integração com ragService

✅ `src/pages/admin/RAGMetricsDashboard.tsx` (350+ lines)
  - 3 Tabs: Visão Geral, Módulos, Detalhes
  - Métricas agregadas em cards
  - Estatísticas por módulo (baby/mother/professional)
  - Health check visual
  - Refresh automático

### Status
- ✅ Backend: 26 endpoints operacionais
- ✅ Frontend Service: Completo com tipos TypeScript
- ✅ Components: RAGFeedbackModal + RAGMetricsDashboard
- ✅ Integration: Pronto para usar em TitiNautaJourney
- ⏳ Next: Integrar RAGFeedbackModal em componentes que usam RAG
