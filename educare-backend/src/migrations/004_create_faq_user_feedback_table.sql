-- Migration: Criar tabela faq_user_feedback para rastrear votos únicos
-- Status: Safe (CREATE TABLE IF NOT EXISTS)
-- Data: Dezembro 2025

BEGIN;

CREATE TABLE IF NOT EXISTS faq_user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  faq_id UUID NOT NULL,
  
  user_identifier VARCHAR(255) NOT NULL,
  
  identifier_type VARCHAR(20) NOT NULL DEFAULT 'ip' CHECK (identifier_type IN ('ip', 'user_id', 'session')),
  
  feedback_type VARCHAR(20) NOT NULL CHECK (feedback_type IN ('upvote', 'downvote')),
  
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_faq_feedback_faq_id FOREIGN KEY (faq_id) REFERENCES app_faqs(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_faq_user_vote ON faq_user_feedback(faq_id, user_identifier);

CREATE INDEX IF NOT EXISTS idx_feedback_faq_id ON faq_user_feedback(faq_id);

CREATE INDEX IF NOT EXISTS idx_feedback_user ON faq_user_feedback(user_identifier);

COMMIT;
