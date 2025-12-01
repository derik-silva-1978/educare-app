
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import useSmartPEI from './useSmartPEI';
import { PEI } from './usePEI';

export const usePEIOperations = () => {
  const { toast } = useToast();
  const { showNotification } = useSmartPEI();
  const [pei, setPEI] = useState<PEI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load PEI from localStorage or API
  const loadPEI = (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Try to load from localStorage
      const savedData = localStorage.getItem(`pei_${id}`);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData) as PEI;
        setPEI(parsedData);
        setIsLoading(false);
        return;
      }
      
      // If no data found, show error
      const newError = new Error('PEI não encontrado');
      setError(newError);
      toast({
        title: 'PEI não encontrado',
        description: 'Não foi possível encontrar o PEI solicitado',
        variant: 'destructive'
      });
      
    } catch (err) {
      console.error('Error loading PEI:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o PEI',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new PEI
  const createPEI = (peiData: Partial<PEI>): string => {
    try {
      const newPEI: PEI = {
        id: `pei_${Date.now()}`,
        studentId: peiData.studentId || '',
        studentName: peiData.studentName || 'Estudante', // Ensure studentName is always set
        title: peiData.title || `PEI - ${new Date().toLocaleDateString('pt-BR')}`,
        createdDate: new Date().toISOString(),
        startDate: peiData.startDate || new Date().toISOString(),
        endDate: peiData.endDate || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
        assessmentId: peiData.assessmentId || '',
        goals: peiData.goals || [],
        teamMembers: peiData.teamMembers || [],
        reviewFrequency: 'monthly',
        nextReviewDate: peiData.nextReviewDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        status: 'draft',
        notes: peiData.notes || ''
      };
      
      // Save to localStorage
      localStorage.setItem(`pei_${newPEI.id}`, JSON.stringify(newPEI));
      
      showNotification('PEI criado com sucesso!', 'success');
      setPEI(newPEI);
      
      return newPEI.id;
      
    } catch (err) {
      console.error('Error creating PEI:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o PEI',
        variant: 'destructive'
      });
      return '';
    }
  };

  // Create a new PEI from assessment
  const createPEIFromAssessment = (assessment: any): string => {
    try {
      const newPEI: PEI = {
        id: `pei_${Date.now()}`,
        studentId: assessment.studentId,
        studentName: assessment.studentName || 'Estudante', // Ensure studentName is always set
        title: `PEI - ${new Date().toLocaleDateString('pt-BR')}`,
        createdDate: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
        assessmentId: assessment.id,
        goals: [],
        teamMembers: [],
        reviewFrequency: 'monthly',
        nextReviewDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        status: 'draft',
        notes: ''
      };
      
      // Save to localStorage
      localStorage.setItem(`pei_${newPEI.id}`, JSON.stringify(newPEI));
      
      showNotification('PEI criado com sucesso!', 'success');
      setPEI(newPEI);
      
      return newPEI.id;
      
    } catch (err) {
      console.error('Error creating PEI:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o PEI',
        variant: 'destructive'
      });
      return '';
    }
  };

  // Save PEI to localStorage
  const savePEI = () => {
    if (!pei) return;
    
    setIsSaving(true);
    try {
      localStorage.setItem(`pei_${pei.id}`, JSON.stringify(pei));
      showNotification('PEI salvo com sucesso!', 'success');
    } catch (err) {
      console.error('Error saving PEI:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o PEI',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update PEI information
  const updatePEI = (updates: Partial<PEI>) => {
    setPEI(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  };

  // Get a list of all PEIs for a student
  const getStudentPEIs = (studentId: string): PEI[] => {
    const peis: PEI[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('pei_') && !key.includes('_data')) {
        try {
          const peiData = JSON.parse(localStorage.getItem(key) || '');
          if (peiData.studentId === studentId) {
            peis.push(peiData);
          }
        } catch (e) {
          console.error('Error parsing PEI data:', e);
        }
      }
    }
    
    return peis.sort((a, b) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  };

  return {
    pei,
    setPEI,
    isLoading,
    isSaving,
    error,
    loadPEI,
    createPEI,
    createPEIFromAssessment,
    savePEI,
    updatePEI,
    getStudentPEIs
  };
};

export default usePEIOperations;
