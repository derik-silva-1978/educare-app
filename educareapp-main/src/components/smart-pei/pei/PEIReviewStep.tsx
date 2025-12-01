
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PEI } from '@/hooks/usePEI';
import { usePEIAIAssistance } from '@/hooks/usePEIAIAssistance';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import CompletenessCheck from './components/CompletenessCheck';
import AlignmentValidation from './components/AlignmentValidation';

interface PEIReviewStepProps {
  pei: PEI;
}

const PEIReviewStep: React.FC<PEIReviewStepProps> = ({ pei }) => {
  const { validatePEIAlignment } = usePEIAIAssistance();
  const [alignment, setAlignment] = useState<{score: number, feedback: string[]} | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();
  
  const validatePEI = async () => {
    setIsValidating(true);
    try {
      const result = await validatePEIAlignment(pei);
      setAlignment(result);
      toast({
        title: "Validação concluída",
        description: `Pontuação de alinhamento: ${result.score}/100`,
      });
    } catch (error) {
      console.error('Error validating PEI:', error);
      toast({
        title: "Erro na validação",
        description: "Não foi possível completar a validação do PEI",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };
  
  useEffect(() => {
    validatePEI();
  }, [pei]);

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Revisão do Plano</h3>
          <p className="text-sm text-muted-foreground">
            Revise todas as informações do PEI antes de finalizá-lo. Verifique se todas as seções estão completas.
          </p>
        </div>
        
        <CompletenessCheck pei={pei} />
        
        <Separator />
        
        <AlignmentValidation 
          pei={pei} 
          alignment={alignment} 
          isValidating={isValidating} 
          onValidate={validatePEI} 
        />
      </CardContent>
    </Card>
  );
};

export default PEIReviewStep;
