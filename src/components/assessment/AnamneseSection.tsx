
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnamneseQuestion, AnamneseResponse } from '@/types/assessment';
import AnamneseQuestionCard from './AnamneseQuestion';
import { ArrowLeft, ArrowRight, CheckCircle2, Clipboard, FileCheck } from 'lucide-react';

interface AnamneseSectionProps {
  questions: AnamneseQuestion[];
  responses: AnamneseResponse[];
  onSaveResponse: (response: AnamneseResponse) => Promise<void>;
  onComplete: () => void;
}

export const AnamneseSection: React.FC<AnamneseSectionProps> = ({
  questions,
  responses,
  onSaveResponse,
  onComplete
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const questionsPerPage = 3;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  
  // Calculate progress
  useEffect(() => {
    if (questions.length === 0) {
      setProgress(100);
      return;
    }
    
    const answeredCount = responses.length;
    const requiredQuestions = questions.filter(q => q.required);
    const answeredRequired = responses.filter(r => 
      requiredQuestions.some(q => q.id === r.questionId)
    ).length;
    
    const percentage = Math.round((answeredRequired / requiredQuestions.length) * 100);
    setProgress(percentage);
  }, [questions, responses]);
  
  // Group questions by category
  const questionsByCategory = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, AnamneseQuestion[]>);
  
  const categories = Object.keys(questionsByCategory);
  
  // Get current page questions
  const getCurrentPageQuestions = () => {
    if (currentPage < categories.length) {
      const category = categories[currentPage];
      return questionsByCategory[category] || [];
    }
    return [];
  };
  
  const currentCategory = categories[currentPage] || 'Informações';
  const currentQuestions = getCurrentPageQuestions();
  
  // Find response for a question
  const findResponse = (questionId: string): AnamneseResponse | undefined => {
    return responses.find(r => r.questionId === questionId);
  };
  
  // Handle response change
  const handleResponseChange = async (question: AnamneseQuestion, responseValue: string, notes?: string) => {
    const response: AnamneseResponse = {
      questionId: question.id,
      value: responseValue, // Store in standard property
      response: responseValue, // Store in compatibility property
      notes // Store notes for compatibility
    };
    
    await onSaveResponse(response);
  };
  
  // Navigation handlers
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prevPage => prevPage + 1);
      window.scrollTo(0, 0);
    } else {
      onComplete();
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Check if all required questions on the current page are answered
  const areRequiredQuestionsAnswered = () => {
    if (currentQuestions.length === 0) return true;
    
    const requiredQuestions = currentQuestions.filter(q => q.required);
    if (requiredQuestions.length === 0) return true;
    
    return requiredQuestions.every(question => 
      responses.some(r => r.questionId === question.id)
    );
  };
  
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Anamnese - Histórico de Saúde Materna</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {responses.length}/{questions.length} respondidas
            </span>
            <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <CardDescription>
          Por favor, responda às perguntas sobre seu histórico de saúde durante a gestação
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="font-medium flex items-center gap-2 text-xl mb-2">
            <Clipboard className="h-5 w-5" />
            <span>{currentCategory}</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
          </p>
        </div>
        
        <div className="space-y-6 mb-8">
          {currentQuestions.map((question) => {
            const existingResponse = findResponse(question.id);
            
            return (
              <AnamneseQuestionCard
                key={question.id}
                question={question}
                response={existingResponse?.response || existingResponse?.value as string}
                notes={existingResponse?.notes}
                onChange={(response, notes) => 
                  handleResponseChange(question, response, notes)
                }
              />
            );
          })}
          
          {currentQuestions.length === 0 && (
            <div className="text-center p-8">
              <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-lg">
                Não há perguntas nesta categoria
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={isFirstPage}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button 
                key={index}
                variant="ghost"
                size="icon"
                className={`w-8 h-8 rounded-full ${currentPage === index ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setCurrentPage(index)}
              >
                <span>{index + 1}</span>
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={handleNextPage}
            disabled={currentQuestions.length > 0 && !areRequiredQuestionsAnswered()}
          >
            {isLastPage ? 'Concluir' : 'Próximo'}
            {isLastPage 
              ? <CheckCircle2 className="ml-2 h-4 w-4" />
              : <ArrowRight className="ml-2 h-4 w-4" />
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnamneseSection;
