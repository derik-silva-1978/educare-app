# Guia Completo: Correção das Falhas de Autenticação PostgreSQL

**Data:** Fevereiro 2026  
**Problema:** Erros intermitentes "password authentication failed for user postgres"  
**Causa raiz:** Serviços usando senhas dessincronizadas para o mesmo user `postgres`  
**Solução:** Criar usuários dedicados + sincronizar credenciais

---

## Diagnóstico Rápido

O log mostra que os containers (backend e/ou n8n) enviam a senha errada ao PostgreSQL. Como todos usam o user `postgres`, qualquer dessincronização causa falha.

**Evidências do log:**
- Todas as falhas batem na regra `pg_hba.conf line 100: "host all all all scram-sha-256"`
- Erros de `Connection reset by peer` indicam containers perdendo conexão
- O problema é intermitente porque às vezes os containers reconectam com sucesso

---

## Passo 1: Diagnóstico na VPS

Acesse a VPS via SSH e execute:

```bash
# Baixar e executar o script de diagnóstico
chmod +x 01-diagnostico.sh
./01-diagnostico.sh
```

O script vai mostrar:
- Quais containers estão rodando
- Qual senha cada container está usando
- Se as senhas conferem entre si
- Quantas conexões ativas existem

---

## Passo 2: Decidir a Abordagem

### Opção A: Correção Rápida (5 min) — Sincronizar Senhas

Se todos os containers DEVEM usar o user `postgres`, simplesmente atualize a senha do PostgreSQL para a mesma que o backend e o n8n estão enviando.

```bash
# Entrar no container PostgreSQL
docker exec -it <postgres_container> psql -U postgres

# Atualizar a senha para a mesma que os outros containers usam
ALTER USER postgres WITH PASSWORD 'A_SENHA_CORRETA';
\q
```

### Opção B: Correção Definitiva (15 min) — Usuários Dedicados ✅

Criar um usuário separado para cada serviço. Isso é mais seguro e facilita identificar qual serviço está com problema.

---

## Passo 3: Criar Usuários Dedicados (Opção B)

### 3.1. Preparar senhas fortes

Gere duas senhas fortes (mínimo 32 caracteres):

```bash
# Gerar senhas aleatórias
openssl rand -base64 32  # Para educare_app
openssl rand -base64 32  # Para n8n_app
```

**Anote as senhas geradas!** Você vai precisar delas nos passos seguintes.

### 3.2. Executar o SQL

```bash
# Copiar o script para o container
docker cp 02-criar-usuarios-dedicados.sql <postgres_container>:/tmp/

# Editar as senhas no script ANTES de executar
docker exec -it <postgres_container> vi /tmp/02-criar-usuarios-dedicados.sql
# Substitua 'TROCAR_SENHA_EDUCARE_FORTE_2026' e 'TROCAR_SENHA_N8N_FORTE_2026'
# pelas senhas geradas no passo 3.1

# Executar o script
docker exec -it <postgres_container> psql -U postgres -f /tmp/02-criar-usuarios-dedicados.sql
```

### 3.3. Testar as conexões

```bash
# Testar usuário educare_app
docker exec -it <postgres_container> bash -c \
  "PGPASSWORD='SUA_SENHA_EDUCARE' psql -h localhost -U educare_app -d educare -c 'SELECT current_user, current_database();'"

# Testar usuário n8n_app
docker exec -it <postgres_container> bash -c \
  "PGPASSWORD='SUA_SENHA_N8N' psql -h localhost -U n8n_app -d n8n -c 'SELECT current_user, current_database();'"
```

---

## Passo 4: Atualizar os Containers

### 4.1. Atualizar o Backend Educare

Se usa **Docker Compose**, edite o `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      DB_USERNAME: educare_app           # Era: postgres
      DB_PASSWORD: SUA_SENHA_EDUCARE     # Senha gerada no passo 3.1
      DB_HOST: postgres                  # Nome do serviço PostgreSQL
      DB_DATABASE: educare
      DB_PORT: 5432
      DB_DIALECT: postgres
```

