
import React from 'react';
import { PEI } from '@/hooks/usePEI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bot, RefreshCw } from 'lucide-react';

interface AlignmentValidationProps {
  pei: PEI;
  alignment: {score: number, feedback: string[]} | null;
  isValidating: boolean;
  onValidate: () => void;
}

export const AlignmentValidation: React.FC<AlignmentValidationProps> = ({ 
  pei,
  alignment,
  isValidating,
  onValidate
}) => {
  // Alignment severity class
  const getAlignmentClass = (score: number) => {
    if (score < 60) return 'bg-red-100 text-red-800 border-red-200';
    if (score < 80) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Validação de Alinhamento BNCC</h4>
          <Badge variant="outline" className="bg-primary/10 font-normal">Análise AI</Badge>
        </div>
        <Button 
          size="sm"
          variant="outline" 
          onClick={onValidate}
          disabled={isValidating} 
          className="flex items-center gap-1 text-xs"
        >
          {isValidating ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Bot className="h-3.5 w-3.5" />
          )}
          {isValidating ? 'Validando...' : 'Revalidar'}
        </Button>
      </div>
      
      {isValidating ? (
        <div className="flex items-center gap-3 text-muted-foreground italic p-6 justify-center">
          <Bot className="h-5 w-5 animate-pulse" />
          <span>Analisando alinhamento com BNCC...</span>
        </div>
      ) : alignment ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Pontuação de Alinhamento</span>
            <Badge 
              variant="outline" 
              className={getAlignmentClass(alignment.score)}
            >
              {alignment.score}/100
            </Badge>
          </div>
          
          <Progress 
            value={alignment.score} 
            className="h-2" 
            indicatorClassName={
              alignment.score < 60 ? 'bg-red-500' : 
              alignment.score < 80 ? 'bg-amber-500' : 
              'bg-green-500'
            }
          />
          
          <div className="space-y-2 mt-2">
            <h5 className="text-sm font-medium">Feedback da Análise BNCC:</h5>
            <div className="bg-muted/20 p-3 rounded-md text-sm space-y-2">
              {alignment.feedback.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded ${
                    item.includes('Sugestão') || item.includes('Recomendação') 
                      ? 'bg-amber-50 border border-amber-100' 
                      : item.includes('Excelente') || item.includes('positivo')
                        ? 'bg-green-50 border border-green-100'
                        : 'border border-muted'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-800">
            <h5 className="font-medium mb-1">O que significa essa pontuação?</h5>
            <p>
              {alignment.score >= 80 ? (
                "Seu PEI demonstra um excelente alinhamento com as diretrizes da BNCC e práticas pedagógicas recomendadas. Os objetivos estão bem definidos e as estratégias são apropriadas."
              ) : alignment.score >= 60 ? (
                "Seu PEI está parcialmente alinhado com a BNCC, mas há oportunidades de melhoria. Considere revisar os aspectos destacados no feedback para fortalecer o plano."
              ) : (
                "Seu PEI precisa de ajustes significativos para alinhar-se melhor à BNCC. Revise os objetivos, estratégias e considere as sugestões fornecidas."
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          <p>
            Não foi possível validar o alinhamento com a BNCC.
            Clique em "Revalidar" para tentar novamente.
          </p>
        </div>
      )}
    </div>
  );
};

export default AlignmentValidation;
