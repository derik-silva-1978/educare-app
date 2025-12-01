import httpClient from './httpClient';

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  name: string;
  type: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  bio?: string;
  professional_id?: string;
  professional_specialty?: string;
  is_primary?: boolean;
  is_verified?: boolean;
  metadata?: any;
  birth_date?: string;
  profession?: string;
  specialization?: string;
  registration_number?: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  profile?: ProfessionalProfile;
}

export interface ProfessionalsResponse {
  success: boolean;
  data?: {
    professionals: Professional[];
    total: number;
  };
  error?: string;
}

/**
 * Lista todos os profissionais com seus perfis
 */
export const listProfessionals = async (): Promise<ProfessionalsResponse> => {
  try {
    // Forçar nova requisição sem cache para evitar problemas com HTTP 304
    const response = await httpClient.get('/api/users/professionals', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('📥 Resposta HTTP completa:', response);
    console.log('📊 Status da resposta:', response.status);
    console.log('📋 Dados da resposta:', response.data);
    console.log('✅ response.data.success:', response.data?.success);
    console.log('📦 response.data.data:', response.data?.data);
    console.log('🔍 Tipo de response.data:', typeof response.data);
    console.log('🔍 response.data é null?', response.data === null);
    console.log('🔍 response.data é undefined?', response.data === undefined);
    

    if (response.data && response.data.success) {
      console.log('🎯 Retornando dados de sucesso:', response.data.data);
      return {
        success: true,
        data: response.data.data
      };
    } else {
      console.log('❌ Resposta sem sucesso:', response.data);
      return {
        success: false,
        error: response.data?.error || 'Erro ao buscar profissionais'
      };
    }
  } catch (error: any) {
    console.error('💥 Erro na requisição listProfessionals:', error);
    console.error('📄 Detalhes do erro:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Erro ao buscar profissionais'
    };
  }
};

/**
 * Busca um profissional específico por ID com seu perfil
 */
export const getProfessional = async (id: string): Promise<{ success: boolean; data?: Professional; error?: string }> => {
  try {
    const response = await httpClient.get(`/api/users/${id}/professional`);
    
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Erro ao buscar profissional'
      };
    }
  } catch (error: any) {
    console.error('Error in getProfessional:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Erro ao buscar profissional'
    };
  }
};

/**
 * Cria um novo profissional
 */
export const createProfessional = async (professionalData: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  profession?: string;
  specialization?: string;
  registration_number?: string;
  bio?: string;
}): Promise<{ success: boolean; data?: Professional; error?: string }> => {
  try {
    const response = await httpClient.post('/api/users/professionals', professionalData);
    
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Erro ao criar profissional'
      };
    }
  } catch (error: any) {
    console.error('Error in createProfessional:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Erro ao criar profissional'
    };
  }
};

/**
 * Atualiza um profissional existente
 */
export const updateProfessional = async (id: string, professionalData: Partial<{
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  profession?: string;
  specialization?: string;
  registration_number?: string;
  bio?: string;
}>): Promise<{ success: boolean; data?: Professional; error?: string }> => {
  try {
    const response = await httpClient.put(`/api/users/${id}/professional`, professionalData);
    
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Erro ao atualizar profissional'
      };
    }
  } catch (error: any) {
    console.error('Error in updateProfessional:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Erro ao atualizar profissional'
    };
  }
};

/**
 * Remove um profissional
 */
export const deleteProfessional = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await httpClient.delete(`/api/users/${id}`);
    
    if (response.data.success) {
      return {
        success: true
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Erro ao remover profissional'
      };
    }
  } catch (error: any) {
    console.error('Error in deleteProfessional:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Erro ao remover profissional'
    };
  }
};
