import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useTitiNautaProgress } from '@/hooks/useTitiNautaProgress';
import useTitiNautaBadges from '@/hooks/useTitiNautaBadges';
import useTitiNautaTheme from '@/hooks/useTitiNautaTheme';
import Celebration from './Celebration';

// Componentes
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuizOptions from './QuizOptions';

// Tipos
import { Message, JourneyContent, QuizOption } from '@/types/titinauta';

import './TitiNautaChat.css';

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

const TitiNautaChat: React.FC<TitiNautaChatProps> = ({
  childId,
  ageInMonths,
  child,
  journeyContent: initialJourneyContent,
  isLoading: isLoadingInitial
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Hooks para gerenciar o progresso, badges e tema
  const { saveProgress, saveAnswer, isSaving } = useTitiNautaProgress();
  const { unlockBadge } = useTitiNautaBadges(childId);
  const { currentTheme } = useTitiNautaTheme(childId);

  // Rolar para o final da conversa quando novas mensagens chegarem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inicializar chat quando o conteúdo for carregado
  useEffect(() => {
    if (initialJourneyContent && !isLoadingInitial && child) {
      // Inicializar chat com a primeira mensagem
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          content: `Olá! Vamos conversar sobre o desenvolvimento do ${child.name} no módulo ${ageInMonths}-${ageInMonths+1} meses! 🌟`,
          timestamp: new Date()
        }
      ]);
      
      // Simular digitação para a primeira pergunta/conteúdo
      setTimeout(() => {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          
          if (initialJourneyContent?.steps && initialJourneyContent.steps.length > 0) {
            const firstStep = initialJourneyContent.steps[0];
            setMessages(prev => [...prev, {
              id: `bot-${Date.now()}`,
              type: 'bot',
              content: firstStep.content,
              timestamp: new Date(),
              media: firstStep.media
            }]);
          }
        }, 1500);
      }, 1000);
    }
  }, [initialJourneyContent, isLoadingInitial, child, ageInMonths]);

  // Processar resposta do usuário
  const handleUserResponse = async (response: string | QuizOption) => {
    // Adicionar resposta do usuário ao chat
    const responseContent = typeof response === 'string' ? response : response.text;
    
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: 'user',
      content: responseContent,
      timestamp: new Date()
    }]);
    
    // Avançar para o próximo passo
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    // Verificar se há próximo conteúdo
    if (initialJourneyContent?.steps && nextStep < initialJourneyContent.steps.length) {
      // Simular digitação
      setTimeout(() => {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          
          const nextStepContent = initialJourneyContent.steps[nextStep];
          setMessages(prev => [...prev, {
            id: `bot-${Date.now()}`,
            type: 'bot',
            content: nextStepContent.content,
            timestamp: new Date(),
            media: nextStepContent.media
          }]);
        }, 1500);
      }, 1000);
    } else {
      // Módulo completado
      setTimeout(() => {
        setShowCelebration(true);
        
        // Desbloquear conquistas
        unlockBadge('first_conversation');
        
        // Desbloquear badge baseado no domínio, se disponível
        if (initialJourneyContent?.steps && initialJourneyContent.steps.length > 0) {
          const domainStep = initialJourneyContent.steps.find(step => 
            step.type === 'question' && step.id.includes('domain'));
            
          if (domainStep) {
            const domainId = domainStep.id.split('-')[0];
            
            if (domainId === 'communication') {
              unlockBadge('communication_expert');
            } else if (domainId === 'motor') {
              unlockBadge('motor_expert');
            } else if (domainId === 'cognitive') {
              unlockBadge('cognitive_expert');
            }
          }
          
          // Desbloquear badge de módulo completo
          unlockBadge('full_month');
        }
      }, 1000);
    }
    
    // Salvar resposta com API
    if (initialJourneyContent?.steps[currentStep]?.type === 'question') {
      const questionId = initialJourneyContent.steps[currentStep].id;
      const selectedOptionId = typeof response === 'string' ? response : response.id;
      
      // Usar o hook para salvar resposta
      const success = await saveAnswer(childId, questionId, selectedOptionId);
      
      if (success) {
        // Atualizar progresso
        const completedSteps = messages
          .filter(msg => msg.type === 'user')
          .map(msg => msg.id.replace('user-', ''));
        
        await saveProgress(childId, initialJourneyContent.id, currentStep + 1, completedSteps);
      }
    }
  };

  // Exibir loading
  if (isLoadingInitial || isSaving) {
    return (
      <div className="titinauta-loading">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p>Carregando conversa com TitiNauta...</p>
      </div>
    );
  }

  // Exibir erro
  if (error || !child || !initialJourneyContent) {
    return (
      <div className="titinauta-error">
        <p>Não foi possível carregar a conversa com TitiNauta.</p>
        <button className="btn-retry">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className={`titinauta-chat theme-${currentTheme.name}`}>
      {showCelebration && (
        <Celebration
          title="Módulo Completado!"
          message={`Parabéns! Você completou o módulo ${ageInMonths}-${ageInMonths+1} meses.`}
          onComplete={() => setShowCelebration(false)}
        />
      )}
      <ChatHeader 
        childName={child?.name || ''}
        ageRange={`${ageInMonths}-${ageInMonths+1} meses`}
        progress={(currentStep / (initialJourneyContent?.steps?.length || 1)) * 100}
      />
      
      <div className="chat-messages">
        {messages.map(message => (
          <ChatMessage 
            key={message.id}
            message={message}
            isBot={message.type === 'bot'}
          />
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        {initialJourneyContent?.steps && currentStep < initialJourneyContent.steps.length && (
          initialJourneyContent.steps[currentStep].type === 'question' && initialJourneyContent.steps[currentStep].options ? (
            <QuizOptions 
              options={initialJourneyContent.steps[currentStep].options}
              onSelect={handleUserResponse}
            />
          ) : (
            <ChatInput onSend={handleUserResponse} />
          )
        )}
      </div>
    </div>
  );
};

export default TitiNautaChat;
