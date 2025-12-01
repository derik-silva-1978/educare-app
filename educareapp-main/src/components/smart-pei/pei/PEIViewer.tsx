
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const PEINotFoundCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PEI não encontrado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8 text-center">
          <div className="max-w-md space-y-4">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
            <h3 className="text-lg font-medium">PEI não disponível</h3>
            <p className="text-muted-foreground">
              O Plano Educacional Individualizado solicitado não foi encontrado ou não está mais disponível.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PEIProgress: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso do PEI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8 text-center">
          <div className="space-y-4">
            <p className="text-muted-foreground">Dados de progresso não disponíveis.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PEIContentTabs: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conteúdo do PEI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8 text-center">
          <div className="space-y-4">
            <p className="text-muted-foreground">Conteúdo não disponível.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PEIViewer: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <PEINotFoundCard />
      
      <div className="flex justify-center">
        <Button onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    </div>
  );
};
