# FASE 7-UPGRADE — MIGRAÇÃO ASSISTIDA DA BASE LEGADO PARA AS BASES SEGMENTADAS (SEM APAGAR NADA)
## Objetivo: Criar um processo SEGURO, RASTREÁVEL E REVERSÍVEL para migrar os documentos da
BASE VETORIAL LEGADA para as três novas bases segmentadas:
- `kb_baby`
- `kb_mother`
- `kb_professional`

Usando:
- regras determinísticas (quando possível),
- classificação assistida por LLM (quando necessário),
- logs de auditoria,
- NENHUMA exclusão da base legado nesta fase.

---

# 🔒 REGRA MÁXIMA DE SEGURANÇA

Nesta fase você (Replit) PODE:
- ler da base legada em BATCHES,
- classificar documentos (baby/mother/professional),
- inserir cópias nas novas tabelas segmentadas,
- registrar logs detalhados da migração,
- criar scripts de migração (CLI, job, endpoint protegido).

Você NÃO PODE:
- deletar registros da base legada,
- truncar ou dropar a tabela legada,
- sobrescrever dados na base legada,
- interromper o funcionamento do RAG atual,
- bloquear leitura da base legada por tempo prolongado.

---

# ✅ 1. PRE-VALIDAÇÃO OBRIGATÓRIA

Antes de começar a migração, você deve:

1. Identificar a **tabela vetorial legada** usada hoje pelo RAG:
   - nome da tabela,
   - campos relevantes (`id`, `title`, `content`, `embedding`, `metadata`, etc.).

2. Verificar:
   - volume aproximado de documentos,
   - se há metadados que já sinalizam tipo de conteúdo:
     - tags (ex.: “bebê”, “mãe”, “profissional”),
     - campos de fonte,
     - nome do arquivo original (PDF, etc.),
     - campos de categoria.

3. Confirmar:
   - tipos dos campos,
   - como o embedding está armazenado (mantendo compatibilidade).

Nenhuma operação de escrita deve ser feita na base legada nesse momento.

---

# 🧱 2. CRIAR TABELA DE AUDITORIA DE MIGRAÇÃO

Você deve criar (via migration) uma tabela **exclusiva de auditoria**, por exemplo:

`kb_migration_audit`

Campos sugeridos:

