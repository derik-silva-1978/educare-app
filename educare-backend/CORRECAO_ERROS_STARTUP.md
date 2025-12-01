# Correção de Erros no Startup do Backend

**Data:** 11/10/2025  
**Status:** ✅ CORRIGIDO (YAML) | ⚠️ AÇÃO NECESSÁRIA (Senha DB)

---

## 🔴 Erros Identificados

### **1. Erro de Sintaxe YAML no Swagger**

**Erro:**
```
YAMLSemanticError: Nested mappings are not allowed in compact mappings at line 16, column 22:
description: Telefone do usuário (ex: +5511999999999)
```

**Causa:**
- O caractere `:` dentro de `(ex: +5511...)` estava causando erro de parsing YAML
- YAML interpreta `:` como separador de chave-valor

**Solução Aplicada:**
```javascript
// ANTES (❌ Errado)
description: Telefone do usuário (ex: +5511999999999)

// DEPOIS (✅ Correto)
description: Telefone do usuário (exemplo +5511999999999)
```

**Arquivo Corrigido:**
- ✅ `src/controllers/externalApiController.js`

---

### **2. Erro de Autenticação do Banco de Dados**

**Erro:**
```
ConnectionError: password authentication failed for user "dsg"
```

**Causa:**
- Senha do PostgreSQL está vazia no arquivo `.env`
- Linha 8: `DB_PASSWORD=`

**Configuração Atual (.env):**
```env
DB_USERNAME=dsg
DB_PASSWORD=           # ❌ VAZIO
DB_DATABASE=educare1
DB_HOST=app.voipsimples.com.br
DB_PORT=5432
```

---

## ⚠️ AÇÃO NECESSÁRIA

### **Adicionar Senha do Banco de Dados**

**1. Abrir arquivo `.env`:**
```bash
cd educare-backend
code .env
```

**2. Adicionar a senha na linha 8:**
```env
DB_PASSWORD=SUA_SENHA_AQUI
```

**3. Salvar e reiniciar o servidor:**
```bash
npm run dev
```

---

## ✅ Verificação

### **Após adicionar a senha, você deve ver:**

```
Servidor rodando na porta 3001
Ambiente: development
✅ Banco de dados sincronizado com sucesso
```

### **Se ainda houver erro:**

**Verificar credenciais:**
```bash
# Testar conexão PostgreSQL
psql -h app.voipsimples.com.br -U dsg -d educare1 -p 5432
```

**Verificar se o banco existe:**
```sql
\l  -- Listar todos os bancos
```

**Verificar permissões do usuário:**
```sql
\du  -- Listar usuários e permissões
```

---

## 📋 Checklist

- [x] Corrigir erro de YAML no `externalApiController.js`
- [ ] Adicionar senha do PostgreSQL no `.env`
- [ ] Reiniciar servidor backend
- [ ] Verificar conexão com banco de dados
- [ ] Testar endpoint de quizzes

---

## 🔐 Segurança

**IMPORTANTE:**
- ⚠️ Nunca commitar o arquivo `.env` com senhas
- ✅ O `.env` já está no `.gitignore`
- ✅ Use variáveis de ambiente em produção

---

## 📝 Próximos Passos

Após corrigir a senha do banco:

1. **Testar quizzes:**
```bash
curl http://localhost:3001/api/journey-questions/week/9/quizzes?min_age_months=2&max_age_months=3 \
  -H "Authorization: Bearer SEU_TOKEN"
```

2. **Popular quizzes (se necessário):**
```bash
psql -h app.voipsimples.com.br -U dsg -d educare1 -f scripts/seed-quizzes-semana-9-10.sql
```

3. **Testar no frontend:**
- Abrir TitiNauta 2.0
- Selecionar criança
- Expandir semana 9 ou 10
- Verificar se aparecem quizzes

---

**Arquivos Modificados:**
- ✅ `src/controllers/externalApiController.js` - Corrigido YAML

**Arquivos que Precisam de Atenção:**
- ⚠️ `.env` - Adicionar senha do PostgreSQL
