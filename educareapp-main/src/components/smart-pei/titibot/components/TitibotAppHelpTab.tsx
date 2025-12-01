
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, FileText, Sparkles, Info, AlertCircle } from 'lucide-react';

interface PromptCategory {
  title: string;
  prompts: string[];
}

interface TitibotAppHelpTabProps {
  onPromptClick: (prompt: string) => void;
}

export const TitibotAppHelpTab: React.FC<TitibotAppHelpTabProps> = ({ onPromptClick }) => {
  const appUsagePrompts: PromptCategory[] = [
    {
      title: "Relatórios",
      prompts: [
        "Qual relatório devo usar para reunião com pais?",
        "Diferença entre Relatório Trimestral e Progresso do PEI?",
        "Quando usar o Sumário do PEI vs. Documentação Completa?",
        "Como personalizar um relatório para a equipe multidisciplinar?"
      ]
    },
    {
      title: "Navegação",
      prompts: [
        "Como adicionar um novo aluno no sistema?",
        "Onde encontro as avaliações já realizadas?",
        "Como editar um PEI existente?",
        "Como exportar um relatório em PDF?"
      ]
    },
    {
      title: "Configurações",
      prompts: [
        "Como mudar minhas preferências de notificação?",
        "Como compartilhar um relatório com outros profissionais?",
        "Como personalizar a visualização do dashboard?",
        "Como configurar períodos de avaliação automática?"
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <p className="text-sm text-blue-700">
            Selecione uma pergunta ou dúvida sobre a utilização do Smart PEI, ou escreva sua própria pergunta na aba Conversa.
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        {appUsagePrompts.map((category, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              {category.title === "Relatórios" && <FileText className="h-4 w-4 mr-1" />}
              {category.title === "Navegação" && <HelpCircle className="h-4 w-4 mr-1" />}
              {category.title === "Configurações" && <Sparkles className="h-4 w-4 mr-1" />}
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
                  <HelpCircle className="h-3.5 w-3.5 mr-2 text-blue-500" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            Relatórios
          </h3>
          <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
            <h4 className="text-sm font-medium mb-2 text-amber-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 text-amber-600" />
              Dicas para escolha de relatórios
            </h4>
            <div className="text-sm text-amber-700 space-y-2">
              <p>
                <strong>Relatório de Progresso PEI:</strong> Mostra avanços específicos nos objetivos do PEI.
              </p>
              <p>
                <strong>Relatório Trimestral:</strong> Documenta progresso geral em um período específico.
              </p>
              <p>
                <strong>Sumário do PEI:</strong> Visão resumida do PEI atual, ideal para consulta rápida.
              </p>
              <p>
                <strong>Documentação Completa:</strong> Conjunto de todos os documentos relevantes do aluno.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitibotAppHelpTab;
