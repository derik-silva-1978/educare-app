# FASE 1 — PROMPT PARA O REPLIT (BACKEND)  
## Objetivo: Análise completa do projeto atual + preparação segura para o módulo RAG

Você é o assistente de desenvolvimento responsável por implementar o módulo RAG do Educare App **sem causar qualquer quebra no código existente**.  
Antes de criar qualquer arquivo, rota ou serviço, sua tarefa nesta fase é:

---

# ✔️ 1. ANALISAR A ESTRUTURA ATUAL DO PROJETO

Examine cuidadosamente:

- estrutura de pastas atual  
- módulos existentes  
- serviços já implementados  
- padrões de rotas e controllers  
- serviços de conexão com PostgreSQL  
- middlewares existentes  
- padrões de logging e error handling  
- variáveis de ambiente e configurações  
- dependências instaladas  
- frameworks e libs utilizadas  

> **Importante:** NÃO criar arquivos, NÃO deletar nada, NÃO modificar código nesta fase.

Sua função é **mapear** o que existe e **avaliar como integrar o módulo RAG sem riscos**.

---

# ✔️ 2. IDENTIFICAR OS LOCAIS MAIS ADEQUADOS PARA O NOVO CÓDIGO

Com base no PRD, determine:

- onde deve ficar o módulo `ragService`  
- onde deve ficar o `knowledgeDocumentsController`  
- onde criar as rotas de ingestão e consulta  
- se há necessidade de criar pastas adicionais (ex.: src/rag, src/knowledge, src/services/rag etc.)

Avaliar também:

- se a estrutura atual segue MVC, modular ou outra abordagem  
- se já existe um padrão de nomenclatura que deve ser replicado  
- se qualquer módulo poderia sofrer impacto pela nova feature  

> Objetivo final: **garantir compatibilidade total com a base de código**.

---

# ✔️ 3. ANALISAR COMO O BACKEND ATUAL INTERAGE COM O POSTGRESQL

Você deve identificar:

- qual biblioteca é usada (pg, prisma, knex, supabase client, etc.)  
- o padrão de criação de queries  
- como são feitas migrations (se existirem)  
- se há uma camada de repositórios ou acesso direto ao DB  
- como lidar com adição de novas tabelas sem violar integridade  

Essa análise deve gerar:

- uma recomendação segura de como implementar a tabela `knowledge_documents`  
- uma rota segura de migração que **não quebre nada existente**

> NÃO criar a tabela nesta fase, apenas **avaliar riscos e definir abordagem**.

---

# ✔️ 4. AVALIAR SE O RAG DEVE SER IMPLEMENTADO EM CÓDIGO OU VIA N8N

Com base no fluxo existente do n8n:

- verifique como ele conversa com o backend  
- identifique quais endpoints são consumidos  
- analise se o n8n precisa ser adaptado  
- determine se o módulo RAG deve ser:

  **a. totalmente implementado no backend**,  
  ou  
  **b. parcialmente integrado ao n8n via endpoints já existentes.**

Sua recomendação deve ser baseada em:

- segurança  
- manutenção  
- desempenho  
- risco de crash  
- estabilidade do fluxo atual  

---

# ✔️ 5. ANALISAR SE HÁ RISCO DE CONFLITO COM TABELAS EXISTENTES

Antes de sugerir qualquer criação de nova tabela:

- listar todas as tabelas atuais  
- validar nomes, relacionamentos e convenções  
- confirmar que `knowledge_documents` não entra em conflito  
- identificar alternativas se necessário  

---

# ✔️ 6. GERAR UM RELATÓRIO TÉCNICO DA FASE 1

Ao terminar a análise, você deve produzir um **relatório estruturado**, incluindo:

1. **Mapa da estrutura do projeto atual**  
2. **Avaliação sobre onde encaixar o módulo RAG**  
3. **Recomendação de estrutura de pastas**  
4. **Abordagem segura de criação de novas tabelas**  
5. **Pontos de atenção para integração com n8n**  
6. **Diagnóstico de riscos / conflito com o banco**  
7. **Plano final de execução da Fase 2**  

O relatório deve ser objetivo, organizado e imediatamente utilizável para a próxima fase.

---

# ⚠️ REGRAS DESTA FASE

- NÃO criar nenhum arquivo novo.  
- NÃO alterar arquivos existentes.  
- NÃO implementar endpoints.  
- NÃO criar tabelas.  
- NÃO adicionar dependências.  
- Apenas analisar, mapear e emitir recomendações seguras.  

---

# 📌 SAÍDA ESPERADA

Um relatório completo de diagnóstico + recomendações, pronto para orientar a Fase 2.