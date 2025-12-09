# FASE 07 — GESTÃO DE PROMPTS (SUPER ADMIN + INTEGRAÇÃO COM RAG)
## Objetivo: Implementar um módulo de **Gestão de Prompts** na área de ingestão/RAG do Super Admin,
garantindo que o backend do Educare App passe a consumir prompts **dinâmicos** (configuráveis via banco),
sem quebrar nada do código atual.

---

# ➤ PRE-VALIDAÇÃO OBRIGATÓRIA — REPLIT

Antes de implementar qualquer coisa nesta fase, execute os passos abaixo:

1. **ANALISAR A ESTRUTURA EXISTENTE**
   - identifique a estrutura de pastas do backend
   - revise controllers, services, helpers e middlewares
   - verifique como rotas de ADMIN/SUPER ADMIN são organizadas hoje
   - avalie padrões de nomenclatura e arquitetura (ex.: `src/controllers`, `src/services`, etc.)

2. **AVALIAR POSSÍVEIS IMPACTOS**
   - no backend atual (rotas, middlewares, autenticação)
   - nas integrações com n8n (endpoints já usados)
   - nas tabelas existentes do PostgreSQL (não alterar tabelas existentes)
   - em dependências comuns/utilitários já em uso

3. **PROPOR ALTERNATIVAS DE IMPLEMENTAÇÃO**
   - apresente 2–3 caminhos possíveis para:
     - onde criar a nova tabela de prompts
     - onde colocar o `promptService`
     - como expor as rotas de admin (reaproveitar módulo/namespace admin ou criar um novo)
   - descreva rapidamente vantagens e riscos de cada caminho

4. **ESCOLHER A FORMA MAIS SEGURA E SUSTENTÁVEL**
   - priorize abordagem de menor impacto e maior aderência ao padrão existente
   - respeite completamente o código atual
   - garanta integridade total do banco e das rotas já em produção

5. **SOMENTE APÓS AVALIAÇÃO, IMPLEMENTAR O CÓDIGO**
   - de forma incremental
   - documentando cada mudança
   - sem remover funcionalidades antigas
   - sem quebrar serviços atuais (incluindo os fluxos atuais de ingestão RAG e integrações com n8n)

---

# ✔️ 1. MODELAGEM DE BANCO — TABELA DE PROMPTS

## 1.1. Criação da tabela `prompt_templates` (ou outro nome aderente ao padrão atual)

Você deve criar uma nova tabela **sem alterar nenhuma tabela já existente**.

Adapte a sintaxe ao mecanismo de migrations/schema já usado pelo projeto (ORM, SQL bruto, etc.),
sempre de forma idempotente (`IF NOT EXISTS` ou equivalente).

Estrutura sugerida (ajuste tipos e nomes para o padrão do projeto):

- `id` (uuid, PK, default gen_random_uuid ou equivalente)
- `name` (text, obrigatório)  
  - ex.: `PROMPT_MESTRE`, `SAFETY`, `SYSTEM`, `FORMATTING`, `QUIZ_TEMPLATE`
- `description` (text, opcional)
- `category` (text, obrigatório)  
  - ex.: `system`, `safety`, `behavior`, `formatting`, `template`
- `content` (text, obrigatório)  
  - texto completo do prompt em Markdown ou texto puro
- `version` (int, obrigatório, default 1)
- `is_active` (boolean, default true)
- `created_by` (uuid ou id do usuário admin, se fizer sentido)
- `updated_by` (uuid)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### Regras:
- Nunca alterar ou remover colunas de tabelas antigas.
- Garantir que a migration/criação seja segura para rodar em produção.
- A tabela deve permitir múltiplas versões do mesmo prompt (mesmo `name` ou `category`, versões diferentes).

---

# ✔️ 2. CRIAR `promptService` PARA LEITURA/ESCRITA DE PROMPTS

Local sugerido (ajuste ao padrão do projeto):

- `src/services/promptService.js` (ou `.ts` / `.py` conforme stack atual)

## 2.1. Funções mínimas necessárias

Implemente, no mínimo, as seguintes funções (adaptando nomes e assinaturas ao padrão do projeto):

