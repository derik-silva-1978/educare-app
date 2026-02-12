Perfeito. Abaixo está o PROMPT MESTRE PARA O REPLIT, 100% em .md, escrito para execução real, assumindo explicitamente que:
  •     o Replit tem acesso ao MCP do n8n
  •     o Replit consegue ler, entender e modificar fluxos existentes
  •     o Replit possui skills de n8n, WhatsApp (Evolution API) e ElevenLabs
  •     o Replit deve decidir tecnicamente como implementar, sem overengineering
  •     o Replit deve respeitar integralmente os fluxos já existentes

Este prompt é o documento final de handoff entre produto → execução.

⸻


# PROMPT MESTRE – Replit (MCP n8n)  
**Projeto:** Educare App – Evolução dos Fluxos Conversacionais WhatsApp  
**Responsável pela Execução:** Replit (com acesso MCP ao n8n)

---

## 1. Missão

Você é responsável por **evoluir os fluxos existentes do Educare App no n8n**, garantindo uma experiência conversacional **humana, previsível, multimodal e escalável** no WhatsApp, **sem quebrar o que já funciona**.

Seu papel **não é reescrever tudo**, mas:
- entender profundamente os fluxos atuais
- respeitar a arquitetura existente
- aplicar melhorias incrementais
- usar seus skills e o MCP do n8n sempre que necessário

---

## 2. Contexto Obrigatório

### 2.1 Fluxos Existentes (baseline)

Você deve **ler e compreender integralmente** os seguintes fluxos no MCP do n8n:

1. **Educare app-chat**  
   Fluxo principal de entrada e orquestração conversacional.

2. **Lead CRM (Sub-flow)**  
   Registro e enriquecimento de usuários.

3. **SUB | Inactive User Reactivation (WhatsApp + Stripe + PG Memory)**  
   Reengajamento e uso inicial de memória persistente.

⚠️ **Esses fluxos não devem ser quebrados.**  
Qualquer melhoria deve ser compatível com eles.

---

## 3. Diretrizes de Execução (críticas)

### 3.1 Use o MCP do n8n
- Explore os fluxos existentes
- Reutilize nós, padrões e rotas já implementadas
- Não duplique lógica sem necessidade

### 3.2 Não faça overengineering
- Prefira soluções simples
- Estados leves
- Persistência mínima necessária
- Sem microserviços extras se não forem indispensáveis

### 3.3 Respeite separação de responsabilidades
- n8n decide **estado, fluxo e APIs**
- LLM responde **dentro do contexto**
- UX é aplicada **após a resposta do LLM**

---

## 4. Arquitetura Conceitual a Respeitar

WhatsApp
→ Evolution API
→ n8n (Educare app-chat)
→ Guardrails
→ Buffer de Mensagens
→ Classificação de Intenção
→ Seleção de Contexto (Bebê | Mãe)
→ Roteamento por Estado
→ APIs (Conteúdo / Quiz / Logs / RAG)
→ Persistência
→ Resposta Multimodal (Texto / Áudio)

---

## 5. Estados Conversacionais (obrigatório implementar)

Implemente os estados conforme o documento **Mapa de Estados Conversacionais** já fornecido:

- ENTRY
- **ONBOARDING** ← NOVO (primeira interação, coleta nome/gênero/nascimento do bebê)
- CONTEXT_SELECTION
- FREE_CONVERSATION
- CONTENT_FLOW
- QUIZ_FLOW
- LOG_FLOW
- SUPPORT
- FEEDBACK
- PAUSE
- EXIT

📌 Estados devem ser:
- persistidos por usuário
- consultados no início de cada interação
- controlados pelo n8n (Switch / Router nodes)

📌 **ONBOARDING** possui sub-estados:
- `ASKING_NAME` — texto livre, min 2 chars
- `ASKING_GENDER` — botões interativos (👦 Menino / 👧 Menina)
- `ASKING_BIRTHDATE` — texto livre, formato DD/MM/AAAA
- Dados salvos: `baby_name`, `baby_gender`, `baby_birthdate`
- Transição: onboarding completo → `CONTEXT_SELECTION`

---

## 6. Contexto Ativo (decisão fora da LLM)

Você deve garantir que **antes de chamar qualquer API**, exista um valor claro de:

active_context = “child” | “mother”

Regras:
- Child Content → apenas jornada do bebê
- Mother Content → apenas jornada da mãe
- Logs → não usam LLM
- API RAG → recebe explicitamente o contexto

⚠️ **A LLM não decide sozinha sobre quem está falando.**

---

## 7. API RAG (Assistentes TitiNauta)

