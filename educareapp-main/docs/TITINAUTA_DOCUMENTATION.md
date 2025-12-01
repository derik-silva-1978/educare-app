# Documentação do TitiNauta

## Visão Geral

O TitiNauta é um assistente virtual de desenvolvimento infantil integrado ao Educare+. Ele fornece uma interface de chat interativa para acompanhar o desenvolvimento de crianças, com perguntas personalizadas baseadas na idade e feedback contextualizado.

## Estrutura de Componentes

### Componentes Principais

1. **TitiNautaPage.tsx**
   - Página principal que contém o chat
   - Gerencia a integração com o roteamento
   - Carrega dados da criança e conteúdo da jornada

2. **TitiNautaChat.tsx**
   - Componente principal do chat
   - Gerencia o estado das mensagens
   - Controla o fluxo da conversa
   - Integra com hooks de progresso, badges e tema

3. **Componentes Auxiliares**
   - `ChatHeader.tsx`: Cabeçalho com informações da criança e progresso
   - `ChatMessage.tsx`: Exibe mensagens individuais
   - `ChatInput.tsx`: Campo de entrada de texto
   - `QuizOptions.tsx`: Opções de resposta para perguntas
   - `Celebration.tsx`: Celebração ao completar módulos
   - `ResponseHistory.tsx`: Histórico de respostas
   - `BadgesGallery.tsx`: Galeria de conquistas
   - `ShareProgress.tsx`: Compartilhamento de progresso
   - `ThemeSelector.tsx`: Seletor de temas visuais

### Hooks Personalizados

1. **useJourneyContent.ts**
   - Busca o conteúdo da jornada baseado na idade da criança
   - Gerencia estados de loading e erro
   - Implementa cache com React Query

2. **useTitiNautaProgress.ts**
   - Salva o progresso do usuário
   - Gerencia respostas às perguntas
   - Atualiza o progresso da jornada

3. **useTitiNautaBadges.ts**
   - Gerencia conquistas e badges
   - Armazena badges desbloqueados
   - Fornece métodos para desbloquear novas conquistas

4. **useTitiNautaTheme.ts**
   - Gerencia o tema visual do chat
   - Permite personalização de cores
   - Armazena preferências do usuário

## Fluxo de Dados

1. **Carregamento Inicial**
   - `TitiNautaPage` carrega dados da criança via `useChildData`
   - Calcula idade em meses com `calculateAgeInMonths`
   - Busca conteúdo da jornada via `useJourneyContent`
   - Renderiza `TitiNautaChat` com os dados

2. **Interação do Usuário**
   - Usuário responde perguntas via `ChatInput` ou `QuizOptions`
   - `TitiNautaChat` atualiza o estado das mensagens
   - Progresso é salvo via `useTitiNautaProgress`
   - Badges são desbloqueados via `useTitiNautaBadges`

3. **Finalização do Módulo**
   - Exibe celebração via `Celebration`
   - Desbloqueia badges relevantes
   - Permite compartilhar progresso via `ShareProgress`

## Integração com Backend

### Endpoints

1. **GET /api/journey/:childId**
   - Busca o conteúdo da jornada para uma criança
   - Parâmetros: `childId` (path), `ageInMonths` (query)
   - Retorna: Objeto `JourneyContent`

2. **POST /api/journey/:childId/progress**
   - Salva o progresso da jornada
   - Parâmetros: `childId` (path), `{ journeyId, currentStep, completedSteps }` (body)
   - Retorna: Status do progresso

3. **POST /api/journey/:childId/answers**
   - Salva resposta de quiz
   - Parâmetros: `childId` (path), `{ questionId, selectedOptionId }` (body)
   - Retorna: Resposta salva

4. **GET /api/journey/:childId/history**
   - Busca histórico de respostas
   - Parâmetros: `childId` (path)
   - Retorna: Lista de respostas anteriores

### Modelos de Dados

