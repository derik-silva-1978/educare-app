-- Migration para corrigir conversão de ENUM na tabela activities
-- Problema: PostgreSQL não consegue converter activity_category para enum_activities_category

-- Passo 1: Verificar dados existentes
SELECT DISTINCT category FROM activities;

-- Passo 2: Criar nova coluna temporária com o ENUM correto
DO $$
BEGIN
    -- Criar o ENUM se não existir
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_activities_category') THEN
        CREATE TYPE enum_activities_category AS ENUM(
            'motor', 
            'cognitive', 
            'sensory', 
            'communication', 
            'social_emotional', 
            'nutrition', 
            'baby_health', 
            'maternal_health', 
            'maternal_self_care'
        );
    END IF;
END$$;

-- Passo 3: Adicionar nova coluna temporária
ALTER TABLE activities ADD COLUMN category_new enum_activities_category;

-- Passo 4: Migrar dados existentes (mapear valores antigos para novos)
UPDATE activities SET category_new = 
    CASE 
        WHEN category = 'motor' THEN 'motor'::enum_activities_category
        WHEN category = 'cognitive' THEN 'cognitive'::enum_activities_category
        WHEN category = 'sensory' THEN 'sensory'::enum_activities_category
        WHEN category = 'communication' THEN 'communication'::enum_activities_category
        WHEN category = 'social_emotional' THEN 'social_emotional'::enum_activities_category
        WHEN category = 'nutrition' THEN 'nutrition'::enum_activities_category
        WHEN category = 'baby_health' THEN 'baby_health'::enum_activities_category
        WHEN category = 'maternal_health' THEN 'maternal_health'::enum_activities_category
        WHEN category = 'maternal_self_care' THEN 'maternal_self_care'::enum_activities_category
        ELSE 'motor'::enum_activities_category -- valor padrão para dados inválidos
    END;

-- Passo 5: Remover coluna antiga e renomear nova
ALTER TABLE activities DROP COLUMN category;
ALTER TABLE activities RENAME COLUMN category_new TO category;

-- Passo 6: Adicionar NOT NULL constraint
ALTER TABLE activities ALTER COLUMN category SET NOT NULL;

-- Verificar resultado
SELECT DISTINCT category FROM activities;
