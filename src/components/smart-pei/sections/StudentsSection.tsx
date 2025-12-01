import React, { useState } from 'react';
import { StudentList } from '../StudentList';
import { StudentFilters } from '../StudentFilters';
import { Button } from '@/components/ui/button';
import { UserPlus, Filter, BarChart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useStudents from '@/hooks/useStudents';
import { StudentSearchBar } from '../students/StudentSearchBar';
import { useToast } from '@/hooks/use-toast';
import useStudentFilters, { FilterState } from '@/hooks/useStudentFilters';

export const StudentsSection: React.FC = () => {
  const { students, loading } = useStudents();
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pathPrefix = '/smart-pei';
  const [itemsPerPage, setItemsPerPage] = useState(9); // Default 9 items per page
  
  const {
    filters,
    searchTerm,
    filteredStudents,
    activeFilterCount,
    setSearchTerm,
    setFilters,
    resetFilters
  } = useStudentFilters(students);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
    
    if (showFilters) {
      toast({
        title: "Filtros limpos",
        description: "Todos os filtros foram removidos.",
        duration: 3000
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAddStudent = () => {
    navigate(`${pathPrefix}/students/new`);
  };

  return (
    <div className="students-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-sky-900">Alunos</h2>
        <Button 
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700" 
          onClick={handleAddStudent}
        >
          <UserPlus size={16} />
          Novo Aluno
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <StudentSearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          placeholder="Buscar por nome, responsável ou série..."
          resultsCount={filteredStudents.length}
          totalCount={students.length}
          className="md:w-72"
        />
        
        <div className="flex gap-2 self-end">
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-1 ${showFilters ? 'bg-sky-50 text-sky-600 border-sky-200' : ''}`}
            onClick={toggleFilters}
          >
            <Filter size={16} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-sky-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            asChild
          >
            <Link to={`${pathPrefix}/dashboard`}>
              <BarChart size={16} />
              Estatísticas
            </Link>
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <StudentFilters 
          filters={filters} 
          onChange={handleFilterChange} 
          onReset={handleResetFilters} 
        />
      )}
      
      <div className="mt-6">
        <StudentList 
          students={filteredStudents} 
          loading={loading}
          searchTerm={searchTerm}
          totalCount={students.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default StudentsSection;
