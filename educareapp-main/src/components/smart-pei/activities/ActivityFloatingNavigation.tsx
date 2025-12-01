
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  CalendarDays, 
  ListTodo, 
  BarChart2, 
  Clock, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Activity } from '@/types/activity';

interface ActivityFloatingNavigationProps {
  activeView: 'calendar' | 'list' | 'upcoming' | 'attention';
  onViewChange: (view: 'calendar' | 'list' | 'upcoming' | 'attention') => void;
  counts?: {
    total: number;
    upcoming: number;
    attention: number;
    completed: number;
  };
}

export const ActivityFloatingNavigation: React.FC<ActivityFloatingNavigationProps> = ({
  activeView,
  onViewChange,
  counts = { total: 0, upcoming: 0, attention: 0, completed: 0 }
}) => {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hidden lg:flex flex-col space-y-2 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeView === 'calendar' ? "default" : "ghost"}
              size="icon"
              className="rounded-full p-2"
              onClick={() => onViewChange('calendar')}
            >
              <CalendarDays className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Visualização de Calendário</p>
            <p className="text-xs text-muted-foreground">Todas as atividades: {counts.total}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeView === 'list' ? "default" : "ghost"}
              size="icon"
              className="rounded-full p-2"
              onClick={() => onViewChange('list')}
            >
              <ListTodo className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Lista de Atividades</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeView === 'upcoming' ? "default" : "ghost"}
              size="icon"
              className={`rounded-full p-2 ${counts.upcoming > 0 ? 'relative' : ''}`}
              onClick={() => onViewChange('upcoming')}
            >
              <Clock className="h-5 w-5" />
              {counts.upcoming > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {counts.upcoming}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Próximas Atividades</p>
            <p className="text-xs text-blue-600">{counts.upcoming} atividades próximas</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeView === 'attention' ? "default" : "ghost"}
              size="icon"
              className={`rounded-full p-2 ${counts.attention > 0 ? 'relative' : ''}`}
              onClick={() => onViewChange('attention')}
            >
              <AlertTriangle className="h-5 w-5" />
              {counts.attention > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {counts.attention}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Atividades que Precisam Atenção</p>
            <p className="text-xs text-red-600">{counts.attention} atividades atrasadas</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full p-2"
            >
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                {counts.completed}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Atividades Concluídas</p>
            <p className="text-xs text-green-600">{counts.completed} atividades concluídas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ActivityFloatingNavigation;
