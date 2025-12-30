import { httpClient } from './api/httpClient';

export interface JourneyQuestion {
  id: string;
  
  // Metadados do módulo
  meta_title?: string;
  meta_min_months: number;
  meta_max_months: number;
  meta_description?: string;
  
  // Dados da semana
  week?: number;
  week_title?: string;
  week_description?: string;
  
  // Gamificação - Boas-vindas
  gamification_welcome_title?: string;
  gamification_welcome_message?: string;
  
  // Gamificação - Badge
  gamification_badge_name?: string;
  gamification_badge_description?: string;
  
  // Gamificação - Progresso
  gamification_progress_message?: string;
  
  // Gamificação - Desafio semanal
  gamification_weekly_challenge_title?: string;
  gamification_weekly_challenge_description?: string;
  
  // Gamificação - Dicas
  gamification_tips?: string;
  
  // Gamificação - Mensagem de encerramento
  gamification_closing_message_title?: string;
  gamification_closing_message_message?: string;
  
  // Gamificação - Registro afetivo
  gamification_registro_afetivo_question?: string;
  gamification_registro_afetivo_options?: string;
  
  // Gamificação - Mensagem personalizada
  gamification_personalized_message_title?: string;
  gamification_personalized_message_message?: string;
  
  // Dados da pergunta principal
  domain_name: string;
  domain_question: string;
  domain_importance?: string;
  
  // Feedbacks
  domain_feedback_1?: string;
  domain_feedback_2?: string;
  domain_feedback_3?: string;
  
  // Atividades e alertas
  domain_activities?: string;
  domain_alert_missing?: string;
  
  // Campos de controle
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Campos legados (compatibilidade)
  question_text?: string;
  question_type?: 'multiple_choice' | 'text' | 'boolean';
  options?: Array<{ value: string; label: string }>;
  min_age_months?: number;
  max_age_months?: number;
  category?: string;
  feedback_positive?: string;
  feedback_negative?: string;
  feedback_neutral?: string;
  tips?: Record<string, unknown>;
}

export interface JourneyQuestionsListResponse {
  success: boolean;
  data?: JourneyQuestion[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: string;
  message?: string;
}

export interface JourneyQuestionsStatistics {
  total: number;
  active: number;
  inactive: number;
  byCategory: Array<{ category: string; count: number }>;
  byAgeRange: Array<{ min_age_months: number; max_age_months: number; count: number }>;
  byWeek: Array<{ week: number; week_title: string; count: number }>;
}

export interface JourneyQuestionsFilters {
  page?: number;
  limit?: number;
  category?: string;
  min_age_months?: number;
  max_age_months?: number;
  is_active?: boolean;
  search?: string;
}

export interface CreateJourneyQuestionData {
  // Metadados do módulo
  meta_title?: string;
  meta_min_months: number;
  meta_max_months: number;
  meta_description?: string;
  
  // Dados da semana
  week?: number;
  week_title?: string;
  week_description?: string;
  
  // Gamificação - Boas-vindas
  gamification_welcome_title?: string;
  gamification_welcome_message?: string;
  
  // Gamificação - Badge
  gamification_badge_name?: string;
  gamification_badge_description?: string;
  
  // Gamificação - Progresso
  gamification_progress_message?: string;
  
  // Gamificação - Desafio semanal
  gamification_weekly_challenge_title?: string;
  gamification_weekly_challenge_description?: string;
  
  // Gamificação - Dicas
  gamification_tips?: string;
  
  // Gamificação - Mensagem de encerramento
  gamification_closing_message_title?: string;
  gamification_closing_message_message?: string;
  
  // Gamificação - Registro afetivo
  gamification_registro_afetivo_question?: string;
  gamification_registro_afetivo_options?: string;
  
  // Gamificação - Mensagem personalizada
  gamification_personalized_message_title?: string;
  gamification_personalized_message_message?: string;
  
  // Dados da pergunta principal (obrigatórios)
  domain_name: string;
  domain_question: string;
  domain_importance?: string;
  
  // Feedbacks
  domain_feedback_1?: string;
  domain_feedback_2?: string;
  domain_feedback_3?: string;
  
