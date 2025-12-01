import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomChildren } from '@/hooks/educare-app/useCustomChildren';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { useTitiNautaProgress } from '@/hooks/useTitiNautaProgress';
import useTitiNautaBadges from '@/hooks/useTitiNautaBadges';
import { useTitiNautaJourneyQuestions } from '@/hooks/useTitiNautaJourneyQuestions';
import { useTitiNautaWeekQuizzes, WeekQuiz } from '@/hooks/useTitiNautaWeekQuizzes';
import { ChevronRight, Lock, Play, ArrowLeft, Calendar, AlertCircle, CheckCircle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TitiNautaAvatar } from '@/components/educare-app/journey-bot/TitiNautaAvatar';
import { calculateAgeInMonths } from '@/utils/dateUtils';
import { useToast } from '@/hooks/use-toast';
import { JourneyQuestion } from '@/services/journeyQuestionsService';

/**
 * Página da Jornada do TitiNauta 2.0 - Seguindo o layout de referência
 */
const TitiNautaJourney: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { children, isLoading: isLoadingChildren } = useCustomChildren();
  const { user } = useCustomAuth();
  const [activeTab, setActiveTab] = useState('bebe');
  const [expandedMonth, setExpandedMonth] = useState<number | null>(1);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'text' | 'audio'>('text');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(childId || null);
  const [newChildName, setNewChildName] = useState('');
  const [newChildBirthdate, setNewChildBirthdate] = useState('');
  const [newChildGender, setNewChildGender] = useState('');
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(!childId);
  
  // Hooks para dados reais do TitiNauta
  const { saveProgress, saveAnswer, isSaving } = useTitiNautaProgress();
  const { badges } = useTitiNautaBadges(childId || '');
  const { toast } = useToast();
  
  // Estado para rastrear tópicos e quizzes completados
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [weekQuizzes, setWeekQuizzes] = useState<Map<number, WeekQuiz[]>>(new Map());
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  
  // Dados da criança selecionada
  const selectedChild = childId 
    ? children?.find(child => child.id === childId)
    : children && children.length > 0 ? children[0] : null;
  
  // Calcular idade em meses
  const ageInMonths = selectedChild ? calculateAgeInMonths(selectedChild.birthDate) : 0;
  
  // Determinar mês atual da jornada baseado na idade
  const currentJourneyMonth = Math.min(Math.max(Math.floor(ageInMonths), 1), 12);
  
  // Buscar perguntas da jornada baseadas na idade da criança
  const { 
    questions, 
    isLoading: isLoadingQuestions, 
    error: questionsError,
    getQuestionsByWeek,
    getQuestionsByMonth 
  } = useTitiNautaJourneyQuestions({
    childAgeInMonths: ageInMonths,
    autoLoad: !!selectedChild
  });
  
  // Função auxiliar para obter ícone baseado no domínio
  const getDomainIcon = useCallback((domainName: string): string => {
    const domain = domainName.toLowerCase();
    if (domain.includes('sono')) return '🌙';
    if (domain.includes('amament') || domain.includes('alimenta')) return '🍼';
    if (domain.includes('banho') || domain.includes('higiene')) return '🛁';
    if (domain.includes('umbigo')) return '👶';
    if (domain.includes('motor') || domain.includes('movimento')) return '🤸';
    if (domain.includes('comunica') || domain.includes('linguagem')) return '💬';
    if (domain.includes('cognitiv') || domain.includes('aprendizado')) return '🧠';
    if (domain.includes('social') || domain.includes('emocional')) return '❤️';
    if (domain.includes('sensorial')) return '👀';
    if (domain.includes('saúde')) return '🏥';
    return '📋';
  }, []);
  
  // Converter perguntas da API em estrutura de conteúdo da jornada
  const journeyContentFromAPI = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    
    // Agrupar perguntas por mês
    const monthsMap = new Map<number, JourneyQuestion[]>();
    
    questions.forEach(question => {
      const month = question.meta_min_months || 1;
      if (!monthsMap.has(month)) {
        monthsMap.set(month, []);
      }
      monthsMap.get(month)?.push(question);
    });
    
    // Converter para estrutura de jornada
    return Array.from(monthsMap.entries()).map(([month, monthQuestions]) => {
      // Agrupar por semana
      const weeksMap = new Map<number, JourneyQuestion[]>();
      
      monthQuestions.forEach(question => {
        const week = question.week || 1;
        if (!weeksMap.has(week)) {
          weeksMap.set(week, []);
        }
        weeksMap.get(week)?.push(question);
      });
      
      const weeks = Array.from(weeksMap.entries()).map(([weekNum, weekQuestions]) => {
        const firstQuestion = weekQuestions[0];
        
        return {
          week: weekNum,
          title: firstQuestion.week_title || `Semana ${weekNum}`,
          description: firstQuestion.week_description || '',
          topics: weekQuestions.map(q => ({
            id: q.id,
            title: q.domain_name,
            icon: getDomainIcon(q.domain_name),
            subtitle: q.domain_question,
            completed: completedTopics.has(q.id),
            content: {
              text: q.domain_importance || q.domain_question,
              audio: '/assets/audio/placeholder.mp3'
            },
            bullets: q.domain_activities ? q.domain_activities.split('\n').filter(Boolean) : undefined,
            feedback: {
              positive: q.domain_feedback_1,
              neutral: q.domain_feedback_2,
              negative: q.domain_feedback_3
            },
            alert: q.domain_alert_missing,
            questionId: q.id
          }))
        };
      });
      
      const firstQuestion = monthQuestions[0];
      
      return {
        month,
        title: firstQuestion.meta_title || `Jornada do Bebê - Mês ${month}`,
        description: firstQuestion.meta_description || `${weeks.length} semanas de conteúdo`,
        unlocked: month <= currentJourneyMonth + 1, // Desbloquear mês atual e próximo
        weeks
      };
    }).sort((a, b) => a.month - b.month);
  }, [questions, currentJourneyMonth, completedTopics, getDomainIcon]);
  
  // Conteúdo estático de fallback (usado se não houver dados da API)
  const journeyContentFallback = [
    {
      month: 1,
      title: 'Jornada do Bebê - Mês 1',
      description: '4 semanas de conteúdo',
      unlocked: true,
      weeks: [
        {
          week: 1,
          title: 'Semana 1 - A Chegada',
          description: 'Cuidados vitais para os primeiros dias.',
          topics: [
            {
              id: 'sono-seguro',
              title: 'Sono Seguro',
              icon: '🌙',
              subtitle: 'Sono Seguro: A Regra de Ouro',
              completed: true,
              content: {
                text: 'O sono seguro é fundamental para prevenir a síndrome da morte súbita infantil. Sempre coloque o bebê para dormir de barriga para cima, em um colchão firme e sem objetos soltos como travesseiros, cobertores fofos ou brinquedos. A temperatura do ambiente deve ser confortável, nem muito quente nem muito fria.',
                audio: '/assets/audio/sono-seguro.mp3'
              }
            },
            {
              id: 'amamentacao',
              title: 'Amamentação (pega & posição)',
              icon: '🍼',
              subtitle: 'Pega e Posição Correta',
              completed: false,
              content: {
                text: 'A pega correta é o segredo para uma amamentação de sucesso, sem dor e com ótima transferência de leite. A posição "barriga com barriga" é fundamental: o corpo do bebê deve estar totalmente virado para o seu. Espere ele abrir uma boca bem grande, como se fosse bocejar, para então trazê-lo à mama. O bebê precisa abocanhar grande parte da aréola, não apenas o mamilo. Observe os lábios: eles devem estar virados para fora, como uma "boca de peixinho". O queixo do bebê deve tocar a mama, e o nariz deve ficar livre. Uma amamentação correta não dói. Se sentir dor, é um sinal de que a pega precisa ser ajustada.',
                audio: '/assets/audio/amamentacao.mp3',
                video: '/assets/videos/amamentacao.mp4'
              },
              bullets: [
                'Bebê de frente para a mãe',
                'Barriga com barriga',
                'Boca bem aberta (bocejo)',
                'Lábios virados para fora',
                'Queixo tocando a mama',
                'Nariz livre para respirar',
                'Mais aréola visível acima',
                'Sucção lenta e profunda, sem dor'
              ]
            },
            {
              id: 'engasgos',
              title: 'Prevenção de Engasgos',
              icon: '🧸',
              subtitle: 'Prevenção e Ação: Engasgos',
              completed: false,
              content: {
                text: 'Os engasgos são comuns em bebês, mas podem ser prevenidos. Mantenha o bebê em posição semi-sentada durante a alimentação e por 30 minutos após. Evite distrações durante a amamentação. Saiba como agir em caso de engasgo: posicione o bebê de bruços sobre seu antebraço, com a cabeça mais baixa que o corpo, e dê até 5 tapas nas costas, entre as escápulas.',
                audio: '/assets/audio/engasgos.mp3'
              }
            }
          ]
        },
        {
          week: 2,
          title: 'Semana 2 - Higiene e Saúde',
          description: 'Estabelecendo rotinas de cuidado e proteção.',
          topics: [
            {
              id: 'banho',
              title: 'Banho do Bebê',
              icon: '🛁',
              subtitle: 'Técnicas para um banho seguro e confortável',
              completed: false,
              content: {
                text: 'O banho do bebê deve ser um momento tranquilo e seguro. Prepare tudo antes de começar: toalha, sabonete neutro, roupas limpas. A temperatura da água deve estar entre 36°C e 37°C. Segure o bebê firmemente, apoiando a cabeça e o pescoço. O banho deve durar de 5 a 10 minutos.',
                audio: '/assets/audio/banho.mp3'
              }
            },
            {
              id: 'umbigo',
              title: 'Cuidados com o Umbigo',
              icon: '👶',
              subtitle: 'Como limpar e cuidar do coto umbilical',
              completed: false,
              content: {
                text: 'O coto umbilical cai naturalmente entre 7 e 15 dias após o nascimento. Até lá, mantenha-o limpo e seco. Limpe ao redor da base com álcool 70% a cada troca de fralda. Deixe a área exposta ao ar sempre que possível. Observe sinais de infecção como vermelhidão, secreção com odor ou sangramento.',
                audio: '/assets/audio/umbigo.mp3'
              }
            }
          ]
        },
        {
          week: 3,
          title: 'Semana 3 - Segurança e Alertas',
          description: 'Aprendendo a identificar riscos e a proteger o ambiente.',
          topics: []
        },
        {
          week: 4,
          title: 'Semana 4 - Acompanhamento',
          description: 'Garantindo o acompanhamento da saúde e desenvolvimento.',
          topics: []
        }
      ]
    },
    {
      month: 2,
      title: 'Jornada do Bebê - Mês 2',
      description: '4 semanas de conteúdo',
      unlocked: true,
      weeks: []
    },
    {
      month: 3,
      title: 'Jornada do Bebê — Mês 3',
      description: '4 semanas de conteúdo',
      unlocked: true,
      weeks: []
    },
    {
      month: 4,
      title: 'Jornada do Bebê - Mês 4',
      description: '4 semanas de conteúdo',
      unlocked: false,
      weeks: []
    }
  ];
  
  // Usar conteúdo da API se disponível, senão usar fallback
  const journeyContent = journeyContentFromAPI.length > 0 ? journeyContentFromAPI : journeyContentFallback;
  
  // Calcular progresso real baseado em tópicos completados
  const progress = useMemo(() => {
    const totalTopics = journeyContent.reduce((acc, month) => {
      return acc + month.weeks.reduce((weekAcc, week) => {
        return weekAcc + week.topics.length;
      }, 0);
    }, 0);
    
    const completedCount = completedTopics.size;
    const progressPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
    
    return {
      baby: progressPercentage,
      mother: 0, // TODO: Implementar trilha da mãe
      overall: progressPercentage
    };
  }, [completedTopics, journeyContent]);
  
  // Selecionar automaticamente o mês atual baseado na idade do bebê
  useEffect(() => {
    if (currentJourneyMonth) {
      setExpandedMonth(currentJourneyMonth);
    }
  }, [currentJourneyMonth]);
  
  // Redirecionar se não houver crianças
  useEffect(() => {
    if (!isLoadingChildren && (!children || children.length === 0)) {
      navigate('/educare-app/child/new');
    }
  }, [children, isLoadingChildren, navigate]);
  
  // Buscar quizzes quando uma semana for expandida
  useEffect(() => {
    const fetchWeekQuizzes = async () => {
      if (expandedWeek && !weekQuizzes.has(expandedWeek) && selectedChild) {
        try {
          const minAge = Math.max(0, ageInMonths - 1);
          const maxAge = ageInMonths + 2;
          
          const httpClient = (await import('@/services/api/httpClient')).default;
          const response = await httpClient.get(
            `/journey-questions/week/${expandedWeek}/quizzes?min_age_months=${minAge}&max_age_months=${maxAge}`
          );
          
          if (response.success && response.data) {
            setWeekQuizzes(prev => new Map(prev).set(expandedWeek, response.data));
            console.log(`✅ ${response.data.length} quizzes carregados para semana ${expandedWeek}`);
          } else {
            console.log(`ℹ️ Nenhum quiz disponível para semana ${expandedWeek}`);
            setWeekQuizzes(prev => new Map(prev).set(expandedWeek, []));
          }
        } catch (error) {
          console.error('Erro ao buscar quizzes:', error);
          setWeekQuizzes(prev => new Map(prev).set(expandedWeek, []));
        }
      }
    };
    
    fetchWeekQuizzes();
  }, [expandedWeek, ageInMonths, weekQuizzes, selectedChild]);
  
  /**
   * Marca um tópico como completado e salva no backend
   */
  const handleTopicComplete = useCallback(async (topicId: string, questionId: string, answer?: string) => {
    if (!selectedChild) return;
    
    try {
      // Adicionar ao estado local
      setCompletedTopics(prev => new Set([...prev, topicId]));
      
      // Salvar resposta se fornecida
      if (answer && questionId) {
        await saveAnswer(selectedChild.id, questionId, answer);
      }
      
      // Salvar progresso geral
      const completedStepsList = Array.from(completedTopics).concat([topicId]);
      await saveProgress(
        selectedChild.id,
        'titinauta-2.0', // ID da jornada
        completedStepsList.length,
        completedStepsList
      );
      
      toast({
        title: 'Tópico completado!',
        description: 'Seu progresso foi salvo com sucesso.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      // Reverter estado local em caso de erro
      setCompletedTopics(prev => {
        const newSet = new Set(prev);
        newSet.delete(topicId);
        return newSet;
      });
    }
  }, [selectedChild, completedTopics, saveAnswer, saveProgress, toast]);
  
  /**
   * Salva resposta de quiz
   */
  const handleQuizAnswer = useCallback(async (quizId: string, selectedOptionId: string) => {
    if (!selectedChild) return;
    
    // Não permitir responder novamente
    if (quizAnswers[quizId]) return;
    
    try {
      // Salvar resposta localmente
      setQuizAnswers(prev => ({ ...prev, [quizId]: selectedOptionId }));
      
      // Salvar no backend
      await saveAnswer(selectedChild.id, quizId, selectedOptionId);
      
      // Marcar quiz como completado
      setCompletedQuizzes(prev => new Set([...prev, quizId]));
      
      // Buscar o quiz para verificar se acertou
      const allQuizzes = Array.from(weekQuizzes.values()).flat();
      const quiz = allQuizzes.find(q => q.id === quizId);
      
      if (quiz) {
        const isCorrect = quiz.knowledge.correct_answer === selectedOptionId;
        
        toast({
          title: isCorrect ? '✅ Correto!' : '📚 Continue aprendendo!',
          description: isCorrect 
            ? 'Parabéns! Você acertou a resposta.' 
            : 'Não desanime, o importante é aprender!',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao salvar resposta do quiz:', error);
      // Reverter estado local em caso de erro
      setQuizAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[quizId];
        return newAnswers;
      });
      
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar sua resposta. Tente novamente.',
        variant: 'destructive'
      });
    }
  }, [selectedChild, saveAnswer, toast, quizAnswers, weekQuizzes]);
  
  if (isLoadingChildren || isSaving || isLoadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-700 text-white">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mb-4"></div>
        <p className="text-sm">Carregando jornada personalizada...</p>
      </div>
    );
  }
  
  const handleStartJourney = () => {
    if (children && children.length > 0) {
      // Se já tem crianças cadastradas, seleciona a primeira
      setSelectedChildId(children[0].id);
      setShowWelcomeScreen(false);
    } else if (newChildName) {
      // Se não tem crianças mas preencheu o formulário, simula criação
      toast({
        title: 'Perfil configurado',
        description: `Jornada iniciada para ${newChildName}`,
      });
      setShowWelcomeScreen(false);
    } else {
      // Se não preencheu o formulário
      toast({
        title: 'Informações necessárias',
        description: 'Por favor, preencha o nome do bebê para continuar.',
        variant: 'destructive'
      });
    }
  };
  
  if (showWelcomeScreen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-700 p-4">
        <div className="w-full max-w-md bg-black/90 rounded-lg p-6 text-white">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/images/educare-logo.png" 
              alt="Educare+" 
              className="w-24 h-24 rounded-full"
            />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Bem-vindo(a) ao Educare+ app!</h1>
          <p className="text-center text-gray-300 mb-6">
            Sua jornada de cuidado nos primeiros meses do bebê começa aqui. Vamos configurar seu perfil.
          </p>
          
          {children && children.length > 0 ? (
            <>
              <h2 className="text-lg font-medium mb-3">Escolha uma criança:</h2>
              <div className="space-y-2 mb-4">
                {children.map(child => (
                  <div 
                    key={child.id}
                    className="p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setSelectedChildId(child.id);
                      setShowWelcomeScreen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold mr-3">
                        {child.first_name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 className="font-medium">{child.first_name} {child.last_name}</h3>
                        <p className="text-sm text-gray-400">
                          {child.birthdate ? `${Math.floor((new Date().getTime() - new Date(child.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 30))} meses` : 'Idade não disponível'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button 
                  onClick={() => navigate('/educare-app/child/new')}
                  variant="outline"
                  className="text-white border-white hover:bg-gray-800"
                >
                  Cadastrar Novo
                </Button>
                <Button 
                  onClick={() => setShowWelcomeScreen(false)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Continuar
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="childName" className="block text-sm font-medium mb-1">Nome do bebê:</label>
                  <input 
                    type="text" 
                    id="childName"
                    placeholder="Ex: Lua, Davi"
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium mb-1">Data de Nascimento:</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="birthdate"
                      placeholder="dd/mm/aaaa"
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white pr-10"
                      value={newChildBirthdate}
                      onChange={(e) => setNewChildBirthdate(e.target.value)}
                    />
                    <span className="absolute right-3 top-2 text-gray-400">
                      <Calendar className="h-5 w-5" />
                    </span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium mb-1">Sexo do bebê:</label>
                  <select 
                    id="gender"
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white appearance-none"
                    value={newChildGender}
                    onChange={(e) => setNewChildGender(e.target.value)}
                  >
                    <option value="" disabled>Selecione...</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                  </select>
                </div>
              </div>
              
              <Button 
                onClick={handleStartJourney}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3"
              >
                Começar Jornada
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  Já tem cadastro? <a href="#" onClick={() => navigate('/educare-app/auth')} className="text-purple-400 hover:underline">Faça login</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  
  const handleWeekClick = (month: number, week: number) => {
    if (expandedMonth === month && expandedWeek === week) {
      setExpandedWeek(null);
    } else {
      setExpandedWeek(week);
      setExpandedMonth(month);
    }
    setExpandedTopic(null);
  };
  
  const handleTopicClick = (topicId: string) => {
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(topicId);
    }
  };
  
  const handleContinueJourney = () => {
    // Encontrar o próximo tópico não completado no mês atual da criança
    // Priorizar o mês baseado na idade da criança
    const targetMonth = currentJourneyMonth; // Mês baseado na idade
    
    // 1. Primeiro, tentar encontrar no mês atual da idade
    const currentAgeMonth = journeyContent.find(month => month.month === targetMonth);
    if (currentAgeMonth && currentAgeMonth.unlocked) {
      for (const week of currentAgeMonth.weeks) {
        const incompleteTopic = week.topics.find(topic => !topic.completed);
        
        if (incompleteTopic) {
          setExpandedMonth(currentAgeMonth.month);
          setExpandedWeek(week.week);
          setExpandedTopic(incompleteTopic.id);
          
          setTimeout(() => {
            const element = document.getElementById(`topic-${incompleteTopic.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          
          return;
        }
      }
    }
    
    // 2. Se completou o mês atual, buscar nos meses próximos (±1 mês)
    const nearbyMonths = journeyContent.filter(month => 
      month.unlocked && 
      Math.abs(month.month - targetMonth) <= 1 &&
      month.month !== targetMonth
    ).sort((a, b) => Math.abs(a.month - targetMonth) - Math.abs(b.month - targetMonth));
    
    for (const month of nearbyMonths) {
      for (const week of month.weeks) {
        const incompleteTopic = week.topics.find(topic => !topic.completed);
        
        if (incompleteTopic) {
          setExpandedMonth(month.month);
          setExpandedWeek(week.week);
          setExpandedTopic(incompleteTopic.id);
          
          setTimeout(() => {
            const element = document.getElementById(`topic-${incompleteTopic.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          
          return;
        }
      }
    }
    
    // 3. Se não encontrou nenhum tópico incompleto na faixa etária adequada
    toast({
      title: 'Parabéns! 🎉',
      description: `Você completou todos os tópicos do mês ${targetMonth}!`,
      variant: 'default'
    });
  };
  
  return (
    <div className="min-h-screen bg-indigo-700 text-gray-800 pb-16">
      <div className="container mx-auto p-4">
        {/* Informações sobre dados carregados */}
        {questions.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center text-sm text-green-800">
              <span className="mr-2">✓</span>
              <span>
                <strong>{questions.length} perguntas</strong> carregadas para {selectedChild?.first_name} 
                ({ageInMonths} {ageInMonths === 1 ? 'mês' : 'meses'})
              </span>
            </div>
          </div>
        )}
        
        {/* Aviso se não houver perguntas */}
        {!isLoadingQuestions && questions.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>
                Nenhuma pergunta disponível para esta faixa etária. Usando conteúdo padrão.
              </span>
            </div>
          </div>
        )}
        
        {/* Trilhas de Progresso */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700">Trilha do Bebê 👶</span>
              <span className="text-gray-700">{progress.baby}%</span>
            </div>
            <Progress value={progress.baby} className="h-2 bg-gray-200" indicatorClassName="bg-purple-500" />
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700">Trilha da Mãe 💜</span>
              <span className="text-gray-700">{progress.mother}%</span>
            </div>
            <Progress value={progress.mother} className="h-2 bg-gray-200" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700">Progresso da Jornada</span>
              <span className="text-gray-700">{progress.overall}%</span>
            </div>
            <Progress value={progress.overall} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />
          </div>
        </div>
        
        {/* Tabs de Navegação */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="bebe" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700">
                Bebê 👶
              </TabsTrigger>
              <TabsTrigger value="mae" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700">
                Mãe 💜
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700">
                Checklist ✅
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bebe">
              {/* Lista de Meses */}
              {journeyContent.map((month) => (
                <div key={`month-${month.month}`} className="mb-4">
                  <div 
                    className={`flex items-center justify-between p-4 ${expandedMonth === month.month ? 'bg-blue-100 rounded-t-lg' : 'bg-white rounded-lg'} cursor-pointer`}
                    onClick={() => setExpandedMonth(expandedMonth === month.month ? null : month.month)}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg ${month.unlocked ? 'bg-blue-500' : 'bg-gray-300'} text-white flex items-center justify-center mr-3`}>
                        {month.unlocked ? month.month : <Lock size={16} />}
                      </div>
                      <div>
                        <h3 className="font-medium">{month.title}</h3>
                        <p className="text-sm text-gray-500">{month.description}</p>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-transform ${expandedMonth === month.month ? 'rotate-90' : ''}`} />
                  </div>
                  
                  {/* Semanas do Mês */}
                  {expandedMonth === month.month && (
                    <div className="bg-white rounded-b-lg overflow-hidden">
                      {month.weeks.map((week) => (
                        <div key={`week-${month.month}-${week.week}`}>
                          <div 
                            className={`flex items-center justify-between p-4 border-t cursor-pointer ${expandedWeek === week.week ? 'bg-gray-50' : ''}`}
                            onClick={() => handleWeekClick(month.month, week.week)}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center mr-3">
                                {week.week}
                              </div>
                              <div>
                                <h4 className="font-medium">{week.title}</h4>
                                <p className="text-sm text-gray-500">{week.description}</p>
                              </div>
                            </div>
                            {week.topics.length > 0 && (
                              <ChevronRight className={`h-5 w-5 transition-transform ${expandedWeek === week.week ? 'rotate-90' : ''}`} />
                            )}
                          </div>
                          
                          {/* Tópicos da Semana */}
                          {expandedWeek === week.week && week.topics.map((topic) => (
                            <div 
                              key={`topic-${topic.id}`}
                              id={`topic-${topic.id}`}
                              className="border-t px-4 py-3 cursor-pointer hover:bg-gray-50"
                              onClick={() => handleTopicClick(topic.id)}
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 flex items-center justify-center mr-3">
                                  <span className="text-xl">{topic.icon}</span>
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium">{topic.title}</h5>
                                  {topic.completed && (
                                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                      ✓ Concluído
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className={`h-5 w-5 transition-transform ${expandedTopic === topic.id ? 'rotate-90' : ''}`} />
                              </div>
                              
                              {/* Conteúdo do Tópico */}
                              {expandedTopic === topic.id && (
                                <div className="mt-4 pt-4 border-t">
                                  <h3 className="text-xl font-medium mb-2">
                                    {topic.title}
                                  </h3>
                                  <p className="text-gray-600 mb-4">
                                    {topic.subtitle}
                                  </p>
                                  
                                  {topic.bullets && (
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                      <ul className="list-disc pl-5 space-y-1">
                                        {topic.bullets.map((bullet, idx) => (
                                          <li key={idx} className="text-gray-700">{bullet}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  <div className="mb-4">
                                    <div className="flex border-b">
                                      <button 
                                        className={`px-4 py-2 ${contentType === 'text' ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-500'}`}
                                        onClick={() => setContentType('text')}
                                      >
                                        📖 Texto
                                      </button>
                                      <button 
                                        className={`px-4 py-2 ${contentType === 'audio' ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-500'}`}
                                        onClick={() => setContentType('audio')}
                                      >
                                        🎧 Áudio
                                      </button>
                                    </div>
                                    
                                    {contentType === 'text' ? (
                                      <div className="py-4">
                                        <p className="text-gray-700">
                                          {topic.content.text.split(' ').map((word, i) => {
                                            // Destacar algumas palavras importantes
                                            const highlighted = ['pega correta', 'barriga com barriga', 'boca bem grande', 'grande parte da aréola', 'virados para fora', 'não dói'].some(phrase => word.includes(phrase));
                                            return (
                                              <span key={i} className={highlighted ? 'text-purple-600 font-medium' : ''}>
                                                {word}{' '}
                                              </span>
                                            );
                                          })}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="py-8 flex flex-col items-center">
                                        <div className="mb-4">
                                          <img 
                                            src="/assets/images/titinauta-avatar.png" 
                                            alt="TitiNauta" 
                                            className="w-16 h-16"
                                          />
                                        </div>
                                        <p className="text-center text-gray-600 mb-4">
                                          Toque para ouvir as orientações do TitiNauta
                                        </p>
                                        <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                                          <Play className="h-4 w-4" />
                                          Tocar Narração
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {topic.content.video && (
                                    <div className="mt-4">
                                      <h4 className="font-medium mb-2">Para saber mais:</h4>
                                      <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                                        <span className="mr-2">📹</span>
                                        <span className="text-blue-600">Posições para Amamentar (Vídeo)</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="mt-6 space-y-3">
                                    {!topic.completed && (
                                      <Button 
                                        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                                        onClick={() => handleTopicComplete(topic.id, topic.questionId || topic.id)}
                                        disabled={isSaving}
                                      >
                                        <CheckCircle className="h-5 w-5" />
                                        {isSaving ? 'Salvando...' : 'Marcar como Completado'}
                                      </Button>
                                    )}
                                    {topic.completed && (
                                      <div className="w-full bg-green-100 text-green-800 p-3 rounded-lg flex items-center justify-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">Tópico Completado!</span>
                                      </div>
                                    )}
                                    <Button 
                                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                                      onClick={() => setExpandedTopic(null)}
                                    >
                                      Voltar para a Jornada
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Quizzes da Semana */}
                          {expandedWeek === week.week && weekQuizzes.get(week.week)?.map((quiz) => (
                            <div 
                              key={`quiz-${quiz.id}`}
                              className="border-t px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50"
                            >
                              <button
                                onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                                className="w-full flex items-center justify-between text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                                    <Brain className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-purple-900">{quiz.title}</h5>
                                    {completedQuizzes.has(quiz.id) && (
                                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mt-1">
                                        ✓ Completado
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight className={`h-5 w-5 text-purple-600 transition-transform ${expandedQuiz === quiz.id ? 'rotate-90' : ''}`} />
                              </button>
                              
                              {/* Conteúdo do Quiz */}
                              {expandedQuiz === quiz.id && (
                                <div className="mt-4 pt-4 border-t border-purple-200">
                                  <p className="text-gray-800 mb-4 text-lg">{quiz.question}</p>
                                  
                                  {/* Opções de resposta */}
                                  <div className="space-y-3">
                                    {quiz.options.map((option) => {
                                      const isSelected = quizAnswers[quiz.id] === option.id;
                                      const isCorrect = quiz.knowledge.correct_answer === option.id;
                                      const showFeedback = quizAnswers[quiz.id] !== undefined;
                                      
                                      return (
                                        <button
                                          key={option.id}
                                          onClick={() => handleQuizAnswer(quiz.id, option.id)}
                                          disabled={showFeedback}
                                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                            showFeedback
                                              ? isCorrect
                                                ? 'border-green-500 bg-green-50'
                                                : isSelected
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 bg-gray-50 opacity-50'
                                              : isSelected
                                              ? 'border-purple-500 bg-purple-50'
                                              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                              showFeedback
                                                ? isCorrect
                                                  ? 'border-green-500 bg-green-500'
                                                  : isSelected
                                                  ? 'border-red-500 bg-red-500'
                                                  : 'border-gray-300'
                                                : isSelected
                                                ? 'border-purple-500 bg-purple-500'
                                                : 'border-gray-400'
                                            }`}>
                                              {showFeedback && isCorrect && <span className="text-white text-sm">✓</span>}
                                              {showFeedback && isSelected && !isCorrect && <span className="text-white text-sm">✗</span>}
                                              {!showFeedback && isSelected && <span className="w-3 h-3 rounded-full bg-white"></span>}
                                            </div>
                                            <span className={`flex-1 ${showFeedback && isCorrect ? 'font-semibold text-green-900' : ''}`}>
                                              {option.text}
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                  
                                  {/* Feedback após resposta */}
                                  {quizAnswers[quiz.id] && (
                                    <div className={`mt-4 p-4 rounded-lg ${
                                      quiz.knowledge.correct_answer === quizAnswers[quiz.id]
                                        ? 'bg-green-50 border-2 border-green-200'
                                        : 'bg-blue-50 border-2 border-blue-200'
                                    }`}>
                                      <p className={`font-medium mb-2 ${
                                        quiz.knowledge.correct_answer === quizAnswers[quiz.id]
                                          ? 'text-green-900'
                                          : 'text-blue-900'
                                      }`}>
                                        {quiz.feedback[quizAnswers[quiz.id]]}
                                      </p>
                                      <p className="text-sm text-gray-700 mt-2">
                                        <strong>Explicação:</strong> {quiz.knowledge.explanation}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {quizAnswers[quiz.id] && (
                                    <Button 
                                      className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
                                      onClick={() => setExpandedQuiz(null)}
                                    >
                                      Voltar para a Jornada
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-4">
                <Button 
                  onClick={handleContinueJourney}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4"
                >
                  Continuar Jornada
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="mae">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">💜</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Trilha da Mãe</h3>
                <p className="text-gray-600 text-center mb-4">
                  Conteúdo sobre autocuidado, recuperação pós-parto e saúde mental materna.
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Em breve novos conteúdos serão adicionados.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="checklist">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Checklist de Desenvolvimento</h3>
                <p className="text-gray-600 text-center mb-4">
                  Acompanhe os marcos de desenvolvimento do seu bebê mês a mês.
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Em breve novos conteúdos serão adicionados.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Rodapé */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 text-center text-xs">
        <div className="flex justify-center items-center">
          <span>CVV 188</span>
        </div>
        <button className="text-gray-400 text-xs mt-1">
          Apagar dados e recomeçar
        </button>
      </div>
    </div>
  );
};

export default TitiNautaJourney;
