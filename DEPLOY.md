# Educare+ — Guia de Deploy via Portainer

Este guia explica como publicar a aplicação Educare+ no seu servidor (VPS) usando o **Portainer**.

---

## Antes de Começar

Você vai precisar de:

- **Portainer** instalado e acessível no seu servidor (geralmente em `https://seu-servidor:9443`)
- O código do Educare+ num **repositório Git** (GitHub, GitLab, etc.)
- Se o repositório for privado: um **Personal Access Token** do GitHub/GitLab

> O PostgreSQL já deve estar rodando no seu servidor. Este deploy NÃO cria um banco de dados novo.

---

## Passo 1: Preparar as Variáveis de Ambiente

Antes de criar o Stack no Portainer, prepare os valores das variáveis de ambiente. Copie a lista abaixo e preencha com seus dados reais:

### Variáveis Obrigatórias

```
NODE_ENV=production
PORT=5000
FRONTEND_PORT=80

DB_USERNAME=seu_usuario_banco
DB_PASSWORD=sua_senha_banco
DB_DATABASE=educareapp
DB_HOST=172.17.0.1
DB_PORT=5432
DB_DIALECT=postgres
DB_TIMEZONE=America/Sao_Paulo
DB_SYNC_ENABLED=false

JWT_SECRET=TROQUE_POR_UMA_STRING_LONGA_E_ALEATORIA
JWT_EXPIRATION=24h

FRONTEND_URL=https://seu-dominio.com.br
BACKEND_URL=https://seu-dominio.com.br
APP_URL=https://seu-dominio.com.br
VITE_API_URL=https://seu-dominio.com.br
CORS_ORIGINS=https://seu-dominio.com.br

OPENAI_API_KEY=sk-sua-chave-openai
```

> **Dica sobre DB_HOST:** Se o PostgreSQL roda no mesmo servidor que o Docker, use `172.17.0.1` (IP padrão do gateway Docker no Linux). Para descobrir o IP correto, rode no terminal do servidor: `ip addr show docker0 | grep inet`

### Variáveis Opcionais (preencha conforme usa)

```
GEMINI_API_KEY=sua-chave-gemini
ENABLE_GEMINI_RAG=true

QDRANT_URL=https://seu-qdrant.cloud.qdrant.io
QDRANT_API_KEY=sua-chave-qdrant
ENABLE_QDRANT_RAG=true

STRIPE_SECRET_KEY=sk_live_sua-chave-stripe
STRIPE_WEBHOOK_SECRET=whsec_seu-webhook-secret

EVOLUTION_API_URL=https://sua-evolution-api.com
EVOLUTION_API_KEY=sua-chave-evolution
EVOLUTION_INSTANCE_NAME=seu-instance

PHONE_VERIFICATION_WEBHOOK=https://seu-n8n.com/webhook/phone-verify
PHONE_PASSWORD_WEBHOOK=https://seu-n8n.com/webhook/phone-password
EMAIL_WEBHOOK=https://seu-n8n.com/webhook/email
ESCALATION_WEBHOOK_URL=https://seu-n8n.com/webhook/escalation
N8N_API_KEY=sua-chave-n8n
N8N_REST_API_KEY=sua-chave-n8n-rest

EXTERNAL_API_KEY=sua-chave-api-externa
API_BASE_URL=https://sua-api-base.com
API_VERSION=v1

OWNER_PHONE=5511999999999

UPLOAD_PATH=./uploads
KNOWLEDGE_UPLOAD_PATH=./knowledge_base
BACKUP_PATH=./backups

VIMEO_ACCESS_TOKEN=seu-token-vimeo

RAG_PRIMARY_PROVIDER=openai
ENABLE_SEGMENTED_KB=true
KB_FALLBACK_ENABLED=false
USE_LEGACY_FALLBACK_FOR_BABY=false
USE_LEGACY_FALLBACK_FOR_MOTHER=false
USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=false
KB_LOG_SELECTIONS=true
KB_VERSIONING_ENABLED=true
LEGACY_INGESTION_DISABLED=true

RERANKING_ENABLED=true
RERANKING_MODEL=gpt-4o-mini
RERANKING_MAX_CANDIDATES=20
RERANKING_TOP_K=5

CONFIDENCE_HIGH_THRESHOLD=0.80
CONFIDENCE_MEDIUM_THRESHOLD=0.50
CONFIDENCE_LOW_THRESHOLD=0.30
MIN_DOCS_HIGH_CONFIDENCE=3

CHUNKING_ENABLED=true
CHUNKING_LLM_ASSISTED=true
MIN_CHUNK_SIZE=250
MAX_CHUNK_SIZE=1200
CHUNK_OVERLAP_SIZE=100

AUGMENTATION_ENABLED=true
AUGMENTATION_MODEL=gpt-4o-mini

CONTEXT_SAFETY_ENABLED=true
BLOCK_UNSAFE_CONTENT=false
LOG_SAFETY_EVENTS=true

RAG_FEEDBACK_ENABLED=true
RAG_AUTO_ANALYSIS=true
RAG_IMPROVEMENT_MODEL=gpt-4o-mini
RAG_STORE_MAX_SIZE=10000
RAG_USE_DB_PERSISTENCE=true
REQUIRE_HUMAN_BELOW=0.30

GUARDRAILS_STRICT_MODE=false
LOG_GUARDRAILS_EVENTS=true
LOG_LEVEL=info
```

