
import { useState, useEffect, useCallback } from 'react';
import { Assessment, AssessmentForm, AssessmentItem, AssessmentStatus, DevelopmentDomain } from '@/types/assessment';
import { AssessmentRepository } from '@/services/AssessmentRepository';
import { useToast } from './use-toast';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

export const useAssessmentData = (assessmentId: string) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedDomains, setCompletedDomains] = useState<Record<DevelopmentDomain, boolean>>({} as Record<DevelopmentDomain, boolean>);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load assessment data
  const loadAssessment = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedAssessment = await AssessmentRepository.getAssessment(assessmentId);
      
      if (loadedAssessment) {
        setAssessment(loadedAssessment);
        
        // Calculate progress
        const calculatedProgress = AssessmentRepository.calculateProgress(loadedAssessment);
        setProgress(calculatedProgress);
        
        // Get completed domains
        const domains = AssessmentRepository.getCompletedDomains(loadedAssessment);
        setCompletedDomains(domains);
      } else {
        // Create a new assessment if not found
        console.log('Assessment not found, creating new one');
        const newAssessment = AssessmentRepository.createNewAssessment({
          id: assessmentId,
          evaluator: user?.name || ''
        });
        setAssessment(newAssessment);
        setProgress(0);
        setCompletedDomains({} as Record<DevelopmentDomain, boolean>);
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
      toast({
        variant: 'destructive',
        title: 'Error loading assessment',
        description: 'Failed to load assessment data. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [assessmentId, toast, user]);

  // Initialize
  useEffect(() => {
    loadAssessment();
  }, [loadAssessment]);

  // Save assessment
  const saveAssessment = async (): Promise<boolean> => {
    if (!assessment) return false;
    
    setIsSaving(true);
    try {
      const result = await AssessmentRepository.saveAssessment(assessment);
      
      if (result.success) {
        toast({
          title: "Assessment saved",
          description: "Your assessment has been saved successfully."
        });
        return true;
      } else {
        throw new Error(result.error || 'Failed to save assessment');
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving assessment',
        description: 'Failed to save assessment. Please try again.'
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update assessment item
  const updateItem = (itemId: string, data: Partial<AssessmentItem>) => {
    if (!assessment) return;
    
    const updatedItems = assessment.items.map(item => 
      item.id === itemId ? { ...item, ...data } : item
    );
    
    const updatedAssessment = {
      ...assessment,
      items: updatedItems
    };
    
    setAssessment(updatedAssessment);
    
    // Recalculate progress
    const calculatedProgress = AssessmentRepository.calculateProgress(updatedAssessment);
    setProgress(calculatedProgress);
    
    // Update completed domains
    const domains = AssessmentRepository.getCompletedDomains(updatedAssessment);
    setCompletedDomains(domains);
  };

  // Update observation for a domain
  const updateObservation = (domain: DevelopmentDomain, observation: string) => {
    if (!assessment) return;
    
    const updatedObservations = {
      ...assessment.observations,
      [domain]: observation
    };
    
    setAssessment({
      ...assessment,
      observations: updatedObservations
    });
  };

  // Submit assessment
  const submitAssessment = async (): Promise<boolean> => {
    if (!assessment) return false;
    
    try {
      const updatedAssessment: Assessment = {
        ...assessment,
        status: 'completed' as AssessmentStatus,
        completed: true
      };
      
      setAssessment(updatedAssessment);
      return await saveAssessment();
    } catch (error) {
      console.error('Error submitting assessment:', error);
      return false;
    }
  };

  return {
    assessment,
    isLoading,
    isSaving,
    progress,
    completedDomains,
    saveAssessment,
    updateItem,
    updateObservation,
    submitAssessment
  };
};

export default useAssessmentData;
