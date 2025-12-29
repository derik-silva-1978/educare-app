import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  ChevronRight,
  Loader2,
  TrendingUp
} from 'lucide-react';
import httpClient from '@/services/api/httpClient';

interface ProfessionalFAQ {
  id: string;
  category: string;
  question_text: string;
  usage_count?: number;
  relevance_score?: number;
}

const seedQuestions: ProfessionalFAQ[] = [
  {
    id: 'seed-1',
    category: 'Avaliação',
    question_text: 'Quais são os marcos de desenvolvimento esperados para bebês de 6 meses?'
  },
  {
    id: 'seed-2',
    category: 'Intervenção',
    question_text: 'Quando devo encaminhar uma criança com atraso de linguagem para avaliação especializada?'
  },
  {
    id: 'seed-3',
    category: 'Protocolos',
    question_text: 'Quais instrumentos de triagem são recomendados para TEA em crianças de 18-24 meses?'
  },
  {
    id: 'seed-4',
    category: 'Orientação',
    question_text: 'Como orientar pais sobre estimulação motora para bebês com baixo tônus muscular?'
  },
  {
    id: 'seed-5',
    category: 'Sinais de Alerta',
    question_text: 'Quais são os sinais de alerta para atraso no desenvolvimento motor grosso no primeiro ano?'
  }
];

interface ProfessionalSuggestedTopicsProps {
  onQuestionClick?: (question: string) => void;
}

const ProfessionalSuggestedTopics: React.FC<ProfessionalSuggestedTopicsProps> = ({ 
  onQuestionClick 
}) => {
  const [questions, setQuestions] = useState<ProfessionalFAQ[]>(seedQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [showTopQuestions, setShowTopQuestions] = useState(false);

  useEffect(() => {
    const loadTopQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await httpClient.get<{ success: boolean; data: ProfessionalFAQ[]; count: number }>(
          'faqs/professional-suggestions'
        );
        
        if (response.success && response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const uniqueFaqs = response.data.data.filter((faq: ProfessionalFAQ, index: number, self: ProfessionalFAQ[]) => 
            index === self.findIndex(f => f.id === faq.id || f.question_text === faq.question_text)
          );
          setQuestions(uniqueFaqs.slice(0, 5));
          setShowTopQuestions(true);
        } else {
          setQuestions(seedQuestions);
          setShowTopQuestions(false);
        }
      } catch (error) {
        console.error('Erro ao carregar perguntas profissionais:', error);
        setQuestions(seedQuestions);
        setShowTopQuestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopQuestions();
  }, []);

  if (isLoading) {
    return (
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-200">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando sugestões...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Avaliação': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'Intervenção': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'Protocolos': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'Orientação': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      'Sinais de Alerta': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:border-amber-800 dark:from-amber-950/30 dark:to-orange-950/20">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-200">
          {showTopQuestions ? (
            <>
              <TrendingUp className="h-4 w-4" />
              Top 5 Perguntas Mais Relevantes
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4" />
              Perguntas Sugeridas para Profissionais
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 pb-3 space-y-2">
        {questions.map((question, idx) => (
          <Button
            key={question.id || idx}
            variant="ghost"
            className="w-full justify-between h-auto py-2 px-3 text-left hover:bg-amber-100/60 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100"
            onClick={() => onQuestionClick?.(question.question_text)}
          >
            <div className="flex-1 flex items-start gap-2">
              <Badge variant="outline" className={`text-[10px] shrink-0 ${getCategoryColor(question.category)}`}>
                {question.category}
              </Badge>
              <span className="text-xs leading-snug line-clamp-2">
                {question.question_text}
              </span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 ml-2 flex-shrink-0 text-amber-600" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfessionalSuggestedTopics;
