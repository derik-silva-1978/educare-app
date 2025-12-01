# Lógica de Seleção de Criança e Idade - Implementada

**Data:** 09/10/2025  
**Status:** ✅ IMPLEMENTADO

---

## 🎯 Objetivo

Implementar lógica inteligente no backend para:
1. Identificar automaticamente a criança ativa baseada na idade
2. Filtrar perguntas de acordo com a faixa etária da criança
3. Facilitar integração com bots externos (WhatsApp, Telegram, etc.)

---

## 🚀 Novos Endpoints Criados

### **1. Buscar Criança Ativa Automaticamente**

```http
GET /api/external/users/by-phone/{phone}/active-child
```

**O que faz:**
- Identifica usuário pelo telefone
- Lista todas as crianças
- Calcula idade de cada criança
- Busca progresso de cada criança
- **Seleciona automaticamente a criança mais nova**

**Lógica de Seleção:**
```javascript
if (crianças.length === 1) {
  return única_criança;
} else {
  return criança_mais_nova; // Ordenado por birth_date DESC
}
```

**Exemplo de Requisição:**
```bash
curl -X GET "http://localhost:3001/api/external/users/by-phone/5511999999999/active-child" \
  -H "X-API-Key: educare_external_api_key_2025"
```

**Exemplo de Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "phone": "+5511999999999"
    },
    "total_children": 2,
    "active_child": {
      "id": "child1-uuid",
      "first_name": "Maria",
      "last_name": "Silva",
      "full_name": "Maria Silva",
      "birth_date": "2024-07-15",
      "age_months": 3,
      "age_display": "3 meses",
      "gender": "female",
      "avatar_url": null,
      "progress": {
        "total_questions": 45,
        "answered_questions": 12,
        "unanswered_questions": 33,
        "progress_percentage": 27
      }
    },
    "all_children": [
      {
        "id": "child1-uuid",
        "first_name": "Maria",
        "age_months": 3,
        "progress": { "progress_percentage": 27 }
      },
      {
        "id": "child2-uuid",
        "first_name": "Pedro",
        "age_months": 12,
        "progress": { "progress_percentage": 50 }
      }
    ],
    "selection_logic": "criança mais nova selecionada automaticamente"
  }
}
```

---

### **2. Selecionar Criança Manualmente**

```http
POST /api/external/users/by-phone/{phone}/select-child/{childId}
```

**O que faz:**
- Permite que o usuário escolha uma criança específica
- Valida se a criança pertence ao usuário
- Retorna dados da criança selecionada

**Exemplo de Requisição:**
```bash
curl -X POST "http://localhost:3001/api/external/users/by-phone/5511999999999/select-child/child2-uuid" \
  -H "X-API-Key: educare_external_api_key_2025"
```

**Exemplo de Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "João Silva",
      "phone": "+5511999999999"
    },
    "selected_child": {
      "id": "child2-uuid",
      "first_name": "Pedro",
      "last_name": "Silva",
      "full_name": "Pedro Silva",
      "age_months": 12,
      "age_display": "1 ano"
    }
  },
  "message": "Criança Pedro selecionada com sucesso"
}
```

---

## 🧠 Lógica de Idade Implementada

### **Cálculo Automático de Idade**

```javascript
function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();
  
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                      (today.getMonth() - birth.getMonth());
  
  return ageInMonths;
}
```

### **Filtro de Perguntas por Idade**

```javascript
// Buscar perguntas apropriadas para a idade
const questions = await JourneyQuestion.findAll({
  where: {
    meta_min_months: { [Op.lte]: ageInMonths },  // Idade mínima <= idade da criança
    meta_max_months: { [Op.gte]: ageInMonths }   // Idade máxima >= idade da criança
  }
});
```

**Exemplo:**
```
Criança: 3 meses

Perguntas retornadas:
✅ Sono Seguro (0-6 meses)
✅ Amamentação (0-12 meses)
✅ Banho do Bebê (0-6 meses)
❌ Primeiros Passos (10-14 meses) - NÃO aparece
❌ Alimentação Sólida (6-12 meses) - NÃO aparece
```

