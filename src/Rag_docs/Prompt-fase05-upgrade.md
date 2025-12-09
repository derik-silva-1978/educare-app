# FASE 5-UPGRADE — ADAPTAÇÃO GRADUAL DO RAG PARA USAR AS BASES SEGMENTADAS (COM FALLBACK SEGURO)
## Objetivo: Fazer o RAG começar a CONSULTAR as novas bases segmentadas (`kb_baby`, `kb_mother`, `kb_professional`)
DE FORMA CONTROLADA, GRADUAL E REVERSÍVEL, mantendo:
- compatibilidade com a base vetorial antiga,
- nenhum crash,
- nenhum impacto negativo ao usuário final.

Nesta fase, o RAG passa a ter:
- seleção de base por módulo (bebê, mãe, profissional),
- fallback para a base antiga em caso de falha ou indisponibilidade,
- comportamento observável e controlável.

---

# 🔒 REGRA DE SEGURANÇA GERAL

Você (Replit) PODE:

- introduzir a **camada de seleção de base** (KnowledgeBaseSelector),
- adaptar o `ragService` para RECEBER o contexto de módulo (baby/mother/professional),
- fazer com que o RAG consulte PRIORITARIAMENTE as novas bases segmentadas,
- manter fallback para a base vetorial antiga,
- criar flags/configurações para ativar/desativar o uso das novas bases.

Você NÃO PODE:

- remover ou inutilizar a base vetorial antiga,
- eliminar o código de consulta atual da base antiga,
- quebrar o contrato dos endpoints atuais do RAG,
- mudar a assinatura de rotas consumidas pelo frontend ou n8n,
- causar crash se alguma das novas tabelas não estiver populada/operacional.

---

# ✅ 1. PRE-VALIDAÇÃO OBRIGATÓRIA

Antes de alterar o `ragService`, você deve:

1. Revisar a implementação atual do RAG:
   - função central que:
     - recebe a pergunta,
     - gera o embedding da query,
     - consulta a base vetorial atual (tabela antiga),
     - monta o contexto,
     - monta o prompt final,
     - chama a LLM.

2. Identificar:
   - em qual ponto é feita a consulta vetorial hoje (função/fonte únicos),
   - onde é melhor introduzir a lógica de seleção de base (uma única camada central).

3. Confirmar:
   - quais parâmetros já chegam ao RAG (ex.: `babyId`, `userId`, etc.),
   - se já existe algum indicador de módulo (bebê/mãe/profissional),
   - se será necessário adicionar um parâmetro `moduleType` em algum nível interior (sem quebrar o contrato externo).

---

# 🧠 2. IMPLEMENTAR O “KnowledgeBaseSelector” (CAMADA INTERNA)

Você deve criar um componente/módulo interno, por exemplo:

- `knowledgeBaseSelector` ou `knowledgeSourceResolver`

### 2.1. Entrada

- `moduleType` (string): `"baby" | "mother" | "professional" | null/undefined`
- possivelmente:
  - `babyId`, `userId` etc. (apenas se necessário no futuro).

### 2.2. Saída

- Nome da fonte vetorial primária a ser usada:
  - `kb_baby`
  - `kb_mother`
  - `kb_professional`
  - ou `legacy_base` (tabela antiga), como fallback.

### 2.3. Regras

- Se `moduleType = "baby"` → usa `kb_baby` como principal.
- Se `moduleType = "mother"` → usa `kb_mother` como principal.
- Se `moduleType = "professional"` → usa `kb_professional` como principal.
- Se `moduleType` for ausente ou inválido → continuar usando a base antiga (modo legado).

### 2.4. Feature Flag (opcional, recomendado)

Introduzir uma flag de ambiente (por exemplo):

- `ENABLE_SEGMENTED_KB=true|false`

Regras:

- Se `ENABLE_SEGMENTED_KB = false` → **NUNCA** consultar as novas bases (apenas legado).
- Se `ENABLE_SEGMENTED_KB = true` → seguir lógica acima com segmentação.

---

# 🧩 3. ADAPTAR O RAG SERVICE (SEM QUEBRAR O CONTRATO)

No `ragService` (ou módulo equivalente), você deve:

### 3.1. Introduzir o conceito de `moduleType` internamente

- Se o endpoint do RAG já recebe algum contexto do tipo “modo” (bebê/mãe/profissional):
  - use esse contexto para inferir `moduleType`.
- Se não recebe:
  - você pode:
    - detectar a partir da rota chamadora interna (ex.: `/rag/baby`, `/rag/mother`, etc.), ou
    - adicionar um campo **opcional** no payload interno (não exposto ao usuário), por exemplo:
      ```json
      {
        "question": "...",
        "moduleType": "baby"
      }
      ```
    - mantendo compatibilidade com requests antigos sem esse campo.

### 3.2. Fluxo de consulta vetorial

Você deve adaptar o fluxo de consulta às seguintes etapas:

