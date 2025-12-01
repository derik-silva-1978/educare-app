# Análise - Quizzes no TitiNauta 2.0

**Data:** 10/10/2025  
**Status:** ⚠️ NECESSITA IMPLEMENTAÇÃO

---

## 🔍 Situação Atual

### **Problema Identificado:**
O TitiNauta 2.0 (`TitiNautaJourney.tsx`) **NÃO está exibindo quizzes** dentro das etapas da jornada.

---

## 📊 Análise Técnica

### **1. Modelos de Dados**

#### **JourneyBotQuestion** (Usado atualmente)
```javascript
// educare-backend/src/models/JourneyBotQuestion.js
{
  id, meta_title, meta_min_months, meta_max_months,
  week, week_title, week_description,
  domain_name, domain_question, domain_importance,
  domain_feedback_1, domain_feedback_2, domain_feedback_3,
  domain_activities, domain_alert_missing,
  // ❌ NÃO TEM CAMPOS DE QUIZ
}
```

#### **JourneyV2Quiz** (Existe mas não é usado)
```javascript
// educare-backend/src/models/JourneyV2Quiz.js
{
  id, week_id, domain, domain_id,
  title, question,
  options: JSONB,      // ✅ Opções de resposta
  feedback: JSONB,     // ✅ Feedback por opção
  knowledge: JSONB     // ✅ Conhecimento adicional
}
```

---

### **2. Estrutura Atual vs Necessária**

#### **Atual (SEM Quiz):**
```
Mês 1
  └─ Semana 1
      ├─ Tópico 1: Sono Seguro
      ├─ Tópico 2: Amamentação
      └─ Tópico 3: Banho
      ❌ SEM QUIZ
```

#### **Necessário (COM Quiz):**
```
Mês 1
  └─ Semana 1
      ├─ Tópico 1: Sono Seguro
      ├─ Tópico 2: Amamentação
      ├─ Tópico 3: Banho
      └─ ✅ Quiz da Semana
          ├─ Pergunta 1: Sono
          ├─ Pergunta 2: Alimentação
          └─ Pergunta 3: Higiene
```

---

## 🎯 Soluções Possíveis

### **Opção 1: Adicionar Campos de Quiz ao JourneyBotQuestion**

**Vantagens:**
- ✅ Mantém tudo em uma tabela
- ✅ Mais simples de consultar
- ✅ Não precisa JOIN

**Desvantagens:**
- ❌ Mistura conceitos (pergunta vs quiz)
- ❌ Campos podem ficar vazios
- ❌ Menos flexível

**Implementação:**
```sql
ALTER TABLE journey_bot_questions ADD COLUMN quiz_question TEXT;
ALTER TABLE journey_bot_questions ADD COLUMN quiz_options JSONB;
ALTER TABLE journey_bot_questions ADD COLUMN quiz_correct_answer TEXT;
ALTER TABLE journey_bot_questions ADD COLUMN quiz_feedback JSONB;
```

---

### **Opção 2: Usar JourneyV2Quiz (RECOMENDADO)**

**Vantagens:**
- ✅ Separação de responsabilidades
- ✅ Estrutura já existe
- ✅ Mais flexível e escalável
- ✅ Suporta múltiplos quizzes por semana

**Desvantagens:**
- ⚠️ Precisa fazer JOIN
- ⚠️ Mais complexo de implementar

**Implementação:**
```javascript
// 1. Backend: Criar endpoint para buscar quizzes
GET /api/journey-questions/week/{weekNumber}/quizzes?age_months=3

// 2. Frontend: Buscar quizzes junto com perguntas
const { questions, quizzes } = useTitiNautaJourneyQuestions({
  childAgeInMonths: ageInMonths
});

// 3. Renderizar quizzes após tópicos da semana
{week.topics.map(...)}
{week.quizzes.map(...)}
```

---

### **Opção 3: Criar Tabela Intermediária**

**Vantagens:**
- ✅ Máxima flexibilidade
- ✅ Pode vincular quiz a múltiplas semanas

**Desvantagens:**
- ❌ Mais complexo
- ❌ Mais tabelas para gerenciar

---

## 💡 Recomendação: Opção 2

### **Por quê?**
1. Estrutura já existe (`JourneyV2Quiz`)
2. Separação clara de responsabilidades
3. Escalável para futuras features
4. Alinhado com arquitetura existente

---

## 🚀 Implementação Recomendada

### **1. Backend - Criar Endpoint de Quizzes**

```javascript
// educare-backend/src/controllers/journeyQuestionsController.js

exports.getWeekQuizzes = async (req, res) => {
  try {
    const { weekNumber } = req.params;
    const { age_months } = req.query;
    
    // Buscar quizzes da semana para a idade
    const quizzes = await JourneyV2Quiz.findAll({
      include: [{
        model: JourneyV2Week,
        where: {
          week_number: weekNumber,
          min_age_months: { [Op.lte]: age_months },
          max_age_months: { [Op.gte]: age_months }
        }
      }],
      order: [['created_at', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    console.error('Erro ao buscar quizzes:', error);
    return res.status(500).json({ error: 'Erro ao buscar quizzes' });
  }
};
```

**Rota:**
```javascript
// educare-backend/src/routes/journeyQuestionsRoutes.js
router.get('/week/:weekNumber/quizzes', journeyQuestionsController.getWeekQuizzes);
```

---

### **2. Frontend - Hook para Buscar Quizzes**

