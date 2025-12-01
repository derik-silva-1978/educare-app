# TitiNauta 2.0 - Análise de Salvamento de Respostas

**Data:** 09/10/2025  
**Status:** ⚠️ PARCIALMENTE IMPLEMENTADO

## 📋 Resumo Executivo

O sistema de salvamento de respostas do TitiNauta 2.0 está **parcialmente implementado**. Existem **duas estruturas diferentes** no banco de dados, mas apenas uma está sendo utilizada ativamente no frontend.

## 🗄️ Estruturas de Banco de Dados

### 1. **Journey Bot (TitiNauta 1.0)** - ✅ IMPLEMENTADO E FUNCIONAL

**Tabela:** `journey_bot_responses`

```sql
CREATE TABLE journey_bot_responses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  child_id UUID NOT NULL REFERENCES children(id),
  question_id VARCHAR NOT NULL,
  answer INTEGER NOT NULL,
  answer_text TEXT NOT NULL,
  responded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Campos:**
- `user_id` - ID do usuário (pai/mãe)
- `child_id` - ID da criança
- `question_id` - ID da pergunta (string)
- `answer` - Resposta numérica (0, 1, 2, etc)
- `answer_text` - Texto da resposta
- `responded_at` - Data/hora da resposta

**Model:** `JourneyBotResponse.js`

**Endpoints:**
- `GET /api/journey-bot/responses` - Buscar respostas existentes
- `POST /api/journey-bot/responses` - Salvar nova resposta

**Status:** ✅ **Funcional e sendo usado**

---

### 2. **Journey V2 Progress (TitiNauta 2.0)** - ⚠️ IMPLEMENTADO MAS NÃO INTEGRADO

**Tabela:** `user_journey_v2_progress`

```sql
CREATE TABLE user_journey_v2_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  child_id UUID REFERENCES children(id),
  journey_id UUID REFERENCES journey_v2(id),
  week_id UUID REFERENCES journey_v2_weeks(id),
  completed_topics JSONB DEFAULT '[]',
  completed_quizzes JSONB DEFAULT '[]',
  progress FLOAT DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Campos:**
- `user_id` - ID do usuário
- `child_id` - ID da criança
- `journey_id` - ID da jornada V2
- `week_id` - ID da semana
- `completed_topics` - Array JSON de IDs de tópicos completados
- `completed_quizzes` - Array JSON de IDs de quizzes completados
- `progress` - Porcentagem de progresso (0-100)
- `started_at` - Data de início
- `completed_at` - Data de conclusão

**Model:** `UserJourneyV2Progress.js`

**Controller:** `journeyV2Controller.js`

**Endpoints:**
- `GET /api/journey-v2/users/:userId/journeys/:journeyId/progress` - Buscar progresso
- `PUT /api/journey-v2/users/:userId/weeks/:weekId/progress` - Atualizar progresso

**Status:** ⚠️ **Implementado no backend, mas NÃO integrado no frontend**

---

## 🔍 Análise do Frontend

### Hooks Implementados

#### 1. `useTitiNautaProgress.ts` (TitiNauta 1.0)
```typescript
// Salva progresso da jornada
saveProgress(childId, journeyId, currentStep, completedSteps)
  → POST /journey/${childId}/progress

// Salva resposta de quiz
saveAnswer(childId, questionId, selectedOptionId)
  → POST /journey/${childId}/answers
```

**Status:** ✅ Implementado e usado em `TitiNautaChat.tsx`

#### 2. `useJourneyV2.ts` (TitiNauta 2.0)
```typescript
// Atualiza progresso de uma semana
updateProgress(weekId, { completedTopics, completedQuizzes, progress })
  → PUT /api/journey-v2/users/${userId}/weeks/${weekId}/progress
```

**Status:** ✅ Implementado e usado em `JourneyV2Explorer.tsx`

### Componentes que Salvam Respostas

| Componente | Hook Usado | Tabela | Status |
|------------|------------|--------|--------|
| `TitiNautaChat.tsx` | `useTitiNautaProgress` | `journey_bot_responses` | ✅ Funcional |
| `JourneyV2Explorer.tsx` | `useJourneyV2` | `user_journey_v2_progress` | ✅ Funcional |
| `TitiNautaJourney.tsx` | `useTitiNautaProgress` | `journey_bot_responses` | ⚠️ Não salva |

---

## ❌ PROBLEMA IDENTIFICADO

### **TitiNautaJourney.tsx NÃO está salvando respostas!**

O componente `TitiNautaJourney.tsx` (página principal do TitiNauta 2.0) **importa** o hook `useTitiNautaProgress`, mas **NÃO está chamando** as funções de salvamento.

**Código Atual:**
```typescript
// TitiNautaJourney.tsx - Linha 37
const { saveProgress, isSaving } = useTitiNautaProgress();

// ❌ PROBLEMA: saveProgress nunca é chamado!
// Não há nenhuma chamada para saveProgress() ou saveAnswer() no componente
```

