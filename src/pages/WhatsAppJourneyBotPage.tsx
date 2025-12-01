import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChildAIContext } from '@/hooks/useChildAIContext';
import { WhatsAppWelcomeScreen } from '@/components/educare-app/journey-bot/whatsapp/WhatsAppWelcomeScreen';
import { WhatsAppChatContainer } from '@/components/educare-app/journey-bot/whatsapp/WhatsAppChatContainer';
import { useWhatsAppJourneyBot } from '@/components/educare-app/journey-bot/whatsapp/hooks/useWhatsAppJourneyBot';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const WhatsAppJourneyBotPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { childContext, isLoading: childLoading, error } = useChildAIContext(childId);
  const [hasStarted, setHasStarted] = useState(false);

  const {
    messages,
    isTyping,
    currentState,
    startConversation,
    handleAnswerSelect,
    getProgress,
    getCurrentQuestionOptions,
    isWaitingForAnswer,
    ageRangeData,
    personalizationContext,
    isDataLoaded,
    isTransitioning,
    // Navigation
    currentQuestionIndex,
    totalQuestions,
    canGoPrevious,
    canGoNext,
    goToPreviousQuestion,
    goToNextQuestion,
    retryCurrentQuestion,
    showExitConfirmation,
    setShowExitConfirmation,
    // Module info
    getCurrentModuleInfo
  } = useWhatsAppJourneyBot({
    childId: childId || '',
    childAge: childContext?.childAge || 0
  });

  const handleStart = async () => {
    setHasStarted(true);
    await startConversation();
  };

  const handleBack = () => {
    if (hasStarted) {
      setHasStarted(false);
    } else {
      navigate(`/educare-app/child/${childId}`);
    }
  };

  if (childLoading || !isDataLoaded) {
    return (
      <div className="container py-6 flex items-center justify-center min-h-[600px]">
        <Card className="p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <span className="text-gray-600">Preparando a conversa com o TitiNauta...</span>
          </div>
        </Card>
      </div>
    );
  }

  // Aguardar carregamento inicial antes de mostrar erro
  if (childLoading || !isDataLoaded) {
    return (
      <div className="container py-6 flex items-center justify-center min-h-[600px]">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Preparando a conversa com o TitiNauta...
          </h2>
          <p className="text-gray-600">
            Carregando dados da criança e inicializando o sistema.
          </p>
        </Card>
      </div>
    );
  }

  // Só mostrar erro se realmente houve falha após tentativa de carregamento
  if (error && !isDataLoaded) {
    return (
      <div className="container py-6 flex items-center justify-center min-h-[600px]">
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Ops! Não foi possível carregar os dados
          </h2>
          <p className="text-gray-600 mb-4">
            Verifique se os dados da criança estão corretos e tente novamente.
          </p>
          <button 
            onClick={() => navigate(`/educare-app/child/${childId}`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Voltar
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      {!hasStarted ? (
        <WhatsAppWelcomeScreen
          onStart={handleStart}
          childName={personalizationContext.childName}
          ageRange={ageRangeData.title}
        />
      ) : (
        <WhatsAppChatContainer
          messages={messages}
          isTyping={isTyping}
          currentQuestionOptions={getCurrentQuestionOptions()}
          onAnswerSelect={handleAnswerSelect}
          onBack={handleBack}
          childName={personalizationContext.childName}
          ageRange={ageRangeData.title}
          progress={getProgress()}
          isWaitingForAnswer={isWaitingForAnswer}
          moduleInfo={getCurrentModuleInfo()}
          // Navigation props
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPrevious={goToPreviousQuestion}
          onNext={goToNextQuestion}
          onRetry={retryCurrentQuestion}
          showNavigation={true}
          isLoading={isTyping || isTransitioning}
          currentState={currentState}
          isTransitioning={isTransitioning}
        />
      )}
    </div>
  );
};

export default WhatsAppJourneyBotPage;