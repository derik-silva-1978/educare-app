#!/bin/bash

###############################################################################
# Script de Configuração - API Externa Educare+
# 
# Este script automatiza a configuração da API externa na VPS
# 
# Uso: bash setup-api-externa.sh
###############################################################################

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Banner
clear
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ███████╗██████╗ ██╗   ██╗ ██████╗ █████╗ ██████╗ ███████╗   ║
║   ██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗██╔══██╗██╔════╝   ║
║   █████╗  ██║  ██║██║   ██║██║     ███████║██████╔╝█████╗     ║
║   ██╔══╝  ██║  ██║██║   ██║██║     ██╔══██║██╔══██╗██╔══╝     ║
║   ███████╗██████╔╝╚██████╔╝╚██████╗██║  ██║██║  ██║███████╗   ║
║   ╚══════╝╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ║
║                                                           ║
║              API Externa - Setup Automático               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# Verificar se está rodando como root
if [[ $EUID -eq 0 ]]; then
   print_error "Este script NÃO deve ser executado como root"
   exit 1
fi

# 1. Verificar pré-requisitos
print_header "1. Verificando Pré-requisitos"

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js instalado: $NODE_VERSION"
else
    print_error "Node.js não encontrado. Instale Node.js v16 ou superior."
    exit 1
fi

# PM2
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 -v)
    print_success "PM2 instalado: v$PM2_VERSION"
else
    print_warning "PM2 não encontrado. Instalando..."
    npm install -g pm2
    print_success "PM2 instalado com sucesso"
fi

# Nginx
if command -v nginx &> /dev/null; then
    NGINX_VERSION=$(nginx -v 2>&1 | cut -d'/' -f2)
    print_success "Nginx instalado: $NGINX_VERSION"
else
    print_error "Nginx não encontrado. Instale Nginx antes de continuar."
    exit 1
fi

# PostgreSQL
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version | cut -d' ' -f3)
    print_success "PostgreSQL instalado: $PSQL_VERSION"
else
    print_warning "PostgreSQL não encontrado. Certifique-se de que está instalado."
fi

# 2. Gerar API Key
print_header "2. Gerando API Key de Produção"

API_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
print_success "API Key gerada com sucesso"
print_info "API Key: $API_KEY"
print_warning "IMPORTANTE: Salve esta chave em local seguro!"

# Perguntar se quer usar esta chave ou fornecer uma própria
read -p "Deseja usar esta API key? (s/n): " USE_GENERATED_KEY
if [[ $USE_GENERATED_KEY != "s" ]]; then
    read -p "Digite sua API key: " API_KEY
fi

# 3. Atualizar .env
print_header "3. Configurando Variáveis de Ambiente"

if [ -f ".env" ]; then
    print_info "Fazendo backup do .env atual..."
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    print_success "Backup criado"
fi

# Atualizar ou adicionar EXTERNAL_API_KEY
if grep -q "EXTERNAL_API_KEY" .env 2>/dev/null; then
    sed -i "s/EXTERNAL_API_KEY=.*/EXTERNAL_API_KEY=$API_KEY/" .env
    print_success "EXTERNAL_API_KEY atualizada no .env"
else
    echo "" >> .env
    echo "# API Externa" >> .env
    echo "EXTERNAL_API_KEY=$API_KEY" >> .env
    print_success "EXTERNAL_API_KEY adicionada ao .env"
fi

# Garantir que NODE_ENV está em produção
if grep -q "NODE_ENV" .env 2>/dev/null; then
    sed -i "s/NODE_ENV=.*/NODE_ENV=production/" .env
else
    echo "NODE_ENV=production" >> .env
fi
print_success "NODE_ENV configurado para production"

# 4. Instalar dependências
print_header "4. Instalando Dependências"

print_info "Executando npm install..."
npm install --production
print_success "Dependências instaladas"

# 5. Executar migrations
print_header "5. Executando Migrations do Banco de Dados"

read -p "Deseja executar as migrations? (s/n): " RUN_MIGRATIONS
if [[ $RUN_MIGRATIONS == "s" ]]; then
    npx sequelize-cli db:migrate
    print_success "Migrations executadas"
else
    print_warning "Migrations puladas"
fi

# 6. Configurar PM2
print_header "6. Configurando PM2"

# Parar processo antigo se existir
if pm2 list | grep -q "educare-backend"; then
    print_info "Parando processo existente..."
    pm2 stop educare-backend
    pm2 delete educare-backend
fi

# Iniciar novo processo
print_info "Iniciando backend com PM2..."
pm2 start npm --name "educare-backend" -- start
pm2 save
print_success "Backend iniciado com PM2"

# Configurar PM2 para iniciar no boot
if ! pm2 startup | grep -q "already"; then
    print_info "Configurando PM2 para iniciar no boot..."
    pm2 startup
