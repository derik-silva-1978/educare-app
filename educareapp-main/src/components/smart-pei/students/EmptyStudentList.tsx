
import React from 'react';
import { UserX, Search, Plus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStudentListProps {
  message?: string;
  searchTerm?: string;
}

export const EmptyStudentList: React.FC<EmptyStudentListProps> = ({ message, searchTerm }) => {
  const navigate = useNavigate();
  const isSearchResult = Boolean(searchTerm);
  
  const handleBackClick = () => {
    navigate('/smart-pei/students');
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      {isSearchResult ? (
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
      ) : (
        <UserX className="h-12 w-12 text-muted-foreground mb-4" />
      )}
      
      <h3 className="text-lg font-medium mb-2">
        {message || "Nenhum estudante cadastrado"}
      </h3>
      
      <p className="text-muted-foreground text-center mb-6">
        {isSearchResult 
          ? "Tente usar termos diferentes ou verifique a ortografia."
          : "Cadastre um novo estudante para iniciar os planos de ensino individualizados."}
      </p>
      
      {isSearchResult ? (
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para todos os estudantes
        </Button>
      ) : (
        <Link to="/smart-pei/students/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Estudante
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyStudentList;
