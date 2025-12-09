# FASE 08 — IMPLEMENTAÇÃO FRONTEND (SUPER ADMIN → GESTÃO DE PROMPTS)
## Objetivo: Criar a interface completa da Gestão de Prompts dentro da área de Super Admin,
integrada aos endpoints da Fase 07, seguindo os padrões já existentes no frontend do Educare App
e garantindo ZERO impacto sobre fluxos e telas atuais.

---

# ➤ PRE-VALIDAÇÃO OBRIGATÓRIA — REPLIT

Antes de implementar qualquer coisa nesta fase, execute:

1. **ANALISE A ESTRUTURA FRONTEND EXISTENTE**
   - Identifique onde ficam os componentes do Super Admin.
   - Verifique como são construídas:
     - páginas,
     - rotas internas,
     - formulários,
     - tabelas,
     - modais.
   - Revise o padrão visual (HTML/CSS/JS/React/Vue/etc., conforme o projeto atual).

2. **AVALIE IMPACTOS NO SISTEMA**
   - Não modificar rotas de ingestão existentes.
   - Não alterar componentes atuais do painel.
   - Não interferir no fluxo de RAG ou no fluxo do n8n.

3. **PRODUZA 2–3 ALTERNATIVAS DE ARQUITETURA DE TELA**
   Para onde e como inserir a Gestão de Prompts:
   - Alternativa A: Nova aba dentro de “Ingestão”.
   - Alternativa B: Página isolada “Gestão de Prompts”.
   - Alternativa C: Modal carregado via tabela de ingestão.

   Avaliar prós/cons de cada opção e escolher a **mais segura e aderente ao código atual**.

4. **SÓ ENTÃO IMPLEMENTE**, sempre:
   - incrementalmente,
   - documentado,
   - sem quebrar telas existentes.

---

# ✔️ 1. MÓDULO A SER CRIADO NO FRONTEND

Criar a interface **Super Admin → Ingestão → Gestão de Prompts**, composta por:

## 1.1. Página “Lista de Prompts”
Exibir:
- Tabela com:
  - Nome
  - Categoria
  - Versão
  - Status (Ativo / Inativo)
  - Última atualização
  - Ações (Editar, Histórico, Rollback)

Funcionalidades:
- Busca por nome
- Filtro por categoria
- Botão “Criar Novo Prompt”

Endpoint usado:
- `GET /admin/prompts`

---

## 1.2. Página “Criar Novo Prompt”
Campos:
- Nome do Prompt (`name`)
- Categoria (`category`)
- Descrição (`description`)
- Editor em Markdown para `content`

Ações:
- Cancelar
- Salvar e Publicar

Endpoint:
- `POST /admin/prompts`

Regra:
- Ao publicar:
  - Versão = versão_anterior + 1
  - Desativa automaticamente versões anteriores da categoria

---

## 1.3. Página “Editar Prompt”
Carregar dados via:

- `GET /admin/prompts/:id`

Campos editáveis:
- Descrição
- Categoria (opcional)
- Conteúdo (Markdown)

Botões:
- “Salvar nova versão”
- “Voltar”

Endpoint:
- `PUT /admin/prompts/:id` **somente para atualização de metadados**
- “Salvar como nova versão” deve chamar `POST /admin/prompts` com versão incrementada automaticamente.

---

## 1.4. Tela “Histórico de Versões”
Exibe lista ordenada de versões:

- Versão (v1, v2, v3…)
- Status (Ativa / Inativa)
- Data
- Quem publicou
- Botão “Rollback”

Endpoint:
- `GET /admin/prompts?name=X` ou `GET /admin/prompts?category=Y`

---

## 1.5. Função de Rollback
Ao clicar em rollback:

Fluxo:
1. Abrir modal de confirmação:
   - “Deseja criar UMA NOVA VERSÃO com base nesta versão antiga?”
   - Nunca ativar versão velha diretamente.
2. Ao confirmar:
   - Chamar `POST /admin/prompts/:id/rollback`

Regras:
- Criar nova versão como ativa.
- Desativar todas as outras da mesma categoria.

