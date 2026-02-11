# Correção do PostgreSQL pelo Portainer — Guia Passo a Passo

**Problema:** O banco de dados fica dando erro "password authentication failed for user postgres" de forma intermitente, derrubando o backend e o n8n.

**Causa:** Os containers (backend e n8n) estão enviando senhas diferentes para o mesmo usuário "postgres". Quando a senha não bate, o banco rejeita a conexão.

**Solução:** Criar um usuário separado para cada serviço (um para o backend, outro para o n8n), e atualizar as configurações no Portainer.

**Tempo estimado:** 15-20 minutos

---

## PARTE 1 — Diagnóstico (verificar o problema)

### Passo 1: Abrir o console do PostgreSQL no Portainer

1. Abra o Portainer no navegador
2. No menu lateral, clique em **Containers**
3. Encontre o container do **PostgreSQL** (geralmente tem "postgres" no nome)
4. Clique no **nome do container** para abrir os detalhes
5. Na parte de cima, clique no botão **Console** (ou **Exec Console**)
6. No campo "Command", deixe `/bin/bash` e clique **Connect**

Agora você está dentro do container do PostgreSQL.

### Passo 2: Verificar quem está conectado

No terminal que abriu, digite:

```
psql -U postgres -c "SELECT datname, usename, client_addr, state FROM pg_stat_activity WHERE datname IS NOT NULL ORDER BY datname;"
```

Isso mostra todos os serviços conectados ao banco. Você vai ver linhas com:
- `datname` = nome do banco (educare, n8n)
- `usename` = usuário usado (provavelmente "postgres" em todos)
- `client_addr` = IP do container que está conectando

### Passo 3: Verificar as senhas dos containers

Saia do console do PostgreSQL (clique em **Disconnect** ou feche a aba).

Agora, para cada container (backend e n8n), faça:

1. Vá em **Containers**
2. Clique no container do **backend** (ou do **n8n**)
3. Na seção **Inspect** (ou nos detalhes), procure a aba **Env** (variáveis de ambiente)
4. Anote os valores de:

**Para o Backend:**
- `DB_USERNAME` (provavelmente "postgres")
- `DB_PASSWORD` (anote a senha)
- `DB_HOST`
- `DB_DATABASE`

**Para o n8n:**
- `DB_POSTGRESDB_USER` (provavelmente "postgres")
- `DB_POSTGRESDB_PASSWORD` (anote a senha)
- `DB_POSTGRESDB_HOST`
- `DB_POSTGRESDB_DATABASE`

**Se as senhas do backend e do n8n são DIFERENTES, esse é o problema!**

---

## PARTE 2 — Correção Rápida (sincronizar senhas)

Se você quer resolver rápido sem criar usuários novos:

### Passo 1: Descobrir qual é a senha correta

A senha "oficial" do PostgreSQL é a que está definida no **Stack** (docker-compose) do Portainer, na variável `POSTGRES_PASSWORD` do serviço postgres. Essa é a senha que o banco foi criado com.

Para encontrá-la:
1. No Portainer, vá em **Stacks**
2. Clique no stack do Educare
3. Clique em **Editor** para ver o docker-compose
4. Procure o serviço `postgres` e encontre a linha `POSTGRES_PASSWORD`
5. Copie essa senha

**Alternativa:** Se não encontrar no Stack, abra o console do container PostgreSQL e teste se a senha funciona:

```bash
psql -U postgres -c "SELECT 'conexao ok';"
```

Se funcionar sem pedir senha, significa que o acesso local não exige senha (trust), mas os outros containers precisam da senha correta pela rede.

### Passo 2: Atualizar os containers com a senha certa

> **ATENÇÃO:** Edite sempre pelo **Stack** (Editor do docker-compose), **nunca** pelas variáveis de ambiente direto no container. Se você editar direto no container, as mudanças serão perdidas quando o stack for atualizado.

1. No Portainer, vá em **Stacks**
2. Encontre o stack do Educare
3. Clique em **Editor** para editar o docker-compose
4. Procure as variáveis de ambiente de cada serviço e garanta que:

**Backend:**
```
DB_PASSWORD=COLE_A_SENHA_DO_POSTGRES_AQUI
```

**n8n:**
```
DB_POSTGRESDB_PASSWORD=COLE_A_SENHA_DO_POSTGRES_AQUI
```

5. Clique em **Update the stack** (ou **Deploy**)

Os containers serão reiniciados com a senha correta.

---

## PARTE 3 — Correção Definitiva (criar usuários dedicados) ✅ Recomendado

