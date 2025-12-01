
import React from 'react';
import { CalendarDaysIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ProgressTimeRangeSelectorProps {
  timeRange: 'all' | '3m' | '6m' | '1m';
  setTimeRange: (range: 'all' | '3m' | '6m' | '1m') => void;
}

const ProgressTimeRangeSelector: React.FC<ProgressTimeRangeSelectorProps> = ({
  timeRange,
  setTimeRange
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <CalendarDaysIcon className="h-4 w-4 mr-1.5" />
          {timeRange === '1m' ? '1 Mês' : 
           timeRange === '3m' ? '3 Meses' : 
           timeRange === '6m' ? '6 Meses' : 'Todo Período'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTimeRange('1m')}>
          Último Mês
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTimeRange('3m')}>
          Últimos 3 Meses
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTimeRange('6m')}>
          Últimos 6 Meses
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTimeRange('all')}>
          Todo o Período
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProgressTimeRangeSelector;
