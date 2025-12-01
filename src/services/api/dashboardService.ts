import { httpClient } from './httpClient';

export interface DashboardMetrics {
  totalChildren: number;
  childrenInProgress: number;
  completedJourneys: number;
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalReports: number;
  averageProgress: number;
  childrenWithProgress: ChildWithProgress[];
}

export interface ChildWithProgress {
  id: string;
  profileId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  avatarUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  calculatedProgress: number;
  sessionCount: number;
  reportCount: number;
  responseCount: number;
  hasActiveSession: boolean;
}

export interface DashboardRawData {
  children: ChildWithProgress[];
  sessions: any[];
  responses: any[];
  reports: any[];
  subscription?: any;
  professionalRelations: any[];
}

export interface UserDashboardResponse {
  metrics: DashboardMetrics;
  rawData: DashboardRawData;
}

class DashboardService {
  /**
   * Busca métricas do dashboard do usuário (parent/professional)
   */
  async getUserDashboardMetrics(): Promise<UserDashboardResponse> {
    const response = await httpClient.get<UserDashboardResponse>('/dashboard/user-metrics');
    
    if (!response.success) {
      throw new Error(response.error || 'Erro ao buscar métricas do dashboard');
    }
    
    return response.data!;
  }

  /**
   * Busca métricas do dashboard admin/owner
   */
  async getAdminDashboardMetrics(): Promise<any> {
    const response = await httpClient.get<any>('/dashboard/metrics');
    
    if (!response.success) {
      throw new Error(response.error || 'Erro ao buscar métricas do dashboard admin');
    }
    
    return response.data!;
  }
}

export const dashboardService = new DashboardService();