### **Formatação de Idade**

```javascript
function formatAge(ageInMonths) {
  if (ageInMonths < 12) {
    return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
  }
  
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  
  if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
  
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
}
```

**Exemplos:**
- 3 meses → "3 meses"
- 12 meses → "1 ano"
- 15 meses → "1 ano e 3 meses"
- 24 meses → "2 anos"
- 27 meses → "2 anos e 3 meses"

---

## 🔄 Fluxo Completo para Bot

### **Cenário 1: Usuário com 1 Criança**

```javascript
// 1. Buscar criança ativa
const response = await fetch(
  `${API}/users/by-phone/${phone}/active-child`,
  { headers: { 'X-API-Key': API_KEY } }
);

const { active_child, selection_logic } = await response.json();

// 2. Usar automaticamente
console.log(selection_logic); // "única criança"
const childId = active_child.id;

// 3. Buscar perguntas (já filtradas pela idade)
const questions = await fetch(
  `${API}/children/${childId}/unanswered-questions`,
  { headers: { 'X-API-Key': API_KEY } }
);
// ✅ Perguntas para 3 meses (idade da Maria)
```

---

### **Cenário 2: Usuário com Múltiplas Crianças**

```javascript
// 1. Buscar criança ativa
const response = await fetch(
  `${API}/users/by-phone/${phone}/active-child`,
  { headers: { 'X-API-Key': API_KEY } }
);

const { active_child, all_children, total_children } = await response.json();

// 2. Usar a mais nova automaticamente
console.log(`Selecionada automaticamente: ${active_child.first_name}`);
let childId = active_child.id;

// 3. OU perguntar ao usuário
if (total_children > 1) {
  const message = `Você tem ${total_children} crianças:\n\n` +
    all_children.map((c, i) => 
      `${i+1}️⃣ ${c.first_name} (${c.age_display}) - ${c.progress.progress_percentage}% completo`
    ).join('\n') +
    `\n\nPor padrão, vamos usar ${active_child.first_name}.\n` +
    `Digite o número para trocar ou "ok" para continuar.`;
  
  await sendMessage(phone, message);
  
  const choice = await waitResponse(phone);
  
  if (choice !== 'ok') {
    const selectedChild = all_children[parseInt(choice) - 1];
    childId = selectedChild.id;
    
    // Confirmar seleção no backend
    await fetch(
      `${API}/users/by-phone/${phone}/select-child/${childId}`,
      {
        method: 'POST',
        headers: { 'X-API-Key': API_KEY }
      }
    );
  }
}

// 4. Buscar perguntas (já filtradas pela idade da criança selecionada)
const questions = await fetch(
  `${API}/children/${childId}/unanswered-questions`,
  { headers: { 'X-API-Key': API_KEY } }
);
```

---

## 📊 Exemplo Real Completo

### **Dados:**
```
Usuário: João Silva
Telefone: +5511999999999

Crianças:
1. Maria (3 meses) - 27% completo
2. Pedro (12 meses) - 50% completo
```

### **Conversa do Bot:**

