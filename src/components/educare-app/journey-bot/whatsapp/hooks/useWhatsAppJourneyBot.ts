import { useState, useCallback, useEffect } from 'react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface UseWhatsAppJourneyBotProps {
  childId: string;
  childAge: number;
}

export const useWhatsAppJourneyBot = ({
  childId,
  childAge
}: UseWhatsAppJourneyBotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentState, setCurrentState] = useState('welcome');
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setIsDataLoaded(true);
    }, 500);
  }, [childId]);

  const startConversation = useCallback(async () => {
    setIsTyping(true);
    setCurrentState('conversation');
    
    // Mensagem inicial do bot
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          sender: 'bot',
          text: `Olá! Vamos conversar sobre o desenvolvimento de sua criança. Ela tem aproximadamente ${childAge} meses, correto?`,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
      setIsWaitingForAnswer(true);
    }, 800);
  }, [childAge]);

  const handleAnswerSelect = useCallback((answer: string) => {
    const userMessage: ChatMessage = {
      id: String(messages.length + 1),
      sender: 'user',
      text: answer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsWaitingForAnswer(false);
    setIsTyping(true);

    // Simular resposta do bot
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: String(messages.length + 2),
        sender: 'bot',
        text: 'Ótimo! Vamos continuar explorando o desenvolvimento nessa fase.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setCurrentQuestionIndex(prev => prev + 1);
      setIsWaitingForAnswer(true);
    }, 1000);
  }, [messages.length]);

  const getProgress = useCallback(() => {
    return ((currentQuestionIndex + 1) / totalQuestions) * 100;
  }, [currentQuestionIndex, totalQuestions]);

  const getCurrentQuestionOptions = useCallback(() => {
    return ['Sim', 'Não', 'Talvez', 'Preciso pensar'];
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const retryCurrentQuestion = useCallback(() => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setIsWaitingForAnswer(true);
    }, 500);
  }, []);

  const getCurrentModuleInfo = useCallback(() => {
    return {
      name: 'Desenvolvimento Infantil',
      description: 'Acompanhando marcos do desenvolvimento',
      icon: 'baby'
    };
  }, []);

  return {
    messages,
    isTyping,
    currentState,
    startConversation,
    handleAnswerSelect,
    getProgress,
    getCurrentQuestionOptions,
    isWaitingForAnswer,
    ageRangeData: { minAge: 0, maxAge: 60 },
    personalizationContext: {},
    isDataLoaded,
    isTransitioning,
    currentQuestionIndex,
    totalQuestions,
    canGoPrevious: currentQuestionIndex > 0,
    canGoNext: currentQuestionIndex < totalQuestions - 1,
    goToPreviousQuestion,
    goToNextQuestion,
    retryCurrentQuestion,
    showExitConfirmation,
    setShowExitConfirmation,
    getCurrentModuleInfo
  };
};
