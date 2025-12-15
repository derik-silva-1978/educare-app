# Prompts para Implementação das Fases

## PROMPT FASE 1: Notícias

```
Implemente a Fase 1 (Notícias) do Sistema de Gestão de Conteúdo:

1. Crie a tabela `content_access` no PostgreSQL externo com RLS
2. Adicione colunas a `content_items` (vimeo_video_id, is_featured, read_time_minutes, seo_slug, view_count)
3. Implemente endpoints:
   - GET /api/content/:id/public (notícia completa)
   - GET /api/content/public?type=news&limit=10 (lista)
   - POST /api/admin/content/:id/view (registra visualização)
4. Crie componente NewsDetail.tsx
5. Adicione testes E2E para fluxo completo

Referência: docs/FASE_1_NOTICIAS_PRD.md
```

## PROMPT FASE 2: Treinamentos

```
Implemente a Fase 2 (Treinamentos) do Sistema de Gestão de Conteúdo:

1. Crie tabelas:
   - content_videos (Vimeo integration)
   - training_modules
   - training_lessons
   - user_progress
   - content_pricing

2. Integre Vimeo:
   - Setup VIMEO_ACCESS_TOKEN, VIMEO_ACCOUNT_ID
   - Implementar upload de vídeos
   - Salvar embed codes

3. Integre Stripe:
   - Setup de Products/Prices
   - Checkout session
   - Webhook de pagamento

4. Implemente endpoints:
   - GET /api/training/:id
   - POST /api/training/:id/enroll
   - GET /api/user/training/:id/progress
   - PUT /api/training/:id/lesson/:lesson_id/progress

5. Frontend TrainingView.tsx com:
   - Barra de progresso
   - Vimeo player
   - Controle de acesso

Referência: docs/FASE_2_TREINAMENTOS_PRD.md
```

## PROMPT FASE 3: Cursos

```
Implemente a Fase 3 (Cursos) do Sistema de Gestão de Conteúdo:

1. Crie tabelas:
   - course_modules (com prerequisites)
   - course_lessons (com scoring)
   - certificates
   - lesson_submissions

2. Implemente assinatura Stripe (recurring):
   - Setup Product com trial_days
   - Webhook de renovação/cancelamento
   - Acesso contínuo

3. Implemente certificados:
   - Geração PDF automática
   - Assinatura digital
   - Verificação pública

4. Implemente endpoints:
   - GET /api/course/:id
   - POST /api/course/:id/enroll
   - PUT /api/course/:id/lesson/:lesson_id/submit
   - GET /api/user/course/:id/progress
   - GET /api/user/certificates

5. Frontend CourseView.tsx com:
   - Quizzes interativas
   - Progresso de lição
   - Assignments

Referência: docs/FASE_3_CURSOS_PRD.md
```

## Ordem de Execução
1. Primeiro: FASE 1 (Notícias) - Baseline simples
2. Depois: FASE 2 (Treinamentos) - Add Vimeo + Stripe básico
3. Por fim: FASE 3 (Cursos) - Assinatura + Certificados
