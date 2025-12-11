import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Baby, 
  Heart, 
  Syringe, 
  Moon, 
  Brain,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickTopic {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  topic: string;
}

const quickTopics: QuickTopic[] = [
  {
    id: 'desenvolvimento',
    label: 'Desenvolvimento',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 hover:bg-purple-200',
    topic: 'desenvolvimento infantil'
  },
  {
    id: 'bebe',
    label: 'Jornada do Bebê',
    icon: Baby,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 hover:bg-blue-200',
    topic: 'jornada do bebê'
  },
  {
    id: 'mae',
    label: 'Jornada da Mãe',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 hover:bg-pink-200',
    topic: 'saúde materna'
  },
  {
    id: 'vacinas',
    label: 'Vacinas',
    icon: Syringe,
    color: 'text-green-600',
    bgColor: 'bg-green-100 hover:bg-green-200',
    topic: 'vacinas e imunização'
  },
  {
    id: 'sono',
    label: 'Sono e Rotina',
    icon: Moon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 hover:bg-indigo-200',
    topic: 'sono do bebê'
  }
];

const TitiNautaQuickAccess: React.FC = () => {
  const navigate = useNavigate();

  const handleTopicClick = (topic: string) => {
    navigate(`/educare-app/titinauta?topic=${encodeURIComponent(topic)}`);
  };

  const handleOpenChat = () => {
    navigate('/educare-app/titinauta');
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-blue-950/10 dark:border-purple-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Assistente TitiNauta
              </h3>
              <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                Tire dúvidas sobre desenvolvimento infantil e saúde
              </p>
            </div>
          </CardTitle>
          <Button 
            onClick={handleOpenChat}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Abrir Chat
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Escolha um tema para iniciar uma conversa:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <Button
                key={topic.id}
                variant="ghost"
                size="sm"
                onClick={() => handleTopicClick(topic.topic)}
                className={`${topic.bgColor} ${topic.color} transition-all duration-200 hover:scale-105`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {topic.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TitiNautaQuickAccess;