```typescript
// src/hooks/useTitiNautaJourneyQuizzes.ts

export const useTitiNautaJourneyQuizzes = (weekNumber: number, ageInMonths: number) => {
  const [quizzes, setQuizzes] = useState<JourneyV2Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const response = await httpClient.get(
          `/journey-questions/week/${weekNumber}/quizzes?age_months=${ageInMonths}`
        );
        setQuizzes(response.data);
      } catch (error) {
        console.error('Erro ao buscar quizzes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (weekNumber && ageInMonths) {
      fetchQuizzes();
    }
  }, [weekNumber, ageInMonths]);
  
  return { quizzes, isLoading };
};
```

---

### **3. Frontend - Integrar no TitiNautaJourney**

```typescript
// src/pages/educare-app/TitiNautaJourney.tsx

// Buscar quizzes para cada semana
const weekQuizzes = useMemo(() => {
  const quizzesMap = new Map<number, JourneyV2Quiz[]>();
  
  journeyContent.forEach(month => {
    month.weeks.forEach(week => {
      // Buscar quizzes da semana
      const quizzes = fetchWeekQuizzes(week.week, ageInMonths);
      quizzesMap.set(week.week, quizzes);
    });
  });
  
  return quizzesMap;
}, [journeyContent, ageInMonths]);

// Renderizar quizzes após tópicos
{expandedWeek === week.week && (
  <>
    {/* Tópicos */}
    {week.topics.map(topic => (...))}
    
    {/* Quizzes */}
    {weekQuizzes.get(week.week)?.map(quiz => (
      <div key={quiz.id} className="border-t px-4 py-4 bg-purple-50">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">📝</span>
          <h4 className="font-semibold text-purple-900">{quiz.title}</h4>
        </div>
        
        <p className="text-gray-700 mb-4">{quiz.question}</p>
        
        {/* Opções de resposta */}
        <div className="space-y-2">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleQuizAnswer(quiz.id, option.id)}
              className="w-full text-left p-3 border rounded-lg hover:bg-purple-100"
            >
              {option.text}
            </button>
          ))}
        </div>
        
        {/* Feedback após resposta */}
        {quizAnswers[quiz.id] && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              {quiz.feedback[quizAnswers[quiz.id]]}
            </p>
          </div>
        )}
      </div>
    ))}
  </>
)}
```

---

## 📋 Checklist de Implementação

### **Backend:**
- [ ] Criar endpoint `GET /journey-questions/week/:weekNumber/quizzes`
- [ ] Adicionar relacionamento entre `JourneyV2Week` e `JourneyV2Quiz`
- [ ] Testar endpoint com diferentes idades

### **Frontend:**
- [ ] Criar hook `useTitiNautaJourneyQuizzes`
- [ ] Integrar quizzes no `TitiNautaJourney.tsx`
- [ ] Adicionar UI para exibir quizzes
- [ ] Implementar lógica de resposta de quiz
- [ ] Salvar respostas no backend
- [ ] Mostrar feedback após resposta

### **Dados:**
- [ ] Popular tabela `journey_v2_quizzes` com quizzes de exemplo
- [ ] Vincular quizzes às semanas corretas
- [ ] Definir opções e feedbacks

---

## 🎨 UI Sugerida para Quiz

```
┌─────────────────────────────────────────┐
│ 📝 Quiz da Semana 1                     │
├─────────────────────────────────────────┤
│                                         │
│ Qual a posição mais segura para o      │
│ bebê dormir?                            │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ○ De barriga para baixo             │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ● De barriga para cima              │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ○ De lado                           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✅ Correto!                         │ │
│ │ Dormir de barriga para cima reduz  │ │
│ │ o risco de morte súbita infantil.  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📊 Exemplo de Dados

### **Quiz na Tabela:**
```json
{
  "id": "quiz-1-week-1",
  "week_id": "week-1-uuid",
  "domain": "baby_domains",
  "domain_id": "sleep",
  "title": "Quiz da Semana 1",
  "question": "Qual a posição mais segura para o bebê dormir?",
  "options": [
    { "id": "a", "text": "De barriga para baixo" },
    { "id": "b", "text": "De barriga para cima" },
    { "id": "c", "text": "De lado" }
  ],
  "feedback": {
    "a": "❌ Incorreto. Dormir de barriga para baixo aumenta o risco de morte súbita.",
    "b": "✅ Correto! Dormir de barriga para cima é a posição mais segura.",
    "c": "⚠️ Parcialmente correto. De lado não é tão seguro quanto de barriga para cima."
  },
  "knowledge": {
    "correct_answer": "b",
    "explanation": "A posição de barriga para cima reduz significativamente o risco de SMSL."
  }
}
```

---

## ✅ Benefícios da Implementação

1. **Engajamento:** Quizzes tornam a jornada mais interativa
2. **Aprendizado:** Reforça conhecimento através de perguntas
3. **Gamificação:** Adiciona elemento de desafio
4. **Feedback:** Usuário aprende com erros e acertos
5. **Progresso:** Pode rastrear conhecimento adquirido

---

## 🎯 Próximos Passos

1. **Decidir abordagem:** Opção 2 (JourneyV2Quiz) recomendada
2. **Implementar backend:** Endpoint de quizzes
3. **Implementar frontend:** Hook e UI
4. **Popular dados:** Criar quizzes de exemplo
5. **Testar:** Validar fluxo completo
6. **Documentar:** Atualizar documentação

---

**Status:** ⚠️ **AGUARDANDO IMPLEMENTAÇÃO**

Os quizzes existem no modelo de dados mas não estão sendo exibidos no TitiNauta 2.0.