---

## Passo 2: Criar o Stack no Portainer

1. Abra o Portainer no navegador (ex: `https://seu-servidor:9443`)

2. No menu lateral, clique em **Stacks**

3. Clique no botão **+ Add stack**

4. Preencha:
   - **Name:** `educare` (ou o nome que preferir)
   - **Build method:** Selecione **Git Repository**

5. Preencha os dados do repositório:

   | Campo | O que colocar |
   |---|---|
   | **Authentication** | Ative se o repositório for privado |
   | **Username** | Seu usuário do GitHub/GitLab |
   | **Personal Access Token** | Seu token de acesso |
   | **Repository URL** | `https://github.com/seu-usuario/educare.git` |
   | **Repository reference** | `refs/heads/main` (ou a branch desejada) |
   | **Compose path** | `docker-compose.yml` |

6. Role para baixo até **Environment variables**

7. Clique em **Advanced mode** para colar todas as variáveis de uma vez

8. Cole todas as variáveis do Passo 1 (já preenchidas com seus dados)

9. Clique em **Deploy the stack**

> O primeiro deploy pode levar **5-10 minutos** pois precisa baixar as imagens base e compilar o frontend.

---

## Passo 3: Verificar se Está Funcionando

Após o deploy, você verá os 2 containers listados no Stack:

| Container | Status esperado |
|---|---|
| `educare-frontend` | **Running (healthy)** |
| `educare-backend` | **Running (healthy)** |

### Ver os Logs

1. Clique no nome do container (ex: `educare-backend`)
2. Clique em **Logs** no menu superior
3. Ative **Auto-refresh** para ver em tempo real

### Testar

- Abra `http://seu-servidor` (ou `https://seu-dominio.com.br` se já tiver SSL)
- Você deve ver a tela de login do Educare+
- Teste o login com suas credenciais

---

## Como Atualizar (Nova Versão)

Quando tiver uma atualização no código:

1. Faça o **commit e push** das alterações para o Git

2. No Portainer, vá em **Stacks** → clique no stack **educare**

3. Clique no botão **Pull and redeploy**

4. Marque a opção **Re-pull image and redeploy** se quiser forçar rebuild

5. Clique em **Update**

> O Portainer vai baixar o código atualizado, reconstruir as imagens e reiniciar os containers automaticamente.

### Atualização Automática (GitOps) — Opcional

Você pode configurar o Portainer para atualizar sozinho quando detectar mudanças no Git:

1. Edite o Stack
2. Na seção **GitOps updates**, ative a opção
3. Defina o intervalo (ex: a cada 5 minutos)
4. O Portainer vai verificar o Git periodicamente e atualizar se houver mudanças

---

## Como Voltar para uma Versão Anterior (Rollback)

