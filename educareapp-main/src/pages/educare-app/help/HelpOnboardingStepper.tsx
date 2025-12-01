
import React from "react";
import { Check, ArrowRight } from "lucide-react";

type Step = {
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    title: "Crie uma Conta ou Faça Login",
    description: "Registre-se gratuitamente como responsável ou profissional da saúde/educação.",
  },
  {
    title: "Adicione uma Criança",
    description: "No painel principal, clique em 'Adicionar Criança'. Preencha dados básicos.",
  },
  {
    title: "Acompanhe o Desenvolvimento",
    description: "Complete avaliações para descobrir o estágio de desenvolvimento.",
  },
  {
    title: "Receba Atividades Personalizadas",
    description: "Acesse sugestões de atividades para estimular seu(s) filho(s).",
  },
  {
    title: "Convide Profissionais",
    description: "Compartilhe o progresso e convide profissionais para colaboração.",
  },
];

export const HelpOnboardingStepper: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Como começar?</h2>
      <ol className="space-y-4">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full
                bg-blue-600 text-white font-bold text-lg">{idx + 1}</div>
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-medium text-base">{step.title}</span>
                {idx === 0 && (
                  <ArrowRight className="ml-2 h-5 w-5 text-blue-500" />
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
