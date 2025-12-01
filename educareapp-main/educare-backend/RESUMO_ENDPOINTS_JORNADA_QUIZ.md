# Resumo - Endpoints de Jornada e Quiz para Integração Externa

**Data:** 09/10/2025  
**Status:** ✅ IMPLEMENTADO

## 🎯 Objetivo

Permitir que ferramentas externas (WhatsApp, Telegram, SMS, etc.) interajam com a jornada do TitiNauta, coletando perguntas não respondidas e salvando respostas.

---

## 📡 Endpoints Criados

### 1. **Buscar Perguntas Não Respondidas**

```http
GET /api/external/children/{childId}/unanswered-questions
```

**O que faz:**
- Busca todas as perguntas da jornada para a idade da criança
- Filtra apenas as que ainda não foram respondidas
- Retorna dados completos de cada pergunta

**Resposta:**
```json
{
  "success": true,
  "data": {
    "child": { "id": "...", "name": "Maria", "age_months": 3 },
    "total_questions": 45,
    "answered_questions": 12,
    "unanswered_questions": 33,
    "questions": [
      {
        "id": "q1-sono-seguro",
        "question_text": "O bebê dorme de barriga para cima?",
        "domain": "Sono Seguro",
        "importance": "...",
        "activities": "...",
        "week": 1,
        "week_title": "Semana 1 - A Chegada",
        "age_range": { "min_months": 0, "max_months": 6 },
        "feedback_options": {
          "positive": "Ótimo!",
          "neutral": "Considere ajustar...",
          "negative": "ALERTA: ..."
        },
        "alert": "Bebês que não dormem de barriga para cima..."
      }
    ]
  }
}
```

---

### 2. **Salvar Resposta**

```http
POST /api/external/children/{childId}/save-answer
```

**Body:**
```json
{
  "question_id": "q1-sono-seguro",
  "answer": 2,
  "answer_text": "Sim, sempre",
  "metadata": {
    "source": "whatsapp",
    "timestamp": "2025-10-09T21:00:00Z"
  }
}
```

**Valores de `answer`:**
- `0` = Negativo (Não)
- `1` = Neutro (Às vezes)
- `2` = Positivo (Sim)

**O que faz:**
- Salva resposta na tabela `journey_bot_responses`
- Atualiza sessão ativa automaticamente
- Retorna confirmação com dados salvos

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "response-uuid",
    "child_id": "...",
    "question_id": "q1-sono-seguro",
    "answer": 2,
    "answer_text": "Sim, sempre",
    "responded_at": "2025-10-09T21:00:00.000Z"
  },
  "message": "Resposta salva com sucesso"
}
```

---

### 3. **Buscar Progresso**

```http
GET /api/external/children/{childId}/progress
```

**O que faz:**
- Calcula total de perguntas para a idade
- Conta quantas já foram respondidas
- Calcula porcentagem de conclusão
- Retorna status da sessão ativa

**Resposta:**
```json
{
  "success": true,
  "data": {
    "child": { "id": "...", "name": "Maria", "age_months": 3 },
    "progress": {
      "total_questions": 45,
      "answered_questions": 12,
      "unanswered_questions": 33,
      "progress_percentage": 27,
      "status": "in_progress"
    },
    "session": {
      "id": "session-uuid",
      "status": "active",
      "started_at": "2025-10-01T10:00:00.000Z",
      "completed_at": null
    }
  }
}
```

---

## 🔐 Autenticação

Todos os endpoints requerem API Key:

```http
X-API-Key: educare_external_api_key_2025
```

---

## 🔄 Fluxo de Uso

```
1. Bot recebe mensagem do usuário
   ↓
2. GET /children/{id}/unanswered-questions
   ↓
3. Bot envia primeira pergunta não respondida
   ↓
4. Usuário responde
   ↓
5. POST /children/{id}/save-answer
   ↓
6. GET /children/{id}/progress
   ↓
7. Bot mostra feedback e progresso
   ↓
8. Repetir (próxima pergunta)
```

---

## 💡 Exemplo Prático - WhatsApp Bot

```javascript
// 1. Buscar perguntas
const questions = await fetch(
  `${API_URL}/children/${childId}/unanswered-questions`,
  { headers: { 'X-API-Key': API_KEY } }
).then(r => r.json());

// 2. Enviar pergunta
const q = questions.data.questions[0];
await sendWhatsApp(userPhone, 
  `📋 ${q.domain}\n\n${q.question_text}\n\n1️⃣ Não\n2️⃣ Às vezes\n3️⃣ Sim`
);

