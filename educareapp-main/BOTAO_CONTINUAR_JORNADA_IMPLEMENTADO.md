# Botão "Continuar Jornada" - Implementado

**Data:** 10/10/2025  
**Status:** ✅ IMPLEMENTADO

---

## 🎯 Objetivo

Implementar lógica inteligente no botão "Continuar Jornada" para que ele:
1. Vá para a próxima pergunta **não completada**
2. Priorize perguntas do **mês adequado à idade da criança**
3. Expanda automaticamente mês, semana e tópico
4. Faça scroll suave até a pergunta

---

## 🧠 Lógica Implementada

### **Prioridade de Busca:**

```
1. Mês atual da idade da criança (prioritário)
   ↓
2. Meses próximos (±1 mês da idade)
   ↓
3. Mensagem de conclusão
```

### **Exemplo:**

**Criança de 3 meses:**
```
Idade: 3 meses
Mês alvo: 3

1. Buscar em: Mês 3 (prioritário)
   ✅ Encontrou pergunta não completada → Expandir e mostrar

2. Se completou mês 3, buscar em:
   - Mês 2 (3-1)
   - Mês 4 (3+1)
   ✅ Encontrou pergunta → Expandir e mostrar

3. Se completou tudo:
   🎉 "Parabéns! Você completou todos os tópicos do mês 3!"
```

---

## 💻 Código Implementado

