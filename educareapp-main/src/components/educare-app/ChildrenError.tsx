
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';

interface ChildrenErrorProps {
  onRetry: () => void;
  onAddChild: () => void;
}

export const ChildrenError: React.FC<ChildrenErrorProps> = ({ onRetry, onAddChild }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-red-200 dark:border-red-900/40 p-6 sm:p-8 text-center">
      <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 w-16 h-16 mx-auto flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
        Erro ao carregar crianças
      </h3>
      <p className="mb-6 text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-md mx-auto">
        Não foi possível carregar a lista de crianças. Por favor, verifique sua conexão e tente novamente.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={onRetry}
          className="flex items-center gap-2 justify-center"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
        <Button
          onClick={onAddChild}
          className="flex items-center gap-2 justify-center"
        >
          <Plus className="h-4 w-4" />
          Adicionar Criança
        </Button>
      </div>
    </div>
  );
};
