# 🚀 Deploy API Externa - Seu Caso Específico

**Domínios:**
- Frontend: `educare.whatscall.com.br`
- Backend/API: `api.educare.whatscall.com.br` ✅ (já configurado!)

**Estrutura na VPS:**
```
/home/educare/
├── apps/
│   └── educare-backend/     ← Backend (porta 3000)
├── logs/                    ← Logs do PM2
└── uploads/                 ← Arquivos enviados
```

---

## ✅ Boa Notícia!

Você **JÁ TEM** tudo configurado! Só precisa:
1. Atualizar o código
2. Reiniciar o PM2
3. Testar

**Não precisa mexer no Nginx!** Já está perfeito! 🎉

---

## 📋 Análise da Sua Configuração

### **✅ O Que Você JÁ TEM**

1. **Nginx configurado perfeitamente:**
   - `api.educare.whatscall.com.br` → `localhost:3000` ✅
   - SSL configurado ✅
   - Logs configurados ✅

2. **PM2 rodando em cluster:**
   - 2 instâncias do backend ✅
   - Modo cluster ✅
   - Logs em `/home/educare/logs/` ✅

3. **.env já tem a API key:**
   ```env
   EXTERNAL_API_KEY=educare_external_api_key_2025
   ```
   ✅ Já configurado!

4. **Backend na porta 3000:**
   ```env
   PORT=3000
   ```
   ✅ Correto!

---

## 🚀 Deploy Simplificado (Seu Caso)

### **Passo 1: Atualizar Código na VPS**

```bash
# 1. Conectar na VPS
ssh root@educare

# 2. Ir para o backend
cd /home/educare/apps/educare-backend

# 3. Fazer backup do .env (segurança)
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# 4. Fazer pull do código
git pull origin main

# 5. Instalar dependências (se houver novas)
npm install --production

# 6. Verificar se os arquivos novos foram criados
ls -la src/utils/logger.js
ls -la tests/external-api.test.js
```

---

### **Passo 2: Verificar/Atualizar API Key (Opcional)**

Sua API key atual é: `educare_external_api_key_2025`

**Opção A: Manter a atual** (mais simples)
```bash
# Não precisa fazer nada, já está no .env
```

**Opção B: Gerar nova (mais segura)**
```bash
# Gerar nova chave
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Editar .env
nano .env
# Alterar linha 36: EXTERNAL_API_KEY=nova-chave-aqui

# Salvar: Ctrl+O, Enter, Ctrl+X
```

---

### **Passo 3: Reiniciar PM2**

```bash
# Reiniciar backend (vai recarregar o código novo)
pm2 restart educare-backend

# Ver logs em tempo real
pm2 logs educare-backend --lines 50
```

**Aguarde 10 segundos** para o backend iniciar completamente.

---

### **Passo 4: Testar API Externa**

```bash
# 1. Health check
curl https://api.educare.whatscall.com.br/health

# Deve retornar: {"status":"ok"}

# 2. Testar API Externa (substitua pela sua API key)
curl "https://api.educare.whatscall.com.br/api/external/subscription-plans?api_key=educare_external_api_key_2025"

# Deve retornar: {"success":true,"data":[...]}

# 3. Testar Swagger
curl https://api.educare.whatscall.com.br/api/docs

# Deve retornar HTML do Swagger
```

---

### **Passo 5: Acessar Swagger no Navegador**

Abra no navegador:
```
https://api.educare.whatscall.com.br/api/docs
```

1. Clique em "Authorize"
2. Digite: `educare_external_api_key_2025`
3. Clique em "Authorize"
4. Teste os endpoints!

---

## 🧪 Testes Completos

### **Teste 1: Listar Planos**

```bash
curl -X GET "https://api.educare.whatscall.com.br/api/external/subscription-plans?api_key=educare_external_api_key_2025" \
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
      "currency": "BRL"
    }
  ]
}
```

---

### **Teste 2: Buscar Usuário**

```bash
curl -X GET "https://api.educare.whatscall.com.br/api/external/users/search?api_key=educare_external_api_key_2025&phone=+5511999999999" \
  -H "Content-Type: application/json"
```

---

### **Teste 3: Criar Usuário**

```bash
curl -X POST "https://api.educare.whatscall.com.br/api/external/users?api_key=educare_external_api_key_2025" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste API",
    "email": "teste@example.com",
    "password": "senha123",
    "phone": "+5511988888888"
  }'
```

---

## 📊 Verificar Logs

### **Logs do PM2**

```bash
# Ver logs em tempo real
pm2 logs educare-backend

# Últimas 100 linhas
pm2 logs educare-backend --lines 100

# Apenas erros
pm2 logs educare-backend --err

# Limpar logs antigos
pm2 flush
```