1. `getActivePromptByCategory(category: string)`
   - Busca na tabela `prompt_templates` o prompt ativo (`is_active = true`) para a categoria informada.
   - Se houver mais de um ativo na mesma categoria, escolher o de maior `version`.
   - Retornar objeto com:
     - `id`, `name`, `category`, `version`, `content`.

2. `listPrompts(filters?)`
   - Listar prompts, com filtros opcionais por:
     - `category`
     - `is_active`
   - Utilizado para tela de listagem no Super Admin.

3. `createPrompt(data)`
   - Criar nova entrada de prompt, incrementando versão se já houver outro com o mesmo `name` ou `category`.
   - Regra: ao criar novo prompt como ATIVO para uma categoria, desativar o ativo anterior dessa mesma categoria (se existir).
   - `data` deve incluir:
     - `name`, `category`, `content`, `description`, `created_by`, `updated_by`.

4. `updatePrompt(id, data)`
   - Atualizar metadados ou conteúdo de um prompt específico.
   - Avaliar se a estratégia do projeto será:
     - atualizar a versão existente, ou
     - criar uma nova versão a partir da atual (preferível).
   - **Recomendação:** para manter histórico, prefira criar nova versão em vez de sobrescrever `content`.

5. `rollbackPrompt(id)`
   - Dado o `id` de uma versão antiga, criar uma nova versão com base nela, marcando-a como ativa e desativando as demais da mesma categoria.

⚠️ Importante:
- Todas as operações devem seguir o padrão de acesso a banco do projeto.
- Todas as queries devem ser parametrizadas e seguras.
- Nenhuma operação deve afetar tabelas antigas.

---

# ✔️ 3. ENDPOINTS ADMIN PARA GESTÃO DE PROMPTS (APENAS SUPER ADMIN)

Os endpoints devem ser colocados **no mesmo namespace/módulo** onde já estão os endpoints de SUPER ADMIN,
para evitar duplicação de mecanismos de autenticação/autorização.

## 3.1. Proteção

- Todos os endpoints desta seção **DEVEM**:
  - exigir autenticação;
  - validar se o usuário é SUPER ADMIN / OWNER;
  - recusar acessos não autorizados com 401/403.

## 3.2. Endpoints sugeridos

Ajustar para o padrão de rotas atual, por exemplo:

### `GET /admin/prompts`
- Lista prompts (com filtros opcionais via query string, se fizer sentido).
- Apenas Super Admin.

### `GET /admin/prompts/:id`
- Retorna um prompt específico para edição.

