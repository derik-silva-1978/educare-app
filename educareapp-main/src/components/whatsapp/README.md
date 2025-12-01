
# Sistema WhatsApp Bot - Educare+ Tech

Este sistema integra botões do WhatsApp com fluxos inteligentes de conversação e tracking avançado.

## 🚀 Componentes

### 1. EnhancedWhatsAppButton
Botão inteligente que conecta diretamente com fluxos específicos do bot.

```tsx
import { EnhancedWhatsAppButton } from '@/components/whatsapp';

// Uso básico
<EnhancedWhatsAppButton />

// Com fluxo específico
<EnhancedWhatsAppButton 
  productType="jornada"
  trackingData={{
    page: 'landing',
    section: 'hero',
    buttonId: 'main_cta'
  }}
/>

// Customizado
<EnhancedWhatsAppButton
  customMessage="Mensagem personalizada"
  variant="outline"
  size="lg"
  fullWidth
>
  Texto do Botão
</EnhancedWhatsAppButton>
```

### 2. WhatsAppFloatingButton
Botão flutuante que aparece após scroll com tooltip.

```tsx
import { WhatsAppFloatingButton } from '@/components/whatsapp';

<WhatsAppFloatingButton
  phoneNumber="5511999999999"
  message="Mensagem inicial"
  showTooltip={true}
/>
```

### 3. useWhatsAppBot Hook
Hook para controlar a lógica do bot programaticamente.

```tsx
import { useWhatsAppBot } from '@/hooks/useWhatsAppBot';

const MyComponent = () => {
  const { sendToBot, sendProductFlow, sendCustomMessage } = useWhatsAppBot();
  
  const handleClick = () => {
    sendProductFlow('jornada', {
      page: 'dashboard',
      section: 'quick_actions'
    });
  };
  
  return <button onClick={handleClick}>Falar sobre Jornada</button>;
};
```

## ⚙️ Configuração

### 1. Configurar o Bot Real

Edite `src/config/whatsapp-bot-config.ts`:

```typescript
export const whatsappBotConfig: WhatsAppBotConfig = {
  // Substitua pelo número real do seu bot
  phoneNumber: "5511999999999", // Formato: código país + DDD + número
  
  // Configure as mensagens para cada fluxo
  productMessages: {
    'jornada': "Olá! Quero saber sobre a Jornada do Desenvolvimento.",
    'academia': "Olá! Tenho interesse nos cursos da Academia.",
    // ... outras mensagens
  },
  
  // Habilitar/desabilitar funcionalidades
  utmTracking: true,
  analyticsEnabled: true
};
```

### 2. Fluxos do Bot

Cada `productType` corresponde a um fluxo específico:

- `jornada` - Jornada do Desenvolvimento Infantil
- `academia` - Academia Educare+ (cursos)
- `loja` - Loja Educare+ (produtos)
- `suporte` - Suporte técnico
- `demo` - Solicitação de demonstração
- `landing` - Interesse geral da landing page

### 3. Mensagens de Trigger

Configure mensagens que o bot reconhece:

```typescript
export const whatsappBotFlows: Record<string, WhatsAppBotFlow> = {
  jornada: {
    trigger: "/start_jornada", // Comando que o bot reconhece
    message: "Mensagem enviada para o usuário",
    utmSource: "educare_app",
    utmMedium: "whatsapp_bot",
    utmCampaign: "jornada_desenvolvimento"
  }
};
```

## 📊 Analytics e Tracking

### 1. UTM Tracking
Automaticamente adiciona parâmetros UTM para tracking:

- `utm_source`: origem (ex: educare_app)
- `utm_medium`: meio (whatsapp_bot)
- `utm_campaign`: campanha específica
- `utm_content`: página atual
- `utm_term`: seção da página

### 2. Console Analytics
Todas as interações são logadas:

