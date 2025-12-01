import { httpClient } from './httpClient';

// Interfaces para os dados da Jornada 2.0
export interface JourneyV2 {
  id: string;
  trail: string;
  title: string;
  description: string | null;
  icon: string | null;
  month: number | null;
}

export interface JourneyV2Week {
  id: string;
  journey_id: string;
  week: number | null;
  title: string;
  description: string | null;
  icon: string | null;
  is_summary: boolean;
}

export interface JourneyV2Topic {
  id: string;
  week_id: string;
  title: string;
  content: any; // JSONB
  order_index: number;
}

export interface JourneyV2Quiz {
  id: string;
  week_id: string;
  domain: string;
  domain_id: string;
  title: string;
  question: string;
  options: string[]; // JSONB
  feedback: {
    positivo: string;
    negativo: string;
  }; // JSONB
  knowledge: {
    title: string;
    image_url: string;
    text: string;
    audio: string;
    links: { titulo: string; url: string }[];
  }; // JSONB
}

export interface JourneyV2Badge {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  type: string | null;
}

export interface UserJourneyV2Progress {
  id: string;
  user_id: string;
  child_id: string;
  journey_id: string;
  week_id: string;
  completed_topics: string[]; // JSONB
  completed_quizzes: string[]; // JSONB
  progress: number;
  started_at: string;
  completed_at: string | null;
  week?: JourneyV2Week;
}

export interface UserJourneyV2Badge {
  id: string;
  user_id: string;
  child_id: string;
  badge_id: string;
  earned_at: string;
  badge?: JourneyV2Badge;
}

export interface JourneyV2WithWeeks extends JourneyV2 {
  weeks: JourneyV2Week[];
}

export interface JourneyV2WeekWithDetails extends JourneyV2Week {
  topics: JourneyV2Topic[];
  quizzes: JourneyV2Quiz[];
  badges: JourneyV2Badge[];
}

// Serviço para a Jornada 2.0
const journeyV2Service = {
  /**
   * Obter todas as jornadas
   */
  getAllJourneys: async (): Promise<JourneyV2[]> => {
    try {
      const response = await httpClient.get(`journey-v2/journeys`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar jornadas:', error);
      throw error;
    }
  },

  /**
   * Obter uma jornada específica com suas semanas
   */
  getJourneyById: async (id: string): Promise<JourneyV2WithWeeks> => {
    try {
      const response = await httpClient.get(`journey-v2/journeys/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar jornada ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obter todas as semanas de uma jornada
   */
  getJourneyWeeks: async (journeyId: string): Promise<JourneyV2Week[]> => {
    try {
      const response = await httpClient.get(`journey-v2/journeys/${journeyId}/weeks`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar semanas da jornada ${journeyId}:`, error);
      throw error;
    }
  },

  /**
   * Obter uma semana específica com seus tópicos e quizzes
   */
  getWeekById: async (id: string): Promise<JourneyV2WeekWithDetails> => {
    try {
      const response = await httpClient.get(`journey-v2/weeks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar semana ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obter todos os tópicos de uma semana
   */
  getWeekTopics: async (weekId: string): Promise<JourneyV2Topic[]> => {
    try {
      const response = await httpClient.get(`journey-v2/weeks/${weekId}/topics`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tópicos da semana ${weekId}:`, error);
      throw error;
    }
  },

  /**
   * Obter todos os quizzes de uma semana
   */
  getWeekQuizzes: async (weekId: string): Promise<JourneyV2Quiz[]> => {
    try {
      const response = await httpClient.get(`journey-v2/weeks/${weekId}/quizzes`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar quizzes da semana ${weekId}:`, error);
      throw error;
    }
  },

  /**
   * Obter o progresso de um usuário em uma jornada
   */
  getUserJourneyProgress: async (userId: string, journeyId: string): Promise<UserJourneyV2Progress[]> => {
    try {
      const response = await httpClient.get(`journey-v2/users/${userId}/progress/${journeyId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar progresso do usuário ${userId} na jornada ${journeyId}:`, error);
      throw error;
    }
  },

  /**
   * Atualizar o progresso de um usuário em uma semana
   */
  updateUserWeekProgress: async (
    userId: string,
    weekId: string,
    data: {
      childId: string;
      completedTopics?: string[];
      completedQuizzes?: string[];
      progress?: number;
      completed?: boolean;
    }
  ): Promise<UserJourneyV2Progress> => {
    try {
      const response = await httpClient.post(`journey-v2/users/${userId}/weeks/${weekId}/progress`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar progresso do usuário ${userId} na semana ${weekId}:`, error);
      throw error;
    }
  },

  /**
   * Conceder uma badge para um usuário
   */
  awardUserBadge: async (
    userId: string,
    data: {
      childId: string;
      badgeId: string;
    }
  ): Promise<UserJourneyV2Badge> => {
    try {
      const response = await httpClient.post(`journey-v2/users/${userId}/badges`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao conceder badge ao usuário ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Obter todas as badges de um usuário
   */
  getUserBadges: async (userId: string, childId?: string): Promise<UserJourneyV2Badge[]> => {
    try {
      const url = childId
        ? `journey-v2/users/${userId}/badges?childId=${childId}`
        : `journey-v2/users/${userId}/badges`;
      
      const response = await httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar badges do usuário ${userId}:`, error);
      throw error;
    }
  }
};

export default journeyV2Service;