---

# ✔️ 2. PADRÕES VISUAIS A SEREM SEGUIDOS

O Replit deve respeitar:

- padrão visual já utilizado no painel do Educare App;
- tipografia, cores e espaçamentos já existentes;
- componentes existentes de:
  - tabela,
  - inputs,
  - botões,
  - breadcrumbs,
  - abas,
  - containers.

Se o projeto usa um design system interno, replicar fielmente.

Caso seja React:
- implementar como componentes funcionais.
- separar componentes em:
  - `PromptList`
  - `PromptForm`
  - `PromptHistory`
  - `PromptEditorMarkdown` (usar lib já utilizada no projeto, caso exista)

Caso use Vue:
- seguir estrutura de pastas padrão, com `.vue` single-file components.

---

# ✔️ 3. INTEGRAÇÃO DE AUTENTICAÇÃO E PERMISSÕES

Todo acesso deve verificar se o usuário atual é **Super Admin / Owner**.

O Replit deve:
- usar os mesmos middlewares de permissão existentes;
- nunca criar um novo mecanismo paralelo.

Em rotas frontend, ocultar completamente o módulo de Gestão de Prompts para usuários não admin.

---

# ✔️ 4. INTEGRAÇÃO COM BACKEND

Chamadas obrigatórias no frontend:

| Ação | Método | Rota |
|------|---------|-------|
| Listar prompts | GET | `/admin/prompts` |
| Criar prompt | POST | `/admin/prompts` |
| Editar metadados | PUT | `/admin/prompts/:id` |
| Carregar prompt específico | GET | `/admin/prompts/:id` |
| Rollback | POST | `/admin/prompts/:id/rollback` |

Respeitar:
- estrutura JSON de resposta.
- padrões de erros já existentes.

---

# ✔️ 5. VALIDAÇÕES NO FORMULÁRIO

Campos obrigatórios:
- name
- category
- content

Validações:
- nome único dentro do contexto do Educare App
- categoria válida (system, safety, behavior, formatting, template)
- não permitir conteúdo vazio
- aviso visual quando o conteúdo for alterado antes de salvar

---

# ✔️ 6. EXPERIÊNCIA DO USUÁRIO (UX)

Melhorias sugeridas:
- Mostrar um diff visual entre versões (opcional nesta fase)
- Mostrar badge “ATIVO” na versão vigente
- Indicar com tag de cor (verde/azul):
  - version number
  - data
  - quem editou

O editor pode ser:
- textarea estilizada, OU
- markdown editor simples com pré-visualização

---

# ✔️ 7. TESTES QUE DEVEM SER EXECUTADOS

O Replit deve preparar acessos de teste cobrindo:

### 7.1. Testes funcionais
- criar novo prompt
- editar prompt existente
- listar prompts
- realizar rollback
- filtrar por categoria

### 7.2. Testes de permissão
- garantir que apenas Super Admin acessa
- outros usuários → acesso negado

### 7.3. Testes de integração com backend
- verificar comunicação correta com endpoints
- validar tratamento de erros (404, 400, 500)
- garantir que rollback gera nova versão corretamente

---

# ✔️ 8. SAÍDA ESPERADA DA FASE 08

Ao final desta fase, deve existir:

1. **Interface completa de Gestão de Prompts no Super Admin**  
2. **Formulário de criação e edição funcional**  
3. **Tabela de listagem com filtros**  
4. **Histórico de versões operacional**  
5. **Rollback funcionando**  
6. **Integração completa com os endpoints da Fase 07**  
7. **UX consistente com o restante da plataforma**  
8. **Nenhuma quebra no frontend atual**  
9. **Nenhuma interferência nas telas já existentes**  
10. **Documentação atualizada**  

---

# ✔️ 9. APÓS A IMPLEMENTAÇÃO

O Replit deve atualizar:

- `docs/ADMIN-PORTAL.md`
- `docs/RAG-EDUCARE.md`
- `docs/FRONTEND.md`

Com prints, rotas, comportamento e instruções de uso.

---