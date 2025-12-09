# FASE 6 — PROMPT PARA O REPLIT (BACKEND)
## Objetivo: Finalizar o ciclo de implementação do RAG do Educare App
### Nesta fase você vai:
- consolidar tudo que foi feito nas fases 2–5,
- garantir qualidade (QA básico),
- amarrar pontos de integração (inclusive com n8n, se necessário),
- revisar segurança,
- organizar documentação final,
- deixar o sistema pronto para uso controlado (beta / produção).

⚠️ IMPORTANTE  
Nada nesta fase deve:
- quebrar fluxos antigos,
- alterar estrutura de tabelas existentes,
- remover funcionalidades já em produção.

---

# ✔️ 1. REVISÃO GERAL DO CÓDIGO DO RAG

Faça uma revisão técnica dos módulos criados nas fases anteriores:

- `fileSearchService`
- `ragService`
- `babyContextService`
- `cacheService`
- `usageGuardService`
- `sanitizeUserPrompt` (ou equivalente)
- rotas `/admin/knowledge/upload` e `/rag/ask`

Verifique:

1. Padrão de nomes (seguindo convenção do projeto).
2. Organização de imports e exports.
3. Tratamento de erros — se há try/catch suficientes e logs adequados.
4. Se todos os módulos novos estão isolados e não poluem código antigo.
5. Se há duplicação de lógica que pode ser refatorada sem risco.

Se encontrar problemas pequenos (nome, formatação, duplicação), ajuste.  
Não faça refatorações grandes ou arriscadas nesta fase.

---

# ✔️ 2. TESTES INTEGRADOS BÁSICOS (E2E SIMPLES)

Implemente ou rode **testes manuais ou automatizados** para os seguintes fluxos:

## 2.1. Fluxo de ingestão (Super Admin)

Cenário de teste:

1. Autenticar como Super Admin.
2. Enviar `POST /admin/knowledge/upload` com:
   - PDF válido,
   - metadados mínimos (title, source_type, age_range, domain).
3. Esperar:
   - status de sucesso (2xx),
   - registro criado em `knowledge_documents`,
   - `file_search_id` preenchido,
   - nenhum erro em log crítico.

## 2.2. Fluxo de pergunta genérica RAG (sem bebê)

Opcionalmente, testar `/rag/ask` com:

- uma pergunta simples,
- filtros básicos (age_range, domain),
- sem `baby_id` (caso tenha um modo genérico).

Esperar:

- resposta coerente,
- sem crash,
- log de RAG executado.

## 2.3. Fluxo de pergunta personalizada (com `baby_id`)

Cenário de teste:

1. Escolher um `baby_id` real de teste.
2. Enviar `POST /rag/ask` com:
   - `baby_id`,
   - `question`,
   - `filters` coerentes com a idade/domínio do bebê.
3. Esperar:
   - resposta que mencione contexto do bebê (idade, marcos, etc.),
   - nenhum crash,
   - logs de:
     - babyContext carregado,
     - File Search chamado,
     - LLM chamado.

---

# ✔️ 3. PONTO DE INTEGRAÇÃO COM n8n (SEM QUEBRAR O FLUXO ATUAL)

Nesta fase, **não é obrigatório alterar o n8n**, mas você deve:

1. Documentar como o n8n pode consumir o endpoint `/rag/ask`:
   - método: `POST`
   - URL (relativa) e parâmetros esperados
   - exemplos de requests/responses
2. Garantir que o endpoint:
   - funcione bem como “caixa preta” para o n8n (entrada → resposta),
   - não dependa de mecanismo de sessão específico do frontend, se isso for um problema para o n8n.

Opcionalmente, se o projeto já tiver um “namespace” de endpoints para o n8n (ex. `/integrations/...`):

- você pode expor uma rota adicional “thin wrapper” para n8n,
  que apenas repassa os campos para `/rag/ask`,
  respeitando o padrão do projeto.

⚠️ Não altere webhooks ou fluxos n8n existentes.  
Apenas dê condições para que, se desejado, o n8n possa consumir o RAG via HTTP.

---

# ✔️ 4. CHECKLIST DE SEGURANÇA E PRIVACIDADE

Revise os pontos a seguir e corrija o que for necessário:

