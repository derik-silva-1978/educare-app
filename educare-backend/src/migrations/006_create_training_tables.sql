-- Migration: Create training tables for FASE 2
-- Description: Estrutura para sistema de treinamentos com vídeos Vimeo e progresso

-- Tabela de vídeos (integração Vimeo)
CREATE TABLE IF NOT EXISTS content_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  vimeo_video_id VARCHAR(255) UNIQUE NOT NULL,
  vimeo_embed_code TEXT,
  thumbnail_url VARCHAR(500),
  duration_seconds INTEGER,
  transcription TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de módulos de treinamento
CREATE TABLE IF NOT EXISTS training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de lições dentro de módulos
CREATE TABLE IF NOT EXISTS training_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  title VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL DEFAULT 'video', -- 'video', 'quiz', 'reading', 'exercise'
  video_id UUID REFERENCES content_videos(id) ON DELETE SET NULL,
  content_data JSONB,
  duration_minutes INTEGER,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de progresso do usuário
CREATE TABLE IF NOT EXISTS user_content_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES training_lessons(id) ON DELETE CASCADE,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  watched_duration_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_content_progress UNIQUE (user_id, content_id, lesson_id)
);

-- Tabela de preços de conteúdo (integração Stripe)
CREATE TABLE IF NOT EXISTS content_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID UNIQUE NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  price_type VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'one_time', 'subscription'
  price_brl DECIMAL(10, 2),
  price_usd DECIMAL(10, 2),
  billing_period VARCHAR(50), -- 'one_time', 'monthly', 'yearly'
  stripe_price_id VARCHAR(255),
  stripe_product_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de matrículas/acessos
CREATE TABLE IF NOT EXISTS user_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'pending', 'active', 'completed', 'cancelled', 'expired'
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_enrollment UNIQUE (user_id, content_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_content_videos_content_id ON content_videos(content_id);
CREATE INDEX IF NOT EXISTS idx_training_modules_training_id ON training_modules(training_id);
CREATE INDEX IF NOT EXISTS idx_training_modules_order ON training_modules(training_id, order_index);
CREATE INDEX IF NOT EXISTS idx_training_lessons_module_id ON training_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_training_lessons_order ON training_lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_content_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content ON user_content_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user ON user_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_content ON user_enrollments(content_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_status ON user_enrollments(status);
