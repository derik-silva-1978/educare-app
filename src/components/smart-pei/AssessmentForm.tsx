
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Assessment, DevelopmentDomain, AssessmentItem } from '@/types/assessment';
import { useAssessmentData } from '@/hooks/useAssessmentData';
import { AssessmentFormHeader } from './assessment/AssessmentFormHeader';
import { UnsavedProgressAlert } from './assessment/UnsavedProgressAlert';
import { AssessmentDomainNav } from './assessment/AssessmentDomainNav';
import { AssessmentDomainNavFloating } from './assessment/AssessmentDomainNavFloating';
import { AssessmentFormFooter } from './assessment/AssessmentFormFooter';
import { AssessmentLoadingState } from './assessment/AssessmentLoadingState';
import { AssessmentAccordionSections } from './assessment/AssessmentAccordionSections';
import { AssessmentProvider } from './assessment/AssessmentContext';

interface AssessmentFormProps {
  formId: string;
  onComplete?: () => void;
  readOnly?: boolean;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ 
  formId, 
  onComplete, 
  readOnly = false 
}) => {
  const {
    assessment,
    isLoading,
    isSaving,
    progress,
    completedDomains,
    saveAssessment,
    updateItem,
    updateObservation,
    submitAssessment
  } = useAssessmentData(formId);

  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeDomain, setActiveDomain] = useState<DevelopmentDomain>("motor"); // Default to motor
  const [savedLocally, setSavedLocally] = useState(true);

  useEffect(() => {
    if (assessment && assessment.domains.length > 0) {
      const firstDomain = assessment.domains[0] as DevelopmentDomain;
      setActiveDomain(firstDomain);
      setExpandedSections([firstDomain]);
    }
  }, [assessment]);

  useEffect(() => {
    setSavedLocally(false);
  }, [assessment]);

  if (isLoading || !assessment) {
    return <AssessmentLoadingState />;
  }

  const handleSubmitComplete = async () => {
    const success = await submitAssessment();
    if (success && onComplete) {
      onComplete();
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  const scrollToSection = (domain: DevelopmentDomain) => {
    setActiveDomain(domain);
    
    if (!expandedSections.includes(domain)) {
      setExpandedSections(prev => [...prev, domain]);
    }
    
    const element = document.getElementById(`domain-${domain}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveProgress = async () => {
    const success = await saveAssessment();
    if (success) {
      setSavedLocally(true);
    }
  };

  // Adapter function to match the expected signature
  const handleUpdateItem = (item: AssessmentItem) => {
    updateItem(item.id, item);
  };

  return (
    <AssessmentProvider
      initialDomain={activeDomain}
      onUpdateItem={handleUpdateItem}
      onUpdateObservation={updateObservation}
      initialCompletedDomains={completedDomains}
    >
      <Card className="assessment-form w-full border-t-4 border-t-primary shadow-md">
        <AssessmentFormHeader form={assessment} progress={progress} />
        
        <CardContent className="p-6 space-y-6">
          {!readOnly && (
            <UnsavedProgressAlert 
              show={!savedLocally && progress > 0 && progress < 100} 
            />
          )}
          
          <AssessmentDomainNav 
            domains={assessment.domains as DevelopmentDomain[]}
            activeDomain={activeDomain}
            completedDomains={completedDomains}
            onDomainSelect={scrollToSection}
          />
          
          <AssessmentDomainNavFloating
            domains={assessment.domains as DevelopmentDomain[]}
            activeDomain={activeDomain}
            completedDomains={completedDomains}
            onDomainSelect={scrollToSection}
          />
          
          <AssessmentAccordionSections
            form={assessment}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
            completedDomains={completedDomains}
            handleSectionToggle={handleSectionToggle}
            handleObservationChange={updateObservation}
            onUpdateItem={handleUpdateItem}
            readOnly={readOnly}
          />
        </CardContent>
        
        {!readOnly && (
          <CardFooter className="bg-muted/30 px-6 py-4 border-t">
            <AssessmentFormFooter 
              onSave={handleSaveProgress}
              onSubmit={handleSubmitComplete}
              isSubmitting={isSaving}
              progress={progress}
            />
          </CardFooter>
        )}
      </Card>
    </AssessmentProvider>
  );
};

export default AssessmentForm;
