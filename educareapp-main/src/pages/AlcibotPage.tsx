
import React from 'react';
import { AIChat } from '@/components/educare-app/ai-chat/AIChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { useChildAIContext } from '@/hooks/useChildAIContext';
import { Button } from '@/components/ui/button';
import { Heart, RefreshCw, Shield } from 'lucide-react';

const AlcibotPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { childContext, isLoading, refreshContext } = useChildAIContext(childId);

  return (
    <div className="container py-6 h-[calc(100vh-4rem)]">
      {childId && (
        <Card className="mb-4 border-rose-200 bg-rose-50/40">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-600" />
                <CardTitle className="text-rose-800 text-sm">AlciBot com Dados Personalizados</CardTitle>
              </div>
              {isLoading ? (
                <Button variant="ghost" size="sm" className="h-7 gap-1" disabled>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs">Atualizando...</span>
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={refreshContext}>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="text-xs">Atualizar Dados</span>
                </Button>
              )}
            </div>
            <CardDescription className="text-xs text-rose-700">
              {childContext ? (
                <>AlciBot está personalizado com os dados de saúde relacionados a {childContext.childName}.</>
              ) : (
                <>Carregando dados personalizados para o assistente AlciBot...</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-3">
            <div className="bg-white rounded-md p-2 border flex items-start gap-2">
              <Shield className="h-4 w-4 text-rose-600 mt-0.5" />
              <div>
                <h3 className="text-xs font-medium text-rose-800">Orientações Personalizadas</h3>
                <p className="text-xs text-rose-600">Conselhos adaptados às necessidades maternas e de desenvolvimento infantil</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <AIChat 
        assistantType="alcibot"
        title="AlciBot - Assistente de Saúde Materna"
        initialPrompt={childContext 
          ? `Olá! Sou o AlciBot, seu assistente personalizado de saúde materna. Estou aqui para apoiar você com informações sobre o desenvolvimento de ${childContext.childName} e sua saúde pós-parto.`
          : "Olá, sou o AlciBot. Como posso auxiliar você com informações sobre saúde materna, gestação ou pós-parto?"}
        childContext={childContext}
      />
    </div>
  );
};

export default AlcibotPage;