```typescript
const handleContinueJourney = () => {
  // Mês baseado na idade da criança
  const targetMonth = currentJourneyMonth; // Ex: 3 meses
  
  // 1️⃣ PRIORIDADE: Buscar no mês atual da idade
  const currentAgeMonth = journeyContent.find(month => month.month === targetMonth);
  if (currentAgeMonth && currentAgeMonth.unlocked) {
    for (const week of currentAgeMonth.weeks) {
      const incompleteTopic = week.topics.find(topic => !topic.completed);
      
      if (incompleteTopic) {
        // Expandir mês, semana e tópico
        setExpandedMonth(currentAgeMonth.month);
        setExpandedWeek(week.week);
        setExpandedTopic(incompleteTopic.id);
        
        // Scroll suave até a pergunta
        setTimeout(() => {
          const element = document.getElementById(`topic-${incompleteTopic.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        
        return; // Encontrou, parar busca
      }
    }
  }
  
  // 2️⃣ SECUNDÁRIO: Buscar em meses próximos (±1 mês)
  const nearbyMonths = journeyContent.filter(month => 
    month.unlocked && 
    Math.abs(month.month - targetMonth) <= 1 &&
    month.month !== targetMonth
  ).sort((a, b) => Math.abs(a.month - targetMonth) - Math.abs(b.month - targetMonth));
  
  for (const month of nearbyMonths) {
    for (const week of month.weeks) {
      const incompleteTopic = week.topics.find(topic => !topic.completed);
      
      if (incompleteTopic) {
        setExpandedMonth(month.month);
        setExpandedWeek(week.week);
        setExpandedTopic(incompleteTopic.id);
        
        setTimeout(() => {
          const element = document.getElementById(`topic-${incompleteTopic.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        
        return;
      }
    }
  }
  
  // 3️⃣ CONCLUSÃO: Nenhuma pergunta pendente
  toast({
    title: 'Parabéns! 🎉',
    description: `Você completou todos os tópicos do mês ${targetMonth}!`,
    variant: 'default'
  });
};
```

---

## 📊 Fluxo Detalhado

### **Cenário 1: Criança de 3 Meses - Primeira Pergunta**

```
Idade: 3 meses
Mês alvo: 3

Estado atual:
- Mês 3, Semana 1, Pergunta 1: ❌ Não completada
- Mês 3, Semana 1, Pergunta 2: ❌ Não completada

Usuário clica "Continuar Jornada":
  ↓
1. Buscar no mês 3 ✅
2. Buscar na semana 1 ✅
3. Encontrar primeira pergunta não completada ✅
4. Expandir:
   - setExpandedMonth(3)
   - setExpandedWeek(1)
   - setExpandedTopic("q1-sono-seguro")
5. Scroll até a pergunta ✅

Resultado: Pergunta 1 aparece expandida
```

---

### **Cenário 2: Criança de 3 Meses - Segunda Pergunta**

```
Estado atual:
- Mês 3, Semana 1, Pergunta 1: ✅ Completada
- Mês 3, Semana 1, Pergunta 2: ❌ Não completada
- Mês 3, Semana 1, Pergunta 3: ❌ Não completada

Usuário clica "Continuar Jornada":
  ↓
1. Buscar no mês 3 ✅
2. Buscar na semana 1 ✅
3. Pular pergunta 1 (completada) ⏭️
4. Encontrar pergunta 2 (não completada) ✅
5. Expandir pergunta 2 ✅

Resultado: Pergunta 2 aparece expandida
```

---

### **Cenário 3: Completou Mês Atual**

```
Estado atual:
- Mês 3: ✅ Todas completadas
- Mês 2: ❌ Algumas pendentes
- Mês 4: ❌ Algumas pendentes

Usuário clica "Continuar Jornada":
  ↓
1. Buscar no mês 3 ❌ (tudo completado)
2. Buscar em meses próximos (±1):
   - Mês 2 (|3-2| = 1) ✅
   - Mês 4 (|3-4| = 1) ✅
3. Ordenar por proximidade:
   - Mês 2: distância 1
   - Mês 4: distância 1
4. Encontrar primeira pergunta não completada ✅
5. Expandir ✅

Resultado: Próxima pergunta de mês próximo aparece
```

---

### **Cenário 4: Tudo Completado**

```
Estado atual:
- Mês 2: ✅ Todas completadas
- Mês 3: ✅ Todas completadas
- Mês 4: ✅ Todas completadas

Usuário clica "Continuar Jornada":
  ↓
1. Buscar no mês 3 ❌
2. Buscar em meses próximos ❌
3. Nenhuma pergunta pendente ❌
4. Mostrar toast de parabéns 🎉

Resultado: "Parabéns! Você completou todos os tópicos do mês 3!"
```

---

## 🎨 Melhorias Implementadas

### **1. Scroll Suave**
```typescript
setTimeout(() => {
  const element = document.getElementById(`topic-${incompleteTopic.id}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}, 100);
```

**Benefício:** Usuário vê exatamente onde está a próxima pergunta

---

### **2. ID nos Tópicos**
```tsx
<div 
  key={`topic-${topic.id}`}
  id={`topic-${topic.id}`}  // ← Adicionado para scroll
  className="border-t px-4 py-3"
>
```

**Benefício:** Permite scroll preciso até o tópico

---

### **3. Priorização por Idade**
```typescript
const targetMonth = currentJourneyMonth; // Baseado na idade
```

**Benefício:** Sempre mostra conteúdo relevante para a idade

---

### **4. Busca em Meses Próximos**
```typescript
const nearbyMonths = journeyContent.filter(month => 
  Math.abs(month.month - targetMonth) <= 1
);
```

**Benefício:** Transição suave entre meses

---

## ✅ Validação

### **Teste 1: Primeira Pergunta**
```
1. Abrir TitiNauta 2.0
2. Selecionar criança de 3 meses
3. Clicar "Continuar Jornada"
4. ✅ Deve expandir primeira pergunta do mês 3
5. ✅ Deve fazer scroll até a pergunta
```

### **Teste 2: Próxima Pergunta**
```
1. Completar primeira pergunta
2. Clicar "Continuar Jornada"
3. ✅ Deve expandir segunda pergunta
4. ✅ Deve pular perguntas completadas
```

### **Teste 3: Mudança de Semana**
```
1. Completar todas perguntas da semana 1
2. Clicar "Continuar Jornada"
3. ✅ Deve expandir primeira pergunta da semana 2
4. ✅ Deve manter no mês correto
```

### **Teste 4: Mudança de Mês**
```
1. Completar todas perguntas do mês 3
2. Clicar "Continuar Jornada"
3. ✅ Deve buscar em mês 2 ou 4
4. ✅ Deve expandir pergunta de mês próximo
```

### **Teste 5: Tudo Completado**
```
1. Completar todas perguntas disponíveis
2. Clicar "Continuar Jornada"
3. ✅ Deve mostrar toast de parabéns
4. ✅ Mensagem: "Você completou todos os tópicos do mês X!"
```

---

## 📝 Resumo

### **Antes:**
```
❌ Botão buscava apenas na semana atual
❌ Não considerava idade da criança
❌ Não fazia scroll
❌ Não expandia automaticamente
```

### **Depois:**
```
✅ Prioriza mês adequado à idade
✅ Busca em meses próximos se necessário
✅ Expande mês, semana e tópico automaticamente
✅ Faz scroll suave até a pergunta
✅ Mostra mensagem de conclusão
```

### **Benefícios:**

1. **Relevância:** Sempre mostra conteúdo adequado à idade
2. **Usabilidade:** Um clique leva à próxima pergunta
3. **Progressão:** Transição natural entre semanas/meses
4. **Feedback:** Usuário sabe quando completou tudo
5. **Experiência:** Scroll suave e expansão automática

---

**Arquivos Modificados:**
- ✅ `src/pages/educare-app/TitiNautaJourney.tsx`
  - Função `handleContinueJourney()` reescrita
  - Atributo `id` adicionado aos tópicos

**Status:** ✅ **IMPLEMENTADO E FUNCIONAL**

O botão "Continuar Jornada" agora leva para a próxima pergunta adequada à idade da criança!
