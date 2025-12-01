
import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface TeamFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  licenseModelFilter: string;
  onLicenseModelFilterChange: (value: string) => void;
  licenseFilter: string;
  onLicenseFilterChange: (value: string) => void;
  onRefresh: () => void;
}

export const TeamFilters: React.FC<TeamFiltersProps> = ({
  search,
  onSearchChange,
  licenseModelFilter,
  onLicenseModelFilterChange,
  licenseFilter,
  onLicenseFilterChange,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar licenças..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={licenseModelFilter} onValueChange={onLicenseModelFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Modelo de licença" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os modelos</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="enterprise">Empresarial</SelectItem>
          </SelectContent>
        </Select>
        <Select value={licenseFilter} onValueChange={onLicenseFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo de licença" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="standard">Padrão</SelectItem>
            <SelectItem value="professional">Profissional</SelectItem>
            <SelectItem value="enterprise">Empresarial</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>
    </div>
  );
};

export default TeamFilters;
