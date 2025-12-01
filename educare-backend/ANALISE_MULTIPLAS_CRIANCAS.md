# Análise - Múltiplas Crianças por Usuário

**Data:** 09/10/2025  
**Status:** ⚠️ NECESSITA MELHORIAS

---

## 🔍 Análise da Situação Atual

### **Estrutura do Banco de Dados**

```
User (Pai/Mãe)
  ↓ 1:1
Profile
  ↓ 1:N
Children (Múltiplas Crianças)
```

**Relacionamento:**
- 1 User → 1 Profile
- 1 Profile → N Children (várias crianças)

**Tabelas:**
```sql
users
  ├─ id (UUID)
  └─ ...

profiles
  ├─ id (UUID)
  ├─ userId (FK → users.id)
  └─ ...

children
  ├─ id (UUID)
  ├─ profileId (FK → profiles.id)
  ├─ birth_date
  └─ ...

journey_bot_responses
  ├─ id (UUID)
  ├─ user_id (FK → users.id)
  ├─ child_id (FK → children.id)
  ├─ question_id
  ├─ answer
  └─ ...
```

---

## ✅ O QUE ESTÁ FUNCIONANDO

### **1. Endpoints Atuais Identificam a Criança Corretamente**

Os 3 endpoints criados **JÁ FUNCIONAM** com múltiplas crianças:

#### **GET /children/{childId}/unanswered-questions**
```javascript
// ✅ Recebe childId específico
// ✅ Busca perguntas baseadas na idade DESSA criança
// ✅ Filtra respostas DESSA criança

const child = await Child.findByPk(childId);
const ageInMonths = calculateAge(child.birth_date);

// Busca perguntas para ESSA idade
const questions = await JourneyQuestion.findAll({
  where: {
    meta_min_months: { [Op.lte]: ageInMonths },
    meta_max_months: { [Op.gte]: ageInMonths }
  }
});

// Busca respostas DESSA criança
const answered = await JourneyBotResponse.findAll({
  where: { child_id: childId }
});
```

#### **POST /children/{childId}/save-answer**
```javascript
// ✅ Salva resposta vinculada à criança específica
await JourneyBotResponse.create({
  user_id: userId,
  child_id: childId,  // ← Criança específica
  question_id: question_id,
  answer: answer
});
```

#### **GET /children/{childId}/progress**
```javascript
// ✅ Calcula progresso DESSA criança específica
const progress = await JourneyBotResponse.count({
  where: { child_id: childId }
});
```

---

## ⚠️ O QUE ESTÁ FALTANDO

### **Problema: Como o Bot Sabe Qual Criança Usar?**

Os endpoints atuais **exigem** que você já saiba o `childId`. Mas em um bot do WhatsApp, por exemplo:

```
Usuário: "Oi, quero responder perguntas"
Bot: 🤔 Qual criança? (Precisa descobrir)
```

**Cenários:**

1. **Usuário com 1 criança:**
   - ✅ Fácil: usar a única criança

2. **Usuário com 2+ crianças:**
   - ❌ Problema: Qual criança escolher?
   - ❌ Bot precisa perguntar ao usuário
   - ❌ Não há endpoint para listar crianças do usuário via telefone/CPF

---

## 🚨 PROBLEMAS IDENTIFICADOS

### **1. Falta Endpoint para Identificar Usuário por Telefone/CPF**

**Situação:**
```
Bot WhatsApp recebe mensagem do +5511999999999
Bot precisa descobrir:
  - Quem é o usuário?
  - Quais crianças ele tem?
  - Qual criança está ativa?
```

**Solução Atual:**
```bash
# ✅ JÁ EXISTE!
GET /api/external/users/search/children?phone=5511999999999
```

**Resposta:**
```json
{
  "user": { "id": "...", "name": "João" },
  "children": [
    { "id": "child1", "name": "Maria", "age_months": 3 },
    { "id": "child2", "name": "Pedro", "age_months": 12 }
  ],
  "total_children": 2
}
```

✅ **ESTE ENDPOINT JÁ RESOLVE O PROBLEMA!**

---

### **2. Falta Lógica de Seleção de Criança**

**Cenário:**
```
Usuário tem 3 crianças:
  - Maria (3 meses)
  - Pedro (12 meses)
  - Ana (24 meses)

Bot precisa saber qual criança o usuário quer responder perguntas.
```

**Soluções Possíveis:**

