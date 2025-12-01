/**
 * Utilitários para gerenciar o armazenamento de tokens JWT
 */

const AUTH_TOKEN_KEY = 'educare_auth_token';
const REFRESH_TOKEN_KEY = 'educare_refresh_token';
const USER_DATA_KEY = 'educare_user_data';

/**
 * Armazena o token JWT no localStorage
 */
export const setStoredAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Obtém o token JWT do localStorage
 */
export const getStoredAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Remove o token JWT do localStorage
 */
export const removeStoredAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Armazena o refresh token no localStorage
 */
export const setStoredRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Obtém o refresh token do localStorage
 */
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Remove o refresh token do localStorage
 */
export const removeStoredRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Armazena os dados do usuário no localStorage
 */
export const setStoredUserData = (userData: any): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

/**
 * Obtém os dados do usuário do localStorage
 */
export const getStoredUserData = (): any | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Remove os dados do usuário do localStorage
 */
export const removeStoredUserData = (): void => {
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Limpa todos os dados de autenticação do localStorage
 */
export const clearAuthStorage = (): void => {
  removeStoredAuthToken();
  removeStoredRefreshToken();
  removeStoredUserData();
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!getStoredAuthToken();
};