**Resultado:**
- ❌ Respostas de quiz não são salvas
- ❌ Progresso da jornada não é salvo
- ❌ Tópicos completados não são marcados
- ❌ Dados não persistem no banco

---

## 🔧 O QUE PRECISA SER FEITO

### Opção 1: Usar Journey V2 Progress (Recomendado)

Integrar o `TitiNautaJourney.tsx` com `useJourneyV2` para usar a tabela `user_journey_v2_progress`.

**Vantagens:**
- ✅ Estrutura moderna e completa
- ✅ Suporta múltiplas jornadas e semanas
- ✅ Progresso granular (tópicos e quizzes separados)
- ✅ Já implementado no backend

**Implementação:**
```typescript
// TitiNautaJourney.tsx
const { updateProgress } = useJourneyV2({
  journeyId: currentJourneyId,
  weekId: currentWeekId
});

// Ao completar um tópico
const handleTopicComplete = async (topicId: string) => {
  await updateProgress(currentWeekId, {
    completedTopics: [...completedTopics, topicId]
  });
};

// Ao completar um quiz
const handleQuizComplete = async (quizId: string) => {
  await updateProgress(currentWeekId, {
    completedQuizzes: [...completedQuizzes, quizId]
  });
};
```

### Opção 2: Usar Journey Bot Responses (Compatibilidade)

Manter compatibilidade com TitiNauta 1.0 usando `journey_bot_responses`.

**Vantagens:**
- ✅ Compatível com sistema antigo
- ✅ Mais simples
- ✅ Já funciona em outros componentes

**Desvantagens:**
- ❌ Estrutura menos flexível
- ❌ Não suporta progresso granular
- ❌ Mistura dados de V1 e V2

---

## 📊 Comparação das Estruturas

| Característica | journey_bot_responses | user_journey_v2_progress |
|----------------|----------------------|--------------------------|
| **Granularidade** | Por pergunta | Por semana |
| **Progresso** | Não rastreia | Porcentagem 0-100 |
| **Tópicos** | Não suporta | Array JSON |
| **Quizzes** | Resposta individual | Array de completados |
| **Jornadas** | Não vinculado | Vinculado a journey_v2 |
| **Semanas** | Não suporta | Vinculado a weeks |
| **Badges** | Não integrado | Integrado |
| **Status** | ✅ Funcional | ⚠️ Não integrado |

---

## 🎯 Recomendação

### **Usar `user_journey_v2_progress` para TitiNauta 2.0**

1. **Modificar `TitiNautaJourney.tsx`:**
   - Remover `useTitiNautaProgress`
   - Adicionar `useJourneyV2`
   - Implementar salvamento ao completar tópicos/quizzes

2. **Criar estrutura de jornadas no banco:**
   - Cadastrar jornadas na tabela `journey_v2`
   - Cadastrar semanas na tabela `journey_v2_weeks`
   - Cadastrar tópicos na tabela `journey_v2_topics`
   - Cadastrar quizzes na tabela `journey_v2_quizzes`

3. **Integrar com perguntas existentes:**
   - Vincular `journey_questions` com `journey_v2_topics`
   - Migrar estrutura de conteúdo estático para banco

4. **Manter compatibilidade:**
   - `TitiNautaChat.tsx` continua usando `journey_bot_responses`
   - `TitiNautaJourney.tsx` usa `user_journey_v2_progress`

---

## 📝 Checklist de Implementação

### Backend
- [x] Tabela `user_journey_v2_progress` criada
- [x] Model `UserJourneyV2Progress` criado
- [x] Controller `journeyV2Controller` implementado
- [x] Endpoints de progresso funcionais
- [ ] Vincular `journey_questions` com `journey_v2`
- [ ] Migrar conteúdo estático para banco

### Frontend
- [x] Hook `useJourneyV2` criado
- [x] Componente `JourneyV2Explorer` integrado
- [ ] **Integrar `TitiNautaJourney.tsx` com `useJourneyV2`**
- [ ] **Implementar salvamento de tópicos completados**
- [ ] **Implementar salvamento de quizzes completados**
- [ ] **Calcular e salvar progresso percentual**
- [ ] Exibir progresso real (não simulado)
- [ ] Marcar tópicos como completados visualmente

### Testes
- [ ] Testar salvamento de progresso
- [ ] Testar salvamento de respostas de quiz
- [ ] Testar cálculo de porcentagem
- [ ] Testar persistência entre sessões
- [ ] Testar com múltiplas crianças

---

## 🚨 Ação Imediata Necessária

**PRIORIDADE ALTA:** Integrar salvamento de respostas no `TitiNautaJourney.tsx`

Sem essa integração:
- ❌ Usuários perdem todo o progresso ao sair da página
- ❌ Não há histórico de respostas
- ❌ Não há como retomar de onde parou
- ❌ Badges não podem ser concedidas
- ❌ Relatórios não podem ser gerados

---

**Desenvolvedor:** Cascade AI  
**Última Atualização:** 09/10/2025  
**Status:** ⚠️ Requer ação imediata
