/**
 * Serviço para gerenciamento de jornadas e conquistas
 */

import httpClient, { ApiResponse } from './httpClient';

// Tipos
export interface Journey {
  id: string;
  title: string;
  description: string;
  category: string;
  ageRangeMin: number;
  ageRangeMax: number;
  duration: number;
  difficulty: string;
  isActive: boolean;
  steps: JourneyStep[];
  createdAt: string;
  updatedAt: string;
}

export interface JourneyStep {
  id: string;
  journeyId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  type: string;
  resources: any[];
  createdAt: string;
  updatedAt: string;
}

export interface UserJourney {
  id: string;
  userId: string;
  childId: string;
  journeyId: string;
  journey?: Journey;
  progress: number;
  currentStepId?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  points: number;
  criteria: any;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  childId: string;
  achievementId: string;
  achievement?: Achievement;
  earnedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lista todas as jornadas disponíveis
 */
export const listJourneys = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    category?: string;
    ageMin?: number;
    ageMax?: number;
    difficulty?: string;
  }
): Promise<ApiResponse<{ journeys: Journey[], total: number, page: number, limit: number }>> => {
  let queryParams = `page=${page}&limit=${limit}`;
  
  if (filters) {
    if (filters.category) queryParams += `&category=${encodeURIComponent(filters.category)}`;
    if (filters.ageMin) queryParams += `&ageMin=${filters.ageMin}`;
    if (filters.ageMax) queryParams += `&ageMax=${filters.ageMax}`;
    if (filters.difficulty) queryParams += `&difficulty=${encodeURIComponent(filters.difficulty)}`;
  }
  
  return httpClient.get<{ journeys: Journey[], total: number, page: number, limit: number }>(`/journeys?${queryParams}`);
};

/**
 * Obtém os detalhes de uma jornada específica
 */
export const getJourney = async (journeyId: string): Promise<ApiResponse<Journey>> => {
  return httpClient.get<Journey>(`/journeys/${journeyId}`);
};

/**
 * Inicia uma jornada para uma criança
 */
export const startJourney = async (journeyId: string, childId: string): Promise<ApiResponse<UserJourney>> => {
  return httpClient.post<UserJourney>('/user-journeys', { journeyId, childId });
};

/**
 * Obtém os detalhes de uma jornada de usuário
 */
export const getUserJourney = async (userJourneyId: string): Promise<ApiResponse<UserJourney>> => {
  return httpClient.get<UserJourney>(`/user-journeys/${userJourneyId}`);
};

/**
 * Atualiza o progresso de uma jornada de usuário
 */
export const updateJourneyProgress = async (
  userJourneyId: string,
  stepId: string,
  completed: boolean
): Promise<ApiResponse<UserJourney>> => {
  return httpClient.patch<UserJourney>(`/user-journeys/${userJourneyId}/progress`, {
    stepId,
    completed
  });
};

/**
 * Lista todas as jornadas de uma criança
 */
export const listChildJourneys = async (childId: string): Promise<ApiResponse<UserJourney[]>> => {
  return httpClient.get<UserJourney[]>(`/children/${childId}/journeys`);
};

/**
 * Lista todas as conquistas disponíveis
 */
export const listAchievements = async (): Promise<ApiResponse<Achievement[]>> => {
  return httpClient.get<Achievement[]>('/achievements');
};

/**
 * Lista todas as conquistas de uma criança
 */
export const listChildAchievements = async (childId: string): Promise<ApiResponse<UserAchievement[]>> => {
  return httpClient.get<UserAchievement[]>(`/children/${childId}/achievements`);
};

/**
 * Cria uma nova jornada (apenas para administradores)
 */
export const createJourney = async (journeyData: Omit<Journey, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Journey>> => {
  return httpClient.post<Journey>('/admin/journeys', journeyData);
};

/**
 * Atualiza uma jornada existente (apenas para administradores)
 */
export const updateJourney = async (journeyId: string, journeyData: Partial<Journey>): Promise<ApiResponse<Journey>> => {
  return httpClient.put<Journey>(`/admin/journeys/${journeyId}`, journeyData);
};

/**
 * Remove uma jornada (apenas para administradores)
 */
export const deleteJourney = async (journeyId: string): Promise<ApiResponse> => {
  return httpClient.delete(`/admin/journeys/${journeyId}`);
};

/**
 * Adiciona um passo a uma jornada (apenas para administradores)
 */
export const addJourneyStep = async (
  journeyId: string,
  stepData: Omit<JourneyStep, 'id' | 'journeyId' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<JourneyStep>> => {
  return httpClient.post<JourneyStep>(`/admin/journeys/${journeyId}/steps`, stepData);
};

/**
 * Atualiza um passo de uma jornada (apenas para administradores)
 */
export const updateJourneyStep = async (
  journeyId: string,
  stepId: string,
  stepData: Partial<JourneyStep>
): Promise<ApiResponse<JourneyStep>> => {
  return httpClient.put<JourneyStep>(`/admin/journeys/${journeyId}/steps/${stepId}`, stepData);
};

/**
 * Remove um passo de uma jornada (apenas para administradores)
 */
export const deleteJourneyStep = async (journeyId: string, stepId: string): Promise<ApiResponse> => {
  return httpClient.delete(`/admin/journeys/${journeyId}/steps/${stepId}`);
};