#### **Opção A: Bot Pergunta ao Usuário**
```
Bot: "Você tem 3 crianças cadastradas:
      1️⃣ Maria (3 meses)
      2️⃣ Pedro (12 meses)
      3️⃣ Ana (24 meses)
      
      Para qual criança você quer responder perguntas?"

Usuário: "1"

Bot: [Usa childId da Maria]
```

#### **Opção B: Contexto de Sessão**
```javascript
// Salvar em cache/sessão
const userSession = {
  phone: '+5511999999999',
  userId: 'user-uuid',
  activeChildId: 'child1-uuid',  // ← Criança ativa
  lastInteraction: Date.now()
};
```

#### **Opção C: Criança Mais Nova (Padrão)**
```javascript
// Sempre usar a criança mais nova
const children = await getChildren(userId);
const youngestChild = children.sort((a, b) => 
  new Date(b.birth_date) - new Date(a.birth_date)
)[0];
```

---

## ✅ SOLUÇÃO COMPLETA

### **Fluxo Recomendado para Bot**

```javascript
// 1. Identificar usuário por telefone
const response = await fetch(
  `${API}/users/search/children?phone=${userPhone}`,
  { headers: { 'X-API-Key': API_KEY } }
);
const { user, children } = await response.json();

// 2. Verificar quantas crianças
if (children.length === 0) {
  return sendMessage(phone, "Você ainda não tem crianças cadastradas.");
}

if (children.length === 1) {
  // 3a. Uma criança: usar automaticamente
  const childId = children[0].id;
  await startJourney(childId);
  
} else {
  // 3b. Múltiplas crianças: perguntar ao usuário
  const message = `Você tem ${children.length} crianças:\n\n` +
    children.map((c, i) => 
      `${i+1}️⃣ ${c.first_name} (${c.age_months} meses)`
    ).join('\n') +
    `\n\nPara qual criança você quer responder perguntas?`;
  
  await sendMessage(phone, message);
  
  // Aguardar resposta do usuário
  const choice = await waitForResponse(phone);
  const childId = children[choice - 1].id;
  
  // Salvar em sessão
  await saveSession(phone, { activeChildId: childId });
  
  await startJourney(childId);
}

// 4. Buscar perguntas para a criança selecionada
async function startJourney(childId) {
  const questions = await fetch(
    `${API}/children/${childId}/unanswered-questions`,
    { headers: { 'X-API-Key': API_KEY } }
  );
  
  // Enviar primeira pergunta...
}
```

---

## 📊 Exemplo Completo - Bot WhatsApp

