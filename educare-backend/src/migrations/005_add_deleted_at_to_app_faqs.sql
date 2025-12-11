-- Migration: Adicionar coluna deleted_at à tabela app_faqs
-- Status: Safe (ALTER TABLE ADD COLUMN IF NOT EXISTS)
-- Data: Dezembro 2025

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'app_faqs' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE app_faqs ADD COLUMN deleted_at TIMESTAMP DEFAULT NULL;
    CREATE INDEX IF NOT EXISTS idx_faqs_deleted ON app_faqs(deleted_at);
    RAISE NOTICE 'Coluna deleted_at adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna deleted_at já existe';
  END IF;
END $$;

COMMIT;
