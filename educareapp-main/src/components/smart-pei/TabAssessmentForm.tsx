
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAssessmentData } from '@/hooks/useAssessmentData';
import { getDomainDisplayName, DevelopmentDomain, AssessmentItem } from '@/types/assessment';
import { AssessmentFormHeader } from './assessment/AssessmentFormHeader';
import { UnsavedProgressAlert } from './assessment/UnsavedProgressAlert';
import { AssessmentFormFooter } from './assessment/AssessmentFormFooter';
import { AssessmentLoadingState } from './assessment/AssessmentLoadingState';
import { AssessmentDomainSection } from './AssessmentDomainSection';
import { AssessmentObservations } from './assessment/AssessmentObservations';
import { AutoSaveStatus } from './assessment/AutoSaveStatus';
import { useAutoSave } from '@/hooks/useAutoSave';
import useLocalStorage from '@/hooks/useLocalStorage';

interface TabAssessmentFormProps {
  formId: string;
  onComplete?: () => void;
  readOnly?: boolean;
}

export const TabAssessmentForm: React.FC<TabAssessmentFormProps> = ({ 
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

  const [activeTab, setActiveTab] = useState<DevelopmentDomain | ''>('');
  const [savedLocally, setSavedLocally] = useState(true);
  const [autoSaveSettings] = useLocalStorage('pei_autosave_settings', {
    enabled: true,
    interval: 30,
    showNotifications: true
  });

  // Set initial active tab when form loads
  useEffect(() => {
    if (assessment && assessment.domains && assessment.domains.length > 0) {
      setActiveTab(assessment.domains[0] as DevelopmentDomain);
    }
  }, [assessment]);

  // Set unsaved changes when assessment updates
  useEffect(() => {
    setSavedLocally(false);
  }, [assessment]);

  // Auto-save functionality
  const autoSave = useAutoSave({
    data: assessment,
    onSave: saveAssessment,
    options: {
      enabled: autoSaveSettings.enabled && !readOnly,
      showSuccessToast: autoSaveSettings.showNotifications
    }
  });

  if (isLoading || !assessment) {
    return <AssessmentLoadingState />;
  }

  const handleSaveProgress = async () => {
    const success = await saveAssessment();
    if (success) {
      setSavedLocally(true);
    }
  };

  const handleSubmitComplete = async () => {
    const success = await submitAssessment();
    if (success && onComplete) {
      onComplete();
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as DevelopmentDomain);
  };

  const handleItemUpdate = (item: AssessmentItem) => {
    updateItem(item.id, item);
  };

  return (
    <Card className="assessment-form w-full border-t-4 border-t-primary shadow-md">
      <AssessmentFormHeader form={assessment} progress={progress} />
      
      <CardContent className="p-6 space-y-6">
        {!readOnly && (
          <UnsavedProgressAlert 
            show={!savedLocally && progress > 0 && progress < 100} 
            onSave={handleSaveProgress}
          />
        )}
        
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList className="mb-4 overflow-x-auto flex-wrap">
              {assessment.domains.map((domain) => (
                <TabsTrigger
                  key={domain}
                  value={domain}
                  className="relative px-4 py-2"
                >
                  {getDomainDisplayName(domain as DevelopmentDomain)}
                  {completedDomains[domain as DevelopmentDomain] && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {!readOnly && (
              <AutoSaveStatus 
                status={autoSave.status}
                lastSavedTime={autoSave.formatLastSaved()}
                onManualSave={handleSaveProgress}
              />
            )}
          </div>
          
          {assessment.domains.map((domain) => (
            <TabsContent key={domain} value={domain} className="space-y-6">
              <AssessmentDomainSection
                form={assessment}
                domain={domain}
                readOnly={readOnly}
                onUpdate={handleItemUpdate}
              />
              
              <div className="pt-4 border-t">
                <AssessmentObservations
                  domain={domain as DevelopmentDomain}
                  value={assessment.observations?.[domain] || ''}
                  onChange={(value) => updateObservation(domain as DevelopmentDomain, value)}
                  readOnly={readOnly}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
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
  );
};

export default TabAssessmentForm;
