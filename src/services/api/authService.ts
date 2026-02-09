/**
 * Serviço de autenticação para comunicação com o backend customizado
 * Substitui o serviço anterior baseado em Supabase
 */

import httpClient, { ApiResponse } from './httpClient';
import { 
  setStoredAuthToken, 
  setStoredRefreshToken, 
  setStoredUserData,
  getStoredRefreshToken,
  clearAuthStorage
} from '@/utils/authStorage';

// Tipos
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser | null;
  error?: string;
  token?: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface PhoneVerificationData {
  phone: string;
}

export interface PhoneVerificationResult {
  success: boolean;
  message?: string;
  expiresAt?: Date;
  error?: string;
}

export interface PhoneLoginResult {
  success: boolean;
  message?: string;
  expiresAt?: Date;
  error?: string;
  canUseWithEmail?: boolean;
  email?: string | null;
}

export interface PhoneCodeVerificationData {
  phone: string;
  code: string;
}

/**
 * Login com email e senha
 */
export const signInWithEmail = async (identifier: string, password: string): Promise<AuthResult> => {
  try {
    console.log(`signInWithEmail: Tentando login com: ${identifier}`);
    
    const digits = identifier.replace(/\D/g, '');
    const isPhone = digits.length >= 10 && digits.length <= 13 && !identifier.includes('@');
    const payload = isPhone
      ? { phone: digits.startsWith('55') ? digits : `55${digits}`, password }
      : { email: identifier, password };

    const response = await httpClient.post<{
      user: AuthUser;
      token: string;
      refreshToken: string;
    }>('/api/auth/login', payload, { requiresAuth: false });

    console.log('signInWithEmail: Resposta completa:', response);
    console.log('signInWithEmail: response.success:', response.success);
    console.log('signInWithEmail: response.data:', response.data);

    // Verificar se a resposta tem sucesso
    if (!response.success) {
      // Verificar se é um problema com senha temporária
      const isTempPassword = password.includes('@');
      const errorMessage = response.error || 'Erro ao fazer login';
      
      if (isTempPassword && errorMessage.includes('Credenciais inválidas')) {
        console.error('Erro de senha temporária:', errorMessage);
        return {
          success: false,
          error: 'Senha temporária inválida ou expirada. Por favor, solicite uma nova senha.'
        };
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }

    // O httpClient já retorna os dados em response.data
    // Verificar se temos os dados necessários
    if (!response.data) {
      console.error('Dados de autenticação ausentes na resposta:', response);
      return {
        success: false,
        error: 'Dados de autenticação incompletos'
      };
    }

    // Extrair dados da resposta (response.data já contém user, token, refreshToken)
    const { user: userData, token: tokenData, refreshToken: refreshTokenData = '' } = response.data;
    
    console.log('signInWithEmail: userData:', userData);
    console.log('signInWithEmail: tokenData:', tokenData ? 'presente' : 'ausente');
    
    // Validar se temos user e token
    if (!userData || !tokenData) {
      console.error('User ou token ausentes:', { userData: !!userData, tokenData: !!tokenData });
      return {
        success: false,
        error: 'Dados de autenticação incompletos'
      };
    }

    // Armazenar os dados de autenticação
    setStoredAuthToken(tokenData);
    setStoredRefreshToken(refreshTokenData || tokenData);
    setStoredUserData(userData);

    console.log('signInWithEmail: Login bem-sucedido para:', userData.email || userData.id);
    console.log('Dados do usuário armazenados:', userData);
    console.log('Token armazenado:', tokenData.substring(0, 20) + '...');

    return {
      success: true,
      user: userData,
      token: tokenData,
      refreshToken: refreshTokenData || tokenData
    };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    
    // Verificar se é um problema com senha temporária
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao fazer login';
    const isPossiblyTempPasswordIssue = identifier.includes('edcuareapp') || (password && password.includes('@'));
    
    if (isPossiblyTempPasswordIssue) {
      return {
        success: false,
        error: 'Senha temporária inválida ou expirada. Por favor, solicite uma nova senha.'
      };
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Registro de novo usuário
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  name: string,
  role: string = 'user',
  phone?: string,
  plan_id?: string
): Promise<AuthResult> => {
  try {
    const requestBody: Record<string, unknown> = { email, password, name, role };
    if (phone) {
      requestBody.phone = phone;
    }
    if (plan_id) {
      requestBody.plan_id = plan_id;
    }
    
    console.log('=== DEBUG FRONTEND - Enviando para backend ===');
    console.log('Parâmetros recebidos:', { email, password: '***', name, role, phone, plan_id });
    console.log('RequestBody construído:', requestBody);
    console.log('=== FIM DEBUG FRONTEND ===');
    
    const response = await httpClient.post<{
      user: AuthUser;
      token: string;
      refreshToken: string;
    }>('/api/auth/register', requestBody, { requiresAuth: false });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Erro ao registrar usuário'
      };
    }

    const { user, token, refreshToken } = response.data;

    // Armazena os dados de autenticação
    setStoredAuthToken(token);
    setStoredRefreshToken(refreshToken);
    setStoredUserData(user);

    return {
      success: true,
      user,
      token,
      refreshToken
    };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao registrar usuário'
    };
  }
};

