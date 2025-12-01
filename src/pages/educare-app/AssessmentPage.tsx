
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Button } from '@/components/ui/button';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loading';
import { useSupabaseChildren } from '@/hooks/useSupabaseChildren';

const AssessmentPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [childName, setChildName] = useState<string>('');
  const { children } = useSupabaseChildren();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para acessar a avaliação",
        variant: "destructive"
      });
      navigate('/educare-app/auth');
      return;
    }

    if (!childId) {
      toast({
        title: "Seleção necessária",
        description: "Por favor, selecione uma criança para iniciar a avaliação",
        variant: "destructive"
      });
      navigate('/educare-app/children');
      return;
    }
    
    // Find child data
    if (children && children.length > 0) {
      const childData = children.find(child => child.id === childId);
      if (childData) {
        setChildName(`${childData.first_name} ${childData.last_name}`);
      } else {
        toast({
          title: "Criança não encontrada",
          description: "Não foi possível encontrar os dados desta criança",
          variant: "destructive"
        });
        navigate('/educare-app/children');
        return;
      }
    }
    
    setIsLoading(false);
  }, [childId, navigate, toast, user, children]);

  const handleBackToChild = () => {
    if (childId) {
      navigate(`/educare-app/child/${childId}`);
    } else {
      navigate('/educare-app/children');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner size="lg" text="Carregando informações da avaliação..." />
        </div>
      </div>
    );
  }

  if (!childId) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto bg-amber-50 border-amber-200">
          <CardContent className="flex flex-col items-center p-6">
            <AlertCircle className="h-10 w-10 text-amber-600 mb-4" />
            <h2 className="text-xl font-bold text-amber-800 mb-2">Seleção necessária</h2>
            <p className="text-amber-700 text-center mb-4">
              Para iniciar uma avaliação, por favor selecione uma criança primeiro.
            </p>
            <Button 
              onClick={() => navigate('/educare-app/children')}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Selecionar Criança
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Avaliação | {childName}</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToChild}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar ao Perfil
          </Button>
          <h1 className="text-2xl font-bold">Avaliação: {childName}</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Use o Journey Bot para avaliações interativas de desenvolvimento.
            </p>
            <div className="mt-4 text-center">
              <Button 
                onClick={() => navigate(`/educare-app/journey/${childId}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Iniciar Journey Bot
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AssessmentPage;
