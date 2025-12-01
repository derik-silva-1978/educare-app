
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, UserPlus, Lightbulb, AlertCircle } from 'lucide-react';

interface PromptCategory {
  title: string;
  prompts: string[];
}

interface TitibotDomainHelpTabProps {
  onPromptClick: (prompt: string) => void;
}

export const TitibotDomainHelpTab: React.FC<TitibotDomainHelpTabProps> = ({ onPromptClick }) => {
  const domainPrompts: PromptCategory[] = [
    {
      title: "Avaliação",
      prompts: [
        "Como avaliar comunicação não-verbal?",
        "Diferença entre habilidade emergente e em desenvolvimento?",
        "Como observar habilidades sociais em diferentes contextos?"
      ]
    },
    {
      title: "PEI",
      prompts: [
        "Como definir objetivos SMART para o PEI?",
        "Estratégias para trabalhar habilidades sociais",
        "Como adaptar atividades para diferentes perfis sensoriais?"
      ]
    },
    {
      title: "Inclusão",
      prompts: [
        "Sugestões para promover inclusão em sala de aula",
        "Como adaptar avaliações para alunos neurodivergentes",
        "Estratégias de acessibilidade para materiais didáticos"
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-6">
        {domainPrompts.map((category, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              {category.title === "Avaliação" && <FileText className="h-4 w-4 mr-1" />}
              {category.title === "PEI" && <FileText className="h-4 w-4 mr-1" />}
              {category.title === "Inclusão" && <UserPlus className="h-4 w-4 mr-1" />}
              {category.title}
            </h3>
            <div className="grid gap-2">
              {category.prompts.map((prompt, promptIdx) => (
                <Button 
                  key={promptIdx} 
                  variant="outline" 
                  className="justify-start h-auto py-2 px-3 text-left text-sm font-normal"
                  onClick={() => onPromptClick(prompt)}
                >
                  <Lightbulb className="h-3.5 w-3.5 mr-2 text-amber-500" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h3 className="flex items-center text-sm font-medium mb-2 text-amber-800">
            <AlertCircle className="h-4 w-4 mr-1 text-amber-600" />
            Importante
          </h3>
          <p className="text-sm text-amber-700">
            O Titibot oferece sugestões para apoiar sua prática profissional, mas suas recomendações não substituem o julgamento clínico ou pedagógico especializado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TitibotDomainHelpTab;
