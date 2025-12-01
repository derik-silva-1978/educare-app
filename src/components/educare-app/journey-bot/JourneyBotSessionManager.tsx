
import React, { useEffect, useState } from 'react';
import { useJourneyBotSession } from '@/hooks/educare-app/useJourneyBotSession';
import JourneyBotChat from './JourneyBotChat';
import JourneyBotLoading from './JourneyBotLoading';
import JourneyBotErrorState from './JourneyBotErrorState';

interface Child {
  id: string;
  name: string;
  age: number;
}

interface JourneyBotSessionManagerProps {
  child: Child;
  onBack: () => void;
}

const JourneyBotSessionManager: React.FC<JourneyBotSessionManagerProps> = ({ 
  child, 
  onBack 
}) => {
  const [error, setError] = useState<string | null>(null);
  
  const {
    currentSession,
    questions,
    isLoading,
    isCreatingSession
  } = useJourneyBotSession({ 
    childId: child.id, 
    childAge: child.age 
  });

  // Handle session creation errors
  useEffect(() => {
    if (!isLoading && !isCreatingSession && !currentSession && questions.length > 0) {
      setError('Falha ao criar sessão. Tente novamente.');
    }
  }, [isLoading, isCreatingSession, currentSession, questions.length]);

  // Handle age-related errors
  useEffect(() => {
    if (!isLoading && questions.length === 0 && child.age > 0) {
      setError(`Não encontramos perguntas adequadas para a idade de ${child.name} (${child.age} anos).`);
    }
  }, [isLoading, questions.length, child.age, child.name]);

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Loading state
  if (isLoading || isCreatingSession) {
    return <JourneyBotLoading childName={child.name} />;
  }

  // Error state
  if (error) {
    return (
      <JourneyBotErrorState
        error={error}
        onRetry={handleRetry}
        onBack={onBack}
      />
    );
  }

  // Success state - render the chat
  return (
    <JourneyBotChat
      child={child}
      onBack={onBack}
    />
  );
};

export default JourneyBotSessionManager;
