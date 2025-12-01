# 🚀 Guia de Deploy - API Externa na VPS

**Sistema:** Educare+ Platform  
**Componente:** API de Integração Externa  
**Ambiente:** VPS Produção

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de que você tem:

- ✅ Acesso SSH à VPS
- ✅ Node.js instalado (v16 ou superior)
- ✅ PM2 instalado globalmente
- ✅ PostgreSQL configurado
- ✅ Nginx configurado
- ✅ Certificado SSL (HTTPS)

---

## 🔐 1. Configurar API Key de Produção

### **1.1 Gerar API Key Segura**

```bash
# Na VPS, gerar uma API key forte
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Exemplo de output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### **1.2 Atualizar .env do Backend**

```bash
# Conectar via SSH
ssh usuario@seu-servidor.com

# Navegar para o projeto
cd /caminho/do/projeto/educare-backend

# Editar .env
nano .env
```

**Adicionar/Atualizar:**
```env
# API Externa
EXTERNAL_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# Ambiente
NODE_ENV=production
```

**Salvar:** `Ctrl + O` → `Enter` → `Ctrl + X`

---

## 🌐 2. Configurar Nginx para API Externa

### **2.1 Editar Configuração do Nginx**

```bash
sudo nano /etc/nginx/sites-available/educareapp
```

### **2.2 Adicionar Rota da API Externa**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.educareapp.com;
    
    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.educareapp.com;
    
    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/api.educareapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.educareapp.com/privkey.pem;
    
    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Logs
    access_log /var/log/nginx/api.educareapp.access.log;
    error_log /var/log/nginx/api.educareapp.error.log;
    
    # Rate Limiting (100 requisições por minuto por IP)
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;
    
    # Proxy para backend
    location /api/external {
        proxy_pass http://localhost:3001;
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
    
    # Documentação Swagger
    location /api/docs {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3001;
        access_log off;
    }
}
```

### **2.3 Testar e Recarregar Nginx**

```bash
# Testar configuração
sudo nginx -t

# Se OK, recarregar
sudo systemctl reload nginx
```

---

## 🔒 3. Configurar Certificado SSL

### **3.1 Instalar Certbot (se não estiver instalado)**

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### **3.2 Obter Certificado**

```bash
sudo certbot --nginx -d api.educareapp.com
```

**Siga as instruções:**
1. Digite seu email
2. Aceite os termos
3. Escolha redirecionar HTTP para HTTPS (opção 2)

### **3.3 Renovação Automática**

```bash
# Testar renovação
sudo certbot renew --dry-run

# Adicionar ao cron (já configurado automaticamente pelo certbot)
sudo systemctl status certbot.timer
```

---

## 📦 4. Deploy do Código

### **4.1 Atualizar Código na VPS**

```bash
# Conectar via SSH
ssh usuario@seu-servidor.com

# Navegar para o projeto
cd /caminho/do/projeto/educare-backend

# Fazer backup do .env
cp .env .env.backup

# Fazer pull das alterações
git pull origin main

# Instalar dependências
npm install

# Restaurar .env se necessário
# (git pull pode sobrescrever)
```

### **4.2 Verificar Alterações**

```bash
# Verificar se logger.js foi criado
ls -la src/utils/logger.js

# Verificar se Swagger está configurado
ls -la src/config/swagger.js

# Verificar se testes foram criados
ls -la tests/external-api.test.js
```

---

## 🔄 5. Reiniciar Serviços

### **5.1 Reiniciar Backend com PM2**

```bash
# Ver processos ativos
pm2 list

# Reiniciar backend
pm2 restart educare-backend

# Ver logs em tempo real
pm2 logs educare-backend --lines 50
```

### **5.2 Verificar Status**

```bash
# Status do PM2
pm2 status

# Logs do backend
pm2 logs educare-backend --lines 100

# Logs do Nginx
sudo tail -f /var/log/nginx/api.educareapp.access.log
sudo tail -f /var/log/nginx/api.educareapp.error.log
```

---

## 🧪 6. Testar API Externa

### **6.1 Teste Básico - Health Check**

```bash
curl https://api.educareapp.com/health
```

**Resposta esperada:**
```json
{"status":"ok"}
```

### **6.2 Teste de Autenticação**

```bash
# Sem API key (deve falhar)
curl https://api.educareapp.com/api/external/subscription-plans

# Com API key inválida (deve falhar)
curl "https://api.educareapp.com/api/external/subscription-plans?api_key=invalid"

# Com API key válida (deve funcionar)
curl "https://api.educareapp.com/api/external/subscription-plans?api_key=SUA_API_KEY_AQUI"
```

### **6.3 Teste de Planos**

```bash
# Listar planos
curl -X GET "https://api.educareapp.com/api/external/subscription-plans?api_key=SUA_API_KEY" \
  -H "Content-Type: application/json"
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Plano Básico",
      "price": 29.90,
      "currency": "BRL",
      "billing_cycle": "monthly"
    }
  ]
}
```

### **6.4 Teste de Criação de Usuário**

```bash
curl -X POST "https://api.educareapp.com/api/external/users?api_key=SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste API",
    "email": "teste@example.com",
    "password": "senha123",
    "phone": "+5511999999999"
  }'
```

### **6.5 Teste de Busca**

```bash
# Buscar usuário por telefone
curl -X GET "https://api.educareapp.com/api/external/users/search?api_key=SUA_API_KEY&phone=+5511999999999" \
  -H "Content-Type: application/json"
```

---

## 📊 7. Acessar Documentação Swagger

### **7.1 URL da Documentação**

```
https://api.educareapp.com/api/docs
```

