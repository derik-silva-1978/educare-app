
import React, { useState } from 'react';
import { FilterIcon, SortAsc, SortDesc } from 'lucide-react';
import { PEIProgress } from '@/hooks/usePEI';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import ProgressRecordView from '../ProgressRecordView';

interface ProgressListViewProps {
  progressRecords: PEIProgress[];
  onCopyRecord: (id: string) => void;
}

const ProgressListView: React.FC<ProgressListViewProps> = ({ 
  progressRecords, 
  onCopyRecord 
}) => {
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredAndSortedProgress = React.useMemo(() => {
    let result = [...progressRecords];
    
    if (filterStatus) {
      result = result.filter(record => record.status === filterStatus);
    }
    
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    return result;
  }, [progressRecords, sortDirection, filterStatus]);
  
  const getStatusName = (status: string): string => {
    const statusNames: Record<string, string> = {
      regression: 'Regressão',
      no_change: 'Sem Mudança',
      minor_progress: 'Progresso Menor',
      significant_progress: 'Progresso Significativo',
      achieved: 'Alcançado'
    };
    return statusNames[status] || status;
  };

  return (
    <div>
      <div className="flex justify-end items-center gap-2 mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus(null)}>
              Todos os status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('regression')}>
              Apenas Regressão
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('no_change')}>
              Apenas Sem Mudança
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('minor_progress')}>
              Apenas Progresso Menor
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('significant_progress')}>
              Apenas Progresso Significativo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('achieved')}>
              Apenas Alcançado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
        >
          {sortDirection === 'desc' ? (
            <SortDesc className="h-4 w-4" />
          ) : (
            <SortAsc className="h-4 w-4" />
          )}
        </Button>
      </div>

      {filterStatus && (
        <div className="mb-3 flex">
          <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            <span>Filtro:</span>
            <span className="font-medium">{getStatusName(filterStatus)}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1 hover:bg-primary/20" 
              onClick={() => setFilterStatus(null)}
            >
              <span>×</span>
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredAndSortedProgress.length > 0 ? (
          filteredAndSortedProgress.map((progress) => (
            <ProgressRecordView 
              key={progress.id} 
              progress={progress} 
              showAuthor={true} 
              showCopyButton={true}
              onCopy={() => onCopyRecord(progress.id)}
            />
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              {filterStatus 
                ? `Nenhum registro com status "${getStatusName(filterStatus)}"`
                : 'Nenhum registro de progresso encontrado'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressListView;
