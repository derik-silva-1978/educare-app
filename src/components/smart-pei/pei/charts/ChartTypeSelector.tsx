
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, Radar, TrendingUp } from 'lucide-react';

export type ChartType = 'area' | 'line' | 'bar' | 'pie' | 'radar';

interface ChartTypeSelectorProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ 
  chartType, 
  onChartTypeChange 
}) => {
  return (
    <div className="flex justify-center gap-1 mb-4">
      <Button
        variant={chartType === 'area' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2"
        onClick={() => onChartTypeChange('area')}
      >
        <TrendingUp className="h-3.5 w-3.5 mr-1" />
        <span className="text-xs">Área</span>
      </Button>
      
      <Button
        variant={chartType === 'line' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2"
        onClick={() => onChartTypeChange('line')}
      >
        <LineChart className="h-3.5 w-3.5 mr-1" />
        <span className="text-xs">Linha</span>
      </Button>
      
      <Button
        variant={chartType === 'bar' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2"
        onClick={() => onChartTypeChange('bar')}
      >
        <BarChart className="h-3.5 w-3.5 mr-1" />
        <span className="text-xs">Barras</span>
      </Button>
      
      <Button
        variant={chartType === 'pie' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2"
        onClick={() => onChartTypeChange('pie')}
      >
        <PieChart className="h-3.5 w-3.5 mr-1" />
        <span className="text-xs">Pizza</span>
      </Button>
      
      <Button
        variant={chartType === 'radar' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2"
        onClick={() => onChartTypeChange('radar')}
      >
        <Radar className="h-3.5 w-3.5 mr-1" />
        <span className="text-xs">Radar</span>
      </Button>
    </div>
  );
};

export default ChartTypeSelector;
