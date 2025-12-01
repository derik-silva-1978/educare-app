
import { useState, useEffect, useRef } from 'react';
import { AssessmentForm, AssessmentItem, AssessmentDomain, AssessmentStatus } from '@/types/assessment';
import { useToast } from '@/hooks/use-toast';
import useAssessmentStorage from './useAssessmentStorage';
import useAssessmentProgress from './useAssessmentProgress';

export const useAssessmentForm = (formId: string) => {
  const [form, setForm] = useState<AssessmentForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedLocally, setSavedLocally] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeDomain, setActiveDomain] = useState<AssessmentDomain | null>(null);
  
  const { toast } = useToast();
  const { getAssessment, saveAssessment } = useAssessmentStorage();
  const { progress, completedDomains, calculateProgress } = useAssessmentProgress();
  
  const domainRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Load assessment from storage
  useEffect(() => {
    const loadAssessment = async () => {
      setIsLoading(true);
      try {
        const assessment = await getAssessment(formId);
        if (assessment) {
          setForm(assessment);
          calculateProgress(assessment);
          
          // Set the first domain as expanded initially
          if (assessment.domains && assessment.domains.length > 0) {
            setExpandedSections([assessment.domains[0]]);
            setActiveDomain(assessment.domains[0]);
          }
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar a avaliação",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error loading assessment:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAssessment();
  }, [formId, getAssessment, toast, calculateProgress]);
  
  // Handle section toggle
  const handleSectionToggle = (domain: string) => {
    setExpandedSections(prev => {
      if (prev.includes(domain)) {
        return prev.filter(item => item !== domain);
      } else {
        return [...prev, domain];
      }
    });
    
    setActiveDomain(domain as AssessmentDomain);
  };
  
  // Handle observation change
  const handleObservationChange = (domain: string, value: string) => {
    if (!form) return;
    
    setForm(prev => {
      if (!prev) return prev;
      
      const updatedForm = { 
        ...prev,
        observations: {
          ...prev.observations,
          [domain]: value
        }
      };
      
      setSavedLocally(false);
      return updatedForm;
    });
  };
  
  // Handle item update
  const handleItemUpdate = (updatedItem: AssessmentItem) => {
    if (!form) return;
    
    setForm(prev => {
      if (!prev) return prev;
      
      const updatedItems = prev.items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      
      const updatedForm = {
        ...prev,
        items: updatedItems
      };
      
      calculateProgress(updatedForm);
      setSavedLocally(false);
      return updatedForm;
    });
  };
  
  // Scroll to section
  const scrollToSection = (domain: AssessmentDomain) => {
    const domainElement = domainRefs.current[domain];
    
    if (domainElement) {
      domainElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Ensure section is expanded
    if (!expandedSections.includes(domain)) {
      setExpandedSections(prev => [...prev, domain]);
    }
    
    setActiveDomain(domain);
  };
  
  // Save progress
  const saveProgress = async () => {
    if (!form) return false;
    
    try {
      const updated = {
        ...form,
        updatedAt: new Date().toISOString()
      };
      
      const success = await saveAssessment(updated);
      
      if (success) {
        setSavedLocally(true);
        toast({
          title: "Progresso salvo",
          description: "As alterações foram salvas com sucesso"
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível salvar as alterações",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as alterações",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Submit form
  const submitForm = async () => {
    if (!form) return false;
    
    setIsSubmitting(true);
    
    try {
      const completed = {
        ...form,
        status: 'completed' as AssessmentStatus,
        updatedAt: new Date().toISOString()
      };
      
      const success = await saveAssessment(completed);
      
      if (success) {
        // Set local flag that form is submitted
        localStorage.setItem(`pei_${form.id}_submitted`, 'true');
        
        toast({
          title: "Avaliação concluída",
          description: "A avaliação foi finalizada com sucesso"
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível finalizar a avaliação",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao finalizar a avaliação",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    progress,
    isSubmitting,
    isLoading,
    savedLocally,
    expandedSections,
    setExpandedSections,
    activeDomain,
    completedDomains,
    domainRefs,
    handleSectionToggle,
    handleObservationChange,
    handleItemUpdate,
    scrollToSection,
    saveProgress,
    submitForm
  };
};

export default useAssessmentForm;
