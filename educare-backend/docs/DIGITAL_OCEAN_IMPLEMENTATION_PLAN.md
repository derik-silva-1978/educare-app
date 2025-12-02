# Plano de Implementação: Educare+ no Digital Ocean

## ⏱️ Timeline Estimada
- **Setup Digital Ocean**: 10 min
- **Deploy n8n**: 15 min
- **Deploy Evolution API**: 20 min
- **Integração**: 15 min
- **Testes**: 20 min
- **TOTAL**: ~1.5 horas

---

## 📋 CHECKLIST PRÉ-IMPLEMENTAÇÃO

- [ ] Criar/logar na conta Digital Ocean
- [ ] Ter 2 domínios preparados (ou 2 subdomínios)
- [ ] Ter acesso SSH key pronto
- [ ] Ter o arquivo `n8n-educare-integrated.json` salvo localmente
- [ ] Ter `EXTERNAL_API_KEY=educare_external_api_key_2025` pronto
- [ ] Ter `OPENAI_API_KEY` disponível

---

## 🎯 PASSO 1: Preparar Domínios

### Seu Setup de Domínios

```
Domínio principal: seudominio.com
├── n8n.seudominio.com          → Droplet 1 (n8n)
└── api-whatsapp.seudominio.com → Droplet 2 (Evolution API)
```

**O que fazer:**
1. Acesse seu registrador de domínio (GoDaddy, Namecheap, etc)
2. Vá para DNS/Nameservers
3. **Não crie os registros A ainda** (faremos depois de criar os Droplets)
4. Tenha pronto o painel de DNS para quando os IPs forem gerados

---

## 🎯 PASSO 2: Criar Droplet 1 (n8n)

### 2.1 No painel Digital Ocean

```
1. Sidebar → Droplets → Create Droplet
2. Choose Image → Marketplace → Search "n8n"
3. Select "n8n 1-Click App"
4. Choose Plan:
   - Shared CPU
   - $12/month
   - 2 GB / 2 vCPU / 60 GB SSD
5. Region: (Escolha mais perto de você/seus usuários)
6. Add SSH Key:
   - Se não tem SSH key ainda, crie uma:
     $ ssh-keygen -t rsa -b 4096
     $ cat ~/.ssh/id_rsa.pub  # Copie isto
   - Cole a chave pública no painel DO
7. Create Droplet
```

### 2.2 Espere 2-3 minutos

Você receberá um IP. **Copie este IP** (ex: `165.227.123.45`)

---

## 🎯 PASSO 3: Configurar DNS para n8n

### No seu registrador (GoDaddy, Namecheap, etc)

```
Nome: n8n
Tipo: A
Valor: [IP do Droplet 1]
TTL: 3600
```

Aguarde 5-10 minutos para propagar.

---

## 🎯 PASSO 4: SSH no Droplet 1 e Configurar n8n

### 4.1 SSH

```bash
ssh root@165.227.123.45
# Ou use hostname quando DNS propagar:
ssh root@n8n.seudominio.com
```

### 4.2 Criar Estrutura

```bash
mkdir -p ~/n8n-docker-caddy
cd ~/n8n-docker-caddy
mkdir -p caddy_config local_files
docker volume create caddy_data
```

### 4.3 Criar arquivo `.env`

```bash
cat > .env << 'EOF'
DATA_FOLDER=/root/n8n-docker-caddy
SUBDOMAIN=n8n
DOMAIN=seudominio.com
GENERIC_TIMEZONE="America/Sao_Paulo"
N8N_ENCRYPTION_KEY=5f8a9k2mL9pQ1wXyZaBcDeFgHiJkLmNoPqRsT
EOF
```

**IMPORTANTE:** Gere uma chave aleatória de 32+ caracteres:
```bash
openssl rand -base64 32
```
Substitua o valor em `N8N_ENCRYPTION_KEY`.

### 4.4 Criar `docker-compose.yml`

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
      - EMAIL=seu-email@seudominio.com
    volumes:
      - ${DATA_FOLDER}/caddy_config:/config
      - caddy_data:/data
      - ${DATA_FOLDER}/Caddyfile:/etc/caddy/Caddyfile
    networks:
      - n8n_network

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
      - DB_POSTGRESDB_PASSWORD=n8n_secure_password_123
    volumes:
      - ${DATA_FOLDER}/local_files:/home/node/.n8n
      - ${DATA_FOLDER}/local_files:/files
    networks:
      - n8n_network
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=n8n_secure_password_123
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - n8n_network

volumes:
  caddy_data:
    external: true
  postgres_data:

networks:
  n8n_network:
    driver: bridge
EOF
```

### 4.5 Criar `Caddyfile`

```bash
cat > Caddyfile << 'EOF'
{$DOMAIN} {
    reverse_proxy n8n:5678
}
EOF
```

### 4.6 Iniciar n8n

```bash
docker compose up -d

# Espere 30 segundos, depois verifique:
docker ps

# Ver logs (se houver erro):
docker compose logs -f n8n
```

### 4.7 Testar

```bash
# Aguarde DNS propagar, depois acesse:
https://n8n.seudominio.com

# Ou teste com curl:
curl -I https://n8n.seudominio.com/
# Deve retornar 200 OK
```

---

## 🎯 PASSO 5: Criar Droplet 2 (Evolution API)

### 5.1 No painel Digital Ocean

```
1. Sidebar → Droplets → Create Droplet
2. Choose Image → Docker on Ubuntu 24.04
3. Choose Plan:
   - Shared CPU
   - $12/month
   - 2 GB / 2 vCPU / 60 GB SSD
