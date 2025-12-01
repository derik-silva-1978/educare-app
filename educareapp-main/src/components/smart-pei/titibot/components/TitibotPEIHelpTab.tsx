
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, GraduationCap, Target, Lightbulb, ArrowRight } from 'lucide-react';

interface TitibotPEIHelpTabProps {
  onPromptClick: (prompt: string) => void;
}

export const TitibotPEIHelpTab: React.FC<TitibotPEIHelpTabProps> = ({ onPromptClick }) => {
  const peiPrompts = [
    {
      category: "Criação do PEI",
      prompts: [
        "Como criar um PEI eficaz?",
        "Quais elementos são essenciais em um PEI?",
        "Como definir objetivos SMART no PEI?",
        "Como alinhar o PEI com a BNCC?"
      ]
    },
    {
      category: "Implementação",
      prompts: [
        "Como monitorar o progresso dos objetivos do PEI?",
        "Quais estratégias são eficazes para diferentes perfis de alunos?",
        "Como envolver a família no processo do PEI?",
        "Como documentar adaptações curriculares no PEI?"
      ]
    },
    {
      category: "Avaliação e Revisão",
      prompts: [
        "Quando um PEI deve ser revisado?",
        "Como avaliar a eficácia das estratégias do PEI?",
        "Quais indicadores mostram progresso nos objetivos do PEI?",
        "Como ajustar objetivos que não estão sendo alcançados?"
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-6">
        {peiPrompts.map((category, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              {category.category === "Criação do PEI" && <FileText className="h-4 w-4 mr-1" />}
              {category.category === "Implementação" && <Target className="h-4 w-4 mr-1" />}
              {category.category === "Avaliação e Revisão" && <GraduationCap className="h-4 w-4 mr-1" />}
              {category.category}
            </h3>
            <div className="grid gap-2">
              {category.prompts.map((prompt, promptIdx) => (
                <Button 
                  key={promptIdx} 
                  variant="outline" 
                  className="justify-start h-auto py-2 px-3 text-left text-sm font-normal"
                  onClick={() => onPromptClick(prompt)}
                >
                  <Lightbulb className="h-3.5 w-3.5 mr-2 text-primary" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <h3 className="flex items-center text-sm font-medium mb-2">
            <Target className="h-4 w-4 mr-1 text-primary" />
            Próximos passos no PEI
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Acompanhe o progresso, documente intervenções e ajuste estratégias regularmente para maximizar o sucesso do aluno.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center text-xs"
            onClick={() => onPromptClick("Quais são as melhores práticas para acompanhamento do PEI?")}
          >
            <span>Práticas recomendadas</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TitibotPEIHelpTab;
