import { useState, useEffect, useCallback } from 'react';
import { useCustomAuth } from './useCustomAuth';
import { useSelectedChild } from '@/contexts/SelectedChildContext';
import journeyV2Service, {
  JourneyV2,
  JourneyV2Week,
  JourneyV2WithWeeks,
  JourneyV2WeekWithDetails,
  UserJourneyV2Progress,
  UserJourneyV2Badge
} from '@/services/api/journeyV2Service';
import { useToast } from './use-toast';

interface UseJourneyV2Props {
  journeyId?: string;
  weekId?: string;
  autoLoad?: boolean;
}

interface UseJourneyV2Return {
  // Dados
  journeys: JourneyV2[] | null;
  selectedJourney: JourneyV2WithWeeks | null;
  weeks: JourneyV2Week[] | null;
  selectedWeek: JourneyV2WeekWithDetails | null;
  userProgress: UserJourneyV2Progress[] | null;
  userBadges: UserJourneyV2Badge[] | null;
  
  // Estados
  isLoadingJourneys: boolean;
  isLoadingJourney: boolean;
  isLoadingWeeks: boolean;
  isLoadingWeek: boolean;
  isLoadingProgress: boolean;
  isLoadingBadges: boolean;
  isUpdatingProgress: boolean;
  isAwardingBadge: boolean;
  
  // Erros
  journeysError: Error | null;
  journeyError: Error | null;
  weeksError: Error | null;
  weekError: Error | null;
  progressError: Error | null;
  badgesError: Error | null;
  
  // Ações
  loadJourneys: () => Promise<void>;
  loadJourney: (id: string) => Promise<void>;
  loadWeeks: (journeyId: string) => Promise<void>;
  loadWeek: (id: string) => Promise<void>;
  loadUserProgress: (journeyId: string) => Promise<void>;
  loadUserBadges: () => Promise<void>;
  updateProgress: (
    weekId: string,
    data: {
      completedTopics?: string[];
      completedQuizzes?: string[];
      progress?: number;
      completed?: boolean;
    }
  ) => Promise<void>;
  awardBadge: (badgeId: string) => Promise<void>;
}

