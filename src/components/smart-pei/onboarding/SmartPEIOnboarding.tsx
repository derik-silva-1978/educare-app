
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import OnboardingStepDisplay, { getDefaultSteps } from './OnboardingStepDisplay';
import DashboardMetrics from './DashboardMetrics';
import OnboardingWorkflowTimeline from './OnboardingWorkflowTimeline';

interface SmartPEIOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartPEIOnboarding: React.FC<SmartPEIOnboardingProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = getDefaultSteps();
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      onClose();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Bem-vindo ao Smart PEI
          </DialogTitle>
          <DialogDescription className="text-center pt-2 pb-4">
            Sua plataforma completa para Planos de Ensino Individualizado com recursos de IA,
            colaboração em tempo real e acompanhamento detalhado.
          </DialogDescription>
        </DialogHeader>
        
        {/* Current Step Display */}
        <OnboardingStepDisplay 
          currentStep={currentStep} 
          steps={steps} 
        />
        
        {/* Dashboard Metrics */}
        <DashboardMetrics />
        
        {/* Workflow Timeline */}
        <OnboardingWorkflowTimeline 
          steps={steps} 
          currentStep={currentStep} 
        />
        
        <DialogFooter className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <Button 
            onClick={handleNext}
            className="flex items-center"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Começar
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SmartPEIOnboarding;
