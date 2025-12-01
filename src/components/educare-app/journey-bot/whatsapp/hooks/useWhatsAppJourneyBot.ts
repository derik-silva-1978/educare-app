import { useState, useCallback, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useQueryClient } from '@tanstack/react-query';
import { journeyBotService } from '@/services/journeyBotService';
import { getChild } from '@/services/api/childService';
import { DatabaseAdapter, AgeRangeModule } from '@/data/journey-bot/adapters/DatabaseAdapter';
import { PersonalizationEngine, PersonalizationContext } from '@/data/journey-bot/adapters/PersonalizationEngine';
import { WhatsAppMessage } from '../WhatsAppChatContainer';
import { JourneyBotQuestion, JourneyBotSession } from '@/types/journey-bot';

export type ConversationState = 
  | 'welcome'
  | 'introduction' 
  | 'category-intro'
  | 'question'
  | 'processing'
  | 'ready_to_advance'
  | 'transitioning'
  | 'completion';

interface UseWhatsAppJourneyBotProps {
  childId: string;
  childAge: number;
}

export const useWhatsAppJourneyBot = ({ childId, childAge }: UseWhatsAppJourneyBotProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [currentState, setCurrentState] = useState<ConversationState>('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<JourneyBotQuestion | null>(null);
  const [ageRangeData, setAgeRangeData] = useState<{ title: string; min_months: number; max_months: number; description: string } | null>(null);
  const [session, setSession] = useState<JourneyBotSession | null>(null);
  const [personalizationContext, setPersonalizationContext] = useState<PersonalizationContext | null>(null);
  const [responses, setResponses] = useState<Array<{ questionId: string; answer: number; answerText: string }>>([]);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  
  // Module-based states
  const [ageRangeModules, setAgeRangeModules] = useState<AgeRangeModule[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentModuleQuestionIndex, setCurrentModuleQuestionIndex] = useState(0);
  
  // Navigation states
  const [questionsHistory, setQuestionsHistory] = useState<boolean[]>([]);
  const [responsesByIndex, setResponsesByIndex] = useState<Map<number, { questionId: string; answer: number; answerText: string }>>(new Map());
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Initialization flag to prevent infinite loops
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Refs for debouncing
  const nextQuestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (nextQuestionTimeoutRef.current) {
        clearTimeout(nextQuestionTimeoutRef.current);
        nextQuestionTimeoutRef.current = null;
      }
    };
  }, []);

  // Use Math.ceil for age calculation to always round up as requested
  const childAgeInMonths = Math.ceil(childAge * 12);
  
  console.log(`🎂 IDADE CALCULADA: Criança ${childId} tem ${childAge} anos = ${childAgeInMonths} meses (arredondado para cima)`);

  // Function to load answered questions and filter modules
  const loadAnsweredQuestionsAndFilterModules = useCallback(async (modules: AgeRangeModule[]) => {
    if (!user || !childId || modules.length === 0) return modules;

    try {
      console.log('🔍 Carregando respostas já existentes para filtrar perguntas repetidas...');
      
      // Load existing responses for this child
      const existingResponses = await journeyBotService.getChildResponses(childId, user.id);
      
      if (!existingResponses) {
        console.error('❌ Erro ao carregar respostas existentes');
        return modules;
      }

      const answeredQuestionIds = new Set(
        existingResponses?.map(r => r.question_id).filter(Boolean) || []
      );
      
      console.log(`📋 Encontradas ${answeredQuestionIds.size} perguntas já respondidas:`, 
        Array.from(answeredQuestionIds));

      // Update responses state with existing data
      const existingResponsesMap = new Map();
      existingResponses?.forEach((response, index) => {
        if (response.question_id) {
          existingResponsesMap.set(index, {
            questionId: response.question_id,
            answer: response.answer,
            answerText: response.answer_text
          });
        }
      });
      setResponsesByIndex(existingResponsesMap);

      // Filter answered questions from modules
      const filteredModules = modules.map(module => {
        const unansweredQuestions = module.questions.filter(q => 
          !answeredQuestionIds.has(q.id)
        );
        
        const answeredCount = module.questions.length - unansweredQuestions.length;
        
        console.log(`📊 Módulo ${module.ageRange}: ${answeredCount}/${module.questions.length} respondidas`);

        return {
          ...module,
          questions: unansweredQuestions,
          answeredQuestions: answeredCount,
          totalQuestions: module.questions.length,
          isCompleted: unansweredQuestions.length === 0,
          currentQuestionIndex: 0
        };
      });

      // Find first module with unanswered questions
      const firstModuleWithQuestions = filteredModules.findIndex(m => 
        m.questions.length > 0 && !m.isCompleted
      );
      
      if (firstModuleWithQuestions >= 0) {
        setCurrentModuleIndex(firstModuleWithQuestions);
        const targetModule = filteredModules[firstModuleWithQuestions];
        if (targetModule.questions.length > 0) {
          setCurrentQuestion(targetModule.questions[0]);
          setQuestionsHistory(new Array(targetModule.questions.length).fill(false));
        }
      }

      console.log(`✅ Módulos filtrados: ${filteredModules.filter(m => m.questions.length > 0).length} com perguntas restantes`);
      
      return filteredModules;
    } catch (error) {
      console.error('❌ Erro ao carregar e filtrar perguntas:', error);
      return modules;
    }
  }, [user, childId]);

  const createOrLoadSession = useCallback(async (modules: AgeRangeModule[] = []) => {
    if (!user || !childId) return;

    try {
      // Try to find existing session
      const existingSession = await journeyBotService.getActiveSession(childId, user.id);

      if (existingSession) {
        setSession(existingSession);
      } else {
        // Create new session
        const totalQuestions = modules.reduce((sum, module) => sum + module.totalQuestions, 0);
        const newSession = await journeyBotService.createSession({
          user_id: user.id,
          child_id: childId,
          total_questions: totalQuestions,
          answered_questions: 0,
          status: 'active',
          session_data: {}
        });

        if (newSession) {
          setSession(newSession);
        }
      }
    } catch (error) {
      console.error('Error creating/loading session:', error);
    }
  }, [user, childId]);

  // Initialize bot and load data
  useEffect(() => {
    const initializeBot = async () => {
      // Evitar múltiplas inicializações
      if (isInitialized || isInitializing) {
        console.log('🚫 Inicialização já em andamento ou concluída, pulando...');
        return;
      }

      setIsInitializing(true);
      console.log('🚀 Iniciando TitiNauta...');
      
      try {
        // Load age range modules
        console.log('🔄 Carregando módulos por faixa etária para idade:', childAgeInMonths, 'meses');
        const modules = await DatabaseAdapter.getAgeRangeModulesForAge(childAgeInMonths);
        console.log('✅ Módulos carregados:', modules.length);
        
        let filteredModules: AgeRangeModule[] = [];
        
        if (modules.length > 0) {
          // Filter modules based on answered questions
          filteredModules = await loadAnsweredQuestionsAndFilterModules(modules);
          setAgeRangeModules(filteredModules);
          
          // Create current module metadata
          const ageMetadata = await DatabaseAdapter.createCurrentModuleMetadata(childAgeInMonths);
          setAgeRangeData(ageMetadata);
          console.log('📊 Metadados do módulo atual criados:', ageMetadata);
        } else {
          console.warn('⚠️ Nenhum módulo encontrado para esta idade');
        }

        // Load child data for personalization
        if (childId) {
          const childResponse = await getChild(childId);
          
          if (childResponse.success && childResponse.data) {
            const context = PersonalizationEngine.extractPersonalizationFromChild(childResponse.data);
            setPersonalizationContext(context);
          }
        }

        // Create or load session with the filtered modules
        await createOrLoadSession(filteredModules);
        
        // Marcar como inicializado
        setIsInitialized(true);
        console.log('✅ TitiNauta inicializado com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao inicializar TitiNauta:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    if (user && childId && !isInitialized && !isInitializing) {
      initializeBot();
    }
  }, [user, childId, childAgeInMonths, isInitialized, isInitializing]); // Adicionadas flags de controle

  const addMessage = useCallback((content: string, type: 'bot' | 'user' = 'bot') => {
    const message: WhatsAppMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const addTypingMessage = useCallback(async (content: string, delay: number = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    addMessage(content);
  }, [addMessage]);

  const startConversation = useCallback(async () => {
    if (!personalizationContext || ageRangeModules.length === 0) return;

    setCurrentState('introduction');
    
    // Introduction sequence
    const introMessage = PersonalizationEngine.createIntroductionMessage(personalizationContext);
    await addTypingMessage(introMessage, 1000);
    
    const currentModule = ageRangeModules[currentModuleIndex];
    await addTypingMessage(
      `Vamos conversar sobre o desenvolvimento do ${personalizationContext.childName} no módulo ${currentModule.ageRange}! 🌟`,
      1500
    );

    await addTypingMessage(
      'Farei algumas perguntas carinhosas e darei dicas personalizadas para vocês. Pronta para começar? 💕',
      2000
    );

    // Start first question
    setTimeout(() => {
      startNextQuestion();
    }, 1000);
  }, [personalizationContext, ageRangeModules, currentModuleIndex, addTypingMessage]);

  // Function to complete conversation - moved here to avoid hoisting issues
  const completeConversation = useCallback(async () => {
    if (!personalizationContext) return;

    await addTypingMessage(
      `Parabéns ${personalizationContext.motherName}! 🎉 Terminamos nossa conversa sobre o ${personalizationContext.childName}!`,
      1500
    );

    await addTypingMessage(
      'Foi um prazer conhecer vocês! Continue estimulando o desenvolvimento com muito amor e carinho 💕',
      2000
    );

    // Update session as completed
    if (session) {
      await journeyBotService.updateSession(session.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        answered_questions: responses.length
      });
    }

    // Update child progress based on completed sessions
    await updateChildProgress();
  }, [personalizationContext, session, responses.length, addTypingMessage]);

  const startNextQuestion = useCallback(async (moduleIndex?: number, questionIndex?: number) => {
    const targetModuleIndex = moduleIndex ?? currentModuleIndex;
    const targetQuestionIndex = questionIndex ?? currentModuleQuestionIndex;
    
    console.log('🎯 PERGUNTA: Iniciando próxima pergunta', {
      moduleIndex: targetModuleIndex,
      questionIndex: targetQuestionIndex,
      totalModules: ageRangeModules.length
    });
    
    const currentModule = ageRangeModules[targetModuleIndex];
    
    if (!currentModule) {
      console.error('❌ PERGUNTA: Módulo atual não encontrado');
      return;
    }
    
    // Check if current module is completed
    if (targetQuestionIndex >= currentModule.questions.length) {
      console.log('📋 PERGUNTA: Módulo atual completo, mudando para próximo');
      // Move to next module
      const nextModuleIndex = currentModuleIndex + 1;
      
      if (nextModuleIndex >= ageRangeModules.length) {
        console.log('🏁 PERGUNTA: Todos os módulos completados');
        setCurrentState('completion');
        await completeConversation();
        return;
      }
      
      // Update current module and reset question index
      setCurrentModuleIndex(nextModuleIndex);
      setCurrentModuleQuestionIndex(0);
      
      const nextModule = ageRangeModules[nextModuleIndex];
      if (nextModule && nextModule.questions.length > 0) {
        setCurrentQuestion(nextModule.questions[0]);
      }
      return;
    }

    const question = currentModule.questions[targetQuestionIndex];
    console.log('💬 PERGUNTA: Carregando pergunta:', question.question_text.substring(0, 50) + '...');
    
    setCurrentQuestion(question);
    setCurrentState('category-intro');

    if (!personalizationContext || !question.jsonData) {
      console.error('❌ PERGUNTA: Contexto ou dados JSON não encontrados');
      return;
    }

    // Category introduction
    console.log('📢 PERGUNTA: Mostrando introdução da categoria');
    await addTypingMessage(
      `Agora vamos falar sobre ${question.jsonData.categoryIcon} ${question.jsonData.categoryName}`,
      1000
    );

    await addTypingMessage(
      PersonalizationEngine.personalizeText(question.jsonData.importance, personalizationContext),
      1500
    );

    // Ask the question
    console.log('❓ PERGUNTA: Fazendo a pergunta');
    setCurrentState('question');
    await addTypingMessage(
      PersonalizationEngine.personalizeText(question.question_text, personalizationContext),
      2000
    );

    console.log('⏳ PERGUNTA: Esperando resposta do usuário');
    setIsWaitingForAnswer(true);
  }, [ageRangeModules, currentModuleIndex, currentModuleQuestionIndex, personalizationContext, addTypingMessage, completeConversation]);

  const handleAnswerSelect = useCallback(async (value: number, text: string) => {
    if (!currentQuestion || !personalizationContext || currentState !== 'question') return;

    console.log('🔄 Processando resposta:', text);
    setIsWaitingForAnswer(false);
    setCurrentState('processing');
    
    // Add user's answer as message
    addMessage(text, 'user');
    
    // Save response
    const response = {
      questionId: currentQuestion.id,
      answer: value,
      answerText: text
    };
    setResponses(prev => [...prev, response]);
    
    // Update navigation history
    setQuestionsHistory(prev => {
      const newHistory = [...prev];
      newHistory[currentModuleQuestionIndex] = true;
      return newHistory;
    });
    setResponsesByIndex(prev => new Map(prev.set(currentModuleQuestionIndex, response)));
    
    // Update module progress
    setAgeRangeModules(prev => {
      const updated = [...prev];
      if (updated[currentModuleIndex]) {
        updated[currentModuleIndex].answeredQuestions += 1;
        if (updated[currentModuleIndex].answeredQuestions >= updated[currentModuleIndex].totalQuestions) {
          updated[currentModuleIndex].isCompleted = true;
          // Unlock next module
          if (currentModuleIndex + 1 < updated.length) {
            updated[currentModuleIndex + 1].isUnlocked = true;
          }
        }
      }
      return updated;
    });

    // Save to database
    if (session && user) {
      await journeyBotService.saveResponse({
        user_id: user.id,
        child_id: childId,
        question_id: currentQuestion.id,
        answer: value,
        answer_text: text
      });

      // Update child progress after saving response
      await updateChildProgress();
    }

    // Provide feedback with more responsive timing
    const feedback = currentQuestion.jsonData?.feedbacks[value.toString()];
    if (feedback) {
      await addTypingMessage(
        PersonalizationEngine.personalizeText(feedback, personalizationContext),
        800
      );
    }

    // Provide activity suggestion
    if (currentQuestion.jsonData?.activity) {
      await addTypingMessage('💡 Aqui vai uma atividade para vocês:', 600);
      await addTypingMessage(
        PersonalizationEngine.personalizeText(currentQuestion.jsonData.activity, personalizationContext),
        1000
      );
    }

    // Set ready to advance with reduced delay
    setTimeout(() => {
      console.log('✅ Pronto para avançar');
      setCurrentState('ready_to_advance');
    }, 2500);
  }, [currentQuestion, personalizationContext, session, user, childId, addMessage, addTypingMessage, currentModuleIndex, currentModuleQuestionIndex, currentState]);


  // Function to calculate and update child progress
  const updateChildProgress = useCallback(async () => {
    if (!childId || !user?.id) return;

    try {
      console.log('🔄 Atualizando progresso da criança...');
      
      // Force invalidate React Query cache for progress-related queries
      await queryClient.invalidateQueries({ 
        queryKey: ['dashboard-metrics', user.id, user.role],
        exact: false
      });
      
      await queryClient.invalidateQueries({ 
        queryKey: ['child-modules', childId, user.id],
        exact: false  
      });

      // Force refetch of dashboard metrics after progress update
      await queryClient.refetchQueries({ 
        queryKey: ['dashboard-metrics'],
        exact: false,
        stale: true
      });

      console.log('✅ Cache invalidado e progresso atualizado');
    } catch (error) {
      console.error('❌ Erro em updateChildProgress:', error);
    }
  }, [childId, user?.id, user?.role, queryClient]);

  const getProgress = useCallback(() => {
    if (ageRangeModules.length === 0) return 0;
    
    // Calculate overall progress across all modules
    let totalQuestions = 0;
    let answeredQuestions = 0;
    
    ageRangeModules.forEach(module => {
      totalQuestions += module.totalQuestions;
      answeredQuestions += module.answeredQuestions;
    });
    
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  }, [ageRangeModules]);

  const getCurrentQuestionOptions = useCallback(() => {
    if (!currentQuestion?.jsonData || !personalizationContext) return undefined;
    
    return PersonalizationEngine.personalizeOptions(
      currentQuestion.jsonData.options,
      personalizationContext
    );
  }, [currentQuestion, personalizationContext]);

  // Navigation functions
  const goToPreviousQuestion = useCallback(() => {
    if (currentModuleQuestionIndex > 0) {
      const newIndex = currentModuleQuestionIndex - 1;
      setCurrentModuleQuestionIndex(newIndex);
      
      const currentModule = ageRangeModules[currentModuleIndex];
      if (currentModule && currentModule.questions[newIndex]) {
        setCurrentQuestion(currentModule.questions[newIndex]);
        setCurrentState('question');
        setIsWaitingForAnswer(!questionsHistory[newIndex]);
      }
    } else if (currentModuleIndex > 0) {
      // Go to previous module's last question
      const prevModuleIndex = currentModuleIndex - 1;
      const prevModule = ageRangeModules[prevModuleIndex];
      
      if (prevModule && prevModule.questions.length > 0) {
        setCurrentModuleIndex(prevModuleIndex);
        const lastQuestionIndex = prevModule.questions.length - 1;
        setCurrentModuleQuestionIndex(lastQuestionIndex);
        setCurrentQuestion(prevModule.questions[lastQuestionIndex]);
        setCurrentState('question');
        setIsWaitingForAnswer(!questionsHistory[lastQuestionIndex]);
      }
    }
  }, [currentModuleIndex, currentModuleQuestionIndex, ageRangeModules, questionsHistory]);

  const goToNextQuestion = useCallback(async () => {
    // Protection against multiple calls and wrong states
    if (currentState !== 'ready_to_advance' || isTransitioning) {
      console.log('🚫 Não é possível avançar. Estado:', currentState, 'Transicionando:', isTransitioning);
      return;
    }
    
    // Clear any existing timeout
    if (nextQuestionTimeoutRef.current) {
      clearTimeout(nextQuestionTimeoutRef.current);
      nextQuestionTimeoutRef.current = null;
    }
    
    console.log('✅ Iniciando transição para próxima pergunta...');
    setIsTransitioning(true);
    setCurrentState('transitioning');
    setIsWaitingForAnswer(false);
    
    try {
      const currentModule = ageRangeModules[currentModuleIndex];
      if (!currentModule) {
        console.error('❌ Módulo atual não encontrado');
        setIsTransitioning(false);
        setCurrentState('ready_to_advance');
        return;
      }
      
      // Check if we can advance within current module
      if (currentModuleQuestionIndex < currentModule.questions.length - 1) {
        // Next question in current module
        const newIndex = currentModuleQuestionIndex + 1;
        console.log('📝 Avançando para próxima pergunta do módulo atual. Índice:', newIndex);
        
        // Update question index and reset states
        setCurrentModuleQuestionIndex(newIndex);
        
        // Call startNextQuestion with explicit parameters to display the new question
        await startNextQuestion(currentModuleIndex, newIndex);
        setIsTransitioning(false);
        
      } else if (currentModuleIndex < ageRangeModules.length - 1) {
        // Transition to next module
        const nextModule = ageRangeModules[currentModuleIndex + 1];
        
        if (nextModule && nextModule.questions.length > 0) {
          console.log('🔄 Transitando para próximo módulo:', nextModule.ageRange);
          
          // Add transition message
          await addTypingMessage(
            `Parabéns! Agora vamos para o próximo módulo: ${nextModule.ageRange} 🌟`,
            1000
          );
          
          // Update to next module and reset question index
          const nextModuleIndex = currentModuleIndex + 1;
          setCurrentModuleIndex(nextModuleIndex);
          setCurrentModuleQuestionIndex(0);
          
          // Call startNextQuestion with explicit parameters to display the new module's first question
          await startNextQuestion(nextModuleIndex, 0);
          setIsTransitioning(false);
        } else {
          console.error('❌ Próximo módulo inválido');
          setIsTransitioning(false);
          setCurrentState('ready_to_advance');
        }
      } else {
        // All modules completed
        console.log('🎉 Todos os módulos completados');
        setCurrentState('completion');
        setIsTransitioning(false);
        await completeConversation();
      }
    } catch (error) {
      console.error('❌ Erro durante transição:', error);
      setIsTransitioning(false);
      setCurrentState('ready_to_advance'); // Fallback to allow retry
    }
  }, [currentState, isTransitioning, ageRangeModules, currentModuleIndex, currentModuleQuestionIndex, addTypingMessage, completeConversation]);

  const retryCurrentQuestion = useCallback(() => {
    setCurrentState('question');
    setIsWaitingForAnswer(true);
  }, []);

  const canGoPrevious = currentModuleQuestionIndex > 0 || currentModuleIndex > 0;
  const canGoNext = currentState === 'ready_to_advance' && !isTransitioning && (
    currentModuleQuestionIndex < (ageRangeModules[currentModuleIndex]?.questions.length || 0) - 1 ||
    (currentModuleIndex < ageRangeModules.length - 1 && ageRangeModules[currentModuleIndex + 1]?.isUnlocked) ||
    currentModuleIndex >= ageRangeModules.length - 1
  );

  // Get current module information
  const getCurrentModuleInfo = useCallback(() => {
    if (ageRangeModules.length === 0 || currentModuleIndex >= ageRangeModules.length) {
      return { currentQuestionInModule: 0, totalQuestionsInModule: 0, moduleName: '' };
    }
    
    const currentModule = ageRangeModules[currentModuleIndex];
    return {
      currentQuestionInModule: currentModuleQuestionIndex + 1,
      totalQuestionsInModule: currentModule.totalQuestions,
      moduleName: currentModule.ageRange
    };
  }, [ageRangeModules, currentModuleIndex, currentModuleQuestionIndex]);

  return {
    messages,
    isTyping,
    currentState,
    startConversation,
    handleAnswerSelect,
    getProgress,
    getCurrentQuestionOptions,
    isWaitingForAnswer,
    ageRangeData,
    personalizationContext,
    isDataLoaded: !!ageRangeData && !!personalizationContext,
    isTransitioning,
    // Navigation
    currentQuestionIndex: currentModuleQuestionIndex,
    totalQuestions: ageRangeModules[currentModuleIndex]?.totalQuestions || 0,
    canGoPrevious,
    canGoNext,
    goToPreviousQuestion,
    goToNextQuestion,
    retryCurrentQuestion,
    questionsHistory,
    showExitConfirmation,
    setShowExitConfirmation,
    // Module information
    getCurrentModuleInfo,
    ageRangeModules,
    currentModuleIndex
  };
};