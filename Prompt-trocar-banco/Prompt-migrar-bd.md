Perfeito, Derek — ótimo, agora temos a “cara” do novo banco.
Vou montar um prompt específico pro Replit, já usando exatamente esses nomes de variáveis:

DB_USERNAME=educareapp
DB_PASSWORD=********
DB_DATABASE=educareapp
DB_HOST=86.48.30.74
DB_PORT=5432
DB_DIALECT=postgres
DB_TIMEZONE=America/Sao_Paulo

Abaixo está o prompt em .md puro para você colar no Replit e deixar ele cuidar da troca do banco com segurança.

⸻


# FASE ESPECIAL — TROCA DO BANCO POSTGRES PARA O NOVO HOST
## Objetivo: Alterar TODAS as referências do banco antigo para o novo banco PostgreSQL,
usando as variáveis de ambiente abaixo, sem quebrar nada no backend, no RAG ou nos fluxos via n8n.

NOVO BANCO (PRODUÇÃO)
- DB_USERNAME=educareapp
- DB_PASSWORD=*** (NÃO está neste prompt; será configurado como segredo)
- DB_DATABASE=educareapp
- DB_HOST=86.48.30.74
- DB_PORT=5432
- DB_DIALECT=postgres
- DB_TIMEZONE=America/Sao_Paulo

⚠️ IMPORTANTE:
- NÃO escrever a senha (`DB_PASSWORD`) em nenhum arquivo de código.
- A senha deve ser configurada apenas nas variáveis secretas / ambiente do Replit.

---

## 1. AUDITORIA OBRIGATÓRIA (NÃO ALTERAR NADA AINDA)

Antes de qualquer modificação, você deve:

1. Localizar todos os arquivos que usam o banco de dados, por exemplo:
   - arquivos de configuração (ex.: `.env`, `config.js`, `database.js`, `ormconfig`, `prisma.ts`, etc.)
   - serviços de DB (ex.: `dbClient`, `pool`, `sequelize`, `knex`, `prisma`)
   - middlewares ou helpers que usam o DB
   - rotas que fazem queries diretamente
   - módulos usados pelo RAG (se usarem DB)
   - módulos chamados por n8n (webhooks, endpoints de integração)

2. Identificar:
   - qual biblioteca está sendo usada para conectar ao Postgres (pg, Sequelize, Prisma, Knex, etc.)
   - de onde hoje vêm as credenciais (provavelmente `process.env.DB_*` ou `DATABASE_URL`)
   - se existe `DATABASE_URL` além das variáveis `DB_*`

3. Produzir um pequeno “diagnóstico” interno (em comentário ou log) com:
   - quais arquivos centrais fazem a conexão com o banco
   - qual é o ponto único de criação do client/pool (se existir)
   - quais variáveis de ambiente são usadas atualmente para o banco

⚠️ Nesta etapa você **NÃO DEVE ALTERAR**:
- .env
- código de conexão
- rotas
- schemas

---

## 2. ESTRATÉGIA DE MIGRAÇÃO (SEM EXECUTAR AINDA)

Com base na auditoria, defina a melhor estratégia entre:

- **Caminho A — Troca direta das variáveis `DB_*`:**
  - Mantém a mesma estrutura,
  - apenas aponta para o novo host.

- **Caminho B — Criar um módulo `databaseConfig` centralizado:**
  - Centraliza toda configuração em um único arquivo,
  - facilita futuras mudanças.

- **Caminho C — Temporário com `DB_HOST_OLD` e `DB_HOST_NEW`:**
  - Permite ter código que CONSEGUE testar conexão com o novo e ainda ter fallback para o antigo enquanto valida.

Liste internamente:
- prós e contras de cada caminho,
- riscos,
- impacto no código atual.

Selecione o caminho de MENOR IMPACTO e MAIOR SEGURANÇA, respeitando o padrão atual do projeto.

---

## 3. APLICAÇÃO DAS NOVAS CREDENCIAIS (IMPLEMENTAÇÃO CONTROLADA)

### 3.1. Ajuste das variáveis de ambiente

