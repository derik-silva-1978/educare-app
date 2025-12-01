
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Baby, Plus, ArrowLeft } from 'lucide-react';

interface JourneyBotEmptyStateProps {
  onBack: () => void;
}

const JourneyBotEmptyState: React.FC<JourneyBotEmptyStateProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Bot className="h-20 w-20 text-blue-500" />
              <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-xs">!</span>
                </div>
              </div>
            </div>
          </div>
          
          <CardTitle className="text-2xl mb-2">
            Ops! Nenhuma criança cadastrada
          </CardTitle>
          
          <p className="text-gray-600 text-lg">
            Para usar o Titi Nauta, você precisa cadastrar pelo menos uma criança primeiro.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center justify-center gap-2">
              <Baby className="h-5 w-5 text-blue-500" />
              Como funciona o Titi Nauta?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="text-center">
                <div className="text-2xl mb-2">📝</div>
                <p>Responda perguntas sobre o desenvolvimento da sua criança</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <p>Receba feedback personalizado do TitiBOT</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💡</div>
                <p>Obtenha dicas práticas para estimular o desenvolvimento</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate('/educare-app/child/new')}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="h-5 w-5 mr-2" />
              Cadastrar Primeira Criança
            </Button>
            
            <Button 
              onClick={onBack}
              variant="outline"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyBotEmptyState;
