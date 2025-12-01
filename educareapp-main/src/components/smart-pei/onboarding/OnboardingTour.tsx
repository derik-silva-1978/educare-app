
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  FileText, 
  BarChart2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Brain,
  MessageSquare,
  Calendar,
  Lightbulb
} from 'lucide-react';
import OnboardingStepDisplay, { getDefaultSteps } from './OnboardingStepDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAccessibility } from '@/hooks/accessibility';

interface OnboardingTourProps {
  onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(true);
  const isMobile = useIsMobile();
  const { announce } = useAccessibility();
  
  const steps = [
    {
      title: 'Bem-vindo ao Smart PEI',
      description: 'Uma plataforma completa para criação, gestão e monitoramento de Planos de Ensino Individualizado com inteligência artificial integrada.',
      icon: <BookOpen className="h-12 w-12 text-primary" />
    },
    {
      title: 'Dashboard Inteligente',
      description: 'Visualize estatísticas essenciais, acompanhe o progresso dos alunos e identifique tendências importantes com gráficos interativos e análises detalhadas.',
      icon: <BarChart2 className="h-12 w-12 text-blue-500" />
    },
    {
      title: 'Suporte com IA',
      description: 'Receba recomendações personalizadas, análise preditiva de progresso e sugestões de estratégias pedagógicas adaptadas ao perfil de cada aluno.',
      icon: <Brain className="h-12 w-12 text-purple-500" />
    },
    {
      title: 'Gestão de Alunos',
      description: 'Mantenha um registro detalhado dos estudantes, histórico educacional, avaliações e PEIs anteriores - tudo em um só lugar e facilmente acessível.',
      icon: <Users className="h-12 w-12 text-green-500" />
    },
    {
      title: 'Avaliação Multidimensional',
      description: 'Crie avaliações personalizadas com domínios cognitivos, socioafetivos, motores e adaptativos, fundamentando os PEIs em dados concretos.',
      icon: <FileText className="h-12 w-12 text-amber-500" />
    },
    {
      title: 'Colaboração em Tempo Real',
      description: 'Trabalhe em conjunto com a equipe multidisciplinar, compartilhe notas e coordene intervenções para maior eficácia no desenvolvimento do aluno.',
      icon: <MessageSquare className="h-12 w-12 text-indigo-500" />
    },
    {
      title: 'Acompanhamento Estruturado',
      description: 'Monitore o progresso com linha do tempo, registros periódicos e visualização de tendências para intervenções mais eficazes e oportunas.',
      icon: <Calendar className="h-12 w-12 text-teal-500" />
    },
    {
      title: 'Relatórios Inteligentes',
      description: 'Gere relatórios automatizados, personalizáveis e profissionais para compartilhar com pais, educadores e outros especialistas.',
      icon: <Lightbulb className="h-12 w-12 text-yellow-500" />
    },
    {
      title: 'Pronto para Começar!',
      description: 'Agora você conhece os principais recursos do Smart PEI. Explore o sistema e revolucione sua abordagem para Planos de Ensino Individualizado.',
      icon: <CheckCircle className="h-12 w-12 text-green-500" />
    }
  ];
  
  // Announce step changes for screen readers
  useEffect(() => {
    announce(`Passo ${currentStep + 1} de ${steps.length}: ${steps[currentStep].title}`);
  }, [currentStep, announce, steps]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    setOpen(false);
    onComplete();
  };
  
  const handleClose = () => {
    setOpen(false);
    onComplete();
  };
  
