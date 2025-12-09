-- Migration: Create Segmented Knowledge Base Tables
-- Phase: 3-UPGRADE
-- Date: December 2025
-- Description: Creates kb_baby, kb_mother, kb_professional tables for RAG segmentation

-- ============================================================================
-- TABLE: kb_baby - Knowledge base for baby/child development content
-- ============================================================================
CREATE TABLE IF NOT EXISTS kb_baby (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  description TEXT,
  embedding FLOAT8[],
  source_type VARCHAR(50) NOT NULL,
  file_search_id VARCHAR(255),
  file_path VARCHAR(500),
  original_filename VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  age_range VARCHAR(50),
  domain VARCHAR(50),
  subcategory VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  migrated_from UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kb_baby_is_active ON kb_baby(is_active);
CREATE INDEX IF NOT EXISTS idx_kb_baby_file_search_id ON kb_baby(file_search_id);
CREATE INDEX IF NOT EXISTS idx_kb_baby_age_range ON kb_baby(age_range);
CREATE INDEX IF NOT EXISTS idx_kb_baby_domain ON kb_baby(domain);
CREATE INDEX IF NOT EXISTS idx_kb_baby_tags ON kb_baby USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_kb_baby_created_at ON kb_baby(created_at DESC);

-- ============================================================================
-- TABLE: kb_mother - Knowledge base for maternal health content
-- ============================================================================
CREATE TABLE IF NOT EXISTS kb_mother (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  description TEXT,
  embedding FLOAT8[],
  source_type VARCHAR(50) NOT NULL,
  file_search_id VARCHAR(255),
  file_path VARCHAR(500),
  original_filename VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  trimester VARCHAR(20),
  domain VARCHAR(50),
  subcategory VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  migrated_from UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kb_mother_is_active ON kb_mother(is_active);
CREATE INDEX IF NOT EXISTS idx_kb_mother_file_search_id ON kb_mother(file_search_id);
CREATE INDEX IF NOT EXISTS idx_kb_mother_trimester ON kb_mother(trimester);
CREATE INDEX IF NOT EXISTS idx_kb_mother_domain ON kb_mother(domain);
CREATE INDEX IF NOT EXISTS idx_kb_mother_tags ON kb_mother USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_kb_mother_created_at ON kb_mother(created_at DESC);

-- ============================================================================
-- TABLE: kb_professional - Knowledge base for professional/clinical content
-- ============================================================================
CREATE TABLE IF NOT EXISTS kb_professional (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  description TEXT,
  embedding FLOAT8[],
  source_type VARCHAR(50) NOT NULL,
  file_search_id VARCHAR(255),
  file_path VARCHAR(500),
  original_filename VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  specialty VARCHAR(100),
  domain VARCHAR(50),
  subcategory VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  migrated_from UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kb_professional_is_active ON kb_professional(is_active);
CREATE INDEX IF NOT EXISTS idx_kb_professional_file_search_id ON kb_professional(file_search_id);
CREATE INDEX IF NOT EXISTS idx_kb_professional_specialty ON kb_professional(specialty);
CREATE INDEX IF NOT EXISTS idx_kb_professional_domain ON kb_professional(domain);
CREATE INDEX IF NOT EXISTS idx_kb_professional_tags ON kb_professional USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_kb_professional_created_at ON kb_professional(created_at DESC);

-- ============================================================================
-- NOTES:
-- - These tables mirror the structure of knowledge_documents (legacy table)
-- - embedding field uses FLOAT8[] for compatibility with OpenAI embeddings
-- - file_search_id stores OpenAI File Search API references
-- - migrated_from stores reference to legacy document if migrated
-- - Legacy table knowledge_documents is NOT modified
-- ============================================================================
