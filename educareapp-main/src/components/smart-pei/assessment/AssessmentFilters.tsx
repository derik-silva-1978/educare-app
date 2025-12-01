
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import useStudents from '@/hooks/useStudents';

interface AssessmentFiltersProps {
  onSearch: (term: string) => void;
  onFilterByDomain?: (domain: string) => void;
  onFilterByStudent?: (studentId: string) => void;
  onFilterByStatus?: (status: string) => void;
  onClearFilters?: () => void;
}

const AssessmentFilters: React.FC<AssessmentFiltersProps> = ({
  onSearch,
  onFilterByDomain,
  onFilterByStudent,
  onFilterByStatus,
  onClearFilters
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentId, setStudentId] = useState('');
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState('');
  
  const { students } = useStudents();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };
  
  const handleStudentChange = (value: string) => {
    setStudentId(value);
    if (onFilterByStudent) {
      onFilterByStudent(value);
    }
  };
  
  const handleDomainChange = (value: string) => {
    setDomain(value);
    if (onFilterByDomain) {
      onFilterByDomain(value);
    }
  };
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
    if (onFilterByStatus) {
      onFilterByStatus(value);
    }
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setStudentId('');
    setDomain('');
    setStatus('');
    
    onSearch('');
    
    if (onFilterByStudent) onFilterByStudent('');
    if (onFilterByDomain) onFilterByDomain('');
    if (onFilterByStatus) onFilterByStatus('');
    if (onClearFilters) onClearFilters();
  };
  
  const hasActiveFilters = searchTerm || studentId || domain || status;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Label htmlFor="search-assessment" className="sr-only">Buscar</Label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-assessment"
            placeholder="Buscar avaliação..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        
        {onFilterByStudent && (
          <div>
            <Label htmlFor="student-filter" className="sr-only">Estudante</Label>
            <Select value={studentId} onValueChange={handleStudentChange}>
              <SelectTrigger id="student-filter">
                <SelectValue placeholder="Todos os Estudantes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Estudantes</SelectItem>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {onFilterByDomain && (
          <div>
            <Label htmlFor="domain-filter" className="sr-only">Domínio</Label>
            <Select value={domain} onValueChange={handleDomainChange}>
              <SelectTrigger id="domain-filter">
                <SelectValue placeholder="Todos os Domínios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Domínios</SelectItem>
                <SelectItem value="cognitive">Cognitivo</SelectItem>
                <SelectItem value="motor">Motor</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="language">Linguagem</SelectItem>
                <SelectItem value="adaptive">Adaptativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {onFilterByStatus && (
          <div>
            <Label htmlFor="status-filter" className="sr-only">Status</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssessmentFilters;