1. **JourneyBotQuestion**
   - Perguntas do TitiNauta
   - 31 campos incluindo metadados, dados da semana, gamificação, etc.
   - Usado para construir o conteúdo da jornada

2. **JourneyBotSession**
   - Sessões ativas do TitiNauta
   - Rastreia progresso da conversa
   - Armazena dados da sessão

3. **JourneyBotResponse**
   - Respostas dos usuários
   - Vincula criança, pergunta e resposta
   - Armazena texto e valor numérico da resposta

## Personalização

### Temas Disponíveis

O TitiNauta suporta 5 temas visuais:

1. **Verde** (padrão): `#22c55e`
2. **Azul**: `#3b82f6`
3. **Roxo**: `#8b5cf6`
4. **Laranja**: `#f97316`
5. **Rosa**: `#ec4899`

### Badges e Conquistas

O sistema inclui várias conquistas que podem ser desbloqueadas:

1. **Primeira Conversa**: Completar uma conversa com o TitiNauta
2. **Especialista em Comunicação**: Completar perguntas do domínio de comunicação
3. **Especialista em Desenvolvimento Motor**: Completar perguntas do domínio motor
4. **Especialista em Desenvolvimento Cognitivo**: Completar perguntas do domínio cognitivo
5. **Mês Completo**: Completar todas as perguntas de um mês

## Guia de Uso

### Adicionar o TitiNauta a uma Nova Página

```tsx
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
  
  // Adaptar o objeto child para o formato esperado pelo componente
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
```

### Personalizar o Tema

```tsx
import { useTitiNautaTheme } from '@/hooks/useTitiNautaTheme';

// Dentro do componente
const { setTheme } = useTitiNautaTheme(childId);

// Para mudar o tema
setTheme('blue'); // Opções: 'green', 'blue', 'purple', 'orange', 'pink'
```

### Desbloquear Badges

```tsx
import { useTitiNautaBadges } from '@/hooks/useTitiNautaBadges';

// Dentro do componente
const { unlockBadge } = useTitiNautaBadges(childId);

// Para desbloquear um badge
unlockBadge('first_conversation');
```

## Considerações de Performance

1. **Carregamento Lazy**
   - Mensagens são carregadas sob demanda
   - Imagens e recursos pesados são carregados apenas quando necessário

2. **Otimizações de Renderização**
   - Componentes puros com `React.memo`
   - Hooks memoizados para evitar re-renderizações desnecessárias

3. **Cache Local**
   - React Query para cache de dados da API
   - localStorage para preferências de tema e badges

## Próximas Melhorias (v2.0)

1. **Recursos Multimídia**
   - Suporte a imagens nas mensagens
   - Vídeos educacionais integrados
   - Narração em áudio das mensagens

2. **Relatórios Avançados**
   - Dashboard para profissionais
   - Análise de respostas com IA
   - Insights personalizados

3. **Integrações**
   - Conexão com outros módulos do Educare+
   - Notificações push
   - Lembretes de sessões

## Solução de Problemas

### Problemas Comuns

1. **Chat Travado em "Preparando Conversa"**
   - Verificar se o backend está rodando na porta 3001
   - Confirmar que o token JWT está válido
   - Checar se há erros no console relacionados à API

2. **Badges Não Aparecem**
   - Verificar localStorage para `titinauta_badges_[childId]`
   - Confirmar que `unlockBadge` está sendo chamado corretamente
   - Limpar cache do navegador se necessário

3. **Temas Não Persistem**
   - Verificar localStorage para `titinauta_theme_[childId]`
   - Confirmar que `setTheme` está sendo chamado corretamente
   - Verificar se há erros no console relacionados ao localStorage

## Dependências

- React Router DOM: Roteamento
- Lucide React: Ícones
- date-fns: Formatação de datas
- html2canvas: Compartilhamento de progresso como imagem

---

Documentação criada em 08/10/2025 pela Equipe Educare.
