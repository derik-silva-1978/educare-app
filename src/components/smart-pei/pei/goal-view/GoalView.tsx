
import React, { useState, useRef } from 'react';
import { PEIGoal } from '@/hooks/usePEI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GoalTabContent from './GoalTabContent';
import GoalViewTabs from './GoalViewTabs';
import AddStrategyModal from '../modals/AddStrategyModal';
import AddProgressModal from '../modals/AddProgressModal';

interface GoalViewProps {
  goal: PEIGoal;
  onEdit?: (goal: PEIGoal) => void;
  onDelete?: (goalId: string) => void;
  onAddStrategy: (goalId: string, strategy: any) => void;
  onAddProgress: (goalId: string, progress: any) => void;
}

const GoalView: React.FC<GoalViewProps> = ({
  goal,
  onEdit,
  onDelete,
  onAddStrategy,
  onAddProgress
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const { toast } = useToast();
  
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Objetivo - ${goal.title}`,
    onAfterPrint: () => {
      toast({
        title: "Impressão concluída",
        description: "O objetivo foi enviado para impressão."
      });
    },
    contentRef: printRef,
  });
  
  const handleAddStrategy = (strategyData: any) => {
    onAddStrategy(goal.id, strategyData);
    setShowStrategyModal(false);
    
    toast({
      title: "Estratégia adicionada",
      description: "A estratégia foi adicionada com sucesso."
    });
  };
  
  const handleAddProgress = (progressData: any) => {
    onAddProgress(goal.id, progressData);
    setShowProgressModal(false);
    
    toast({
      title: "Progresso registrado",
      description: "O registro de progresso foi adicionado com sucesso."
    });
  };
  
  const handleAddStrategyClick = () => {
    setShowStrategyModal(true);
  };
  
  const handleAddProgressClick = () => {
    setShowProgressModal(true);
  };
  
  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      'Comunicação': 'bg-blue-100 text-blue-800',
      'Cognitivo': 'bg-purple-100 text-purple-800',
      'Motor': 'bg-green-100 text-green-800',
      'Socioafetivo': 'bg-pink-100 text-pink-800',
      'Adaptativo': 'bg-yellow-100 text-yellow-800'
    };
    
    return colors[domain] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">{goal.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className={getDomainColor(goal.domain)}>
              {goal.domain}
            </Badge>
            <Badge variant="outline" className="bg-slate-100">
              {goal.status || 'Em andamento'}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handlePrint()}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(goal)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(goal.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="strategies">Estratégias</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>
          
          <GoalTabContent 
            goal={goal} 
            activeTab={activeTab}
            onAddStrategyClick={handleAddStrategyClick}
            onAddProgressClick={handleAddProgressClick}
            printRef={printRef}
          />
        </Tabs>
        
        <AddStrategyModal 
          isOpen={showStrategyModal} 
          onClose={() => setShowStrategyModal(false)}
          onAdd={handleAddStrategy}
        />
        
        <AddProgressModal 
          isOpen={showProgressModal} 
          onClose={() => setShowProgressModal(false)}
          onAdd={handleAddProgress}
        />
      </CardContent>
    </Card>
  );
};

export default GoalView;
