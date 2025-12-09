# FASE 1-UPGRADE — PRÉ-VALIDAÇÃO, AUDITORIA COMPLETA E MAPEAMENTO DA REESTRUTURAÇÃO RAG
## Objetivo: Antes de qualquer implementação, você (Replit) deve executar uma auditoria técnica completa,
verificando o impacto da segmentação da base vetorial em todo o backend, banco de dados, frontend
e nos módulos já criados no Educare+ App.  
Nenhuma alteração deve ser realizada nesta fase.

---

# 🔒 REGRA DE OURO (OBRIGATÓRIA)

**NÃO IMPLEMENTAR NENHUMA MUDANÇA.**  
Esta fase serve **exclusivamente** para análise, diagnóstico e planejamento seguro.

Toda alteração só poderá ocorrer nas próximas fases, após aprovação explícita do usuário.

---

# 🔍 1. OBJETIVOS DA FASE 1-UPGRADE

Você deverá:

1. Realizar auditoria completa do RAG atual.
2. Mapear onde o RAG consome a base vetorial unificada.
3. Identificar os pontos que serão afetados pela criação das novas bases:
   - `kb_baby`
   - `kb_mother`
   - `kb_professional`
4. Localizar todos os serviços, módulos e controllers envolvidos na ingestão.
5. Identificar como o Super Admin envia conteúdo técnico para ingestão atualmente.
6. Localizar como o Prompt Builder está integrado ao RAG.
7. Mapear dependências com:
   - PostgreSQL  
   - módulos de usuário (bebê, mãe, profissional)  
   - n8n  
   - frontend (Super Admin)
8. Avaliar riscos e pontos sensíveis de alteração.
9. Sugerir caminhos seguros de expansão (sem quebra de código existente).

---

# 🧠 2. ESCOPOS QUE DEVEM SER ANALISADOS (SEM ALTERAR)

## 2.1. Backend — RAGService
- Onde o RAG atualmente recebe embeddings.
- Onde realiza buscas vetoriais.
- Onde monta o prompt final.
- Onde a tabela atual do RAG está referenciada.
- Como está implementado o pipeline:
  - ingestão → chunking → embedding → upsert → query semântica.

## 2.2. Backend — Knowledge Ingestion
- Identificar o ponto onde o conteúdo ingerido é inserido na base vetorial.
- Confirmar se há um único fluxo de ingestão ou múltiplos.
- Identificar dependências com módulos que já foram implementados.

## 2.3. Backend — Prompt Management
- Avaliar relação entre a reestruturação e:
  - categorias de prompts  
  - templates  
  - montagem dinâmica  
- Confirmar que o Prompt Management continua funcional após segmentação.

## 2.4. Banco de Dados (PostgreSQL)
- Confirmar:
  - se existe tabela vetorial atual e seu schema
  - se migrations foram usadas
  - se tabelas de suporte precisam ser expandias

Sem alterar nada.

## 2.5. Frontend — Área Super Admin
- Mapear:
  - tela de ingestão de conteúdos  
  - rotas que chamam ingestão  
  - payload atual enviado  
- Identificar como encaixar o seletor de categoria (bebê/mãe/profissional) futuramente.

## 2.6. Integração com n8n
- Identificar rotas consumidas pelo n8n ligadas ao RAG.
- Certificar-se de que nada será quebrado.

---

# ⚙️ 3. ENTREGÁVEIS DA FASE 1-UPGRADE

Você deve produzir um **RELATÓRIO DETALHADO**, incluindo:

### ✔️ 1. Mapa das dependências atuais do RAG  
- arquivos envolvidos  
- funções centrais  
- fluxos críticos  
- módulos que consomem a base vetorial

### ✔️ 2. Identificação do ponto exato onde o RAG consulta a base atual  
- nome da tabela  
- módulo responsável pela query  
- função responsável pela busca  

### ✔️ 3. Identificação do ponto exato onde acontece a ingestão  
- serviço principal  
- validações existentes  
- pontos que serão expandidos

### ✔️ 4. Avaliação dos riscos técnicos  
- possíveis regressões  
- partes sensíveis  
- módulos que precisam de compatibilidade total  
- impacto no Prompt Builder  
- impacto no fluxo do aplicativo (Meu Bebê / Minha Saúde / Profissional)

### ✔️ 5. Recomendação dos caminhos mais seguros para upgrade  
Você deverá propor **3 abordagens possíveis**, por exemplo:

- **A:** adicionar segmentação sem alterar a tabela antiga  
- **B:** criar 3 novas tabelas e substituir gradualmente  
- **C:** migrar para base segmentada com camada de backward-compatibility

Para cada abordagem, você deve listar:

- vantagens  
- riscos  
- impacto no código existente  
- nível de complexidade  

### ✔️ 6. Plano preliminar de migração (alto nível)  
Um outline do que será feito em fases futuras.

---

# 🧨 4. RESTRIÇÕES (OBRIGATÓRIO)

Durante esta fase:

❌ NÃO criar novas tabelas  
❌ NÃO alterar as tabelas atuais  
❌ NÃO modificar o RAG  
❌ NÃO alterar código de ingestão  
❌ NÃO mexer em rotas existentes  
❌ NÃO refatorar serviços  
❌ NÃO alterar chamadas ao PostgreSQL  
❌ NÃO mudar UI/Frontend  
❌ NÃO executar migrações  

Apenas **analisar e mapear**.

---

# 🛡️ 5. OBJETIVO FINAL DA FASE 1-UPGRADE

Ao concluir esta fase, você deve entregar:

👉 Um diagnóstico técnico claro  
👉 Mapa completo da arquitetura atual do RAG  
👉 Recomendações seguras para expansão  
👉 Zero alteração no sistema  
👉 Nenhuma regressão introduzida  

Esta fase define o caminho seguro para as próximas fases de implementação.

---