Existe **uma única API RAG**, que internamente possui:

- TitiNauta – Desenvolvimento Infantil
- TitiNauta – Saúde da Mulher

Você deve:
- chamar a mesma API
- passar o `active_context`
- permitir que a API selecione prompt e base RAG corretos

---

## 8. Memória Longa Vetorial

Implemente (ou estenda) memória vetorial para:

- interações livres
- respostas relevantes do assistente
- contexto emocional e temático

Use a memória:
- antes de chamar a API RAG
- para personalizar respostas
- para recomendações futuras

⚠️ Logs estruturados (sono, biometria, vacinas) **não** devem ir para a memória vetorial.

---

## 9. Buffer de Mensagens Fragmentadas

Implemente um buffer simples por usuário:

- TTL: 10–15 segundos
- concatenação de mensagens sucessivas
- só acionar APIs quando:
  - intenção clara
  - texto suficiente

Fallback UX para mensagens curtas deve seguir o documento de UX.

---

## 10. UX Conversacional (obrigatório respeitar)

Você deve implementar a experiência conforme o documento:

**UX Design Conversacional – WhatsApp**

Inclui:
- mensagens padrão
- botões
- listas
- emojis
- feedback
- menus contextuais

Regras:
- Menu é fallback, não padrão
- Máx. 3–4 botões por mensagem
- Emojis sempre com função
- Nunca linguagem técnica

---

## 11. WhatsApp (Evolution API)

Use sempre que possível:
- `interactive.buttons` — para 2-3 opções (formato flat v2: `buttons[].displayText`)
- `interactive.list` — **NOVO** para 4+ opções (menus contextuais com seções)
- `media.image` — **NOVO** para relatórios visuais (imagem PNG gerada)

### 11.1 List Messages (Novo)

Usar para menus com múltiplas opções organizadas em seções:

```json
{
  "number": "phone",
  "listMessage": {
    "title": "Título",
    "description": "Descrição",
    "buttonText": "Ver opções",
    "footerText": "Educare+ • TitiNauta 🚀",
    "sections": [{ "title": "Seção", "rows": [{ "title": "Opção", "description": "Desc", "rowId": "id" }] }]
  }
}
```

### 11.2 Relatório Visual (Novo)

Enviar imagem PNG do relatório de desenvolvimento:
- Gerada por `reportImageService.js` usando `canvas` (node-canvas)
- Endpoint: `GET /api/conversation/report-image/:phone`
- Fallback: barras ASCII em texto (████░░░░ 50%)

Fallback automático para texto simples caso:
- botões não sejam suportados
- erro de envio

---

## 12. Quiz no WhatsApp

- Usar botões para múltipla escolha
- Payloads limpos e normalizados
- Registrar resposta no banco
- Confirmar registro ao usuário

---

## 13. Feedback de Experiência (UX Loop)

Implemente:
- Enquete de 1–5 estrelas
- Disparo contextual:
  - “Voltar mais tarde”
  - fim de quiz
  - saída da jornada

Persistir:
- score
- estado
- assistente ativo
- etapa da jornada

---

## 14. Reporte de Problemas e Sugestões

- Implementar fluxo simples
- Texto livre
- Registro com contexto
- Confirmação humanizada

---

## 15. Multimodal (ElevenLabs)

Use ElevenLabs para:
- respostas relevantes
- feedback emocional
- orientações sensíveis

Regras:
- cache por hash do texto
- fallback para texto
- preferência do usuário persistida

---

## 16. Observabilidade e Segurança

Implemente ou preserve:
- correlationId por conversa
- logs estruturados
- bloqueio de mensagens do próprio bot
- guardrails por número / instância

---

## 17. Critérios de Aceite (Atualizado)

Considere a missão concluída quando:

- Estados conversacionais funcionam corretamente
- **ONBOARDING coleta nome, gênero e nascimento do bebê**
- **Dados do bebê personalizam todas as respostas**
- Contexto ativo nunca é ambíguo
- RAG responde com histórico e personalização
- Quiz e logs persistem corretamente
- UX no WhatsApp é fluida e humana
- **List Messages funcionam para menus com 4+ opções**
- **Relatório visual é gerado como imagem PNG e enviado no WhatsApp**
- **Barras ASCII de fallback são formatadas corretamente**
- Feedback do usuário é coletado
- Nenhum fluxo existente foi quebrado

---

## 18. Regra Final

> **Respeite o que já existe.  
> Evolua com intenção.  
> Priorize clareza, não complexidade.**

---

**Este prompt é a instrução mestra de execução.  
Use seu acesso ao MCP do n8n e suas skills sempre que necessário.**
⸻