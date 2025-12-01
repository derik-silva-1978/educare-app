export interface UseJourneyBotSessionProps {
  childId: string;
  childAge: number;
}

export interface UseJourneyBotSessionReturn {
  currentSession: any | null;
  questions: any[];
  isLoading: boolean;
  isCreatingSession: boolean;
  error: string | null;
  refreshSession: () => void;
}