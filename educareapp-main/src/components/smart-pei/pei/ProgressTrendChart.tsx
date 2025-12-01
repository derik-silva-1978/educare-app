
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PEIGoal } from '@/hooks/usePEI';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartLine, Calendar } from 'lucide-react';
import { 
  AreaChartComponent, 
  LineChartComponent, 
  BarChartComponent, 
  PieChartComponent, 
  RadarChartComponent 
} from './charts/ChartTypes';
import ChartTypeSelector, { ChartType } from './charts/ChartTypeSelector';
import { 
  prepareChartData, 
  prepareAggregatedData, 
  getChartColor,
  ChartDataPoint
} from './charts/utils';

interface ProgressTrendChartProps {
  goal: PEIGoal;
  timeRange?: 'all' | '3m' | '6m' | '1m';
}

export const ProgressTrendChart: React.FC<ProgressTrendChartProps> = ({ 
  goal, 
  timeRange = 'all' 
}) => {
  const [chartType, setChartType] = useState<ChartType>('area');

  if (goal.progress.length < 2) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Dados insuficientes para exibir o gráfico de tendência.
            É necessário ter pelo menos dois registros de progresso.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const chartData = React.useMemo(() => prepareChartData(goal.progress), 
    [goal.progress]
  );
  
  // Prepare aggregated data for pie/radar charts
  const aggregatedData = React.useMemo(() => prepareAggregatedData(chartData), 
    [chartData]
  );
  
  // Get chart color based on progress trend
  const chartColor = React.useMemo(() => {
    if (chartData.length < 2) return { stroke: '#10b981', fill: '#10b981' };
    
    const firstValue = chartData[0].value;
    const lastValue = chartData[chartData.length - 1].value;
    
    if (lastValue > firstValue) return { stroke: '#10b981', fill: '#10b981' }; // green for improvement
    if (lastValue < firstValue) return { stroke: '#ef4444', fill: '#ef4444' }; // red for regression
    return { stroke: '#6b7280', fill: '#6b7280' }; // gray for no change
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <ChartLine className="h-4 w-4 text-primary" />
            Análise de Progresso
          </CardTitle>
          
          <Tabs defaultValue={timeRange} className="h-8">
            <TabsList className="h-7">
              <TabsTrigger value="1m" className="text-xs px-2 h-6">1 Mês</TabsTrigger>
              <TabsTrigger value="3m" className="text-xs px-2 h-6">3 Meses</TabsTrigger>
              <TabsTrigger value="6m" className="text-xs px-2 h-6">6 Meses</TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-2 h-6">Todos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="px-2">
        {/* Chart Type Selector */}
        <ChartTypeSelector 
          chartType={chartType} 
          onChartTypeChange={setChartType} 
        />
          
        <div className="h-[200px] w-full">
          {chartData.length > 0 ? (
            <>
              {chartType === 'area' && (
                <AreaChartComponent data={chartData} chartColor={chartColor} />
              )}
              
              {chartType === 'line' && (
                <LineChartComponent data={chartData} chartColor={chartColor} />
              )}
              
              {chartType === 'bar' && (
                <BarChartComponent data={chartData} chartColor={chartColor} />
              )}
              
              {chartType === 'pie' && (
                <PieChartComponent data={aggregatedData} />
              )}
              
              {chartType === 'radar' && (
                <RadarChartComponent data={aggregatedData} />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Dados insuficientes para exibir o gráfico</p>
            </div>
          )}
        </div>
        
        <div className="mt-2 flex justify-between items-center px-4 pt-2 border-t border-border/20">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {chartData.length > 0 ? (
                `${chartData[0].date} até ${chartData[chartData.length - 1].date}`
              ) : (
                'Sem registros disponíveis'
              )}
            </span>
          </div>
          <div className="text-xs font-medium">
            {chartData.length} registros
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTrendChart;
