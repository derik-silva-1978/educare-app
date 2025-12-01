import React, { useEffect, useRef } from 'react';
import { WhatsAppHeader } from './WhatsAppHeader';
import { WhatsAppMessageBubble } from './WhatsAppMessageBubble';
import { WhatsAppAnswerButtons } from './WhatsAppAnswerButtons';
import { WhatsAppTypingIndicator } from './WhatsAppTypingIndicator';
import WhatsAppNavigationControls from './WhatsAppNavigationControls';

export interface WhatsAppMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface WhatsAppChatContainerProps {
  messages: WhatsAppMessage[];
  isTyping: boolean;
  currentQuestionOptions?: Array<{
    value: number;
    text: string;
    emoji: string;
  }>;
  onAnswerSelect: (value: number, text: string) => void;
  onBack: () => void;
  childName: string;
  ageRange: string;
  progress: number;
  isWaitingForAnswer: boolean;
  moduleInfo?: {
    currentQuestionInModule: number;
    totalQuestionsInModule: number;
    moduleName: string;
  };
  // Navigation props
  currentQuestionIndex?: number;
  totalQuestions?: number;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onRetry?: () => void;
  showNavigation?: boolean;
  isLoading?: boolean;
  currentState?: string;
  isTransitioning?: boolean;
}

export const WhatsAppChatContainer: React.FC<WhatsAppChatContainerProps> = ({
  messages,
  isTyping,
  currentQuestionOptions,
  onAnswerSelect,
  onBack,
  childName,
  ageRange,
  progress,
  isWaitingForAnswer,
  moduleInfo,
  // Navigation props
  currentQuestionIndex = 0,
  totalQuestions = 0,
  canGoPrevious = false,
  canGoNext = false,
  onPrevious = () => {},
  onNext = () => {},
  onRetry = () => {},
  showNavigation = false,
  isLoading = false,
  currentState,
  isTransitioning = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Debug logging para entender estado de renderização
  useEffect(() => {
    console.log('🔍 WhatsAppChatContainer Debug:', {
      messagesCount: messages.length,
      isTyping,
      hasAnswerOptions: currentQuestionOptions && currentQuestionOptions.length > 0,
      isWaitingForAnswer,
      isLoading,
      currentState,
      isTransitioning,
      currentQuestionIndex,
      totalQuestions,
      canGoNext,
      canGoPrevious
    });
  }, [messages, isTyping, currentQuestionOptions, isWaitingForAnswer, isLoading, currentState, isTransitioning, currentQuestionIndex, totalQuestions, canGoNext, canGoPrevious]);

  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl shadow-2xl flex flex-col h-[700px] overflow-hidden border border-gray-200">
      <WhatsAppHeader
        onBack={onBack}
        childName={childName}
        ageRange={ageRange}
        progress={progress}
        currentQuestionInModule={moduleInfo?.currentQuestionInModule || 1}
        totalQuestionsInModule={moduleInfo?.totalQuestionsInModule || 5}
        moduleName={moduleInfo?.moduleName || "0-1 meses"}
      />

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#e5ddd5] relative">
        {/* WhatsApp pattern background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {messages.map((message) => (
          <WhatsAppMessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <WhatsAppTypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Simplified rendering logic - one interface at a time */}
      {currentState === 'question' && currentQuestionOptions && isWaitingForAnswer && !isLoading && (
        <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200/50">
          <WhatsAppAnswerButtons
            options={currentQuestionOptions}
            onSelect={onAnswerSelect}
          />
        </div>
      )}

      {/* Loading indicator during processing and transition */}
      {(isLoading || currentState === 'processing' || isTransitioning) && (
        <div className="flex items-center justify-center p-4 bg-muted/50 rounded-xl mx-4 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin">⏳</div>
            <span>
              {currentState === 'processing' && 'Processando resposta...'}
              {isTransitioning && 'Carregando próxima pergunta...'}
              {isLoading && !currentState && 'Carregando...'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Controls - Only when ready to advance */}
      {currentState === 'ready_to_advance' && !isLoading && !isTransitioning && (
        <div className="animate-fade-in">
          <WhatsAppNavigationControls
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            onPrevious={onPrevious}
            onNext={onNext}
            onRetry={onRetry}
            isAnswered={true}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};