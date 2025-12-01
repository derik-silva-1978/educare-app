import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import JourneyBotSampleDataImporter from './JourneyBotSampleDataImporter';

interface JourneyBotErrorDisplayProps {
  error: string;
  onBackToDashboard: () => void;
}

export default function JourneyBotErrorDisplay({ 
  error, 
  onBackToDashboard 
}: JourneyBotErrorDisplayProps) {
  const navigate = useNavigate();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center space-y-6">
        <div className="text-orange-500 mb-4">⚠️</div>
        <h3 className="text-lg font-semibold mb-2">Ops, algo deu errado!</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        
        {error.includes('Nenhuma criança encontrada') && (
          <div className="space-y-4">
            <Button onClick={() => navigate('/educare-app/dashboard')} className="w-full">
              Ir para Dashboard e Adicionar Criança
            </Button>
          </div>
        )}
        
        {error.includes('Não encontramos perguntas adequadas') && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Parece que não há perguntas disponíveis no banco de dados. 
              Você pode importar dados de exemplo para testar o Titi Nauta:
            </p>
            <JourneyBotSampleDataImporter />
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Recarregar Página
            </Button>
          </div>
        )}
        
        <div className="flex gap-2 justify-center">
          <Button onClick={onBackToDashboard} variant="outline">
            Ir para Dashboard
          </Button>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}