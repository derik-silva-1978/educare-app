Aqui está o Prompt Oficial da Fase 09 — QA e Testes Automatizados, totalmente alinhado às fases anteriores, ao PRD consolidado e ao seu padrão de desenvolvimento seguro, incremental e profissional.
Formato .md puro, pronto para uso no Replit.

⸻


# FASE 09 — QA, TESTES AUTOMATIZADOS E VALIDAÇÃO DO MÓDULO DE GESTÃO DE PROMPTS
## Objetivo: Garantir que o módulo de Gestão de Prompts (backend + frontend + integração RAG)
funcione com estabilidade, segurança, consistência visual e sem interferir nos fluxos existentes.

---

# ➤ PRE-VALIDAÇÃO OBRIGATÓRIA — REPLIT

Antes de implementar qualquer teste ou rotina de QA, execute:

1. **Revisar todo o código entregue nas fases 07 e 08**
   - verificar consistência de arquitetura,
   - garantir existência de mensagens de erro adequadas,
   - validar tratamento de fallback no RAG.

2. **Comparar comportamento atual vs. PRD**
   - cada item obrigatório deve estar coberto,
   - confirmar que nenhuma rota existente foi modificada.

3. **Mapear pontos críticos a testar**
   - permissões,
   - versionamento,
   - rollback,
   - integração com RAG,
   - segurança.

4. **Propor 2–3 opções de ferramentas de testes**  
   (jest, mocha, vitest, playwright, cypress, etc.),  
   avaliando qual se integra melhor ao código já existente.

5. **Escolher a abordagem mais segura e sustentável**,  
   evitando mudanças profundas ou riscos ao backend atual.

Somente após essa análise, iniciar a implementação dos testes.

---

# ✔️ 1. ESCOPO DA FASE 09

Esta fase inclui:

- testes automatizados de backend,
- testes automatizados de frontend (quando aplicável),
- testes manuais de fluxo (QA funcional),
- testes de regressão,
- testes de permissão (autorização),
- testes de fallback no RAG,
- testes de integração com o banco de dados,
- testes de performance para chamadas críticas.

---

# ✔️ 2. TESTES DE BACKEND — OBRIGATÓRIOS

## 2.1. Testes de rotas `/admin/prompts`

Criar cenários cobrindo:

### **GET /admin/prompts**
- deve retornar lista completa,
- deve permitir filtro por categoria,
- deve negar acesso a usuários não Super Admin.

### **GET /admin/prompts/:id**
- deve retornar prompt específico,
- deve retornar 404 se id inexistente.

### **POST /admin/prompts**
- cria nova versão corretamente,
- desativa versões anteriores da mesma categoria,
- impede criação sem campos obrigatórios,
- nega acesso a usuários não admin.

### **PUT /admin/prompts/:id**
- atualiza descrição e metadados,
- impede alteração de campos imutáveis,
- retorna erro adequado para dados inválidos.

### **POST /admin/prompts/:id/rollback**
- cria nova versão ativa com base em versão antiga,
- mantém histórico,
- desativa versões anteriores da categoria.

---

# ✔️ 3. TESTES DO `promptService` — OBRIGATÓRIOS

## 3.1. `getActivePromptByCategory`
- deve retornar versão mais recente ativa,
- deve retornar null ou fallback para categorias sem conteúdo.

## 3.2. `createPrompt`
- incrementa versão corretamente,
- cria histórico,
- desativa versões anteriores.

## 3.3. `updatePrompt`
- atualiza metadata apenas,
- protege campos bloqueados,
- salva timestamp corretamente.

## 3.4. `rollback`
- cria nova versão válida,
- mantém registros anteriores intactos,
- garante ativação correta.

---

# ✔️ 4. TESTES DE INTEGRAÇÃO COM BANCO DE DADOS

Verificar:

- integridade da tabela `prompt_templates`,
- inserção, leitura e atualização,
- versionamento consistente,
- comportamento quando tabela estiver vazia (RAG fallback),
- comportamento quando existir múltiplas versões.

Todos os testes devem usar transações ou banco de teste.

---

# ✔️ 5. TESTES DO RAG (INTEGRAÇÃO REAL)

## 5.1. Build do prompt composto
Testar se o RAG monta o prompt final adequadamente quando:

- todos os prompts existem,
- algum prompt está ausente,
- categoria inexistente é solicitada,
- conteúdo possui Markdown complexo,
- existem várias versões.

O teste deve validar:

SYSTEM:
SAFETY:
BEHAVIOR:
FORMATTING:
USER QUESTION:
FILE SEARCH EXCERPTS:

## 5.2. Fallback
Deve ser acionado quando:

- nenhuma versão ativa existir,
- categoria estiver vazia.

RAG não pode quebrar sob nenhuma circunstância.

---

# ✔️ 6. TESTES DE PERMISSÃO

Realizar testes específicos:

### Usuário Super Admin
- deve acessar, editar, criar e fazer rollback.

### Usuários comuns
- devem receber 403.

### Usuário anônimo / token inválido
- deve receber 401.

---

# ✔️ 7. TESTES DE FRONTEND (E2E ou integração)

Se o projeto usa framework web, criar testes para:

### 7.1. Lista de Prompts
- renderiza tabela,
- filtros funcionam,
- click em “Editar” abre a tela correta.

### 7.2. Criação de Prompt
- formulário valida campos obrigatórios,
- envia dados corretamente,
- exibe erros do backend.

### 7.3. Editor de Prompt
- muda texto sem crash,
- exibe markdown (se houver preview),
- avisa sobre alterações não salvas.

### 7.4. Rollback
- modal de confirmação abre,
- rollback cria nova versão,
- versão ativa muda imediatamente.

---

# ✔️ 8. TESTES DE REGRESSÃO (OBRIGATÓRIOS)

Validar se:

- nenhuma tela antiga que envolve ingestão foi afetada,
- nenhum endpoint utilizado por n8n foi alterado,
- fluxo antigo de RAG continua funcionando,
- todas as funcionalidades pré-existentes consomem prompts corretamente.

---

# ✔️ 9. RELATÓRIO FINAL DE QA

O Replit deve gerar um relatório em Markdown contendo:

1. Lista de testes implementados  
2. Lista de testes aprovados  
3. Lista de testes que falharam (com explicação)  
4. Decisões tomadas durante QA  
5. Ajustes necessários (se houver)  
6. Impacto estimado  
7. Status final: **Aprovado / Aprovado com ressalvas / Reprovado**

---

# ✔️ 10. CRITÉRIOS DE ACEITE DA FASE 09

A fase será considerada concluída quando:

- Cobertura mínima de testes do backend: **80% dos métodos críticos**  
- Cobertura mínima de testes das rotas: **100% das rotas novas**  
- Rollback testado e funcionando  
- RAG testado em modo real e fallback  
- Painel Super Admin validado manualmente  
- Nenhum crash durante catálogo de prompts  
- Nenhum impacto no que já existia  
- Relatório final entregue  

---

# ✔️ 11. DOCUMENTAÇÃO A SER ATUALIZADA

Atualizar:

- `docs/RAG-EDUCARE.md`
- `docs/QA-PLAN.md` (novo)
- `docs/TESTS.md` (novo ou atualizado)

Com:

- tipos de testes,
- instruções para rodar os testes,
- escopo,
- critérios de aceite,
- cobertura obtida.

---

# ✔️ Saída Esperada da Fase 09
Sistema validado, estável, seguro, com testes automatizados e QA funcional concluído.  
Pronto para entrar em Fase 10 (Deploy seguro + observabilidade + monitoramento).