# Educare+ — Guia de Deploy com Docker Compose

Este guia explica como publicar a aplicação Educare+ no seu servidor (VPS) usando Docker.

---

## O que você vai precisar no servidor

Antes de começar, certifique-se de que o servidor tem instalado:

- **Docker** (versão 20.10+)
- **Docker Compose** (versão 2.0+ — geralmente já vem com o Docker)
- **Git** (para baixar o código)

### Verificar se já estão instalados

```bash
docker --version
docker compose version
git --version
```

### Instalar Docker (se necessário)

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Saia e entre novamente no servidor para aplicar
```

---

## Passo a Passo

### 1. Copiar o projeto para o servidor

**Opção A — Via Git (recomendado):**

```bash
cd /home/educare
git clone https://seu-repositorio.git apps
cd apps
```

**Opção B — Via upload manual (SCP):**

```bash
# No seu computador local:
scp -r ./projeto usuario@seu-servidor:/home/educare/apps
```

---

### 2. Configurar as variáveis de ambiente

Crie o arquivo `.env` a partir do modelo:

```bash
cd /home/educare/apps
cp .env.example .env
```

Edite o arquivo com seus dados reais:

```bash
nano .env
```

**Variáveis obrigatórias que você DEVE preencher:**

| Variável | O que é | Exemplo |
|---|---|---|
| `DB_HOST` | IP/endereço do banco de dados | `localhost` ou `10.0.0.5` |
| `DB_USERNAME` | Usuário do banco | `educareuser` |
| `DB_PASSWORD` | Senha do banco | `sua-senha-segura` |
| `DB_DATABASE` | Nome do banco | `educareapp` |
| `JWT_SECRET` | Chave secreta para login | `uma-string-longa-e-aleatoria` |
| `FRONTEND_URL` | URL pública do site | `https://app.educare.com.br` |
| `OPENAI_API_KEY` | Chave da OpenAI | `sk-...` |
| `VITE_API_URL` | URL da API (igual ao domínio) | `https://app.educare.com.br` |
| `CORS_ORIGINS` | Domínios permitidos | `https://app.educare.com.br` |

> **Importante:** Se o PostgreSQL roda no mesmo servidor, use `DB_HOST=host.docker.internal` (Mac/Windows) ou o IP da interface `docker0` (Linux). Para encontrar no Linux:
> ```bash
> ip addr show docker0 | grep inet
> ```

---

### 3. Construir as imagens

```bash
docker compose build
```

Isso vai:
1. Compilar o frontend (React → arquivos estáticos)
2. Preparar o backend (Node.js com dependências de produção)
3. Criar as imagens Docker otimizadas

> **Primeira vez pode demorar** alguns minutos. Builds seguintes são mais rápidos.

---

### 4. Iniciar a aplicação

```bash
docker compose up -d
```

O `-d` significa que roda em segundo plano (você pode fechar o terminal).

**Verificar se está rodando:**

```bash
docker compose ps
```

Você deve ver algo como:

```
NAME                STATUS              PORTS
educare-frontend    Up (healthy)        0.0.0.0:80->80/tcp
educare-backend     Up (healthy)
```

---

### 5. Verificar os logs

**Ver todos os logs:**

```bash
docker compose logs
```

**Ver logs em tempo real:**

```bash
docker compose logs -f
```

**Ver logs de um serviço específico:**

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

**Ver apenas as últimas 100 linhas:**

```bash
docker compose logs --tail=100
```

---

## Atualizações

Quando tiver uma nova versão do código:

```bash
cd /home/educare/apps

# 1. Baixar o código atualizado
git pull origin main

# 2. Reconstruir as imagens
docker compose build

# 3. Reiniciar com as novas imagens
docker compose up -d
```

---

## Rollback (voltar para versão anterior)

Se algo der errado após uma atualização:

```bash
# 1. Parar os containers
docker compose down

# 2. Voltar o código para a versão anterior
git log --oneline -5          # ver os últimos commits
git checkout COMMIT_HASH      # substituir COMMIT_HASH pelo hash desejado

# 3. Reconstruir e reiniciar
docker compose build
docker compose up -d
```

---

## Comandos Úteis

| O que fazer | Comando |
|---|---|
| Ver status | `docker compose ps` |
| Parar tudo | `docker compose down` |
| Reiniciar tudo | `docker compose restart` |
| Reiniciar só o backend | `docker compose restart backend` |
| Ver logs em tempo real | `docker compose logs -f` |
| Entrar no container backend | `docker compose exec backend sh` |
| Ver uso de recursos | `docker stats` |
| Limpar imagens antigas | `docker image prune -f` |

---

## Configuração com HTTPS (SSL)

Para usar HTTPS com certificado gratuito (Let's Encrypt), existem duas opções:

### Opção A: Nginx Externo (mais simples)

Se você já tem um Nginx instalado no servidor, configure-o como proxy reverso:

```nginx
server {
    listen 443 ssl;
    server_name app.educare.com.br;

    ssl_certificate /etc/letsencrypt/live/app.educare.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.educare.com.br/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}

server {
    listen 80;
    server_name app.educare.com.br;
    return 301 https://$host$request_uri;
}
```

### Opção B: Traefik (via Docker Compose)

O `docker-compose.yml` já inclui uma configuração comentada do Traefik.
Para ativá-la, descomente a seção do Traefik e adicione labels nos serviços.

---

## Solução de Problemas

### Container não inicia

```bash
# Ver logs de erro
docker compose logs backend

# Verificar se a porta está em uso
sudo lsof -i :80
sudo lsof -i :5000
```

### Backend não conecta ao banco de dados

1. Verifique se o PostgreSQL está acessível:
```bash
docker compose exec backend sh -c "curl -v telnet://DB_HOST:5432"
```

2. Se o PostgreSQL roda no mesmo servidor, verifique o `pg_hba.conf`:
```bash
# Adicionar esta linha para permitir conexões do Docker:
# host    all    all    172.16.0.0/12    md5
sudo nano /etc/postgresql/*/main/pg_hba.conf
sudo systemctl restart postgresql
```

3. Verifique se o PostgreSQL escuta em todas as interfaces:
```bash
# Em postgresql.conf, altere:
# listen_addresses = '*'
sudo nano /etc/postgresql/*/main/postgresql.conf
sudo systemctl restart postgresql
```

### Frontend mostra página em branco

1. Verifique se o build foi bem-sucedido:
```bash
docker compose logs frontend
```

2. Verifique se `VITE_API_URL` está correto no `.env`
3. Reconstrua o frontend:
```bash
docker compose build frontend
docker compose up -d frontend
```

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

## Deploy Manual (sem Docker)

Se preferir fazer deploy sem Docker, consulte as instruções anteriores usando PM2/systemd no final deste documento.

### Requisitos

- Node.js 20+ instalado
- NPM 8+ instalado

### Build e Start

```bash
# Frontend
npm install --legacy-peer-deps
BROWSERSLIST_IGNORE_OLD_DATA=1 npx vite build

# Backend
cd educare-backend
npm install --omit=dev
NODE_ENV=production node src/server.js

# Ou com PM2
pm2 start src/server.js --name educare-backend
```
