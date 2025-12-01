import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DevelopmentQuestion, ResponseType, ResponseLabels, DomainLabels } from '@/types/assessment';
import { ChevronRight, ChevronLeft, Star, Book, ThumbsUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DynamicQuizProps {
  questions: DevelopmentQuestion[];
  responses: Record<string, { response: ResponseType; notes?: string }>;
  onResponseChange: (questionId: string, response: ResponseType, notes?: string) => void;
  onComplete?: () => void;
  disabled?: boolean;
}

const DynamicQuiz: React.FC<DynamicQuizProps> = ({
  questions,
  responses,
  onResponseChange,
  onComplete,
  disabled = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('feedback');
  
  // Filter out questions by checking for valid array and length
  const validQuestions = Array.isArray(questions) ? questions.filter(q => q && q.id) : [];
  
  // Safety check if no valid questions
  if (validQuestions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhuma pergunta disponível</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = validQuestions[currentIndex];
  const totalQuestions = validQuestions.length;
  const progress = Math.round((currentIndex / totalQuestions) * 100);
  
  // Get current response if it exists
  const currentResponse = currentQuestion ? responses[currentQuestion.id] : null;
  
  // Handle response selection
  const handleResponse = (response: ResponseType) => {
    if (disabled || !currentQuestion) return;
    
    onResponseChange(currentQuestion.id, response, currentResponse?.notes);
    // Show feedback after response
    setShowFeedback(true);
  };
  
  // Move to next question
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  // Move to previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFeedback(false);
    }
  };
  
  // Get question text - adapt based on your data structure
  const getQuestionText = (question: DevelopmentQuestion): string => {
    if (question.question) {
      return question.question;
    } else if (question.text) {
      return question.text;
    }
    return `Pergunta ${currentIndex + 1}`;
  };
  
  // Get age range text
  const getAgeRangeText = (question: DevelopmentQuestion): string => {
    if (!question.age_min_months && !question.age_max_months) {
      return 'Anamnese';
    } else if (question.age_min_months === question.age_max_months) {
      return `${question.age_min_months || 0} meses`;
    } else {
      return `${question.age_min_months || 0} a ${question.age_max_months || 0} meses`;
    }
  };
  
  // Get feedback content based on response
  const getFeedbackContent = (response: ResponseType): {title: string; text: string; icon: React.ReactNode} => {
    switch (response) {
      case 'yes':
        return {
          title: 'Ótimo!',
          text: 'Esta habilidade está sendo desenvolvida adequadamente!',
          icon: <ThumbsUp className="h-12 w-12 text-green-500" />
        };
      case 'partially':
        return {
          title: 'Em desenvolvimento',
          text: 'Esta habilidade está sendo desenvolvida. Continue estimulando!',
          icon: <Star className="h-12 w-12 text-amber-500" />
        };
      case 'no':
        return {
          title: 'Atenção',
          text: 'Esta habilidade precisa de mais atenção e estímulo.',
          icon: <Book className="h-12 w-12 text-blue-500" />
        };
      default:
        return {
          title: 'Feedback',
          text: 'Continue acompanhando o desenvolvimento.',
          icon: <Star className="h-12 w-12 text-purple-500" />
        };
    }
  };
  
  // Learning tips based on domain
  const getLearningTips = (domain: string): string[] => {
    switch (domain) {
      case 'motor':
        return [
          'Estimule o movimento das pernas e braços do bebê',
          'Coloque o bebê de bruços sob supervisão para fortalecer os músculos do pescoço',
          'Ofereça brinquedos que incentivem pegar e segurar objetos'
        ];
      case 'communication':
      case 'language':
        return [
          'Converse com o bebê, mesmo que ele ainda não responda',
          'Leia histórias em voz alta',
          'Cante músicas infantis e faça sons diferentes'
        ];
      case 'social_emotional':
      case 'social':
        return [
          'Sorria e mantenha contato visual frequente',
          'Responda aos sorrisos e vocalizações do bebê',
          'Ofereça carinho e aconchego quando o bebê demonstrar necessidade'
        ];
      case 'cognitive':
        return [
          'Mostre objetos coloridos e de diferentes texturas',
          'Brinque de esconder e aparecer (esconde-esconde)',
          'Estimule a exploração segura do ambiente'
        ];
      default:
        return [
          'Mantenha uma rotina consistente',
          'Ofereça estímulos variados',
          'Permita que a criança explore de forma segura'
        ];
    }
  };
  
  if (!currentQuestion) {
    return null;
  }
  
  const responseOptions: ResponseType[] = ['yes', 'partially', 'no', 'not_applicable'];
  const feedbackContent = currentResponse ? getFeedbackContent(currentResponse.response) : null;
  const learningTips = getLearningTips(currentQuestion.domain);

  return (
    <div className="space-y-4">
      {/* Progress section */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Pergunta {currentIndex + 1} de {totalQuestions}
        </span>
        <span className="text-sm font-medium">{progress}% completo</span>
      </div>
      <Progress value={progress} className="h-2 mb-6" />
      
      {/* Age range and domain badge */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {getAgeRangeText(currentQuestion)}
        </span>
        <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
          {DomainLabels[currentQuestion.domain] || currentQuestion.domain}
        </span>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">
            {getQuestionText(currentQuestion)}
          </CardTitle>
          {currentQuestion.help_text && (
            <p className="text-sm text-muted-foreground mt-2">{currentQuestion.help_text}</p>
          )}
        </CardHeader>
        
        <CardContent>
          {!showFeedback ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {responseOptions.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleResponse(option)}
                  variant={currentResponse?.response === option ? "default" : "outline"}
                  size="lg"
                  className="min-w-[120px] h-16 flex flex-col gap-1 items-center justify-center"
                  disabled={disabled}
                >
                  <span>{ResponseLabels[option]}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center p-4">
                {feedbackContent?.icon}
                <h3 className="text-xl font-semibold mt-4">{feedbackContent?.title}</h3>
                <p className="text-muted-foreground mt-2">{feedbackContent?.text}</p>
              </div>
              
              <Tabs 
                defaultValue="feedback" 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="learn">Dicas de Estímulo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="feedback" className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">O que isso significa?</h4>
                    <p className="text-sm">
                      Esta habilidade é importante para o desenvolvimento {DomainLabels[currentQuestion.domain] || currentQuestion.domain} 
                      da criança nesta fase.
                    </p>
                    
                    {currentResponse?.response === 'no' && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
                        <p className="font-medium text-amber-800">
                          Sugestão: Continue observando esta habilidade nas próximas semanas e consulte o pediatra caso não perceba evolução.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="learn" className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2 text-blue-900">Atividades de Estímulo</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      {learningTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleNext}
            disabled={!currentResponse}
          >
            {currentIndex < totalQuestions - 1 ? 'Próxima' : 'Finalizar'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DynamicQuiz;