### `POST /admin/prompts`
- Cria uma nova versão de prompt.
- Corpo esperado:
  ```json
  {
    "name": "PROMPT_MESTRE",
    "category": "behavior",
    "description": "Prompt mestre do TitiNauta",
    "content": "…texto do prompt…"
  }

  •	Deve usar promptService.createPrompt.

PUT /admin/prompts/:id
  •	Atualiza metadados ou conteúdo de um prompt (caso o padrão do projeto permita update direto).
  •	Idealmente, usar essa rota apenas para ajustes simples (ex.: description, is_active).

POST /admin/prompts/:id/rollback
  •	Cria uma nova versão a partir de uma versão antiga.
  •	Usa promptService.rollbackPrompt.

⚠️ Nenhum endpoint deve expor dados sensíveis ou lógica interna além do necessário.

⸻

✔️ 4. INTEGRAÇÃO DO promptService COM O ragService

Agora, você deve substituir qualquer prompt “hardcoded” dentro do ragService.buildLLMPrompt
por carregamento dinâmico via promptService.

4.1. Exemplos de categorias de prompt

Crie/defina categorias mínimas:
  •	system         → Prompt de sistema/base do modelo (papel do TitiNauta/Educare App)
  •	safety         → Regras de segurança clínica/educacional
  •	behavior       → Estilo de fala do TitiNauta (tom, linguagem, emojis, etc.)
  •	formatting     → Regras de formato da resposta (parágrafos, itens, avisos)
  •	template       → Estruturas específicas (ex.: retornos de quiz, relatórios, etc.) — opcional nesta fase

4.2. Ajustar buildLLMPrompt

Dentro do ragService.buildLLMPrompt:
  1.	Carregar prompts ativos:

const systemPrompt    = await promptService.getActivePromptByCategory("system");
const safetyPrompt    = await promptService.getActivePromptByCategory("safety");
const behaviorPrompt  = await promptService.getActivePromptByCategory("behavior");
const formattingPrompt = await promptService.getActivePromptByCategory("formatting");


  2.	Se algum prompt obrigatório não existir:
  •	logar aviso;
  •	usar fallback mínimo seguro (ex.: string de sistema simples);
  •	nunca quebrar o fluxo.
  3.	Montar o prompt final usando esses conteúdos:

SYSTEM PROMPT:
{{systemPrompt.content}}

SAFETY RULES:
{{safetyPrompt.content}}

BEHAVIOR / STYLE:
{{behaviorPrompt.content}}

FORMATTING RULES:
{{formattingPrompt.content}}

BABY CONTEXT:
{{babyContext}}

USER QUESTION:
{{question}}

FILE SEARCH EXCERPTS:
{{chunksFormatados}}


  4.	Passar esse prompt para a função callLLM.

⸻

✔️ 5. INTEGRAÇÃO COM A ÁREA DE INGESTÃO (SUPER ADMIN – FRONTEND)

Embora você não vá implementar o frontend inteiro nesta fase, prepare o backend para suportar:
  •	Uma nova aba ou seção “Gestão de Prompts” na área de Ingestão RAG do Super Admin.
  •	Essa aba utilizará os endpoints:
  •	GET /admin/prompts
  •	GET /admin/prompts/:id
  •	POST /admin/prompts
  •	PUT /admin/prompts/:id
  •	POST /admin/prompts/:id/rollback

Organize as respostas JSON para facilitar:
  •	listagem em tabela (nome, categoria, versão, ativo, updated_at)
  •	edição em formulário (name, description, category, content, is_active, versão)

⸻

✔️ 6. LOGS, AUDITORIA E SEGURANÇA

Implemente logs simples e objetivos em todas as operações administrativas de prompts:
  •	criação de nova versão
  •	edição
  •	rollback
  •	ativação/desativação

Cada log deve registrar:
  •	id do usuário admin
  •	id do prompt
  •	operação realizada
  •	data/hora

⚠️ Não logar o conteúdo completo dos prompts em logs de sistema (apenas metadados),
para evitar poluição e vazamento indevido.

⸻

✔️ 7. ATUALIZAÇÃO DA DOCUMENTAÇÃO

Atualize o documento principal de RAG (ex.: docs/RAG-EDUCARE.md) com:
  1.	Descrição do Módulo de Gestão de Prompts
  2.	Estrutura da tabela prompt_templates
  3.	Descrição do promptService
  4.	Lista de categorias de prompt utilizadas
  5.	Endpoints de admin:
  •	/admin/prompts (GET, POST)
  •	/admin/prompts/:id (GET, PUT)
  •	/admin/prompts/:id/rollback (POST)
  6.	Explicação de como o ragService passa a usar prompts dinâmicos

⸻

⚠️ REGRAS GERAIS DA FASE 07
  •	Não alterar nem remover rotas antigas.
  •	Não modificar tabelas existentes.
  •	Não impactar o fluxo atual de n8n.
  •	Não quebrar nada do fluxo de ingestão RAG já criado.
  •	Quaisquer novos artefatos (tabela, service, rotas) devem ser:
  •	isolados,
  •	bem documentados,
  •	compatíveis com a arquitetura atual.

⸻

📌 SAÍDA ESPERADA DA FASE 07
  •	Tabela de prompts criada com segurança.
  •	promptService funcional e bem integrado.
  •	Endpoints de gestão de prompts disponíveis apenas para Super Admin.
  •	ragService utilizando prompts dinâmicos, configuráveis via painel.
  •	Documentação atualizada com o novo módulo de Gestão de Prompts.
  •	Nenhuma regressão ou crash no backend existente.

