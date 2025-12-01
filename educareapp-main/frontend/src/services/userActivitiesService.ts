import { httpClient } from './httpClient';
import { Activity } from './activityService';

export interface UserChild {
  id: string;
  name: string;
  birth_date: string;
  age_in_months: number;
  user_id: string;
  created_at: string;
}

export interface UserWithChildren {
  id: string;
  name: string;
  email: string;
  role: string;
  children: UserChild[];
  activities_count: number;
}

export interface UserActivitiesResponse {
  success: boolean;
  data: {
    user: UserWithChildren;
    activities: Activity[];
    children_ages: number[];
  };
}

export interface AllUsersActivitiesResponse {
  success: boolean;
  data: {
    users: UserWithChildren[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface UserActivitiesFilters {
  search?: string;
  role?: string;
  has_children?: boolean;
  min_children_age?: number;
  max_children_age?: number;
}

class UserActivitiesService {
  private baseUrl = '/api/admin/user-activities';

  // Listar todos os usuários com suas crianças e contagem de atividades
  async getAllUsersWithActivities(
    page = 1,
    limit = 10,
    filters: UserActivitiesFilters = {}
  ): Promise<AllUsersActivitiesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Adicionar filtros aos parâmetros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await httpClient.get(`${this.baseUrl}?${params}`);
    return response.data;
  }

  // Obter atividades específicas para um usuário baseado na idade de suas crianças
  async getUserActivities(userId: string): Promise<UserActivitiesResponse> {
    const response = await httpClient.get(`${this.baseUrl}/${userId}`);
    return response.data;
  }

  // Obter atividades recomendadas para uma criança específica
  async getChildActivities(childId: string): Promise<{ success: boolean; data: { activities: Activity[] } }> {
    const response = await httpClient.get(`${this.baseUrl}/child/${childId}`);
    return response.data;
  }

  // Obter estatísticas de atividades por usuários
  async getUserActivitiesStats(): Promise<{
    success: boolean;
    data: {
      total_users: number;
      users_with_children: number;
      total_children: number;
      age_distribution: Array<{
        age_range: string;
        users_count: number;
        children_count: number;
        activities_count: number;
      }>;
      activities_by_category: Array<{
        category: string;
        users_count: number;
        activities_count: number;
      }>;
    };
  }> {
    const response = await httpClient.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export const userActivitiesService = new UserActivitiesService();
