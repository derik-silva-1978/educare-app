// Tipos para o TitiNauta

export interface MediaContent {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  duration?: number; // Para áudio e vídeo
  thumbnail?: string; // Para vídeo
}

export interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  media?: MediaContent;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface JourneyStep {
  id: string;
  type: 'message' | 'question' | 'media';
  content: string;
  options?: QuizOption[];
  media?: MediaContent;
}

export interface JourneyContent {
  id: string;
  title: string;
  description?: string;
  ageRangeMin: number;
  ageRangeMax: number;
  steps: JourneyStep[];
}

export interface JourneyProgress {
  childId: string;
  journeyId: string;
  completedSteps: string[];
  lastCompletedAt: Date;
  currentStep: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  answeredAt: Date;
}

export interface TitiNautaState {
  childId: string;
  currentJourneyId: string;
  messages: Message[];
  progress: JourneyProgress;
  quizAnswers: QuizAnswer[];
}
