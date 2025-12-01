import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AssessmentForm, AssessmentItem, AssessmentStatus, AssessmentDomain } from '@/types/assessment';
import useAssessmentStorage from './useAssessmentStorage';
import useAssessmentUtils from './useAssessmentUtils';

// Re-export types from the types file
export * from '@/types/assessment';

export const useAssessment = (formId?: string) => {
  const { toast } = useToast();
  const [form, setForm] = useState<AssessmentForm | null>(null);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedLocally, setSavedLocally] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadAttemptedRef = useRef(false);

  // Import utility hooks
  const assessmentStorage = useAssessmentStorage();
  const { calculateProgress, createEmptyForm } = useAssessmentUtils();

  // Load form handler
  const handleLoadForm = async (id: string) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting to load assessment:", id);
      // Try to load existing form
      const formData = await assessmentStorage.getAssessment(id);
      
      if (formData) {
        // Set the form data
        setForm(formData);
        setSavedLocally(true);
        console.log("Assessment loaded successfully:", id);
      } else {
        console.log("Creating new assessment form with ID:", id);
        // Create a new form if none exists
        const newForm = createEmptyForm(id, 'student_unknown');
        setForm(newForm);
        setSavedLocally(false);
        
        // Save the empty form immediately to prevent repeated creation
        try {
          await assessmentStorage.saveAssessment(newForm);
          console.log("Empty form saved with ID:", id);
        } catch (err) {
          console.error("Failed to save initial empty form:", err);
        }
      }
    } catch (error) {
      console.error('Error loading assessment form:', error);
      toast({
        title: 'Erro ao carregar avaliação',
        description: 'Não foi possível carregar os dados da avaliação. Por favor, tente novamente.',
        variant: 'destructive'
      });
      // Set default empty form as fallback
      const newForm = createEmptyForm(id || 'unknown', 'student_unknown');
      setForm(newForm);
      setSavedLocally(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Update a specific assessment item
  const updateItem = (itemId: string, updates: Partial<AssessmentItem>) => {
    if (!form) return;
    
    const updatedItems = form.items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    setForm(prev => {
      if (!prev) return prev;
      return { ...prev, items: updatedItems };
    });
    
    // Set saved state to false when updates are made
    setSavedLocally(false);
  };

  // Update form fields
  const updateForm = (updates: Partial<AssessmentForm>) => {
    setForm(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
    
    // Set saved state to false when updates are made
    setSavedLocally(false);
  };

  // Save progress handler
  const handleSaveProgress = async () => {
    if (!form) return;
    
    try {
      const success = await assessmentStorage.saveAssessment(form);
      if (success) {
        setSavedLocally(true);
        toast({
          title: 'Progresso salvo',
          description: 'Os dados da avaliação foram salvos com sucesso',
        });
      }
    } catch (error) {
      console.error('Error saving assessment progress:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o progresso da avaliação',
        variant: 'destructive'
      });
    }
  };

  // Submit form handler
  const handleSubmitForm = async () => {
    if (!form) return false;
    
    // Validate the form
    const incompleteItems = form.items.filter(item => item.level === null);
    
    if (incompleteItems.length > 0) {
      toast({
        title: 'Formulário incompleto',
        description: `${incompleteItems.length} itens ainda precisam ser avaliados`,
        variant: 'destructive'
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Cast status to AssessmentStatus to ensure type compatibility
      const completedForm: AssessmentForm = {
        ...form,
        status: 'completed',
        updatedAt: new Date().toISOString()
      };
      
      const success = await assessmentStorage.saveAssessment(completedForm);
      
      if (success) {
        setSavedLocally(true);
        toast({
          title: 'Avaliação enviada com sucesso',
          description: 'A avaliação foi finalizada e salva no sistema',
          variant: 'default'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error submitting assessment form:', error);
      toast({
        title: 'Erro ao enviar',
        description: 'Ocorreu um erro ao finalizar a avaliação. Por favor, tente novamente.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load form if ID is provided
  useEffect(() => {
    if (formId && !loadAttemptedRef.current) {
      loadAttemptedRef.current = true;
      handleLoadForm(formId);
    }
  }, [formId]);

  return {
    form,
    progress,
    isSubmitting,
    savedLocally,
    isLoading,
    loadForm: handleLoadForm,
    saveProgress: handleSaveProgress,
    updateItem,
    updateForm,
    submitForm: handleSubmitForm
  };
};

export default useAssessment;
