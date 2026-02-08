# Educare+ — Guia de Deploy via Portainer (Docker Swarm)

Este guia explica como publicar a aplicação Educare+ no seu servidor usando o **Portainer** com **Docker Swarm** e imagens do **Docker Hub**.

---

## Visão Geral do Fluxo

```
1. git push (no seu computador)  → Envia código para o GitHub
2. GitHub Actions (automático)    → Compila e publica imagens no Docker Hub
3. Portainer (no navegador)       → Faz deploy usando as imagens do Docker Hub
```

> Tudo é automático após o `git push`. Você só precisa atualizar o Stack no Portainer.

---

## Configuração Inicial (fazer uma vez)

### 1. Criar conta no Docker Hub

1. Acesse [hub.docker.com](https://hub.docker.com)
2. Clique em **Sign Up** e crie sua conta (grátis)
3. Anote seu **nome de usuário** (ex: `educaremais`)

### 2. Criar Access Token no Docker Hub

1. No Docker Hub, clique no seu avatar → **Account Settings**
2. Vá em **Security** → **New Access Token**
3. Nome: `github-actions`
4. Permissões: **Read & Write**
5. Clique em **Generate** e **copie o token** (só aparece uma vez!)

### 3. Configurar Secrets no GitHub

No repositório do GitHub:

1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret** e adicione:

| Nome do Secret | Valor |
|---|---|
| `DOCKERHUB_USERNAME` | `educaremais` |
| `DOCKERHUB_TOKEN` | O Access Token que você copiou |
| `VITE_API_URL` | `https://api.educareapp.com.br` |

3. Pronto! A cada `git push` na branch `main`, as imagens serão compiladas e publicadas automaticamente.

### 4. Primeiro build

Faça um commit e push para disparar o primeiro build:

```bash
git add .
git commit -m "configurar deploy automático"
git push origin main
```

No GitHub, vá em **Actions** para acompanhar o build. O primeiro pode levar 5-10 minutos.

---

## Criar o Stack no Portainer

### Preparar as Variáveis de Ambiente

Copie e preencha com seus dados reais:

#### Variáveis Obrigatórias

```
DOCKERHUB_USERNAME=educaremais

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

### Criar o Stack

1. Abra o **Portainer** no navegador

2. No menu lateral, clique em **Stacks**

3. Clique em **+ Add stack**

4. Preencha:
   - **Name:** `educare`
   - **Build method:** Selecione **Repository**

5. Preencha os dados do repositório:

   | Campo | O que colocar |
   |---|---|
   | **Authentication** | Ative se o repositório for privado |
   | **Username** | Seu usuário do GitHub |
   | **Personal Access Token** | Seu token do GitHub |
   | **Repository URL** | `https://github.com/seu-usuario/educare.git` |
   | **Repository reference** | `refs/heads/main` |
   | **Compose path** | `docker-compose.yml` |

6. Role para baixo até **Environment variables**

7. Clique em **Advanced mode**

8. Cole todas as variáveis (já preenchidas)

9. Clique em **Deploy the stack**

> As imagens serão baixadas do Docker Hub automaticamente. O deploy leva poucos segundos.

---

## Verificar se Está Funcionando

Após o deploy, os serviços aparecem no Stack:

| Serviço | Status esperado |
|---|---|
| `educare_frontend` | **Running** |
| `educare_backend` | **Running** |

### Ver os Logs

1. No menu lateral, clique em **Services**
2. Clique no serviço (ex: `educare_backend`)
3. Clique em **Logs**

### Testar

- Abra `https://educareapp.com.br`
- Você deve ver a tela de login do Educare+

---

## Como Atualizar (Nova Versão)

O processo é simples:

1. **Faça `git push`** das alterações para o GitHub

2. **Espere o build** — Vá em GitHub → Actions para acompanhar (2-5 min)

3. **No Portainer:**
   - Vá em **Stacks** → **educare**
   - Clique em **Pull and redeploy**
   - Marque **Pull latest image versions**
   - Clique em **Update**

> O Portainer vai baixar as imagens novas do Docker Hub e reiniciar os serviços.

### Atualização Automática (Opcional)

Você pode configurar o Portainer para verificar novas imagens automaticamente:

1. Edite o Stack
2. Na seção **GitOps updates**, ative a opção
3. Defina o intervalo (ex: a cada 5 minutos)

---

## Como Voltar para uma Versão Anterior (Rollback)

Cada build gera uma tag com o hash do commit. Para voltar:

1. No Docker Hub, veja as tags disponíveis da imagem

2. No Portainer, edite o Stack e troque `:latest` pela tag desejada:
   ```
   educaremais/educare-frontend:abc1234
   educaremais/educare-backend:abc1234
   ```

3. Clique em **Update the stack**

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
   host    all    all    10.0.0.0/8       md5
   host    all    all    172.16.0.0/12    md5
   ```

2. Edite o `postgresql.conf`:
   ```
   listen_addresses = '*'
   ```

3. Reinicie:
   ```bash
   sudo systemctl restart postgresql
   ```

> **Nota Swarm:** Containers no Swarm usam a rede overlay (10.0.x.x), por isso adicionamos `10.0.0.0/8`.

### "Frontend mostra página em branco"

1. Verifique se o secret `VITE_API_URL` está correto no GitHub
2. Refaça o build: GitHub → Actions → Run workflow
3. No Portainer, atualize o Stack com **Pull latest image versions**

### "Erro 502 Bad Gateway"

1. Verifique se o serviço `educare_backend` está rodando
2. Veja os logs do backend

### "Image not found" ou "manifest unknown"

1. Verifique se o build do GitHub Actions passou (GitHub → Actions)
2. Verifique se o `DOCKERHUB_USERNAME` está correto nas variáveis do Portainer
3. Confirme que as imagens existem no Docker Hub: [hub.docker.com/u/educaremais](https://hub.docker.com/u/educaremais)

### Volumes e dados persistentes

Os volumes (`uploads_data`, `knowledge_data`) são locais ao nó do Swarm. Usamos `placement.constraints` para garantir que os serviços sempre rodem no mesmo nó (manager), preservando os dados.

---

## Estrutura dos Serviços

```
    GitHub Push
         │
         ▼
  GitHub Actions ──▶ Docker Hub
  (build & push)     (imagens)
                         │
                         ▼
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

## Arquivos de Configuração

| Arquivo | Função |
|---|---|
| `docker-compose.yml` | Define os serviços para Swarm |
| `Dockerfile.backend` | Receita da imagem do backend |
| `Dockerfile.frontend` | Receita da imagem do frontend |
| `nginx.conf` | Proxy reverso e arquivos estáticos |
| `.github/workflows/docker-build.yml` | Build automático via GitHub Actions |
| `build.sh` | Build manual local (alternativa) |
| `.env.example` | Modelo de variáveis de ambiente |
