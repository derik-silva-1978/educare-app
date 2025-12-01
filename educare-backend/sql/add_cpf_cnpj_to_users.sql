-- Adicionar campo cpf_cnpj na tabela users
-- Data: 09/10/2025
-- Descrição: Campo para armazenar CPF (11 dígitos) ou CNPJ (14 dígitos) do usuário

-- Adicionar coluna
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS cpf_cnpj VARCHAR(18) NULL;

-- Adicionar comentário
COMMENT ON COLUMN public.users.cpf_cnpj IS 'CPF (11 dígitos) ou CNPJ (14 dígitos) do usuário';

-- Adicionar constraint de unicidade (apenas para valores não nulos)
CREATE UNIQUE INDEX IF NOT EXISTS users_cpf_cnpj_unique_idx 
ON public.users (cpf_cnpj) 
WHERE cpf_cnpj IS NOT NULL;

-- Verificar a alteração
SELECT 
    column_name, 
    data_type, 
    character_maximum_length, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users' 
  AND column_name = 'cpf_cnpj';
