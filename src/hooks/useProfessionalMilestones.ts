import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '@/services/api/httpClient';

export type MilestoneStatus = 'achieved' | 'in_progress' | 'pending';

export type Milestone = {
  id: string;
  title: string;
  description: string | null;
  category: 'motor' | 'cognitivo' | 'linguagem' | 'social' | 'emocional' | 'sensorial';
  targetMonth: number;
  status: MilestoneStatus;
  source: string;
};

export type MilestonesSummary = {
  total: number;
  achieved: number;
  inProgress: number;
  pending: number;
};

export type ChildMilestonesData = {
  child: {
    id: string;
    name: string;
    birthDate: string;
    ageInMonths: number;
  };
  milestones: Milestone[];
  byCategory: Record<string, Milestone[]>;
  summary: MilestonesSummary;
};

export function useProfessionalMilestones(childId: string | null) {
  const [data, setData] = useState<ChildMilestonesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestones = useCallback(async () => {
    if (!childId) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await httpClient.get(`/milestones/child/${childId}`);
      
      if (response.data.success) {
        setData(response.data);
      } else {
        setError(response.data.error || 'Erro ao buscar marcos');
      }
    } catch (err: any) {
      console.error('Erro ao buscar marcos:', err);
      setError(err.response?.data?.error || 'Erro ao buscar marcos do desenvolvimento');
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMilestones
  };
}
