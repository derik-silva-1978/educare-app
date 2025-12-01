
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyChildrenList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="p-12 text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-600 mb-3">
          Nenhuma criança cadastrada
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Comece adicionando informações sobre uma criança para acompanhar seu desenvolvimento e criar jornadas personalizadas.
        </p>
        <Button 
          onClick={() => navigate('/educare-app/child/new')}
          size="lg"
          className="gap-2"
        >
          <Plus className="h-5 w-5" />
          Adicionar Primeira Criança
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyChildrenList;
