# FASE 4-UPGRADE — INTEGRAÇÃO GRADUAL DA INGESTÃO COM AS NOVAS BASES VETORIAIS (SEM QUEBRAR O RAG ATUAL)
## Objetivo: Conectar o PIPELINE DE INGESTÃO (Super Admin / backend) às novas tabelas vetoriais
`kb_baby`, `kb_mother`, `kb_professional`, de forma GRADUAL, SEGURA e RETROCOMPATÍVEL,
mantendo o RAG atual funcionando exatamente como está (base antiga), enquanto preenchemos as novas bases.

---

# 🔒 REGRA DE SEGURANÇA GERAL

Nesta fase você (Replit) PODE:

- criar novas funções/métodos/serviços para ingestão segmentada,
- estender o endpoint de ingestão JÁ EXISTENTE de forma retrocompatível,
- criar um NOVO endpoint de ingestão segmentada, se isso for mais seguro,
- começar a popular as novas tabelas vetoriais com os documentos que forem sendo ingeridos a partir de agora.

Você NÃO PODE:

- alterar o comportamento atual da ingestão já em produção (ou seja, o que hoje grava na base vetorial antiga),
- parar de gravar na tabela vetorial antiga (ela deve continuar sendo alimentada por enquanto),
- alterar o comportamento do RAG (ele continua usando a base antiga nesta fase),
- quebrar o fluxo de upload de documentos do Super Admin,
- quebrar qualquer rota consumida pelo n8n.

Nesta fase, o foco é: **ingestão dupla / paralela** (base antiga + novas bases segmentadas).

---

# ✅ 1. PRE-VALIDAÇÃO OBRIGATÓRIA

Antes de mudar qualquer endpoint, você deve:

1. Relembrar qual é o endpoint de ingestão atual:
   - método (POST /admin/knowledge/upload, ou similar),
   - payload atual,
   - fluxo: upload → extração → embedding → insert na tabela vetorial antiga.

2. Identificar:
   - onde o pipeline de ingestão é implementado (service/middleware/controller),
   - quais funções hoje:
     - fazem chunking,
     - chamam a LLM/embedding API,
     - fazem o insert na tabela antiga.

3. Anotar (internamente) QUAL é a melhor forma de estender o fluxo:
   - **Opção A:** adicionar campo opcional `knowledge_category` no payload (baby/mother/professional) e tratar no mesmo endpoint.
   - **Opção B:** criar um endpoint novo, ex.: `/admin/knowledge/upload-segmented`, apenas para o fluxo novo.

Você deve escolher a opção de MENOR IMPACTO e MAIOR SEGURANÇA, seguindo o padrão do backend atual.

---

# 🧩 2. DEFINIÇÃO DO NOVO CONTRATO DE INGESTÃO (BACKEND)

Você deve ajustar o backend para que o endpoint de ingestão aceite, OPCIONALMENTE, um campo que indique o tipo de conhecimento.

Sugestão de payload estendido:

```json
{
  "file": "<arquivo PDF / texto / etc.>",
  "title": "Guia de Sono do Bebê de 6 meses",
  "description": "Conteúdo sobre rotina de sono saudável",
  "knowledge_category": "baby",           // "baby" | "mother" | "professional"
  "age_range": "6-9m",                    // opcional, útil para kb_baby
  "domain": "sono",                       // opcional (motor, linguagem, emocional, etc.)
  "tags": ["sono", "rotina"]
}

Regras:
  •	Se knowledge_category NÃO vier:
➜ o comportamento atual deve se manter (gravar apenas na base vetorial antiga).
  •	Se knowledge_category vier preenchido:
➜ você deve:
  1.	manter comportamento antigo (continuar gravando na tabela vetorial atual),
  2.	ALÉM DISSO, gravar também na tabela segmentada correspondente:
  •	"baby" → kb_baby
  •	"mother" → kb_mother
  •	"professional" → kb_professional

⸻

🧠 3. IMPLEMENTAR FUNÇÕES DE INGESTÃO SEGMENTADA (BACKEND)

Usando os repositories/models criados na Fase 3-UPGRADE, você deve:
  1.	Criar um serviço intermediário, por exemplo:
  •	KnowledgeIngestionService ou estender o existente, com métodos:
  •	ingestToLegacyBase(...)           → mantém ingestão antiga
  •	ingestToBabyKnowledgeBase(...)
  •	ingestToMotherKnowledgeBase(...)
  •	ingestToProfessionalKnowledgeBase(...)
  •	ingestSegmented(payload)         → orquestra as chamadas com base em knowledge_category
  2.	Fluxo para ingestão segmentada:
  •	receber documento (já extraído/validado pelo fluxo atual),
  •	gerar embedding como HOJE é feito,
  •	salvar na tabela antiga (mantendo status quo),
  •	se houver knowledge_category:
  •	montar objeto com campos corretos (title, content, embedding, category, age_range, metadata etc.),
  •	chamar o repositório correspondente (insertBabyDoc, insertMotherDoc ou insertProfessionalDoc).
  3.	Garantir:
  •	qualquer erro ao salvar nas novas tabelas NÃO QUEBRA o fluxo principal,
  •	se a gravação na nova base falhar, o documento continua salvo na base antiga (logar erro, mas não dar crash no fluxo).

⸻

🧪 4. TESTES DO FLUXO DE INGESTÃO APÓS A INTEGRAÇÃO

Você deve testar, pelo menos, os seguintes cenários:

4.1. Ingestão sem knowledge_category (modo antigo)
  •	enviar payload sem knowledge_category,
  •	verificar:
  •	documento salvo na tabela vetorial antiga,
  •	NADA é inserido nas novas tabelas,
  •	comportamento idêntico ao anterior.

4.2. Ingestão com knowledge_category = "baby"
  •	enviar documento com knowledge_category = "baby",
  •	verificar:
  •	documento salvo na tabela vetorial antiga,
  •	um registro correspondente criado em kb_baby,
  •	encoding/embedding preenchido corretamente.

4.3. Ingestão com knowledge_category = "mother"
  •	mesmo teste, validando kb_mother.

4.4. Ingestão com knowledge_category = "professional"
  •	mesmo teste, validando kb_professional.

4.5. Cenário de erro ao gravar na nova base
  •	simular erro (ex.: quebra temporária da conexão de banco para kb_baby),
  •	verificar:
  •	ingestão na base antiga continua funcionando,
  •	API responde sucesso ou, no mínimo, não quebra o backend,
  •	log de erro é registrado com clareza.

⸻

🧷 5. NENHUMA ALTERAÇÃO NO RAG AINDA

Muito importante:
  •	O ragService continua usando SOMENTE a base vetorial antiga para responder perguntas.
  •	Nenhuma query RAG deve ainda apontar para kb_baby, kb_mother ou kb_professional.
  •	O objetivo da Fase 4-UPGRADE é APENAS alimentar as novas bases enquanto o sistema continua funcionando com a base atual.

A troca do mecanismo de consulta será feita apenas em fases posteriores.

⸻

🧭 6. INTEGRAÇÃO FUTURA COM O FRONTEND (Super Admin)

Se o frontend já tiver a tela de ingestão:
  •	nesta fase, você pode:
  •	adicionar, de forma simples, um campo opcional “Categoria do Conhecimento” (dropdown com: bebê, mãe, profissional),
  •	desde que isso NÃO QUEBRE nenhum fluxo atual,
  •	e que seja totalmente opcional (se não preenchido → comportamento antigo).

Se o frontend ainda não estiver pronto para nova categoria:
  •	você pode manter o novo campo apenas a nível de backend por enquanto (por exemplo, usado via ferramentas internas ou testes),
  •	o frontend completo será ajustado com mais cuidado em fase posterior.

⸻

📄 7. DOCUMENTAÇÃO A SER ATUALIZADA

Atualizar:
  •	docs/RAG-EDUCARE.md:
  •	adicionando seção de “Ingestão Segmentada (Fase de Transição)”,
  •	explicando:
  •	novo campo knowledge_category,
  •	efeito dual (base antiga + base segmentada).
  •	docs/ADMIN-PORTAL.md:
  •	se o campo de categoria for exposto no painel.
  •	Qualquer documentação de API:
  •	incluir o novo parâmetro opcional e seu uso recomendado.

⸻

🛡️ 8. CHECKLIST FINAL DA FASE 4-UPGRADE

Antes de finalizar, garantir:
  •	Endpoint de ingestão segue funcionando exatamente como antes quando nenhuma categoria é enviada.
  •	Com knowledge_category preenchido, as novas tabelas (kb_baby, kb_mother, kb_professional) começam a ser preenchidas.
  •	A base vetorial antiga continua sendo alimentada normalmente.
  •	Nenhum método do ragService foi alterado.
  •	Nenhuma rota consumida pelo n8n foi modificada ou quebrada.
  •	Nenhum crash é introduzido.
  •	Logs de ingestão em novas tabelas são claros (sucesso/erro).
  •	Documentação mínima atualizada.

⸻

🎯 OBJETIVO FINAL DA FASE 4-UPGRADE

Ao concluir esta fase, você terá:
  •	pipeline de ingestão ampliado, salvando nas novas bases segmentadas,
  •	nenhuma alteração no comportamento do RAG para o usuário final,
  •	fluxo pronto para, nas próximas fases, comutar o RAG para usar kb_baby, kb_mother e kb_professional de forma segura.

Não altere o mecanismo de consulta do RAG até a próxima fase (5-UPGRADE).

