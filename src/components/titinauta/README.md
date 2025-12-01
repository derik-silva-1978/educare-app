## 📁 Estrutura de Arquivos

```
titinauta/
│── TitiNautaChat.tsx       # Componente principal do chat
│── ChatHeader.tsx          # Cabeçalho com info da criança
│── ChatMessage.tsx         # Componente de mensagem individual
│── ChatInput.tsx           # Campo de entrada de texto
│── QuizOptions.tsx         # Opções de quiz interativas
│── Celebration.tsx         # Celebração ao completar módulos
│── ResponseHistory.tsx     # Histórico de respostas
│── BadgesGallery.tsx      # Galeria de conquistas
│── ShareProgress.tsx       # Compartilhamento de progresso
│── ThemeSelector.tsx       # Seletor de temas
│── TitiNautaChat.css       # Estilos do chat
└── README.md              # Este arquivo
```

## 🎯 Visão Geral

Este módulo implementa a interface de chat do TitiNauta, um assistente virtual para acompanhamento do desenvolvimento infantil. O design é inspirado em aplicativos de mensagens modernos como WhatsApp.

## 🔧 Componentes

### TitiNautaChat

Componente principal que orquestra toda a experiência do chat.

**Props:**
```typescript
interface TitiNautaChatProps {
  childId: string;
  ageInMonths: number;
  child: {
    id: string;
    name: string;
    birthDate: string;
  } | null;
  journeyContent: JourneyContent | null;
  isLoading: boolean;
}
```

**Funcionalidades:**
- Gerencia estado das mensagens
- Controla fluxo da conversa
- Integra com API de jornada
- Salva progresso do usuário

**Exemplo de Uso:**
```tsx
import TitiNautaChat from '@/components/titinauta/TitiNautaChat';
import { useJourneyContent } from '@/hooks/useJourneyContent';
import { useChildData } from '@/hooks/useChildData';
import { calculateAgeInMonths } from '@/utils/dateUtils';

function TitiNautaPage() {
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
}
```

### ChatHeader

Exibe informações da criança e progresso da conversa.

**Props:**
```typescript
interface ChatHeaderProps {
  childName: string;      // Nome da criança
  ageRange: string;       // Faixa etária (ex: "1-2 meses")
  progress: number;       // Progresso em % (0-100)
}
```

**Exemplo:**
```tsx
<ChatHeader 
  childName="João"
  ageRange="1-2 meses"
  progress={45}
/>
```

### ChatMessage

Renderiza uma mensagem individual do chat.

**Props:**
```typescript
interface ChatMessageProps {
  message: Message;       // Objeto da mensagem
  isBot: boolean;        // Se é mensagem do bot
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}
```

**Exemplo:**
```tsx
<ChatMessage 
  message={{
    id: '1',
    type: 'bot',
    content: 'Olá! Como posso ajudar?',
    timestamp: new Date()
  }}
  isBot={true}
/>
```

### ChatInput

Campo de entrada para o usuário digitar mensagens.

**Props:**
```typescript
interface ChatInputProps {
  onSend: (message: string) => void;  // Callback ao enviar
}
```

**Exemplo:**
```tsx
<ChatInput 
  onSend={(msg) => console.log('Enviado:', msg)} 
/>
```

### QuizOptions

Exibe opções de quiz como botões clicáveis.

**Props:**
```typescript
interface QuizOptionsProps {
  options: QuizOption[];              // Array de opções
  onSelect: (option: QuizOption) => void;  // Callback ao selecionar
}

interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}
```

**Exemplo:**
```tsx
<QuizOptions 
  options={[
    { id: '1', text: 'Sim' },
    { id: '2', text: 'Não' }
  ]}
  onSelect={(opt) => console.log('Selecionado:', opt)}
/>
```

## 🎨 Estilos

### Temas Disponíveis

O TitiNauta suporta 5 temas visuais:

- **Verde** (padrão): `#22c55e` (header, mensagens do usuário)
- **Azul**: `#3b82f6` (header, mensagens do usuário)
- **Roxo**: `#8b5cf6` (header, mensagens do usuário)
- **Laranja**: `#f97316` (header, mensagens do usuário)
- **Rosa**: `#ec4899` (header, mensagens do usuário)

Fundo comum:
- **Branco:** `#ffffff` (mensagens do bot)
- **Cinza Claro:** `#e5e7eb` (fundo do chat)

### Classes CSS Principais
```css
.titinauta-chat          /* Container principal */
.chat-header             /* Cabeçalho */
.chat-messages           /* Container de mensagens */
.chat-message            /* Mensagem individual */
.bot-message             /* Mensagem do bot */
.user-message            /* Mensagem do usuário */
.message-bubble          /* Bolha da mensagem */
.typing-indicator        /* Indicador de digitação */
.chat-input-container    /* Container do input */
.quiz-options            /* Container de opções */
.quiz-option             /* Opção individual */
.celebration             /* Celebração */
.response-history        /* Histórico de respostas */
.badges-gallery          /* Galeria de badges */
.share-progress          /* Compartilhamento de progresso */
.theme-selector          /* Seletor de temas */
```

### Customização

```tsx
// Usar o hook de tema
import { useTitiNautaTheme } from '@/hooks/useTitiNautaTheme';

// Dentro do componente
const { setTheme } = useTitiNautaTheme(childId);

// Para mudar o tema
setTheme('blue'); // Opções: 'green', 'blue', 'purple', 'orange', 'pink'
```

Ou via CSS:

```css
/* Alterar cor principal */
:root {
  --titinauta-primary: #22c55e;
  --titinauta-bg: #e5e7eb;
}
```

## 🔌 Integração

### Hooks Utilizados

#### useJourneyContent
Busca conteúdo da jornada baseado na idade da criança.

```typescript
const { journeyContent, isLoading, error } = useJourneyContent(
  childId,
  ageInMonths
);
```

#### useChildData
Obtém dados da criança.

```typescript
const { child, isLoading } = useChildData(childId);
```

#### useTitiNautaProgress
Gerencia o progresso do usuário e salva respostas.

```typescript
const { saveProgress, saveAnswer, isSaving } = useTitiNautaProgress();
```

#### useTitiNautaBadges
Gerencia as conquistas e badges do usuário.

```typescript
const { badges, unlockBadge, hasBadge } = useTitiNautaBadges(childId);
```

#### useTitiNautaTheme
Gerencia o tema visual do chat.

```typescript
const { currentTheme, setTheme, availableThemes } = useTitiNautaTheme(childId);
```

### Fluxo de Dados

```
1. TitiNautaChat carrega
   ↓
2. useChildData busca dados da criança
   ↓
3. Calcula idade em meses
   ↓
4. useJourneyContent busca conteúdo
   ↓
5. Renderiza mensagens sequencialmente
   ↓
6. Usuário interage (responde quiz)
   ↓
7. Salva resposta no backend via useTitiNautaProgress
   ↓
8. Desbloqueia badges via useTitiNautaBadges
   ↓
9. Avança para próximo passo ou exibe celebração
   ↓
10. Permite compartilhar progresso
```

## 📝 Tipos TypeScript

### Principais Interfaces

```typescript
// Mensagem do chat
interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

// Opção de quiz
interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// Passo da jornada
interface JourneyStep {
  id: string;
  type: 'message' | 'question';
  content: string;
  options?: QuizOption[];
}

// Conteúdo completo
interface JourneyContent {
  id: string;
  title: string;
  description?: string;
  ageRangeMin: number;
  ageRangeMax: number;
  steps: JourneyStep[];
}

// Progresso da jornada
interface JourneyProgress {
  childId: string;
  journeyId: string;
  completedSteps: string[];
  lastCompletedAt: Date;
  currentStep: number;
}

// Resposta de quiz
interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  answeredAt: Date;
}

// Badge/Conquista
interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

// Tema
interface Theme {
  name: ThemeColor;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  text: string;
  background: string;
  headerBackground: string;
  headerText: string;
  messageBackground: string;
  messageText: string;
  userMessageBackground: string;
  userMessageText: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
}
```