### **7.2 Usar Swagger UI**

1. Acesse a URL acima no navegador
2. Clique em "Authorize"
3. Insira sua API key
4. Teste os endpoints diretamente na interface

---

## 🔍 8. Monitoramento e Logs

### **8.1 Logs do Backend**

```bash
# Logs em tempo real
pm2 logs educare-backend

# Últimas 100 linhas
pm2 logs educare-backend --lines 100

# Apenas erros
pm2 logs educare-backend --err

# Limpar logs
pm2 flush
```

### **8.2 Logs do Nginx**

```bash
# Access log (requisições)
sudo tail -f /var/log/nginx/api.educareapp.access.log

# Error log (erros)
sudo tail -f /var/log/nginx/api.educareapp.error.log

# Filtrar por API externa
sudo grep "/api/external" /var/log/nginx/api.educareapp.access.log | tail -20
```

### **8.3 Monitorar Performance**

```bash
# CPU e memória do PM2
pm2 monit

# Estatísticas detalhadas
pm2 show educare-backend
```

---

## 🛡️ 9. Segurança em Produção

### **9.1 Firewall (UFW)**

```bash
# Verificar status
sudo ufw status

# Permitir apenas portas necessárias
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### **9.2 Fail2Ban (Proteção contra Brute Force)**

```bash
# Instalar
sudo apt install fail2ban

# Configurar para Nginx
sudo nano /etc/fail2ban/jail.local
```

**Adicionar:**
```ini
[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/api.educareapp.error.log
maxretry = 5
findtime = 600
bantime = 3600
```

```bash
# Reiniciar Fail2Ban
sudo systemctl restart fail2ban

# Ver IPs banidos
sudo fail2ban-client status nginx-limit-req
```

---

## 📝 10. Checklist de Deploy

### **Antes do Deploy**
- [ ] API Key de produção gerada
- [ ] .env atualizado com API key
- [ ] Código testado localmente
- [ ] Testes automatizados passando
- [ ] Documentação Swagger revisada

### **Durante o Deploy**
- [ ] Backup do .env feito
- [ ] Git pull executado
- [ ] npm install executado
- [ ] PM2 reiniciado
- [ ] Nginx recarregado

### **Após o Deploy**
- [ ] Health check funcionando
- [ ] API key autenticando
- [ ] Endpoints respondendo
- [ ] Swagger acessível
- [ ] Logs sem erros
- [ ] SSL funcionando
- [ ] Rate limiting ativo

---

## 🚨 11. Troubleshooting

### **Problema: API retorna 502 Bad Gateway**

```bash
# Verificar se backend está rodando
pm2 list

# Reiniciar backend
pm2 restart educare-backend

# Ver logs
pm2 logs educare-backend --lines 50
```

### **Problema: API key não funciona**

```bash
# Verificar .env
cat /caminho/do/projeto/educare-backend/.env | grep EXTERNAL_API_KEY

# Reiniciar para recarregar variáveis
pm2 restart educare-backend
```

### **Problema: SSL não funciona**

```bash
# Verificar certificado
sudo certbot certificates

# Renovar se expirado
sudo certbot renew

# Testar Nginx
sudo nginx -t
```

### **Problema: Rate limit bloqueando requisições**

```bash
# Ver logs do Nginx
sudo tail -f /var/log/nginx/api.educareapp.error.log | grep "limiting requests"

# Ajustar limite no nginx.conf se necessário
sudo nano /etc/nginx/sites-available/educareapp
# Alterar: rate=100r/m para rate=200r/m
sudo systemctl reload nginx
```

---

## 📞 12. Suporte e Contatos

### **Logs de Debug**

```bash
# Habilitar logs de debug temporariamente
export DEBUG=*
pm2 restart educare-backend

# Desabilitar depois
unset DEBUG
pm2 restart educare-backend
```

### **Comandos Úteis**

```bash
# Ver todas as variáveis de ambiente
pm2 env 0

# Reiniciar com zero downtime
pm2 reload educare-backend

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
```

---

## ✅ 13. Validação Final

Execute este script para validar tudo:

```bash
#!/bin/bash

echo "🔍 Validando Deploy da API Externa..."

# 1. Verificar backend
if pm2 list | grep -q "educare-backend.*online"; then
    echo "✅ Backend está rodando"
else
    echo "❌ Backend NÃO está rodando"
fi

# 2. Verificar Nginx
if sudo nginx -t 2>&1 | grep -q "successful"; then
    echo "✅ Nginx configurado corretamente"
else
    echo "❌ Nginx com erro de configuração"
fi

# 3. Testar API
if curl -s "https://api.educareapp.com/health" | grep -q "ok"; then
    echo "✅ API respondendo"
else
    echo "❌ API não está respondendo"
fi

# 4. Testar SSL
if curl -s -I "https://api.educareapp.com" | grep -q "200"; then
    echo "✅ SSL funcionando"
else
    echo "❌ SSL com problema"
fi

# 5. Testar autenticação
if curl -s "https://api.educareapp.com/api/external/subscription-plans" | grep -q "API key"; then
    echo "✅ Autenticação ativa"
else
    echo "❌ Autenticação não está funcionando"
fi

echo ""
echo "🎉 Validação concluída!"
```

---

## 📚 Documentação Adicional

- **Swagger UI:** https://api.educareapp.com/api/docs
- **Avaliação da API:** Ver arquivo `AVALIACAO_API_EXTERNA.md`
- **Testes:** Ver arquivo `tests/external-api.test.js`

---

**Deploy realizado com sucesso!** 🚀

Para dúvidas ou problemas, consulte os logs ou entre em contato com o suporte técnico.
