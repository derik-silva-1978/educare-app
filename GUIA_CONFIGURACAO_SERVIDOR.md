# Guia de Configuração do Servidor - Educare

**Data:** 11/10/2025  
**Problema:** API retornando HTML em vez de JSON

---

## 🔴 Problema Identificado

A API está retornando o HTML do frontend React em vez de JSON:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>educare-ecosystem</title>
    ...
```

**Causa:** Nginx/Apache não está redirecionando `/api/*` para o backend Node.js

---

## ✅ Solução: Configurar Nginx

### **Passo 1: Conectar ao Servidor**
```bash
ssh usuario@app.voipsimples.com.br
```

### **Passo 2: Verificar se o Backend está Rodando**
```bash
# Verificar se o processo Node.js está ativo
ps aux | grep node

# Verificar se a porta 3000 está em uso
netstat -tuln | grep 3000

# Ou usar lsof
lsof -i :3000
```

**Se não estiver rodando:**
```bash
cd /home/educare/backend
npm run start
# ou
pm2 start npm --name "educare-backend" -- start
```

### **Passo 3: Testar Backend Localmente**
```bash
# No servidor, testar se o backend responde
curl http://localhost:3000/api/health

# Deve retornar JSON, não HTML
```

### **Passo 4: Configurar Nginx**

**A. Fazer backup da configuração atual:**
```bash
sudo cp /etc/nginx/sites-available/educare /etc/nginx/sites-available/educare.backup
```

**B. Editar configuração:**
```bash
sudo nano /etc/nginx/sites-available/educare
```

**C. Colar a configuração correta:**
```nginx
server {
    listen 80;
    server_name educare.whatscall.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name educare.whatscall.com.br;

    ssl_certificate /etc/letsencrypt/live/educare.whatscall.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/educare.whatscall.com.br/privkey.pem;

    # IMPORTANTE: API Backend
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Swagger
    location /api-docs {
        proxy_pass http://localhost:3000/api-docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Frontend React
    location / {
        root /home/educare/frontend;
        try_files $uri $uri/ /index.html;
        index index.html;
    }
}
```

**D. Testar configuração:**
```bash
sudo nginx -t
```

**E. Recarregar Nginx:**
```bash
sudo systemctl reload nginx
```

### **Passo 5: Verificar Logs**
```bash
# Logs do Nginx
sudo tail -f /var/log/nginx/educare-error.log
sudo tail -f /var/log/nginx/educare-access.log

# Logs do Backend
tail -f /home/educare/logs/backend.log
```

---

## 🧪 Testar Após Configuração

### **Teste 1: Health Check**
```bash
curl https://educare.whatscall.com.br/api/health
```
**Esperado:**
```json
{"status":"ok"}
```

### **Teste 2: API Externa**
```bash
curl "https://educare.whatscall.com.br/api/external/user?api_key=educare_external_api_key_2025&email=pai@gmail.com"
```
**Esperado:**
```json
{
  "success": true,
  "user": { ... }
}
```

### **Teste 3: Frontend**
```bash
curl https://educare.whatscall.com.br/
```
**Esperado:**
```html
<!DOCTYPE html>
<html>...</html>
```

---

## 🔍 Diagnóstico de Problemas

### **Problema 1: Backend não inicia**
```bash
# Ver logs do PM2
pm2 logs educare-backend

# Ver status
pm2 status

# Reiniciar
pm2 restart educare-backend
```

### **Problema 2: Erro 502 Bad Gateway**
```bash
# Backend não está respondendo na porta 3000
# Verificar se está rodando:
ps aux | grep node

# Iniciar backend:
cd /home/educare/backend
pm2 start npm --name "educare-backend" -- start
```

### **Problema 3: Erro 404 Not Found**
```bash
# Rota não existe no backend
# Verificar rotas disponíveis:
curl http://localhost:3000/api/health
```

### **Problema 4: CORS Error**
```bash
# Verificar CORS no backend
# Arquivo: backend/src/app.js
# Deve ter:
app.use(cors({
  origin: 'https://educare.whatscall.com.br',
  credentials: true
}));
```

---

## 📋 Checklist de Configuração

- [ ] Backend rodando na porta 3000
- [ ] Nginx configurado para proxy `/api/` → `localhost:3000`
- [ ] SSL configurado (HTTPS)
- [ ] CORS configurado no backend
- [ ] Logs acessíveis
- [ ] PM2 configurado para auto-restart
- [ ] Firewall permite porta 3000 (apenas localhost)
- [ ] Variáveis de ambiente configuradas (`.env`)

---

## 🚀 Configuração Completa com PM2

### **1. Criar arquivo ecosystem.config.js:**
```javascript
// /home/educare/backend/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'educare-backend',
    script: 'src/server.js',
    cwd: '/home/educare/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/educare/logs/pm2-error.log',
    out_file: '/home/educare/logs/pm2-out.log',
    log_file: '/home/educare/logs/pm2-combined.log',
    time: true
  }]
};
```

### **2. Iniciar com PM2:**
```bash
cd /home/educare/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **3. Comandos úteis PM2:**
```bash
pm2 status              # Ver status
pm2 logs                # Ver logs em tempo real
pm2 restart all         # Reiniciar todos
pm2 stop all            # Parar todos
pm2 delete all          # Deletar todos
pm2 monit               # Monitor em tempo real
```

---

## 📝 Estrutura de Diretórios no Servidor

```
/home/educare/
├── backend/
│   ├── src/
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   └── ecosystem.config.js
├── frontend/
│   ├── index.html
│   ├── assets/
│   └── ...
├── uploads/
└── logs/
    ├── backend.log
    ├── pm2-error.log
    └── pm2-out.log
```

---

## ⚠️ Importante

1. **Nunca exponha a porta 3000 diretamente** - Use sempre Nginx como proxy
2. **Configure firewall** para bloquear acesso direto à porta 3000
3. **Use HTTPS** sempre (já configurado)
4. **Monitore logs** regularmente
5. **Faça backup** das configurações antes de modificar

---

## 🔐 Segurança

### **Firewall (UFW):**
```bash
# Permitir apenas Nginx
sudo ufw allow 'Nginx Full'

# Bloquear porta 3000 externamente (apenas localhost)
sudo ufw deny 3000

# Status
sudo ufw status
```

### **Permissões:**
```bash
# Backend
sudo chown -R educare:educare /home/educare/backend
chmod 600 /home/educare/backend/.env

# Frontend
sudo chown -R www-data:www-data /home/educare/frontend

# Logs
sudo chown -R educare:educare /home/educare/logs
chmod 755 /home/educare/logs
```

---

**Após seguir este guia, a API deve retornar JSON corretamente!**
