
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { PEIGoal } from '@/hooks/usePEI';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { getDomainLabel } from '@/utils/assessment/domains';
import { PEIGoalView } from './PEIGoalView';

interface PEIGoalsListProps {
  goals: PEIGoal[];
  expandedGoals: string[];
  onGoalToggle: (goalId: string) => void;
}

const PEIGoalsList: React.FC<PEIGoalsListProps> = ({ 
  goals, 
  expandedGoals, 
  onGoalToggle 
}) => {
  return (
    <Accordion
      type="multiple"
      value={expandedGoals}
      onValueChange={(value) => {
        // Handle the expanded goals state changes
        if (Array.isArray(value)) {
          const lastToggled = value.find(id => !expandedGoals.includes(id)) || 
                             expandedGoals.find(id => !value.includes(id));
          if (lastToggled) {
            onGoalToggle(lastToggled);
          }
        }
      }}
      className="w-full"
    >
      {goals.map((goal) => (
        <AccordionItem 
          key={goal.id} 
          value={goal.id}
          className="border rounded-lg mb-4 overflow-hidden animate-fade-in"
        >
          <AccordionTrigger 
            onClick={(e) => {
              e.preventDefault(); // Prevent default to handle it with our custom logic
              onGoalToggle(goal.id);
            }}
            className="px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-center w-full">
              <div className="text-left">
                <span className="font-medium">{goal.title}</span>
                <div className="flex gap-2 items-center mt-1">
                  <Badge variant="outline" className="text-xs">
                    {getDomainLabel(goal.domain)}
                  </Badge>
                  {getGoalStatusBadge(goal.status)}
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                Meta: {format(new Date(goal.targetDate), 'PPP', { locale: pt })}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 transition-all duration-300 ease-in-out">
            <PEIGoalView goal={goal} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const getGoalStatusBadge = (status: PEIGoal['status']) => {
  const statusColors: Record<PEIGoal['status'], string> = {
    not_started: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    achieved: 'bg-green-100 text-green-700',
    canceled: 'bg-red-100 text-red-700'
  };
  
  const statusLabels: Record<PEIGoal['status'], string> = {
    not_started: 'Não Iniciado',
    in_progress: 'Em Progresso',
    achieved: 'Alcançado',
    canceled: 'Cancelado'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[status]}`}>
      {statusLabels[status]}
    </span>
  );
};

export default PEIGoalsList;