```javascript
const sessions = new Map(); // Cache de sessões

// Receber mensagem
bot.on('message', async (msg) => {
  const phone = msg.from;
  const text = msg.body;
  
  // 1. Buscar ou criar sessão
  let session = sessions.get(phone);
  
  if (!session) {
    // Primeira interação: identificar usuário
    const response = await fetch(
      `${API}/users/search/children?phone=${phone}`,
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    if (!response.ok) {
      return msg.reply("❌ Usuário não encontrado. Cadastre-se primeiro!");
    }
    
    const { user, children } = await response.json();
    
    if (children.length === 0) {
      return msg.reply("Você ainda não tem crianças cadastradas.");
    }
    
    if (children.length === 1) {
      // Uma criança: usar automaticamente
      session = {
        userId: user.id,
        activeChildId: children[0].id,
        childName: children[0].first_name,
        state: 'ready'
      };
      sessions.set(phone, session);
      
      return msg.reply(
        `Olá! Vamos responder perguntas sobre ${session.childName}!\n\n` +
        `Digite "começar" para iniciar.`
      );
      
    } else {
      // Múltiplas crianças: perguntar
      session = {
        userId: user.id,
        children: children,
        state: 'selecting_child'
      };
      sessions.set(phone, session);
      
      const message = `Você tem ${children.length} crianças:\n\n` +
        children.map((c, i) => 
          `${i+1}️⃣ ${c.first_name} (${c.age_months} meses)`
        ).join('\n') +
        `\n\nDigite o número da criança:`;
      
      return msg.reply(message);
    }
  }
  
  // 2. Processar baseado no estado da sessão
  if (session.state === 'selecting_child') {
    const choice = parseInt(text);
    
    if (isNaN(choice) || choice < 1 || choice > session.children.length) {
      return msg.reply("❌ Opção inválida. Digite o número da criança.");
    }
    
    const child = session.children[choice - 1];
    session.activeChildId = child.id;
    session.childName = child.first_name;
    session.state = 'ready';
    
    return msg.reply(
      `✅ Selecionado: ${child.first_name}\n\n` +
      `Digite "começar" para iniciar as perguntas.`
    );
  }
  
  if (session.state === 'ready' && text.toLowerCase() === 'começar') {
    // 3. Buscar perguntas não respondidas
    const response = await fetch(
      `${API}/children/${session.activeChildId}/unanswered-questions`,
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    const { questions } = await response.json();
    
    if (questions.length === 0) {
      return msg.reply("🎉 Parabéns! Todas as perguntas foram respondidas!");
    }
    
    // Enviar primeira pergunta
    const q = questions[0];
    session.currentQuestion = q;
    session.state = 'answering';
    
    return msg.reply(
      `📋 ${q.domain}\n\n` +
      `${q.question_text}\n\n` +
      `1️⃣ Não\n2️⃣ Às vezes\n3️⃣ Sim`
    );
  }
  
  if (session.state === 'answering') {
    const answerMap = { '1': 0, '2': 1, '3': 2 };
    const textMap = { '1': 'Não', '2': 'Às vezes', '3': 'Sim' };
    
    if (!answerMap[text]) {
      return msg.reply("❌ Resposta inválida. Digite 1, 2 ou 3.");
    }
    
    // 4. Salvar resposta
    await fetch(
      `${API}/children/${session.activeChildId}/save-answer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({
          question_id: session.currentQuestion.id,
          answer: answerMap[text],
          answer_text: textMap[text],
          metadata: { source: 'whatsapp', phone }
        })
      }
    );
    
    // 5. Enviar feedback
    const feedback = session.currentQuestion.feedback_options[
      answerMap[text] === 2 ? 'positive' : 
      answerMap[text] === 1 ? 'neutral' : 'negative'
    ];
    
    await msg.reply(`✅ ${feedback}`);
    
    // 6. Buscar progresso
    const progressResponse = await fetch(
      `${API}/children/${session.activeChildId}/progress`,
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    const { progress } = await progressResponse.json();
    
    await msg.reply(
      `📊 Progresso: ${progress.progress_percentage}%\n` +
      `${progress.answered_questions}/${progress.total_questions} perguntas\n\n` +
      `Digite "próxima" para continuar.`
    );
    
    session.state = 'ready';
  }
});
```

---

## 📋 Checklist de Funcionalidades

### ✅ O que JÁ FUNCIONA

- [x] Endpoint para buscar crianças por telefone/CPF
- [x] Endpoint para buscar perguntas não respondidas (por criança)
- [x] Endpoint para salvar resposta (por criança)
- [x] Endpoint para buscar progresso (por criança)
- [x] Perguntas filtradas por idade da criança
- [x] Respostas vinculadas à criança correta
- [x] Suporte a múltiplas crianças por usuário

### ⚠️ O que PRECISA SER IMPLEMENTADO (no Bot)

- [ ] Lógica de seleção de criança (quando múltiplas)
- [ ] Gerenciamento de sessão/contexto
- [ ] Interface de seleção de criança
- [ ] Cache de criança ativa por usuário

### 💡 Melhorias Opcionais (Backend)

- [ ] Endpoint para trocar criança ativa
- [ ] Endpoint para criar sessão com criança
- [ ] Webhook de notificações
- [ ] Analytics por criança

---

## 🎯 CONCLUSÃO

### ✅ **OS ENDPOINTS JÁ FUNCIONAM COM MÚLTIPLAS CRIANÇAS!**

**Pontos Positivos:**
1. ✅ Cada endpoint recebe `childId` específico
2. ✅ Perguntas são filtradas pela idade DA CRIANÇA
3. ✅ Respostas são salvas PARA A CRIANÇA correta
4. ✅ Progresso é calculado POR CRIANÇA
5. ✅ Já existe endpoint para listar crianças do usuário

**O que falta:**
- ⚠️ Lógica de seleção de criança (no lado do BOT)
- ⚠️ Gerenciamento de sessão (no lado do BOT)

**Recomendação:**
- Use o endpoint `/users/search/children` para listar crianças
- Implemente lógica de seleção no bot
- Salve `activeChildId` em sessão/cache
- Use os endpoints existentes com o `childId` correto

---

**Status:** ✅ **BACKEND PRONTO - IMPLEMENTAR LÓGICA NO BOT**
