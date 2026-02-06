import { httpClient } from './api/httpClient';

export interface JourneyV2Topic {
  id: string;
  week_id: string;
  title: string;
  content: Record<string, unknown>;
  order_index: number;
  createdAt?: string;
  updatedAt?: string;
  week?: {
    id: string;
    week: number;
    title: string;
    is_summary: boolean;
    journey?: {
      id: string;
      trail: string;
      month: number;
      title: string;
    };
  };
}

export interface JourneyV2Quiz {
  id: string;
  week_id: string;
  domain: string;
  domain_id: string;
  title: string;
  question: string;
  options: Array<{ id: string; text: string; value: number }>;
  feedback: Record<string, unknown>;
  knowledge: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  week?: {
    id: string;
    week: number;
    title: string;
    is_summary: boolean;
    journey?: {
      id: string;
      trail: string;
      month: number;
      title: string;
    };
  };
}

export interface JourneyV2Week {
  id: string;
  journey_id: string;
  week: number;
  title: string;
  description?: string;
  icon?: string;
  is_summary: boolean;
  journey?: {
    id: string;
    trail: string;
    month: number;
    title: string;
  };
}

export interface JourneyV2Statistics {
  totals: {
    journeys: number;
    weeks: number;
    topics: number;
    quizzes: number;
    badges: number;
  };
  byTrail: Array<{ trail: string; count: string }>;
  topicsByTrail: Array<{ trail: string; count: string }>;
  quizzesByDomain: Array<{ domain: string; count: string }>;
  weeksByMonth: Array<{ trail: string; month: number; weeks: string; topics: string; quizzes: string }>;
}

export interface ContentFilters {
  trail?: string;
  month?: number;
  week?: number;
  type?: 'topic' | 'quiz';
  search?: string;
  page?: number;
  limit?: number;
}

class JourneyV2AdminService {
  private baseUrl = '/api/admin/journey-v2';

  async getStatistics(): Promise<any> {
    return await httpClient.get(`${this.baseUrl}/statistics`);
  }

  async listContent(filters: ContentFilters = {}): Promise<any> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    return await httpClient.get(`${this.baseUrl}/content?${params.toString()}`);
  }

  async listWeeks(filters: { trail?: string; month?: number } = {}): Promise<any> {
    const params = new URLSearchParams();
    if (filters.trail) params.append('trail', filters.trail);
    if (filters.month) params.append('month', filters.month.toString());
    return await httpClient.get(`${this.baseUrl}/weeks?${params.toString()}`);
  }

  async getTopic(id: string): Promise<any> {
    return await httpClient.get(`${this.baseUrl}/topics/${id}`);
  }

  async createTopic(data: { week_id: string; title: string; content: Record<string, unknown>; order_index?: number }): Promise<any> {
    return await httpClient.post(`${this.baseUrl}/topics`, data);
  }

  async updateTopic(id: string, data: Partial<JourneyV2Topic>): Promise<any> {
    return await httpClient.put(`${this.baseUrl}/topics/${id}`, data);
  }

  async deleteTopic(id: string): Promise<any> {
    return await httpClient.delete(`${this.baseUrl}/topics/${id}`);
  }

  async getQuiz(id: string): Promise<any> {
    return await httpClient.get(`${this.baseUrl}/quizzes/${id}`);
  }

  async createQuiz(data: { week_id: string; domain: string; domain_id?: string; title: string; question: string; options: unknown[]; feedback: Record<string, unknown>; knowledge?: Record<string, unknown> }): Promise<any> {
    return await httpClient.post(`${this.baseUrl}/quizzes`, data);
  }

  async updateQuiz(id: string, data: Partial<JourneyV2Quiz>): Promise<any> {
    return await httpClient.put(`${this.baseUrl}/quizzes/${id}`, data);
  }

  async deleteQuiz(id: string): Promise<any> {
    return await httpClient.delete(`${this.baseUrl}/quizzes/${id}`);
  }

  async reimport(): Promise<any> {
    return await httpClient.post(`${this.baseUrl}/reimport`, {});
  }

  getTrailLabel(trail: string): string {
    const labels: Record<string, string> = { baby: 'Bebê', mother: 'Mãe' };
    return labels[trail] || trail;
  }

  getDomainLabel(domain: string): string {
    const labels: Record<string, string> = {
      baby: 'Bebê',
      mother: 'Mãe',
      communication: 'Comunicação',
      motor: 'Motor',
      cognitive: 'Cognitivo',
      nutrition: 'Nutrição',
      sensory: 'Sensorial',
      social_emotional: 'Socioemocional',
      baby_health: 'Saúde do Bebê',
      maternal_health: 'Saúde Materna',
      maternal_self_care: 'Autocuidado Materno'
    };
    return labels[domain] || domain;
  }
}

export const journeyV2AdminService = new JourneyV2AdminService();
