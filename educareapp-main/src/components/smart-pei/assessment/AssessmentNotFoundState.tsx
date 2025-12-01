
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileX, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AssessmentNotFoundStateProps {
  onBackToList: () => void;
  errorMessage?: string;
}

export const AssessmentNotFoundState: React.FC<AssessmentNotFoundStateProps> = ({
  onBackToList,
  errorMessage
}) => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <FileX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma avaliação selecionada</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {errorMessage || 
            'A avaliação que você está tentando acessar não foi encontrada ou não existe. Volte para a lista de avaliações para selecionar uma existente ou criar uma nova.'}
        </p>
        <Button onClick={onBackToList} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Lista de Avaliações
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssessmentNotFoundState;