  const currentStepData = steps[currentStep];
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md md:max-w-xl lg:max-w-2xl ${isMobile ? 'px-3' : 'px-6'} max-h-[80vh] overflow-y-auto`}>
        <DialogHeader className="space-y-2">
          <div className="mx-auto py-3 flex items-center justify-center" aria-hidden="true">
            {currentStepData.icon}
          </div>
          <DialogTitle className="text-xl font-bold text-center">{currentStepData.title}</DialogTitle>
          <DialogDescription className="text-base mt-2 text-center">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>
        
        {/* Accessible progress indicators */}
        <div 
          className="flex items-center justify-center mt-2 mb-4" 
          role="progressbar" 
          aria-valuemin={1} 
          aria-valuemax={steps.length} 
          aria-valuenow={currentStep + 1}
          aria-label={`Passo ${currentStep + 1} de ${steps.length}`}
        >
          <div className="flex gap-1.5">
            {steps.map((_, index) => (
              <button 
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'w-8 bg-primary' 
                    : index < currentStep
                      ? 'w-3 bg-primary/60'
                      : 'w-3 bg-muted'
                }`}
                onClick={() => setCurrentStep(index)}
                aria-label={`Ir para o passo ${index + 1}`}
                aria-current={index === currentStep ? 'step' : undefined}
              />
            ))}
          </div>
        </div>
        
        {/* Content area for step-specific information */}
        <div className="py-4">
          {currentStep === 1 && (
            <div className="rounded-lg bg-muted/20 p-4 border border-muted">
              <h3 className="font-semibold text-center mb-4">Métricas do Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-background shadow-sm">
                  <div className="text-muted-foreground text-sm">Alunos</div>
                  <div className="text-3xl font-bold">247</div>
                  <div className="text-green-500 text-sm" aria-label="Aumento de 12%">+12%</div>
                </div>
                <div className="p-3 rounded-lg bg-background shadow-sm">
                  <div className="text-muted-foreground text-sm">PEIs Ativos</div>
                  <div className="text-3xl font-bold">186</div>
                  <div className="text-green-500 text-sm" aria-label="Aumento de 8%">+8%</div>
                </div>
                <div className="p-3 rounded-lg bg-background shadow-sm">
                  <div className="text-muted-foreground text-sm">Relatórios</div>
                  <div className="text-3xl font-bold">74</div>
                  <div className="text-green-500 text-sm" aria-label="Aumento de 15%">+15%</div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="rounded-lg bg-muted/20 p-4 border border-muted">
              <h3 className="font-semibold text-center mb-4">IA Assistente</h3>
              <p className="text-center mb-4">
                Nossa IA analisa dados e oferece sugestões personalizadas
                para cada aluno, otimizando o processo de criação de PEIs.
              </p>
              <div className="mt-4 w-full bg-muted h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={33} aria-valuemin={0} aria-valuemax={100}>
                <div className="bg-primary h-full w-1/3" style={{ width: '33%' }} aria-hidden="true"></div>
              </div>
            </div>
          )}
          
          {currentStep === 7 && (
            <div className="rounded-lg bg-muted/20 p-4 border border-muted">
              <h3 className="font-semibold text-center mb-4">Etapas do Workflow</h3>
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-2 gap-2" role="list" aria-label="Etapas do workflow">
                <div className="flex flex-col items-center" role="listitem">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm" aria-label="Etapa 1: Anamnese, concluída">1</div>
                  <div className="text-xs mt-1 text-center">Anamnese</div>
                </div>
                <div className="hidden md:block flex-1 h-1 bg-muted-foreground/30" aria-hidden="true"></div>
                <div className="flex flex-col items-center" role="listitem">
                  <div className="w-8 h-8 rounded-full bg-muted-foreground/30 text-white flex items-center justify-center text-sm" aria-label="Etapa 2: Suporte IA, pendente">2</div>
                  <div className="text-xs mt-1 text-center">Suporte IA</div>
                </div>
                <div className="hidden md:block flex-1 h-1 bg-muted-foreground/30" aria-hidden="true"></div>
                <div className="flex flex-col items-center" role="listitem">
                  <div className="w-8 h-8 rounded-full bg-muted-foreground/30 text-white flex items-center justify-center text-sm" aria-label="Etapa 3: Colaboração, pendente">3</div>
                  <div className="text-xs mt-1 text-center">Colaboração</div>
                </div>
                <div className="hidden md:block flex-1 h-1 bg-muted-foreground/30" aria-hidden="true"></div>
                <div className="flex flex-col items-center" role="listitem">
                  <div className="w-8 h-8 rounded-full bg-muted-foreground/30 text-white flex items-center justify-center text-sm" aria-label="Etapa 4: Implementação, pendente">4</div>
                  <div className="text-xs mt-1 text-center">Implementação</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2 mt-2">
          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-1"
              aria-label="Ir para o passo anterior"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Anterior</span>
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleNext}
              className="gap-1"
              aria-label={currentStep === steps.length - 1 ? "Começar a usar o Smart PEI" : "Ir para o próximo passo"}
            >
              <span>{currentStep === steps.length - 1 ? 'Começar' : 'Próximo'}</span>
              {currentStep === steps.length - 1 ? (
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleComplete}
            className="w-full sm:w-auto"
            aria-label="Pular tour de introdução"
          >
            Pular tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;
