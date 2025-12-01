
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReportsFilterBarProps {
  searchQuery: string;
  typeFilter: string | null;
  statusFilter: string | null;
  timeFilter: string | null;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeFilter: (value: string) => void;
  onStatusFilter: (value: string) => void;
  onTimeFilter: (value: string) => void;
  onHelpClick: () => void;
}

export const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  searchQuery,
  typeFilter,
  statusFilter,
  timeFilter,
  onSearchChange,
  onTypeFilter,
  onStatusFilter,
  onTimeFilter,
  onHelpClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar relatórios..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select 
          value={typeFilter || 'all'} 
          onValueChange={onTypeFilter}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="assessment">Avaliação</SelectItem>
            <SelectItem value="progress">Progresso</SelectItem>
            <SelectItem value="pei">PEI</SelectItem>
            <SelectItem value="trimestral">Trimestral</SelectItem>
            <SelectItem value="summary">Sumário</SelectItem>
            <SelectItem value="team">Equipe</SelectItem>
            <SelectItem value="complete">Completo</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={statusFilter || 'all'} 
          onValueChange={onStatusFilter}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="complete">Completo</SelectItem>
            <SelectItem value="shared">Compartilhado</SelectItem>
            <SelectItem value="archived">Arquivado</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={timeFilter || 'all'} 
          onValueChange={onTimeFilter}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Qualquer data</SelectItem>
            <SelectItem value="week">Últimos 7 dias</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
            <SelectItem value="quarter">Este trimestre</SelectItem>
            <SelectItem value="year">Este ano</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onHelpClick}
          title="Ajuda com relatórios"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReportsFilterBar;
