#!/bin/bash
# =============================================================================
# EDUCARE+ PostgreSQL Diagnostic Script
# Execute na VPS Contabo via SSH
# =============================================================================

echo "============================================"
echo "  EDUCARE+ PostgreSQL Diagnostic"
echo "  $(date)"
echo "============================================"
echo ""

# 1. Check PostgreSQL container
echo "=== 1. CONTAINERS RODANDO ==="
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "postgres|n8n|educare|backend"
echo ""

# 2. Check PostgreSQL container env vars
echo "=== 2. SENHAS CONFIGURADAS POR CONTAINER ==="
echo ""

POSTGRES_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i postgres | head -1)
BACKEND_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i backend | head -1)
N8N_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i n8n | head -1)

if [ -n "$POSTGRES_CONTAINER" ]; then
  echo "--- Container PostgreSQL: $POSTGRES_CONTAINER ---"
  PG_PASS=$(docker exec "$POSTGRES_CONTAINER" printenv POSTGRES_PASSWORD 2>/dev/null)
  PG_USER=$(docker exec "$POSTGRES_CONTAINER" printenv POSTGRES_USER 2>/dev/null || echo "postgres")
  PG_DB=$(docker exec "$POSTGRES_CONTAINER" printenv POSTGRES_DB 2>/dev/null || echo "postgres")
  echo "  POSTGRES_USER: $PG_USER"
  echo "  POSTGRES_DB: $PG_DB"
  echo "  POSTGRES_PASSWORD hash (primeiros 8 chars): ${PG_PASS:0:8}..."
  echo "  POSTGRES_PASSWORD length: ${#PG_PASS}"
  echo ""
else
  echo "  [ERRO] Container PostgreSQL nao encontrado!"
  echo ""
fi

if [ -n "$BACKEND_CONTAINER" ]; then
  echo "--- Container Backend: $BACKEND_CONTAINER ---"
  BE_USER=$(docker exec "$BACKEND_CONTAINER" printenv DB_USERNAME 2>/dev/null)
  BE_PASS=$(docker exec "$BACKEND_CONTAINER" printenv DB_PASSWORD 2>/dev/null)
  BE_HOST=$(docker exec "$BACKEND_CONTAINER" printenv DB_HOST 2>/dev/null)
  BE_DB=$(docker exec "$BACKEND_CONTAINER" printenv DB_DATABASE 2>/dev/null)
  BE_URL=$(docker exec "$BACKEND_CONTAINER" printenv DATABASE_URL 2>/dev/null)
  echo "  DB_USERNAME: $BE_USER"
  echo "  DB_HOST: $BE_HOST"
  echo "  DB_DATABASE: $BE_DB"
  echo "  DB_PASSWORD hash (primeiros 8 chars): ${BE_PASS:0:8}..."
  echo "  DB_PASSWORD length: ${#BE_PASS}"
  if [ -n "$BE_URL" ]; then
    echo "  DATABASE_URL: $(echo $BE_URL | sed 's/:[^:@]*@/:***@/')"
  fi
  echo ""
else
  echo "  [ERRO] Container Backend nao encontrado!"
  echo ""
fi

if [ -n "$N8N_CONTAINER" ]; then
  echo "--- Container n8n: $N8N_CONTAINER ---"
  N8N_DB_TYPE=$(docker exec "$N8N_CONTAINER" printenv DB_TYPE 2>/dev/null)
  N8N_PG_HOST=$(docker exec "$N8N_CONTAINER" printenv DB_POSTGRESDB_HOST 2>/dev/null)
  N8N_PG_DB=$(docker exec "$N8N_CONTAINER" printenv DB_POSTGRESDB_DATABASE 2>/dev/null)
  N8N_PG_USER=$(docker exec "$N8N_CONTAINER" printenv DB_POSTGRESDB_USER 2>/dev/null)
  N8N_PG_PASS=$(docker exec "$N8N_CONTAINER" printenv DB_POSTGRESDB_PASSWORD 2>/dev/null)
  echo "  DB_TYPE: $N8N_DB_TYPE"
  echo "  DB_POSTGRESDB_HOST: $N8N_PG_HOST"
  echo "  DB_POSTGRESDB_DATABASE: $N8N_PG_DB"
  echo "  DB_POSTGRESDB_USER: $N8N_PG_USER"
  echo "  DB_POSTGRESDB_PASSWORD hash (primeiros 8 chars): ${N8N_PG_PASS:0:8}..."
  echo "  DB_POSTGRESDB_PASSWORD length: ${#N8N_PG_PASS}"
  echo ""
else
  echo "  [ERRO] Container n8n nao encontrado!"
  echo ""
fi

