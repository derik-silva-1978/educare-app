# TitiNauta - Quick Start Guide 🚀

## 🎯 Início Rápido em 5 Minutos

### 1. Acesse o TitiNauta

**Opção A: Via Menu**
```
1. Faça login no Educare App
2. Clique em "TitiNauta" no menu lateral
3. Selecione uma criança
```

**Opção B: Via URL**
```
http://localhost:5173/educare-app/titinauta/:childId
```

### 2. Teste com Dados Mock

O sistema já vem com dados de exemplo para teste:

```typescript
// Acesse qualquer ID de criança
http://localhost:5173/educare-app/titinauta/test-123
```

### 3. Veja o Chat Funcionando

Você verá:
- ✅ Mensagens do TitiNauta (esquerda, fundo branco)
- ✅ Suas respostas (direita, fundo verde)
- ✅ Opções de quiz clicáveis
- ✅ Barra de progresso no topo

---

## 🔧 Para Desenvolvedores

### Estrutura de Arquivos

```
src/
├── components/titinauta/
│   ├── TitiNautaChat.tsx      # Componente principal
│   ├── ChatHeader.tsx          # Cabeçalho
│   ├── ChatMessage.tsx         # Mensagens
│   ├── ChatInput.tsx           # Input
│   ├── QuizOptions.tsx         # Quiz
│   └── TitiNautaChat.css       # Estilos
├── hooks/
│   ├── useJourneyContent.ts    # Hook de conteúdo
│   └── useChildData.ts         # Hook de criança
├── types/
│   └── titinauta.ts            # Tipos TypeScript
└── pages/educare-app/
    └── TitiNautaPage.tsx       # Página principal
```

### Como Modificar

#### Alterar Cores
```css
/* Em TitiNautaChat.css */
.chat-header {
  background-color: #22c55e; /* Sua cor aqui */
}
```

#### Adicionar Nova Mensagem
```typescript
// Em TitiNautaChat.tsx
setMessages(prev => [...prev, {
  id: `bot-${Date.now()}`,
  type: 'bot',
  content: 'Sua mensagem aqui',
  timestamp: new Date()
}]);
```

#### Criar Novo Quiz
```typescript
// Estrutura de quiz
{
  id: 'step-1',
  type: 'question',
  content: 'Sua pergunta aqui?',
  options: [
    { id: 'opt-1', text: 'Opção 1' },
    { id: 'opt-2', text: 'Opção 2' }
  ]
}
```

---

## 🔌 Integração com Backend

### 1. Endpoints Implementados

```javascript
// Backend: titiNautaController.js (já implementado)

// GET /api/journey/:childId
exports.getJourneyContent = async (req, res) => {
  const { childId } = req.params;
  const { ageInMonths } = req.query;
  
  // Buscar perguntas adequadas para a idade
  const questions = await JourneyBotQuestion.findAll({
    where: {
      meta_min_months: { [Op.lte]: adjustedAge },
      meta_max_months: { [Op.gte]: adjustedAge },
      is_active: true
    }
  });
  
  // Processar e retornar conteúdo
  return res.json({
    success: true,
    data: journeyContent
  });
};
```

### 2. Hook Atualizado no Frontend

```typescript
// Em useJourneyContent.ts (já implementado)
export const useJourneyContent = (childId: string, ageInMonths: number) => {
  const { data, isLoading, error: queryError, refetch } = useQuery({
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
    // Cache por 5 minutos
    staleTime: 5 * 60 * 1000
  });
  
  // Resto do código...
};
```

### 3. Testar Integração

```bash
# Verificar se endpoint responde (já implementado)
curl http://localhost:3001/api/journey/123?ageInMonths=2

# Testar salvamento de progresso
curl -X POST http://localhost:3001/api/journey/123/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"journeyId":"journey-1-2-months","currentStep":3,"completedSteps":["step-1","step-2","step-3"]}'

# Testar salvamento de resposta
curl -X POST http://localhost:3001/api/journey/123/answers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"questionId":"step-3","selectedOptionId":"opt-1"}'
```

---

## 🧪 Testes Rápidos

### Teste 1: Chat Carrega
```
✓ Acesse /educare-app/titinauta/test-123
✓ Veja mensagem de boas-vindas
✓ Veja indicador de digitação
```

### Teste 2: Quiz Funciona
```
✓ Clique em uma opção de resposta
✓ Veja sua resposta aparecer à direita
✓ Veja próxima pergunta aparecer
```

