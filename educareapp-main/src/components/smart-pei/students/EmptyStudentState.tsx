
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStudentStateProps {
  onCreateClick?: () => void;
}

export const EmptyStudentState: React.FC<EmptyStudentStateProps> = ({ onCreateClick }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      navigate('/educare-app/child/new');
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-3">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Nenhuma criança cadastrada</CardTitle>
        <CardDescription>
          Adicione o perfil de uma criança para iniciar avaliações e acompanhar o desenvolvimento
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <Button onClick={handleAction} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Adicionar Criança
        </Button>
      </CardContent>
    </Card>
  );
};
