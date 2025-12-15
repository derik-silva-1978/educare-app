# Sistema de Gestão de Conteúdo - Documentação Completa

## 📋 Visão Geral

Sistema híbrido para distribuição de conteúdo (Notícias, Treinamentos, Cursos) com:
- **Autenticação**: JWT via Educare+
- **Pagamentos**: Stripe (para conteúdo premium)
- **Vídeos**: Vimeo (hospedagem e streaming)
- **Dados**: PostgreSQL externo (tabelas estruturadas)
- **Implementação**: Faseada (Notícias → Treinamentos → Cursos)

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        Educare+ Frontend                        │
│  (Gestão de Conteúdo + Dashboard + Player de Conteúdo)        │
└────────────────┬──────────────────────────────┬─────────────────┘
                 │                              │
        ┌────────▼────────┐          ┌──────────▼─────────┐
        │  JWT + RLS      │          │  Stripe SDK        │
        │  (Auth)         │          │  (Pagamentos)      │
        └────────┬────────┘          └──────────┬─────────┘
                 │                              │
        ┌────────▼──────────────────────────────▼─────────┐
        │   Node.js Backend (Express)                     │
        │  - Content API                                  │
        │  - Vimeo Integration                            │
        │  - Access Control                               │
        │  - Progress Tracking                            │
        └────────┬──────────────────────────────┬─────────┘
                 │                              │
        ┌────────▼────────┐          ┌──────────▼─────────┐
        │ PostgreSQL Ext. │          │  Vimeo API         │
        │ (Content DB)    │          │  (Video Hosting)   │
        │ (Access Logs)   │          │  (Streaming)       │
        └─────────────────┘          └────────────────────┘
```

---

## 📊 Schema de Banco de Dados

### Tabelas Principais

#### 1. `content_access` - Controle de Acesso
```sql
- id (uuid, PK)
- content_id (uuid, FK → content_items)
- user_id (uuid, FK → users)
- access_type ('free' | 'paid' | 'subscription')
- payment_id (stripe payment_intent_id, opcional)
- granted_at (timestamp)
- expires_at (timestamp, nullable)
- access_level ('preview' | 'full')
```

#### 2. `content_videos` - Integração Vimeo
```sql
- id (uuid, PK)
- content_id (uuid, FK → content_items)
- vimeo_video_id (varchar)
- vimeo_embed_code (text)
- thumbnail_url (varchar)
- duration_seconds (integer)
- transcription (text, nullable)
- created_at (timestamp)
```

#### 3. `user_progress` - Rastreamento de Progresso
```sql
- id (uuid, PK)
- user_id (uuid, FK → users)
- content_id (uuid, FK → content_items)
- progress_percent (integer, 0-100)
- watched_duration_seconds (integer)
- completed_at (timestamp, nullable)
- last_accessed_at (timestamp)
- notes (text, nullable)
```

#### 4. `training_modules` - Estrutura de Treinamento
```sql
- id (uuid, PK)
- training_id (uuid, FK → content_items)
- order (integer)
- title (varchar)
- description (text)
- duration_minutes (integer)
- created_at (timestamp)
```

#### 5. `training_lessons` - Lições de Treinamento
```sql
- id (uuid, PK)
- module_id (uuid, FK → training_modules)
- order (integer)
- title (varchar)
- content_type ('video' | 'quiz' | 'reading' | 'assignment')
- video_id (uuid, FK → content_videos, nullable)
- content_data (jsonb)
- created_at (timestamp)
```

#### 6. `course_modules` - Estrutura de Curso
```sql
- id (uuid, PK)
- course_id (uuid, FK → content_items)
- order (integer)
- title (varchar)
- description (text)
- prerequisite_module_id (uuid, FK → course_modules, nullable)
- created_at (timestamp)
```

#### 7. `course_lessons` - Lições de Curso
```sql
- id (uuid, PK)
- module_id (uuid, FK → course_modules)
- order (integer)
- title (varchar)
- content_type ('video' | 'quiz' | 'assignment' | 'project')
- video_id (uuid, FK → content_videos, nullable)
- content_data (jsonb)
- min_score_to_pass (integer, nullable)
- created_at (timestamp)
```

#### 8. `content_pricing` - Modelos de Preço
```sql
- id (uuid, PK)
- content_id (uuid, FK → content_items)
- price_type ('free' | 'one_time' | 'subscription')
- price_usd (decimal)
- currency (varchar, default 'USD')
- billing_period ('one_time' | 'monthly' | 'yearly', nullable)
- trial_days (integer, nullable)
- stripe_price_id (varchar, nullable)
- created_at (timestamp)
```

---

## 🔄 Fases de Implementação

### FASE 1: Notícias (Semanas 1-2)
**Escopo**: Conteúdo simples, acesso público
- Estrutura básica do banco
- Upload/exibição de imagens (via URL externo)
- Link CTA → URL externa (blog/site externo)
- Sem pagamento envolvido

**Tabelas**: `content_access` (apenas logs), `content_videos` (opcional)

### FASE 2: Treinamentos (Semanas 3-4)
**Escopo**: Conteúdo estruturado com vídeos
- Integração Vimeo
- Player interno com vídeos embed
- Rastreamento de progresso
- Controle de acesso (free/paid)
- Integração Stripe para pagamento único

**Tabelas**: `training_modules`, `training_lessons`, `content_videos`, `user_progress`, `content_pricing`

### FASE 3: Cursos (Semanas 5-8)
**Escopo**: Conteúdo avançado, certificação
- Múltiplos módulos com prerequisitos
- Quizzes e assignments
- Certificados
- Progresso por lição
- Assinatura Stripe

**Tabelas**: `course_modules`, `course_lessons`, `user_progress` (expandido), `certificates`

---

## 🔐 Segurança & Acesso

### Row-Level Security (RLS) PostgreSQL
```sql
-- Usuários veem apenas seu próprio progresso
CREATE POLICY user_progress_select
  ON user_progress
  FOR SELECT
  USING (user_id = current_user_id());

