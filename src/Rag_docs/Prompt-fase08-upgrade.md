# FASE 8-UPGRADE — TRANSIÇÃO PROGRESSIVA PARA A BASE SEGMENTADA E DESLIGAMENTO CONTROLADO DA BASE LEGADA

## Objetivo
Realizar a transição do RAG do Educare+ para operar **totalmente nas bases segmentadas** (`kb_baby`, `kb_mother`, `kb_professional`), desligando a dependência da base legado de forma:

- gradual  
- monitorada  
- reversível  
- sem impacto no usuário  
- sem risco para o backend  
- sem interferir nas rotas existentes  
- sem comprometer ingestões anteriores  

Nesta fase, o RAG passa a depender QUASE totalmente das bases segmentadas, porém a base legado continua disponível como salvaguarda.

---

# 🔒 REGRA DE SEGURANÇA

Você (Replit) deve:

- manter fallback legado ativo internamente,
- garantir que a desativação do fallback seja **configurável** por ambiente,
- permitir rollback instantâneo,
- nunca deletar ou sobrescrever dados da base legado,
- nunca alterar endpoints públicos.

---

# 🧱 1. IMPLEMENTAR FLAGS DE CONTROLE DE MIGRAÇÃO

Criar no `.env`:

USE_LEGACY_FALLBACK_FOR_BABY=true
USE_LEGACY_FALLBACK_FOR_MOTHER=true
USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=true

Essas flags controlam:

- se o módulo deve usar fallback na base legada,
- se a base legada deve ser consultada em caso de baixa relevância.

Regra:

- `true` → comportamento atual (fallback habilitado)
- `false` → módulo usa apenas sua base segmentada

Importante:  
Nenhuma mudança ocorre para o usuário se as flags permanecerem como `true`.

---

# 🧩 2. ALTERAR O RAG PARA SUPORTAR MODO "STRICT" (SEM LEGACY)

No `ragService`, implementar:

```ts
if (!useLegacyFallbackForModule(moduleType)) {
    // Operação ONLY segmentada
    return querySegmentedKB(moduleType)
        || generateLowConfidenceAnswer()
}

Regras:
  1.	Não consultar a base legado se a flag estiver false.
  2.	Se a base segmentada não retornar nada:
  •	usar mensagem de fallback amigável, mas nunca quebrar o fluxo.

Exemplo:

“Ainda estou aprendendo sobre este tema específico.
Continue me enviando mais perguntas!”

  3.	Em nenhum caso causar crash.

⸻

🧠 3. CRITÉRIOS PARA DESLIGAR A BASE LEGADA POR MÓDULO

O Replit deve medir previamente:
  •	qualidade do ranking,
  •	volume de documentos segmentados,
  •	diversidade de conteúdo na categoria,
  •	relevância mínima alcançada (>0.75, recomendável),
  •	ausência de respostas vazias.

Somente quando esses critérios forem alcançados para um módulo (ex.: bebê), você poderá:

USE_LEGACY_FALLBACK_FOR_BABY=false

E isso DEVE ser feito apenas em ambiente de teste primeiro.

⸻

📊 4. MONITORAMENTO E TELEMETRIA

Adicionar logs para medir performance do módulo sem fallback:
  •	quantas queries retornaram vazio,
  •	média de scores,
  •	base utilizada (segmented-only),
  •	tempo de execução.

Se os logs mostrarem baixa qualidade, reativar fallback apenas ajustando .env.

Nenhum código adicional precisa ser alterado.

⸻

🔁 5. FLUXO DE DESLIGAMENTO PROGRESSIVO POR MÓDULO

O Replit deve permitir desligamento em ordem:
  1.	Módulo Bebê
(normalmente tem mais conteúdo e melhor estruturação)
  2.	Módulo Mãe
  3.	Módulo Profissional
(possui conteúdo técnico e detalhado, exige mais verificação)

Procedimento:
  •	desligar fallback para um único módulo por vez,
  •	observar métricas por 48–72 horas de uso real,
  •	validar com logs,
  •	só então desligar o próximo.

⸻

🧷 6. MANTER A BASE LEGADA DISPONÍVEL (NÃO APAGAR)

Durante toda a fase 8:
  •	NUNCA deletar a base legado,
  •	NUNCA truncar,
  •	NUNCA remover ingestão simultânea.

A tabela legada deve existir como:
  •	backup semântico,
  •	referência histórica,
  •	fonte de remigração caso necessário.

⸻

🛡️ 7. CHECKLIST OBRIGATÓRIO

Antes de desligar fallback para qualquer módulo:
  •	As bases segmentadas já estão com volume suficiente de dados.
  •	Migração da base legado já preencheu boa parte dos documentos.
  •	O ranking segmentado está funcionando bem.
  •	Logs mostram relevância satisfatória.
  •	Nenhuma resposta crítica está sendo perdida.
  •	Flags foram testadas em ambiente de desenvolvimento.
  •	Rollback via .env está funcionando.

⸻

🎯 OBJETIVO FINAL DA FASE 8-UPGRADE

Ao final desta fase, o Educare+ terá:
  •	um RAG totalmente segmentado,
  •	fallback desligável por módulo,
  •	capacidade de operar 100% nas bases novas,
  •	zero dependência estrutural da base legado,
  •	possibilidade segura de aposentadoria futura da base antiga,
  •	máxima qualidade por categoria (bebê, mãe, profissional).

A base legado SÓ será removida na Fase 9-UPGRADE, quando todas as métricas confirmarem maturidade total.