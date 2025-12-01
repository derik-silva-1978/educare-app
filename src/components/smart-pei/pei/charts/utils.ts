
import { PEIProgress } from '@/hooks/usePEI';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export interface ChartDataPoint {
  date: string; // formatted date
  fullDate: string; // full formatted date
  value: number; // numeric value
  originalStatus: PEIProgress['status']; // original status
}

// Convert progress status to numeric value for charting
export const getProgressValue = (status: PEIProgress['status']): number => {
  const values: Record<PEIProgress['status'], number> = {
    regression: 0,
    no_change: 25,
    minor_progress: 50,
    significant_progress: 75,
    achieved: 100
  };
  return values[status];
};

// Prepare data for time-series charts
export const prepareChartData = (progressRecords: PEIProgress[]): ChartDataPoint[] => {
  // Sort by date (oldest to newest)
  const sortedRecords = [...progressRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Convert to chart format
  return sortedRecords.map(record => ({
    date: format(new Date(record.date), 'dd/MM', { locale: pt }),
    fullDate: format(new Date(record.date), 'PPP', { locale: pt }),
    value: getProgressValue(record.status),
    originalStatus: record.status
  }));
};

// Prepare data for aggregate charts (pie, radar)
export const prepareAggregatedData = (chartData: ChartDataPoint[]) => {
  // Count occurrences of each status
  const statusCounts: Record<string, number> = {};
  
  chartData.forEach(point => {
    if (!statusCounts[point.originalStatus]) {
      statusCounts[point.originalStatus] = 0;
    }
    statusCounts[point.originalStatus]++;
  });
  
  // Convert to chart format
  return Object.entries(statusCounts).map(([status, count]) => {
    const statusLabels: Record<string, string> = {
      regression: 'Regressão',
      no_change: 'Sem Alteração',
      minor_progress: 'Progresso Leve',
      significant_progress: 'Progresso Significativo',
      achieved: 'Objetivo Alcançado'
    };
    
    return {
      name: statusLabels[status] || status,
      value: count
    };
  });
};

// Get chart color based on progress trend
export const getChartColor = (chartData: ChartDataPoint[]) => {
  if (chartData.length < 2) return { stroke: '#10b981', fill: '#10b981' };
  
  const firstValue = chartData[0].value;
  const lastValue = chartData[chartData.length - 1].value;
  
  if (lastValue > firstValue) return { stroke: '#10b981', fill: '#10b981' }; // green for improvement
  if (lastValue < firstValue) return { stroke: '#ef4444', fill: '#ef4444' }; // red for regression
  return { stroke: '#6b7280', fill: '#6b7280' }; // gray for no change
};
