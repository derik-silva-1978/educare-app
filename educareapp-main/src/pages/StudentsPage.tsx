
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStudents from '@/hooks/useStudents';
import useStudentFilters from '@/hooks/useStudentFilters';
import { StudentFilters } from '@/components/smart-pei/StudentFilters';
import { EnhancedStudentList } from '@/components/smart-pei/students/EnhancedStudentList';
import { StudentGrid } from '@/components/smart-pei/students/StudentGrid';
import { Input } from '@/components/ui/input';

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { students, loading } = useStudents();
  const { 
    filters,
    setFilters,
    searchTerm, 
    setSearchTerm,
    filteredStudents,
    resetFilters,
    showFilters,
    setShowFilters
  } = useStudentFilters(students);
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  return (
    <>
      <Helmet>
        <title>Estudantes | Smart PEI</title>
        <meta name="description" content="Gestão de estudantes para Planos de Ensino Individualizados" />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 pt-12 pb-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-sky-600">Estudantes</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <Button 
                onClick={() => navigate('/smart-pei/students/new')}
                className="bg-sky-600 hover:bg-sky-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Estudante
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Lista de Estudantes</CardTitle>
                  <CardDescription>
                    Gerencie todos os estudantes cadastrados no sistema
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-sky-600 hover:bg-sky-700' : ''}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-sky-600 hover:bg-sky-700' : ''}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Buscar estudantes por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              
              {showFilters && (
                <StudentFilters
                  filters={filters}
                  onChange={setFilters}
                  onReset={resetFilters}
                />
              )}
              
              <div className="mt-6">
                {viewMode === 'list' ? (
                  <EnhancedStudentList
                    students={filteredStudents}
                    loading={loading}
                    searchTerm={searchTerm}
                    totalCount={students.length}
                    onStudentSelect={(id) => navigate(`/smart-pei/students/${id}`)}
                  />
                ) : (
                  <StudentGrid
                    students={filteredStudents}
                    onStudentSelect={(id) => navigate(`/smart-pei/students/${id}`)}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default StudentsPage;