1. **Dados sensíveis do usuário/bebê**:
   - não são enviados diretamente para o LLM (apenas contexto essencial e anonimizado);
   - não há inclusão de informações como CPF, e-mail, telefone, etc. nos prompts.

2. **Perfis e permissões**:
   - `/admin/knowledge/upload` está restrito ao Super Admin/Owner;
   - `/rag/ask` só é acessível por usuários autenticados (conforme o padrão do projeto).

3. **Logs**:
   - não armazenam prompts completos com dados sensíveis;
   - não armazenam respostas que contenham dados pessoais;
   - logam erros de forma útil, mas não vazam detalhes internos (tokens, chaves, stack sensível).

4. **Variáveis de ambiente**:
   - chaves de Gemini e OpenAI não aparecem hardcoded no código;
   - `.env.example` está atualizado.

---

# ✔️ 5. CONSOLIDAR A DOCUMENTAÇÃO TÉCNICA FINAL

No arquivo de documentação principal do RAG (por exemplo `docs/RAG-EDUCARE.md`), garanta que contenha:

## 5.1. Visão Geral
- Objetivo do RAG no Educare App.
- Componentes principais (Postgres, File Search, LLM, backend, n8n).

## 5.2. Fluxos

- Diagrama simples dos fluxos:
  - Ingestão (Super Admin → upload → File Search → knowledge_documents).
  - Pergunta do usuário (frontend / WhatsApp → backend → RAG → resposta).

## 5.3. Endpoints

- `/admin/knowledge/upload`  
  - método, parâmetros, autenticação, exemplos.

- `/rag/ask`  
  - método, parâmetros (`baby_id`, `question`, `filters`), exemplos de uso.

## 5.4. Módulos Internos

- fileSearchService: o que faz, como é chamado.
- ragService: pipeline RAG, ordem das etapas.
- babyContextService: como monta o contexto do bebê.
- cacheService: o que é cacheado, por quanto tempo.
- usageGuardService: limites e política de custo.
- sanitização de prompts: proteção contra injection.

## 5.5. Configuração

- Variáveis de ambiente obrigatórias.
- Modelos LLM suportados.
- Como alternar entre Gemini e OpenAI.

## 5.6. Integração com n8n

- Como o n8n deve chamar o RAG, se for utilizado.
- Exemplo de node HTTP Request chamando `/rag/ask`.

---

# ✔️ 6. MODO “BETA / FEATURE FLAG” (OPCIONAL, MAS RECOMENDADO)

Se o projeto já possuir algum mecanismo de **feature flag** ou configuração por ambiente:

- Adicionar uma flag para ativar/desativar o RAG (ex.: `ENABLE_EDUCARE_RAG` no `.env`).
- No endpoint `/rag/ask`, antes de rodar a lógica, verificar:
  - se a flag está ativa;
  - se não estiver, retornar uma mensagem controlada tipo:
    - `"O assistente avançado do Educare ainda não está disponível neste ambiente."`

Isso permite:

- ativar RAG primeiro em ambiente de teste;
- ativar para grupo pequeno de usuários;
- desativar rapidamente em caso de problemas.

---

# ✔️ 7. PASSO FINAL: MINI-RELATÓRIO DE ESTADO

Ao concluir a Fase 6, gere (em comentário ou arquivo simples texto/MD) um mini-relatório contendo:

- Versão do código (commit ou data/hora).
- Lista dos endpoints novos/alterados.
- Confirmação de que:
  - ingestão funciona,
  - RAG funciona com bebê,
  - logs são gerados,
  - não há crashes nos testes básicos.

Esse relatório será usado pelo responsável (owner) para validar a entrega e planejar próximos passos.

---

# ⚠️ REGRAS DA FASE 6

- Não alterar esquemas de tabelas antigas.
- Não remover funcionalidades existentes.
- Não fazer “grandes refactors” em código legado.
- Qualquer ajuste deve ser incremental e seguro.
- Tudo que for mudado, deve ser refletido na documentação.

---

# 📌 SAÍDA ESPERADA DA FASE 6

- Sistema RAG funcional, personalizado e estável.
- Ingestão protegida via Super Admin.
- Endpoint `/rag/ask` pronto para uso pelo frontend e n8n.
- Mecanismos de cache, fallback, usage guarding e sanitização em funcionamento.
- Documentação consolidada, permitindo que qualquer dev entenda e evolua a solução.
- Nenhum crash introduzido no backend existente.