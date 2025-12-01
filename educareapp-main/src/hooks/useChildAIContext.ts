
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { prepareChildContextForAI, AIChildContext } from '@/utils/ai-context-enrichment';
import { Assessment } from '@/types/assessment';
import { createMockAssessment, generateMockDomainProgress, generateMockMilestones } from '@/utils/mock-assessment-data';

export const useChildAIContext = (childId?: string) => {
  const [childContext, setChildContext] = useState<AIChildContext | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!childId) return;

    const fetchChildContext = async (retryCount = 0) => {
      setIsLoading(true);
      if (retryCount === 0) {
        setError(null); // Só limpa erro na primeira tentativa
      }

      try {
        // Fetch child data from backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/children/${childId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          // Se for erro 401 e ainda não tentou muitas vezes, tenta novamente
          if (response.status === 401 && retryCount < 3) {
            console.log(`🔄 Tentativa ${retryCount + 1}/3 - Erro 401, tentando novamente em 1s...`);
            setTimeout(() => fetchChildContext(retryCount + 1), 1000);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        const childData = result.data;
        
        if (!childData) throw new Error('Child not found');

        // Calculate child age if not available
        const childAge = childData.age || calculateAgeInMonths(childData.birthdate);
        
        // In a production environment, we would fetch real assessments
        // For development, we'll use mock data since the assessments table doesn't exist yet
        
        // Mock assessment data
        const mockAssessments: Assessment[] = [
          createMockAssessment(
            '1', 
            childId, 
            `${childData.first_name} ${childData.last_name}`, 
            childAge
          )
        ];
        
        // Mock domain progress
        const mockDomainProgress = generateMockDomainProgress();
        
        // Mock milestones
        const mockMilestones = generateMockMilestones(childAge);
        
        // Prepare AI context
        const context = prepareChildContextForAI(
          childId,
          `${childData.first_name} ${childData.last_name}`,
          childAge,
          mockAssessments,
          mockDomainProgress,
          mockMilestones
        );
        
        setChildContext(context);
        setError(null); // Limpa qualquer erro anterior em caso de sucesso
        console.log('✅ Child context carregado com sucesso!');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load child context';
        setError(errorMsg);
        
        // Só mostra toast se não for um retry
        if (retryCount === 0) {
          toast({
            title: 'Erro ao carregar contexto',
            description: errorMsg,
            variant: 'destructive'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildContext();
  }, [childId, toast]);

  // Helper to calculate age in months
  const calculateAgeInMonths = (birthdate: string): number => {
    const today = new Date();
    const birth = new Date(birthdate);
    
    const diffMs = today.getTime() - birth.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month
  };

  const refreshContext = async () => {
    if (childId) {
      setIsLoading(true);
      
      try {
        // In a real implementation we would refetch all data
        // For now just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Re-fetch child data from backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/children/${childId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        const childData = result.data;
        
        if (!childData) throw new Error('Child not found');

        // Calculate child age if not available
        const childAge = childData.age || calculateAgeInMonths(childData.birthdate);
        
        // Use mock data for development
        const mockAssessments = [
          createMockAssessment(
            '1', 
            childId, 
            `${childData.first_name} ${childData.last_name}`, 
            childAge
          )
        ];
        
        const mockDomainProgress = generateMockDomainProgress();
        const mockMilestones = generateMockMilestones(childAge);
        
        // Prepare AI context
        const context = prepareChildContextForAI(
          childId,
          `${childData.first_name} ${childData.last_name}`,
          childAge,
          mockAssessments,
          mockDomainProgress,
          mockMilestones
        );
        
        setChildContext(context);
        
        toast({
          title: 'Contexto atualizado',
          description: 'Os dados do assistente IA foram atualizados com sucesso.'
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to refresh context';
        setError(errorMsg);
        
        toast({
          title: 'Erro ao atualizar contexto',
          description: errorMsg,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    childContext,
    isLoading,
    error,
    refreshContext
  };
};
