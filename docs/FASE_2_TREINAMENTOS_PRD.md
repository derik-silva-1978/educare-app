# FASE 2: Gestão de Treinamentos - PRD

## 🎓 Visão Geral
Sistema de treinamentos estruturados em módulos com vídeos Vimeo, progresso rastreado e acesso controlado.

## 🎯 Objetivos
1. Estrutura modular de treinamento
2. Vídeos hospedados em Vimeo
3. Rastreamento de progresso por lição
4. Acesso pago/free controlado via Stripe
5. Player integrado com barra de progresso

## 📊 Mudanças no Schema

### Novas Tabelas

#### `content_videos`
```sql
CREATE TABLE content_videos (
  id UUID PRIMARY KEY,
  content_id UUID REFERENCES content_items(id),
  vimeo_video_id VARCHAR UNIQUE NOT NULL,
  vimeo_embed_code TEXT,
  thumbnail_url VARCHAR,
  duration_seconds INTEGER,
  transcription TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `training_modules`
```sql
CREATE TABLE training_modules (
  id UUID PRIMARY KEY,
  training_id UUID REFERENCES content_items(id),
  order_index INTEGER,
  title VARCHAR NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `training_lessons`
```sql
CREATE TABLE training_lessons (
  id UUID PRIMARY KEY,
  module_id UUID REFERENCES training_modules(id),
  order_index INTEGER,
  title VARCHAR NOT NULL,
  content_type VARCHAR, -- 'video', 'quiz', 'reading'
  video_id UUID REFERENCES content_videos(id),
  content_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_progress`
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_id UUID REFERENCES content_items(id),
  progress_percent INTEGER DEFAULT 0,
  watched_duration_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `content_pricing`
```sql
CREATE TABLE content_pricing (
  id UUID PRIMARY KEY,
  content_id UUID REFERENCES content_items(id) UNIQUE,
  price_type VARCHAR, -- 'free', 'one_time', 'subscription'
  price_usd DECIMAL,
  billing_period VARCHAR, -- 'one_time', 'monthly', 'yearly'
  stripe_price_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 APIs Necessárias

### GET `/api/training/:id`
Retorna estrutura completa com módulos

### POST `/api/training/:id/enroll`
Inscreve usuário (free ou inicia pagamento Stripe)

### GET `/api/user/training/:id/progress`
Progresso do usuário no treinamento

### PUT `/api/training/:id/lesson/:lesson_id/progress`
Atualiza progresso da lição

## 🎬 Integração Vimeo

### Vimeo API Setup
```env
VIMEO_ACCESS_TOKEN=<token>
VIMEO_ACCOUNT_ID=<account_id>
VIMEO_EMBED_RESTRICT_DOMAINS=educare.com
```

### Fluxo Upload
1. Backend recebe vídeo
2. Valida (tamanho, formato)
3. Faz upload para Vimeo
4. Vimeo retorna video_id
5. Salva em `content_videos`
6. Frontend renderiza embed

## 💳 Integração Stripe

### Setup
1. Criar Product "Treinamento XYZ" no Stripe
2. Criar Price com billing_period
3. Salvar stripe_price_id em DB

### Fluxo Compra
1. Usuário clica "Acessar"
2. Backend cria checkout session
3. Usuário paga
4. Webhook confirma
5. Acesso liberado

## ✅ Checklist Fase 2
- [ ] Tabelas criadas e migradas
- [ ] Vimeo integration implementada
- [ ] Stripe checkout funcionando
- [ ] Endpoints de progresso
- [ ] TrainingView.tsx renderizado
- [ ] Testes E2E passar
