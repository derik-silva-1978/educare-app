import { getStoredAuthToken } from '@/utils/authStorage';

const API_URL = import.meta.env.VITE_API_URL || '';

export interface DashboardMetrics {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  churnRate: number;
  systemHealth: number;
  newUsersToday: number;
  conversionRate: number;
  uptime: number;
}

export interface SubscriptionPlanMetrics {
  planName: string;
  subscriberCount: number;
  revenue: number;
  growthPercentage: number;
}

export interface UserGrowthData {
  date: string;
  users: number;
  subscriptions: number;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalPlans: number;
  activePlans: number;
  totalTeams: number;
  activeTeams: number;
  totalProfiles: number;
  verifiedProfiles: number;
}

class DashboardService {
  private getAuthHeaders() {
    const token = getStoredAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/metrics`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar métricas: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
      throw error;
    }
  }

  async getSubscriptionPlanMetrics(): Promise<SubscriptionPlanMetrics[]> {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/subscription-plans-metrics`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar métricas dos planos: ${response.statusText}`);
      }

      const data = await response.json();
      return data.plans || [];
    } catch (error) {
      console.error('Erro ao buscar métricas dos planos:', error);
      throw error;
    }
  }

  async getUserGrowthData(days: number = 30): Promise<UserGrowthData[]> {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/user-growth?days=${days}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de crescimento: ${response.statusText}`);
      }

      const data = await response.json();
      return data.growth || [];
    } catch (error) {
      console.error('Erro ao buscar dados de crescimento:', error);
      throw error;
    }
  }

  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/system-stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar estatísticas do sistema: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do sistema:', error);
      throw error;
    }
  }

  async getRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/revenue-analytics?period=${period}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar análise de receita: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar análise de receita:', error);
      throw error;
    }
  }

  async getUsersByRole() {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/users-by-role`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários por role: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuários por role:', error);
      throw error;
    }
  }

  async getSubscriptionsByStatus() {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/subscriptions-by-status`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar assinaturas por status: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar assinaturas por status:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