```
[Usuário envia mensagem]
Usuário: Oi

[Bot busca criança ativa]
Bot: Olá João! 👋

Você tem 2 crianças cadastradas:
1️⃣ Maria (3 meses) - 27% completo
2️⃣ Pedro (1 ano) - 50% completo

Por padrão, vamos responder perguntas sobre Maria (mais nova).
Digite o número para trocar ou "ok" para continuar.

Usuário: ok

Bot: ✅ Vamos responder sobre Maria!

[Bot busca perguntas para Maria - 3 meses]
Bot: 📋 Sono Seguro

O bebê dorme de barriga para cima?

1️⃣ Não
2️⃣ Às vezes
3️⃣ Sim

Usuário: 3

[Bot salva resposta para Maria]
Bot: ✅ Ótimo! Você está seguindo as recomendações de sono seguro.

📊 Progresso de Maria: 31% (14/45 perguntas)

Digite "próxima" para continuar ou "trocar" para mudar de criança.

Usuário: trocar

Bot: Qual criança?
1️⃣ Maria (3 meses)
2️⃣ Pedro (1 ano)

Usuário: 2

[Bot seleciona Pedro]
Bot: ✅ Pedro selecionado!

[Bot busca perguntas para Pedro - 12 meses]
Bot: 📋 Primeiros Passos

O bebê já consegue dar alguns passos sozinho?

1️⃣ Não
2️⃣ Às vezes
3️⃣ Sim

[Perguntas diferentes porque Pedro tem 12 meses!]
```

---

## ✅ Garantias Implementadas

### **1. Idade Sempre Atualizada**
```javascript
// Idade calculada em tempo real
const today = new Date();
const ageInMonths = calculateAge(child.birth_date);
```

### **2. Perguntas Sempre Apropriadas**
```javascript
// Filtro automático por idade
where: {
  meta_min_months: { [Op.lte]: ageInMonths },
  meta_max_months: { [Op.gte]: ageInMonths }
}
```

### **3. Progresso Isolado por Criança**
```javascript
// Respostas vinculadas à criança específica
await JourneyBotResponse.create({
  child_id: childId,  // ← Cada criança tem suas próprias respostas
  question_id: questionId,
  answer: answer
});
```

### **4. Seleção Inteligente**
```javascript
// Prioridade: criança mais nova
children.sort((a, b) => 
  new Date(b.birth_date) - new Date(a.birth_date)
);
const activeChild = children[0];
```

---

## 🧪 Como Testar

### **Teste 1: Buscar Criança Ativa**
```bash
curl -X GET "http://localhost:3001/api/external/users/by-phone/5511999999999/active-child" \
  -H "X-API-Key: educare_external_api_key_2025"
```

**Verificar:**
- ✅ Retorna criança mais nova
- ✅ Calcula idade corretamente
- ✅ Mostra progresso de cada criança
- ✅ Lista todas as crianças

### **Teste 2: Selecionar Criança Manualmente**
```bash
curl -X POST "http://localhost:3001/api/external/users/by-phone/5511999999999/select-child/CHILD_ID" \
  -H "X-API-Key: educare_external_api_key_2025"
```

**Verificar:**
- ✅ Valida se criança pertence ao usuário
- ✅ Retorna dados da criança selecionada

### **Teste 3: Perguntas Filtradas por Idade**
```bash
# Buscar perguntas para criança de 3 meses
curl -X GET "http://localhost:3001/api/external/children/CHILD_ID/unanswered-questions" \
  -H "X-API-Key: educare_external_api_key_2025"
```

**Verificar:**
- ✅ Apenas perguntas para 0-6 meses aparecem
- ✅ Perguntas de 6+ meses NÃO aparecem

---

## 📝 Resumo

### ✅ **O que foi Implementado**

1. **Endpoint de Criança Ativa**
   - Identifica automaticamente a criança mais nova
   - Calcula idade em tempo real
   - Mostra progresso de todas as crianças

2. **Endpoint de Seleção Manual**
   - Permite trocar de criança
   - Valida permissões

3. **Lógica de Idade**
   - Cálculo automático de idade em meses
   - Formatação legível (ex: "1 ano e 3 meses")
   - Filtro de perguntas por faixa etária

4. **Garantias**
   - Perguntas sempre apropriadas para a idade
   - Progresso isolado por criança
   - Respostas vinculadas corretamente

### 🎯 **Benefícios**

- ✅ Bot não precisa implementar lógica complexa
- ✅ Seleção automática inteligente
- ✅ Perguntas sempre apropriadas
- ✅ Fácil trocar de criança
- ✅ Progresso individual por criança

---

**Status:** ✅ **IMPLEMENTADO E TESTADO**
