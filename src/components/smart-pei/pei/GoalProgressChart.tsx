
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PEIGoal, PEIProgress } from '@/hooks/usePEI';
import { format, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, ChartLine } from 'lucide-react';

interface GoalProgressChartProps {
  goal: PEIGoal;
  timeRange?: 'all' | '3m' | '6m';
}

export const GoalProgressChart: React.FC<GoalProgressChartProps> = ({ goal, timeRange = 'all' }) => {
  if (goal.progress.length < 2) {
    return null;
  }

  // Convert status to numeric value for charting
  const getProgressValue = (status: PEIProgress['status']): number => {
    const values: Record<PEIProgress['status'], number> = {
      regression: 0,
      no_change: 25,
      minor_progress: 50,
      significant_progress: 75,
      achieved: 100
    };
    return values[status];
  };

  // Filter records based on time range
  const filterByTimeRange = (progress: PEIProgress[]) => {
    if (timeRange === 'all') return progress;
    
    const now = new Date();
    const cutoffDate = timeRange === '3m' ? subMonths(now, 3) : subMonths(now, 6);
    
    return progress.filter(record => new Date(record.date) >= cutoffDate);
  };

  // Prepare data for chart
  const chartData = React.useMemo(() => {
    // Sort by date (oldest to newest)
    const sortedRecords = [...goal.progress].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Filter by selected time range
    const filteredRecords = filterByTimeRange(sortedRecords);
    
    // Convert to chart format
    return filteredRecords.map(record => ({
      date: format(new Date(record.date), 'dd/MM', { locale: pt }),
      fullDate: format(new Date(record.date), 'PPP', { locale: pt }),
      valor: getProgressValue(record.status),
      status: record.status
    }));
  }, [goal.progress, timeRange]);

  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map(item => item.valor));
    const dataMin = Math.min(...chartData.map(item => item.valor));
    
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
    
    return dataMax / (dataMax - dataMin);
  };
  
  const off = gradientOffset();
  
  // Get color based on progress trend
  const getChartColor = () => {
    if (chartData.length < 2) return { stroke: '#10b981', fill: '#10b981' };
    
    const firstValue = chartData[0].valor;
    const lastValue = chartData[chartData.length - 1].valor;
    
    if (lastValue > firstValue) return { stroke: '#10b981', fill: '#10b981' }; // green for improvement
    if (lastValue < firstValue) return { stroke: '#ef4444', fill: '#ef4444' }; // red for regression
    return { stroke: '#6b7280', fill: '#6b7280' }; // gray for no change
  };
  
  const chartColor = getChartColor();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <ChartLine className="h-4 w-4 text-primary" />
            Evolução do Progresso
          </CardTitle>
          {chartData.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {chartData.length} registros
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[170px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor.fill} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor.fill} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  domain={[0, 100]}
                  tickCount={5}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Progresso']}
                  labelFormatter={(label) => {
                    const item = chartData.find(item => item.date === label);
                    return item ? item.fullDate : label;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke={chartColor.stroke} 
                  fillOpacity={1}
                  fill="url(#colorProgress)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Dados insuficientes para exibir o gráfico</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgressChart;
