
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ListIcon } from 'lucide-react';

interface ActivityViewTabsProps {
  activities: any[];
  isLoading: boolean;
  onAddActivity: () => void;
  view: 'list' | 'calendar';
  setView: (view: 'list' | 'calendar') => void;
}

export const ActivityViewTabs: React.FC<ActivityViewTabsProps> = ({
  activities,
  isLoading,
  onAddActivity,
  view,
  setView
}) => {
  return (
    <Tabs 
      defaultValue={view === 'list' ? 'main-view' : 'calendar-view'} 
      value={view === 'list' ? 'main-view' : 'calendar-view'}
      className="mb-6"
      onValueChange={(value) => setView(value === 'main-view' ? 'list' : 'calendar')}
    >
      <TabsList>
        <TabsTrigger 
          value="main-view" 
          className="flex items-center"
        >
          <ListIcon className="mr-2 h-4 w-4" />
          Lista
        </TabsTrigger>
        <TabsTrigger 
          value="calendar-view" 
          className="flex items-center"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Calendário
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="main-view">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Atividades</CardTitle>
            <CardDescription>
              Gerencie suas atividades planejadas e em progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 text-muted-foreground">
              Este componente foi desativado durante a migração para o novo aplicativo Educare.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="calendar-view">
        <Card>
          <CardHeader>
            <CardTitle>Calendário de Atividades</CardTitle>
            <CardDescription>
              Visualize a programação de atividades em formato de calendário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 text-muted-foreground">
              Este componente foi desativado durante a migração para o novo aplicativo Educare.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ActivityViewTabs;
