import React, { useState, useEffect } from 'react';
import { useJourneyV2 } from '@/hooks/useJourneyV2';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { JourneyV2Week, JourneyV2Quiz } from '@/services/api/journeyV2Service';
import { ChevronRight, Book, CheckCircle, Award, Calendar, ArrowRight } from 'lucide-react';

interface JourneyV2ExplorerProps {
  journeyId?: string;
  initialWeekId?: string;
}

export const JourneyV2Explorer: React.FC<JourneyV2ExplorerProps> = ({
  journeyId,
  initialWeekId
}) => {
  const [activeWeekId, setActiveWeekId] = useState<string | null>(initialWeekId || null);
  const [activeTab, setActiveTab] = useState<string>('topics');
  const [isReady, setIsReady] = useState<boolean>(false);
  
  // Efeito para garantir que o componente está montado antes de carregar dados
  useEffect(() => {
    setIsReady(true);
  }, []);
  
  const {
    selectedJourney,
    weeks,
    selectedWeek,
    userProgress,
    userBadges,
    isLoadingJourney,
    isLoadingWeeks,
    isLoadingWeek,
    isLoadingProgress,
    loadWeek,
    updateProgress
  } = useJourneyV2({
    journeyId,
    weekId: activeWeekId || undefined,
    autoLoad: isReady
  });
  
  // Selecionar uma semana
  const handleSelectWeek = (weekId: string) => {
    setActiveWeekId(weekId);
    loadWeek(weekId);
  };
  
  // Verificar se um tópico está completo
  const isTopicCompleted = (topicId: string) => {
    if (!userProgress || !activeWeekId) return false;
    
    const weekProgress = userProgress.find(p => p.week_id === activeWeekId);
    if (!weekProgress) return false;
    
    return weekProgress.completed_topics.includes(topicId);
  };
  
  // Verificar se um quiz está completo
  const isQuizCompleted = (quizId: string) => {
    if (!userProgress || !activeWeekId) return false;
    
    const weekProgress = userProgress.find(p => p.week_id === activeWeekId);
    if (!weekProgress) return false;
    
    return weekProgress.completed_quizzes.includes(quizId);
  };
  
  // Marcar um tópico como completo
  const markTopicCompleted = async (topicId: string) => {
    if (!activeWeekId || !userProgress) return;
    
    const weekProgress = userProgress.find(p => p.week_id === activeWeekId);
    let completedTopics: string[] = [];
    
    if (weekProgress) {
      completedTopics = [...weekProgress.completed_topics];
      if (!completedTopics.includes(topicId)) {
        completedTopics.push(topicId);
      }
    } else {
      completedTopics = [topicId];
    }
    
    await updateProgress(activeWeekId, { completedTopics });
  };
  
  // Marcar um quiz como completo
  const markQuizCompleted = async (quizId: string) => {
    if (!activeWeekId || !userProgress) return;
    
    const weekProgress = userProgress.find(p => p.week_id === activeWeekId);
    let completedQuizzes: string[] = [];
    
    if (weekProgress) {
      completedQuizzes = [...weekProgress.completed_quizzes];
      if (!completedQuizzes.includes(quizId)) {
        completedQuizzes.push(quizId);
      }
    } else {
      completedQuizzes = [quizId];
    }
    
    await updateProgress(activeWeekId, { completedQuizzes });
  };
  
  // Calcular progresso da semana
  const calculateWeekProgress = (weekId: string) => {
    if (!userProgress) return 0;
    
    const weekProgress = userProgress.find(p => p.week_id === weekId);
    if (!weekProgress) return 0;
    
    return weekProgress.progress;
  };
  
  // Renderizar lista de semanas
  const renderWeeksList = () => {
    if (isLoadingWeeks) {
      return Array(4).fill(0).map((_, i) => (
        <div key={i} className="mb-2">
          <Skeleton className="h-16 w-full" />
        </div>
      ));
    }
    
    if (!weeks || weeks.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma semana encontrada</p>
        </div>
      );
    }
    
    return weeks.map(week => (
      <Card 
        key={week.id} 
        className={`mb-2 cursor-pointer hover:bg-muted/50 transition-colors ${activeWeekId === week.id ? 'border-primary' : ''}`}
        onClick={() => handleSelectWeek(week.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{week.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {week.is_summary ? 'Resumo' : `Semana ${week.week}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={calculateWeekProgress(week.id)} className="w-16 h-2" />
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };
  
  // Renderizar detalhes da semana
  const renderWeekDetails = () => {
    if (isLoadingWeek || !selectedWeek) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }
    
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{selectedWeek.title}</h2>
          <p className="text-muted-foreground">{selectedWeek.description}</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="topics">
              <Book className="h-4 w-4 mr-2" />
              Tópicos
            </TabsTrigger>
            <TabsTrigger value="quizzes">
              <CheckCircle className="h-4 w-4 mr-2" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="h-4 w-4 mr-2" />
              Conquistas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="topics" className="space-y-4">
            {selectedWeek.topics && selectedWeek.topics.length > 0 ? (
              selectedWeek.topics.map(topic => (
                <Card key={topic.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {topic.title}
                      {isTopicCompleted(topic.id) ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Concluído
                        </Badge>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markTopicCompleted(topic.id)}
                        >
                          Marcar como concluído
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {/* Renderizar conteúdo do tópico */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4>Conteúdo do tópico</h4>
                        <p>Este tópico contém conteúdo interativo. Clique para visualizar.</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm">
                      Ver detalhes
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum tópico encontrado</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="quizzes" className="space-y-4">
            {selectedWeek.quizzes && selectedWeek.quizzes.length > 0 ? (
              renderQuizzesByDomain(selectedWeek.quizzes)
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum quiz encontrado</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="badges" className="space-y-4">
            {selectedWeek.badges && selectedWeek.badges.length > 0 ? (
              selectedWeek.badges.map(badge => (
                <Card key={badge.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <span className="text-2xl">{badge.icon || '🏆'}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                    {userBadges?.some(ub => ub.badge_id === badge.id) ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Conquistado
                      </Badge>
                    ) : (
                      <Badge variant="outline">Não conquistado</Badge>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma conquista encontrada</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  // Renderizar quizzes agrupados por domínio
  const renderQuizzesByDomain = (quizzes: JourneyV2Quiz[]) => {
    const babyDomains = quizzes.filter(q => q.domain === 'baby_domains');
    const motherDomains = quizzes.filter(q => q.domain === 'mother_domains');
    
    return (
      <>
        {babyDomains.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Desenvolvimento do Bebê</h3>
            {babyDomains.map(quiz => renderQuizCard(quiz))}
          </div>
        )}
        
        {motherDomains.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Bem-estar da Mãe</h3>
            {motherDomains.map(quiz => renderQuizCard(quiz))}
          </div>
        )}
      </>
    );
  };
  
  // Renderizar card de quiz
  const renderQuizCard = (quiz: JourneyV2Quiz) => (
    <Card key={quiz.id}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {quiz.title}
          {isQuizCompleted(quiz.id) ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Concluído
            </Badge>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => markQuizCompleted(quiz.id)}
            >
              Marcar como concluído
            </Button>
          )}
        </CardTitle>
        <CardDescription>{quiz.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quiz.options.map((option, index) => (
            <div 
              key={index} 
              className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              {option}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <h4 className="text-sm font-medium">Saiba mais:</h4>
          <p className="text-xs text-muted-foreground">{quiz.knowledge.title}</p>
        </div>
        <Button variant="ghost" size="sm">
          Ver detalhes
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>
              {isLoadingJourney ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                selectedJourney?.title || 'Jornada'
              )}
            </CardTitle>
            <CardDescription>
              {isLoadingJourney ? (
                <Skeleton className="h-4 w-full" />
              ) : (
                selectedJourney?.description || 'Selecione uma semana para começar'
              )}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-4">
            <ScrollArea className="h-[500px] pr-4">
              {renderWeeksList()}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-6">
            {activeWeekId ? (
              renderWeekDetails()
            ) : (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium mb-2">Selecione uma semana</h3>
                <p className="text-muted-foreground">
                  Escolha uma semana na lista ao lado para ver os detalhes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
