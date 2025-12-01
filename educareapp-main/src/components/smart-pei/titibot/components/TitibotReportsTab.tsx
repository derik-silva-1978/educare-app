
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FileOutput, 
  PenTool, 
  BarChart, 
  CalendarCheck, 
  Users,
  Bot
} from 'lucide-react';

interface TitibotReportsTabProps {
  onPromptClick: (prompt: string) => void;
  currentReport?: string;
}

export const TitibotReportsTab: React.FC<TitibotReportsTabProps> = ({ 
  onPromptClick, 
  currentReport 
}) => {
  // Define report-specific prompts
  const generalPrompts = [
    "Como criar um relatório eficaz para o PEI?",
    "Quais são os diferentes tipos de relatórios disponíveis?",
    "Como personalizar meus relatórios para diferentes públicos?",
    "Melhores práticas para relatórios de progresso",
    "Como integrar dados quantitativos e qualitativos em relatórios"
  ];

  const reportTypeSpecificPrompts: Record<string, string[]> = {
    assessment: [
      "Como estruturar um relatório de avaliação?",
      "Quais dados incluir em um relatório de avaliação inicial?",
      "Como interpretar resultados de avaliação para o PEI?"
    ],
    progress: [
      "Como documentar o progresso nos objetivos do PEI?",
      "Que métricas devo usar para mostrar evolução?",
      "Como relatar obstáculos no progresso de forma construtiva?"
    ],
    trimestral: [
      "O que deve constar em um relatório trimestral?",
      "Como comparar resultados entre trimestres?",
      "Modelo de relatório trimestral para coordenação"
    ],
    summary: [
      "Como criar um sumário executivo do PEI?",
      "Informações essenciais para um sumário de PEI",
      "Formato conciso para apresentação do PEI"
    ],
    team: [
      "Linguagem técnica para relatórios multidisciplinares",
      "Como estruturar relatórios para a equipe de apoio",
      "Integrando contribuições de diferentes especialistas"
    ],
    complete: [
      "Como organizar documentação completa do aluno",
      "Estrutura para relatório de caso completo",
      "Requisitos para documentação abrangente"
    ]
  };

  // Determine which prompts to show based on current report
  const promptsToShow = currentReport 
    ? [
        ...generalPrompts.slice(0, 3), 
        ...(reportTypeSpecificPrompts[currentReport] || []).slice(0, 3)
      ]
    : generalPrompts;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium mb-1">Ajuda com Relatórios</h3>
        <p className="text-xs text-muted-foreground">
          Pergunte sobre geração, escrita ou customização de relatórios
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div className="space-y-2">
          {promptsToShow.map((prompt, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-xs h-auto py-2 text-left"
              onClick={() => onPromptClick(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>

        {currentReport && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start gap-2 bg-primary/5 p-3 rounded-md">
              <Bot className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-xs font-medium">
                  Estou vendo que você está trabalhando com {
                    currentReport === 'assessment' ? 'Relatório de Avaliação' :
                    currentReport === 'progress' ? 'Relatório de Progresso' :
                    currentReport === 'trimestral' ? 'Relatório Trimestral' :
                    currentReport === 'summary' ? 'Sumário do PEI' :
                    currentReport === 'team' ? 'Relatório para Equipe' :
                    'Documentação Completa'
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Posso ajudar com sugestões específicas para este tipo de relatório.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitibotReportsTab;
