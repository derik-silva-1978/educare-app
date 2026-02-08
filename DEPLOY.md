# Educare+ — Guia de Deploy via Portainer (Docker Swarm)

Este guia explica como publicar a aplicação Educare+ no seu servidor (VPS) usando o **Portainer** com **Docker Swarm**.

---

## Visão Geral do Fluxo

```
1. git pull (no VPS)       → Baixar o código mais recente
2. ./build.sh              → Compilar as imagens localmente
3. Portainer (Stack)       → Fazer deploy usando as imagens locais
```

> O Docker Swarm não compila imagens — ele precisa delas prontas. Por isso usamos o script `build.sh` para compilar antes do deploy.

---

## Antes de Começar

Você vai precisar de:

- **Portainer** instalado e acessível (ex: `https://painel.educareapp.com.br`)
- O código do Educare+ num **repositório Git** (GitHub, GitLab, etc.)
- **Acesso SSH** ao servidor para rodar o script de build
- **PostgreSQL** já rodando no servidor

---

## Passo 1: Clonar o Repositório no Servidor

Acesse o terminal do servidor via SSH e clone o repositório:

```bash
cd /opt
git clone https://github.com/seu-usuario/educare.git
cd educare
```

> Se o repositório for privado, use um Personal Access Token:
> `git clone https://SEU_TOKEN@github.com/seu-usuario/educare.git`

---

## Passo 2: Compilar as Imagens

Antes de fazer deploy no Portainer, compile as imagens no servidor:

```bash
cd /opt/educare

# Defina a URL da API (obrigatório para o frontend)
export VITE_API_URL=https://api.educareapp.com.br

# Execute o build
./build.sh
```

O script vai:
- Compilar `educare-backend:latest` (Node.js)
- Compilar `educare-frontend:latest` (React + Nginx)

Ao final, você verá as imagens listadas. Isso confirma que estão prontas.

> **Primeira vez?** O build pode levar 3-5 minutos para baixar as imagens base.

---

## Passo 3: Criar o Stack no Portainer

### 3.1 Preparar as Variáveis de Ambiente

Copie e preencha com seus dados reais:

#### Variáveis Obrigatórias

```
NODE_ENV=production
PORT=5000

DB_USERNAME=postgres
DB_PASSWORD=SUA_SENHA_DO_BANCO
DB_DATABASE=educareapp
DB_HOST=SUA_CONFIGURACAO_AQUI
DB_PORT=5432
DB_DIALECT=postgres
DB_TIMEZONE=America/Sao_Paulo
DB_SYNC_ENABLED=false

JWT_SECRET=TROQUE_POR_UMA_STRING_LONGA_E_ALEATORIA
JWT_EXPIRATION=24h

FRONTEND_URL=https://educareapp.com.br
BACKEND_URL=https://api.educareapp.com.br
APP_URL=https://educareapp.com.br
CORS_ORIGINS=https://educareapp.com.br,https://n8n.educareapp.com.br

OPENAI_API_KEY=sk-SUA_CHAVE_REAL
```

> **DB_HOST — Como escolher o valor correto:**
> - Se o PostgreSQL roda **num container Docker** com nome `postgres` na mesma rede overlay → use `postgres`
> - Se o PostgreSQL roda **direto no servidor** (sem Docker) → use o **IP privado do servidor** (descubra com `hostname -I | awk '{print $1}'`)
> - **Não use** `172.17.0.1` no Swarm — essa ponte Docker não é acessível pela rede overlay
> - **Não use** `localhost` — dentro do container, localhost é o próprio container

#### Variáveis Opcionais

```
GEMINI_API_KEY=sua-chave-gemini
QDRANT_URL=https://seu-qdrant.cloud.qdrant.io
QDRANT_API_KEY=sua-chave-qdrant

STRIPE_SECRET_KEY=sk_live_sua-chave
STRIPE_WEBHOOK_SECRET=whsec_seu-secret

EVOLUTION_API_URL=https://sua-evolution-api.com
EVOLUTION_API_KEY=sua-chave-evolution
EVOLUTION_INSTANCE_NAME=seu-instance

N8N_API_KEY=sua-chave-n8n
OWNER_PHONE=5511999999999

RAG_PRIMARY_PROVIDER=openai
ENABLE_SEGMENTED_KB=true
```

### 3.2 Criar o Stack

1. Abra o **Portainer** no navegador

2. No menu lateral, clique em **Stacks**

3. Clique em **+ Add stack**

4. Preencha:
   - **Name:** `educare`
   - **Build method:** Selecione **Web editor**

5. Cole o conteúdo do arquivo `docker-compose.yml` no editor

6. Role para baixo até **Environment variables**

7. Clique em **Advanced mode**

8. Cole todas as variáveis do passo 3.1 (já preenchidas)

9. Clique em **Deploy the stack**

> **Por que Web editor e não Git?** No modo Swarm, o Portainer não suporta `build` via Git. As imagens precisam estar prontas localmente (feito no Passo 2). Usamos Web editor para colar o compose diretamente.

---

## Passo 4: Verificar se Está Funcionando

Após o deploy, você verá os serviços listados no Stack:

| Serviço | Status esperado |
|---|---|
| `educare_frontend` | **Running** |
| `educare_backend` | **Running** |

### Ver os Logs

1. No menu lateral, clique em **Services**
2. Clique no serviço (ex: `educare_backend`)
3. Clique em **Logs** para ver em tempo real

### Testar

