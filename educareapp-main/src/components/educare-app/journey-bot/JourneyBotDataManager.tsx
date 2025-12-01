
import React, { createContext, useContext, ReactNode } from 'react';
import { JourneyBotSession, JourneyBotQuestion, JourneyBotResponse } from '@/types/journey-bot';

interface JourneyBotDataContextType {
  session: JourneyBotSession | null;
  questions: JourneyBotQuestion[];
  responses: JourneyBotResponse[];
  currentQuestionIndex: number;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

const JourneyBotDataContext = createContext<JourneyBotDataContextType | null>(null);

interface JourneyBotDataManagerProps {
  children: ReactNode;
  session: JourneyBotSession | null;
  questions: JourneyBotQuestion[];
  responses: JourneyBotResponse[];
  currentQuestionIndex: number;
  isComplete: boolean;
  isLoading: boolean;
  error?: string | null;
}

export const JourneyBotDataManager: React.FC<JourneyBotDataManagerProps> = ({
  children,
  session,
  questions,
  responses,
  currentQuestionIndex,
  isComplete,
  isLoading,
  error = null
}) => {
  const contextValue: JourneyBotDataContextType = {
    session,
    questions,
    responses,
    currentQuestionIndex,
    isComplete,
    isLoading,
    error
  };

  return (
    <JourneyBotDataContext.Provider value={contextValue}>
      {children}
    </JourneyBotDataContext.Provider>
  );
};

export const useJourneyBotData = (): JourneyBotDataContextType => {
  const context = useContext(JourneyBotDataContext);
  if (!context) {
    throw new Error('useJourneyBotData must be used within a JourneyBotDataManager');
  }
  return context;
};

export default JourneyBotDataManager;