4. Region: (Mesma do Droplet 1)
5. Add SSH Key: Mesma chave
6. Create Droplet
```

### 5.2 Copie o IP (ex: `165.227.234.56`)

---

## 🎯 PASSO 6: Configurar DNS para Evolution API

### No seu registrador

```
Nome: api-whatsapp
Tipo: A
Valor: [IP do Droplet 2]
TTL: 3600
```

---

## 🎯 PASSO 7: SSH no Droplet 2 e Deploy Evolution API

### 7.1 SSH

```bash
ssh root@165.227.234.56
```

### 7.2 Atualizar e Instalar Docker

```bash
apt update && apt upgrade -y
apt install -y docker.io docker-compose
systemctl start docker
systemctl enable docker
```

### 7.3 Criar Estrutura

```bash
mkdir -p ~/evolution-api
cd ~/evolution-api
```

### 7.4 Criar `docker-compose.yml`

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
      - DATABASE_CONNECTION_URI=postgresql://postgres:evolution_password_123@postgres:5432/evolution
      - DATABASE_SAVE_DATA_INSTANCE=true
      - DATABASE_SAVE_DATA_NEW_MESSAGE=true
      - DATABASE_SAVE_MESSAGE_UPDATE=true
      - DATABASE_SAVE_DATA_CONTACTS=true
      - DATABASE_SAVE_DATA_CHATS=true
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://redis:6379/1
      - CACHE_REDIS_PREFIX_KEY=evolution_v2
      - RABBITMQ_ENABLED=false
      - AUTHENTICATION_API_KEY=your_evolution_api_key_here_min_32_chars
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
      - POSTGRES_PASSWORD=evolution_password_123
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

### 7.5 Gerar API Key forte

```bash
openssl rand -base64 32
# Copie o resultado e substitua em AUTHENTICATION_API_KEY acima
```

### 7.6 Iniciar Evolution API

```bash
docker compose up -d

# Espere 30 segundos
docker ps

# Ver logs:
docker compose logs -f evolution_api
```

### 7.7 Instalar Nginx + SSL

```bash
apt install -y nginx certbot python3-certbot-nginx

# Criar configuração
cat > /etc/nginx/sites-available/evolution << 'EOF'
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
EOF

# Ativar site
ln -s /etc/nginx/sites-available/evolution /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Obter SSL (aguarde DNS propagar primeiro)
certbot --nginx -d api-whatsapp.seudominio.com
```

### 7.8 Testar

```bash
# Aguarde DNS propagar
curl -X GET https://api-whatsapp.seudominio.com/ \
  -H "apikey: your_evolution_api_key_here_min_32_chars"

# Resposta esperada:
# {"status": 200, "message": "Welcome to Evolution API"}
```

---

## 🎯 PASSO 8: Integração no n8n

### 8.1 Acessar n8n

```
https://n8n.seudominio.com
```

### 8.2 Importar Blueprint

1. **Workflows** → **Import from file**
2. Selecione: `n8n-educare-integrated.json`
3. Clique **Import**

### 8.3 Configurar Credenciais

**Credencial 1: Educare API**
1. Sidebar → **Credentials** → **Create credential**
2. Type: HTTP Header Auth
3. Nome: `Educare API`
4. Base URL: `https://seu-backend-educare.com/api/external/`
5. Headers: `X-API-Key: educare_external_api_key_2025`
6. Save

**Credencial 2: Evolution API**
1. Sidebar → **Credentials** → **Create credential**
2. Type: Generic Credential / Custom
3. Nome: `Evolution API`
4. Adicione campo customizado:
   - Key: `apikey`
   - Value: `your_evolution_api_key_here_min_32_chars`
5. Save

### 8.4 Atualizar Variáveis no Workflow

1. Abra o workflow importado
2. Procure por nós "HTTP Request"
3. Verifique URLs:
   - Educare API: `https://seu-backend-educare.com/api/external/...`
   - Evolution API: `https://api-whatsapp.seudominio.com/...`
4. Save

### 8.5 Testar Workflow

1. Clique **Test** no primeiro nó
2. Se tudo passar, clique **Save**
3. Ative o toggle **Active** para ligar o workflow

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] n8n acessível em https://n8n.seudominio.com
- [ ] Evolution API respondendo a GET /
- [ ] Blueprint importado no n8n
- [ ] Credenciais configuradas
- [ ] Workflow ativo
- [ ] Teste de mensagem WhatsApp passando

---

## 🔧 Próximos Passos Após Deploy

1. **Conectar WhatsApp:**
   ```bash
   curl -X POST https://api-whatsapp.seudominio.com/instance/create \
     -H "apikey: your_evolution_api_key_here_min_32_chars" \
     -H "Content-Type: application/json" \
     -d '{
       "instanceName": "educare-bot",
       "token": "token_seguro_aqui"
     }'
   ```

2. **Obter QR Code:**
   ```bash
   curl -X GET https://api-whatsapp.seudominio.com/instance/qrcode/educare-bot \
     -H "apikey: your_evolution_api_key_here_min_32_chars"
   ```

3. **Escanear com WhatsApp:** Configurações → Dispositivos Conectados

---

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| n8n não abre | `docker logs n8n-docker-caddy-n8n-1` |
| Evolution API 500 | `docker compose logs -f evolution_api` |
| SSL erro | Aguarde DNS (5-10 min) ou `certbot renew --force-renewal` |
| Conexão recusada | Firewall? Abra portas 80 e 443 no DO |

---

## 📞 Suporte

Quando você executar cada passo, reporte:
- ✅ O que funcionou
- ❌ Qualquer erro (com mensagem completa)
- 🤔 Dúvidas

Vou ajudar a resolver! 🚀