- `id` (uuid, PK)
- `legacy_id` (id do documento na tabela antiga)
- `target_kb` (text: `kb_baby`, `kb_mother`, `kb_professional`, `skip`, `unknown`)
- `classification_method` (text: `rule_based`, `llm_assisted`, `manual`)
- `status` (text: `pending`, `migrated`, `error`, `skipped`)
- `error_message` (text, opcional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Regras:
- Nenhuma FK obrigatória para evitar bloqueios.
- Essa tabela serve para rastrear tudo o que foi tentado migrar.

---

# 🧠 3. DEFINIR E IMPLEMENTAR O CLASSIFICADOR DE DOCUMENTOS

Você deve criar um módulo de classificação, por exemplo:

`KnowledgeClassifierService`

### 3.1. Entrada:
- Documento da base legada:
  - `title`
  - `content` (ou resumo/chunk relevante)
  - `metadata` (se existir)

### 3.2. Saída:
- `target_kb`:
  - `"baby"` → `kb_baby`
  - `"mother"` → `kb_mother`
  - `"professional"` → `kb_professional`
  - `"skip"` ou `"unknown"` se não for possível classificar com segurança
- campos opcionais:
  - `age_range` (ex.: `"0-3m"`, `"6-9m"`)
  - `domain` / `category` (ex.: `"sono"`, `"motor"`, `"saude_mental"`, `"PEI"`)
  - `classification_method`

### 3.3. Estratégia recomendada:

1. **Regras determinísticas (rule-based)**:
   - Usar palavras-chave e metadados:
     - se título/conteúdo tem “bebê”, “0-2 meses”, “primeira infância”, etc. → `baby`
     - se fala de “puérpera”, “mãe”, “amamentação da mãe”, “pós-parto” → `mother`
     - se fala de “PEI”, “intervenção pedagógica”, “anamnese profissional”, “plano educacional individualizado” → `professional`
   - Essas regras devem ser simples e bem comentadas.

2. **Classificação assistida por LLM (llm-assisted)** (opcional, se já houver essa infra):
   - Quando as regras não forem suficientes:
     - enviar um resumo do conteúdo à LLM (Gemini/OpenAI),
     - pedir classificação: `baby`, `mother`, `professional`, `unknown`,
     - registrar `classification_method = "llm_assisted"`.

3. **Casos sem confiança suficiente**:
   - marcar como `target_kb = "unknown"` ou `status = "skipped"`,
   - NUNCA excluir, apenas registrar.

---

# 🧩 4. CRIAR SCRIPT / JOB DE MIGRAÇÃO EM BATCHES

Você deve criar um componente para rodar a migração de forma incremental, por exemplo:

- script CLI (`node migrateLegacyKb.js`),
- job interno disparado manualmente,
- endpoint extremamente protegido (apenas para uso técnico).

### 4.1. Comportamento do job:

Para cada execução:

1. Buscar um lote (batch) de documentos da base legada **ainda não migrados**:
   - exemplo: 50 ou 100 por rodada.

2. Para cada documento do lote:
   - Verificar se já existe registro correspondente em `kb_migration_audit`:
     - se sim, pular (evita duplicar esforço).
   - Classificar com o `KnowledgeClassifierService`.
   - Se `target_kb` ∈ {`baby`, `mother`, `professional`}:
     - montar payload compatível com a tabela segmentada:
       - `title`, `content`, `embedding` (pode ser reaproveitado se compatível),
       - `category`/`domain`/`age_range`/`metadata`,
     - inserir na tabela segmentada correta (`kb_baby` ou `kb_mother` ou `kb_professional`).
     - criar registro em `kb_migration_audit` com:
       - `status = "migrated"`,
       - `target_kb` preenchido.
   - Se `target_kb = "unknown"` ou `skip`:
     - registrar em `kb_migration_audit` com:
       - `status = "skipped"` ou `"pending_manual"`,
       - `error_message`/comentário se necessário.
   - Em caso de erro (ex.: falha de inserção):
     - registrar `status = "error"` e `error_message`.

3. Repetir o processo até o batch ser concluído.

### 4.2. Requisitos:

- job deve ser idempotente (pode ser rodado várias vezes sem duplicar migração),
- não bloquear a aplicação principal,
- usar transações em pequenas unidades (quando possível),
- evitar leituras que travem a tabela legada (usar índices, limites e paginação).

---

# 🔁 5. MANUTENÇÃO DA BASE LEGADA DURANTE E APÓS A MIGRAÇÃO

Nesta fase:

- A base legada continua sendo:
  - consumida pelo RAG como fallback,
  - alimentada pelas ingestões (até decisão futura).
- Os dados migrados ficam duplicados:
  - 1 cópia na tabela legada,
  - 1 cópia em `kb_baby` / `kb_mother` / `kb_professional`.

⚠️ Nenhuma ação de limpeza, exclusão ou desligamento deve ser feita neste momento.

---

# 🧪 6. TESTES DA MIGRAÇÃO

Você deve testar:

### 6.1. Migração de lote pequeno (modo “dry-run” conceitual)
- Rodar o job com 5–10 documentos,
- Conferir:
  - se as classificações fazem sentido,
  - se os registros aparecem na tabela correta,
  - se a tabela `kb_migration_audit` foi preenchida corretamente.

### 6.2. Operação contínua
- Rodar mais alguns batches,
- Garantir que:
  - documentos não são duplicados,
  - status é atualizado corretamente,
  - logs são gerados sem dados sensíveis.

### 6.3. Cenários de erro
- Simular:
  - falha ao gravar em `kb_baby` (por exemplo, inserção inválida),
  - resposta improvável da LLM (se usada),
- Confirmar que:
  - o processo registra `status = "error"`,
  - o job não crasha,
  - os demais documentos do batch seguem sendo processados.

---

# 📊 7. LOGS E MONITORAMENTO

Você deve adicionar logs (ou métricas simples) como:

- total de documentos migrados com sucesso,
- total de documentos por `target_kb`,
- total de erros,
- total de skipped/unknown.

Esses dados servirão para você:

- estimar a qualidade da classificação,
- entender quanto da base legado já está coberta pelas bases segmentadas,
- planejar uma futura fase de desligamento seleto da base antiga.

---

# 📄 8. DOCUMENTAÇÃO A SER ATUALIZADA

Atualizar ou criar:

- `docs/RAG-EDUCARE-MIGRATION.md`:
  - explicando:
    - como funciona a migração,
    - como rodar o job,
    - o papel da `kb_migration_audit`,
    - a política de NÃO exclusão da base legado.

- `docs/DATABASE.md`:
  - adicionando a tabela `kb_migration_audit`.

---

# 🛡️ 9. CHECKLIST FINAL DA FASE 7-UPGRADE

Antes de finalizar a fase:

- [ ] Tabela `kb_migration_audit` criada e funcional.
- [ ] Classificador (`KnowledgeClassifierService`) implementado.
- [ ] Job/script de migração em batch implementado.
- [ ] Inserções nas tabelas segmentadas funcionando.
- [ ] Nenhuma exclusão na base legada.
- [ ] RAG continua funcionando normalmente.
- [ ] Logs indicam estado da migração.
- [ ] Processo de migração é idempotente e seguro.

---

# 🎯 OBJETIVO FINAL DA FASE 7-UPGRADE

Ao final desta fase, você terá:

- uma **base segmentada preenchida também com parte do conteúdo legado**,
- um **pipeline de migração que pode continuar rodando conforme você desejar**,
- uma **trilha de auditoria completa**,
- e **zero risco de perda de dados**, com a base legado preservada.

Fases futuras poderão, com base em métricas e confiança, **reduzir gradualmente o uso da base legada**, módulo por módulo, de forma planejada.