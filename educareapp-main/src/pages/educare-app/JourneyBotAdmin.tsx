
import React from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { JourneyBotAdminPanel } from '@/components/educare-app/journey-bot/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JourneyBotAdmin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600 mb-6">
              Você precisa estar autenticado para acessar o painel administrativo da Jornada Bot.
            </p>
            <Button onClick={() => navigate('/educare-app/login')}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/educare-app/journey-bot')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Jornada Bot
          </Button>
        </div>
      </div>
      
      <JourneyBotAdminPanel />
    </div>
  );
};

export default JourneyBotAdmin;
