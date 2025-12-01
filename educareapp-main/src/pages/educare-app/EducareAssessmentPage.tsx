
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Activity, Plus, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';

const EducareAssessmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartQuiz = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to start the assessment.",
        variant: "destructive"
      });
      return;
    }
    navigate('/educare-app/children');
  };

  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Avaliações | Educare</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          Avaliações de Desenvolvimento
        </h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe o desenvolvimento infantil através de avaliações especializadas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Jornada Educare</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Avalie o desenvolvimento infantil com nossa metodologia especializada, baseada em fases e domínios específicos.
            </p>
            <Button onClick={handleStartQuiz} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Iniciar Nova Avaliação
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-xl">Histórico de Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Visualize e acompanhe o progresso das avaliações realizadas.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/educare-app/assessments/history')}>
              Ver Histórico
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducareAssessmentPage;