1. Determinar o `moduleType` (baby/mother/professional/legacy).
2. Chamar o `KnowledgeBaseSelector` para obter:
   - base primária (`kb_baby` / `kb_mother` / `kb_professional` / `legacy_base`).
3. Tentar buscar resultados na base primária.
4. Se a base primária:
   - não tiver resultados relevantes (e.g. score baixo ou nenhum resultado),
   - ou ocorrer erro técnico,
   ➜ acionar fallback:
     - consultar a base vetorial antiga (legacy_base).
5. Combinar os resultados da forma mais coerente possível:
   - preferir os da base segmentada quando disponíveis,
   - usar a base antiga como reforço ou substituto.

⚠️ Em qualquer cenário de erro, o RAG deve:
- tentar usar a base antiga,
- e, em último caso, responder sem contexto vetorial (mas NUNCA quebrar a API).

---

# 🧪 4. TESTES DOS CENÁRIOS PRINCIPAIS

Você deve implementar testes (manuais e, se possível, automatizados) para:

### 4.1. Módulo Bebê (`moduleType = "baby"`)

- Perguntas vindas do fluxo “Meu Bebê”:
  - RAG deve consultar:
    - `kb_baby` primeiro,
    - e, se necessário, fallback na base antiga.

Validar:
- queries corretas na tabela `kb_baby`,
- fallback funcionando se `kb_baby` estiver vazia ou indisponível.

### 4.2. Módulo Mãe (`moduleType = "mother"`)

Mesma lógica, consultando `kb_mother`.

### 4.3. Módulo Profissional (`moduleType = "professional"`)

Mesma lógica, consultando `kb_professional`.

### 4.4. Modo Legado (sem `moduleType` ou com feature flag desligada)

- RAG deve se comportar **EXATAMENTE** como antes:
  - consultar somente a base antiga,
  - ignorar as novas tabelas.

### 4.5. Cenário de erro nas novas tabelas

Simular:
- erro de conexão ou falha de query nas novas bases,
- e confirmar:
  - fallback imediato para base antiga,
  - sem crash na API,
  - logs claros indicando o problema.

---

# 🧱 5. INTEGRAÇÃO COM O PROMPT BUILDER

Você deve garantir que:

- A montagem do prompt final continue usando o mesmo formato,
- Apenas a ORIGEM dos `context chunks` muda (nova base vs base antiga),
- O conteúdo da base segmentada seja usado de forma **contextual ao módulo**:

  - Se baby:
    - texto mais pedagógico sobre desenvolvimento infantil e marcos.
  - Se mother:
    - texto de acolhimento, bem-estar, saúde mental, etc.
  - Se professional:
    - texto técnico, referências, metodologias etc.

Nenhuma mudança deve ser feita no contrato com LLM (OpenAI/Gemini) além da melhoria de contexto.

---

# 🧷 6. LOGS E OBSERVABILIDADE

Você deve adicionar logs mínimos e claros:

- qual base foi utilizada (`kb_baby`, `kb_mother`, `kb_professional` ou `legacy_base`),
- se houve fallback,
- tempo de resposta da query vetorial,
- tamanho do contexto retornado.

Esse logging deve ser:
- leve,
- sem dados sensíveis,
- útil para monitorar se a segmentação está funcionando bem.

---

# 📄 7. DOCUMENTAÇÃO A SER ATUALIZADA

Atualizar:

- `docs/RAG-EDUCARE.md`:
  - Diagrama de fluxo RAG atualizado,
  - Descrever:
    - uso de `moduleType`,
    - uso de `KnowledgeBaseSelector`,
    - uso das novas tabelas segmentadas,
    - estratégia de fallback.

- `docs/TECHNICAL-ARCHITECTURE.md`:
  - Incluir camada de seleção de base,
  - explicitar a existência de `kb_baby`, `kb_mother`, `kb_professional` + base legada.

---

# 🛡️ 8. CHECKLIST FINAL DA FASE 5-UPGRADE

Antes de encerrar a fase:

- [ ] RAG funciona normalmente com a base antiga quando `ENABLE_SEGMENTED_KB = false`.
- [ ] Com `ENABLE_SEGMENTED_KB = true`, RAG consulta as bases segmentadas corretamente.
- [ ] Fallback para base antiga ocorre em caso de erro ou ausência de resultados.
- [ ] Nenhuma rota foi quebrada ou alterada externamente.
- [ ] n8n continua consumindo os endpoints como antes.
- [ ] Logs estão claros e sem dados sensíveis.
- [ ] Nenhum crash introduzido.

---

# 🎯 OBJETIVO FINAL DA FASE 5-UPGRADE

Ao final desta fase, o Educare+ terá:

- RAG consciente de módulos (bebê, mãe, profissional),
- consultas segmentadas para cada tipo de conteúdo,
- fallback seguro para a base antiga,
- zero impacto negativo para usuários,
- base pronta para próximas otimizações (ranking, ajustes finos de prompts, métricas).

Não prossiga para ajustes finos de relevância, ranking e otimização até a Fase 6-UPGRADE.