-- Apenas proprietário/admin edita conteúdo
CREATE POLICY content_update
  ON content_items
  FOR UPDATE
  USING (created_by = current_user_id() OR is_owner());
```

### JWT Validation
- Token contém: `user_id`, `role`, `permissions`
- Middleware valida antes de cada acesso
- Refresh tokens para sessões longas

### Stripe Webhook Validation
- Signature verification para webhooks
- Eventos: `payment_intent.succeeded`, `customer.subscription.updated`

---

## 💳 Integração Stripe

### Products & Prices
```
Stripe Setup:
├── Product: "Treinamento XYZ"
│   └── Price: $29.99 (one_time)
├── Product: "Plano Profissional"
│   └── Price: $9.99/month (recurring)
└── Product: "Curso Avançado"
    └── Price: $99.99 (one_time)
```

### Fluxo de Pagamento
1. Usuário clica "Acessar Conteúdo Pago"
2. Backend cria `checkout.session` (Stripe)
3. Usuário redirecionado para Stripe Checkout
4. Post-pagamento: webhook `payment_intent.succeeded`
5. Backend cria registro `content_access` com `expires_at`
6. Usuário redireciona para `/content/:id` com acesso liberado

---

## 🎬 Integração Vimeo

### Setup Vimeo
1. Criar conta Vimeo
2. Gerar Access Token
3. Configurar Pasta/Projeto por tipo de conteúdo
4. Configurar embed restricto (domain whitelist)

### Fluxo de Vídeo
1. Upload do vídeo para Vimeo (backend)
2. Vimeo retorna: `video_id`, `embed_code`, `thumbnail_url`
3. Salvar em `content_videos`
4. Frontend renderiza `<iframe>` com embed
5. Rastrear visualização (progress_percent)

### Ambiente
```env
VIMEO_ACCESS_TOKEN=<seu_token>
VIMEO_DEFAULT_FOLDER_ID=<id_pasta>
VIMEO_RESTRICTED_DOMAINS=https://educare.com,https://app.educare.com
```

---

## 📱 Frontend Components (Preview)

### Structures
```
/src/pages/content/
├── ContentPlayer.tsx          # Player unificado
├── NewsDetail.tsx             # Visão de notícia
├── TrainingView.tsx           # Treinamento (módulos + progresso)
├── CourseView.tsx             # Curso (módulos + quizzes)
├── ProgressTracker.tsx        # Barra de progresso
└── PaymentModal.tsx           # Modal Stripe Checkout
```

---

## 🚀 Endpoints Backend (Preview)

### Public
```
GET  /api/content/:id/preview              # Info básica + preview
GET  /api/content/:id/can-access           # Verifica se user tem acesso
```

### Autenticado
```
POST /api/content/:id/access                # Solicita acesso (free) ou pagamento
GET  /api/user/progress                    # Progresso do usuário
PUT  /api/user/progress/:content_id         # Atualiza progresso
POST /api/content/:id/mark-complete        # Marca como completo
GET  /api/training/:id/modules             # Módulos do treinamento
GET  /api/course/:id/modules               # Módulos do curso
```

### Webhooks
```
POST /webhooks/stripe                      # Stripe events
POST /webhooks/vimeo                       # Vimeo events (optional)
```

---

## 📋 Checklist por Fase

### FASE 1 ✓ Notícias
- [ ] Schema `content_access` criado
- [ ] Endpoint GET `/api/content/:id`
- [ ] Frontend NewsDetail.tsx
- [ ] CTA links funcionando
- [ ] Testes end-to-end

### FASE 2 ✓ Treinamentos
- [ ] Schema `training_modules`, `training_lessons`, `content_videos`
- [ ] Integração Vimeo API
- [ ] Endpoints de treinamento
- [ ] TrainingView.tsx com progresso
- [ ] Stripe integration
- [ ] Tests (Unit + E2E)

### FASE 3 ✓ Cursos
- [ ] Schema `course_modules`, `course_lessons`
- [ ] CourseView.tsx com quizzes
- [ ] Certificados (geração + download)
- [ ] Assinatura Stripe
- [ ] Progresso por lição
- [ ] Final testing

---

## 🔗 Próximas Documentações

1. **PRD_FASE_1_NOTICIAS.md** - Detalhes Fase 1
2. **PRD_FASE_2_TREINAMENTOS.md** - Detalhes Fase 2
3. **PRD_FASE_3_CURSOS.md** - Detalhes Fase 3
4. **PROMPTS_IMPLEMENTACAO.md** - Prompts para dev
5. **VIMEO_INTEGRATION_GUIDE.md** - Setup Vimeo
6. **STRIPE_INTEGRATION_GUIDE.md** - Setup Stripe
7. **DATABASE_SCHEMA.sql** - SQL completo