### Teste 3: Progresso Atualiza
```
✓ Observe barra de progresso no topo
✓ Responda algumas perguntas
✓ Veja barra aumentar
```

---

## 🐛 Problemas Comuns

### Chat não carrega
```typescript
// Verifique console do navegador
// Procure por erros de:
- "Criança não encontrada"
- "Erro ao buscar conteúdo"
```

**Solução:**
```typescript
// Verifique se childId é válido
console.log('Child ID:', childId);
```

### Mensagens não aparecem
```typescript
// Verifique dados
console.log('Journey Content:', journeyContent);
console.log('Steps:', journeyContent?.steps);
```

**Solução:**
```typescript
// Certifique-se que steps existe
if (!journeyContent?.steps) {
  return <div>Sem conteúdo disponível</div>;
}
```

### Opções de quiz não clicam
```typescript
// Verifique tipo do step
console.log('Step type:', currentStep.type);
console.log('Options:', currentStep.options);
```

**Solução:**
```typescript
// Certifique-se que type é 'question'
if (step.type === 'question' && step.options) {
  // Renderizar quiz
}
```

---

## 📚 Recursos Úteis

### Documentação
- [Plano de Implementação](./titinauta-implementation-plan.md)
- [Guia de Uso Completo](./TITINAUTA_GUIA_DE_USO.md)
- [Status da Implementação](./TITINAUTA_IMPLEMENTATION_STATUS.md)

### Exemplos de Código
```typescript
// Exemplo: Adicionar nova funcionalidade
const handleSpecialAction = () => {
  setMessages(prev => [...prev, {
    id: `special-${Date.now()}`,
    type: 'bot',
    content: '🎉 Parabéns! Você completou o módulo!',
    timestamp: new Date()
  }]);
};
```

### Comandos Úteis
```bash
# Iniciar desenvolvimento
npm run dev

# Executar testes
npm test

# Build para produção
npm run build

# Verificar tipos TypeScript
npm run type-check
```

---

## 🎨 Customização Rápida

### Mudar Avatar do TitiNauta
```typescript
// Em ChatHeader.tsx
<img 
  src="/seu-novo-avatar.png"  // Altere aqui
  alt="TitiNauta" 
/>
```

### Adicionar Som de Notificação
```typescript
// Em TitiNautaChat.tsx
const playNotificationSound = () => {
  const audio = new Audio('/notification.mp3');
  audio.play();
};

// Chamar quando nova mensagem chegar
useEffect(() => {
  if (messages.length > 0) {
    playNotificationSound();
  }
}, [messages]);
```

### Personalizar Mensagens
```typescript
// Usar nome da criança
const welcomeMessage = `Olá! Vamos conversar sobre o desenvolvimento do ${child.first_name}!`;
```

---

## 🚀 Próximos Passos

### Hoje
1. ✅ Teste o chat com dados mock
2. ✅ Explore os componentes
3. ✅ Leia a documentação

### Esta Semana
1. [ ] Integre com backend real
2. [ ] Teste com dados de produção
3. [ ] Colete feedback inicial

### Próximo Mês
1. [ ] Adicione funcionalidades avançadas
2. [ ] Otimize performance
3. [ ] Lance para usuários beta

---

## 💡 Dicas Pro

### Performance
```typescript
// Use React.memo para evitar re-renders
const ChatMessage = React.memo(({ message, isBot }) => {
  // ...
});
```

### Debug
```typescript
// Adicione logs úteis
console.log('🤖 TitiNauta:', {
  childId,
  ageInMonths,
  currentStep,
  totalSteps: journeyContent?.steps?.length
});
```

### Acessibilidade
```typescript
// Sempre adicione ARIA labels
<button 
  aria-label="Enviar mensagem"
  onClick={handleSend}
>
  Enviar
</button>
```

---

## 📞 Suporte

**Encontrou um problema?**
1. Verifique a [documentação](./TITINAUTA_GUIA_DE_USO.md)
2. Procure em [issues conhecidos](./TITINAUTA_CHECKLIST.md)
3. Entre em contato: dev@educare.com.br

**Quer contribuir?**
1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

**Versão:** 1.0.0  
**Última Atualização:** 08/10/2025  
**Autor:** Equipe Educare

🎉 **Pronto! Agora você está pronto para usar o TitiNauta!**
