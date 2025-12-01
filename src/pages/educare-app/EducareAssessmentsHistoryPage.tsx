
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, ChevronLeft } from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';

const EducareAssessmentsHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartAssessment = () => {
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
        <title>Histórico de Avaliações | Educare</title>
      </Helmet>

      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/educare-app/assessments')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Avaliações
        </Button>
        <h1 className="text-3xl font-bold">Histórico de Avaliações</h1>
      </div>

      <Card className="bg-gray-50 border-dashed border-2">
        <CardContent className="p-8 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma avaliação encontrada</h3>
          <p className="text-gray-500 mb-4">
            Você ainda não realizou nenhuma avaliação. Inicie uma nova avaliação para começar.
          </p>
          <Button onClick={handleStartAssessment}>
            Iniciar Nova Avaliação
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducareAssessmentsHistoryPage;
