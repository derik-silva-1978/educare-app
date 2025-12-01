# Guia de Uso - Novo Layout do TitiNauta

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Como Acessar](#como-acessar)
3. [Funcionalidades](#funcionalidades)
4. [Como Testar](#como-testar)
5. [Integração com Backend](#integração-com-backend)
6. [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O novo layout do TitiNauta traz uma interface moderna estilo WhatsApp para a jornada de desenvolvimento infantil, mantendo toda a infraestrutura de dados existente.

### Características Principais
- ✅ Interface de chat intuitiva
- ✅ Design responsivo mobile-first
- ✅ Integração com dados do banco existente
- ✅ Sistema de quiz interativo
- ✅ Indicadores de progresso visual
- ✅ Animações suaves e feedback visual

## 🚀 Como Acessar

### Opção 1: Via Menu de Navegação
1. Faça login no Educare App
2. No menu lateral, clique em **"TitiNauta"**
3. Selecione a criança desejada (se houver múltiplas)

### Opção 2: Via URL Direta
Acesse: `/educare-app/titinauta/:childId`

Exemplo: `/educare-app/titinauta/123e4567-e89b-12d3-a456-426614174000`

### Opção 3: Via Perfil da Criança
1. Acesse o perfil de uma criança
2. Clique no botão **"Conversar com TitiNauta"** (a ser implementado)

## 💡 Funcionalidades

### 1. Chat Interativo
- **Mensagens do Bot**: Aparecem à esquerda com fundo branco
- **Mensagens do Usuário**: Aparecem à direita com fundo verde
- **Indicador de Digitação**: Mostra quando o TitiNauta está "digitando"
- **Timestamps**: Cada mensagem mostra a hora de envio

### 2. Sistema de Quiz
- **Perguntas Interativas**: Apresentadas como opções clicáveis
- **Feedback Imediato**: Resposta processada instantaneamente
- **Progresso Visual**: Barra no topo mostra o avanço na conversa

### 3. Personalização
- **Nome da Criança**: Exibido no cabeçalho
- **Faixa Etária**: Mostra a idade em meses (ex: "1-2 meses")
- **Conteúdo Adaptado**: Baseado na idade da criança

### 4. Indicadores Visuais
- **Status Online**: Indicador verde mostra que o TitiNauta está ativo
- **Barra de Progresso**: Mostra percentual de conclusão da conversa
- **Avatar**: Imagem do TitiNauta para identificação visual

## 🧪 Como Testar

### Teste Básico (Dados Mockados)

1. **Iniciar o Servidor de Desenvolvimento**
   ```bash
   npm run dev
   ```

2. **Acessar a Página de Teste**
   ```
   http://localhost:5173/educare-app/titinauta/test-child-id
   ```

3. **Verificar Funcionalidades**
   - [ ] Chat carrega corretamente
   - [ ] Mensagens aparecem em sequência
   - [ ] Indicador de digitação funciona
   - [ ] Opções de quiz são clicáveis
   - [ ] Barra de progresso atualiza

### Teste com Dados Reais

1. **Criar uma Criança no Sistema**
   - Acesse `/educare-app/children`
   - Clique em "Adicionar Criança"
   - Preencha os dados e salve

2. **Acessar o TitiNauta**
   - Use o ID da criança criada
   - Navegue para `/educare-app/titinauta/:childId`

3. **Verificar Integração**
   - [ ] Nome da criança aparece corretamente
   - [ ] Idade é calculada corretamente
   - [ ] Conteúdo é apropriado para a idade

## 🔌 Integração com Backend

### Endpoints Implementados

#### 1. Buscar Conteúdo da Jornada
```
GET /api/journey/:childId?ageInMonths=:ageInMonths
```

**Status:** ✅ Implementado

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "journey-1-2-months",
    "title": "Desenvolvimento no Primeiro Trimestre",
    "ageRangeMin": 1,
    "ageRangeMax": 2,
    "steps": [
      {
        "id": "step-1",
        "type": "message",
        "content": "Olá! Vamos conversar sobre o desenvolvimento..."
      },
      {
        "id": "step-2",
        "type": "question",
        "content": "Seu bebê já consegue seguir objetos com os olhos?",
        "options": [
          { "id": "opt-1", "text": "Sim, ele já acompanha objetos" },
          { "id": "opt-2", "text": "Às vezes" },
          { "id": "opt-3", "text": "Ainda não percebi" }
        ]
      }
    ]
  }
}
```

#### 2. Salvar Progresso
```
POST /api/journey/:childId/progress
```

**Status:** ✅ Implementado

**Payload:**
```json
{
  "journeyId": "journey-1-2-months",
  "currentStep": 3,
  "completedSteps": ["step-1", "step-2", "step-3"]
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "sessionId": "123e4567-e89b-12d3-a456-426614174000",
    "progress": 75
  }
}
```

#### 3. Salvar Respostas de Quiz
```
POST /api/journey/:childId/answers
```

**Status:** ✅ Implementado

**Payload:**
```json
{
  "questionId": "step-2",
  "selectedOptionId": "opt-1"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "user-123",
    "child_id": "child-123",
    "question_id": "step-2",
    "answer": 1,
    "answer_text": "Sim, com frequência",
    "created_at": "2025-10-08T22:30:00Z"
  }
}
```

#### 4. Buscar Histórico de Respostas
```
GET /api/journey/:childId/history
```

**Status:** ✅ Implementado

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "user_id": "user-123",
      "child_id": "child-123",
      "question_id": "step-2",
      "answer": 1,
      "answer_text": "Sim, com frequência",
      "created_at": "2025-10-08T22:30:00Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174000",
      "user_id": "user-123",
      "child_id": "child-123",
      "question_id": "step-5",
      "answer": 2,
      "answer_text": "Às vezes",
      "created_at": "2025-10-08T22:35:00Z"
    }
  ]
}
```

### Hook Atualizado

O hook `useJourneyContent` foi atualizado para usar dados reais em vez de mock:

```typescript
// Em src/hooks/useJourneyContent.ts
export const useJourneyContent = (childId: string, ageInMonths: number) => {
  const {
    data,
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: [`journeyContent-${childId}-${ageInMonths}`],
    queryFn: async () => {
      const response = await httpClient.get(
        `/api/journey/${childId}?ageInMonths=${ageInMonths}`
      );
      
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar conteúdo da jornada');
      }

      return response.data as JourneyContent;
    },
    enabled: !!childId && ageInMonths > 0,
    staleTime: 5 * 60 * 1000 // Cache por 5 minutos
  });
  
  // Resto do código...
};
```

## 🐛 Troubleshooting

### Problema: Chat não carrega

**Possíveis Causas:**
1. ID da criança inválido
2. Erro na API
3. Dados não encontrados

**Solução:**
```typescript
// Verificar console do navegador
// Procurar por erros como:
// - "Criança não encontrada"
// - "Erro ao buscar conteúdo da jornada"
```

### Problema: Mensagens não aparecem

**Possíveis Causas:**
1. Estrutura de dados incorreta
2. Erro no componente ChatMessage

**Solução:**
```typescript
// Verificar se journeyContent.steps existe
console.log('Steps:', journeyContent?.steps);
```

### Problema: Opções de quiz não funcionam

**Possíveis Causas:**
1. Tipo de step incorreto
2. Opções não definidas

**Solução:**
```typescript
// Verificar estrutura do step
console.log('Current step:', journeyContent.steps[currentStep]);
```

### Problema: Barra de progresso não atualiza

**Possíveis Causas:**
1. currentStep não está sendo atualizado
2. Cálculo de progresso incorreto

**Solução:**
```typescript
// Verificar estado
console.log('Current step:', currentStep);
console.log('Total steps:', journeyContent?.steps?.length);
```

## 📱 Responsividade

### Mobile (< 768px)
- Layout otimizado para tela pequena
- Mensagens ocupam 80% da largura
- Botões de opção em coluna única

### Tablet (768px - 1024px)
- Layout intermediário
- Mensagens com largura máxima de 70%

### Desktop (> 1024px)
- Layout centralizado
- Largura máxima de 480px
- Melhor aproveitamento do espaço

## 🎨 Personalização de Cores

Para alterar o tema de cores, edite `TitiNautaChat.css`:

```css
/* Cor principal (verde) */
.chat-header {
  background-color: #22c55e; /* Alterar aqui */
}

/* Mensagens do usuário */
.user-message .message-bubble {
  background-color: #22c55e; /* Alterar aqui */
}
```

## 📊 Métricas e Analytics

### Eventos a Rastrear
- `titinauta_chat_started` - Usuário iniciou conversa
- `titinauta_message_sent` - Usuário enviou mensagem
- `titinauta_quiz_answered` - Usuário respondeu quiz
- `titinauta_journey_completed` - Usuário completou jornada

### Implementação (Exemplo com Google Analytics)
```typescript
// No componente TitiNautaChat
useEffect(() => {
  // Rastrear início da conversa
  gtag('event', 'titinauta_chat_started', {
    child_id: childId,
    age_in_months: ageInMonths
  });
}, []);
```

## 🔐 Segurança

### Validações Implementadas
- ✅ Verificação de autenticação do usuário
- ✅ Validação de ID da criança
- ✅ Sanitização de inputs do usuário
- ✅ Proteção contra XSS nas mensagens

### Boas Práticas
- Sempre validar dados do backend
- Não confiar em dados do cliente
- Implementar rate limiting nas APIs
- Logar tentativas de acesso não autorizado

## 📚 Recursos Adicionais

### Documentação Relacionada
- [Plano de Implementação](./titinauta-implementation-plan.md)
- [Status da Implementação](./TITINAUTA_IMPLEMENTATION_STATUS.md)
- [Layout Original](./educare-backend/titnautav2_para analise/Titinauta-main/README.md)

### Suporte
- Email: suporte@educare.com.br
- Slack: #titinauta-dev
- Issues: GitHub Issues

---

**Última Atualização:** 08/10/2025 22:30  
**Versão:** 1.0.0  
**Autor:** Equipe Educare
