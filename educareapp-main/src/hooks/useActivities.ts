import { useState, useEffect, useCallback } from 'react';
import { Activity, ActivityStatus } from '@/types/activity';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';

// Define a modified Activity type that uses string for dates to avoid type errors
export interface ActivityWithStringDates extends Omit<Activity, 'startDate' | 'endDate' | 'reminderDate'> {
  startDate: string;
  endDate?: string;
  reminderDate?: string;
}

// Mock activities data
const mockActivities: ActivityWithStringDates[] = [
  {
    id: '1',
    title: 'Avaliação Inicial',
    description: 'Avaliação inicial das habilidades cognitivas do aluno',
    status: 'completed',
    priority: 'high',
    startDate: '2023-10-10T10:00:00',
    endDate: '2023-10-10T11:30:00',
    studentId: '101',
    studentName: 'João Silva',
    createdAt: '2023-09-30T08:00:00',
    updatedAt: '2023-10-11T08:30:00'
  },
  {
    id: '2',
    title: 'Sessão de Fonoaudiologia',
    description: 'Sessão de 45 minutos para trabalhar a dicção e a fluência verbal',
    status: 'in_progress',
    priority: 'medium',
    startDate: '2023-10-15T14:00:00',
    endDate: '2023-10-15T14:45:00',
    studentId: '102',
    studentName: 'Maria Oliveira',
    createdAt: '2023-10-05T11:00:00',
    updatedAt: '2023-10-12T15:00:00'
  },
  {
    id: '3',
    title: 'Reunião com os Pais',
    description: 'Reunião para discutir o progresso do aluno e ajustar o PEI',
    status: 'pending',
    priority: 'high',
    startDate: '2023-10-20T16:00:00',
    endDate: '2023-10-20T17:00:00',
    studentId: '101',
    studentName: 'João Silva',
    createdAt: '2023-10-10T09:00:00',
    updatedAt: '2023-10-18T10:00:00'
  },
  {
    id: '4',
    title: 'Atividade de Reforço em Matemática',
    description: 'Atividade individualizada para reforçar conceitos matemáticos',
    status: 'pending',
    priority: 'medium',
    startDate: '2023-11-01T09:30:00',
    endDate: '2023-11-01T10:30:00',
    studentId: '103',
    studentName: 'Carlos Pereira',
    createdAt: '2023-10-25T14:00:00',
    updatedAt: '2023-10-28T16:00:00'
  },
  {
    id: '5',
    title: 'Sessão de Psicoterapia',
    description: 'Sessão de psicoterapia para abordar questões emocionais e comportamentais',
    status: 'completed',
    priority: 'high',
    startDate: '2023-11-05T15:00:00',
    endDate: '2023-11-05T16:00:00',
    studentId: '102',
    studentName: 'Maria Oliveira',
    createdAt: '2023-10-30T10:00:00',
    updatedAt: '2023-11-06T09:00:00'
  }
];

export const useActivities = () => {
  const [activities, setActivities] = useState<ActivityWithStringDates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Filter activities for upcoming activities
  const upcomingActivities = activities.filter(activity => 
    activity.status !== 'completed' && 
    activity.status !== 'cancelled' && 
    new Date(activity.startDate) > new Date()
  );

  // Filter activities that need attention (past due)
  const attentionActivities = activities.filter(activity => 
    activity.status !== 'completed' && 
    activity.status !== 'cancelled' && 
    new Date(activity.startDate) < new Date()
  );

  const loadActivities = useCallback(async (filters = {}) => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      // For demo, use mock data with a delay
      setTimeout(() => {
        setActivities(mockActivities);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading activities:', error);
      setIsLoading(false);
    }
  }, []);

  const addActivity = useCallback(async (activityData: Omit<ActivityWithStringDates, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);

      // Prepare activity data with current user information
      const currentUserName = currentUser?.name || 'Unknown User';
      const newActivity: ActivityWithStringDates = {
        ...activityData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser?.id,
        assignedToName: currentUserName,
      };

      setActivities(prev => [...prev, newActivity]);
      toast({
        title: "Atividade criada",
        description: "A atividade foi criada com sucesso!"
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error adding activity:', error);
      setIsLoading(false);
    }
  }, [currentUser, toast]);

  const updateActivity = useCallback((id: string, updatedData: Partial<ActivityWithStringDates>) => {
    setActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === id
          ? { 
              ...activity, 
              ...updatedData, 
              updatedAt: new Date().toISOString(),
              assignedToName: updatedData.assignedTo 
                ? currentUser?.name || activity.assignedToName 
                : activity.assignedToName
            }
          : activity
      )
    );

    toast({
      title: "Atividade atualizada",
      description: "As alterações foram salvas com sucesso."
    });
  }, [currentUser, toast]);

  const updateActivityStatus = useCallback((id: string, status: ActivityStatus) => {
    setActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === id
          ? { 
              ...activity, 
              status, 
              updatedAt: new Date().toISOString(),
              completedBy: status === 'completed' ? currentUser?.id : undefined,
              completedByName: status === 'completed' ? currentUser?.name : undefined,
              completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            }
          : activity
      )
    );

    const statusMessages = {
      pending: "Atividade marcada como pendente",
      in_progress: "Atividade marcada como em andamento",
      completed: "Atividade marcada como concluída",
      cancelled: "Atividade cancelada",
    };

    toast({
      title: statusMessages[status] || "Status atualizado",
      description: "O status da atividade foi atualizado com sucesso."
    });
  }, [currentUser, toast]);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prevActivities => 
      prevActivities.filter(activity => activity.id !== id)
    );

    toast({
      title: "Atividade excluída",
      description: "A atividade foi removida com sucesso."
    });
  }, [toast]);

  // Load activities on mount
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    upcomingActivities,
    attentionActivities,
    isLoading,
    loadActivities,
    addActivity,
    updateActivity,
    updateActivityStatus,
    deleteActivity
  };
};