Se usa **Docker Swarm / Portainer**, atualize as variáveis de ambiente do serviço `backend` no Portainer:

1. Abra Portainer → Services → educare-backend
2. Atualize as variáveis:
   - `DB_USERNAME` = `educare_app`
   - `DB_PASSWORD` = `SUA_SENHA_EDUCARE`
3. Clique "Update the service"

### 4.2. Atualizar o n8n

No `docker-compose.yml` ou Portainer:

```yaml
services:
  n8n:
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres       # Nome do serviço PostgreSQL
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n_app        # Era: postgres
      DB_POSTGRESDB_PASSWORD: SUA_SENHA_N8N  # Senha gerada no passo 3.1
```

### 4.3. Manter o PostgreSQL

O container PostgreSQL não precisa de mudança nas variáveis. O `POSTGRES_PASSWORD` é usado apenas na inicialização do banco. Os novos usuários são gerenciados internamente pelo PostgreSQL.

---

## Passo 5: Reiniciar os Serviços

```bash
# Se usa Docker Compose
docker-compose restart backend n8n

# Se usa Docker Swarm
docker service update --force educare_backend
docker service update --force educare_n8n

# Se usa Portainer
# Faça "Update the service" em cada serviço pelo painel web
```

---

## Passo 6: Verificar

### 6.1. Verificar Backend

```bash
# Verificar se o backend conectou
curl -s https://educareapp.com.br/api/conversation/health | python3 -m json.tool
```

Deve retornar `"database": {"status": "ok"}`.

### 6.2. Verificar n8n

Acesse `https://n8n.educareapp.com.br` e verifique se os workflows carregam normalmente.

### 6.3. Monitorar o log do PostgreSQL

```bash
# Acompanhar o log em tempo real (esperar 5-10 min)
docker logs -f <postgres_container> 2>&1 | grep -E "FATAL|ERROR"
```

Se não aparecer mais "password authentication failed", o problema foi resolvido!

---

## Passo 7: Segurança Adicional (Opcional)

### 7.1. Restringir pg_hba.conf

Atualmente a regra `host all all all scram-sha-256` permite qualquer IP. Para restringir apenas à rede Docker:

```bash
# Entrar no container PostgreSQL
docker exec -it <postgres_container> bash

# Editar pg_hba.conf
# Substituir "host all all all scram-sha-256" por:
# host educare educare_app 10.0.0.0/8 scram-sha-256
# host n8n n8n_app 10.0.0.0/8 scram-sha-256
# host all postgres 127.0.0.1/32 scram-sha-256

# Recarregar configuração
psql -U postgres -c "SELECT pg_reload_conf();"
```

### 7.2. Limitar conexões por usuário

```sql
-- No psql como postgres
ALTER ROLE educare_app CONNECTION LIMIT 20;
ALTER ROLE n8n_app CONNECTION LIMIT 20;
```

### 7.3. Aumentar pool do Backend

Se necessário, o backend pode aumentar o pool de conexões editando a configuração Sequelize:

```javascript
pool: {
  max: 10,      // Era 5
  min: 2,       // Era 0
  acquire: 30000,
  idle: 10000
}
```

---

## Troubleshooting

### "Ainda dá erro após mudar as senhas"

1. O container pode ter cache da senha antiga. Reinicie completamente:
   ```bash
   docker restart <backend_container>
   docker restart <n8n_container>
   ```

2. Verifique se as variáveis de ambiente foram realmente aplicadas:
   ```bash
   docker exec <backend_container> printenv DB_USERNAME
   docker exec <backend_container> printenv DB_PASSWORD
   ```

### "O n8n não conecta com o novo usuário"

O n8n pode precisar que o banco `n8n` já exista E pertença ao novo usuário:

```sql
ALTER DATABASE n8n OWNER TO n8n_app;
```

### "O backend não cria as tabelas"

O usuário `educare_app` precisa de permissão CREATE:

```sql
GRANT CREATE ON SCHEMA public TO educare_app;
```

### "Erro com pgvector extension"

Apenas o superuser pode criar extensões. Crie manualmente se necessário:

```sql
-- Como postgres (superuser)
\c educare
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
