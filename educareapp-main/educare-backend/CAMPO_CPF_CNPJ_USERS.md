# Adição do Campo CPF/CNPJ na Tabela Users

**Data:** 09/10/2025  
**Status:** ✅ Implementado - Aguardando Execução da Migration

## 📋 Resumo

Foi adicionado o campo `cpf_cnpj` na tabela `users` para armazenar o CPF (11 dígitos) ou CNPJ (14 dígitos) do usuário.

## 🗂️ Estrutura do Campo

```sql
cpf_cnpj VARCHAR(18) NULL UNIQUE
```

### Características:
- **Tipo:** VARCHAR(18)
- **Nulo:** Permitido (campo opcional)
- **Único:** Sim (não pode haver duplicatas)
- **Formato:** Aceita CPF ou CNPJ com ou sem formatação
  - CPF: `123.456.789-00` ou `12345678900`
  - CNPJ: `12.345.678/0001-00` ou `12345678000100`

## 📁 Arquivos Criados/Modificados

### 1. Migration
**Arquivo:** `src/migrations/20251009000000-add-cpf-cnpj-to-users.js`

```javascript
// Adiciona coluna cpf_cnpj
// Cria índice único para valores não nulos
// Inclui rollback (down) para reverter alteração
```

### 2. Model Atualizado
**Arquivo:** `src/models/User.js`

**Validações Implementadas:**
- ✅ Validação de formato (11 ou 14 dígitos)
- ✅ Validação de dígitos verificadores do CPF
- ✅ Validação de dígitos verificadores do CNPJ
- ✅ Rejeita CPF/CNPJ com todos os dígitos iguais
- ✅ Remove caracteres não numéricos automaticamente

### 3. Script SQL Direto
**Arquivo:** `sql/add_cpf_cnpj_to_users.sql`

Script SQL puro para execução direta no banco de dados.

## 🚀 Como Executar

### Opção 1: Via Sequelize Migration (Recomendado)

```bash
cd educare-backend

# Executar migration
npm run db:migrate

# Ou usando sequelize-cli diretamente
npx sequelize-cli db:migrate
```

### Opção 2: Via SQL Direto

```bash
# Conectar ao banco
psql -h app.voipsimples.com.br -U dsg -d educare1 -p 5432

# Executar script
\i sql/add_cpf_cnpj_to_users.sql
```

### Opção 3: Via DBeaver/PgAdmin

1. Conectar ao banco de dados
2. Abrir o arquivo `sql/add_cpf_cnpj_to_users.sql`
3. Executar o script

## 🧪 Validação do CPF/CNPJ

### Algoritmo de Validação

#### CPF (11 dígitos)
1. Remove caracteres não numéricos
2. Verifica se tem 11 dígitos
3. Rejeita se todos os dígitos forem iguais (ex: 111.111.111-11)
4. Calcula e valida o primeiro dígito verificador
5. Calcula e valida o segundo dígito verificador

#### CNPJ (14 dígitos)
1. Remove caracteres não numéricos
2. Verifica se tem 14 dígitos
3. Rejeita se todos os dígitos forem iguais (ex: 11.111.111/1111-11)
4. Calcula e valida o primeiro dígito verificador
5. Calcula e valida o segundo dígito verificador

### Exemplos de CPF/CNPJ Válidos

```javascript
// CPF válido
"123.456.789-09"  // Com formatação
"12345678909"     // Sem formatação

// CNPJ válido
"11.222.333/0001-81"  // Com formatação
"11222333000181"      // Sem formatação
```

## 📝 Exemplos de Uso

### Criar Usuário com CPF

```javascript
const user = await User.create({
  name: 'João Silva',
  email: 'joao@example.com',
  password: 'senha123',
  cpf_cnpj: '123.456.789-09'  // Aceita com formatação
});
```

### Criar Usuário com CNPJ

```javascript
const user = await User.create({
  name: 'Empresa LTDA',
  email: 'contato@empresa.com',
  password: 'senha123',
  cpf_cnpj: '11.222.333/0001-81'  // Aceita com formatação
});
```

### Buscar por CPF/CNPJ

```javascript
// Buscar usuário por CPF (com ou sem formatação)
const user = await User.findOne({
  where: { cpf_cnpj: '12345678909' }
});
```

