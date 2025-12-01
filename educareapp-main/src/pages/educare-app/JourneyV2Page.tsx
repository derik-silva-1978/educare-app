import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const JourneyV2Page: React.FC = () => {
  const { journeyId } = useParams<{ journeyId?: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="container py-6">
      {journeyId ? (
        <>
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/educare-app/journey-v2')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Jornada 2.0</h1>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Jornada {journeyId}</h2>
            <p className="text-muted-foreground mb-6">
              Esta funcionalidade está em desenvolvimento. Em breve você poderá explorar esta jornada.
            </p>
            <Button onClick={() => navigate('/educare-app/journey-v2')}>
              Voltar para Jornadas
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Jornadas 2.0</h1>
          <p className="text-muted-foreground mb-8">
            Explore as jornadas disponíveis para acompanhar o desenvolvimento do seu bebê e seu bem-estar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Jornada 1 */}
            <div className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                 onClick={() => navigate('/educare-app/journey-v2/1')}>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold">Jornada do Bebê</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Acompanhe o desenvolvimento do seu bebê com atividades e dicas personalizadas.
              </p>
              <Button variant="outline" className="w-full">
                Explorar Jornada
              </Button>
            </div>
            
            {/* Jornada 2 */}
            <div className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                 onClick={() => navigate('/educare-app/journey-v2/2')}>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <span className="text-2xl">💪</span>
                </div>
                <h3 className="text-xl font-bold">Jornada da Mãe</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Cuide do seu bem-estar físico e emocional durante a maternidade.
              </p>
              <Button variant="outline" className="w-full">
                Explorar Jornada
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JourneyV2Page;
