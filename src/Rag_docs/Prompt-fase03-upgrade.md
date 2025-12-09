# FASE 3-UPGRADE — IMPLEMENTAÇÃO DAS NOVAS TABELAS VETORIAIS (DB) E CAMADA BÁSICA DE ACESSO
## Objetivo: Criar, de forma 100% segura e NÃO QUEBRADORA, a base de dados necessária para
a segmentação da Base de Conhecimento do Educare+:
- Tabelas: `kb_baby`, `kb_mother`, `kb_professional`
- Camada mínima de acesso (models / repos / schema)
SEM alterar o comportamento atual do RAG e SEM remover a tabela antiga.

---

# 🔒 REGRA DE SEGURANÇA

Nesta fase, você (Replit) **PODE**:
- criar migrations
- criar novas tabelas
- criar modelos/serviços de acesso **novos**
- ajustar configurações de DB **apenas de forma aditiva**

Você **NÃO PODE**:
- alterar/remover a tabela vetorial atual
- alterar queries existentes do RAG
- alterar serviços de ingestão atuais
- remover ou renomear colunas antigas
- mudar rotas já em uso
- alterar qualquer coisa que já esteja em produção funcional

O comportamento do sistema deve permanecer **idêntico** após esta fase.

---

# ✅ 1. PRE-VALIDAÇÃO OBRIGATÓRIA

Antes de criar qualquer migration, você deve:

1. Confirmar qual tecnologia de acesso ao banco está sendo usada:
   - ex: `pg`, `Sequelize`, `Prisma`, `Knex` ou outra.
2. Verificar como migrations são geridas hoje:
   - pasta de migrations,
   - convenção de nomes,
   - scripts npm (ex: `npm run migrate`).
3. Verificar se já existe alguma tabela vetorial usada pelo RAG atual:
   - nome da tabela,
   - schema atual,
   - tipo do campo de embedding (array, vetor, jsonb, etc.).
4. **NÃO alterar** essa tabela antiga.
5. Anotar (internamente) o padrão de tipos para manter consistência
   - ex.: se embeddings são `vector(1536)` ou `double precision[]`, etc.

Somente após entender esse contexto, siga.

---

# 🧱 2. CRIAÇÃO DAS MIGRATIONS (ADITIVAS)

Você deve criar **3 migrations** (ou 1 única, se esse for o padrão do projeto),
para criar as tabelas:

- `kb_baby`
- `kb_mother`
- `kb_mother`
- `kb_professional`

Use o **MESMO TIPO DE COLUNA** usado hoje para embeddings na tabela vetorial antiga.

### 2.1. Estrutura sugerida (adapte ao ORM e ao tipo de dado atual)

Cada tabela deve conter, no mínimo:

- `id` (uuid / primary key)
- `title` (text, não nulo)
- `content` (text, não nulo)
- `embedding` (tipo vetorial já usado no projeto, não nulo)
- `category` (text, opcional, ex.: domínio, tema)
- `tag` (text, opcional)
- `age_range` (text, opcional – usada mais em `kb_baby`)
- `metadata` (json/jsonb, opcional)
- `created_at` (timestamp com default now)
- `updated_at` (timestamp com default now)

Regras:

- As migrations devem ser idempotentes (usar `IF NOT EXISTS` ou equivalente, se possível).
- Nenhuma tabela antiga pode ser modificada.
- Não incluir chaves estrangeiras neste momento (para reduzir risco de lock e conflito).

---

# 🧩 3. CRIAR MODEL / REPOSITORY PARA CADA TABELA

Sem alterar nada do RAG atual, crie:

- `BabyKnowledgeRepository` (ou nome equivalente)
- `MotherKnowledgeRepository`
- `ProfessionalKnowledgeRepository`

Ou, se preferir manter tudo centralizado:

- `KnowledgeBaseRepository` com métodos distintos:
  - `insertBabyDoc`
  - `insertMotherDoc`
  - `insertProfessionalDoc`
  - `queryBaby`
  - `queryMother`
  - `queryProfessional`

Regras:

- O código desses repositórios **NÃO deve ser usado ainda** pelo RAG nem pelo fluxo de ingestão existente.
- Eles servem como **camada de acesso pronta** para as próximas fases.
- Seguir os mesmos padrões de erro, logging e transação do projeto atual.

---

# 🧠 4. NÃO ALTERAR O RAG NEM A INGESTÃO NESTA FASE

Muito importante:

- `ragService` deve continuar consultando **apenas** a tabela atual (já existente).
- O fluxo de ingestão (upload Super Admin) deve continuar salvando na tabela antiga.
- Nenhum novo código deve ser “plugado” nos endpoints de produção.

Você está **apenas preparando o terreno**:  
criando tabelas e a camada de acesso que será ligada depois.

---

# 🧪 5. TESTES OBRIGATÓRIOS APÓS CRIAR AS TABELAS

Depois de criar as migrations e models/repos, você deve:

1. Rodar as migrations em ambiente de desenvolvimento/teste.
2. Verificar:
   - se as 3 tabelas foram criadas corretamente,
   - se os tipos das colunas estão corretos,
   - se não houve impacto em tabelas existentes.
3. Criar rapidamente **pequenos testes manuais** (ou automatizados) para:
   - inserir 1 registro de teste em `kb_baby`
   - inserir 1 registro de teste em `kb_mother`
   - inserir 1 registro de teste em `kb_professional`
   - rodar ao menos 1 SELECT em cada tabela.

Esses testes devem usar diretamente o novo repository/model criado,
sem mexer no RAG.

Se algum teste falhar:

- ajustar a migration ou model,
- **NÃO** tentar corrigir mexendo em objetos legados.

---

# 📡 6. DOCUMENTAÇÃO QUE DEVE SER ATUALIZADA

Atualize (ou crie):

- `docs/DATABASE.md` ou equivalente, incluindo:
  - descrição das novas tabelas,
  - campos,
  - propósito (bebê / mãe / profissional),
  - relação com o RAG (alto nível).

- Se o projeto usar um diagrama ER, adicione as 3 tabelas como “ilhas” independentes,
  sem relações obrigatórias ainda.

---

# 🛡️ 7. CHECKLIST DE SEGURANÇA DA FASE 3-UPGRADE

Antes de encerrar esta fase, confirme:

- [ ] As novas tabelas foram criadas com sucesso.
- [ ] Nenhuma tabela antiga foi alterada ou removida.
- [ ] As migrations rodam sem erro em ambiente limpo.
- [ ] O sistema (API/backend) sobe normalmente como antes.
- [ ] O RAG continua funcionando com a base antiga normalmente.
- [ ] O fluxo de ingestão atual continua idêntico.
- [ ] Nenhum endpoint foi modificado.
- [ ] O n8n continua operando normalmente.

---

# 🎯 OBJETIVO FINAL DA FASE 3-UPGRADE

Ao final desta fase, você terá:

- Infraestrutura de banco preparada (3 novas bases vetoriais segmentadas).
- Camada de acesso pronta, mas ainda **não integrada** ao RAG.
- Zero regressão funcional.
- Sistema pronto para a Fase 4-UPGRADE (integração controlada da ingestão).

Não prossiga para integrações até receber instruções explícitas para a Fase 4-UPGRADE.