# FASE 4 — PROMPT PARA O REPLIT (BACKEND)
## Objetivo: Implementar PERSONALIZAÇÃO REAL da resposta do RAG usando os dados do bebê e do cuidador armazenados no PostgreSQL.
### Nesta fase, você irá integrar:
- dados reais do bebê (idade, marcos atingidos, atrasos, histórico);
- resultados dos quizzes;
- contexto da jornada Educare (domínios e categorias);
- regras oficiais de segurança Educare;
- instruções do TitiNauta para tom, clareza e acolhimento.

⚠️ IMPORTANTE  
Nesta fase nós NÃO alteramos o fluxo n8n e NÃO alteramos tabelas já existentes.  
A personalização será apenas **via leitura** de dados já existentes no PostgreSQL.

---

# ✔️ 1. CRIAR MÓDULO `babyContextService` PARA RECUPERAR DADOS DO BEBÊ

O módulo deve ser criado seguindo a estrutura do projeto, por exemplo:

src/services/babyContextService.js

ou `*.py` se o backend estiver em Python.

## 1.1. Função: `getBabyContext(babyId)`

Essa função deve:

1. Buscar na tabela principal de bebês:
   - nome  
   - data de nascimento  
   - idade estimada em dias/semanas/meses (calcular)  
   - idade corrigida (se existir no projeto)  
   - campos já usados no app (ex.: condições especiais)

2. Buscar histórico de marcos (tabela já existente):
   - marcos atingidos  
   - marcos pendentes  
   - marcos atrasados  
   - últimos registros

3. Buscar resultados de quizzes:
   - domínio mais forte  
   - domínio mais fraco  
   - último score  
   - comentários ou alertas gerados

4. Buscar informações adicionais:
   - trilha Educare ativa  
   - categorias da jornada que já foram vistas  

## 1.2. Estrutura do objeto retornado (ajuste ao modelo real)

{
baby_id: “…”,
name: “Titi”,
age_weeks: 14,
age_months: 3.2,
corrected_age_weeks: null,
milestones: {
achieved: […],
pending: […],
delayed: […]
},
quiz_summary: {
strongest_domain: “social”,
weakest_domain: “motor”,
last_score: 7,
last_feedback: “…”
},
educare_track: {
current_stage: “RN 0–3m”,
recommended_domain: “sensorial”
}
}

⚠️ O Replit deve adaptar campos à estrutura real existente no banco.

---

# ✔️ 2. AJUSTAR O `ragService.runRAG()` PARA ACEITAR CONTEXTO DO BEBÊ

Modifique a assinatura do método:

Antes:

runRAG(question, queryFilters)

Agora:

runRAG(question, babyId, queryFilters)

### No início do fluxo, adicionar:

const babyContext = await babyContextService.getBabyContext(babyId);

E repassar esse contexto para o construtor de prompt (buildLLMPrompt).

---

# ✔️ 3. APRIMORAR `buildLLMPrompt` PARA USAR O CONTEXTO PERSONALIZADO

Inclua no prompt:

## 3.1. Seção de Personalização

BABY CONTEXT:
Nome: {{name}}
Idade: {{age_weeks}} semanas
Marcos já atingidos: {{milestones.achieved}}
Marcos pendentes: {{milestones.pending}}
Domínio mais forte: {{quiz_summary.strongest_domain}}
Domínio mais fraco: {{quiz_summary.weakest_domain}}
Trilha Educare atual: {{educare_track.current_stage}}

## 3.2. Regras Educare (sintetizadas)

Inclua como texto fixo:

EDUCARE SAFETY RULES:
  •	Nunca criar diagnóstico.
  •	Nunca usar termos alarmistas.
  •	Sempre oferecer orientações práticas baseadas em evidências.
  •	Identificar sinais de alerta reais (OMS / AIDPI / Educare) e recomendá-los com cuidado.
  •	Responder sempre no tom acolhedor do Educare App.
  •	Preferir frases curtas, diretas e claras para cuidadores.

## 3.3. Regras de Confiança / RAG

RAG RULES:
  •	Use exclusivamente os trechos recuperados do File Search.
  •	Se os trechos não forem suficientes para responder, diga isso claramente.
  •	Não invente fatos clínicos ou dados científicos.

## 3.4. Nova estrutura do Prompt

SYSTEM:
Você é o TitiNauta, assistente oficial do Educare App.
Fale sempre de forma acolhedora, clara e segura.

BABY CONTEXT:
{{contexto_gerado_pelo_babyContextService}}

QUESTION:
{{pergunta_original}}

SUPPORTING EXCERPTS (FILE SEARCH):
  1.	{{trecho1}}
  2.	{{trecho2}}
  3.	…

INSTRUCTIONS:
  •	Personalize a resposta para o bebê acima.
  •	Use apenas os trechos fornecidos.
  •	Aplique o tom Educare.
  •	Oriente o cuidador de forma clara e gentil.

---

# ✔️ 4. AJUSTAR O ENDPOINT `/rag/ask` PARA ACEITAR `baby_id`

Modificar o endpoint:

### Antes:

POST /rag/ask
body = { question, filters }

### Agora:

POST /rag/ask
body = { baby_id, question, filters }

### Validações:
- baby_id obrigatório
- question obrigatória

### Fluxo do endpoint:
1. Validar entrada
2. Obter baby context
3. Passar para `ragService.runRAG()`
4. Retornar resposta final

---

# ✔️ 5. TESTES QUE O REPLIT DEVE CRIAR NESTA FASE

Criar testes isolados para:

### 5.1. babyContextService  
- retorna dados completos quando IDs válidos são usados  
- retorna erro controlado quando bebê não existe  
- calcula idade corretamente  

### 5.2. ragService  
- aceita babyContext e o incorpora ao prompt  
- não quebra se trechos do File Search vierem vazios  
- retorna resposta mesmo com dados parciais  

---

# ✔️ 6. DOCUMENTAÇÃO A ATUALIZAR

Adicionar no arquivo de docs:

### 6.1. Nova assinatura do endpoint `/rag/ask`  
### 6.2. Estrutura do contexto do bebê  
### 6.3. Como o RAG usa o File Search + PostgreSQL  
### 6.4. Exemplo de resposta personalizada  
### 6.5. Regras oficiais do Educare incluídas no prompt  

---

# ⚠️ REGRAS DE SEGURANÇA DA FASE 4

- Nenhum campo novo deve ser criado no banco.  
- Nenhuma tabela antiga deve ser alterada.  
- Todos os dados do bebê devem ser extraídos **somente via SELECT**.  
- O backend não deve expor dados sensíveis no prompt:
  - não incluir CPF  
  - não incluir nome da mãe se não for necessário  
  - não incluir notas internas do sistema  

---

# 📌 SAÍDA ESPERADA DA FASE 4

- O RAG passa a responder de maneira totalmente personalizada.  
- O File Search continua fornecendo trechos especializados.  
- O LLM responde no tom Educare com base em:
  - dados do bebê  
  - histórico  
  - marcos  
  - quizzes  
  - trilha Educare  
- Nenhuma funcionalidade antiga do backend é afetada.