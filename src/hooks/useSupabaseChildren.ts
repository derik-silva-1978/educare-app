
import { useState, useEffect } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { httpClient } from '@/services/api/httpClient';
import { useToast } from '@/hooks/use-toast';
import { calculateAge } from '@/utils/dateUtils';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  gender: string;
  city?: string;
  bloodtype?: string;
  user_id: string;
  journey_progress?: number;
  age: number;
  observations?: string;
}

interface BackendChild {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  avatarUrl?: string;
  notes?: string;
  profileId: string;
  userId: string;
  specialNeeds?: Record<string, unknown>;
  medicalInfo?: Record<string, unknown>;
  educationalInfo?: Record<string, unknown>;
  developmentMilestones?: Record<string, unknown>;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const useSupabaseChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchChildren = async () => {
    if (!user) {
      setChildren([]);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);

      console.log('Fetching children for user:', user.id);

      const response = await httpClient.get<{ children: BackendChild[] }>('/children');

      if (!response.success || !response.data?.children) {
        throw new Error(response.error || 'Erro ao buscar crianças');
      }

      const backendChildren = response.data.children;
      console.log('Children fetched successfully:', backendChildren.length);

      const childrenWithAge: Child[] = backendChildren.map(child => {
        const ageData = calculateAge(child.birthDate);
        return {
          id: child.id,
          first_name: child.firstName,
          last_name: child.lastName,
          birthdate: child.birthDate,
          gender: child.gender,
          user_id: child.userId,
          observations: child.notes,
          age: ageData.years
        };
      });

      setChildren(childrenWithAge);
    } catch (error: unknown) {
      console.error('Error in fetchChildren:', error);
      setIsError(true);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível carregar a lista de crianças.';
      toast({
        title: "Erro ao carregar crianças",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshListing = () => {
    console.log('Refreshing children list...');
    fetchChildren();
  };

  useEffect(() => {
    fetchChildren();
  }, [user]);

  return {
    children,
    isLoading,
    isError,
    refreshListing
  };
};
