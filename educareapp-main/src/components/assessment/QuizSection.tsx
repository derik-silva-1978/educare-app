
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DevelopmentQuestion, ResponseType, DomainLabels, DevelopmentDomain } from '@/types/assessment';
import QuizQuestion from './QuizQuestion';

interface QuizSectionProps {
  questions: DevelopmentQuestion[];
  domain: DevelopmentDomain;
  responses: Record<string, { response: ResponseType, notes?: string }>;
  onResponseChange: (questionId: string, response: ResponseType, notes?: string) => void;
  disabled?: boolean;
  studentName?: string;
  studentContext?: string;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  domain,
  responses,
  onResponseChange,
  disabled = false,
  studentName,
  studentContext
}) => {
  // Ensure questions is an array and contains valid items
  const hasQuestions = Array.isArray(questions) && questions.length > 0;
  const questionsArray = Array.isArray(questions) ? questions.filter(q => q && q.id) : [];

  if (!hasQuestions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{DomainLabels[domain] || domain}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Não há perguntas disponíveis para este domínio.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {questionsArray.map(question => (
        <QuizQuestion
          key={question.id}
          question={question}
          response={responses[question.id]?.response || null}
          notes={responses[question.id]?.notes}
          onChange={(response, notes) => onResponseChange(question.id, response, notes)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default QuizSection;
