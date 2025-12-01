
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

export const WorkflowVisualization: React.FC = () => {
  const workflowSteps = [
    { name: 'Avaliação', description: 'Coleta de dados e análise inicial' },
    { name: 'Planejamento', description: 'Definição de objetivos e estratégias' },
    { name: 'Implementação', description: 'Execução das atividades planejadas' },
    { name: 'Monitoramento', description: 'Acompanhamento contínuo do progresso' },
    { name: 'Revisão', description: 'Ajustes baseados nos resultados' }
  ];

  return (
    <div className="p-4 bg-muted/30 rounded-lg" aria-label="Workflow do Smart PEI">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {workflowSteps.map((step, index) => (
          <div key={index} className="flex flex-col relative">
            {/* Step number for mobile */}
            <div className="md:hidden flex items-center mb-2">
              <div className="text-sm font-medium text-muted-foreground">{`Passo ${index + 1}:`}</div>
            </div>
            
            {/* Connected flow in desktop */}
            <div className="hidden md:flex items-center justify-center mb-3 relative">
              <div 
                className={`w-full absolute top-6 border-t-2 ${
                  index === 0 ? 'border-transparent ml-1/2' : 
                  index === workflowSteps.length - 1 ? 'border-primary/70 mr-1/2' : 'border-primary/70'
                }`}
                aria-hidden="true"
              />
              <div 
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-semibold text-white relative z-10"
                role="img" 
                aria-label={`Etapa ${index + 1}`}
              >
                {index + 1}
              </div>
            </div>

            {/* Mobile step visualization */}
            <div className="md:hidden flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                {index + 1}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" aria-hidden="true" />
            </div>
            
            {/* Step content */}
            <div className="flex flex-col items-center text-center">
              <h4 className="font-medium text-foreground mb-1 text-sm">{step.name}</h4>
              <p className="text-xs text-muted-foreground max-w-[120px]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowVisualization;