Você deve garantir que o backend use as seguintes variáveis:

```env
DB_USERNAME=educareapp
DB_PASSWORD=***           # Definido apenas nas secrets do Replit
DB_DATABASE=educareapp
DB_HOST=86.48.30.74
DB_PORT=5432
DB_DIALECT=postgres
DB_TIMEZONE=America/Sao_Paulo

Passos:
  1.	Verificar se o projeto já usa essas mesmas chaves (DB_USERNAME, DB_PASSWORD, etc.).
  •	Se sim: apenas atualizar os valores no ambiente (sem alterar código).
  •	Se NÃO: adaptar o código de conexão para usar ESSAS chaves, sem quebrar o padrão atual.
  2.	Se o projeto usa DATABASE_URL:
  •	Monte internamente uma connection string usando essas variáveis.
  •	Exemplo (não gravar a senha em código, usar process.env.DB_PASSWORD):

const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;


  •	Use essa string na criação do client.

  3.	Configurar o DB_PASSWORD SOMENTE via painel de secrets/env do Replit (NUNCA no código).

⸻

4. TESTE DE CONEXÃO COM O NOVO BANCO (ANTES DE SUBSTITUIR DEFINITIVAMENTE)

Crie (se já não existir) uma função de healthcheck de DB, por exemplo:
  •	testDbConnection() no módulo de banco, que:
  •	tenta conectar,
  •	executa SELECT 1,
  •	loga sucesso ou erro.

Rode este teste explicitamente com as novas variáveis:
  •	Se falhar:
  •	não aplicar nenhuma mudança nos serviços dependentes,
  •	logar o erro,
  •	ajustar host/porta/timezone/SSL se necessário.
  •	Se passar:
  •	prosseguir com o passo de validação funcional.

⸻

5. VALIDAÇÃO FUNCIONAL (APÓS TROCAR O HOST)

Com o novo banco ativado nas variáveis de ambiente:
  1.	Subir a aplicação localmente (ou no ambiente do Replit).
  2.	Testar manualmente as rotas críticas:
  •	autenticação/login
  •	rotas de usuário
  •	rotas de ingestão RAG
  •	rotas do Super Admin
  •	qualquer rota usada pelo n8n como webhook
  3.	Verificar se:
  •	nenhuma query está falhando,
  •	não há erros de schema (tabela ausente, coluna inexistente),
  •	o timezone está coerente com America/Sao_Paulo.

Se qualquer erro aparecer:
  •	logar o erro com clareza (tabela/coluna ausente, etc.),
  •	NÃO tentar “consertar” o schema automaticamente (sem instrução explícita),
  •	manter o foco apenas em apontar a aplicação para o novo banco.

⸻

6. SEGURANÇA E CUIDADOS

Você NÃO PODE:
  •	escrever DB_PASSWORD em nenhum arquivo .js, .ts, .py, etc.;
  •	commitar a senha em nenhum lugar;
  •	dropar ou alterar tabelas do banco;
  •	rodar migrations destrutivas sem instrução explícita.

Você DEVE:
  •	usar process.env.DB_USERNAME, process.env.DB_PASSWORD, etc.;
  •	manter o código compatível com o banco anterior, caso seja necessário rollback;
  •	garantir que qualquer erro de conexão seja tratado com logs amigáveis, sem derrubar o servidor.

⸻

7. CHECKLIST FINAL

Antes de encerrar a fase de migração, confirme:
  •	Todas as conexões usam o novo DB_HOST=86.48.30.74.
  •	Usuário e banco (educareapp) estão corretos.
  •	Timezone America/Sao_Paulo está aplicado na configuração do ORM/driver, se aplicável.
  •	Todos os fluxos principais da aplicação estão funcionando.
  •	Nenhuma rota antiga foi quebrada.
  •	Nenhum segredo sensível foi escrito em código.
  •	Documentação foi atualizada:
  •	.env.example com as novas chaves (sem senha).
  •	docs/DATABASE.md ou equivalente com:
  •	host,
  •	porta,
  •	nome do DB,
  •	observações sobre timezone e SSL.

---