## 🧪 Testes

### Teste Manual

1. **Carregar Chat**
   ```
   Acesse: /educare-app/titinauta/:childId
   Espera: Chat carrega com mensagem de boas-vindas
   ```

2. **Interação com Quiz**
   ```
   Ação: Clique em uma opção
   Espera: Resposta aparece à direita, próxima pergunta aparece
   ```

3. **Progresso**
   ```
   Ação: Responda várias perguntas
   Espera: Barra de progresso aumenta
   ```

### Teste Automatizado (Exemplo)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import TitiNautaChat from './TitiNautaChat';

test('renderiza mensagem de boas-vindas', () => {
  render(<TitiNautaChat />);
  expect(screen.getByText(/Olá!/i)).toBeInTheDocument();
});

test('envia mensagem ao clicar em opção', () => {
  render(<TitiNautaChat />);
  const option = screen.getByText('Sim');
  fireEvent.click(option);
  expect(screen.getByText('Sim')).toBeInTheDocument();
});
```

## 🐛 Troubleshooting

### Problema: Chat não carrega

**Sintoma:** Tela em branco ou loading infinito

**Possíveis Causas:**
- childId inválido
- Erro na API
- Dados não encontrados

**Solução:**
```typescript
// Adicionar logs
console.log('Child ID:', childId);
console.log('Journey Content:', journeyContent);
```

### Problema: Mensagens não aparecem

**Sintoma:** Chat vazio após carregar

**Possíveis Causas:**
- journeyContent.steps vazio
- Erro no componente ChatMessage

**Solução:**
```typescript
// Verificar dados
if (!journeyContent?.steps?.length) {
  return <div>Sem conteúdo disponível</div>;
}
```

### Problema: Opções de quiz não clicam

**Sintoma:** Nada acontece ao clicar

**Possíveis Causas:**
- Tipo de step incorreto
- Callback não definido

**Solução:**
```typescript
// Verificar tipo
if (step.type === 'question' && step.options) {
  return <QuizOptions options={step.options} onSelect={handleSelect} />;
}
```

## 📚 Recursos Adicionais

### Documentação Relacionada
- [Guia de Uso](../../../TITINAUTA_GUIA_DE_USO.md)
- [Quick Start](../../../TITINAUTA_QUICK_START.md)
- [Checklist](../../../TITINAUTA_CHECKLIST.md)

### Exemplos de Código
- [Layout Original](../../../educare-backend/titnautav2_para analise/Titinauta-main)

## 🤝 Contribuindo

### Adicionar Nova Funcionalidade

1. **Criar componente**
   ```typescript
   // NovoComponente.tsx
   interface NovoComponenteProps {
     // ...
   }
   
   const NovoComponente: React.FC<NovoComponenteProps> = (props) => {
     // ...
   };
   ```

2. **Adicionar estilos**
   ```css
   /* Em TitiNautaChat.css */
   .novo-componente {
     /* ... */
   }
   ```

3. **Integrar no chat**
   ```typescript
   // Em TitiNautaChat.tsx
   import NovoComponente from './NovoComponente';
   
   // Usar no render
   <NovoComponente {...props} />
   ```

### Padrões de Código

- Use TypeScript para tipagem forte
- Componentes funcionais com hooks
- CSS Modules ou classes BEM
- Comentários em português
- Props interface sempre definida

## 📄 Licença

Este código é parte do projeto Educare App.
Todos os direitos reservados © 2025 Educare.

---

**Versão:** 1.0.0  
**Última Atualização:** 08/10/2025 23:20  
**Mantenedor:** Equipe Educare
