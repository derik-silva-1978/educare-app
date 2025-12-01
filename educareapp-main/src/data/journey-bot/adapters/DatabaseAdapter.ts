import { journeyBotService } from '@/services/journeyBotService';
import { JourneyBotQuestion } from '@/types/journey-bot';
import { DimensionIcons, DimensionLabels } from '@/types/journey-bot';

interface DatabaseQuestion {
  id: string;
  domain_question: string; // Campo correto do backend
  question_type?: string;
  options?: Record<string, unknown>;
  meta_min_months: number; // Campo correto do backend
  meta_max_months: number; // Campo correto do backend
  domain_name: string; // Campo correto do backend
  order_index?: number;
  is_active: boolean;
  domain_feedback_1?: string; // Campo correto do backend
  domain_feedback_2?: string; // Campo correto do backend
  domain_feedback_3?: string; // Campo correto do backend
  tips?: string; // Campo correto do backend (string, não object)
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseQuestionOptions {
  value: number;
  text: string;
  emoji: string;
}

export interface DatabaseQuestionMetadata {
  categoryName: string;
  categoryIcon: string;
  importance: string;
  options: DatabaseQuestionOptions[];
  feedbacks: {
    [key: string]: string;
  };
  activity: string;
}

export interface AgeRangeModule {
  ageRange: string;
  minMonths: number;
  maxMonths: number;
  questions: JourneyBotQuestion[];
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export class DatabaseAdapter {
  /**
   * Carrega módulos organizados por faixa etária para uma idade específica
   */
  static async getAgeRangeModulesForAge(childAgeInMonths: number): Promise<AgeRangeModule[]> {
    try {
      console.log('Carregando módulos por faixa etária para idade:', childAgeInMonths, 'meses');
      
      // Buscar todas as perguntas e agrupar por faixa etária
      const questionsData = await journeyBotService.getQuestionsForAge(childAgeInMonths);

      if (!questionsData || questionsData.length === 0) {
        console.warn('Nenhuma pergunta encontrada no banco de dados');
        return [];
      }

      // Cast para o tipo correto
      const typedQuestions = questionsData as unknown as DatabaseQuestion[];

      // Agrupar perguntas por faixa etária
      const moduleMap = new Map<string, DatabaseQuestion[]>();
      
      typedQuestions.forEach(question => {
        const ageRangeKey = `${question.meta_min_months}-${question.meta_max_months}`;
        if (!moduleMap.has(ageRangeKey)) {
          moduleMap.set(ageRangeKey, []);
        }
        moduleMap.get(ageRangeKey)!.push(question);
      });

      // Converter para módulos de faixa etária
      const modules: AgeRangeModule[] = [];
      
      for (const [ageRangeKey, questions] of moduleMap.entries()) {
        const [minMonths, maxMonths] = ageRangeKey.split('-').map(Number);
        
        // Determinar se o módulo está desbloqueado (baseado na idade da criança)
        const isCurrentOrPrevious = childAgeInMonths >= minMonths;
        
        const enhancedQuestions = questions.map((dbQuestion, index) => 
          this.enhanceQuestionWithWhatsAppMetadata(dbQuestion, index)
        );

        const module: AgeRangeModule = {
          ageRange: this.formatAgeRange(minMonths, maxMonths),
          minMonths,
          maxMonths,
          questions: enhancedQuestions,
          currentQuestionIndex: 0,
          totalQuestions: enhancedQuestions.length,
          answeredQuestions: 0,
          isCompleted: false,
          isUnlocked: isCurrentOrPrevious
        };

        modules.push(module);
      }

      // Ordenar módulos por idade
      modules.sort((a, b) => a.minMonths - b.minMonths);

      console.log('Módulos criados:', modules.length);
      modules.forEach(m => console.log(`- ${m.ageRange}: ${m.totalQuestions} perguntas, ${m.isUnlocked ? 'desbloqueado' : 'bloqueado'}`));
      
      return modules;
      
    } catch (error) {
      console.error('Erro ao carregar módulos por faixa etária:', error);
      return [];
    }
  }

  /**
   * Formata faixa etária para exibição
   */
  private static formatAgeRange(minMonths: number, maxMonths: number): string {
    if (maxMonths <= 12) {
      return `${minMonths}-${maxMonths} meses`;
    } else {
      const minYears = Math.floor(minMonths / 12);
      const maxYears = Math.floor(maxMonths / 12);
      if (minYears === maxYears) {
        return `${minYears} ano${minYears > 1 ? 's' : ''}`;
      }
      return `${minYears}-${maxYears} anos`;
    }
  }

  /**
   * Mantém compatibilidade - retorna todas as perguntas linearmente
   */
  static async getQuestionsForAge(childAgeInMonths: number): Promise<JourneyBotQuestion[]> {
    const modules = await this.getAgeRangeModulesForAge(childAgeInMonths);
    
    // Retorna perguntas apenas dos módulos desbloqueados
    const unlockedQuestions: JourneyBotQuestion[] = [];
    for (const module of modules) {
      if (module.isUnlocked) {
        unlockedQuestions.push(...module.questions);
      }
    }
    
    return unlockedQuestions;
  }

  /**
   * Enriquece uma pergunta do banco com metadados para interface WhatsApp
   */
  private static enhanceQuestionWithWhatsAppMetadata(
    dbQuestion: DatabaseQuestion, 
    index: number
  ): JourneyBotQuestion {
    const dimension = dbQuestion.domain_name; // Campo correto do backend
    const categoryIcon = DimensionIcons[dimension] || '📝';
    const categoryName = DimensionLabels[dimension] || 'Desenvolvimento';

    // Create WhatsApp-style options
    const options: DatabaseQuestionOptions[] = [
      {
        value: 1,
        text: 'Sim! {childName} consegue fazer isso 😊',
        emoji: '✅'
      },
      {
        value: 3,
        text: 'Ainda não vimos isso 🤔',
        emoji: '❓'
      },
      {
        value: 2,
        text: 'Às vezes {ele/ela} faz isso 💫',
        emoji: '🔄'
      }
    ];

    // Create feedbacks map usando os campos corretos do backend
    const feedbacks = {
      '1': dbQuestion.domain_feedback_1 || 'Excelente! Continue assim!',
      '2': dbQuestion.domain_feedback_2 || 'Continue observando e estimulando.',
      '3': dbQuestion.domain_feedback_3 || 'Não se preocupe, vamos trabalhar isso juntos!'
    };

    // Create activity suggestion from tips (agora é string, não array)
    const tipsArray: string[] = dbQuestion.tips ? 
      [String(dbQuestion.tips)] : [];
    const activity = tipsArray.length > 0 
      ? `💡 Dica para o desenvolvimento: ${tipsArray[0]}`
      : 'Continue estimulando {childName} com amor e paciência! 💕';

    // Create importance message
    const importance = `Esta é uma área muito importante para o desenvolvimento do {childName}. Vamos ver como {ele/ela} está se saindo! 🌟`;

    // Attach WhatsApp metadata usando campos corretos
    const enhancedQuestion: JourneyBotQuestion = {
      id: dbQuestion.id,
      question_text: dbQuestion.domain_question, // Campo correto do backend
      dimension: dbQuestion.domain_name, // Campo correto do backend
      age_min_months: dbQuestion.meta_min_months, // Campo correto do backend
      age_max_months: dbQuestion.meta_max_months, // Campo correto do backend
      meta_min_months: dbQuestion.meta_min_months, // Novo campo obrigatório
      meta_max_months: dbQuestion.meta_max_months, // Novo campo obrigatório
      domain_name: dbQuestion.domain_name, // Novo campo obrigatório
      domain_question: dbQuestion.domain_question, // Novo campo obrigatório
      order_index: dbQuestion.order_index || index,
      active: dbQuestion.is_active,
      feedback_yes: dbQuestion.domain_feedback_1,
      feedback_no: dbQuestion.domain_feedback_3,
      feedback_unknown: dbQuestion.domain_feedback_2,
      tips_yes: tipsArray,
      tips_no: tipsArray,
      tips_unknown: tipsArray,
      created_at: dbQuestion.created_at || new Date().toISOString(),
      updated_at: dbQuestion.updated_at || new Date().toISOString(),
      jsonData: {
        categoryName,
        categoryIcon,
        importance,
        options,
        feedbacks,
        activity
      }
    };

    return enhancedQuestion;
  }

  /**
   * Verifica se há perguntas disponíveis para uma idade
   */
  static async hasQuestionsForAge(childAgeInMonths: number): Promise<boolean> {
    try {
      const questions = await journeyBotService.getQuestionsForAge(childAgeInMonths);
      return questions && questions.length > 0;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade de perguntas:', error);
      return false;
    }
  }

  /**
   * Cria metadados do módulo atual baseado na idade da criança
   */
  static async createCurrentModuleMetadata(childAgeInMonths: number): Promise<{
    title: string;
    min_months: number;
    max_months: number;
    description: string;
  }> {
    const modules = await this.getAgeRangeModulesForAge(childAgeInMonths);
    
    // Encontrar o módulo atual (primeiro módulo desbloqueado que não está completo)
    const currentModule = modules.find(m => m.isUnlocked && !m.isCompleted) || modules[0];
    
    if (!currentModule) {
      return {
        title: 'Desenvolvimento Infantil',
        min_months: 0,
        max_months: 12,
        description: 'Avaliação do desenvolvimento'
      };
    }

    return {
      title: currentModule.ageRange,
      min_months: currentModule.minMonths,
      max_months: currentModule.maxMonths,
      description: `Módulo ${currentModule.ageRange} - ${currentModule.totalQuestions} perguntas`
    };
  }
}