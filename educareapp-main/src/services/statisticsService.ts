import { httpClient } from '@/services/api/httpClient';

export interface ChildrenRegistrationStats {
  month: string;
  count: number;
  total: number;
}

export interface QuizCompletionStats {
  date: string;
  count: number;
  total: number;
}

export interface DashboardStats {
  totalChildren: number;
  totalUsers: number;
  totalProfessionals: number;
  totalQuizSessions: number;
  childrenByMonth: ChildrenRegistrationStats[];
  recentGrowth: {
    last30Days: number;
    last7Days: number;
  };
}

class StatisticsService {
  private baseUrl = '/api/admin';

  /**
   * Buscar estatísticas gerais do dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/stats/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      throw error;
    }
  }

  /**
   * Buscar estatísticas de crianças registradas por mês
   */
  async getChildrenRegistrationStats(months: number = 12): Promise<ChildrenRegistrationStats[]> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/stats/children-registration`, {
        params: { months }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de registro de crianças:', error);
      throw error;
    }
  }

  /**
   * Buscar estatísticas de quizzes completados
   */
  async getQuizCompletionStats(days: number = 30): Promise<QuizCompletionStats[]> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/stats/quiz-completion`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de quizzes:', error);
      throw error;
    }
  }
}

export const statisticsService = new StatisticsService();