### Atualizar CPF/CNPJ

```javascript
await user.update({
  cpf_cnpj: '987.654.321-00'
});
```

## ⚠️ Erros Comuns

### 1. CPF/CNPJ Inválido
```javascript
// Erro: CPF inválido
await User.create({
  name: 'Teste',
  email: 'teste@example.com',
  password: 'senha123',
  cpf_cnpj: '111.111.111-11'  // Todos os dígitos iguais
});
// Retorna: ValidationError: CPF inválido
```

### 2. CPF/CNPJ Duplicado
```javascript
// Erro: CPF já cadastrado
await User.create({
  name: 'Outro Usuário',
  email: 'outro@example.com',
  password: 'senha123',
  cpf_cnpj: '123.456.789-09'  // Já existe
});
// Retorna: SequelizeUniqueConstraintError
```

### 3. Formato Incorreto
```javascript
// Erro: Tamanho inválido
await User.create({
  name: 'Teste',
  email: 'teste@example.com',
  password: 'senha123',
  cpf_cnpj: '123456'  // Menos de 11 dígitos
});
// Retorna: ValidationError: CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos
```

## 🔄 Rollback (Reverter Alteração)

Se necessário reverter a alteração:

```bash
# Via Sequelize
npm run db:migrate:undo

# Via SQL
ALTER TABLE public.users DROP COLUMN IF EXISTS cpf_cnpj;
DROP INDEX IF EXISTS users_cpf_cnpj_unique_idx;
```

## 📊 Estrutura Completa da Tabela Users

```sql
TABLE public.users (
    id uuid NOT NULL PRIMARY KEY,
    email varchar(255) NULL UNIQUE,
    phone varchar(255) NULL UNIQUE,
    cpf_cnpj varchar(18) NULL UNIQUE,  -- ✨ NOVO CAMPO
    password varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    role enum_users_role DEFAULT 'user'::enum_users_role NOT NULL,
    status enum_users_status DEFAULT 'pending'::enum_users_status NOT NULL,
    email_verified bool DEFAULT false NULL,
    last_login timestamptz NULL,
    reset_token varchar(255) NULL,
    reset_token_expires timestamptz NULL,
    phone_verification_code varchar(255) NULL,
    phone_verification_expires timestamptz NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);
```

## 🔐 Considerações de Segurança

1. **Dados Sensíveis:** CPF/CNPJ são dados pessoais sensíveis segundo a LGPD
2. **Criptografia:** Considere criptografar o campo em produção
3. **Logs:** Não registre CPF/CNPJ em logs de aplicação
4. **API:** Não exponha CPF/CNPJ completo em APIs públicas (mascarar)

### Exemplo de Máscara

```javascript
// Função para mascarar CPF/CNPJ
function maskCpfCnpj(value) {
  if (!value) return null;
  
  const clean = value.replace(/[^\d]/g, '');
  
  if (clean.length === 11) {
    // CPF: 123.456.789-09 → ***.***.789-09
    return `***.***${clean.substring(6, 9)}-${clean.substring(9)}`;
  }
  
  if (clean.length === 14) {
    // CNPJ: 11.222.333/0001-81 → **.***.***/0001-81
    return `**.***.***/0001-${clean.substring(12)}`;
  }
  
  return value;
}
```

## 📚 Referências

- [Algoritmo de Validação CPF](https://www.geradorcpf.com/algoritmo_do_cpf.htm)
- [Algoritmo de Validação CNPJ](https://www.geradorcnpj.com/algoritmo_do_cnpj.htm)
- [LGPD - Lei Geral de Proteção de Dados](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

## ✅ Checklist de Implementação

- [x] Migration criada
- [x] Model atualizado com validações
- [x] Script SQL direto criado
- [x] Documentação completa
- [x] Validação de CPF implementada
- [x] Validação de CNPJ implementada
- [ ] Migration executada no banco de dados
- [ ] Testes unitários criados
- [ ] Testes de integração criados
- [ ] Atualizar formulários de cadastro no frontend
- [ ] Implementar máscara de CPF/CNPJ no frontend
- [ ] Adicionar campo em APIs de usuário

---

**Desenvolvedor:** Cascade AI  
**Revisão:** Pendente  
**Próxima Atualização:** Após execução da migration
