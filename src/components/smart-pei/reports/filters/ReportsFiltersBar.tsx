
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportsFiltersBarProps {
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

const ReportsFiltersBar: React.FC<ReportsFiltersBarProps> = ({
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
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Bar */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar relatórios..."
            className="pl-9"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>

        {/* Type Filter */}
        <div className="md:col-span-2">
          <Select
            value={typeFilter || 'all'}
            onValueChange={onTypeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="progress">Progresso</SelectItem>
              <SelectItem value="assessment">Avaliação</SelectItem>
              <SelectItem value="pei">PEI</SelectItem>
              <SelectItem value="meeting">Reunião</SelectItem>
              <SelectItem value="activity">Atividade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2">
          <Select
            value={statusFilter || 'all'}
            onValueChange={onStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="in_progress">Em andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Filter */}
        <div className="md:col-span-2">
          <Select
            value={timeFilter || 'all'}
            onValueChange={onTimeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer data</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Últimos 7 dias</SelectItem>
              <SelectItem value="month">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Help Button */}
        <div className="md:col-span-1 flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={onHelpClick}
          >
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsFiltersBar;
