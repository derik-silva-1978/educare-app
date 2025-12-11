import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCustomChildren } from '@/hooks/educare-app/useCustomChildren';
import { calculateAgeInWeeks } from '@/utils/educare-app/calculateAge';
import { AIChat } from '@/components/educare-app/ai-chat/AIChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SuggestedQuestions from '@/components/educare-app/dashboard/SuggestedQuestions';
import { 
  Bot, 
  ArrowLeft, 
  Baby, 
  Heart, 
  Syringe, 
  Moon, 
  Brain,
  Sparkles,
  MessageCircle
} from 'lucide-react';

interface QuickTopic {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  topic: string;
  greeting: string;
}

const quickTopics: QuickTopic[] = [
  {
    id: 'desenvolvimento',
    label: 'Desenvolvimento Infantil',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50',
    topic: 'desenvolvimento infantil',
    greeting: 'Olá! Vou te ajudar com informações sobre desenvolvimento infantil. O que você gostaria de saber sobre os marcos de desenvolvimento, estimulação ou habilidades do seu bebê?'
  },
  {
    id: 'bebe',
    label: 'Jornada do Bebê',
    icon: Baby,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50',
    topic: 'jornada do bebê',
    greeting: 'Olá! Estou aqui para te ajudar na jornada do seu bebê. Posso tirar dúvidas sobre cuidados diários, alimentação, banho, e muito mais. Como posso ajudar?'
  },
  {
    id: 'mae',
    label: 'Jornada da Mãe',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-900/50',
    topic: 'saúde materna',
    greeting: 'Olá! Vou te ajudar com informações sobre saúde materna. Posso falar sobre recuperação pós-parto, amamentação, saúde emocional e bem-estar. O que você gostaria de saber?'
  },
  {
    id: 'vacinas',
    label: 'Vacinas e Saúde',
    icon: Syringe,
    color: 'text-green-600',
    bgColor: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50',
    topic: 'vacinas e imunização',
    greeting: 'Olá! Posso te ajudar com informações sobre o calendário vacinal do seu bebê, reações esperadas, e cuidados de saúde preventiva. Qual sua dúvida?'
  },
  {
    id: 'sono',
    label: 'Sono e Rotina',
    icon: Moon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50',
    topic: 'sono do bebê',
    greeting: 'Olá! Vou te ajudar com dúvidas sobre sono e rotina do bebê. Posso falar sobre padrões de sono, rituais para dormir, e como estabelecer uma rotina saudável. Como posso ajudar?'
  }
];

const TitiNautaAssistant: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topicParam = searchParams.get('topic');
  const { children } = useCustomChildren();
  
  const [selectedTopic, setSelectedTopic] = useState<QuickTopic | null>(null);
  const [customGreeting, setCustomGreeting] = useState<string>('');
  const [childAgeInWeeks, setChildAgeInWeeks] = useState<number | undefined>();

  // Calcular idade da criança mais jovem em semanas para sugestões contextualizadas
  useEffect(() => {
    if (children && children.length > 0) {
      const youngestChild = children[0];
      const birthDate = youngestChild.birthDate || youngestChild.birthdate;
      if (birthDate) {
        try {
          const ageInWeeks = calculateAgeInWeeks(birthDate);
          setChildAgeInWeeks(ageInWeeks);
        } catch {
          // Ignorar erro de cálculo
        }
      }
    }
  }, [children]);

  useEffect(() => {
    if (topicParam) {
      const matchedTopic = quickTopics.find(t => 
        t.topic.toLowerCase().includes(topicParam.toLowerCase()) ||
        topicParam.toLowerCase().includes(t.id)
      );
      if (matchedTopic) {
        setSelectedTopic(matchedTopic);
        setCustomGreeting(matchedTopic.greeting);
      } else {
        setCustomGreeting(`Olá! Você quer saber sobre "${topicParam}". Como posso ajudar você com esse tema?`);
      }
    } else {
      setSelectedTopic(null);
      setCustomGreeting('');
    }
  }, [topicParam]);

  const handleTopicSelect = (topic: QuickTopic) => {
    setSelectedTopic(topic);
    setCustomGreeting(topic.greeting);
  };

  const handleQuestionClick = (question: string) => {
    // A pergunta será enviada automaticamente via referência da AIChat
    const event = new CustomEvent('sendSuggestedQuestion', { detail: { question } });
    window.dispatchEvent(event);
  };

  const defaultGreeting = "Olá! Sou o TitiNauta, seu assistente virtual especializado em desenvolvimento infantil e saúde materna. Como posso ajudar você hoje?";

  return (
    <div className="container py-4 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/educare-app/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Assistente TitiNauta
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Especialista em desenvolvimento infantil e saúde
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-4 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20">
        <CardHeader className="py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-800 dark:text-purple-200 text-sm">
              Temas Rápidos
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-purple-700 dark:text-purple-300">
            Clique em um tema para iniciar uma conversa focada
          </CardDescription>
        </CardHeader>
        <CardContent className="py-0 pb-3">
          <div className="flex flex-wrap gap-2">
            {quickTopics.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopic?.id === topic.id;
              return (
                <Button
                  key={topic.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTopicSelect(topic)}
                  className={`${topic.bgColor} ${topic.color} transition-all duration-200 ${isSelected ? 'ring-2 ring-purple-500 ring-offset-1' : ''}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {topic.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 flex flex-col min-h-0 gap-4">
        <SuggestedQuestions 
          childAgeInWeeks={childAgeInWeeks}
          onQuestionClick={handleQuestionClick}
        />
        <div className="flex-1 min-h-0">
          <AIChat 
            assistantType="titibot"
            title="TitiNauta - Assistente Virtual Especialista"
            initialPrompt={customGreeting || defaultGreeting}
            key={selectedTopic?.id || 'default'}
          />
        </div>
      </div>
    </div>
  );
};

export default TitiNautaAssistant;
