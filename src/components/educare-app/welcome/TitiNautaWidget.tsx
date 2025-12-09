import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TitiNautaWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                TitiNauta
                <span className="text-xs font-normal text-muted-foreground bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-full">
                  Seu assistente
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Olá! Sou o TitiNauta, seu assistente de desenvolvimento infantil. Estou aqui para te ajudar com orientações personalizadas sobre o desenvolvimento do seu filho.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => navigate('/educare-app/titinauta')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Conversar agora
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/educare-app/children')}
                className="border-purple-300 dark:border-purple-700"
              >
                Continuar Jornada
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TitiNautaWidget;
