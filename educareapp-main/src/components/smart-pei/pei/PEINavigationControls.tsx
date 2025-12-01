
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Check } from 'lucide-react';

interface PEINavigationControlsProps {
  currentStep: number;
  stepsLength: number;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  handleSave: () => void;
  handleComplete: () => void;
}

const PEINavigationControls: React.FC<PEINavigationControlsProps> = ({
  currentStep,
  stepsLength,
  handlePrevStep,
  handleNextStep,
  handleSave,
  handleComplete,
}) => {
  return (
    <div className="flex justify-between mt-6 pt-4 border-t">
      <div>
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={handlePrevStep}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleSave}
          className="flex items-center"
        >
          <Save className="h-4 w-4 mr-1" />
          Salvar
        </Button>
        
        {currentStep < stepsLength - 1 ? (
          <Button
            onClick={handleNextStep}
            className="flex items-center"
          >
            Próximo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            className="flex items-center"
          >
            <Check className="h-4 w-4 mr-1" />
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
};

export default PEINavigationControls;
