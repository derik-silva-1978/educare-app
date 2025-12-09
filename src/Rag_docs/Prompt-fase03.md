# FASE 3 — PROMPT PARA O REPLIT (BACKEND)
## Objetivo: Implementar o núcleo do RAG (Consulta), sem alterar fluxos existentes.  
### Nesta fase você vai criar **somente a infraestrutura de consulta**:
- serviço RAG
- integração com PostgreSQL para seleção de documentos
- integração com File Search para recuperar trechos
- montagem de prompt para o LLM (Gemini e/ou OpenAI)
- endpoint `/rag/ask` seguro e compatível com o fluxo atual do Educare App

⚠️ IMPORTANTE:  
Nesta fase **não haverá ainda personalização profunda do bebê**, que virá na Fase 4.  
O objetivo é garantir que a pipeline RAG responda corretamente e de forma estável.

---

# ✔️ 1. CRIAR O MÓDULO `ragService`
Local correto deve seguir o padrão do projeto, por exemplo:

src/services/ragService.js

ou equivalente em Python, se o backend for Python.

O módulo deve conter:

## 1.1. Função: `selectKnowledgeDocuments(queryFilters)`
Objetivo: Selecionar quais documentos (“knowledge_documents”) serão enviados ao File Search.

### Deve:
- receber objeto com filtros como:
  - `age_range`
  - `domain`
  - `tags`
- construir uma query SQL segura usando o padrão atual do projeto
- retornar lista de:
  - `id`
  - `title`
  - `file_search_id`
  - `tags`
  - `age_range`
  - `domain`

### Regras:
- Nunca alterar a tabela.
- Não usar SELECT *, apenas campos necessários.
- Usar parâmetros preparados.

---

## 1.2. Função: `retrieveFromFileSearch(question, fileSearchIds)`
Objetivo: Consultar a API do File Search com base nos documentos filtrados.

### Deve:
1. Receber:
   - a pergunta do usuário
   - lista de `file_search_id`
2. Montar a payload da API:
   - query = pergunta
   - documents = lista de IDs filtrados
3. Chamar o serviço `fileSearchService` (criado na Fase 2)
4. Retornar lista de trechos relevantes:
   - texto recuperado
   - referência ao documento
   - score (se fornecido pela API)

### Regras:
- Se nenhum documento for encontrado → retornar array vazio.
- Se a API retornar erro → logar e retornar array vazio (não quebrar backend).

---

## 1.3. Função: `buildLLMPrompt(question, retrievedChunks)`
Objetivo: Preparar o prompt a ser enviado ao LLM.

O prompt deve conter:
- “instruções do sistema” (versão inicial do TitiNauta — você ainda vai refinar na fase 4)
- pergunta original do usuário
- trechos recuperados anotados como citações
- instruções de segurança:
  - “não inventar textos”
  - “use apenas os trechos recuperados”
  - “cite fonte interna quando relevante”

### Exemplo de estrutura:

SYSTEM:
Você é o assistente Educare App. Responda de forma clara, acolhedora e sem alucinar.
Use EXCLUSIVAMENTE os trechos fornecidos pelo mecanismo de busca.
Cite sempre a origem do trecho se possível.

QUESTION:
{{pergunta original}}

CONTEXT EXCERPTS:
  1.	{{trecho A}}
  2.	{{trecho B}}

RULES:
  •	Se não houver informações suficientes, diga que não foi possível encontrar no material oficial.
  •	Não invente dados médicos ou recomendações clínicas.

Replit deve ajustar o texto ao padrão do sistema.

---

## 1.4. Função: `callLLM(prompt)`
Objetivo: Chamar Gemini ou OpenAI baseada em `.env`

### Deve:
- Detectar qual LLM está ativa (Gemini ou GPT-4.x)  
- Enviar o prompt completo
- Tratar:
  - erros de API
  - timeouts
  - respostas inválidas
- Retornar apenas o texto gerado pela LLM

---

## 1.5. Função principal: `runRAG(question, queryFilters)`
Juntando tudo:

1. Selecionar documentos no PostgreSQL  
   `docs = await selectKnowledgeDocuments(filters)`

2. Extrair file_search_ids  
   `ids = docs.map(d => d.file_search_id)`

3. Chamar File Search  
   `chunks = await retrieveFromFileSearch(question, ids)`

4. Construir prompt do LLM  
   `prompt = buildLLMPrompt(question, chunks)`

5. Executar LLM  
   `response = await callLLM(prompt)`

6. Retornar JSON:

{
“answer”: “…”,
“citations”: […],
“documents_used”: […],
“chunks_used”: […]
}

---

# ✔️ 2. IMPLEMENTAR ROTA `/rag/ask` (SEM MEXER NO n8n)

### Rota:

POST /rag/ask

### Entrada:

{
“question”: “texto da pergunta”,
“filters”: {
“age_range”: “0-3m”,
“domain”: “motor”,
“tags”: [“controle_cefálico”]
}
}

### A rota deve:

1. Validar entrada (question obrigatória).
2. Sanitizar campos (evitar injection).
3. Chamar `ragService.runRAG(question, filters)`.
4. Retornar resposta estruturada.
5. Logar a operação (uso de LLM, filtros e documentos selecionados).
6. Garantir que erros:
   - sejam logados
   - NÃO quebrem o servidor
   - retornem status adequado (500, 400 etc.)

> ⚠️ Nesta fase, NÃO incluir lógica de personalização do bebê.  
Essa lógica entrará na Fase 4.

---

# ✔️ 3. DOCUMENTAÇÃO NECESSÁRIA (ATUALIZAR)

Atualizar `docs/RAG-EDUCARE.md` com:

### 3.1. Estrutura do módulo RAG (arquivo, funções, assinatura)  
### 3.2. Descrição do endpoint `/rag/ask`  
- parâmetros  
- exemplo de request  
- exemplo de response  
- limitações da fase atual  

### 3.3. Como configurar LLM no `.env`  

LLM_PROVIDER=gemini|openai
GEMINI_API_KEY=…
OPENAI_API_KEY=…

---

# ✔️ 4. REGRAS DE SEGURANÇA DA FASE 3

- Não alterar rotas existentes.
- Não alterar fluxos existentes do n8n.
- Não usar tabelas existentes para armazenar dados do RAG.
- Não vazar dados sensíveis para prompts do LLM.
- Nunca permitir que erros de File Search derrubem o backend.
- Sempre responder com JSON consistente.

---

# 📌 SAÍDA ESPERADA DA FASE 3

- Módulo `ragService` criado com todas as funções descritas.  
- Serviço File Search sendo chamado corretamente.  
- Endpoint `/rag/ask` funcional e seguro.  
- Documentação atualizada.  
- Todo o sistema rodando SEM quebrar funcionalidades já existentes.