// 3. Receber resposta
onMessage(async (msg) => {
  const answerMap = { '1': 0, '2': 1, '3': 2 };
  const textMap = { '1': 'Não', '2': 'Às vezes', '3': 'Sim' };
  
  // 4. Salvar
  await fetch(
    `${API_URL}/children/${childId}/save-answer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        question_id: q.id,
        answer: answerMap[msg.text],
        answer_text: textMap[msg.text]
      })
    }
  );
  
  // 5. Feedback
  const feedback = q.feedback_options[
    answerMap[msg.text] === 2 ? 'positive' : 
    answerMap[msg.text] === 1 ? 'neutral' : 'negative'
  ];
  await sendWhatsApp(userPhone, feedback);
  
  // 6. Progresso
  const progress = await fetch(
    `${API_URL}/children/${childId}/progress`,
    { headers: { 'X-API-Key': API_KEY } }
  ).then(r => r.json());
  
  await sendWhatsApp(userPhone, 
    `✅ Progresso: ${progress.data.progress.progress_percentage}%`
  );
});
```

---

## 🎯 Casos de Uso

### 1. **Bot do WhatsApp**
- Enviar perguntas diárias
- Coletar respostas via chat
- Fornecer feedback imediato
- Mostrar progresso

### 2. **Bot do Telegram**
- Interface com botões
- Perguntas interativas
- Gamificação com emojis

### 3. **Sistema de SMS**
- Perguntas por SMS
- Respostas por número
- Lembretes automáticos

### 4. **Integração CRM**
- Painel para agentes
- Coletar por telefone
- Relatórios de progresso

### 5. **App Mobile Terceiros**
- Sincronização offline
- Salvar em lote
- Push notifications

---

## 📊 Dados Salvos

**Tabela:** `journey_bot_responses`

```sql
INSERT INTO journey_bot_responses (
  user_id,
  child_id,
  question_id,
  answer,
  answer_text,
  responded_at
) VALUES (
  'user-uuid',
  'child-uuid',
  'q1-sono-seguro',
  2,
  'Sim, sempre',
  NOW()
);
```

---

## ✅ Benefícios

1. **Acessibilidade**
   - Usuários podem responder via WhatsApp
   - Não precisa acessar app/web

2. **Engajamento**
   - Lembretes automáticos
   - Feedback imediato
   - Gamificação

3. **Flexibilidade**
   - Múltiplos canais (WhatsApp, Telegram, SMS)
   - Integração com qualquer ferramenta

4. **Rastreabilidade**
   - Todas as respostas salvas
   - Histórico completo
   - Metadados customizados

5. **Escalabilidade**
   - API RESTful
   - Autenticação segura
   - Fácil integração

---

## 📝 Arquivos Criados/Modificados

### Backend
- ✅ `src/controllers/externalApiController.js`
  - `getUnansweredQuestions()`
  - `saveQuestionAnswer()`
  - `getChildProgress()`

- ✅ `src/routes/externalApiRoutes.js`
  - Rotas adicionadas

### Documentação
- ✅ `API_EXTERNA_JORNADA_QUIZ.md` - Documentação completa
- ✅ `RESUMO_ENDPOINTS_JORNADA_QUIZ.md` - Este resumo

---

## 🧪 Como Testar

### 1. Buscar Perguntas Não Respondidas
```bash
curl -X GET "http://localhost:3001/api/external/children/CHILD_ID/unanswered-questions" \
  -H "X-API-Key: educare_external_api_key_2025"
```

### 2. Salvar Resposta
```bash
curl -X POST "http://localhost:3001/api/external/children/CHILD_ID/save-answer" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: educare_external_api_key_2025" \
  -d '{
    "question_id": "QUESTION_ID",
    "answer": 2,
    "answer_text": "Sim"
  }'
```

### 3. Buscar Progresso
```bash
curl -X GET "http://localhost:3001/api/external/children/CHILD_ID/progress" \
  -H "X-API-Key: educare_external_api_key_2025"
```

---

## 🚀 Próximos Passos (Opcional)

1. **Webhook de Notificações**
   - Notificar quando novas perguntas disponíveis
   - Alertar quando progresso estagnado

2. **Batch Operations**
   - Salvar múltiplas respostas de uma vez
   - Buscar perguntas em lote

3. **Analytics**
   - Endpoint de estatísticas
   - Tempo médio de resposta
   - Taxa de conclusão

4. **Gamificação**
   - Badges por marcos
   - Ranking de progresso
   - Desafios semanais

---

**Status:** ✅ **IMPLEMENTADO E PRONTO PARA USO**

Agora é possível integrar qualquer ferramenta externa (WhatsApp, Telegram, SMS, etc.) com a jornada do TitiNauta!
