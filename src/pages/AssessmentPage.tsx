
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { DomainProgress } from '@/components/assessment/DomainProgress';
import useAssessmentService from '@/hooks/useAssessmentService';
import { 
  DevelopmentQuestion, 
  Assessment,
  AssessmentResponse,
  ResponseType,
  DomainProgress as DomainProgressType,
  DomainLabels,
  DevelopmentDomain
} from '@/types/assessment';
import { formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { QuizQuestion } from '@/components/assessment/QuizQuestion';

const AssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    loading, 
    getAssessmentById, 
    getQuestions,
    getResponsesByAssessmentId,
    saveResponse,
    completeAssessment,
    calculateDomainProgress
  } = useAssessmentService();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<DevelopmentQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, AssessmentResponse>>({});
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [progress, setProgress] = useState<DomainProgressType[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [savingResponse, setSavingResponse] = useState(false);
  const [completingAssessment, setCompletingAssessment] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  useEffect(() => {
    const loadAssessment = async () => {
      if (!id) return;
      
      try {
        const assessmentData = await getAssessmentById(id);
        if (assessmentData) {
          setAssessment(assessmentData);
          
          if (assessmentData.domains && assessmentData.domains.length > 0) {
            setSelectedDomain(assessmentData.domains[0]);
          }
          
          const questionsData = await getQuestions(
            assessmentData.childAgeMonths, 
            assessmentData.domains
          );
          setQuestions(questionsData);
          
          const responsesData = await getResponsesByAssessmentId(id);
          const responsesMap: Record<string, AssessmentResponse> = {};
          responsesData.forEach(response => {
            responsesMap[response.question_id] = response;
          });
          setResponses(responsesMap);
          
          const progressData = await calculateDomainProgress(id);
          setProgress(progressData);
          
          if (progressData.length > 0) {
            const total = progressData.reduce((acc, domain) => acc + domain.total, 0);
            const completed = progressData.reduce((acc, domain) => acc + domain.completed, 0);
            const overall = total > 0 ? Math.round((completed / total) * 100) : 0;
            setOverallProgress(overall);
          }
        }
      } catch (error) {
        console.error("Error loading assessment:", error);
        toast({
          title: "Erro ao carregar avaliação",
          description: "Não foi possível carregar os dados da avaliação",
          variant: "destructive"
        });
      }
    };
    
    loadAssessment();
  }, [id]);
  
  const handleResponseChange = async (questionId: string, value: ResponseType, notes?: string) => {
    if (!assessment) return;
    
    setSavingResponse(true);
    
    try {
      const domainValue = selectedDomain || 'cognitive';
      
      const responseData = {
        assessment_id: assessment.id,
        question_id: questionId,
        response: value,
        notes: notes || '',
        domain: domainValue as DevelopmentDomain
      };
      
      if (responses[questionId]) {
        const newResponse = await saveResponse(responseData);
        
        if (newResponse) {
          setResponses(prev => ({
            ...prev,
            [questionId]: newResponse
          }));
        }
      } else {
        const newResponse = await saveResponse(responseData);
        
        if (newResponse) {
          setResponses(prev => ({
            ...prev,
            [questionId]: newResponse
          }));
        }
      }
      
      const progressData = await calculateDomainProgress(assessment.id);
      setProgress(progressData);
      
      if (progressData.length > 0) {
        const total = progressData.reduce((acc, domain) => acc + domain.total, 0);
        const completed = progressData.reduce((acc, domain) => acc + domain.completed, 0);
        const overall = total > 0 ? Math.round((completed / total) * 100) : 0;
        setOverallProgress(overall);
      }
    } catch (error) {
      console.error("Error saving response:", error);
      toast({
        title: "Erro ao salvar resposta",
        description: "Não foi possível salvar sua resposta",
        variant: "destructive"
      });
    } finally {
      setSavingResponse(false);
    }
  };
  
  const handleCompleteAssessment = async () => {
    if (!assessment) return;
    
    if (overallProgress < 100) {
      toast({
        title: "Avaliação incompleta",
        description: "Por favor, responda todas as perguntas antes de finalizar a avaliação",
        variant: "destructive"
      });
      return;
    }
    
    setCompletingAssessment(true);
    
    try {
      const success = await completeAssessment(assessment.id, feedback);
      
      if (success) {
        toast({
          title: "Avaliação finalizada",
          description: "A avaliação foi concluída com sucesso"
        });
        
        const assessmentData = await getAssessmentById(assessment.id);
        if (assessmentData) {
          setAssessment(assessmentData);
        }
      }
    } catch (error) {
      console.error("Error completing assessment:", error);
      toast({
        title: "Erro ao finalizar avaliação",
        description: "Não foi possível finalizar a avaliação",
        variant: "destructive"
      });
    } finally {
      setCompletingAssessment(false);
    }
  };
  
  const filteredQuestions = selectedDomain 
    ? questions.filter(q => q.domain === selectedDomain)
    : [];
    
  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  <p>Carregando avaliação...</p>
                </>
              ) : (
                <>
                  <p className="text-destructive">Avaliação não encontrada</p>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{assessment.title} | Educare App</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Título</h4>
                  <p>{assessment.title}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Data</h4>
                  <p>{formatRelative(new Date(assessment.date), new Date(), { locale: ptBR })}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Idade da Criança</h4>
                  <p className="text-muted-foreground">{Math.floor(assessment.childAgeMonths / 12)} anos e {assessment.childAgeMonths % 12} meses</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    assessment.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assessment.completed ? 'Concluída' : 'Em andamento'}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Progresso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso Total</span>
                    <span className="font-semibold">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Por Domínio</h4>
                  {progress.map(domainProgress => (
                    <DomainProgress 
                      key={domainProgress.domain} 
                      progress={domainProgress} 
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {assessment.title}
                </CardTitle>
                <CardDescription>
                  Avaliação de desenvolvimento
                </CardDescription>
              </CardHeader>
              
              {assessment.completed ? (
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Avaliação Concluída</h3>
                    <p className="text-muted-foreground max-w-md">
                      Esta avaliação já foi finalizada. Você pode visualizar os resultados e recomendações abaixo.
                    </p>
                    
                    {assessment.feedback && (
                      <Card className="mt-6 w-full">
                        <CardHeader>
                          <CardTitle className="text-lg">Observações Finais</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{assessment.feedback}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardContent>
                    <Tabs defaultValue={assessment.domains[0]} onValueChange={setSelectedDomain}>
                      <TabsList className="mb-4 flex flex-wrap">
                        {assessment.domains.map(domain => (
                          <TabsTrigger key={domain} value={domain}>
                            {DomainLabels[domain]}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {assessment.domains.map(domain => (
                        <TabsContent key={domain} value={domain} className="space-y-6">
                          {filteredQuestions.length === 0 ? (
                            <div className="text-center py-12">
                              <p className="text-muted-foreground">
                                Carregando perguntas...
                              </p>
                            </div>
                          ) : (
                            filteredQuestions.map(question => (
                              <QuizQuestion
                                key={question.id}
                                question={question}
                                response={responses[question.id]?.response || null}
                                notes={typeof responses[question.id]?.notes === 'string' 
                                  ? responses[question.id]?.notes as string
                                  : ''}
                                onChange={(response, notes) => handleResponseChange(question.id, response, notes)}
                                disabled={savingResponse || assessment.completed}
                              />
                            ))
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={handleCompleteAssessment}
                      disabled={overallProgress < 100 || completingAssessment}
                      className="ml-auto"
                    >
                      {completingAssessment ? 'Finalizando...' : 'Finalizar Avaliação'}
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentPage;
