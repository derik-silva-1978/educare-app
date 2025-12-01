# TitiNauta - Guia Rápido

## 🚀 Introdução

O TitiNauta é um assistente virtual para acompanhamento do desenvolvimento infantil integrado ao Educare+. Este guia rápido ajudará você a começar a trabalhar com o TitiNauta em poucos minutos.

## 📋 Pré-requisitos

- Node.js 16+ e npm/yarn
- Backend Educare rodando na porta 3001
- Acesso ao repositório do projeto

## 🔧 Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/jhsobrinho/educareapp.git
   cd educareapp
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Instale a dependência html2canvas**
   ```bash
   npm install html2canvas --save
   # ou
   yarn add html2canvas
   ```

4. **Inicie o backend**
   ```bash
   cd educare-backend
   npm start
   # ou
   yarn start
   ```

5. **Inicie o frontend**
   ```bash
   # Na pasta raiz
   npm start
   # ou
   yarn start
   ```

## 🎯 Uso Básico

### Acessando o TitiNauta

1. Faça login no Educare+
2. Navegue para `/educare-app/titinauta/:childId`
3. Substitua `:childId` pelo ID da criança

### Integrando em um Novo Componente

```tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import TitiNautaChat from '@/components/titinauta/TitiNautaChat';
import { useJourneyContent } from '@/hooks/useJourneyContent';
import { useChildData } from '@/hooks/useChildData';
import { calculateAgeInMonths } from '@/utils/dateUtils';

const MyTitiNautaPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { child, isLoading: isLoadingChild } = useChildData(childId || '');
  const ageInMonths = child ? calculateAgeInMonths(child.birthDate) : 0;
  const { journeyContent, isLoading: isLoadingJourney } = useJourneyContent(childId || '', ageInMonths);
  
  const adaptedChild = child ? {
    id: child.id,
    name: child.first_name + ' ' + (child.last_name || ''),
    birthDate: child.birthdate
  } : null;

  return (
    <TitiNautaChat 
      childId={childId || ''}
      ageInMonths={ageInMonths}
      child={adaptedChild}
      journeyContent={journeyContent}
      isLoading={isLoadingChild || isLoadingJourney}
    />
  );
};

export default MyTitiNautaPage;
```

## 🧩 Componentes Principais

### TitiNautaChat

Componente principal do chat.

```tsx
<TitiNautaChat 
  childId="123"
  ageInMonths={12}
  child={{ id: "123", name: "João", birthDate: "2024-01-01" }}
  journeyContent={journeyContent}
  isLoading={false}
/>
```

### ResponseHistory

Exibe histórico de respostas.

```tsx
<ResponseHistory childId="123" />
```

### BadgesGallery

Exibe galeria de conquistas.

```tsx
<BadgesGallery childId="123" />
```

### ShareProgress

Permite compartilhar progresso.

```tsx
<ShareProgress 
  childId="123" 
  childName="João" 
  ageInMonths={12}
  progress={75}
/>
```

### ThemeSelector

Permite selecionar tema visual.

```tsx
<ThemeSelector childId="123" />
```

## 🔌 Hooks Personalizados

### useJourneyContent

```tsx
const { journeyContent, isLoading, error, refetch } = useJourneyContent(childId, ageInMonths);
```

### useTitiNautaProgress

```tsx
const { saveProgress, saveAnswer, isSaving, error } = useTitiNautaProgress();

// Salvar resposta
await saveAnswer(childId, questionId, selectedOptionId);

// Salvar progresso
await saveProgress(childId, journeyId, currentStep, completedSteps);
```

### useTitiNautaBadges

```tsx
const { badges, unlockBadge, hasBadge, getLatestBadge } = useTitiNautaBadges(childId);

// Desbloquear badge
unlockBadge('first_conversation');

// Verificar se possui badge
const hasBadge = hasBadge('first_conversation');
```

### useTitiNautaTheme

```tsx
const { currentTheme, setTheme, availableThemes } = useTitiNautaTheme(childId);

// Mudar tema
setTheme('blue'); // 'green', 'blue', 'purple', 'orange', 'pink'
```

## 🔍 Endpoints da API

### Conteúdo da Jornada
```
GET /api/journey/:childId?ageInMonths=12
```

### Salvar Progresso
```
POST /api/journey/:childId/progress
Body: { journeyId, currentStep, completedSteps }
```

### Salvar Resposta
```
POST /api/journey/:childId/answers
Body: { questionId, selectedOptionId }
```

### Histórico de Respostas
```
GET /api/journey/:childId/history
```

## 🐛 Solução de Problemas

### Chat não carrega
- Verifique se o backend está rodando na porta 3001
- Confirme que o token JWT está válido
- Verifique se o childId é válido

### Mensagens não aparecem
- Verifique se journeyContent.steps existe e não está vazio
- Confirme que o formato dos dados está correto

### Badges não aparecem
- Verifique localStorage para `titinauta_badges_[childId]`
- Confirme que `unlockBadge` está sendo chamado corretamente

## 📚 Recursos Adicionais

- [Documentação Completa](./TITINAUTA_DOCUMENTATION.md)
- [Histórico de Alterações](./TITINAUTA_CHANGELOG.md)
- [Status de Implementação](./TITINAUTA_IMPLEMENTATION_STATUS.md)
- [Código Fonte](../src/components/titinauta)

---

**Versão:** 1.0.0  
**Última Atualização:** 08/10/2025  
**Equipe Educare**