export const useJourneyV2 = ({
  journeyId,
  weekId,
  autoLoad = true
}: UseJourneyV2Props = {}): UseJourneyV2Return => {
  const { user } = useCustomAuth();
  const { selectedChildId } = useSelectedChild();
  const { toast } = useToast();
  
  // Estados para dados
  const [journeys, setJourneys] = useState<JourneyV2[] | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<JourneyV2WithWeeks | null>(null);
  const [weeks, setWeeks] = useState<JourneyV2Week[] | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<JourneyV2WeekWithDetails | null>(null);
  const [userProgress, setUserProgress] = useState<UserJourneyV2Progress[] | null>(null);
  const [userBadges, setUserBadges] = useState<UserJourneyV2Badge[] | null>(null);
  
  // Estados de loading
  const [isLoadingJourneys, setIsLoadingJourneys] = useState<boolean>(false);
  const [isLoadingJourney, setIsLoadingJourney] = useState<boolean>(false);
  const [isLoadingWeeks, setIsLoadingWeeks] = useState<boolean>(false);
  const [isLoadingWeek, setIsLoadingWeek] = useState<boolean>(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(false);
  const [isLoadingBadges, setIsLoadingBadges] = useState<boolean>(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState<boolean>(false);
  const [isAwardingBadge, setIsAwardingBadge] = useState<boolean>(false);
  
  // Estados de erro
  const [journeysError, setJourneysError] = useState<Error | null>(null);
  const [journeyError, setJourneyError] = useState<Error | null>(null);
  const [weeksError, setWeeksError] = useState<Error | null>(null);
  const [weekError, setWeekError] = useState<Error | null>(null);
  const [progressError, setProgressError] = useState<Error | null>(null);
  const [badgesError, setBadgesError] = useState<Error | null>(null);
  
  // Carregar todas as jornadas
  const loadJourneys = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingJourneys(true);
    setJourneysError(null);
    
    try {
      const data = await journeyV2Service.getAllJourneys();
      setJourneys(data);
    } catch (error) {
      console.error('Erro ao carregar jornadas:', error);
      setJourneysError(error as Error);
      toast({
        title: 'Erro ao carregar jornadas',
        description: 'Não foi possível carregar as jornadas. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingJourneys(false);
    }
  }, [user, toast]);
  
  // Carregar uma jornada específica
  const loadJourney = useCallback(async (id: string) => {
    if (!user) return;
    
    setIsLoadingJourney(true);
    setJourneyError(null);
    
    try {
      const data = await journeyV2Service.getJourneyById(id);
      setSelectedJourney(data);
    } catch (error) {
      console.error(`Erro ao carregar jornada ${id}:`, error);
      setJourneyError(error as Error);
      toast({
        title: 'Erro ao carregar jornada',
        description: 'Não foi possível carregar os detalhes da jornada. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingJourney(false);
    }
  }, [user, toast]);
  
  // Carregar semanas de uma jornada
  const loadWeeks = useCallback(async (journeyId: string) => {
    if (!user) return;
    
    setIsLoadingWeeks(true);
    setWeeksError(null);
    
    try {
      const data = await journeyV2Service.getJourneyWeeks(journeyId);
      setWeeks(data);
    } catch (error) {
      console.error(`Erro ao carregar semanas da jornada ${journeyId}:`, error);
      setWeeksError(error as Error);
      toast({
        title: 'Erro ao carregar semanas',
        description: 'Não foi possível carregar as semanas da jornada. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingWeeks(false);
    }
  }, [user, toast]);
  
  // Carregar uma semana específica
  const loadWeek = useCallback(async (id: string) => {
    if (!user) return;
    
    setIsLoadingWeek(true);
    setWeekError(null);
    
    try {
      const data = await journeyV2Service.getWeekById(id);
      setSelectedWeek(data);
    } catch (error) {
      console.error(`Erro ao carregar semana ${id}:`, error);
      setWeekError(error as Error);
      toast({
        title: 'Erro ao carregar semana',
        description: 'Não foi possível carregar os detalhes da semana. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingWeek(false);
    }
  }, [user, toast]);
  
  // Carregar progresso do usuário em uma jornada
  const loadUserProgress = useCallback(async (journeyId: string) => {
    if (!user) return;
    
    setIsLoadingProgress(true);
    setProgressError(null);
    
    try {
      const data = await journeyV2Service.getUserJourneyProgress(user.id, journeyId);
      setUserProgress(data);
    } catch (error) {
      console.error(`Erro ao carregar progresso do usuário na jornada ${journeyId}:`, error);
      setProgressError(error as Error);
      toast({
        title: 'Erro ao carregar progresso',
        description: 'Não foi possível carregar seu progresso na jornada. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingProgress(false);
    }
  }, [user, toast]);
  
  // Carregar badges do usuário
  const loadUserBadges = useCallback(async () => {
    if (!user || !selectedChildId) return;
    
    setIsLoadingBadges(true);
    setBadgesError(null);
    
    try {
      const data = await journeyV2Service.getUserBadges(user.id, selectedChildId);
      setUserBadges(data);
    } catch (error) {
      console.error('Erro ao carregar badges do usuário:', error);
      setBadgesError(error as Error);
      toast({
        title: 'Erro ao carregar conquistas',
        description: 'Não foi possível carregar suas conquistas. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingBadges(false);
    }
  }, [user, selectedChildId, toast]);
  
  // Atualizar progresso do usuário em uma semana
  const updateProgress = useCallback(async (
    weekId: string,
    data: {
      completedTopics?: string[];
      completedQuizzes?: string[];
      progress?: number;
      completed?: boolean;
    }
  ) => {
    if (!user || !selectedChildId) return;
    
    setIsUpdatingProgress(true);
    
    try {
      await journeyV2Service.updateUserWeekProgress(user.id, weekId, {
        childId: selectedChildId,
        ...data
      });
      
      // Recarregar progresso se estiver em uma jornada específica
      if (journeyId) {
        await loadUserProgress(journeyId);
      }
      
      toast({
        title: 'Progresso atualizado',
        description: 'Seu progresso foi atualizado com sucesso!',
        variant: 'default'
      });
    } catch (error) {
      console.error(`Erro ao atualizar progresso na semana ${weekId}:`, error);
      toast({
        title: 'Erro ao atualizar progresso',
        description: 'Não foi possível atualizar seu progresso. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdatingProgress(false);
    }
  }, [user, selectedChildId, journeyId, loadUserProgress, toast]);
  
  // Conceder uma badge para o usuário
  const awardBadge = useCallback(async (badgeId: string) => {
    if (!user || !selectedChildId) return;
    
    setIsAwardingBadge(true);
    
    try {
      await journeyV2Service.awardUserBadge(user.id, {
        childId: selectedChildId,
        badgeId
      });
      
      // Recarregar badges
      await loadUserBadges();
      
      toast({
        title: 'Nova conquista!',
        description: 'Você recebeu uma nova conquista!',
        variant: 'default'
      });
    } catch (error) {
      console.error(`Erro ao conceder badge ${badgeId}:`, error);
      toast({
        title: 'Erro ao conceder conquista',
        description: 'Não foi possível conceder a conquista. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsAwardingBadge(false);
    }
  }, [user, selectedChildId, loadUserBadges, toast]);
  
  // Carregar dados iniciais
  useEffect(() => {
    if (autoLoad) {
      loadJourneys();
      
      if (journeyId) {
        loadJourney(journeyId);
        loadWeeks(journeyId);
        loadUserProgress(journeyId);
      }
      
      if (weekId) {
        loadWeek(weekId);
      }
      
      loadUserBadges();
    }
  }, [
    autoLoad,
    journeyId,
    weekId,
    loadJourneys,
    loadJourney,
    loadWeeks,
    loadWeek,
    loadUserProgress,
    loadUserBadges
  ]);
  
  return {
    // Dados
    journeys,
    selectedJourney,
    weeks,
    selectedWeek,
    userProgress,
    userBadges,
    
    // Estados
    isLoadingJourneys,
    isLoadingJourney,
    isLoadingWeeks,
    isLoadingWeek,
    isLoadingProgress,
    isLoadingBadges,
    isUpdatingProgress,
    isAwardingBadge,
    
    // Erros
    journeysError,
    journeyError,
    weeksError,
    weekError,
    progressError,
    badgesError,
    
    // Ações
    loadJourneys,
    loadJourney,
    loadWeeks,
    loadWeek,
    loadUserProgress,
    loadUserBadges,
    updateProgress,
    awardBadge
  };
};
