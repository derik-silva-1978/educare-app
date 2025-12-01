
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AIReportGenerationOptions } from '@/utils/ai-service';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AIReportOptionsProps {
  options: AIReportGenerationOptions;
  onChange: (options: AIReportGenerationOptions) => void;
}

export const AIReportOptions: React.FC<AIReportOptionsProps> = ({
  options,
  onChange
}) => {
  const handleOptionChange = (optionName: keyof AIReportGenerationOptions, value: boolean) => {
    onChange({
      ...options,
      [optionName]: value
    });
  };
  
  return (
    <Card className="border border-muted">
      <CardContent className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Conteúdo do Relatório</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeStrengths" 
                checked={options.includeStrengths}
                onCheckedChange={(checked) => 
                  handleOptionChange('includeStrengths', Boolean(checked))
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="includeStrengths" className="text-sm font-medium">Pontos Fortes</Label>
                <p className="text-xs text-muted-foreground">Análise das áreas de destaque do aluno</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeWeaknesses" 
                checked={options.includeWeaknesses}
                onCheckedChange={(checked) => 
                  handleOptionChange('includeWeaknesses', Boolean(checked))
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="includeWeaknesses" className="text-sm font-medium">Áreas para Desenvolvimento</Label>
                <p className="text-xs text-muted-foreground">Análise dos desafios e oportunidades</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeRecommendations" 
                checked={options.includeRecommendations}
                onCheckedChange={(checked) => 
                  handleOptionChange('includeRecommendations', Boolean(checked))
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="includeRecommendations" className="text-sm font-medium">Recomendações</Label>
                <p className="text-xs text-muted-foreground">Estratégias pedagógicas sugeridas</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeNextSteps" 
                checked={options.includeNextSteps}
                onCheckedChange={(checked) => 
                  handleOptionChange('includeNextSteps', Boolean(checked))
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="includeNextSteps" className="text-sm font-medium">Próximos Passos</Label>
                <p className="text-xs text-muted-foreground">Ações futuras recomendadas</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium mb-3">Elementos Visuais e Dados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeVisualData" 
                checked={options.includeVisualData}
                onCheckedChange={(checked) => 
                  handleOptionChange('includeVisualData', Boolean(checked))
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="includeVisualData" className="text-sm font-medium">Dados Visuais</Label>
                <p className="text-xs text-muted-foreground">Gráficos de progresso e desenvolvimento</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeMilestoneComparison" 
                checked={options.includeMilestoneComparison}
                onCheckedChange={(checked) => 
                  handleOptionChange('includeMilestoneComparison', Boolean(checked))
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="includeMilestoneComparison" className="text-sm font-medium">Comparação com Marcos</Label>
                <p className="text-xs text-muted-foreground">Análise comparativa com objetivos do PEI</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeResourceLinks" 
                checked={options.includeResourceLinks}
                onCheckedChange={(checked) => 
                  handleOptionChange('includeResourceLinks', Boolean(checked))
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="includeResourceLinks" className="text-sm font-medium">Links de Recursos</Label>
                <p className="text-xs text-muted-foreground">Materiais e recursos complementares</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeCrossAnalysis" 
                checked={options.includeCrossAnalysis}
                onCheckedChange={(checked) => 
                  handleOptionChange('includeCrossAnalysis', Boolean(checked))
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="includeCrossAnalysis" className="text-sm font-medium">Análise Transversal</Label>
                <p className="text-xs text-muted-foreground">Conexões entre diferentes domínios</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIReportOptions;
