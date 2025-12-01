
import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTitibot } from '../TitibotProvider';
import { Link } from 'react-router-dom';

const TitibotTurboCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isPremium, upgradeToPremium } = useTitibot();

  return (
    <Card className="border-2 border-yellow-200 overflow-hidden hover:shadow-md transition-all">
      <div className="absolute top-0 right-0">
        <div className="bg-yellow-500 text-white text-xs font-medium px-3 py-1 rounded-bl-md">
          Premium
        </div>
      </div>
      
      <CardHeader className={`pb-2 ${compact ? 'px-3 py-2' : ''}`}>
        <div className="flex items-center">
          <div className="flex items-center bg-yellow-500 p-1 rounded-full h-6 w-6 justify-center mr-2">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg">Titibot Turbo</CardTitle>
        </div>
        <CardDescription>
          Assistente avançado com análises detalhadas
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`pb-2 ${compact ? 'px-3' : ''}`}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center mr-1.5 flex-shrink-0">
                <span className="text-yellow-700 text-xs">✓</span>
              </div>
              <span>Respostas detalhadas</span>
            </div>
            <div className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center mr-1.5 flex-shrink-0">
                <span className="text-yellow-700 text-xs">✓</span>
              </div>
              <span>Baseado em evidências</span>
            </div>
            <div className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center mr-1.5 flex-shrink-0">
                <span className="text-yellow-700 text-xs">✓</span>
              </div>
              <span>Estratégias personalizadas</span>
            </div>
            <div className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center mr-1.5 flex-shrink-0">
                <span className="text-yellow-700 text-xs">✓</span>
              </div>
              <span>Suporte prioritário</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={`pt-2 ${compact ? 'px-3 pb-3' : ''}`}>
        {isPremium ? (
          <p className="text-sm text-muted-foreground w-full text-center">
            Titibot Turbo Ativado ✓
          </p>
        ) : (
          <Button
            asChild
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            <Link to="/store?product=titibot-turbo">
              <Zap className="h-4 w-4 mr-2" /> 
              Adquirir Turbo
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TitibotTurboCard;
