
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PEIHelpContentProps {
  onPromptClick: (prompt: string) => void;
}

export const PEIHelpContent: React.FC<PEIHelpContentProps> = ({ onPromptClick }) => {
  const peiStepPrompts = [
    {
      title: "Informações Gerais",
      prompts: [
        "Como escrever um bom título para o PEI?",
        "Que informações são essenciais no resumo do PEI?",
        "Qual deve ser o período ideal de duração do PEI?",
        "Com que frequência devo revisar o PEI?"
      ]
    },
    {
      title: "Equipe de Apoio",
      prompts: [
        "Quais profissionais devem compor a equipe de apoio?",
        "Como definir responsabilidades na equipe multidisciplinar?",
        "Quantos membros deve ter uma equipe de PEI?",
        "Como promover a colaboração efetiva entre a equipe?"
      ]
    },
    {
      title: "Objetivos e Estratégias",
      prompts: [
        "Como escrever objetivos SMART para o PEI?",
        "Que tipo de estratégias são mais eficazes?",
        "Como alinhar objetivos com a BNCC?",
        "Como diferenciar objetivos por domínio de desenvolvimento?"
      ]
    },
    {
      title: "Revisão e Acompanhamento",
      prompts: [
        "Como avaliar o progresso nos objetivos do PEI?",
        "Que indicadores usar para medir eficácia do PEI?",
        "Como documentar adequadamente o progresso?",
        "Quando devo considerar revisar ou alterar objetivos?"
      ]
    }
  ];
  
  const bnccAlignment = [
    {
      title: "Alinhamento com BNCC",
      prompts: [
        "Como alinhar objetivos do PEI com competências da BNCC?",
        "Quais são as principais competências gerais da BNCC?",
        "Como adaptar habilidades da BNCC para alunos com necessidades específicas?",
        "Como documentar o alinhamento com a BNCC no PEI?"
      ]
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 flex items-center mb-2">
          <BookOpen className="h-4 w-4 mr-1 text-blue-600" />
          Guia PEI
        </h3>
        <p className="text-sm text-blue-700">
          Esta seção oferece orientações sobre o processo de criação do Plano Educacional Individualizado (PEI). Selecione uma pergunta abaixo ou digite sua própria dúvida na aba Conversa.
        </p>
      </div>
      
      {peiStepPrompts.map((category, idx) => (
        <div key={idx} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center">
            <FileText className="h-4 w-4 mr-1" />
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
      
      <Separator />
      
      {bnccAlignment.map((category, idx) => (
        <div key={idx} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
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
      
      <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
        <h4 className="text-sm font-medium mb-2 text-amber-800 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1 text-amber-600" />
          Dicas para objetivos eficazes
        </h4>
        <div className="text-sm text-amber-700 space-y-2">
          <p>
            <Badge variant="outline" className="bg-amber-100 border-amber-200 mr-1">
              Específico
            </Badge>
            Descreva comportamentos observáveis e mensuráveis.
          </p>
          <p>
            <Badge variant="outline" className="bg-amber-100 border-amber-200 mr-1">
              Mensurável
            </Badge>
            Inclua critérios claros para avaliar o progresso.
          </p>
          <p>
            <Badge variant="outline" className="bg-amber-100 border-amber-200 mr-1">
              Alcançável
            </Badge>
            Defina objetivos desafiadores, mas realistas.
          </p>
          <p>
            <Badge variant="outline" className="bg-amber-100 border-amber-200 mr-1">
              Relevante
            </Badge>
            Priorize habilidades significativas para o aluno.
          </p>
          <p>
            <Badge variant="outline" className="bg-amber-100 border-amber-200 mr-1">
              Temporal
            </Badge>
            Estabeleça prazos claros para avaliação.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PEIHelpContent;
