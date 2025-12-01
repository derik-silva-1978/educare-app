
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SearchIcon, Filter, X } from 'lucide-react';
import { ReportFilters as ReportFiltersType } from '@/types/report';

interface ReportFiltersProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: ReportFiltersType) => void;
  initialFilters?: ReportFiltersType;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  onSearch,
  onFilterChange,
  initialFilters = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ReportFiltersType>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const handleFilterChange = (key: keyof ReportFiltersType, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    onFilterChange({});
    onSearch('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar relatórios..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span>{showFilters ? 'Ocultar Filtros' : 'Filtros'}</span>
          </Button>
          
          {(Object.keys(filters).length > 0 || searchTerm) && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              <span>Limpar</span>
            </Button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <Select 
            value={filters.type || 'all'} 
            onValueChange={(value) => handleFilterChange('type', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="progress">Progresso</SelectItem>
              <SelectItem value="assessment">Avaliação</SelectItem>
              <SelectItem value="pei">PEI</SelectItem>
              <SelectItem value="summary">Sumário</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="team">Equipe</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.status || 'all'} 
            onValueChange={(value) => handleFilterChange('status', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
              <SelectItem value="shared">Compartilhado</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.dateRange || 'all'} 
            onValueChange={(value) => handleFilterChange('dateRange', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer Período</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="this_week">Esta Semana</SelectItem>
              <SelectItem value="this_month">Este Mês</SelectItem>
              <SelectItem value="this_quarter">Este Trimestre</SelectItem>
              <SelectItem value="this_year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.studentId || 'all'} 
            onValueChange={(value) => handleFilterChange('studentId', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Aluno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Alunos</SelectItem>
              <SelectItem value="thiago">Thiago Henrique</SelectItem>
              <SelectItem value="maria">Maria Eduarda</SelectItem>
              <SelectItem value="joao">João Pedro</SelectItem>
              <SelectItem value="sofia">Sofia Santos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ReportFilters;
