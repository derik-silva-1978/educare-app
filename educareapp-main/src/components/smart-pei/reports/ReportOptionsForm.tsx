
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AIReportGenerationOptions } from '@/utils/ai-service';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface ReportOptionsFormProps {
  options: AIReportGenerationOptions;
  onChange: (options: Partial<AIReportGenerationOptions>) => void;
}

export const ReportOptionsForm: React.FC<ReportOptionsFormProps> = ({
  options,
  onChange
}) => {
  const handleCheckboxChange = (field: keyof AIReportGenerationOptions) => {
    onChange({ [field]: !options[field] });
  };
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Opções do Relatório</h3>
          <p className="text-sm text-muted-foreground">
            Personalize as seções e o estilo do relatório.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Seções do Relatório</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeStrengths" 
                  checked={options.includeStrengths}
                  onCheckedChange={() => handleCheckboxChange('includeStrengths')}
                />
                <div className="flex items-center">
                  <Label 
                    htmlFor="includeStrengths" 
                    className="cursor-pointer"
                  >
                    Pontos Fortes
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-sm max-w-xs">
                        Inclui análise das áreas em que o aluno demonstra habilidades destacadas e progresso significativo.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeWeaknesses" 
                  checked={options.includeWeaknesses}
                  onCheckedChange={() => handleCheckboxChange('includeWeaknesses')}
                />
                <div className="flex items-center">
                  <Label 
                    htmlFor="includeWeaknesses" 
                    className="cursor-pointer"
                  >
                    Áreas para Desenvolvimento
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-sm max-w-xs">
                        Identifica áreas que necessitam de maior suporte e atenção específica.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeRecommendations" 
                  checked={options.includeRecommendations}
                  onCheckedChange={() => handleCheckboxChange('includeRecommendations')}
                />
                <div className="flex items-center">
                  <Label 
                    htmlFor="includeRecommendations" 
                    className="cursor-pointer"
                  >
                    Recomendações
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-sm max-w-xs">
                        Sugestões de estratégias e abordagens pedagógicas baseadas na análise realizada.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeNextSteps" 
                  checked={options.includeNextSteps}
                  onCheckedChange={() => handleCheckboxChange('includeNextSteps')}
                />
                <div className="flex items-center">
                  <Label 
                    htmlFor="includeNextSteps" 
                    className="cursor-pointer"
                  >
                    Próximos Passos
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-sm max-w-xs">
                        Plano de ação com etapas concretas para dar continuidade ao processo educacional.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeVisualData" 
                  checked={options.includeVisualData || false}
                  onCheckedChange={() => handleCheckboxChange('includeVisualData')}
                />
                <div className="flex items-center">
                  <Label 
                    htmlFor="includeVisualData" 
                    className="cursor-pointer"
                  >
                    Dados Visuais
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-sm max-w-xs">
                        Inclui gráficos e representações visuais para facilitar a compreensão do progresso.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeResourceLinks" 
                  checked={options.includeResourceLinks || false}
                  onCheckedChange={() => handleCheckboxChange('includeResourceLinks')}
                />
                <div className="flex items-center">
                  <Label 
                    htmlFor="includeResourceLinks" 
                    className="cursor-pointer"
                  >
                    Links de Recursos
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-sm max-w-xs">
                        Adiciona referências e links para materiais complementares e recursos de apoio.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="detailLevel" className="mb-2 block text-sm font-medium">
                Nível de Detalhamento
              </Label>
              <Select
                value={options.detailLevel || 'detailed'}
                onValueChange={(value) => onChange({ detailLevel: value as any })}
              >
                <SelectTrigger id="detailLevel">
                  <SelectValue placeholder="Selecione o nível de detalhamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Conciso</SelectItem>
                  <SelectItem value="detailed">Detalhado</SelectItem>
                  <SelectItem value="comprehensive">Abrangente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tone" className="mb-2 block text-sm font-medium">
                Tom de Linguagem
              </Label>
              <Select
                value={options.tone || 'supportive'}
                onValueChange={(value) => onChange({ tone: value as any })}
              >
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supportive">Acolhedor</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="technical">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="targetAudience" className="mb-2 block text-sm font-medium">
                Público-Alvo
              </Label>
              <Select
                value={options.targetAudience || 'all'}
                onValueChange={(value) => onChange({ targetAudience: value as any })}
              >
                <SelectTrigger id="targetAudience">
                  <SelectValue placeholder="Selecione o público alvo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="educators">Educadores</SelectItem>
                  <SelectItem value="parents">Pais e Responsáveis</SelectItem>
                  <SelectItem value="specialists">Especialistas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportOptionsForm;
