
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, FileBox, BarChart2, TrendingUp, ArrowUpRight } from 'lucide-react';
import DashboardFilters from './DashboardFilters';
import DashboardOverviewCards from './DashboardOverviewCards';
import PersonalizedInsights from './PersonalizedInsights';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { useTitibot } from '@/components/smart-pei/titibot/TitibotProvider';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const { openTitibot } = useTitibot();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('current-month');
  const [studentFilter, setStudentFilter] = useState('all');
  const [dataSource, setDataSource] = useState('all');
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  
  const resetFilters = () => {
    setPeriod('current-month');
    setStudentFilter('all');
    setDataSource('all');
    
    toast({
      title: "Filtros redefinidos",
      description: "Os filtros foram redefinidos para os valores padrão.",
    });
  };
  
  const refreshData = () => {
    toast({
      title: "Dados atualizados",
      description: "Os dados do dashboard foram atualizados.",
    });
  };
  
  const handleOpenTitibot = () => {
    openTitibot();
  };
  
  return (
    <div className="dashboard-container space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Acompanhe o progresso dos alunos e as atividades mais recentes.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenTitibot}>
            Assistente Smart PEI
          </Button>
          <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Estatísticas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Estatísticas Avançadas</DialogTitle>
                <DialogDescription>
                  Acesse métricas detalhadas e acompanhe o progresso de forma personalizada.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  As estatísticas avançadas permitem visualizar tendências de progresso dos alunos, métricas de desempenho por domínio, e histórico de atividades com análises comparativas.
                </p>
              </div>
              <DialogFooter>
                <Button asChild>
                  <Link to="/smart-pei/reports">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Ir para Relatórios
                  </Link>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <DashboardFilters 
        period={period}
        setPeriod={setPeriod}
        studentFilter={studentFilter}
        setStudentFilter={setStudentFilter}
        dataSource={dataSource}
        setDataSource={setDataSource}
        resetFilters={resetFilters}
        refreshData={refreshData}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Visão Geral</span>
            <span className="sm:hidden">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Atividades</span>
            <span className="sm:hidden">Ativ.</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileBox className="h-4 w-4" />
            <span className="hidden sm:inline">Relatórios</span>
            <span className="sm:hidden">Rel.</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <DashboardOverviewCards />
            </div>
            <div className="col-span-1">
              <PersonalizedInsights />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activities">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
                <p className="text-muted-foreground">Carregando atividades...</p>
              </div>
            </div>
            <div className="col-span-1">
              <PersonalizedInsights />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Relatórios Recentes</h3>
                <p className="text-muted-foreground">Carregando relatórios...</p>
              </div>
            </div>
            <div className="col-span-1">
              <PersonalizedInsights />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
