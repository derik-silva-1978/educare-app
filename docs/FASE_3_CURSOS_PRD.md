# FASE 3: Gestão de Cursos - PRD

## 🏆 Visão Geral
Sistema completo de cursos com múltiplos módulos, quizzes, assignments, certificados e assinatura.

## 🎯 Objetivos
1. Estrutura avançada com módulos e lições
2. Quizzes com scoring
3. Assignments com validação
4. Certificados gerados automaticamente
5. Modelo de assinatura Stripe (recurring)

## 📊 Mudanças no Schema

### Novas Tabelas

#### `course_modules`
```sql
CREATE TABLE course_modules (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES content_items(id),
  order_index INTEGER,
  title VARCHAR,
  description TEXT,
  prerequisite_module_id UUID REFERENCES course_modules(id),
  unlock_after_days INTEGER,
  duration_hours INTEGER,
  created_at TIMESTAMP
);
```

#### `course_lessons`
```sql
CREATE TABLE course_lessons (
  id UUID PRIMARY KEY,
  module_id UUID REFERENCES course_modules(id),
  order_index INTEGER,
  title VARCHAR,
  content_type VARCHAR, -- 'video', 'quiz', 'assignment', 'reading'
  video_id UUID REFERENCES content_videos(id),
  content_data JSONB,
  min_score_to_pass INTEGER,
  created_at TIMESTAMP
);
```

#### `certificates`
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES content_items(id),
  issued_at TIMESTAMP,
  certificate_url VARCHAR,
  verification_code VARCHAR UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);
```

#### `lesson_submissions`
```sql
CREATE TABLE lesson_submissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES course_lessons(id),
  submission_data JSONB,
  score INTEGER,
  submitted_at TIMESTAMP,
  graded_at TIMESTAMP,
  created_at TIMESTAMP
);
```

## 🔌 APIs Necessárias

### GET `/api/course/:id`
Estrutura completa do curso

### POST `/api/course/:id/enroll`
Inscreve em assinatura

### PUT `/api/course/:id/lesson/:lesson_id/submit`
Submete quiz/assignment

### GET `/api/user/course/:id/progress`
Progresso detalhado

### GET `/api/user/certificates`
Lista de certificados do usuário

## 💳 Assinatura Stripe

### Setup
1. Criar Product "Plano Profissional"
2. Criar Price com billing_period=monthly ou yearly
3. Configurar trial_days (ex: 7)

### Fluxo
1. Usuário clica "Inscrever-se"
2. Stripe Portal (manages subscription)
3. Acesso recorrente liberado
4. Renovação automática
5. Cancelamento/downgrade possível

## 🏅 Certificados

### Geração
1. Usuário completa curso (100% progresso)
2. Passou em todos os quizzes (>70% média)
3. Sistema gera PDF com assinatura digital
4. Armazena em `certificates`

### Verificação
- URL pública: `/verify-certificate/:verification_code`
- Mostra dados do curso e data de conclusão

## ✅ Checklist Fase 3
- [ ] Todas as tabelas criadas
- [ ] Assinatura Stripe configurada
- [ ] APIs de course implementadas
- [ ] CourseView.tsx com quizzes
- [ ] Certificados gerando corretamente
- [ ] Testes E2E passar
