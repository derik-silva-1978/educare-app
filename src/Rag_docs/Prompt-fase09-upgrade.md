# FASE 09-UPGRADE — APOSENTADORIA DEFINITIVA DA BASE LEGADO (LEGACY KB SHUTDOWN)

## Objetivo
Concluir a migração total para o RAG segmentado (`kb_baby`, `kb_mother`, `kb_professional`), removendo o uso ativo da base legado, **mas seguindo práticas de desligamento empresarial**, assegurando:

- nenhuma regressão,
- zero impacto no usuário,
- preservação histórica da base vetorial antiga,
- reversibilidade total via backup,
- documentação completa do processo,
- estabilidade antes, durante e depois da remoção.

A meta desta fase é:  
👉 Desligar a base legado **somente depois que todas as validações da Fase 8 forem completadas com sucesso**.

---

# 🔒 1. CONDIÇÃO OBRIGATÓRIA PARA INICIAR A FASE 09

O Replit só pode executar esta fase se:

USE_LEGACY_FALLBACK_FOR_BABY=false
USE_LEGACY_FALLBACK_FOR_MOTHER=false
USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=false

E todas as métricas indicarem:

- score médio dos retornos > 0.75  
- taxa de respostas vazias = 0%  
- ausência total de erros silenciosos  
- experiência do usuário estável por pelo menos 7 dias  
- logs confirmam que a base legado não foi utilizada em nenhuma consulta

Se qualquer condição falhar → **NÃO prosseguir**.

---

# 📦 2. CRIAÇÃO DE BACKUP IMUTÁVEL DA BASE LEGADO (OBRIGATÓRIO)

Antes de qualquer alteração, o Replit deve:

### 🔹 2.1 Gerar backup completo da tabela legado
Formato preferencial:

- `.sql` (dump completo)
- `.jsonl` (caso utilize inspeção manual futura)
- `.csv` (caso haja análise externa)

O backup deve ser armazenado em:

/backups/rag_legacy/YYYY-MM-DD/

Esse arquivo será usado caso:

- um rollback seja necessário,
- novas features exijam reprocessamento histórico,
- seja detectado qualquer problema após desligamento.

---

# 🧹 3. DESATIVAÇÃO LÓGICA DA BASE LEGADO (SEM APAGAR TABELA)

Nesta fase, o Replit **não remove nem altera dados** da base legado.  
Ele apenas impede seu uso **no RAG ativo**.

### Etapas:

1. Remover a base legado da camada de consulta do RAG.  
2. Atualizar o `KnowledgeBaseSelector` para nunca enviar queries para a base legado.  
3. Garantir que o serviço de fallback também ignore completamente a base legado.  
4. Atualizar logs para indicar que a base legado está “inactive”.

O comportamento ideal:

- A tabela legado permanece *existente*, mas nunca é usada.
- Tudo funciona apenas nas novas KBs segmentadas.

---

# 🗃️ 4. ATUALIZAÇÃO DO SCHEMA PARA PREVENIR NOVAS INGESTÕES NA TABELA LEGADO

Implementar proteção contra ingestão acidental:

- Adicionar ao código regra explícita:

```ts
if (target === 'legacy') {
   throw new Error("Ingestão na base legado está desativada permanentemente.");
}

  •	Remover a base legado das opções do painel de ingestão, caso ela apareça.

Assim, tudo novo passa EXCLUSIVAMENTE por:
  •	kb_baby
  •	kb_mother
  •	kb_professional

⸻

🧪 5. TESTES AUTOMÁTICOS DE CONSISTÊNCIA PÓS-DESLIGAMENTO

O Replit deve executar testes como:

✔ 5.1 Teste de Resposta

Para cada módulo, test cases devem confirmar:
  •	consultas variadas retornam resultados segmentados,
  •	não existe consulta à base legado (log deve registrar “legacy inactive”).

✔ 5.2 Teste de Estresse

Rodar 100+ queries de cada módulo:
  •	validar score médio,
  •	verificar estabilidade do tempo de resposta.

✔ 5.3 Teste de Regressão

Comparar respostas atuais com o histórico recente:
  •	nenhuma piora perceptível,
  •	consistência nas respostas do módulo Bebê,
  •	consistência nas respostas do módulo Mãe,
  •	consistência nas respostas do módulo Profissional.

Se qualquer teste falhar → rollback necessário (ver seção 7).

⸻

📉 6. DESLIGAMENTO ESTRUTURAL (PHASED OUT)

A tabela legado ainda NÃO deve ser apagada nesta fase, mas o código deve:
  •	deixar claro que a base legado está em modo deprecated,
  •	remover rotas internas que chamavam a base legado,
  •	registrar desativação nos logs de inicialização do servidor.

Um exemplo de log:

[RAG] Legacy knowledge base is now inactive. All modules operating under segmented KB mode.


⸻

🔁 7. MECANISMO DE ROLLBACK (OBRIGATÓRIO)

O Replit deve implementar rollback completo e seguro — sem modificar código fixo — apenas alterando o .env:

USE_LEGACY_FALLBACK_FOR_BABY=true
USE_LEGACY_FALLBACK_FOR_MOTHER=true
USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=true

O sistema deve:
  •	religar automaticamente a camada de fallback,
  •	continuar funcionando mesmo sem reinicialização manual,
  •	não quebrar ingestões segmentadas existentes.

⸻

📘 8. DOCUMENTAÇÃO FINAL OBRIGATÓRIA

O Replit deve gerar um arquivo chamado:

Rag_docs/Legacy_shutdown_report.md

Incluindo:
  •	data do desligamento
  •	status dos três módulos
  •	histórico de métricas
  •	links para backups gerados
  •	validações executadas
  •	testes de consistência
  •	instrução de rollback
  •	confirmação final: “legacy fully deprecated”

⸻

🎯 RESULTADO ESPERADO DA FASE 09-UPGRADE

Ao concluir esta fase:
  •	o Educare+ terá migrado 100% para as bases segmentadas,
  •	a base legado estará totalmente desligada, mas preservada como backup,
  •	o RAG terá estabilidade certificada,
  •	a experiência do usuário ficará totalmente sob a nova arquitetura,
  •	o sistema estará pronto para evoluções avançadas (Fase 10+).

---