# 3. Compare passwords
echo "=== 3. COMPARACAO DE SENHAS ==="
if [ -n "$PG_PASS" ] && [ -n "$BE_PASS" ]; then
  if [ "$PG_PASS" = "$BE_PASS" ]; then
    echo "  [OK] Backend password MATCHES PostgreSQL password"
  else
    echo "  [ERRO] Backend password DOES NOT MATCH PostgreSQL password!"
    echo "         PostgreSQL expects: ${PG_PASS:0:4}... (${#PG_PASS} chars)"
    echo "         Backend sends:      ${BE_PASS:0:4}... (${#BE_PASS} chars)"
  fi
fi

if [ -n "$PG_PASS" ] && [ -n "$N8N_PG_PASS" ]; then
  if [ "$PG_PASS" = "$N8N_PG_PASS" ]; then
    echo "  [OK] n8n password MATCHES PostgreSQL password"
  else
    echo "  [ERRO] n8n password DOES NOT MATCH PostgreSQL password!"
    echo "         PostgreSQL expects: ${PG_PASS:0:4}... (${#PG_PASS} chars)"
    echo "         n8n sends:          ${N8N_PG_PASS:0:4}... (${#N8N_PG_PASS} chars)"
  fi
fi
echo ""

# 4. Test actual connections
echo "=== 4. TESTE DE CONEXAO ==="
if [ -n "$POSTGRES_CONTAINER" ]; then
  echo "  Testando conexao local no container PostgreSQL..."
  docker exec "$POSTGRES_CONTAINER" psql -U postgres -c "SELECT 'conexao_local_ok' AS status;" 2>&1 | head -5

  echo ""
  echo "  Testando conexao com senha do Backend..."
  docker exec "$POSTGRES_CONTAINER" bash -c "PGPASSWORD='$BE_PASS' psql -h localhost -U ${BE_USER:-postgres} -d ${BE_DB:-educare} -c \"SELECT 'backend_auth_ok' AS status;\"" 2>&1 | head -5

  echo ""
  echo "  Testando conexao com senha do n8n..."
  docker exec "$POSTGRES_CONTAINER" bash -c "PGPASSWORD='$N8N_PG_PASS' psql -h localhost -U ${N8N_PG_USER:-postgres} -d ${N8N_PG_DB:-n8n} -c \"SELECT 'n8n_auth_ok' AS status;\"" 2>&1 | head -5
fi
echo ""

# 5. Check PostgreSQL auth config
echo "=== 5. CONFIGURACAO pg_hba.conf ==="
if [ -n "$POSTGRES_CONTAINER" ]; then
  docker exec "$POSTGRES_CONTAINER" cat /var/lib/postgresql/data/pg_hba.conf 2>/dev/null | grep -v "^#" | grep -v "^$" | head -20
fi
echo ""

# 6. Connection count
echo "=== 6. CONEXOES ATIVAS ==="
if [ -n "$POSTGRES_CONTAINER" ]; then
  docker exec "$POSTGRES_CONTAINER" psql -U postgres -c "
    SELECT datname, usename, client_addr, state, count(*) 
    FROM pg_stat_activity 
    GROUP BY datname, usename, client_addr, state 
    ORDER BY count(*) DESC;" 2>&1
fi
echo ""

# 7. Check max connections
echo "=== 7. LIMITES DE CONEXAO ==="
if [ -n "$POSTGRES_CONTAINER" ]; then
  docker exec "$POSTGRES_CONTAINER" psql -U postgres -c "SHOW max_connections;" 2>&1
  docker exec "$POSTGRES_CONTAINER" psql -U postgres -c "SELECT count(*) AS active_connections FROM pg_stat_activity;" 2>&1
fi
echo ""

# 8. Check Docker Swarm secrets (if using)
echo "=== 8. DOCKER SECRETS ==="
docker secret ls 2>/dev/null || echo "  Docker Secrets nao configurado ou nao e Swarm"
echo ""

# 9. Check Docker stack/compose
echo "=== 9. STACK/COMPOSE CONFIG ==="
if [ -f /opt/educare/docker-compose.yml ]; then
  echo "  Arquivo encontrado: /opt/educare/docker-compose.yml"
  grep -A2 "POSTGRES_PASSWORD\|DB_PASSWORD\|DB_USERNAME\|DB_POSTGRESDB" /opt/educare/docker-compose.yml 2>/dev/null | head -20
elif [ -f /root/educare/docker-compose.yml ]; then
  echo "  Arquivo encontrado: /root/educare/docker-compose.yml"
  grep -A2 "POSTGRES_PASSWORD\|DB_PASSWORD\|DB_USERNAME\|DB_POSTGRESDB" /root/educare/docker-compose.yml 2>/dev/null | head -20
else
  echo "  docker-compose.yml nao encontrado em locais padrao"
  echo "  Procurando..."
  find / -name "docker-compose*.yml" -path "*/educare*" 2>/dev/null | head -5
fi
echo ""

echo "============================================"
echo "  Diagnostico concluido!"
echo "  Analise os resultados acima."
echo "  Se as senhas NAO conferem, execute:"
echo "  02-criar-usuarios-dedicados.sql"
echo "============================================"
