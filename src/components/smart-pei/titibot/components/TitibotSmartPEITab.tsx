
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart, Rocket, Settings, Bot, ArrowRight } from 'lucide-react';

interface TitibotSmartPEITabProps {
  onPromptClick: (prompt: string) => void;
}

export const TitibotSmartPEITab: React.FC<TitibotSmartPEITabProps> = ({ onPromptClick }) => {
  const smartPEIPrompts = [
    {
      category: "Recursos",
      prompts: [
        "Quais são os recursos disponíveis no Smart PEI?",
        "Como o Smart PEI pode me ajudar com a documentação?",
        "Quais ferramentas o Smart PEI oferece para monitoramento?",
        "Existe integração com outros sistemas educacionais?"
      ]
    },
    {
      category: "Funcionalidades",
      prompts: [
        "Como usar o dashboard para análise de dados?",
        "Como exportar relatórios em diferentes formatos?",
        "Como compartilhar informações com a equipe?",
        "Como usar a análise de AI para sugestões de objetivos?"
      ]
    },
    {
      category: "Configurações",
      prompts: [
        "Como configurar minha conta no Smart PEI?",
        "Como personalizar as configurações de notificação?",
        "Como configurar acesso para outros membros da equipe?",
        "Como ajustar as configurações de privacidade?"
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-6">
        {smartPEIPrompts.map((category, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              {category.category === "Recursos" && <Bot className="h-4 w-4 mr-1" />}
              {category.category === "Funcionalidades" && <BarChart className="h-4 w-4 mr-1" />}
              {category.category === "Configurações" && <Settings className="h-4 w-4 mr-1" />}
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
                  <Bot className="h-3.5 w-3.5 mr-2 text-blue-500" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="flex items-center text-sm font-medium mb-2 text-blue-800">
            <Rocket className="h-4 w-4 mr-1 text-blue-600" />
            Dica de produtividade
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Utilize as ferramentas de análise de dados do Smart PEI para identificar tendências no desenvolvimento dos alunos e ajustar suas estratégias de intervenção.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center text-xs bg-blue-100 border-blue-200 hover:bg-blue-200 text-blue-800"
            onClick={() => onPromptClick("Como interpretar os gráficos de progresso?")}
          >
            <span>Aprenda mais sobre análise de dados</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TitibotSmartPEITab;
