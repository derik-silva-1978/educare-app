/**
 * Serviço para gerenciamento de usuários
 */

import httpClient, { ApiResponse } from './httpClient';

// Tipos
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  preferences?: Record<string, any>;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Obtém o perfil do usuário atual
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  return httpClient.get<User>('/users/me');
};

/**
 * Obtém o perfil completo do usuário atual
 */
export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  return httpClient.get<UserProfile>('/profiles/me');
};

/**
 * Atualiza os dados do usuário atual
 */
export const updateUser = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
  return httpClient.put<User>('/users/me', userData);
};

/**
 * Atualiza o perfil do usuário atual
 */
export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
  return httpClient.put<UserProfile>('/profiles/me', profileData);
};

/**
 * Atualiza as preferências do usuário
 */
export const updateUserPreferences = async (preferences: Record<string, any>): Promise<ApiResponse<UserProfile>> => {
  return httpClient.patch<UserProfile>('/profiles/preferences', { preferences });
};

/**
 * Busca usuários (apenas para administradores)
 */
export const searchUsers = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<{ users: User[], total: number, page: number, limit: number }>> => {
  return httpClient.get<{ users: User[], total: number, page: number, limit: number }>(
    `/admin/users?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );
};

/**
 * Atualiza o status de um usuário (apenas para administradores)
 */
export const updateUserStatus = async (userId: string, status: string): Promise<ApiResponse<User>> => {
  return httpClient.patch<User>(`/admin/users/${userId}/status`, { status });
};
