import { httpClient } from './api/httpClient';

export interface JourneyV2Quiz {
  id: string;
  week_id: string;
  domain: string;
  domain_id: string;
  title: string;
  question: string;
  options: Record<string, unknown>;
  feedback: Record<string, unknown>;
  knowledge: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  week?: {
    id: string;
    week: number;
    title: string;
    journey_id: string;
    journey?: {
      id: string;
      trail: string;
      title: string;
      month: number;
    };
  };
}

export interface JourneyV2 {
  id: string;
  trail: string;
  title: string;
  description?: string;
  month?: number;
}

export interface JourneyV2Week {
  id: string;
  journey_id: string;
  week: number;
  title: string;
  description?: string;
  journey?: JourneyV2;
}

export interface JourneyQuizzesListResponse {
  success: boolean;
  data?: JourneyV2Quiz[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: string;
}

export interface JourneyQuizzesStatistics {
  total: number;
  byDomain: Array<{ domain: string; count: number }>;
  byWeek: number;
}

export interface JourneyQuizzesFilters {
  page?: number;
  limit?: number;
  domain?: string;
  week_id?: string;
  search?: string;
}

export interface CreateJourneyQuizData {
  week_id: string;
  domain: string;
  domain_id: string;
  title: string;
  question: string;
  options?: Record<string, unknown>;
  feedback?: Record<string, unknown>;
  knowledge?: Record<string, unknown>;
}

export interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  errors: number;
  errorDetails: Array<{ line: number; error: string }>;
}

class JourneyQuestionsService {
  private baseUrl = '/api/journey-v2/admin';

  async listQuizzes(filters: JourneyQuizzesFilters = {}): Promise<JourneyQuizzesListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await httpClient.get(`${this.baseUrl}/quizzes?${params.toString()}`);
    return response;
  }

  async getQuiz(id: string): Promise<{ success: boolean; data: JourneyV2Quiz }> {
    const response = await httpClient.get(`${this.baseUrl}/quizzes/${id}`);
    return response.data;
  }

  async createQuiz(data: CreateJourneyQuizData): Promise<{ success: boolean; data: JourneyV2Quiz }> {
    const response = await httpClient.post(`${this.baseUrl}/quizzes`, data);
    return response.data;
  }

  async updateQuiz(id: string, data: Partial<CreateJourneyQuizData>): Promise<{ success: boolean; data: JourneyV2Quiz }> {
    const response = await httpClient.put(`${this.baseUrl}/quizzes/${id}`, data);
    return response.data;
  }

  async deleteQuiz(id: string): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.delete(`${this.baseUrl}/quizzes/${id}`);
    return response.data;
  }

  async getStatistics(): Promise<{ success: boolean; data: JourneyQuizzesStatistics }> {
    const response = await httpClient.get(`${this.baseUrl}/quizzes/statistics`);
    return response.data;
  }

  async importFromCSV(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post(`${this.baseUrl}/quizzes/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async exportToCSV(): Promise<Blob> {
    const response = await httpClient.get(`${this.baseUrl}/quizzes/export`);
    
    if (response.data instanceof Blob) {
      return response.data;
    }
    
    return new Blob([response.data], { type: 'text/csv' });
  }

  downloadCSV(blob: Blob, filename: string = 'journey_v2_quizzes.csv') {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async listJourneys(): Promise<{ success: boolean; data: JourneyV2[] }> {
    const response = await httpClient.get(`${this.baseUrl}/journeys`);
    return response.data;
  }

  async listWeeks(journeyId?: string): Promise<{ success: boolean; data: JourneyV2Week[] }> {
    const params = journeyId ? `?journey_id=${journeyId}` : '';
    const response = await httpClient.get(`${this.baseUrl}/weeks${params}`);
    return response.data;
  }

  getAvailableDomains(): string[] {
    return [
      'motor',
      'communication',
      'cognitive',
      'social_emotional',
      'sensory',
      'baby_health',
      'maternal_health',
      'maternal_self_care',
      'nutrition',
      'saude_bebe',
      'saude_materna',
      'saude_mental',
      'autocuidado_materno',
      'comunicacao',
      'intimidade_conexa',
      'saude_mamas'
    ];
  }
  
  getDomainLabels(): Record<string, string> {
    return {
      'motor': 'Motor',
      'communication': 'Comunicação',
      'cognitive': 'Cognitivo',
      'social_emotional': 'Socioemocional',
      'sensory': 'Sensorial',
      'baby_health': 'Saúde do Bebê',
      'maternal_health': 'Saúde Materna',
      'maternal_self_care': 'Autocuidado Materno',
      'nutrition': 'Nutrição',
      'saude_bebe': 'Saúde do Bebê',
      'saude_materna': 'Saúde Materna',
      'saude_mental': 'Saúde Mental',
      'autocuidado_materno': 'Autocuidado Materno',
      'comunicacao': 'Comunicação',
      'intimidade_conexa': 'Intimidade e Conexão',
      'saude_mamas': 'Saúde das Mamas',
      'baby_domains': 'Domínios do Bebê',
      'mother_domains': 'Domínios da Mãe'
    };
  }
}

export const journeyQuestionsService = new JourneyQuestionsService();
