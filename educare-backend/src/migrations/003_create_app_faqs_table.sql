-- Migration: Criar tabela app_faqs para FAQ Dinâmica Contextual
-- Status: Safe (CREATE TABLE IF NOT EXISTS, sem alterações destrutivas)
-- Data: Dezembro 2025

BEGIN;

-- Criar tabela app_faqs com todas as colunas necessárias
CREATE TABLE IF NOT EXISTS app_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Categorização de conteúdo
  category VARCHAR(50) NOT NULL DEFAULT 'child' CHECK (category IN ('child', 'mother', 'system')),
  
  -- Conteúdo da pergunta
  question_text TEXT NOT NULL,
  
  -- Contexto para RAG (opcional)
  answer_rag_context TEXT,
  
  -- Intervalo de vigência em semanas
  min_week INT NOT NULL DEFAULT 0,
  max_week INT NOT NULL DEFAULT 999,
  
  -- Flag de dados semente (seed data)
  is_seed BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Métricas de engajamento
  usage_count INT NOT NULL DEFAULT 0,
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  
  -- Auditoria
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índice composto para filtro por intervalo de semanas (Performance crítica)
-- Usado na query: WHERE min_week <= $1 AND max_week >= $1
CREATE INDEX IF NOT EXISTS idx_faqs_weeks ON app_faqs(min_week, max_week);

-- Índice para ordenação por score de ranqueamento
-- Usado na query: ORDER BY (usage_count * 1.0) + (upvotes * 2.0) - (downvotes * 5.0) DESC
CREATE INDEX IF NOT EXISTS idx_faqs_ranking ON app_faqs(usage_count, upvotes);

-- Índice para filtro por categoria
CREATE INDEX IF NOT EXISTS idx_faqs_category ON app_faqs(category);

-- Índice para filtro por dados semente
CREATE INDEX IF NOT EXISTS idx_faqs_seed ON app_faqs(is_seed);

COMMIT;
