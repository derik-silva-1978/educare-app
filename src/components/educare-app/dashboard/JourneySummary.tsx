
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface JourneySummaryProps {
  childId: string | null;
  journeyProgress: number | null;
}

export const JourneySummary: React.FC<JourneySummaryProps> = ({
  childId,
  journeyProgress
}) => {
  const navigate = useNavigate();
  
  const handleContinueJourney = () => {
    if (childId) {
      navigate(`/educare-app/child/${childId}/quiz`);
    } else {
      navigate('/educare-app/children');
    }
  };
  
  const handleStartJourney = () => {
    if (childId) {
      navigate(`/educare-app/child/${childId}/quiz`);
    } else {
      navigate('/educare-app/children');
    }
  };
  
  if (childId === null) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Jornada Educare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-100 rounded-md p-4 flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800">
                Selecione uma criança para iniciar a jornada de avaliação.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/educare-app/children')}
            className="w-full"
          >
            Selecionar Criança
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Jornada Educare</CardTitle>
      </CardHeader>
      <CardContent>
        {journeyProgress === null ? (
          <>
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-start gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  Inicie a jornada de avaliação para identificar marcos de desenvolvimento.
                </p>
              </div>
            </div>
            <Button 
              onClick={handleStartJourney}
              className="w-full"
            >
              Iniciar Jornada
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Progresso da Avaliação</span>
                <span className="font-medium">{journeyProgress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${journeyProgress}%` }} 
                />
              </div>
            </div>
            <Button 
              onClick={handleContinueJourney}
              className="w-full"
            >
              Continuar Jornada
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default JourneySummary;
