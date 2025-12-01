
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

type MigrationStep = 'validate' | 'backup' | 'migrate' | 'complete';

interface MigrationStepsProps {
  currentStep: MigrationStep;
}

export const MigrationSteps: React.FC<MigrationStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex space-x-2">
      <Badge 
        variant={currentStep === 'validate' ? "default" : (currentStep === 'backup' || currentStep === 'migrate' || currentStep === 'complete') ? "success" : "outline"}
        className="flex items-center gap-1 px-3 py-1"
      >
        <span>1. Validação</span>
        {(currentStep === 'backup' || currentStep === 'migrate' || currentStep === 'complete') && <CheckCircle2 className="h-3 w-3" />}
      </Badge>
      <Badge 
        variant={currentStep === 'backup' ? "default" : currentStep === 'validate' ? "outline" : (currentStep === 'migrate' || currentStep === 'complete') ? "success" : "outline"}
        className="flex items-center gap-1 px-3 py-1"
      >
        <span>2. Backup</span>
        {(currentStep === 'migrate' || currentStep === 'complete') && <CheckCircle2 className="h-3 w-3" />}
      </Badge>
      <Badge 
        variant={currentStep === 'migrate' ? "default" : currentStep === 'complete' ? "success" : "outline"}
        className="flex items-center gap-1 px-3 py-1"
      >
        <span>3. Migração</span>
        {currentStep === 'complete' && <CheckCircle2 className="h-3 w-3" />}
      </Badge>
    </div>
  );
};

export default MigrationSteps;