Se algo der errado após uma atualização:

1. **No Git:** Volte para o commit anterior
   ```bash
   git log --oneline -5              # ver os últimos commits
   git revert HEAD                   # reverter o último commit
   git push origin main              # enviar a reversão
   ```

2. **No Portainer:** Clique em **Pull and redeploy** no Stack

> O Portainer vai baixar o código revertido e reconstruir tudo.

---

## Configuração HTTPS (SSL)

Para acessar via `https://`, você precisa de um proxy reverso com certificado SSL **fora** do Docker, ou usando Nginx/Traefik na mesma máquina.

### Opção mais simples: Nginx no servidor

Se já tem Nginx instalado no servidor:

1. Instale o Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Crie a configuração do Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/educare
   ```

   Cole:
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com.br;

       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           client_max_body_size 50M;
       }
   }
   ```

3. Ative e obtenha o certificado:
   ```bash
   sudo ln -s /etc/nginx/sites-available/educare /etc/nginx/sites-enabled/
   sudo certbot --nginx -d seu-dominio.com.br
   sudo systemctl reload nginx
   ```

> **Importante:** Se usar Nginx externo na porta 80, mude o `FRONTEND_PORT` nas variáveis de ambiente do Stack para outra porta (ex: `8080`) para não conflitar.

---

## Solução de Problemas

### "Container não inicia" ou status "Unhealthy"

1. No Portainer, clique no container com problema
2. Vá em **Logs** e procure mensagens de erro
3. Problemas comuns:
   - **Erro de conexão com banco:** Verifique `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`
   - **Porta em uso:** Verifique se a porta 80 não está sendo usada por outro serviço

### "Backend não conecta ao PostgreSQL"

O PostgreSQL precisa aceitar conexões vindas do Docker:

1. Edite o `pg_hba.conf` do PostgreSQL:
   ```bash
   sudo nano /etc/postgresql/*/main/pg_hba.conf
   ```
   Adicione esta linha:
   ```
   host    all    all    172.16.0.0/12    md5
   ```

2. Edite o `postgresql.conf`:
   ```bash
   sudo nano /etc/postgresql/*/main/postgresql.conf
   ```
   Altere para:
   ```
   listen_addresses = '*'
   ```

3. Reinicie o PostgreSQL:
   ```bash
   sudo systemctl restart postgresql
   ```

### "Frontend mostra página em branco"

1. Verifique se `VITE_API_URL` está correto nas variáveis de ambiente
2. No Portainer, vá no Stack e clique **Pull and redeploy** (o VITE_API_URL é usado no momento do build)

> **Importante:** O `VITE_API_URL` é "embutido" no frontend durante a compilação. Se você mudar essa variável depois, precisa clicar em **Pull and redeploy** para recompilar o frontend com o novo valor.

### "Erro 502 Bad Gateway"

O frontend não consegue se comunicar com o backend:
1. Verifique se o container `educare-backend` está rodando e healthy
2. Veja os logs do backend para identificar o erro

---

## Estrutura dos Containers

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

Se precisar acessar o terminal do servidor diretamente:

| O que fazer | Comando |
|---|---|
| Ver containers rodando | `docker ps` |
| Ver logs do backend | `docker logs educare-backend -f --tail=100` |
| Ver logs do frontend | `docker logs educare-frontend -f --tail=100` |
| Entrar no container backend | `docker exec -it educare-backend sh` |
| Ver uso de recursos | `docker stats` |
| Limpar imagens antigas | `docker image prune -f` |

---

## Arquivos de Configuração Docker

| Arquivo | Função |
|---|---|
| `docker-compose.yml` | Define os 2 containers e como se conectam |
| `Dockerfile.backend` | Receita para criar a imagem do backend (Node.js) |
| `Dockerfile.frontend` | Receita para criar a imagem do frontend (React + Nginx) |
| `nginx.conf` | Configuração do servidor web (proxy + arquivos estáticos) |
| `.env.example` | Modelo com todas as variáveis de ambiente |
| `.dockerignore` | Lista de arquivos ignorados pelo Docker no build |
