# FASE 6-UPGRADE — AJUSTE FINO, RANKING, AVALIAÇÃO DE QUALIDADE E MIGRAÇÃO CONTROLADA DO RAG
## Objetivo: Otimizar a qualidade das respostas do RAG segmentado (kb_baby, kb_mother, kb_professional),
melhorar o ranking dos trechos retornados, conectar melhor com os prompts e **planejar a redução gradual
da dependência da base legada**, SEM quebrar nada e com monitoramento claro.

---

# 🔒 REGRA DE SEGURANÇA GERAL

Nesta fase você (Replit) PODE:

- ajustar o ranking e a lógica de seleção dos trechos vetoriais (relevância),
- melhorar a forma como os chunks são injetados no prompt final,
- introduzir métricas básicas de qualidade (log estruturado),
- preparar um mecanismo controlado para reduzir a dependência da base antiga.

Você NÃO PODE:

- desligar completamente a base antiga sem uma camada clara de fallback,
- alterar o contrato das rotas externas,
- mexer em dados sensíveis ou estrutura do PostgreSQL,
- quebrar o pipeline de ingestão ou o fluxo do usuário final,
- introduzir mudanças bruscas sem possibilidade de rollback.

---

# ✅ 1. PRE-VALIDAÇÃO OBRIGATÓRIA

Antes de otimizar, você deve:

1. Revisar como está hoje:
   - a função que:
     - recebe os resultados vetoriais (`chunks` ou `documents`),
     - ordena esses resultados,
     - escolhe quantos e quais vão para o prompt,
     - monta o contexto textual final.

2. Verificar:
   - se há algum ranking (score) vindo da base vetorial,
   - se há corte por limite de tokens ou por quantidade de documentos,
   - se hoje já existe ordenação por score/recência.

3. Confirmar:
   - onde é o melhor ponto para:
     - refinar o ranking,
     - aplicar filtros por módulo,
     - adaptar a quantidade de contexto por tipo de usuário (bebê, mãe, profissional).

Nenhum ajuste deve ser feito sem entender esse fluxo.

---

# 🧠 2. REFINO DO RANKING E SELEÇÃO DE TRECHOS

Você deve:

1. Implementar (ou aprimorar) uma função de ranking pós-query, por exemplo:
   - `rankKnowledgeResults(results, moduleType, question)`.

2. Essa função deve:
   - receber:
     - lista de resultados vetoriais (com score),
     - `moduleType` (`baby | mother | professional`),
     - a pergunta original (opcional).
   - produzir:
     - lista reduzida e ordenada de resultados,
     - respeitando um máximo de itens ou tokens definidos.

3. Estratégias recomendadas (não excludentes):
   - priorizar maior `score` retornado pela query vetorial;
   - aplicar pesos diferentes conforme `moduleType` e `category`/`tag` (ex.: em `kb_baby`, dar mais peso a `age_range` compatível);
   - descartar resultados com score muito baixo (threshold mínimo).

4. Regras mínimas:
   - nunca retornar uma lista completamente vazia sem tentar fallback (base antiga ou resposta sem contexto, com aviso de baixa confiança, se for o caso);
   - não concatenar contextos demais a ponto de estourar o limite do modelo.

---

# 🧩 3. ADAPTAÇÃO DO CONTEXTO POR MÓDULO

Você deve refinar a forma como o contexto é montado para:

### 3.1. Módulo Bebê
- Selecionar conteúdos:
  - coerentes com a faixa etária do bebê (se `age_range` estiver disponível),
  - coerentes com os domínios (motor, linguagem, social etc.).
- Priorizar textos:
  - orientativos, práticos, claros,
  - que respeitem a linguagem familiar.

### 3.2. Módulo Mãe
- Priorizar:
  - textos de acolhimento, saúde mental, bem-estar, nutrição, sono,
  - evitar incluir trechos muito técnicos ou clínicos desnecessários.

### 3.3. Módulo Profissional
- Priorizar:
  - textos técnicos, orientações de PEI, metodologias, guidelines,
  - permitir conteúdo mais denso, com termos técnicos.

⚠️ Importante:
- Esse refinamento é interno ao backend; respostas continuam vindo do mesmo endpoint,
- não alterar o contrato externo.

---

# 📊 4. MÉTRICAS E LOGS DE QUALIDADE (OBSERVABILIDADE)

