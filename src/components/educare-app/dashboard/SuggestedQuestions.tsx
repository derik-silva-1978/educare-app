import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import httpClient from '@/services/api/httpClient';

interface FAQ {
  id: string;
  category: string;
  question_text: string;
  usage_count?: number;
  upvotes?: number;
  downvotes?: number;
  relevance_score?: number;
}

interface SuggestedQuestionsProps {
  childAgeInWeeks?: number;
  onQuestionClick?: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  childAgeInWeeks,
  onQuestionClick 
}) => {
  const [questions, setQuestions] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSuggestedQuestions = async () => {
      setIsLoading(true);
      try {
        const params = childAgeInWeeks ? `?ageInWeeks=${childAgeInWeeks}` : '';
        const response = await httpClient.get<{ faqs: FAQ[] }>(
          `faqs/contextual${params}`
        );
        
        if (response.success && response.data?.faqs) {
          setQuestions(response.data.faqs.slice(0, 5));
        }
      } catch (error) {
        console.error('Erro ao carregar perguntas sugeridas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestedQuestions();
  }, [childAgeInWeeks]);

  if (isLoading) {
    return (
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-200">
            <Lightbulb className="h-4 w-4" />
            Carregando sugestões...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:border-amber-800 dark:from-amber-950/30 dark:to-orange-950/20">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-200">
          <Lightbulb className="h-4 w-4" />
          Perguntas Frequentes para Esta Idade
        </CardTitle>
      </CardHeader>
      <CardContent className="py-3 space-y-2">
        {questions.map((question, idx) => (
          <Button
            key={question.id || idx}
            variant="ghost"
            className="w-full justify-between h-auto py-2 px-3 text-left hover:bg-amber-100/60 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100"
            onClick={() => onQuestionClick?.(question.question_text)}
          >
            <div className="flex-1 text-xs leading-snug line-clamp-2">
              {question.question_text}
            </div>
            <ChevronRight className="h-3.5 w-3.5 ml-2 flex-shrink-0 text-amber-600" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default SuggestedQuestions;
