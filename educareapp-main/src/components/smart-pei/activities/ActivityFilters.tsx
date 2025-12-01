
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useActivityFilters, { StatusFilter, PriorityFilter, TimeFrame } from '@/hooks/useActivityFilters';

interface ActivityFiltersProps {
  onSearch: (term: string) => void;
  onFilterChange?: (filters: any) => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({ 
  onSearch,
  onFilterChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  const handleFilterChange = (filterType: string, value: string) => {
    if (onFilterChange) {
      onFilterChange({ [filterType]: value });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar atividades..."
          className="pl-8"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select 
            defaultValue={StatusFilter.ALL} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={StatusFilter.ALL}>Todos os status</SelectItem>
              <SelectItem value={StatusFilter.PENDING}>Pendente</SelectItem>
              <SelectItem value={StatusFilter.IN_PROGRESS}>Em andamento</SelectItem>
              <SelectItem value={StatusFilter.COMPLETED}>Concluído</SelectItem>
              <SelectItem value={StatusFilter.CANCELLED}>Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority-filter">Prioridade</Label>
          <Select 
            defaultValue={PriorityFilter.ALL} 
            onValueChange={(value) => handleFilterChange('priority', value)}
          >
            <SelectTrigger id="priority-filter">
              <SelectValue placeholder="Filtrar por prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PriorityFilter.ALL}>Todas as prioridades</SelectItem>
              <SelectItem value={PriorityFilter.HIGH}>Alta</SelectItem>
              <SelectItem value={PriorityFilter.MEDIUM}>Média</SelectItem>
              <SelectItem value={PriorityFilter.LOW}>Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeframe-filter">Período</Label>
          <Select 
            defaultValue={TimeFrame.TODAY} 
            onValueChange={(value) => handleFilterChange('timeFrame', value)}
          >
            <SelectTrigger id="timeframe-filter">
              <SelectValue placeholder="Filtrar por período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimeFrame.TODAY}>Hoje</SelectItem>
              <SelectItem value={TimeFrame.TOMORROW}>Amanhã</SelectItem>
              <SelectItem value={TimeFrame.THIS_WEEK}>Esta semana</SelectItem>
              <SelectItem value={TimeFrame.NEXT_WEEK}>Próxima semana</SelectItem>
              <SelectItem value={TimeFrame.THIS_MONTH}>Este mês</SelectItem>
              <SelectItem value={TimeFrame.CUSTOM}>Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ActivityFilters;
