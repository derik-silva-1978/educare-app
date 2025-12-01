
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QuizQuestionProps {
  question: {
    id: string;
    question_text: string;
    domain: string;
    importance_note?: string;
    positive_feedback_title: string;
    positive_feedback_tips: string[];
    negative_feedback_title: string;
    negative_feedback_tips: string[];
  };
  onAnswer: (questionId: string, answer: boolean) => void;
  isAnswered?: boolean;
  existingAnswer?: boolean;
  isLoading?: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  isAnswered = false,
  existingAnswer,
  isLoading = false,
}) => {
  const [showFeedback, setShowFeedback] = useState(isAnswered);
  const [answer, setAnswer] = useState<boolean | undefined>(existingAnswer);

  const handleAnswer = (value: boolean) => {
    setAnswer(value);
    setShowFeedback(true);
    onAnswer(question.id, value);
  };

  // Domain colors
  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'motor': return 'bg-blue-100 text-blue-800';
      case 'language': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'cognitive': return 'bg-amber-100 text-amber-800';
      case 'sensory': return 'bg-indigo-100 text-indigo-800';
      case 'emotional': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const domainLabel: Record<string, string> = {
    motor: 'Motor',
    language: 'Linguagem',
    social: 'Social',
    cognitive: 'Cognitivo',
    sensory: 'Sensorial',
    emotional: 'Emocional',
    communication: 'Comunicação',
    social_emotional: 'Sócio-emocional',
    self_care: 'Auto-cuidado',
    maternal_health: 'Saúde Materna',
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getDomainColor(question.domain)}`}>
              {domainLabel[question.domain] || question.domain}
            </span>
            <CardTitle className="text-lg">{question.question_text}</CardTitle>
          </div>
          {question.importance_note && (
            <div className="text-amber-500 ml-2 flex items-start">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
        </div>
        {question.importance_note && (
          <CardDescription className="mt-2 text-amber-700 bg-amber-50 p-2 rounded text-sm">
            <span className="font-semibold">Importante: </span>
            {question.importance_note}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        {!showFeedback ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-2 border-green-500 hover:bg-green-50"
              onClick={() => handleAnswer(true)}
              disabled={isLoading}
            >
              <Check className="mr-2 h-4 w-4 text-green-600" />
              Sim
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-2 border-red-500 hover:bg-red-50"
              onClick={() => handleAnswer(false)}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4 text-red-600" />
              Não
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <Alert variant={answer ? "default" : "destructive"} className={answer ? "bg-green-50 text-green-800 border-green-200" : ""}>
              <Info className="h-4 w-4" />
              <AlertTitle>{answer ? question.positive_feedback_title : question.negative_feedback_title}</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {(answer ? question.positive_feedback_tips : question.negative_feedback_tips).map((tip, index) => (
                    <li key={index} className="text-sm">{tip}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      
      {showFeedback && (
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setShowFeedback(false);
              setAnswer(undefined);
            }}
          >
            Mudar resposta
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuizQuestion;