Você deve adicionar logs estruturados (sem dados sensíveis) para avaliar:

- qual base foi usada (kb_baby / kb_mother / kb_professional / legacy_base);
- se houve fallback;
- quantos documentos foram usados como contexto;
- score médio e mínimo dos documentos selecionados;
- `moduleType` envolvido.

Opcionalmente, você pode/logar:

- um ID de correlação da requisição,
- tempo total da operação de busca vetorial.

Esses logs servirão para:

- entender se as bases novas estão dando respostas suficientemente ricas,
- decidir, futuramente, se é seguro desligar o uso da base legada para certos módulos.

---

# 🔁 5. PLANO DE MIGRAÇÃO CONTROLADA DA BASE LEGADA

Nesta fase, você NÃO vai desligar a base legada, mas deve PREPARAR um mecanismo para isso.

Sugestão:

1. Introduzir flags de configuração (por ambiente):

   - `USE_LEGACY_FALLBACK_FOR_BABY=true|false`
   - `USE_LEGACY_FALLBACK_FOR_MOTHER=true|false`
   - `USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=true|false`

2. Lógica:

   - Se `USE_LEGACY_FALLBACK_FOR_BABY=false`:
     - módulo baby consulta apenas `kb_baby`;
     - se não houver resultados, retorna resposta sem contexto vetorial (mas nunca crash).
   - Se `true`:
     - segue com fallback na base antiga.

3. Durante esta fase:
   - mantenha `true` para TODOS os módulos;
   - apenas garanta que o código está preparado para operar com `false` quando for a hora certa.

4. Nenhuma alteração na base antiga (nada de drop, truncate ou stop-ingest).

---

# 🧪 6. TESTES QUE DEVEM SER FEITOS

Você deve testar:

### 6.1. Qualidade básica por módulo
- Fazer perguntas típicas para cada módulo:
  - Bebê: marcos, estimulação, rotina;
  - Mãe: saúde mental, sono, nutrição;
  - Profissional: PEI, práticas inclusivas, avaliações.

Verificar se:

- o contexto vem da base correta;
- o conteúdo da resposta está coerente com o módulo;
- não aparecem trechos “fora de lugar” (ex.: conteúdo técnico em resposta para mãe).

### 6.2. Fallback ativo
- Forçar cenários onde a base nova está vazia para um módulo.
- Confirmar se o RAG:
  - usa a base legada,
  - responde sem crash.

### 6.3. Logs
- Verificar se os logs:
  - mostram corretamente qual base foi usada,
  - registram fallback,
  - não contêm dados sensíveis.

---

# 🧷 7. NENHUMA MUDANÇA NO FRONTEND NEM NO N8N

Nesta fase:

- O app Educare+ e Educare+ Ch@t continuam chamando o RAG pelos mesmos endpoints.
- O n8n continua integrando normalmente.
- Nenhuma alteração na UI é obrigatória aqui.

Todas as melhorias são **internas ao motor de RAG**.

---

# 📄 8. DOCUMENTAÇÃO A SER ATUALIZADA

Atualizar:

- `docs/RAG-EDUCARE.md`:
  - nova seção “Ajuste Fino e Ranking por Módulo”,
  - explicação das flags de fallback legado.

- `docs/OBSERVABILITY.md` (ou criar):
  - explicando quais métricas/logs foram adicionados,
  - como interpretá-los.

---

# 🛡️ 9. CHECKLIST FINAL DA FASE 6-UPGRADE

Antes de encerrar a fase, confirmar:

- [ ] Ranking refinado está em produção sem regressões.
- [ ] RAG responde com maior relevância e coerência por módulo.
- [ ] Fallback legado continua funcionando (todas as flags `USE_LEGACY_FALLBACK_* = true`).
- [ ] Nenhum crash ou quebra nas rotas do RAG.
- [ ] Logs estão claros, úteis e sem dados sensíveis.
- [ ] n8n e Frontend continuam operando normalmente.

---

# 🎯 OBJETIVO FINAL DA FASE 6-UPGRADE

Ao final desta fase, o Educare+ terá:

- um RAG mais inteligente, segmentado e relevante,
- controle fino sobre fallback na base antiga,
- observabilidade mínima para medir a qualidade,
- base técnica pronta para, em uma próxima fase futura, desligar gradualmente a dependência da base legada, módulo por módulo, de forma segura.