/**
 * Logout do usuário
 */
export const signOut = async (): Promise<boolean> => {
  try {
    // Tenta fazer logout no servidor
    await httpClient.post('/api/auth/logout', {});
    
    // Independente da resposta do servidor, limpa os dados locais
    clearAuthStorage();
    
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    
    // Mesmo com erro, limpa os dados locais
    clearAuthStorage();
    
    return false;
  }
};

/**
 * Solicitação de recuperação de senha (envia email)
 */
export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  try {
    console.log(`Solicitando recuperação de senha para: ${email}`);
    const response = await httpClient.post('/api/auth/forgot-password', { email }, { requiresAuth: false });
    
    console.log('Resposta da solicitação de recuperação de senha:', response);
    return response;
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao solicitar recuperação de senha'
    };
  }
};

/**
 * Redefinição de senha com token
 */
export const resetPassword = async (token: string, password: string): Promise<ApiResponse> => {
  try {
    console.log(`Redefinindo senha com token: ${token.substring(0, 10)}...`);
    const response = await httpClient.post('/api/auth/reset-password', { token, password }, { requiresAuth: false });
    
    console.log('Resposta da redefinição de senha:', response);
    return response;
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao redefinir senha'
    };
  }
};

/**
 * Atualização de senha
 */
export const updatePassword = async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
  try {
    return await httpClient.post('/api/auth/update-password', { 
      currentPassword, 
      newPassword 
    });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar senha'
    };
  }
};

/**
 * Renovação de token usando refresh token
 */
export const refreshAuthToken = async (): Promise<AuthResult> => {
  try {
    const refreshToken = getStoredRefreshToken();
    
    if (!refreshToken) {
      return {
        success: false,
        error: 'Refresh token não encontrado'
      };
    }
    
    const response = await httpClient.post<{
      token: string;
      refreshToken: string;
    }>('/api/auth/refresh-token', { refreshToken }, { requiresAuth: false });

    if (!response.success || !response.data) {
      // Se falhar, limpa os dados de autenticação
      clearAuthStorage();
      
      return {
        success: false,
        error: response.error || 'Erro ao renovar token'
      };
    }

    const { token, refreshToken: newRefreshToken } = response.data;

    // Atualiza os tokens
    setStoredAuthToken(token);
    setStoredRefreshToken(newRefreshToken);

    return {
      success: true,
      token,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    
    // Em caso de erro, limpa os dados de autenticação
    clearAuthStorage();
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao renovar token'
    };
  }
};

/**
 * Enviar código de verificação para telefone/WhatsApp
 */
export const sendPhoneVerification = async (phone: string): Promise<PhoneVerificationResult> => {
  try {
    const response = await httpClient.post<{
      message: string;
      expiresAt: string;
    }>('/api/auth/send-phone-verification', { phone }, { requiresAuth: false });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Erro ao enviar código de verificação'
      };
    }

    return {
      success: true,
      message: response.data.message,
      expiresAt: new Date(response.data.expiresAt)
    };
  } catch (error) {
    console.error('Erro ao enviar código de verificação:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar código de verificação'
    };
  }
};

/**
 * Login por telefone com senha temporária
 */
export const loginByPhone = async (phone: string): Promise<PhoneLoginResult> => {
  try {
    const response = await httpClient.post<{
      message: string;
      expiresAt: string;
      canUseWithEmail?: boolean;
      email?: string | null;
    }>('/api/auth/login-by-phone', { phone }, { requiresAuth: false });

    // Verificar se a resposta foi bem-sucedida
    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Erro ao enviar senha temporária'
      };
    }

    // Verificar se temos dados na resposta
    const data = response.data;
    if (!data) {
      return {
        success: false,
        error: 'Resposta sem dados do servidor'
      };
    }

    // Verificar se a mensagem indica sucesso
    if (!data.message || !data.message.includes('Senha temporária enviada')) {
      return {
        success: false,
        error: data.message || 'Resposta inválida do servidor'
      };
    }

    console.log('Resposta do loginByPhone processada com sucesso:', data);

    // Retornar os dados formatados corretamente
    return {
      success: true,
      message: data.message,
      expiresAt: new Date(data.expiresAt),
      canUseWithEmail: data.canUseWithEmail || false,
      email: data.email || null
    };
  } catch (error) {
    console.error('Erro ao solicitar login por telefone:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao solicitar login por telefone'
    };
  }
};

/**
 * Verificar código enviado para telefone/WhatsApp
 */
export const verifyPhoneCode = async (phone: string, code: string): Promise<AuthResult> => {
  try {
    const response = await httpClient.post<{
      user: AuthUser;
      token: string;
      refreshToken: string;
    }>('/api/auth/verify-phone-code', { phone, code }, { requiresAuth: false });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Erro ao verificar código'
      };
    }

    const { user, token, refreshToken } = response.data;

    // Armazena os dados de autenticação
    setStoredAuthToken(token);
    setStoredRefreshToken(refreshToken);
    setStoredUserData(user);

    return {
      success: true,
      user,
      token,
      refreshToken
    };
  } catch (error) {
    console.error('Erro ao verificar código de telefone:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao verificar código'
    };
  }
};
