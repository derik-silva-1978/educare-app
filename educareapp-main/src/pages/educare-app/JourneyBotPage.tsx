import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCustomChildren } from '@/hooks/educare-app/useCustomChildren';
import { calculateAge } from '@/utils/dateUtils';
import JourneyBotChildSelector from '@/components/educare-app/journey-bot/JourneyBotChildSelector';
import JourneyBotSessionManager from '@/components/educare-app/journey-bot/JourneyBotSessionManager';
import JourneyBotLoading from '@/components/educare-app/journey-bot/JourneyBotLoading';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JourneyBotPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedChildId = searchParams.get('child');
  const { children, isLoading } = useCustomChildren();
  const [currentChild, setCurrentChild] = useState<any>(null);

  useEffect(() => {
    if (selectedChildId && children.length > 0) {
      // Redirecionar automaticamente para a interface WhatsApp
      navigate(`/educare-app/journey-bot-whatsapp/${selectedChildId}`);
    }
  }, [selectedChildId, children, navigate]);

  const handleChildSelect = (childId: string) => {
    // Redirecionar diretamente para a interface WhatsApp
    navigate(`/educare-app/journey-bot-whatsapp/${childId}`);
  };

  const handleBackToSelection = () => {
    setCurrentChild(null);
    window.history.pushState({}, '', '/educare-app/journey-bot');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <JourneyBotLoading />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Titi Nauta | Educare</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="h-12 w-12 text-blue-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Titi Nauta
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Acompanhe o desenvolvimento da sua criança com perguntas personalizadas
            </p>
          </div>

          {/* Content */}
          {children.length > 0 ? (
            <JourneyBotChildSelector 
              children={children.map(child => {
                const ageData = calculateAge(child.birthDate || child.birthdate);
                return {
                  id: child.id,
                  name: `${child.first_name} ${child.last_name}`,
                  age: ageData.years || 0,
                  birthdate: child.birthDate || child.birthdate,
                  gender: child.gender
                };
              })}
              onChildSelect={handleChildSelect}
            />
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhuma criança encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  Você precisa cadastrar pelo menos uma criança para usar o Titi Nauta.
                </p>
                <Button onClick={() => navigate('/educare-app/children')}>
                  Cadastrar Criança
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default JourneyBotPage;
