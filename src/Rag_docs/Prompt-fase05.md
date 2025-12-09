# FASE 5 — PROMPT PARA O REPLIT (BACKEND)
## Objetivo: Implementar MECANISMOS DE OTIMIZAÇÃO, CACHE, CONTROLE DE CUSTO, FALLBACK ENTRE LLMs, E HARDENING DO RAG.
### Nesta fase você aprimora o sistema para produção:
- mais rápido,
- mais barato,
- mais seguro,
- mais estável,
- mais resiliente,
- sem risco de quebrar o backend ou o fluxo n8n.

Nada desta fase deve quebrar implementações anteriores.  
Nada deve alterar tabelas ou fluxos de banco.  
Apenas funcionalidades adicionais e seguras.

---

# ✔️ 1. IMPLEMENTAR CACHE DE RESULTADOS DE FILE SEARCH E DE RESPOSTAS DO RAG

### 1.1. Criar módulo de cache
Seguindo o padrão do projeto, por exemplo:

src/services/cacheService.js

Use a melhor tecnologia disponível no projeto:
- se o projeto já usa Redis → usar Redis  
- se não houver Redis → usar cache in-memory com expiração configurável  
- nunca bloquear execução caso o cache falhe

### 1.2. Estratégia de Cache

#### Cache de File Search (curto prazo)
Chave:

fileSearch:{hash( question + ids )}

TTL:
- 2 a 10 minutos (ajustar conforme desempenho real)

Armazena:
- chunks recuperados do File Search

#### Cache de resposta final (curto ou médio prazo)
Chave:

ragResponse:{hash(question + babyContext + filters)}

TTL:
- 5 a 30 minutos

Armazena:
- a resposta final enviada ao usuário

⚠️ Regras:
- o cache deve ser ignorado se o tamanho da resposta ultrapassar limites
- o cache nunca deve impedír uma nova consulta se estiver inválido

---

# ✔️ 2. IMPLEMENTAR MECANISMO DE FALLBACK ENTRE LLMs (GEMINI → OPENAI)

### 2.1. Estratégia
Se a chamada Gemini falhar por:
- timeout  
- erro 500  
- erro na API do File Search  
- indisponibilidade temporária  

Então:
- automaticamente tentar o GPT-4.1 (ou o modelo definido no `.env`)

### 2.2. Estrutura recomendada (adaptar ao projeto)

try {
return callGemini(prompt)
} catch {
log(“LLM Gemini falhou, utilizando fallback OpenAI”)
return callOpenAI(prompt)
}

### 2.3. Regras de segurança
- qualquer exceção deve ser logada  
- fallback não pode travar o backend  
- fallback deve ser transparente para o usuário final  

---

# ✔️ 3. IMPLEMENTAR LIMITE DE TOKENS E DE CUSTO POR REQUISIÇÃO

Criar módulo:

src/services/usageGuardService.js

Com funcionalidades:

### 3.1. `estimatePromptCost(prompt)`
- contar tokens se possível (ou estimar por tamanho)
- logar volume de tokens enviados

### 3.2. Regras de proteção
- se o prompt passar de um limite (ex.: 4096 tokens) → truncar contexto com segurança
- se o custo estimado passar de um limite → usar uma versão mais barata da LLM (ex.: Gemini Flash)

### 3.3. Logar tudo
- número de tokens enviados  
- modelo usado  
- fallback ativado ou não  
- custo estimado  

---

# ✔️ 4. PROTEÇÃO CONTRA ABUSO E PROMPT INJECTION

Adicionar proteção no serviço que recebe a pergunta.

### 4.1. Função de Sanitização
Criar módulo:

src/utils/sanitizeUserPrompt.js

Funções:

- remover tentativas de:
  - "ignore previous instructions"
  - "act as system"
  - "delete database"
  - "reveal prompt"
  - etc.

- bloquear palavras proibidas configuráveis  
- filtrar ataques de prompt injection conhecidos

### 4.2. Regras obrigatórias
- Pergunta do usuário nunca deve substituir o “System Prompt”  
- Nunca concatenar entrada do usuário diretamente ao início do prompt  
- Sempre colocar a entrada do usuário dentro de um bloco delimitado:

USER QUESTION:
<<<
{{pergunta}}



---

# ✔️ 5. ADICIONAR MECANISMO DE OBSERVABILITY E MONITORAMENTO

Criar ou ampliar logs:

### 5.1. Logar métricas por requisição RAG:
- tempo total da operação  
- tempo da consulta ao file search  
- tempo da execução LLM  
- número de chunks retornados  
- número de tokens do prompt  
- qual modelo foi usado  
- fallback ativado ou não  

### 5.2. Criar log estruturado
JSON em linha, por exemplo:

{
“event”: “RAG_EXECUTION”,
“baby_id”: “…”,
“question”: “…”,
“model_used”: “gemini-pro”,
“fallback”: false,
“file_search_chunks”: 7,
“duration_total_ms”: 2520,
“timestamp”: “2025-02-17T12:30:22Z”
}

### 5.3. Logs de erro não podem expor:
- conteúdo do banco  
- credenciais  

---

# ✔️ 6. APRIMORAR O ENDPOINT `/rag/ask` PARA SER MAIS RESILIENTE

### Agora o endpoint deve:

1. Sanitizar a pergunta  
2. Tentar buscar resposta em cache  
3. Executar função `runRAG` otimizada  
4. Em caso de erro do Gemini → fallback OpenAI  
5. Em caso total de falha → mensagem segura:

“Não consegui acessar nossas bases de conhecimento agora, mas estou aqui!
Pode tentar novamente em instantes? 💛”

6. Armazenar resposta no cache  
7. Registrar log detalhado  

---

# ✔️ 7. ATUALIZAÇÃO DE DOCUMENTAÇÃO

Atualizar `docs/RAG-EDUCARE.md` com:

### 7.1. Estrutura e uso do cache  
### 7.2. Como funciona o fallback de LLM  
### 7.3. Regras de sanitização de prompt  
### 7.4. Políticas de custo e limites  
### 7.5. Estrutura dos logs e como interpretá-los  
### 7.6. Exemplos de requisição/response atualizados  

---

# ⚠️ REGRAS DE SEGURANÇA DA FASE 5

- Não alterar modelos de tabelas existentes  
- Não mudar comportamento de endpoints antigos  
- Não atrapalhar o fluxo do n8n  
- Toda falha deve ser capturada e tratada  
- O endpoint RAG nunca pode quebrar o servidor  
- A sanitização nunca pode interferir na lógica interna do Educare  

---

# 📌 SAÍDA ESPERADA DA FASE 5

- RAG mais rápido (cache)
- RAG mais barato (controle de tokens + fallback inteligente)
- RAG mais seguro (injeção bloqueada)
- RAG mais estável (fallback automático)
- RAG mais observável (logs e métricas)
- Endpoint `/rag/ask` fortalecido e resiliente  
- Nenhum crash introduzido no backend existente

---