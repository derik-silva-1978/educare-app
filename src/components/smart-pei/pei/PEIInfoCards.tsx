
import React from 'react';
import { PEI } from '@/hooks/usePEI';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarDays, CalendarClock, Users, Target } from 'lucide-react';

interface PEIInfoCardsProps {
  pei: PEI;
}

const PEIInfoCards: React.FC<PEIInfoCardsProps> = ({ pei }) => {
  // Format review frequency for display
  const formatReviewFrequency = (frequency: string) => {
    const frequencyMap: Record<string, string> = {
      weekly: 'Semanal',
      biweekly: 'Quinzenal',
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      semiannually: 'Semestral',
      annually: 'Anual'
    };
    
    return frequencyMap[frequency] || frequency;
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-6">
      <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <CalendarDays className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Período</p>
          <p className="text-sm font-medium">
            {format(new Date(pei.startDate), 'dd/MM/yyyy', { locale: pt })} - {' '}
            {format(new Date(pei.endDate), 'dd/MM/yyyy', { locale: pt })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <CalendarClock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Próxima Revisão</p>
          <p className="text-sm font-medium">
            {format(new Date(pei.nextReviewDate), 'dd/MM/yyyy', { locale: pt })}
          </p>
          <p className="text-xs text-muted-foreground">
            Frequência: {formatReviewFrequency(pei.reviewFrequency)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Target className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Objetivos</p>
          <p className="text-sm font-medium">
            {pei.goals.length} definidos
          </p>
          <p className="text-xs text-muted-foreground">
            {pei.goals.filter(g => g.status === 'achieved').length} alcançados
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Equipe</p>
          <p className="text-sm font-medium">
            {pei.teamMembers.length} membros
          </p>
        </div>
      </div>
    </div>
  );
};

export default PEIInfoCards;
