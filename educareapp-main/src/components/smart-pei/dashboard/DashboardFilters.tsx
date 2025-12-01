
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export interface DashboardFiltersProps {
  period: string;
  setPeriod: React.Dispatch<React.SetStateAction<string>>;
  studentFilter: string; // Changed from studentGroup to studentFilter
  setStudentFilter: React.Dispatch<React.SetStateAction<string>>; // Changed accordingly
  dataSource: string;
  setDataSource: React.Dispatch<React.SetStateAction<string>>;
  resetFilters: () => void;
  refreshData: () => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  period,
  setPeriod,
  studentFilter, // Changed from studentGroup
  setStudentFilter, // Changed accordingly
  dataSource,
  setDataSource,
  resetFilters,
  refreshData
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium">Período</label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Período</SelectLabel>
                <SelectItem value="last-month">Último mês</SelectItem>
                <SelectItem value="current-month">Este mês</SelectItem>
                <SelectItem value="last-quarter">Último trimestre</SelectItem>
                <SelectItem value="current-quarter">Este trimestre</SelectItem>
                <SelectItem value="last-year">Último ano</SelectItem>
                <SelectItem value="current-year">Este ano</SelectItem>
                <SelectItem value="all-time">Todo o período</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Grupo de Alunos</label>
          <Select value={studentFilter} onValueChange={setStudentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o grupo de alunos" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Grupo de Alunos</SelectLabel>
                <SelectItem value="all">Todos os alunos</SelectItem>
                <SelectItem value="active">Alunos ativos</SelectItem>
                <SelectItem value="new">Novos alunos</SelectItem>
                <SelectItem value="with-pei">Com PEI ativo</SelectItem>
                <SelectItem value="needs-assessment">Aguardando avaliação</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Fonte de Dados</label>
          <Select value={dataSource} onValueChange={setDataSource}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a fonte de dados" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fonte de Dados</SelectLabel>
                <SelectItem value="all">Todas as fontes</SelectItem>
                <SelectItem value="assessments">Avaliações</SelectItem>
                <SelectItem value="activities">Atividades</SelectItem>
                <SelectItem value="reports">Relatórios</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2 md:mt-0 mt-4">
        <Button variant="outline" onClick={resetFilters} className="w-full md:w-auto">
          Limpar Filtros
        </Button>
        <Button variant="outline" onClick={refreshData} className="w-full md:w-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>
    </div>
  );
};

export default DashboardFilters;
