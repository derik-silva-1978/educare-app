
import React, { useState, useEffect } from 'react';
import { AIChat } from '@/components/educare-app/ai-chat/AIChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { useChildAIContext } from '@/hooks/useChildAIContext';
import { Button } from '@/components/ui/button';
import { Bot, User2, RefreshCw, Shield, Database } from 'lucide-react';

const TitibotPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { childContext, isLoading, refreshContext } = useChildAIContext(childId);
  const [isDataMode, setIsDataMode] = useState<boolean>(!!childId);

  return (
    <div className="container py-6 h-[calc(100vh-4rem)]">
      {childId && (
        <Card className="mb-4 border-blue-200 bg-blue-50/40">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-800 text-sm">Titibot com Dados Personalizados</CardTitle>
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
            <CardDescription className="text-xs text-blue-700">
              {childContext ? (
                <>Titibot está personalizado com os dados de avaliação de {childContext.childName}.</>
              ) : (
                <>Carregando dados personalizados para o assistente Titibot...</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-md p-2 border flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-xs font-medium text-blue-800">Modo Especialista</h3>
                  <p className="text-xs text-blue-600">Análises específicas por domínio de desenvolvimento</p>
                </div>
              </div>
              <div className="bg-white rounded-md p-2 border flex items-start gap-2">
                <Bot className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-xs font-medium text-blue-800">Insights Proativos</h3>
                  <p className="text-xs text-blue-600">Sugestões baseadas nas áreas que precisam de atenção</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <AIChat 
        assistantType="titibot"
        title="Titibot - Coach de Desenvolvimento Infantil"
        initialPrompt={childContext 
          ? `Olá! Sou o Titibot, seu assistente de desenvolvimento infantil personalizado para ${childContext.childName}. Como posso ajudar você hoje?`
          : "Olá, sou o Titibot. Como posso ajudar você hoje com orientações sobre desenvolvimento infantil?"}
        childContext={childContext}
      />
    </div>
  );
};

export default TitibotPage;
