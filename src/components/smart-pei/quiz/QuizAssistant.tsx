
import React, { useState } from 'react';
import { useQuizAssistant } from '@/hooks/useQuizAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, BookOpen, ExternalLink, Sparkles, SendHorizonal, Loader2 } from 'lucide-react';
import type { DevelopmentDomain, DevelopmentQuestion } from '@/types/assessment';

interface QuizAssistantProps {
  domain: DevelopmentDomain;
  questions?: DevelopmentQuestion[];
  studentName?: string;
  studentContext?: string;
}

export const QuizAssistant: React.FC<QuizAssistantProps> = ({
  domain,
  questions,
  studentName,
  studentContext
}) => {
  const { getAssistance, isLoading, data, error } = useQuizAssistant();
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('answer');
  const [localData, setLocalData] = useState<any>(null);
  
  const handleGetAssistance = async () => {
    const result = await getAssistance(domain, questions, studentContext);
    if (result) {
      setLocalData(result);
    }
  };
  
  const handleSubmitCustomPrompt = async () => {
    if (!customPrompt.trim()) return;
    const result = await getAssistance(domain, questions, studentContext, customPrompt);
    if (result) {
      setLocalData(result);
    }
  };

  // Use either hook data or local state
  const displayData = data || localData;
  
  const handleReset = () => {
    setLocalData(null);
    setCustomPrompt('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Assistente de Atividades
        </CardTitle>
        <CardDescription>
          Obtenha sugestões personalizadas de atividades para este domínio
          {studentName ? ` para ${studentName}` : ''}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!displayData ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Clique no botão abaixo para obter sugestões de atividades baseadas nas respostas deste domínio.
            </p>
            
            <div className="flex flex-col space-y-2">
              <Textarea
                placeholder="Adicione um contexto específico ou uma pergunta personalizada..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="resize-none"
                rows={3}
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleSubmitCustomPrompt}
                  disabled={isLoading || !customPrompt.trim()}
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <SendHorizonal className="h-4 w-4 mr-2" />
                  )}
                  Enviar Pergunta
                </Button>
                <Button 
                  onClick={handleGetAssistance}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Lightbulb className="h-4 w-4 mr-2" />
                  )}
                  Obter Sugestões
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 mt-4">
                <p className="font-medium">Ocorreu um erro:</p>
                <p>{error.message}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="answer">Resposta</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
              </TabsList>

              <TabsContent value="answer" className="space-y-4 py-2">
                <div className="rounded-lg bg-muted p-4">
                  <p>{displayData.answer}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Sugestões de Atividades:</h4>
                  <ul className="space-y-2">
                    {displayData.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex gap-2">
                        <div className="rounded-full bg-primary/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        <p className="text-sm">{suggestion}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="resources">
                <div className="space-y-2">
                  <h4 className="font-medium">Recursos Recomendados:</h4>
                  <ul className="space-y-3">
                    {displayData.resources.map((resource: {title: string, url: string}, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <a 
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 flex items-center hover:underline"
                          >
                            Acessar <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReset}
              >
                Nova consulta
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizAssistant;
