# Mapa de Estados Conversacionais – Educare App (WhatsApp)

**Canal:** WhatsApp (Evolution API)  
**Orquestração:** n8n  
**Assistentes:**  
- TitiNauta – Desenvolvimento Infantil  
- TitiNauta – Saúde da Mulher  

Este documento define a **máquina de estados conversacionais** do Educare App, alinhada **explicitamente ao fluxo existente no n8n** (Educare app-chat, Lead CRM e Sub-fluxos), servindo como referência direta para implementação com *Switch Nodes*, *Routers* e *guardrails*.

---

## 1. Princípios do Mapa de Estados

1. O **estado não é a conversa**, é o **modo operacional** da conversa.
2. A **LLM conversa dentro de um estado**, mas **não decide o estado**.
3. O **n8n controla transições**, com base em:
   - intenção
   - contexto ativo (bebê | mãe)
   - ações explícitas do usuário (botões / escolhas)
4. Estados devem ser:
   - poucos
   - claros
   - persistidos

---

## 2. Estados Principais (Visão Geral)

[ENTRY]
↓
[CONTEXT_SELECTION]
↓
[FREE_CONVERSATION]
↓
┌───────────────┬───────────────┬────────────────┐
│               │               │                │
[CONTENT_FLOW] [QUIZ_FLOW]   [LOG_FLOW]       [SUPPORT]
│               │               │                │
└───────┬───────┴───────┬───────┴───────┬────────┘
↓               ↓               ↓
[FEEDBACK]        [PAUSE]          [EXIT]

---

## 3. Definição dos Estados (Detalhado)

---

### STATE 00 — `ENTRY`

**Descrição**  
Ponto único de entrada do fluxo conversacional.

**Onde ocorre no n8n**  
Webhook / Start node do **Educare app-chat**

**Responsabilidades**
- Validar origem (WhatsApp / Chatwoot)
- Ignorar mensagens do próprio bot
- Carregar estado salvo do usuário
- Carregar contexto ativo (se existir)

**Transições**
- Novo usuário → `CONTEXT_SELECTION`
- Usuário conhecido → estado salvo ou `FREE_CONVERSATION`

---

### STATE 01 — `CONTEXT_SELECTION`

**Descrição**  
Define **sobre quem o usuário deseja falar**.

**UX**

Sobre o que você quer falar agora? 💬

1️⃣ Sobre seu bebê 👶
2️⃣ Sobre você 💚

**Ações**
- Persistir:
  - `active_context = child | mother`
- Persistir estado

**Transições**
- Escolha feita → `FREE_CONVERSATION`

---

### STATE 02 — `FREE_CONVERSATION`

**Descrição**  
Estado padrão de conversa livre.

**Aqui acontece**
- Uso da **API RAG**
- Uso da **memória vetorial**
- Perguntas abertas
- Orientações espontâneas

**Regras**
- Se intenção clara → ir direto à rota correspondente
- Se intenção vaga → exibir menu contextual

**Transições possíveis**
- Conteúdo semanal → `CONTENT_FLOW`
- Quiz → `QUIZ_FLOW`
- Registro/log → `LOG_FLOW`
- Pergunta livre → continua em `FREE_CONVERSATION`
- Suporte → `SUPPORT`
- Voltar depois → `PAUSE`

---

### STATE 03 — `CONTENT_FLOW`

**Descrição**  
Execução da **Jornada de Conteúdos Sequenciais**.

**APIs envolvidas**
- `API Child Content` (bebê)
- `API Mother Content` (mãe)

**Responsabilidades**
- Identificar semana da jornada
- Retornar conteúdo correspondente
- Oferecer CTA (quiz / continuar / sair)

**Transições**
- Quiz sugerido → `QUIZ_FLOW`
- Voltar → `FREE_CONVERSATION`
- Voltar mais tarde → `PAUSE`

---

### STATE 04 — `QUIZ_FLOW`

**Descrição**  
Execução estruturada de quizzes.

**APIs envolvidas**
- API de Quiz (bebê ou mãe)

**Subestado implícito**
- `QUIZ_WAITING_ANSWER`

**Responsabilidades**
- Enviar pergunta
- Esperar resposta (botão/lista)
- Registrar resposta no banco
- Enviar feedback curto

**Transições**
- Próxima pergunta → `QUIZ_FLOW`
- Fim do quiz → `FEEDBACK`
- Saída antecipada → `PAUSE`

---

### STATE 05 — `LOG_FLOW`

**Descrição**  
Registro ou consulta de dados estruturados.

**APIs envolvidas**
- `API Biometrics`
- `API Sleep Log`
- `API Vaccines`

**Responsabilidades**
- Coletar dados
- Registrar ou consultar
- Retornar feedback simples (sem LLM)

**Transições**
- Concluído → `FREE_CONVERSATION`
- Voltar depois → `PAUSE`

---

### STATE 06 — `SUPPORT`

**Descrição**  
Reporte de problemas ou sugestões.

**UX**

Quer me contar o que aconteceu? 🛠️

**Responsabilidades**
- Capturar texto livre
- Registrar:
  - tipo (problema | sugestão)
  - estado
  - contexto ativo
- Confirmar recebimento

**Transições**
- Concluído → `FREE_CONVERSATION`
- Encerrar → `EXIT`

---

### STATE 07 — `FEEDBACK`

**Descrição**  
Coleta de satisfação do usuário.

**Trigger**
- Final de quiz
- Saída da jornada
- Ação “Voltar mais tarde”

**UX**

Como foi sua experiência até agora? ⭐

**Responsabilidades**
- Registrar nota (1–5)
- Associar a:
  - estado
  - assistente ativo
  - etapa da jornada

**Transições**
- Após resposta → `FREE_CONVERSATION` ou `EXIT`

---

### STATE 08 — `PAUSE`

**Descrição**  
Usuário decide sair temporariamente.

**UX**

Tudo bem 💙
Quando quiser, é só me chamar.

**Responsabilidades**
- Persistir estado atual
- Opcionalmente disparar `FEEDBACK`

**Transições**
- Nova mensagem futura → `ENTRY`

---

### STATE 09 — `EXIT`

**Descrição**  
Encerramento suave da interação.

**UX**

Estarei por aqui sempre que precisar 🌷

**Transições**
- Nova mensagem → `ENTRY`

---

## 4. Estado Persistido (Modelo Conceitual)

```json
{
  "phone": "551199999999",
  "state": "FREE_CONVERSATION",
  "active_context": "child",
  "last_interaction": "timestamp"
}


⸻

5. Regras de Ouro
  1.	Nunca trocar assistente sem trocar contexto
  2.	Nunca acionar LLM para log estruturado
  3.	Menu é fallback, não padrão
  4.	Estado organiza, LLM conversa, UX acolhe

⸻

6. Objetivo Final do Mapa

Garantir que o Educare App funcione como:
  •	um sistema conversacional previsível
  •	humano para o usuário
  •	controlável tecnicamente
  •	escalável sem caos

⸻

Documento pronto para implementação direta no n8n usando Switch Nodes, Routers e persistência leve de estado.