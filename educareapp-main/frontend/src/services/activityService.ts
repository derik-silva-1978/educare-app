import { httpClient } from './httpClient';

export interface Activity {
  id: string;
  title: string;
  description: string;
  min_age_months: number;
  max_age_months: number;
  category: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  duration_minutes: number;
  materials_needed: string[];
  instructions: string[];
  benefits: string[];
  safety_tips: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityData {
  title: string;
  description: string;
  min_age_months: number;
  max_age_months: number;
  category: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  duration_minutes: number;
  materials_needed: string[];
  instructions: string[];
  benefits: string[];
  safety_tips: string[];
  is_active?: boolean;
}

export interface UpdateActivityData extends Partial<CreateActivityData> {}

export interface ActivityFilters {
  category?: string;
  difficulty_level?: string;
  min_age_months?: number;
  max_age_months?: number;
  is_active?: boolean;
  search?: string;
}

export interface ActivityListResponse {
  success: boolean;
  data: {
    activities: Activity[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ActivityResponse {
  success: boolean;
  data: Activity;
}

export interface ActivityStatsResponse {
  success: boolean;
  data: {
    total_activities: number;
    active_activities: number;
    inactive_activities: number;
    categories: Array<{
      category: string;
      count: number;
    }>;
    difficulty_distribution: Array<{
      difficulty_level: string;
      count: number;
    }>;
    age_range_distribution: Array<{
      age_range: string;
      count: number;
    }>;
  };
}

class ActivityService {
  private baseUrl = '/api/activities';

  async getActivities(
    page = 1,
    limit = 10,
    filters: ActivityFilters = {}
  ): Promise<ActivityListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Adicionar filtros aos parâmetros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await httpClient.get(`${this.baseUrl}?${params}`);
    return response.data;
  }

  async getActivity(id: string): Promise<ActivityResponse> {
    const response = await httpClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createActivity(data: CreateActivityData): Promise<ActivityResponse> {
    const response = await httpClient.post(this.baseUrl, data);
    return response.data;
  }

  async updateActivity(id: string, data: UpdateActivityData): Promise<ActivityResponse> {
    const response = await httpClient.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteActivity(id: string): Promise<{ success: boolean }> {
    const response = await httpClient.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getActivityStats(): Promise<ActivityStatsResponse> {
    const response = await httpClient.get(`${this.baseUrl}/stats`);
    return response.data;
  }

  async getActivitiesForAge(ageInMonths: number): Promise<ActivityListResponse> {
    const response = await httpClient.get(`${this.baseUrl}/for-age/${ageInMonths}`);
    return response.data;
  }

  async toggleActivityStatus(id: string): Promise<ActivityResponse> {
    const response = await httpClient.patch(`${this.baseUrl}/${id}/toggle-status`);
    return response.data;
  }
}

export const activityService = new ActivityService();
