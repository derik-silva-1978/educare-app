-- =============================================================================
-- EDUCARE+ - Criar Usuarios Dedicados para PostgreSQL
-- 
-- IMPORTANTE: Execute este script DENTRO do container PostgreSQL:
--   docker exec -it <postgres_container> psql -U postgres
--
-- Substitua as senhas abaixo por senhas fortes antes de executar!
-- =============================================================================

-- ============================================================
-- PASSO 1: Resetar senha do superuser postgres (se necessario)
-- Use a mesma senha que esta no POSTGRES_PASSWORD do container
-- ============================================================

-- Descomente a linha abaixo se precisar resetar a senha do postgres
-- ALTER USER postgres WITH PASSWORD 'SUA_SENHA_POSTGRES_ATUAL';

-- ============================================================
-- PASSO 2: Criar usuario dedicado para o Backend Educare
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'educare_app') THEN
    CREATE ROLE educare_app WITH LOGIN PASSWORD 'TROCAR_SENHA_EDUCARE_FORTE_2026';
    RAISE NOTICE 'Usuario educare_app criado com sucesso';
  ELSE
    ALTER ROLE educare_app WITH PASSWORD 'TROCAR_SENHA_EDUCARE_FORTE_2026';
    RAISE NOTICE 'Senha do usuario educare_app atualizada';
  END IF;
END $$;

-- Permissoes no banco educare
GRANT CONNECT ON DATABASE educare TO educare_app;
\c educare

-- Permissoes no schema public
GRANT USAGE ON SCHEMA public TO educare_app;
GRANT CREATE ON SCHEMA public TO educare_app;

-- Permissoes em todas as tabelas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO educare_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO educare_app;

-- Permissoes default para tabelas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO educare_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO educare_app;

-- Permissao para extensoes (pgvector, uuid-ossp)
-- O usuario precisa poder usar funcoes de extensao
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO educare_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO educare_app;

-- ============================================================
-- PASSO 3: Criar usuario dedicado para o n8n
-- ============================================================

\c postgres

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'n8n_app') THEN
    CREATE ROLE n8n_app WITH LOGIN PASSWORD 'TROCAR_SENHA_N8N_FORTE_2026';
    RAISE NOTICE 'Usuario n8n_app criado com sucesso';
  ELSE
    ALTER ROLE n8n_app WITH PASSWORD 'TROCAR_SENHA_N8N_FORTE_2026';
    RAISE NOTICE 'Senha do usuario n8n_app atualizada';
  END IF;
END $$;

-- Criar banco n8n se nao existir
SELECT 'CREATE DATABASE n8n OWNER n8n_app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'n8n')\gexec

-- Se o banco n8n ja existe, transferir ownership
ALTER DATABASE n8n OWNER TO n8n_app;

\c n8n

-- Permissoes completas no banco n8n
GRANT ALL PRIVILEGES ON SCHEMA public TO n8n_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO n8n_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO n8n_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO n8n_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO n8n_app;

-- Transferir ownership das tabelas existentes
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' OWNER TO n8n_app';
  END LOOP;
  RAISE NOTICE 'Ownership de todas as tabelas transferido para n8n_app';
END $$;

-- ============================================================
-- PASSO 4: Verificar usuarios criados
-- ============================================================

\c postgres

SELECT 
  rolname AS usuario,
  rolcanlogin AS pode_logar,
  rolsuper AS eh_superuser
FROM pg_roles 
WHERE rolname IN ('postgres', 'educare_app', 'n8n_app')
ORDER BY rolname;

-- ============================================================
-- PASSO 5: Testar conexoes
-- ============================================================

-- Teste manualmente apos executar:
-- PGPASSWORD='TROCAR_SENHA_EDUCARE_FORTE_2026' psql -h localhost -U educare_app -d educare -c "SELECT 'ok';"
-- PGPASSWORD='TROCAR_SENHA_N8N_FORTE_2026' psql -h localhost -U n8n_app -d n8n -c "SELECT 'ok';"
