
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AssessmentForm, AssessmentItem } from '@/types/assessmentTypes';
import useAssessmentStorage from '@/hooks/useAssessmentStorage';

interface AssessmentContextType {
  currentAssessment: AssessmentForm | null;
  isLoading: boolean;
  error: string | null;
  loadAssessment: (id: string) => Promise<boolean>;
  saveAssessment: () => Promise<boolean>;
  submitAssessment: () => Promise<boolean>;
  updateAssessmentItem: (itemId: string, updates: Partial<AssessmentItem>) => void;
  updateAssessmentField: (field: keyof AssessmentForm, value: any) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentForm | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const storage = useAssessmentStorage();

  const loadAssessment = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const assessment = await storage.getAssessment(id);
      
      if (assessment) {
        setCurrentAssessment(assessment);
        return true;
      } else {
        setError('Avaliação não encontrada');
        toast({
          title: 'Erro',
          description: 'Não foi possível encontrar a avaliação solicitada',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao carregar a avaliação',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [storage, toast]);

  const saveAssessment = useCallback(async (): Promise<boolean> => {
    if (!currentAssessment) return false;
    
    try {
      const success = await storage.saveAssessment({
        ...currentAssessment,
        updatedAt: new Date().toISOString()
      });
      
      if (success) {
        toast({
          title: 'Salvo com sucesso',
          description: 'A avaliação foi salva com sucesso'
        });
        return true;
      } else {
        toast({
          title: 'Erro ao salvar',
          description: 'Ocorreu um erro ao salvar a avaliação',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar a avaliação',
        variant: 'destructive'
      });
      return false;
    }
  }, [currentAssessment, storage, toast]);

  const submitAssessment = useCallback(async (): Promise<boolean> => {
    if (!currentAssessment) return false;
    
    try {
      const updatedAssessment = {
        ...currentAssessment,
        status: 'completed' as const,
        updatedAt: new Date().toISOString()
      };
      
      const success = await storage.saveAssessment(updatedAssessment);
      
      if (success) {
        setCurrentAssessment(updatedAssessment);
        toast({
          title: 'Avaliação concluída',
          description: 'A avaliação foi finalizada com sucesso'
        });
        return true;
      } else {
        toast({
          title: 'Erro ao concluir',
          description: 'Ocorreu um erro ao finalizar a avaliação',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: 'Erro ao concluir',
        description: 'Ocorreu um erro ao finalizar a avaliação',
        variant: 'destructive'
      });
      return false;
    }
  }, [currentAssessment, storage, toast]);

  const updateAssessmentItem = useCallback((itemId: string, updates: Partial<AssessmentItem>) => {
    if (!currentAssessment) return;
    
    setCurrentAssessment(prev => {
      if (!prev) return prev;
      
      const updatedItems = prev.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );
      
      return {
        ...prev,
        items: updatedItems
      };
    });
  }, [currentAssessment]);

  const updateAssessmentField = useCallback((field: keyof AssessmentForm, value: any) => {
    if (!currentAssessment) return;
    
    setCurrentAssessment(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        [field]: value
      };
    });
  }, [currentAssessment]);

  const value = {
    currentAssessment,
    isLoading,
    error,
    loadAssessment,
    saveAssessment,
    submitAssessment,
    updateAssessmentItem,
    updateAssessmentField
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessmentContext = (): AssessmentContextType => {
  const context = useContext(AssessmentContext);
  
  if (context === undefined) {
    throw new Error('useAssessmentContext must be used within an AssessmentProvider');
  }
  
  return context;
};
