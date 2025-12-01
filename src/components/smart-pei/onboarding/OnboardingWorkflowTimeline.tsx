
import React from 'react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingWorkflowTimelineProps {
  steps: Step[];
  currentStep: number;
}

const OnboardingWorkflowTimeline: React.FC<OnboardingWorkflowTimelineProps> = ({ 
  steps,
  currentStep
}) => {
  // Calculate which workflow step to highlight based on current tour step
  const getWorkflowStep = () => {
    if (currentStep <= 1) return 1; // Welcome or Dashboard
    if (currentStep <= 3) return 2; // AI Support or Student Management
    if (currentStep <= 5) return 3; // Multidimensional Evaluation or Collaboration
    return 4; // Timeline or Reports or Ready to start
  };
  
  const workflowStep = getWorkflowStep();
  
  return (
    <div className="my-4">
      <h4 className="text-sm font-medium mb-4 text-center">Fluxo de Trabalho</h4>
      
      <div className="flex justify-between items-center">
        <WorkflowStepItem 
          number={1} 
          label="Anamnese" 
          isActive={workflowStep >= 1} 
          isComplete={workflowStep > 1}
        />
        
        <div className={`flex-1 h-1 ${workflowStep > 1 ? 'bg-primary' : 'bg-muted'}`}></div>
        
        <WorkflowStepItem 
          number={2} 
          label="Suporte IA" 
          isActive={workflowStep >= 2} 
          isComplete={workflowStep > 2}
        />
        
        <div className={`flex-1 h-1 ${workflowStep > 2 ? 'bg-primary' : 'bg-muted'}`}></div>
        
        <WorkflowStepItem 
          number={3} 
          label="Colaboração" 
          isActive={workflowStep >= 3} 
          isComplete={workflowStep > 3}
        />
        
        <div className={`flex-1 h-1 ${workflowStep > 3 ? 'bg-primary' : 'bg-muted'}`}></div>
        
        <WorkflowStepItem 
          number={4} 
          label="Implementação" 
          isActive={workflowStep >= 4} 
          isComplete={false}
        />
      </div>
    </div>
  );
};

interface WorkflowStepItemProps {
  number: number;
  label: string;
  isActive: boolean;
  isComplete: boolean;
}

const WorkflowStepItem: React.FC<WorkflowStepItemProps> = ({ 
  number, 
  label, 
  isActive,
  isComplete
}) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
          ${isComplete ? 'bg-primary text-white' : 
            isActive ? 'bg-primary text-white' : 
            'bg-muted text-muted-foreground'}`}
      >
        {number}
      </div>
      <div className="text-xs mt-1 text-center max-w-[60px]">{label}</div>
    </div>
  );
};

export default OnboardingWorkflowTimeline;