```javascript
{
  action: 'whatsapp_bot_click',
  product_type: 'jornada',
  flow_trigger: '/start_jornada',
  tracking_data: {
    page: 'landing',
    section: 'hero',
    buttonId: 'main_cta'
  },
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

### 3. Integração com Analytics

Para integrar com Google Analytics, adicione em `useWhatsAppBot.ts`:

```typescript
// Google Analytics 4
if (typeof gtag !== 'undefined') {
  gtag('event', 'whatsapp_bot_click', {
    product_type: productType,
    flow_trigger: flow?.trigger,
    page_title: document.title,
    page_location: window.location.href
  });
}

// Mixpanel
if (typeof mixpanel !== 'undefined') {
  mixpanel.track('WhatsApp Bot Click', {
    product_type: productType,
    flow_trigger: flow?.trigger,
    tracking_data: trackingData
  });
}
```

## 🎯 Casos de Uso

### 1. Landing Page
```tsx
// Hero section - interesse geral
<EnhancedWhatsAppButton
  productType="demo"
  trackingData={{ page: 'landing', section: 'hero' }}
>
  Solicitar Demonstração
</EnhancedWhatsAppButton>

// Seção de produtos - fluxo específico
<EnhancedWhatsAppButton
  productType="jornada"
  trackingData={{ page: 'landing', section: 'products' }}
/>
```

### 2. Dashboard
```tsx
// Ação rápida no dashboard
<EnhancedWhatsAppButton
  productType="suporte"
  variant="outline"
  size="sm"
  trackingData={{ 
    page: 'dashboard', 
    section: 'quick_actions',
    buttonId: 'help_button'
  }}
>
  Preciso de Ajuda
</EnhancedWhatsAppButton>
```

### 3. Páginas de Produto
```tsx
// Página específica de produto
<EnhancedWhatsAppButton
  productType="academia"
  customMessage="Olá! Estou na página da Academia e gostaria de saber sobre os cursos de {CURSO_ESPECÍFICO}."
  fullWidth
  trackingData={{ 
    page: 'academia_curso_detalhes',
    section: 'cta_bottom'
  }}
>
  Falar sobre este Curso
</EnhancedWhatsAppButton>
```

## 🔧 Customização Avançada

### 1. Personalizar por Usuário
```tsx
const { user } = useAuth();
const customMessage = user 
  ? `Olá! Sou ${user.name} e gostaria de saber mais sobre a Jornada.`
  : "Olá! Gostaria de saber mais sobre a Jornada.";

<EnhancedWhatsAppButton customMessage={customMessage} />
```

### 2. Condicional por Contexto
```tsx
const getProductType = () => {
  if (location.pathname.includes('/academia')) return 'academia';
  if (location.pathname.includes('/loja')) return 'loja';
  return 'jornada';
};

<EnhancedWhatsAppButton productType={getProductType()} />
```

### 3. A/B Testing
```tsx
const isVariantB = Math.random() > 0.5;
const buttonText = isVariantB ? "Falar no WhatsApp" : "Conversar Agora";
const trackingData = { 
  variant: isVariantB ? 'B' : 'A',
  page: 'landing'
};

<EnhancedWhatsAppButton trackingData={trackingData}>
  {buttonText}
</EnhancedWhatsAppButton>
```

## 🚨 Configuração do Bot Real

Para conectar com um bot real:

1. **Substitua o número mock** em `whatsapp-bot-config.ts`
2. **Configure triggers** que seu bot reconhece
3. **Teste os fluxos** enviando as mensagens configuradas
4. **Monitore analytics** para otimizar conversões

## 📱 Responsive Design

Todos os componentes são totalmente responsivos:

- Mobile: botões full-width quando apropriado
- Tablet: tamanhos adaptativos
- Desktop: tamanhos padrão com hover states

## 🔒 Segurança

- Números de telefone são validados
- Mensagens são encodadas para URL
- Tracking data é sanitizada
- Console logs não expõem dados sensíveis

---

**Próximos Passos:**
1. Configure o número real do bot
2. Teste os fluxos de conversação
3. Integre com analytics
4. Monitore métricas de conversão