Essa é a melhor solução. Cada serviço terá seu próprio usuário no banco.

### Passo 1: Gerar senhas fortes

Antes de tudo, crie duas senhas fortes. Pode usar esse site: https://passwordsgenerator.net/

- Gere uma senha de 32 caracteres para o backend (**sem caracteres especiais**, apenas letras e números)
- Gere outra senha de 32 caracteres para o n8n (**sem caracteres especiais**, apenas letras e números)

**Anote as duas senhas!** Você vai precisar delas nos próximos passos.

> **Importante:** Use apenas letras e números nas senhas (sem @, #, !, etc.) para evitar problemas com caracteres especiais em variáveis de ambiente.

### Passo 2: Criar os usuários no PostgreSQL

1. Abra o Portainer
2. Vá em **Containers** → clique no container do **PostgreSQL**
3. Clique em **Console** → deixe `/bin/bash` → clique **Connect**
4. No terminal, digite:

```
psql -U postgres
```

Agora você está no prompt do PostgreSQL (aparece `postgres=#`). Execute os comandos abaixo **um por um**, substituindo as senhas pelas que você gerou:

**Criar usuário para o Backend:**
```sql
CREATE USER educare_app WITH PASSWORD 'COLE_SUA_SENHA_DO_BACKEND_AQUI';
```

**Dar permissões no banco educare:**
```sql
GRANT CONNECT ON DATABASE educare TO educare_app;
\c educare
GRANT USAGE ON SCHEMA public TO educare_app;
GRANT CREATE ON SCHEMA public TO educare_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO educare_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO educare_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO educare_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO educare_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO educare_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO educare_app;
```

**Criar as extensões necessárias (importante fazer agora, enquanto está como superuser):**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**Voltar para o banco principal e criar usuário para o n8n:**
```sql
\c postgres
CREATE USER n8n_app WITH PASSWORD 'COLE_SUA_SENHA_DO_N8N_AQUI';
```

**Verificar se o banco n8n existe:**
```sql
\l
```

Vai aparecer uma lista de bancos. Procure por um banco chamado `n8n` (ou similar). Se aparecer, continue abaixo. Se **NÃO** aparecer o banco `n8n` na lista, talvez o n8n use outro nome (como `n8n_db`) — use o nome que aparecer. Se nenhum banco do n8n aparecer, pode ser que o n8n use SQLite e não precise de banco PostgreSQL; nesse caso pule para o Passo 3.

**Dar permissões no banco do n8n** (substitua `n8n` pelo nome correto se for diferente):
```sql
\c n8n
GRANT ALL PRIVILEGES ON SCHEMA public TO n8n_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO n8n_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO n8n_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO n8n_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO n8n_app;
ALTER DATABASE n8n OWNER TO n8n_app;
```

> Se ao executar `\c n8n` aparecer erro "database n8n does not exist", verifique o nome correto do banco com `\l` e substitua nos comandos acima.

**Verificar que deu certo:**
```sql
\c postgres
SELECT rolname, rolcanlogin, rolsuper FROM pg_roles WHERE rolname IN ('postgres', 'educare_app', 'n8n_app');
```

Deve aparecer os 3 usuários. `educare_app` e `n8n_app` com `rolcanlogin = t` e `rolsuper = f`.

**Sair do psql:**
```
\q
```

Clique em **Disconnect** no console do Portainer.

### Passo 3: Testar os novos usuários (ainda no console do PostgreSQL)

Antes de mudar os containers, teste se os novos usuários funcionam. Abra o console do PostgreSQL novamente e digite:

```bash
PGPASSWORD='COLE_SUA_SENHA_DO_BACKEND_AQUI' psql -h localhost -U educare_app -d educare -c "SELECT 'Backend OK' AS teste;"
```

```bash
PGPASSWORD='COLE_SUA_SENHA_DO_N8N_AQUI' psql -h localhost -U n8n_app -d n8n -c "SELECT 'n8n OK' AS teste;"
```

Se os dois mostrarem "OK", os usuários estão funcionando. Se der erro, revise os comandos SQL do passo anterior.

### Passo 4: Atualizar as variáveis de ambiente no Portainer

> **ATENÇÃO IMPORTANTE:** Edite sempre pelo **Stack** (clicando em Editor/Edit no docker-compose). **NUNCA** edite as variáveis de ambiente direto no container individual. Se você editar direto no container, as mudanças serão perdidas quando o stack for atualizado ou o container reiniciar.

Agora vamos apontar cada container para seu novo usuário.

1. No Portainer, vá em **Stacks**
2. Encontre o stack do Educare
3. Clique em **Editor** para editar o docker-compose

**Para o serviço do Backend**, mude estas variáveis:
```yaml
environment:
  DB_USERNAME: educare_app
  DB_PASSWORD: COLE_SUA_SENHA_DO_BACKEND_AQUI
  # Mantenha as outras variáveis como estão (DB_HOST, DB_DATABASE, etc.)
```

**Para o serviço do n8n**, mude estas variáveis:
```yaml
environment:
  DB_POSTGRESDB_USER: n8n_app
  DB_POSTGRESDB_PASSWORD: COLE_SUA_SENHA_DO_N8N_AQUI
  # Mantenha as outras variáveis como estão
```

4. Clique em **Update the stack**

Os containers serão reiniciados automaticamente.

### Passo 5: Verificar se tudo voltou a funcionar

Espere 1-2 minutos para os containers reiniciarem. Depois:

**Verificar o Backend:**

Abra no navegador:
```
https://educareapp.com.br/api/conversation/health
```

Deve mostrar `"database": {"status": "ok"}`.

**Verificar o n8n:**

Abra `https://n8n.educareapp.com.br` e veja se os workflows carregam normalmente.

**Monitorar por 10 minutos:**

Abra o console do container PostgreSQL e digite:
```bash
tail -f /var/lib/postgresql/data/log/postgresql*.log 2>/dev/null || tail -f /var/log/postgresql/*.log 2>/dev/null
```

Se não aparecer mais "password authentication failed", está resolvido!

Pressione `Ctrl+C` para sair do monitoramento.

---

## PARTE 4 — Se algo der errado

### "Mudei as variáveis mas nada mudou"

Isso acontece quando você edita as variáveis **direto no container** em vez de editar pelo **Stack**. As mudanças no container são temporárias e se perdem.

**Como corrigir:**
1. Vá em **Stacks** (não em Containers!)
2. Clique no stack do Educare
3. Clique em **Editor**
4. Faça as mudanças no docker-compose
5. Clique **Update the stack**

Isso vai recriar os containers com as variáveis corretas.

### "O backend não conecta com o novo usuário"

Volte ao console do PostgreSQL e execute:
```
psql -U postgres -d educare -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO educare_app;"
psql -U postgres -d educare -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO educare_app;"
```

### "O n8n não conecta com o novo usuário"

```
psql -U postgres -d n8n -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO n8n_app;"
psql -U postgres -d n8n -c "ALTER DATABASE n8n OWNER TO n8n_app;"
```

### "Aparece erro sobre extensão vector ou uuid"

Isso acontece porque só o superuser pode criar extensões. Abra o console do PostgreSQL e execute:
```
psql -U postgres -d educare -c "CREATE EXTENSION IF NOT EXISTS vector;"
psql -U postgres -d educare -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

Depois disso, reinicie o backend pelo Portainer (Stacks → Update the stack).

### "Não encontro o banco n8n na lista"

O n8n pode estar usando outro nome de banco, ou pode estar usando SQLite em vez de PostgreSQL. Para verificar:

1. Vá em **Containers** → clique no container do **n8n**
2. Procure a variável `DB_TYPE` nas variáveis de ambiente
   - Se for `postgresdb`, o n8n usa PostgreSQL
   - Se não existir ou for `sqlite`, o n8n usa SQLite (não precisa de configuração)
3. Se for PostgreSQL, procure `DB_POSTGRESDB_DATABASE` para ver o nome real do banco

### "Quero voltar ao jeito anterior"

Basta mudar as variáveis de ambiente de volta no **Stack** (Editor):
- Backend: `DB_USERNAME=postgres` e `DB_PASSWORD=SENHA_ORIGINAL`
- n8n: `DB_POSTGRESDB_USER=postgres` e `DB_POSTGRESDB_PASSWORD=SENHA_ORIGINAL`

E clique em **Update the stack** no Portainer.

---

## Resumo do que foi feito

| Item | Antes | Depois |
|------|-------|--------|
| Usuário do Backend | postgres (superuser) | educare_app (limitado) |
| Usuário do n8n | postgres (superuser) | n8n_app (limitado) |
| Senhas | Possivelmente dessincronizadas | Cada serviço com sua própria senha |
| Segurança | Todos com acesso de superuser | Cada serviço com permissões mínimas |
| Diagnóstico | Difícil saber quem causou o erro | Fácil identificar pelo nome do usuário no log |
