
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, BarChart, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentActionButtonsProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  showStatistics: boolean;
  onToggleStatistics: () => void;
  activeFilterCount: number;
}

export const StudentActionButtons: React.FC<StudentActionButtonsProps> = ({
  showFilters,
  onToggleFilters,
  showStatistics,
  onToggleStatistics,
  activeFilterCount,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center gap-1 ${showFilters ? 'bg-muted' : ''}`}
        onClick={onToggleFilters}
      >
        <Filter size={16} />
        Filtros
        {activeFilterCount > 0 && (
          <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {activeFilterCount}
          </span>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center gap-1 ${showStatistics ? 'bg-muted' : ''}`}
        onClick={onToggleStatistics}
      >
        <BarChart size={16} />
        Estatísticas
      </Button>
      
      <Button 
        size="sm" 
        className="flex items-center gap-1"
        asChild
      >
        <Link to="/smart-pei/students/new">
          <UserPlus size={16} />
          Novo Aluno
        </Link>
      </Button>
    </div>
  );
};

export default StudentActionButtons;
