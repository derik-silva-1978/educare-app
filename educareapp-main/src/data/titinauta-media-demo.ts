import { JourneyContent, MediaContent } from '@/types/titinauta';

/**
 * Dados de demonstração para recursos multimídia do TitiNauta
 * Estes dados podem ser usados para testar os componentes multimídia
 */

// URLs de exemplo para mídia (substituir por URLs reais)
const MEDIA_BASE_URL = '/assets/media';

// Imagens de exemplo
const IMAGES = {
  welcome: `${MEDIA_BASE_URL}/images/titinauta-welcome.jpg`,
  motorDevelopment: `${MEDIA_BASE_URL}/images/motor-development.jpg`,
  cognitiveDevelopment: `${MEDIA_BASE_URL}/images/cognitive-development.jpg`,
  socialDevelopment: `${MEDIA_BASE_URL}/images/social-development.jpg`,
  badge: `${MEDIA_BASE_URL}/images/achievement-badge.jpg`,
};

// Vídeos de exemplo
const VIDEOS = {
  motorExercises: `${MEDIA_BASE_URL}/videos/motor-exercises.mp4`,
  playtime: `${MEDIA_BASE_URL}/videos/playtime-activities.mp4`,
  parentTips: `${MEDIA_BASE_URL}/videos/parent-tips.mp4`,
};

// Áudios de exemplo
const AUDIOS = {
  welcome: `${MEDIA_BASE_URL}/audio/welcome-message.mp3`,
  motorTips: `${MEDIA_BASE_URL}/audio/motor-tips.mp3`,
  cognitiveTips: `${MEDIA_BASE_URL}/audio/cognitive-tips.mp3`,
  lullaby: `${MEDIA_BASE_URL}/audio/lullaby.mp3`,
};

// Exemplo de conteúdo de jornada com recursos multimídia
export const mediaJourneyContent: JourneyContent = {
  id: 'media-journey-demo',
  title: 'Desenvolvimento 6-7 meses (Demo Multimídia)',
  description: 'Demonstração dos recursos multimídia do TitiNauta',
  ageRangeMin: 6,
  ageRangeMax: 7,
  steps: [
    // Boas-vindas com imagem
    {
      id: 'welcome',
      type: 'media',
      content: 'Bem-vindo à jornada de desenvolvimento 6-7 meses! Vamos conhecer os marcos importantes desta fase:',
      media: {
        type: 'image',
        url: IMAGES.welcome,
        alt: 'TitiNauta dando boas-vindas'
      }
    },
    
    // Pergunta inicial
    {
      id: 'question-1',
      type: 'question',
      content: 'Seu bebê consegue sentar sem apoio?',
      options: [
        { id: 'yes', text: 'Sim, consegue' },
        { id: 'sometimes', text: 'Às vezes' },
        { id: 'not-yet', text: 'Ainda não' }
      ]
    },
    
    // Resposta com vídeo
    {
      id: 'motor-video',
      type: 'media',
      content: 'Nesta idade, muitos bebês começam a sentar sem apoio. Veja este vídeo com exercícios para fortalecer os músculos das costas:',
      media: {
        type: 'video',
        url: VIDEOS.motorExercises,
        alt: 'Exercícios para desenvolvimento motor',
        thumbnail: IMAGES.motorDevelopment
      }
    },
    
    // Pergunta sobre desenvolvimento cognitivo
    {
      id: 'question-2',
      type: 'question',
      content: 'Seu bebê procura por objetos que caem ou são escondidos?',
      options: [
        { id: 'yes', text: 'Sim, sempre' },
        { id: 'sometimes', text: 'Às vezes' },
        { id: 'not-yet', text: 'Ainda não' }
      ]
    },
    
    // Resposta com áudio
    {
      id: 'cognitive-audio',
      type: 'media',
      content: 'Isso é um sinal importante de desenvolvimento cognitivo! Ouça estas dicas sobre como estimular a permanência de objeto:',
      media: {
        type: 'audio',
        url: AUDIOS.cognitiveTips,
        duration: 45
      }
    },
    
    // Imagem sobre desenvolvimento social
    {
      id: 'social-image',
      type: 'media',
      content: 'O desenvolvimento social também é muito importante nesta fase. Seu bebê já deve estar:',
      media: {
        type: 'image',
        url: IMAGES.socialDevelopment,
        alt: 'Marcos de desenvolvimento social'
      }
    },
    
    // Pergunta final
    {
      id: 'question-3',
      type: 'question',
      content: 'Seu bebê reage ao próprio nome?',
      options: [
        { id: 'yes', text: 'Sim, sempre' },
        { id: 'sometimes', text: 'Às vezes' },
        { id: 'not-yet', text: 'Ainda não' }
      ]
    },
    
    // Conclusão com áudio
    {
      id: 'conclusion',
      type: 'media',
      content: 'Parabéns por acompanhar o desenvolvimento do seu bebê! Continue estimulando-o diariamente.',
      media: {
        type: 'audio',
        url: AUDIOS.lullaby,
        duration: 60
      }
    },
    
    // Badge de conclusão
    {
      id: 'badge',
      type: 'media',
      content: 'Você ganhou o badge de "Especialista em Desenvolvimento 6-7 meses"!',
      media: {
        type: 'image',
        url: IMAGES.badge,
        alt: 'Badge de conclusão'
      }
    }
  ]
};

// Exemplos de mensagens individuais com mídia
export const mediaMessageExamples = [
  {
    id: 'image-message',
    type: 'bot' as const,
    content: 'Veja esta imagem sobre marcos de desenvolvimento:',
    timestamp: new Date(),
    media: {
      type: 'image',
      url: IMAGES.motorDevelopment,
      alt: 'Marcos de desenvolvimento motor'
    } as MediaContent
  },
  {
    id: 'video-message',
    type: 'bot' as const,
    content: 'Assista este vídeo com dicas para os pais:',
    timestamp: new Date(),
    media: {
      type: 'video',
      url: VIDEOS.parentTips,
      alt: 'Dicas para pais',
      thumbnail: IMAGES.welcome
    } as MediaContent
  },
  {
    id: 'audio-message',
    type: 'bot' as const,
    content: 'Ouça estas dicas para desenvolvimento motor:',
    timestamp: new Date(),
    media: {
      type: 'audio',
      url: AUDIOS.motorTips,
      duration: 30
    } as MediaContent
  }
];

export default mediaJourneyContent;
