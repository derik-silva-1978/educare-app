
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Book, Heart, Stars } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIAssistantTeaserProps {
  onOpenTitibot?: () => void;
  onOpenAlcibot?: () => void;
}

const AIAssistantTeaser: React.FC<AIAssistantTeaserProps> = ({ 
  onOpenTitibot, 
  onOpenAlcibot
}) => {
  const navigate = useNavigate();

  const handleOpenTitibot = () => {
    if (onOpenTitibot) {
      onOpenTitibot();
    } else {
      navigate('/educare/assistant/titibot');
    }
  };

  const handleOpenAlcibot = () => {
    if (onOpenAlcibot) {
      onOpenAlcibot();
    } else {
      navigate('/educare/assistant/alcibot');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white overflow-hidden relative group">
        <div className="absolute inset-0 bg-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-700" />
            <CardTitle className="text-sm font-semibold text-indigo-900">Titibot</CardTitle>
          </div>
          <CardDescription className="text-indigo-800 font-medium">Coach de Desenvolvimento Infantil</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-xs text-indigo-900 mb-3 font-medium">
            Acompanhe o desenvolvimento da criança com quizzes interativos e feedback personalizado.
          </p>
          <Button 
            onClick={handleOpenTitibot} 
            className="w-full bg-indigo-700 hover:bg-indigo-800 transition-all duration-300 transform group-hover:translate-y-[-2px]"
            variant="default"
            size="sm"
          >
            <Book className="h-4 w-4 mr-2" />
            Conversar com Titibot
          </Button>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10 pointer-events-none">
          <Stars className="w-full h-full text-indigo-700" />
        </div>
      </Card>

      <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-white overflow-hidden relative group">
        <div className="absolute inset-0 bg-rose-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-rose-700" />
            <CardTitle className="text-sm font-semibold text-rose-900">AlciBot</CardTitle>
          </div>
          <CardDescription className="text-rose-800 font-medium">Assistente de Saúde Materna</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-xs text-rose-900 mb-3 font-medium">
            Acompanhamento da gestação e pós-parto com orientações baseadas em evidências.
          </p>
          <Button 
            onClick={handleOpenAlcibot} 
            className="w-full bg-rose-700 hover:bg-rose-800 transition-all duration-300 transform group-hover:translate-y-[-2px]"
            variant="default"
            size="sm"
          >
            <Heart className="h-4 w-4 mr-2" />
            Conversar com AlciBot
          </Button>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10 pointer-events-none">
          <Bot className="w-full h-full text-rose-700" />
        </div>
      </Card>
    </div>
  );
};

export default AIAssistantTeaser;
