# 🚀 API Externa Educare+ - Guia Rápido

## 📋 O Que Foi Implementado

✅ **Logs Seguros** - Dados sensíveis não aparecem em produção  
✅ **Swagger UI** - Documentação interativa da API  
✅ **Testes Automatizados** - Suite completa de testes  
✅ **Script de Deploy** - Configuração automatizada para VPS  

---

## 🎯 Como Usar na VPS

### **Opção 1: Script Automático (Recomendado)**

```bash
# 1. Conectar na VPS
ssh usuario@seu-servidor.com

# 2. Navegar para o projeto
cd /caminho/do/projeto/educare-backend

# 3. Fazer pull das alterações
git pull

# 4. Executar script de setup
bash scripts/setup-api-externa.sh
```

O script vai:
- ✅ Gerar API key segura
- ✅ Configurar .env
- ✅ Instalar dependências
- ✅ Configurar PM2
- ✅ Testar API
- ✅ (Opcional) Configurar Nginx

---

### **Opção 2: Manual**

```bash
# 1. Gerar API key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Editar .env
nano .env
# Adicionar: EXTERNAL_API_KEY=sua-chave-aqui
# Adicionar: NODE_ENV=production

# 3. Instalar dependências
npm install

# 4. Reiniciar PM2
pm2 restart educare-backend

# 5. Testar
curl http://localhost:3001/health
```

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| `AVALIACAO_API_EXTERNA.md` | Avaliação completa da API (endpoints, segurança, melhorias) |
| `DEPLOY_API_EXTERNA_VPS.md` | Guia detalhado de deploy na VPS |
| `tests/external-api.test.js` | Testes automatizados |
| `src/utils/logger.js` | Sistema de logs seguros |

---

## 🧪 Testes

### **Rodar Testes Localmente**

```bash
# Instalar dependências de teste
npm install --save-dev jest supertest

# Rodar todos os testes
npm test

# Rodar apenas testes da API externa
npm test tests/external-api.test.js
```

### **Testes Manuais na VPS**

```bash
# Health check
curl https://api.educareapp.com/health

# Listar planos (substitua SUA_API_KEY)
curl "https://api.educareapp.com/api/external/subscription-plans?api_key=SUA_API_KEY"

# Criar usuário
curl -X POST "https://api.educareapp.com/api/external/users?api_key=SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@example.com","password":"senha123"}'
```

---

## 📊 Swagger UI

### **Acessar Documentação Interativa**

**Local:**
```
http://localhost:3001/api/docs
```

**Produção:**
```
https://api.educareapp.com/api/docs
```

### **Como Usar:**

1. Acesse a URL acima
2. Clique em "Authorize"
3. Insira sua API key
4. Teste os endpoints diretamente na interface

---

## 🔐 Segurança

### **API Key**

A API key deve ser:
- ✅ Forte (32+ caracteres hexadecimais)
- ✅ Única para produção
- ✅ Armazenada com segurança
- ✅ Transmitida apenas via HTTPS

### **Logs Seguros**

O sistema agora usa `logger.js` que:
- ✅ Remove dados sensíveis (senhas, tokens, CPF, telefone)
- ✅ Mostra logs detalhados apenas em desenvolvimento
- ✅ Mostra apenas erros essenciais em produção

**Exemplo:**
```javascript
// Antes (inseguro)
console.log('Dados do usuário:', req.body);

// Depois (seguro)
logger.debug('Dados recebidos', req.body);
// Em produção: dados sensíveis são redacted
```

---

## 🔍 Monitoramento

### **Ver Logs**

```bash
# Logs do backend
pm2 logs educare-backend

# Últimas 100 linhas
pm2 logs educare-backend --lines 100

# Apenas erros
pm2 logs educare-backend --err
```

### **Status dos Serviços**

```bash
# PM2
pm2 status
pm2 monit

# Nginx
sudo systemctl status nginx
sudo nginx -t
```

---

## 🚨 Troubleshooting

### **API não responde**

```bash
# Verificar se backend está rodando
pm2 list

# Reiniciar
pm2 restart educare-backend

# Ver logs
pm2 logs educare-backend --lines 50
```

### **API key não funciona**

```bash
# Verificar .env
cat .env | grep EXTERNAL_API_KEY

# Reiniciar para recarregar
pm2 restart educare-backend
```

### **SSL não funciona**

```bash
# Verificar certificado
sudo certbot certificates

# Renovar
sudo certbot renew

# Testar Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📞 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/external/subscription-plans` | Lista planos |
| POST | `/api/external/users` | Cria usuário |
| GET | `/api/external/users/search` | Busca usuário |
| GET | `/api/external/users/search/children` | Busca crianças |
| GET | `/api/external/children/:id/unanswered-questions` | Perguntas não respondidas |
| POST | `/api/external/children/:id/save-answer` | Salva resposta |

**Autenticação:** Todas as rotas requerem `?api_key=SUA_CHAVE` ou header `X-API-Key`

---

## ✅ Checklist de Deploy

- [ ] API key gerada e salva
- [ ] .env atualizado
- [ ] Código atualizado (git pull)
- [ ] Dependências instaladas (npm install)
- [ ] PM2 reiniciado
- [ ] Nginx configurado
- [ ] SSL configurado (certbot)
- [ ] Testes passando
- [ ] Swagger acessível
- [ ] Logs sem erros

---

## 🎉 Pronto!

A API Externa está configurada e pronta para uso.

**Próximos passos:**
1. Compartilhe a API key com parceiros (via canal seguro)
2. Configure monitoramento (opcional)
3. Configure webhooks (opcional)
4. Implemente rate limiting adicional se necessário

**Dúvidas?** Consulte `DEPLOY_API_EXTERNA_VPS.md` ou `AVALIACAO_API_EXTERNA.md`
