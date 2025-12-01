
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { PEIGoal, PEIProgress } from '@/hooks/usePEI';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  BarChart3Icon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface GoalProgressDashboardProps {
  goal: PEIGoal;
  className?: string;
}

const GoalProgressDashboard: React.FC<GoalProgressDashboardProps> = ({ goal, className }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  
  // Progress data for charts - ensure progress exists and is an array
  const progressData = goal.progress && Array.isArray(goal.progress) 
    ? goal.progress.map(progress => ({
        date: new Date(progress.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        statusValue: getStatusValue(progress.status),
        status: progress.status
      }))
    : [];
  
  // Get trends data - ensure progress exists and is an array
  const trendsData = goal.progress && Array.isArray(goal.progress) 
    ? getTrendsData(goal.progress)
    : [];
  
  // Domain data
  const domainData = [{
    name: goal.domain,
    value: getStatusValue(goal.status)
  }];
  
  // COLORS
  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE'];
  const STATUS_COLORS: Record<string, string> = {
    'regression': '#ef4444',
    'no_change': '#f97316',
    'minor_progress': '#3b82f6',
    'significant_progress': '#10b981',
    'achieved': '#14b8a6'
  };
  
  // Get formatted status
  function getFormattedStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'regression': 'Regressão',
      'no_change': 'Sem Mudança',
      'minor_progress': 'Progresso Leve',
      'significant_progress': 'Progresso Significativo',
      'achieved': 'Alcançado'
    };
    return statusMap[status] || status;
  }
  
  // Get status value for charts
  function getStatusValue(status: string): number {
    const statusValues: Record<string, number> = {
      'regression': 1,
      'no_change': 2,
      'minor_progress': 3,
      'significant_progress': 4,
      'achieved': 5,
      'not_started': 0,
      'in_progress': 3,
      'canceled': 0
    };
    return statusValues[status] || 0;
  }
  
  // Get trends data from progress records
  function getTrendsData(progressRecords: PEIProgress[]): any[] {
    if (!progressRecords || progressRecords.length === 0) {
      return [];
    }
    
    // Group by month for trend analysis
    const monthlyProgress: Record<string, { count: number, improved: number, same: number, regressed: number }> = {};
    
    progressRecords.forEach(record => {
      const date = new Date(record.date);
      const monthYear = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      if (!monthlyProgress[monthYear]) {
        monthlyProgress[monthYear] = { count: 0, improved: 0, same: 0, regressed: 0 };
      }
      
      monthlyProgress[monthYear].count++;
      
      // Categorize progress type
      if (record.status === 'regression') {
        monthlyProgress[monthYear].regressed++;
      } else if (record.status === 'no_change') {
        monthlyProgress[monthYear].same++;
      } else {
        // minor_progress, significant_progress, or achieved
        monthlyProgress[monthYear].improved++;
      }
    });
    
    // Convert to array format for charts
    return Object.entries(monthlyProgress).map(([month, data]) => ({
      month,
      ...data
    }));
  }
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Check if goal has progress data
  const hasProgressData = progressData && progressData.length > 0;
  
  // Calculate time elapsed from goal started date
  const calculateTimeElapsed = (): string => {
    // If there's no progress data, we can use the first progress date as a reference
    if (goal.progress && goal.progress.length > 0) {
      const firstProgressDate = new Date(goal.progress[0].date);
      const days = Math.floor((new Date().getTime() - firstProgressDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} dias`;
    }
    
    // If no progress data, return a default message
    return 'Data não disponível';
  };
  
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>Análise de Progresso do Objetivo</CardTitle>
        <CardDescription>
          Acompanhe o progresso e as tendências ao longo do tempo para o objetivo: {goal.title}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Progresso do Objetivo</h3>
              
              {!hasProgressData ? (
                <div className="p-4 border rounded-md bg-muted/20 text-center">
                  <p className="text-muted-foreground">
                    Nenhum registro de progresso disponível para este objetivo.
                  </p>
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  {chartType === 'bar' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={progressData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="statusValue" 
                          name="Nível de Progresso" 
                          fill="#0284c7"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  
                  {chartType === 'line' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="statusValue" 
                          name="Nível de Progresso" 
                          stroke="#0284c7" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant={chartType === 'bar' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setChartType('bar')}
                  className={chartType === 'bar' ? 'bg-sky-600 hover:bg-sky-700' : ''}
                >
                  <BarChart3Icon className="h-4 w-4 mr-1" />
                  Barras
                </Button>
                <Button 
                  variant={chartType === 'line' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setChartType('line')}
                  className={chartType === 'line' ? 'bg-sky-600 hover:bg-sky-700' : ''}
                >
                  <LineChartIcon className="h-4 w-4 mr-1" />
                  Linha
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tendências ao Longo do Tempo</h3>
              
              {trendsData.length === 0 ? (
                <div className="p-4 border rounded-md bg-muted/20 text-center">
                  <p className="text-muted-foreground">
                    Dados insuficientes para mostrar tendências.
                  </p>
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="improved" name="Progresso" stackId="a" fill="#10b981" />
                      <Bar dataKey="same" name="Sem Mudança" stackId="a" fill="#f97316" />
                      <Bar dataKey="regressed" name="Regressão" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Detalhes do Progresso</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <h4 className="text-sm font-medium mb-2">Status Atual</h4>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: STATUS_COLORS[goal.status] || '#6b7280' }}
                    ></div>
                    <span>{getFormattedStatus(goal.status)}</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="text-sm font-medium mb-2">Tempo Decorrido</h4>
                  <p>{calculateTimeElapsed()}</p>
                </div>
              </div>
              
              {hasProgressData && (
                <>
                  <h4 className="text-sm font-medium mt-2">Histórico de Progresso</h4>
                  <div className="space-y-2">
                    {goal.progress?.map((entry) => (
                      <div 
                        key={entry.id}
                        className="p-3 border rounded-md"
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <div 
                              className="h-2 w-2 rounded-full mr-2" 
                              style={{ backgroundColor: STATUS_COLORS[entry.status] || '#6b7280' }}
                            ></div>
                            <span className="text-sm font-medium">
                              {getFormattedStatus(entry.status)}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{entry.notes}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GoalProgressDashboard;