### **Logs do Nginx**

```bash
# Access log (requisições)
tail -f /var/log/nginx/api.educare.access.log

# Error log (erros)
tail -f /var/log/nginx/api.educare.error.log

# Filtrar por API externa
grep "/api/external" /var/log/nginx/api.educare.access.log | tail -20
```

---

## 🔍 Monitoramento

```bash
# Status do PM2
pm2 status

# Monitorar CPU e memória
pm2 monit

# Informações detalhadas
pm2 show educare-backend

# Ver variáveis de ambiente
pm2 env 0
```

---

## ⚠️ Troubleshooting

### **Problema: API não responde**

```bash
# 1. Verificar se PM2 está rodando
pm2 list

# 2. Ver logs
pm2 logs educare-backend --lines 50

# 3. Reiniciar
pm2 restart educare-backend

# 4. Testar localmente
curl http://localhost:3000/health
```

---

### **Problema: API key não funciona**

```bash
# 1. Verificar .env
cat /home/educare/apps/educare-backend/.env | grep EXTERNAL_API_KEY

# 2. Deve mostrar:
# EXTERNAL_API_KEY=educare_external_api_key_2025

# 3. Se estiver diferente, corrigir:
nano /home/educare/apps/educare-backend/.env

# 4. Reiniciar PM2
pm2 restart educare-backend
```

---

### **Problema: Nginx não redireciona**

```bash
# 1. Testar configuração
sudo nginx -t

# 2. Se OK, recarregar
sudo systemctl reload nginx

# 3. Ver logs
tail -f /var/log/nginx/api.educare.error.log
```

---

## 📝 Checklist de Deploy

### **Antes**
- [x] Backend já rodando ✅
- [x] Nginx já configurado ✅
- [x] SSL já configurado ✅
- [x] API key já no .env ✅

### **Durante**
- [ ] Backup do .env feito
- [ ] Git pull executado
- [ ] npm install executado
- [ ] PM2 reiniciado

### **Depois**
- [ ] Health check funcionando
- [ ] API externa respondendo
- [ ] Swagger acessível
- [ ] Logs sem erros

---

## 🎯 URLs Finais

Após o deploy, você terá:

| Serviço | URL | Status |
|---------|-----|--------|
| **Frontend** | https://educare.whatscall.com.br | ✅ Já funciona |
| **API Backend** | https://api.educare.whatscall.com.br/api/* | ✅ Já funciona |
| **API Externa** | https://api.educare.whatscall.com.br/api/external/* | 🆕 Nova |
| **Swagger** | https://api.educare.whatscall.com.br/api/docs | 🆕 Nova |

---

## 🔐 Segurança - API Key

**Sua API key atual:**
```
educare_external_api_key_2025
```

**⚠️ IMPORTANTE:**
- Esta chave está no código (não é segura para produção)
- Recomendo gerar uma nova chave forte
- Compartilhe apenas via canal seguro (não por email/chat)

**Gerar nova chave:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📞 Comandos Úteis

```bash
# Ver estrutura de diretórios
ls -la /home/educare/apps/educare-backend/

# Ver processos Node
ps aux | grep node

# Ver uso de memória
free -h

# Ver uso de disco
df -h

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver status dos serviços
systemctl status nginx
pm2 status
```

---

## ✅ Script Completo de Deploy

Copie e cole tudo de uma vez:

```bash
#!/bin/bash
echo "🚀 Iniciando deploy da API Externa..."

# 1. Ir para o backend
cd /home/educare/apps/educare-backend

# 2. Backup do .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup do .env criado"

# 3. Pull do código
git pull origin main
echo "✅ Código atualizado"

# 4. Instalar dependências
npm install --production
echo "✅ Dependências instaladas"

# 5. Reiniciar PM2
pm2 restart educare-backend
echo "✅ PM2 reiniciado"

# 6. Aguardar inicialização
sleep 5

# 7. Testar
echo ""
echo "🧪 Testando API..."
curl -s https://api.educare.whatscall.com.br/health
echo ""
echo ""
echo "🎉 Deploy concluído!"
echo ""
echo "📊 Acesse:"
echo "   Swagger: https://api.educare.whatscall.com.br/api/docs"
echo "   API Key: educare_external_api_key_2025"
echo ""
echo "📝 Ver logs: pm2 logs educare-backend"
```

---

## 🎉 Pronto!

Sua API Externa estará disponível em:
```
https://api.educare.whatscall.com.br/api/external/*
```

**Documentação:**
```
https://api.educare.whatscall.com.br/api/docs
```

---

**Dúvidas?** Consulte os logs ou me pergunte! 🚀
