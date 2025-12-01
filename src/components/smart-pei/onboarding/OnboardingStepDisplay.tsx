
import React from 'react';
import { BookOpen, Users, FileText, BarChart2, Brain, MessageSquare, Calendar, Lightbulb, CheckCircle } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingStepDisplayProps {
  currentStep: number;
  steps: Step[];
}

export const getDefaultSteps = (): Step[] => [
  {
    title: 'Bem-vindo ao Smart PEI',
    description: 'Uma plataforma completa para criação, gestão e monitoramento de Planos de Ensino Individualizado.',
    icon: <BookOpen className="h-12 w-12 text-primary" />
  },
  {
    title: 'Dashboard Inteligente',
    description: 'Visualize estatísticas essenciais e acompanhe o progresso dos alunos com gráficos interativos.',
    icon: <BarChart2 className="h-12 w-12 text-blue-500" />
  },
  {
    title: 'Suporte com IA',
    description: 'Receba recomendações personalizadas adaptadas ao perfil de cada aluno.',
    icon: <Brain className="h-12 w-12 text-purple-500" />
  },
  {
    title: 'Gestão de Alunos',
    description: 'Mantenha um registro detalhado dos estudantes e seu histórico educacional.',
    icon: <Users className="h-12 w-12 text-green-500" />
  },
  {
    title: 'Avaliação Multidimensional',
    description: 'Crie avaliações personalizadas fundamentando os PEIs em dados concretos.',
    icon: <FileText className="h-12 w-12 text-amber-500" />
  },
  {
    title: 'Pronto para Começar!',
    description: 'Agora você conhece os principais recursos do Smart PEI.',
    icon: <CheckCircle className="h-12 w-12 text-green-500" />
  }
];

const OnboardingStepDisplay: React.FC<OnboardingStepDisplayProps> = ({ currentStep, steps }) => {
  const currentStepData = steps[currentStep];
  
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        {currentStepData.icon && (
          <div className="flex justify-center mb-2">
            {currentStepData.icon}
          </div>
        )}
        <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
        <p className="text-muted-foreground mt-1">{currentStepData.description}</p>
      </div>
    </div>
  );
};

export default OnboardingStepDisplay;
