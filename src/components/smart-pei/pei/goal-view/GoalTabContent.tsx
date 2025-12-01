
import React from 'react';
import { PEIGoal } from '@/hooks/usePEI';
import { Button } from '@/components/ui/button';
import { Plus, Info, Calendar, Target, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Tabs, TabsContent } from '@/components/ui/tabs';

interface GoalTabContentProps {
  goal: PEIGoal;
  activeTab: string;
  onAddStrategyClick: () => void;
  onAddProgressClick: () => void;
  printRef: React.RefObject<HTMLDivElement>;
}

const GoalTabContent: React.FC<GoalTabContentProps> = ({ 
  goal, 
  activeTab,
  onAddStrategyClick,
  onAddProgressClick,
  printRef
}) => {
  // Use TabsContent within a properly set up Tabs context
  return (
    <Tabs value={activeTab} className="w-full">
      <TabsContent value="overview">
        <div ref={printRef} className="space-y-4 p-4 border rounded-md bg-muted/10">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Descrição</h4>
                <p className="text-sm whitespace-pre-wrap">{goal.description}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Target className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Domínio</h4>
                <p className="text-sm">{goal.domain}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Data Alvo</h4>
                <p className="text-sm">
                  {format(new Date(goal.targetDate), 'PPP', { locale: pt })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Activity className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">Método de Avaliação</h4>
              <p className="text-sm">{goal.evaluationMethod || "Não especificado"}</p>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="progress">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Registros de Progresso</h3>
            <Button size="sm" onClick={onAddProgressClick}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Progresso
            </Button>
          </div>
          
          {goal.progress && goal.progress.length > 0 ? (
            <div className="space-y-3">
              {goal.progress.map((progress) => (
                <div 
                  key={progress.id} 
                  className="p-3 border rounded-md bg-background"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm font-medium">
                        {format(new Date(progress.date), 'PPP', { locale: pt })}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {progress.author || 'Usuário'}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getProgressStatusColor(progress.status)}`}>
                      {getProgressStatusLabel(progress.status)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{progress.notes}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">
                Nenhum registro de progresso. Clique no botão acima para adicionar.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="strategies">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Estratégias</h3>
            <Button size="sm" onClick={onAddStrategyClick}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Estratégia
            </Button>
          </div>
          
          {goal.strategies && goal.strategies.length > 0 ? (
            <div className="space-y-3">
              {goal.strategies.map((strategy) => (
                <div 
                  key={strategy.id} 
                  className="p-3 border rounded-md bg-background"
                >
                  <h4 className="text-sm font-medium mb-1">Estratégia</h4>
                  <p className="text-sm whitespace-pre-wrap mb-3">{strategy.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <h5 className="text-xs text-muted-foreground">Recursos</h5>
                      <p>{strategy.resources || "Não especificado"}</p>
                    </div>
                    <div>
                      <h5 className="text-xs text-muted-foreground">Responsável</h5>
                      <p>{strategy.responsible || "Não especificado"}</p>
                    </div>
                    <div>
                      <h5 className="text-xs text-muted-foreground">Frequência</h5>
                      <p>{strategy.frequency || "Não especificado"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">
                Nenhuma estratégia definida. Clique no botão acima para adicionar.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="notes">
        <div className="p-4 border rounded-md bg-muted/10">
          <h3 className="font-medium mb-2">Notas e Observações</h3>
          <p className="text-muted-foreground text-sm">
            Esta seção permite registrar notas e observações sobre o objetivo.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Helper functions for progress status
const getProgressStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'regression': 'bg-red-100 text-red-800',
    'no_change': 'bg-gray-100 text-gray-800',
    'minor_progress': 'bg-blue-100 text-blue-800',
    'significant_progress': 'bg-indigo-100 text-indigo-800',
    'achieved': 'bg-green-100 text-green-800'
  };
  
  return colors[status] || colors.no_change;
};

const getProgressStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'regression': 'Regressão',
    'no_change': 'Sem mudança',
    'minor_progress': 'Progresso menor',
    'significant_progress': 'Progresso significativo',
    'achieved': 'Objetivo alcançado'
  };
  
  return labels[status] || 'Desconhecido';
};

export default GoalTabContent;
