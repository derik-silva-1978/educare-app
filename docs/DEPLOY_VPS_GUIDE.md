# Guia de Deploy - EducareApp v1
## Deploy em VPS Ubuntu com domínio educare.whatscall.com.br

### Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Servidor](#configuração-do-servidor)
3. [Instalação de Dependências](#instalação-de-dependências)
4. [Configuração do PostgreSQL](#configuração-do-postgresql)
5. [Deploy do Backend](#deploy-do-backend)
6. [Deploy do Frontend](#deploy-do-frontend)
7. [Configuração do Nginx](#configuração-do-nginx)
8. [Configuração SSL/HTTPS](#configuração-sslhttps)
9. [Configuração do DNS](#configuração-do-dns)
10. [Configuração do PM2](#configuração-do-pm2)
11. [Configuração do Firewall](#configuração-do-firewall)
12. [Variáveis de Ambiente](#variáveis-de-ambiente)
13. [Scripts de Backup](#scripts-de-backup)
14. [Monitoramento](#monitoramento)
15. [Troubleshooting](#troubleshooting)


git add .
git commit -m "mensagem descritiva"
git push
---

## Pré-requisitos

### Servidor VPS
- **OS**: Ubuntu 20.04 LTS ou superior
- **RAM**: Mínimo 2GB (recomendado 4GB)
- **Storage**: Mínimo 20GB SSD
- **CPU**: 2 vCPUs
- **Acesso**: SSH root ou sudo

### Domínio
- **Domínio**: educare.whatscall.com.br
- **DNS**: Acesso ao painel de DNS para configuração
- **Subdomínios necessários**:
  - `educare.whatscall.com.br` (frontend)
  - `api.educare.whatscall.com.br` (backend)

---

## Configuração do Servidor

### 1. Atualização do Sistema
```bash
# Conectar via SSH
ssh root@SEU_IP_VPS

# Atualizar sistema
apt update && apt upgrade -y

# Instalar utilitários básicos
apt install -y curl wget git unzip software-properties-common
```

### 2. Criar Usuário para Deploy
```bash
# Criar usuário educare
adduser educare
usermod -aG sudo educare

# Configurar SSH para o usuário
mkdir -p /home/educare/.ssh
cp ~/.ssh/authorized_keys /home/educare/.ssh/
chown -R educare:educare /home/educare/.ssh
chmod 700 /home/educare/.ssh
chmod 600 /home/educare/.ssh/authorized_keys

# Trocar para o usuário educare
su - educare
```

---

## Instalação de Dependências

### 1. Node.js (versão 18 LTS)
```bash
# Instalar Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version

# Instalar PM2 globalmente
sudo npm install -g pm2
```

### 2. PostgreSQL


```bash
# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Verificar status
sudo systemctl status postgresql
sudo systemctl enable postgresql
```

### 3. Nginx
```bash
# Instalar Nginx
sudo apt install -y nginx

# Verificar status
sudo systemctl status nginx
sudo systemctl enable nginx
```

### 4. Certbot (para SSL)
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx
```

---

## Configuração do PostgreSQL

### 1. Configurar Usuário e Banco
```bash
# Acessar PostgreSQL como usuário postgres
sudo -u postgres psql

# Dentro do PostgreSQL:
CREATE USER educare_user WITH PASSWORD 'SEnha1@3$';
CREATE DATABASE educare_db OWNER educare_user;
GRANT ALL PRIVILEGES ON DATABASE educare_db TO educare_user;

# Sair do PostgreSQL
\q
```

### 2. Configurar Acesso Remoto (se necessário)
```bash
# Editar postgresql.conf
sudo nano /etc/postgresql/*/main/postgresql.conf

# Alterar linha:
listen_addresses = 'localhost'

# Editar pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Adicionar linha para acesso local:
local   educare_db    educare_user                     md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

---

## Deploy do Backend

### 1. Clonar Repositório
```bash
# Criar diretório para aplicação
mkdir -p /home/educare/apps
cd /home/educare/apps

# Clonar repositório (substitua pela URL do seu repositório)
git clone https://github.com/SEU_USUARIO/educareappv1.git
cd educareappv1/educare-backend
```

### 2. Instalar Dependências
```bash
# Instalar dependências do backend
npm install --production
```

### 3. Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env
nano .env
```

**Conteúdo do arquivo .env do backend:**
```env
# Configurações do Servidor
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=educare_db
DB_USER=educare_user
DB_PASSWORD=SUA_SENHA_FORTE_AQUI

# Configurações de Autenticação JWT
JWT_SECRET=sua_chave_jwt_super_secreta_aqui_256_bits
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=sua_chave_refresh_jwt_super_secreta_aqui_256_bits
JWT_REFRESH_EXPIRES_IN=7d

# Configurações de Email (se aplicável)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app_gmail

# Webhook para verificação de telefone
PHONE_VERIFICATION_WEBHOOK=https://api.whatscall.com.br/webhook/send-code

# URLs do Frontend
FRONTEND_URL=https://educare.whatscall.com.br
CORS_ORIGIN=https://educare.whatscall.com.br

# Configurações de Upload (se aplicável)
UPLOAD_PATH=/home/educare/uploads
MAX_FILE_SIZE=10485760

# Configurações de Log
LOG_LEVEL=info
LOG_FILE=/home/educare/logs/backend.log
```

### 4. Executar Migrações
```bash
# Executar migrações do banco
npm run migrate

# Executar seeders (dados iniciais)
npm run seed
```

### 5. Testar Backend
```bash
# Testar se o backend inicia corretamente
npm start

# Em outro terminal, testar API
curl http://localhost:3000/api/health

# Se funcionou, parar o processo (Ctrl+C)
```

---

## Deploy do Frontend

### 1. Navegar para Frontend
```bash
cd /home/educare/apps/educareappv1
```

### 2. Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env para o frontend
nano .env
```

**Conteúdo do arquivo .env do frontend:**
```env
# URL da API do Backend
VITE_API_URL=https://api.educare.whatscall.com.br

# Configurações da Aplicação
VITE_APP_NAME=EducareApp
VITE_APP_VERSION=1.0.0

# Configurações de Ambiente
VITE_NODE_ENV=production

# URLs de Recursos Externos (se aplicável)
VITE_CDN_URL=https://cdn.educare.whatscall.com.br
```

### 3. Build do Frontend
```bash
# Instalar dependências
npm install --legacy-peer-deps

# Fazer build de produção
npm run build

# Verificar se a pasta dist foi criada
ls -la dist/
```

### 4. Mover Build para Nginx
```bash
# Criar diretório para o site
sudo mkdir -p /var/www/educare.whatscall.com.br

# Copiar arquivos do build
sudo cp -r dist/* /var/www/educare.whatscall.com.br/

# Definir permissões
sudo chown -R www-data:www-data /var/www/educare.whatscall.com.br
sudo chmod -R 755 /var/www/educare.whatscall.com.br
```

---

## Configuração do Nginx

### 1. Configurar Site do Frontend
```bash
# Criar configuração do site
sudo nano /etc/nginx/sites-available/educare.whatscall.com.br
```

**Conteúdo da configuração do frontend:**
```nginx
server {
    listen 80;
    server_name educare.whatscall.com.br www.educare.whatscall.com.br;
    
    root /var/www/educare.whatscall.com.br;
    index index.html;
    
    # Configuração para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### 2. Configurar API do Backend
```bash
# Criar configuração da API
sudo nano /etc/nginx/sites-available/api.educare.whatscall.com.br
```

**Conteúdo da configuração da API:**
```nginx
server {
    listen 80;
    server_name api.educare.whatscall.com.br;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Configuração para uploads
    client_max_body_size 50M;
    
    # Logs
    access_log /var/log/nginx/api.educare.access.log;
    error_log /var/log/nginx/api.educare.error.log;
}
```

### 3. Ativar Sites
```bash
# Ativar configurações
sudo ln -s /etc/nginx/sites-available/educare.whatscall.com.br /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.educare.whatscall.com.br /etc/nginx/sites-enabled/

# Remover site padrão
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## Configuração SSL/HTTPS

### 1. Obter Certificados SSL
```bash
# Obter certificados para ambos os domínios
sudo certbot --nginx -d educare.whatscall.com.br -d www.educare.whatscall.com.br -d api.educare.whatscall.com.br

# Seguir as instruções do Certbot
# Escolher opção 2 (redirect HTTP para HTTPS)
```

### 2. Configurar Renovação Automática
```bash
# Testar renovação
sudo certbot renew --dry-run

# Adicionar ao crontab para renovação automática
sudo crontab -e

# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Configuração do DNS

### No painel de DNS do seu provedor:

```
Tipo    Nome                        Valor               TTL
A       educare                     SEU_IP_VPS          3600
A       www.educare                 SEU_IP_VPS          3600
A       api.educare                 SEU_IP_VPS          3600
CNAME   *.educare                   educare             3600
```

---

## Configuração do PM2

### 1. Criar Arquivo de Configuração
```bash
# Navegar para o backend
cd /home/educare/apps/educareappv1/educare-backend

# Criar arquivo ecosystem.config.js
nano ecosystem.config.js
```

**Conteúdo do ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'educare-backend',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/educare/logs/backend-error.log',
    out_file: '/home/educare/logs/backend-out.log',
    log_file: '/home/educare/logs/backend-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### 2. Iniciar com PM2
```bash
# Criar diretório de logs
mkdir -p /home/educare/logs

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
# Executar o comando que aparecer na saída

# Verificar status
pm2 status
pm2 logs
```

---

## Configuração do Firewall

### 1. Configurar UFW
```bash
# Ativar UFW
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP e HTTPS
sudo ufw allow 'Nginx Full'

# Permitir PostgreSQL apenas localmente
sudo ufw allow from 127.0.0.1 to any port 5432

# Verificar status
sudo ufw status verbose
```

---

## Scripts de Backup

### 1. Script de Backup do Banco
```bash
# Criar diretório de backups
mkdir -p /home/educare/backups

# Criar script de backup
nano /home/educare/scripts/backup-db.sh
```

**Conteúdo do script:**
```bash
#!/bin/bash

# Configurações
DB_NAME="educare_db"
DB_USER="educare_user"
BACKUP_DIR="/home/educare/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/educare_db_$DATE.sql"

# Criar backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "educare_db_*.sql.gz" -mtime +7 -delete

echo "Backup criado: $BACKUP_FILE.gz"
```

### 2. Automatizar Backups
```bash
# Tornar script executável
chmod +x /home/educare/scripts/backup-db.sh

# Adicionar ao crontab
crontab -e

# Backup diário às 2h da manhã
0 2 * * * /home/educare/scripts/backup-db.sh
```

---

## Monitoramento

### 1. Script de Monitoramento
```bash
# Criar script de monitoramento
nano /home/educare/scripts/monitor.sh
```

**Conteúdo do script:**
```bash
#!/bin/bash

# Verificar se o backend está rodando
if ! pm2 describe educare-backend > /dev/null 2>&1; then
    echo "Backend não está rodando. Reiniciando..."
    pm2 restart educare-backend
fi

# Verificar se o Nginx está rodando
if ! systemctl is-active --quiet nginx; then
    echo "Nginx não está rodando. Reiniciando..."
    sudo systemctl restart nginx
fi

# Verificar se o PostgreSQL está rodando
if ! systemctl is-active --quiet postgresql; then
    echo "PostgreSQL não está rodando. Reiniciando..."
    sudo systemctl restart postgresql
fi

# Verificar espaço em disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Aviso: Uso de disco acima de 80%: $DISK_USAGE%"
fi

# Verificar uso de memória
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
    echo "Aviso: Uso de memória acima de 90%: $MEMORY_USAGE%"
fi
```

### 2. Configurar Monitoramento
```bash
# Tornar script executável
chmod +x /home/educare/scripts/monitor.sh

# Executar a cada 5 minutos
crontab -e

# Adicionar linha:
*/5 * * * * /home/educare/scripts/monitor.sh >> /home/educare/logs/monitor.log 2>&1
```

---

## Troubleshooting

### Problemas Comuns

#### 1. Backend não inicia
```bash
# Verificar logs
pm2 logs educare-backend

# Verificar se as variáveis de ambiente estão corretas
cat /home/educare/apps/educareappv1/educare-backend/.env

# Testar conexão com banco
psql -h localhost -U educare_user -d educare_db
```

#### 2. Frontend não carrega
```bash
# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar se os arquivos estão no lugar certo
ls -la /var/www/educare.whatscall.com.br/

# Testar configuração do Nginx
sudo nginx -t
```

#### 3. SSL não funciona
```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew

# Verificar configuração do Nginx
sudo nginx -t
```

#### 4. Banco de dados com problemas
```bash
# Verificar status do PostgreSQL
sudo systemctl status postgresql

# Verificar logs
sudo tail -f /var/log/postgresql/postgresql-*.log

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### Comandos Úteis

```bash
# Ver status de todos os serviços
sudo systemctl status nginx postgresql
pm2 status

# Ver logs em tempo real
pm2 logs --lines 100
sudo tail -f /var/log/nginx/error.log

# Reiniciar tudo
pm2 restart all
sudo systemctl restart nginx postgresql

# Verificar portas em uso
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3000

# Verificar uso de recursos
htop
df -h
free -h
```

---

## Processo de Atualização

### Quando Atualizar
- Novas funcionalidades desenvolvidas
- Correções de bugs críticos
- Atualizações de segurança
- Melhorias de performance
- Atualizações de dependências

### 1. Pré-Atualização (OBRIGATÓRIO)

#### Backup Completo
```bash
# 1. Backup do banco de dados
/home/educare/scripts/backup-db.sh

# 2. Backup dos arquivos da aplicação
cd /home/educare
tar -czf backups/app-backup-$(date +%Y%m%d-%H%M%S).tar.gz apps/educareappv1/

# 3. Backup das configurações do Nginx
sudo tar -czf backups/nginx-backup-$(date +%Y%m%d-%H%M%S).tar.gz /etc/nginx/sites-available/

# 4. Verificar espaço em disco
df -h
```

#### Verificar Status Atual
```bash
# Verificar serviços rodando
pm2 status
sudo systemctl status nginx postgresql

# Verificar logs recentes
pm2 logs educare-backend --lines 50
sudo tail -n 50 /var/log/nginx/error.log
```

### 2. Atualização do Código

#### Baixar Atualizações
```bash
# Navegar para o diretório da aplicação
cd /home/educare/apps/educareappv1

# Verificar branch atual
git branch

# Fazer backup da branch atual (se houver modificações locais)
git stash push -m "Backup antes da atualização $(date)"

# Baixar atualizações
git fetch origin
git pull origin main

# Verificar se houve conflitos
git status
```

### 3. Atualização do Backend

#### Instalar Dependências
```bash
cd /home/educare/apps/educareappv1/educare-backend

# Instalar/atualizar dependências
npm install --production

# Verificar se há migrations pendentes
# (Se usando Sequelize CLI)
npx sequelize-cli db:migrate:status

# Executar migrations se necessário
npx sequelize-cli db:migrate
```

#### Reiniciar Backend
```bash
# Parar aplicação
pm2 stop educare-backend

# Verificar se parou
pm2 status

# Iniciar novamente
pm2 start educare-backend

# Verificar logs
pm2 logs educare-backend --lines 30
```

### 4. Atualização do Frontend

#### Build e Deploy
```bash
cd /home/educare/apps/educareappv1

# Instalar dependências (se houver atualizações)
npm install --legacy-peer-deps

# Fazer backup do build atual
sudo mv /var/www/educare.whatscall.com.br /var/www/educare.whatscall.com.br.backup-$(date +%Y%m%d-%H%M%S)

# Criar novo build
npm run build

# Copiar arquivos para Nginx
sudo mkdir -p /var/www/educare.whatscall.com.br
sudo cp -r dist/* /var/www/educare.whatscall.com.br/

# Ajustar permissões
sudo chown -R www-data:www-data /var/www/educare.whatscall.com.br
sudo chmod -R 755 /var/www/educare.whatscall.com.br
```

### 5. Verificação Pós-Atualização

#### Testes de Funcionamento
```bash
# 1. Verificar status dos serviços
pm2 status
sudo systemctl status nginx postgresql

# 2. Testar configuração do Nginx
sudo nginx -t

# 3. Recarregar Nginx (se necessário)
sudo systemctl reload nginx

# 4. Verificar logs em tempo real
pm2 logs educare-backend --lines 20
```

#### Testes Funcionais
```bash
# Testar endpoints principais
curl -I https://educare.whatscall.com.br
curl -I https://api.educare.whatscall.com.br/api/health

# Verificar se a aplicação carrega
wget --spider https://educare.whatscall.com.br
```

### 6. Rollback (Se Necessário)

#### Em Caso de Problemas
```bash
# 1. Parar aplicação atual
pm2 stop educare-backend

# 2. Voltar para versão anterior do código
cd /home/educare/apps/educareappv1
git log --oneline -5  # Ver commits recentes
git reset --hard COMMIT_ANTERIOR  # Substituir COMMIT_ANTERIOR pelo hash

# 3. Restaurar frontend anterior
sudo rm -rf /var/www/educare.whatscall.com.br
sudo mv /var/www/educare.whatscall.com.br.backup-* /var/www/educare.whatscall.com.br

# 4. Restaurar banco (se necessário)
# CUIDADO: Isso apagará dados criados após o backup
# psql -h localhost -U educare_user -d educare_db < /home/educare/backups/backup-YYYYMMDD.sql

# 5. Reiniciar backend
cd educare-backend
npm install --production
pm2 start educare-backend
```

### 7. Checklist de Atualização

#### Pré-Atualização
- [ ] Backup do banco de dados realizado
- [ ] Backup dos arquivos da aplicação realizado
- [ ] Backup das configurações do Nginx realizado
- [ ] Status atual dos serviços verificado
- [ ] Espaço em disco suficiente confirmado

#### Durante a Atualização
- [ ] Código atualizado via Git
- [ ] Dependências do backend instaladas
- [ ] Migrations executadas (se aplicável)
- [ ] Backend reiniciado com sucesso
- [ ] Frontend buildado e deployado
- [ ] Permissões dos arquivos ajustadas

#### Pós-Atualização
- [ ] Todos os serviços rodando (PM2, Nginx, PostgreSQL)
- [ ] Configuração do Nginx válida
- [ ] Frontend carregando: https://educare.whatscall.com.br
- [ ] API respondendo: https://api.educare.whatscall.com.br/api/health
- [ ] Login/registro funcionando
- [ ] Funcionalidades principais testadas
- [ ] Logs sem erros críticos
- [ ] Performance aceitável

#### Em Caso de Problemas
- [ ] Rollback executado (se necessário)
- [ ] Logs de erro coletados
- [ ] Causa raiz identificada
- [ ] Plano de correção definido

### 8. Automatização (Opcional)

#### Script de Atualização
```bash
# Criar script de atualização automatizada
nano /home/educare/scripts/update-app.sh
```

**Conteúdo do script:**
```bash
#!/bin/bash

set -e  # Parar em caso de erro

echo "=== INICIANDO ATUALIZAÇÃO DO EDUCAREAPP ==="
echo "Data: $(date)"

# Backup automático
echo "1. Fazendo backup..."
/home/educare/scripts/backup-db.sh
cd /home/educare
tar -czf backups/app-backup-$(date +%Y%m%d-%H%M%S).tar.gz apps/educareappv1/

# Atualizar código
echo "2. Atualizando código..."
cd /home/educare/apps/educareappv1
git pull origin main

# Atualizar backend
echo "3. Atualizando backend..."
cd educare-backend
npm install --production
pm2 restart educare-backend

# Atualizar frontend
echo "4. Atualizando frontend..."
cd ..
npm install --legacy-peer-deps
npm run build
sudo cp -r dist/* /var/www/educare.whatscall.com.br/
sudo chown -R www-data:www-data /var/www/educare.whatscall.com.br

# Verificar
echo "5. Verificando serviços..."
pm2 status
sudo nginx -t

echo "=== ATUALIZAÇÃO CONCLUÍDA COM SUCESSO ==="
echo "Data: $(date)"
```

```bash
# Tornar executável
chmod +x /home/educare/scripts/update-app.sh

# Executar atualização
/home/educare/scripts/update-app.sh
```

### 9. Logs de Atualização

#### Manter Histórico
```bash
# Criar log de atualizações
echo "$(date): Atualização v1.x.x realizada com sucesso" >> /home/educare/logs/updates.log

# Ver histórico
tail -20 /home/educare/logs/updates.log
```

---

## Checklist de Deploy

### Pré-Deploy
- [ ] VPS configurada com Ubuntu 20.04+
- [ ] Acesso SSH configurado
- [ ] Domínio apontando para o IP da VPS
- [ ] Repositório Git acessível

### Instalação
- [ ] Node.js 18 LTS instalado
- [ ] PostgreSQL instalado e configurado
- [ ] Nginx instalado
- [ ] PM2 instalado globalmente
- [ ] Certbot instalado

### Configuração
- [ ] Usuário educare criado
- [ ] Banco de dados criado
- [ ] Variáveis de ambiente configuradas (backend e frontend)
- [ ] Migrações executadas
- [ ] Frontend buildado e copiado para Nginx
- [ ] Configurações do Nginx criadas
- [ ] SSL configurado com Certbot
- [ ] PM2 configurado e rodando
- [ ] Firewall configurado

### Pós-Deploy
- [ ] Backup automático configurado
- [ ] Monitoramento configurado
- [ ] Logs funcionando
- [ ] Testes de funcionalidade realizados
- [ ] DNS propagado
- [ ] HTTPS funcionando

### Testes Finais
- [ ] Frontend carrega: https://educare.whatscall.com.br
- [ ] API responde: https://api.educare.whatscall.com.br/api/health
- [ ] Login/registro funcionando
- [ ] Verificação de telefone funcionando
- [ ] Todas as funcionalidades principais testadas

---

## Contatos e Suporte

Para dúvidas sobre este deploy:
- **Documentação**: `/home/educare/apps/educareappv1/docs/`
- **Logs**: `/home/educare/logs/`
- **Backups**: `/home/educare/backups/`

---

**Última atualização**: 22/07/2025
**Versão**: 1.0.0