fi

# 7. Testar API
print_header "7. Testando API"

sleep 3  # Aguardar backend iniciar

# Teste local
print_info "Testando endpoint local..."
if curl -s http://localhost:3001/health | grep -q "ok"; then
    print_success "Backend respondendo localmente"
else
    print_error "Backend não está respondendo"
    print_info "Verifique os logs: pm2 logs educare-backend"
    exit 1
fi

# Teste de autenticação
print_info "Testando autenticação da API externa..."
RESPONSE=$(curl -s "http://localhost:3001/api/external/subscription-plans?api_key=$API_KEY")
if echo "$RESPONSE" | grep -q "success"; then
    print_success "Autenticação funcionando"
else
    print_error "Autenticação falhou"
    print_info "Resposta: $RESPONSE"
fi

# 8. Configurar Nginx (opcional)
print_header "8. Configuração do Nginx"

read -p "Deseja configurar o Nginx agora? (s/n): " CONFIGURE_NGINX
if [[ $CONFIGURE_NGINX == "s" ]]; then
    read -p "Digite o domínio da API (ex: api.educareapp.com): " API_DOMAIN
    
    NGINX_CONFIG="/etc/nginx/sites-available/educareapp-api"
    
    print_info "Criando configuração do Nginx..."
    
    sudo tee $NGINX_CONFIG > /dev/null <<EOF
# Educare+ API Externa
server {
    listen 80;
    listen [::]:80;
    server_name $API_DOMAIN;
    
    # Redirecionar para HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $API_DOMAIN;
    
    # SSL (configurar depois com certbot)
    # ssl_certificate /etc/letsencrypt/live/$API_DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$API_DOMAIN/privkey.pem;
    
    # Logs
    access_log /var/log/nginx/api.educareapp.access.log;
    error_log /var/log/nginx/api.educareapp.error.log;
    
    # Rate Limiting
    limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;
    
    # API Externa
    location /api/external {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Documentação
    location /api/docs {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3001;
        access_log off;
    }
}
EOF
    
    # Habilitar site
    sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
    
    # Testar configuração
    if sudo nginx -t; then
        print_success "Configuração do Nginx criada"
        sudo systemctl reload nginx
        print_success "Nginx recarregado"
        
        print_info "Para configurar SSL, execute:"
        print_info "sudo certbot --nginx -d $API_DOMAIN"
    else
        print_error "Erro na configuração do Nginx"
    fi
else
    print_warning "Configuração do Nginx pulada"
    print_info "Configure manualmente seguindo o guia DEPLOY_API_EXTERNA_VPS.md"
fi

# 9. Resumo Final
print_header "9. Resumo da Configuração"

echo -e "${GREEN}"
cat << EOF
╔═══════════════════════════════════════════════════════════╗
║                 ✅ CONFIGURAÇÃO CONCLUÍDA                  ║
╚═══════════════════════════════════════════════════════════╝

📋 Informações Importantes:

🔑 API Key: $API_KEY
   
📁 Arquivos:
   • .env atualizado com API key
   • Backup criado: .env.backup.*
   
🚀 Serviços:
   • Backend: Rodando no PM2
   • Porta: 3001
   • Status: pm2 list
   
📊 Logs:
   • Backend: pm2 logs educare-backend
   • Nginx: sudo tail -f /var/log/nginx/api.educareapp.*.log
   
🧪 Testes:
   • Health: curl http://localhost:3001/health
   • API: curl "http://localhost:3001/api/external/subscription-plans?api_key=$API_KEY"
   
📚 Documentação:
   • Swagger: http://localhost:3001/api/docs
   • Guia completo: DEPLOY_API_EXTERNA_VPS.md
   
⚠️  Próximos Passos:
   1. Configure SSL com certbot (se ainda não fez)
   2. Teste todos os endpoints
   3. Configure monitoramento
   4. Compartilhe a API key com parceiros (via canal seguro)
   
🎉 API Externa pronta para uso!

EOF
echo -e "${NC}"

# Salvar informações em arquivo
INFO_FILE="api-externa-info.txt"
cat > $INFO_FILE <<EOF
Educare+ API Externa - Informações de Deploy
Data: $(date)

API Key: $API_KEY
Porta: 3001
Status: pm2 list

Comandos Úteis:
- Ver logs: pm2 logs educare-backend
- Reiniciar: pm2 restart educare-backend
- Status: pm2 status

Testes:
- Health: curl http://localhost:3001/health
- API: curl "http://localhost:3001/api/external/subscription-plans?api_key=$API_KEY"

Documentação: http://localhost:3001/api/docs
EOF

print_success "Informações salvas em: $INFO_FILE"
print_warning "IMPORTANTE: Guarde a API key em local seguro e delete este arquivo!"

exit 0
