
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PEIGoal } from '@/hooks/usePEI';
import { FileText, BarChart2, ListChecks, MessageSquare } from 'lucide-react';

interface GoalViewTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  goal: PEIGoal;
}

const GoalViewTabs: React.FC<GoalViewTabsProps> = ({ 
  activeTab, 
  onTabChange,
  goal 
}) => {
  const hasProgress = goal.progress && goal.progress.length > 0;
  const hasStrategies = goal.strategies && goal.strategies.length > 0;
  
  return (
    <TabsList className="mb-2">
      <TabsTrigger value="overview" className="flex items-center">
        <FileText className="h-4 w-4 mr-2" />
        Visão Geral
      </TabsTrigger>
      <TabsTrigger value="progress" className="flex items-center">
        <BarChart2 className="h-4 w-4 mr-2" />
        Progresso {hasProgress && <span className="ml-1 text-xs bg-primary/20 w-5 h-5 rounded-full flex items-center justify-center">{goal.progress.length}</span>}
      </TabsTrigger>
      <TabsTrigger value="strategies" className="flex items-center">
        <ListChecks className="h-4 w-4 mr-2" />
        Estratégias {hasStrategies && <span className="ml-1 text-xs bg-primary/20 w-5 h-5 rounded-full flex items-center justify-center">{goal.strategies.length}</span>}
      </TabsTrigger>
      <TabsTrigger value="notes" className="flex items-center">
        <MessageSquare className="h-4 w-4 mr-2" />
        Notas
      </TabsTrigger>
    </TabsList>
  );
};

export default GoalViewTabs;
