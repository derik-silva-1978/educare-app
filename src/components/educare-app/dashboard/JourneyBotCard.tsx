
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight, Baby, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyBotCardProps {
  hasChildren: boolean;
  childrenCount: number;
}

export const JourneyBotCard: React.FC<JourneyBotCardProps> = ({ 
  hasChildren, 
  childrenCount 
}) => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    if (hasChildren) {
      navigate('/educare-app/journey-bot');
    } else {
      navigate('/educare-app/child/new');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-8 w-8 text-blue-500" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">TitiBOT</h3>
              <p className="text-sm text-gray-600 font-normal">Jornada de Desenvolvimento</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
            <p className="text-gray-700 text-sm leading-relaxed">
              Descubra como sua criança está se desenvolvendo através de perguntas personalizadas 
              sobre desenvolvimento motor, linguagem, social e sensorial.
            </p>
          </div>

          {hasChildren ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 rounded-lg p-2">
                <Baby className="h-4 w-4" />
                <span>
                  {childrenCount === 1 
                    ? '1 criança cadastrada' 
                    : `${childrenCount} crianças cadastradas`
                  }
                </span>
              </div>
              
              <Button 
                onClick={handleStartJourney}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                size="lg"
              >
                <Bot className="h-5 w-5 mr-2" />
                Iniciar Jornada
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-amber-700 bg-amber-100 rounded-lg p-2">
                <p>Para começar, você precisa cadastrar uma criança primeiro.</p>
              </div>
              
              <Button 
                onClick={handleStartJourney}
                variant="outline"
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                size="lg"
              >
                <Baby className="h-5 w-5 mr-2" />
                Cadastrar Criança
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">🏃</div>
              <div className="text-xs text-gray-600">Motor</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">💬</div>
              <div className="text-xs text-gray-600">Linguagem</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">👥</div>
              <div className="text-xs text-gray-600">Social</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">👁️</div>
              <div className="text-xs text-gray-600">Sensorial</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JourneyBotCard;
