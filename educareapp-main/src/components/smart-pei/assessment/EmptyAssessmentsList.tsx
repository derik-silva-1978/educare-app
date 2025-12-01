
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ClipboardList } from 'lucide-react';

interface EmptyAssessmentsListProps {
  onCreateAssessment: () => void;
}

const EmptyAssessmentsList: React.FC<EmptyAssessmentsListProps> = ({ 
  onCreateAssessment 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        <ClipboardList className="h-16 w-16 text-primary/40 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Nenhuma avaliação encontrada</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Você ainda não possui avaliações. Crie uma nova avaliação para começar a acompanhar o desenvolvimento dos alunos.
      </p>
      <Button onClick={onCreateAssessment} className="flex items-center">
        <PlusCircle className="h-4 w-4 mr-2" />
        Criar Nova Avaliação
      </Button>
    </div>
  );
};

export default EmptyAssessmentsList;
