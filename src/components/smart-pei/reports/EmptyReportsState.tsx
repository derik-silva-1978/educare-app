
import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface EmptyReportsStateProps {
  searchQuery?: string;
  customMessage?: string;
}

const EmptyReportsState: React.FC<EmptyReportsStateProps> = ({ searchQuery, customMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
      
      {customMessage ? (
        <p className="text-muted-foreground mb-6">{customMessage}</p>
      ) : searchQuery ? (
        <>
          <h3 className="text-lg font-medium mb-2">
            Nenhum relatório encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            Não encontramos relatórios com os filtros selecionados.
            Tente ajustar sua busca ou criar um novo relatório.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-2">
            Nenhum relatório disponível
          </h3>
          <p className="text-muted-foreground mb-6">
            Você ainda não possui relatórios. 
            Crie seu primeiro relatório para começar.
          </p>
        </>
      )}
      
      <Button asChild>
        <Link to="/smart-pei/app/reports/new">Criar Relatório</Link>
      </Button>
    </div>
  );
};

export default EmptyReportsState;