- Abra `https://educareapp.com.br` (ou o IP do servidor)
- Você deve ver a tela de login do Educare+

---

## Como Atualizar (Nova Versão)

Quando tiver uma atualização no código:

### No terminal do servidor (SSH):

```bash
cd /opt/educare

# 1. Baixar código atualizado
git pull

# 2. Recompilar as imagens
export VITE_API_URL=https://api.educareapp.com.br
./build.sh
```

### No Portainer:

3. Vá em **Stacks** → clique em **educare**

4. Clique em **Update the stack** → **Update**

> O Portainer vai detectar que as imagens locais foram atualizadas e reiniciar os serviços com a versão nova.

> **Lembre-se:** Se mudou o `VITE_API_URL`, precisa rodar o `./build.sh` novamente, pois esse valor é embutido no frontend durante a compilação.

---

## Como Voltar para uma Versão Anterior (Rollback)

Se algo der errado após uma atualização:

### No terminal do servidor (SSH):

```bash
cd /opt/educare

# 1. Ver os últimos commits
git log --oneline -5

# 2. Voltar para o commit anterior
git checkout HASH_DO_COMMIT_ANTERIOR -- .

# 3. Recompilar
export VITE_API_URL=https://api.educareapp.com.br
./build.sh
```

### No Portainer:

4. Vá em **Stacks** → **educare** → **Update the stack**

---

## Solução de Problemas

### "Serviço não inicia" ou fica reiniciando

1. No Portainer, vá em **Services** → clique no serviço com problema
2. Clique em **Logs** e procure mensagens de erro
3. Problemas comuns:
   - **Erro de conexão com banco:** Verifique `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`
   - **Porta em uso:** Verifique se a porta 80 não está sendo usada por outro serviço

### "Backend não conecta ao PostgreSQL"

O PostgreSQL precisa aceitar conexões vindas do Docker:

1. Edite o `pg_hba.conf`:
   ```bash
   sudo nano /etc/postgresql/*/main/pg_hba.conf
   ```
   Adicione:
   ```
   host    all    all    172.16.0.0/12    md5
   host    all    all    10.0.0.0/8       md5
   ```

2. Edite o `postgresql.conf`:
   ```bash
   sudo nano /etc/postgresql/*/main/postgresql.conf
   ```
   Altere para:
   ```
   listen_addresses = '*'
   ```

3. Reinicie:
   ```bash
   sudo systemctl restart postgresql
   ```

> **Nota Swarm:** Containers no Swarm usam a rede overlay (10.0.x.x), por isso adicionamos `10.0.0.0/8` além do range Docker padrão.

### "Frontend mostra página em branco"

1. Verifique se compilou o frontend com `VITE_API_URL` correto
2. Recompile: `export VITE_API_URL=https://api.educareapp.com.br && ./build.sh`
3. No Portainer, atualize o Stack

### "Erro 502 Bad Gateway"

O frontend não consegue se comunicar com o backend:
1. Verifique se o serviço `educare_backend` está rodando
2. Veja os logs do backend para identificar o erro

### Volumes e dados persistentes

Os volumes (`uploads_data`, `knowledge_data`) são locais ao nó do Swarm onde o serviço roda. Por isso, usamos `placement.constraints` no compose para garantir que os serviços sempre rodem no mesmo nó (manager), preservando os dados.

### "Imagem não encontrada"

Se o Portainer mostrar erro de imagem:
1. Verifique se rodou o `./build.sh` no servidor
2. Confirme que as imagens existem: `docker images | grep educare`

---

## Estrutura dos Serviços

```
                    ┌─────────────────┐
    Internet ──────▶│  Frontend       │
    (porta 80)      │  (Nginx)        │
                    │                 │
                    │  /api/* ────────┼──▶ ┌─────────────┐
                    │  /webhook/* ────┼──▶ │  Backend     │
                    │  /uploads/* ────┼──▶ │  (Node.js)   │
                    │                 │    │  porta 5000  │
                    │  /* ───▶ React  │    │              │
                    └─────────────────┘    │  ┌─────────┐ │
                                           │  │Uploads  │ │
                                           │  │(volume) │ │
                                           │  └─────────┘ │
                                           └──────┬───────┘
                                                  │
                                           ┌──────▼───────┐
                                           │  PostgreSQL   │
                                           │  (externo)    │
                                           └──────────────┘
```

---

## Comandos Úteis (Terminal do Servidor)

| O que fazer | Comando |
|---|---|
| Ver serviços do Swarm | `docker service ls` |
| Ver logs do backend | `docker service logs educare_backend -f --tail=100` |
| Ver logs do frontend | `docker service logs educare_frontend -f --tail=100` |
| Ver imagens locais | `docker images \| grep educare` |
| Recompilar tudo | `./build.sh` |
| Limpar imagens antigas | `docker image prune -f` |

---

## Arquivos de Configuração Docker

| Arquivo | Função |
|---|---|
| `docker-compose.yml` | Define os serviços e como se conectam (formato Swarm) |
| `Dockerfile.backend` | Receita para criar a imagem do backend (Node.js) |
| `Dockerfile.frontend` | Receita para criar a imagem do frontend (React + Nginx) |
| `nginx.conf` | Configuração do servidor web (proxy + arquivos estáticos) |
| `build.sh` | Script para compilar as imagens localmente |
| `.env.example` | Modelo com todas as variáveis de ambiente |
| `.dockerignore` | Lista de arquivos ignorados pelo Docker no build |
