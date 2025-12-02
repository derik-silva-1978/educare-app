# Deployment Guide: Educare+ no Digital Ocean

## 🎯 Visão Geral

Você vai criar **2 droplets** (servidores) no Digital Ocean:
1. **Droplet 1**: n8n + PostgreSQL (Automação WhatsApp)
2. **Droplet 2**: Evolution API + Redis (API WhatsApp)

Seu backend Educare+ continua rodando onde está (Replit ou outro host).

---

## 💰 Custos Estimados

| Recurso | Tamanho | Preço/mês | Notas |
|---------|---------|-----------|-------|
| **n8n Droplet** | 2GB RAM | $12 | Ubuntu 20.04 + Docker |
| **Evolution API Droplet** | 2GB RAM | $12 | Ubuntu 20.04 + Docker |
| **Backup Snapshots** | - | ~$2/mês | Proteção contra perda de dados |
| **TOTAL** | - | **~$26/mês** | Sem limite de requisições |

---

## 📋 Pré-requisitos

✅ Conta no Digital Ocean (https://www.digitalocean.com)  
✅ Domínio customizado (ex: `n8n.seudominio.com`, `whatsapp-api.seudominio.com`)  
✅ Acesso SSH ao seu registrador de domínio  
✅ Terminal/SSH para executar comandos  

---

## 🚀 PARTE 1: Hospedar n8n

### Opção A: Mais Fácil (1-Click App)

**Passo 1: Criar Droplet**
1. No painel DigitalOcean → Marketplace → Buscar "n8n"
2. Selecione "n8n 1-Click App"
3. Escolha plano: **$12/mês (2GB RAM)**
4. Região: Escolha mais perto de seus usuários
5. SSH key: Selecione sua chave SSH (ou crie uma)
6. Clique "Create Droplet"

**Passo 2: Configurar Domínio (DNS)**
1. Copie o IP do seu novo droplet (mostrado no painel)
2. Acesse seu registrador de domínio
3. Crie um registro A:
   ```
   Type: A
   Name: n8n
   Value: [IP do Droplet]
   TTL: 3600
   ```
4. Aguarde 5-10 minutos para propagar

**Passo 3: Acessar n8n**
```
https://n8n.seudominio.com
```

✅ Pronto! n8n já está com SSL automático.

---

### Opção B: Mais Controle (Docker Manual)

**Passo 1: SSH no Droplet**
```bash
ssh root@seu_droplet_ip
```

**Passo 2: Instalar Docker**
```bash
apt update && apt install -y docker.io docker-compose
systemctl start docker
```

**Passo 3: Criar estrutura de pastas**
```bash
mkdir -p ~/n8n-docker-caddy
cd ~/n8n-docker-caddy
mkdir -p caddy_config local_files
docker volume create caddy_data
```

**Passo 4: Criar arquivo `.env`**
```bash
cat > .env << 'EOF'
DATA_FOLDER=/root/n8n-docker-caddy
SUBDOMAIN=n8n
DOMAIN=seudominio.com
GENERIC_TIMEZONE="America/Sao_Paulo"
N8N_ENCRYPTION_KEY=sua_chave_criptografia_aleatoria_aqui_minimo_32_caracteres_aleatorios
EOF
```

**Passo 5: Criar `docker-compose.yml`**
```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  caddy:
    image: caddy:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      - DOMAIN=${SUBDOMAIN}.${DOMAIN}
      - EMAIL=seu-email@exemplo.com
    volumes:
      - ${DATA_FOLDER}/caddy_config:/config
      - caddy_data:/data
      - ${DATA_FOLDER}/Caddyfile:/etc/caddy/Caddyfile

  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    environment:
      - N8N_HOST=${SUBDOMAIN}.${DOMAIN}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://${SUBDOMAIN}.${DOMAIN}/
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=seu_password_postgres_aqui
    volumes:
      - ${DATA_FOLDER}/local_files:/home/node/.n8n
      - ${DATA_FOLDER}/local_files:/files

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=seu_password_postgres_aqui
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  caddy_data:
    external: true
  postgres_data:
EOF
```

**Passo 6: Criar `Caddyfile`**
```bash
cat > Caddyfile << 'EOF'
{$DOMAIN} {
    reverse_proxy n8n:5678
}
EOF
```

**Passo 7: Iniciar n8n**
```bash
docker compose up -d

# Verificar se está rodando
docker ps

# Ver logs
docker compose logs -f
```

**Passo 8: Configurar DNS (mesmo da Opção A)**

✅ Acesse em: `https://n8n.seudominio.com`

---

## 🐳 PARTE 2: Hospedar Evolution API

### Passo 1: Criar Segundo Droplet

1. Repetir processo: Marketplace → "Docker on Ubuntu"
2. Selecione: **$12/mês (2GB RAM)**
3. Região: Mesma do n8n (ou próxima)
4. SSH: Use mesma chave

### Passo 2: SSH no Novo Droplet

```bash
ssh root@seu_novo_droplet_ip
```

### Passo 3: Criar Estrutura

```bash
mkdir -p ~/evolution-api
cd ~/evolution-api

apt update && apt install -y docker.io docker-compose
systemctl start docker
```

### Passo 4: Criar `docker-compose.yml`

```bash
cat > docker-compose.yml << 'EOF'
version: "3.7"

services:
  evolution_api:
    image: atendai/evolution-api:v2.1.1
    container_name: evolution_api
    restart: always
    ports:
      - "8080:8080"
    volumes:
      - evolution_instances:/evolution/instances
    environment:
      - SERVER_URL=https://api-whatsapp.seudominio.com
      - DEL_INSTANCE=false
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://postgres:seu_password_postgres@postgres:5432/evolution
      - DATABASE_SAVE_DATA_INSTANCE=true
      - DATABASE_SAVE_DATA_NEW_MESSAGE=true
      - DATABASE_SAVE_MESSAGE_UPDATE=true
      - DATABASE_SAVE_DATA_CONTACTS=true
      - DATABASE_SAVE_DATA_CHATS=true
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://redis:6379/1
      - CACHE_REDIS_PREFIX_KEY=evolution_v2
      - AUTHENTICATION_API_KEY=sua_evolution_api_key_aleatoria_minimo_32_caracteres
    networks:
      - evolution_network
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    container_name: postgres_evolution
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=seu_password_postgres
      - POSTGRES_DB=evolution
    volumes:
      - postgres_evolution:/var/lib/postgresql/data
    networks:
      - evolution_network

  redis:
    image: redis:7-alpine
    container_name: redis_evolution
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_evolution:/data
    networks:
      - evolution_network

volumes:
  evolution_instances:
  postgres_evolution:
  redis_evolution:

networks:
  evolution_network:
    driver: bridge
EOF
```

### Passo 5: Iniciar Evolution API

```bash
docker compose up -d

# Verificar se está rodando
docker ps

# Ver logs
docker compose logs -f evolution_api
```

### Passo 6: Configurar Nginx + SSL

```bash
# Instalar Nginx e Let's Encrypt
apt install -y nginx certbot python3-certbot-nginx

# Criar configuração
nano /etc/nginx/sites-available/evolution
```

Cole isto:
```nginx
server {
    listen 80;
    server_name api-whatsapp.seudominio.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Ativar:
```bash
ln -s /etc/nginx/sites-available/evolution /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Obter SSL automático
certbot --nginx -d api-whatsapp.seudominio.com
```

### Passo 7: Configurar DNS

Crie outro registro A no seu registrador:
```
Type: A
Name: api-whatsapp
Value: [IP do segundo Droplet]
TTL: 3600
```

✅ Acesse: `https://api-whatsapp.seudominio.com`

---

## 🔗 PARTE 3: Integração com n8n

### Passo 1: No n8n, importar seu blueprint

1. Acesse `https://n8n.seudominio.com`
2. **Workflows** → **Import**
3. Selecione `n8n-educare-integrated.json`
4. Clique "Import"

### Passo 2: Configurar Credenciais

1. Na barra lateral → **Credentials**
2. Crie nova credencial:

**Educare API:**
- Tipo: HTTP Header Auth
- Base URL: `https://seu-backend-educare.com/api/external/`
- Headers: `X-API-Key: educare_external_api_key_2025`

**Evolution API:**
- Tipo: HTTP Bearer
- URL: `https://api-whatsapp.seudominio.com`
- API Key: `sua_evolution_api_key_aleatoria` (da docker-compose.yml)

### Passo 3: Ativar Workflow

1. Abra o workflow importado
2. Clique **Test** para validar conexões
3. Clique **Save**
4. Ative o toggle **Active**

---

## 📊 Verificação Rápida

### Testar n8n
```bash
curl https://n8n.seudominio.com/
# Deve retornar HTML do n8n
```

### Testar Evolution API
```bash
curl -X GET https://api-whatsapp.seudominio.com/ \
  -H "apikey: sua_evolution_api_key_aleatoria"

# Resposta esperada:
# {"status": 200, "message": "Welcome to Evolution API"}
```

---

## 🛡️ Segurança & Backups

### Backup Automático de n8n

```bash
# SSH no droplet n8n
ssh root@n8n_droplet_ip

# Criar snapshot a cada 7 dias
# (Mais fácil: Use painel DigitalOcean → Snapshots → Enable Automated)
```

### Backup do Evolution API

```bash
# SSH no droplet Evolution
ssh root@evolution_droplet_ip

# Backup do banco de dados
docker compose exec postgres pg_dump -U postgres evolution > backup.sql

# Restaurar se necessário
docker compose exec -T postgres psql -U postgres evolution < backup.sql
```

### Firewall

```bash
# Abrir apenas portas necessárias
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

---

## 🔄 Monitoramento & Atualização

### Atualizar n8n

```bash
# SSH no droplet
ssh root@n8n_droplet_ip
cd ~/n8n-docker-caddy

docker compose pull
docker compose down
docker compose up -d

# Verificar versão
docker logs n8n-docker-caddy-n8n-1 | grep "Version"
```

### Atualizar Evolution API

```bash
# SSH no droplet
ssh root@evolution_droplet_ip
cd ~/evolution-api

# Editar docker-compose.yml se houver nova versão
# Exemplo: mudar v2.1.1 para v2.2.0

docker compose pull
docker compose down
docker compose up -d
```

---

## 📱 Próximo Passo: Conectar WhatsApp

1. No Evolution API, criar instância WhatsApp:
```bash
curl -X POST https://api-whatsapp.seudominio.com/instance/create \
  -H "apikey: sua_evolution_api_key_aleatoria" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "educare-bot",
    "token": "token_seguro_aqui"
  }'
```

2. Obter QR Code:
```bash
curl -X GET https://api-whatsapp.seudominio.com/instance/qrcode/educare-bot \
  -H "apikey: sua_evolution_api_key_aleatoria"
```

3. Escanear com WhatsApp: Configurações → Dispositivos Conectados → Escanear QR

---

## 🆘 Troubleshooting

### n8n não abre
```bash
# SSH no droplet
docker compose logs -f n8n
# Procure por erros de conexão PostgreSQL ou Caddy
```

### Evolution API 500 error
```bash
docker compose logs -f evolution_api
# Verificar se PostgreSQL e Redis estão rodando
docker ps
```

### SSL certificate errors
```bash
# Renew certificate
certbot renew --force-renewal

# Ou recriar
certbot delete --cert-name api-whatsapp.seudominio.com
certbot certonly --nginx -d api-whatsapp.seudominio.com
```

---

## 📚 Recursos Úteis

- n8n Docs: https://docs.n8n.io
- Evolution API: https://doc.evolution-api.com
- DigitalOcean: https://docs.digitalocean.com
- SSH Keys: https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/

---

**Tempo estimado de setup: ~1 hora** ⏱️

Qualquer dúvida, me avise! 🚀
