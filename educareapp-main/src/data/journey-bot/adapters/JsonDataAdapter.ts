import { JourneyBotQuestion } from '@/types/journey-bot';

export interface AgeRangeData {
  meta: {
    title: string;
    min_months: number;
    max_months: number;
    description: string;
  };
  questions: JsonQuestion[];
}

export interface JsonQuestion {
  id: number;
  category: string;
  categoryName: string;
  categoryIcon: string;
  question: string;
  importance: string;
  options: {
    value: number;
    text: string;
    emoji: string;
  }[];
  feedbacks: {
    [key: string]: string;
  };
  activity: string;
}

export class JsonDataAdapter {
  private static ageRangeFiles: { [key: string]: string } = {
    '0-1': '/src/data/journey-bot/age-ranges/0-1-months.json',
    '1-2': '/src/data/journey-bot/age-ranges/1-2-months.json',
    '2-3': '/src/data/journey-bot/age-ranges/2-3-months.json',
  };

  static async getAgeRangeData(childAgeInMonths: number): Promise<AgeRangeData | null> {
    try {
      // Determine which JSON file to load based on age
      let fileName: string | null = null;
      
      if (childAgeInMonths >= 0 && childAgeInMonths <= 1) {
        fileName = '0-1';
      } else if (childAgeInMonths >= 1 && childAgeInMonths <= 2) {
        fileName = '1-2';
      } else if (childAgeInMonths >= 2 && childAgeInMonths <= 3) {
        fileName = '2-3';
      }

      if (!fileName) {
        console.log('No JSON data available for age:', childAgeInMonths, 'months');
        return null;
      }

      // Import the JSON data dynamically
      let data: any;
      
      switch (fileName) {
        case '0-1':
          data = await import('@/data/journey-bot/age-ranges/0-1-months.json');
          break;
        case '1-2':
          data = await import('@/data/journey-bot/age-ranges/1-2-months.json');
          break;
        case '2-3':
          data = await import('@/data/journey-bot/age-ranges/2-3-months.json');
          break;
        default:
          return null;
      }

      console.log('Loaded JSON data for age range:', fileName, 'months');
      return data.default || data as AgeRangeData;
      
    } catch (error) {
      console.error('Error loading age range data:', error);
      return null;
    }
  }

  static convertToJourneyBotQuestions(
    jsonQuestions: JsonQuestion[], 
    childAgeInMonths: number
  ): JourneyBotQuestion[] {
    return jsonQuestions.map((jsonQ, index) => ({
      id: `json-${jsonQ.id}`,
      dimension: this.mapCategoryToDimension(jsonQ.category),
      question_text: jsonQ.question,
      age_min_months: Math.floor(childAgeInMonths),
      age_max_months: Math.ceil(childAgeInMonths),
      age_min_weeks: null,
      age_max_weeks: null,
      order_index: index,
      concern_level: 1,
      active: true,
      feedback_yes: jsonQ.feedbacks['1'] || 'Ótimo!',
      feedback_no: jsonQ.feedbacks['3'] || 'Continue estimulando!',
      feedback_unknown: jsonQ.feedbacks['2'] || 'Isso é normal!',
      tips_yes: [jsonQ.activity],
      tips_no: [jsonQ.activity],
      tips_unknown: [jsonQ.activity],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Additional JSON data for WhatsApp interface
      jsonData: {
        categoryName: jsonQ.categoryName,
        categoryIcon: jsonQ.categoryIcon,
        importance: jsonQ.importance,
        options: jsonQ.options,
        feedbacks: jsonQ.feedbacks,
        activity: jsonQ.activity
      }
    }));
  }

  private static mapCategoryToDimension(category: string): string {
    const mapping: { [key: string]: string } = {
      'motor': 'motor_grosso',
      'cognitive': 'cognitivo',
      'language': 'linguagem',
      'social': 'social_emocional',
      'maternal_health': 'autocuidado'
    };

    return mapping[category] || 'cognitivo';
  }

  static isJsonDataAvailable(childAgeInMonths: number): boolean {
    return childAgeInMonths >= 0 && childAgeInMonths <= 3;
  }
}