  // Atividades e alertas
  domain_activities?: string;
  domain_alert_missing?: string;
  
  // Campos de controle
  order_index?: number;
  is_active?: boolean;
  
  // Campos legados (compatibilidade)
  question_text?: string;
  question_type?: string;
  options?: Array<{ value: string; label: string }>;
  min_age_months?: number;
  max_age_months?: number;
  category?: string;
  feedback_positive?: string;
  feedback_negative?: string;
  feedback_neutral?: string;
  tips?: Record<string, unknown>;
}

export interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  errors: number;
  errorDetails: Array<{ line: number; error: string }>;
}

class JourneyQuestionsService {
  private baseUrl = '/api/journey-questions'; // Rota pública para usuários autenticados

  async listQuestions(filters: JourneyQuestionsFilters = {}): Promise<JourneyQuestionsListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await httpClient.get(`${this.baseUrl}?${params.toString()}`);
    // Retorna a estrutura completa com success, data e meta
    return response;
  }

  async getQuestion(id: string): Promise<{ success: boolean; data: JourneyQuestion }> {
    const response = await httpClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createQuestion(data: CreateJourneyQuestionData): Promise<{ success: boolean; data: JourneyQuestion }> {
    const response = await httpClient.post(this.baseUrl, data);
    return response.data;
  }

  async updateQuestion(id: string, data: Partial<CreateJourneyQuestionData>): Promise<{ success: boolean; data: JourneyQuestion }> {
    const response = await httpClient.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteQuestion(id: string): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getStatistics(): Promise<{ success: boolean; data: JourneyQuestionsStatistics }> {
    const response = await httpClient.get(`${this.baseUrl}/statistics`);
    return response.data;
  }

  async importFromCSV(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post(`${this.baseUrl}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async exportToCSV(): Promise<Blob> {
    const response = await httpClient.get(`${this.baseUrl}/export`);
    
    // Converter resposta para blob se necessário
    if (response.data instanceof Blob) {
      return response.data;
    }
    
    // Se a resposta não for um blob, criar um blob com o conteúdo
    return new Blob([response.data], { type: 'text/csv' });
  }

  // Método auxiliar para download do CSV
  downloadCSV(blob: Blob, filename: string = 'journey_questions.csv') {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Categorias/Domínios disponíveis (baseados nos dados importados)
  getAvailableCategories(): string[] {
    return [
      'communication',
      'motor', 
      'maternal_health',
      'maternal_self_care',
      'cognitive',
      'nutrition',
      'sensory',
      'social_emotional',
      'baby_health'
    ];
  }
  
  // Labels amigáveis para os domínios
  getCategoryLabels(): Record<string, string> {
    return {
      'communication': 'Comunicação',
      'motor': 'Motor',
      'maternal_health': 'Saúde Materna',
      'maternal_self_care': 'Autocuidado Materno',
      'cognitive': 'Cognitivo',
      'nutrition': 'Nutrição',
      'sensory': 'Sensorial',
      'social_emotional': 'Socioemocional',
      'baby_health': 'Saúde do Bebê'
    };
  }

  // Tipos de pergunta disponíveis
  getQuestionTypes(): Array<{ value: string; label: string }> {
    return [
      { value: 'multiple_choice', label: 'Múltipla Escolha' },
      { value: 'boolean', label: 'Sim/Não' },
      { value: 'text', label: 'Texto Livre' }
    ];
  }

  // Faixas etárias comuns
  getCommonAgeRanges(): Array<{ min: number; max: number; label: string }> {
    return [
      { min: 0, max: 3, label: '0-3 meses' },
      { min: 3, max: 6, label: '3-6 meses' },
      { min: 6, max: 9, label: '6-9 meses' },
      { min: 9, max: 12, label: '9-12 meses' },
      { min: 12, max: 18, label: '12-18 meses' },
      { min: 18, max: 24, label: '18-24 meses' },
      { min: 24, max: 36, label: '2-3 anos' },
      { min: 36, max: 48, label: '3-4 anos' },
      { min: 48, max: 60, label: '4-5 anos' }
    ];
  }
}

export const journeyQuestionsService = new JourneyQuestionsService();
