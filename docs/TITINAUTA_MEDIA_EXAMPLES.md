# Exemplos de Uso de Recursos Multimídia no TitiNauta

Este documento contém exemplos de como utilizar os recursos multimídia implementados no TitiNauta.

## 🖼️ Imagens nas Mensagens

### Exemplo de Uso

```tsx
// Importar o tipo MediaContent
import { MediaContent } from '@/types/titinauta';

// Criar uma mensagem com imagem
const imageMessage = {
  id: 'msg-1',
  type: 'bot',
  content: 'Veja esta imagem de desenvolvimento infantil:',
  timestamp: new Date(),
  media: {
    type: 'image',
    url: '/assets/images/development-milestone.jpg',
    alt: 'Marco de desenvolvimento infantil'
  } as MediaContent
};

// Adicionar à lista de mensagens
setMessages(prev => [...prev, imageMessage]);
```

### Configuração no JourneyStep

```tsx
// Exemplo de passo da jornada com imagem
const imageStep = {
  id: 'step-1',
  type: 'media',
  content: 'Observe como o bebê segura objetos nesta idade:',
  media: {
    type: 'image',
    url: '/assets/images/baby-grasping.jpg',
    alt: 'Bebê segurando objetos'
  }
};

// Adicionar ao array de passos da jornada
const journeyContent = {
  id: 'journey-1',
  title: 'Desenvolvimento Motor',
  ageRangeMin: 6,
  ageRangeMax: 7,
  steps: [imageStep, /* outros passos */]
};
```

## 🎬 Vídeos nas Mensagens

### Exemplo de Uso

```tsx
// Criar uma mensagem com vídeo
const videoMessage = {
  id: 'msg-2',
  type: 'bot',
  content: 'Assista este vídeo sobre estímulos sensoriais:',
  timestamp: new Date(),
  media: {
    type: 'video',
    url: '/assets/videos/sensory-stimulation.mp4',
    alt: 'Estímulos sensoriais para bebês',
    thumbnail: '/assets/images/video-thumbnail.jpg'
  } as MediaContent
};

// Adicionar à lista de mensagens
setMessages(prev => [...prev, videoMessage]);
```

### Configuração no JourneyStep

```tsx
// Exemplo de passo da jornada com vídeo
const videoStep = {
  id: 'step-2',
  type: 'media',
  content: 'Veja como estimular a coordenação motora:',
  media: {
    type: 'video',
    url: '/assets/videos/motor-coordination.mp4',
    alt: 'Exercícios de coordenação motora',
    thumbnail: '/assets/images/coordination-thumbnail.jpg'
  }
};
```

## 🔊 Áudio nas Mensagens

### Exemplo de Uso

```tsx
// Criar uma mensagem com áudio
const audioMessage = {
  id: 'msg-3',
  type: 'bot',
  content: 'Ouça esta explicação sobre desenvolvimento cognitivo:',
  timestamp: new Date(),
  media: {
    type: 'audio',
    url: '/assets/audio/cognitive-development.mp3',
    duration: 120 // duração em segundos
  } as MediaContent
};

// Adicionar à lista de mensagens
setMessages(prev => [...prev, audioMessage]);
```

### Configuração no JourneyStep

```tsx
// Exemplo de passo da jornada com áudio
const audioStep = {
  id: 'step-3',
  type: 'media',
  content: 'Ouça esta narração sobre o desenvolvimento da fala:',
  media: {
    type: 'audio',
    url: '/assets/audio/speech-development.mp3',
    duration: 90 // duração em segundos
  }
};
```

## 🧩 Uso Direto dos Componentes

### MediaMessage

```tsx
import MediaMessage from '@/components/titinauta/MediaMessage';

// Em um componente React
<MediaMessage 
  type="image"
  src="/assets/images/development-milestone.jpg"
  alt="Marco de desenvolvimento infantil"
  caption="Bebês de 6-7 meses começam a sentar sem apoio"
  isBot={true}
/>

<MediaMessage 
  type="video"
  src="/assets/videos/motor-coordination.mp4"
  alt="Exercícios de coordenação motora"
  caption="Atividades para estimular a coordenação motora"
  isBot={false}
/>
```

### AudioMessage

```tsx
import AudioMessage from '@/components/titinauta/AudioMessage';

// Em um componente React
<AudioMessage 
  src="/assets/audio/cognitive-development.mp3"
  caption="Desenvolvimento cognitivo de 6-7 meses"
  isBot={true}
/>
```

## 🎨 Personalização de Temas

Os componentes multimídia herdam automaticamente o tema atual do TitiNauta:

```tsx
// O tema é aplicado ao container principal
<div className={`titinauta-chat theme-${currentTheme.name}`}>
  {/* Os componentes multimídia herdam as cores do tema */}
  <MediaMessage ... />
  <AudioMessage ... />
</div>
```

## 📱 Responsividade

Todos os componentes multimídia são responsivos:

- **Imagens**: Ajustam-se ao tamanho do container
- **Vídeos**: Controles adaptáveis para mobile
- **Áudio**: Player compacto em telas pequenas

## 🔄 Integração com Backend

Para servir arquivos multimídia do backend:

```tsx
// URL completa com base no backend
const mediaUrl = `${process.env.REACT_APP_API_URL}/media/${mediaFileName}`;

// Uso em uma mensagem
const mediaMessage = {
  id: 'msg-4',
  type: 'bot',
  content: 'Conteúdo educativo:',
  timestamp: new Date(),
  media: {
    type: 'image',
    url: mediaUrl,
    alt: 'Conteúdo educativo'
  }
};
```

## ⚠️ Tratamento de Erros

Os componentes incluem tratamento de erros para falhas de carregamento:

- Indicador visual de erro
- Mensagem amigável
- Fallback para exibir apenas o texto da mensagem

---

**Versão:** 1.0.0  
**Última Atualização:** 08/10/2025  
**Equipe Educare**
