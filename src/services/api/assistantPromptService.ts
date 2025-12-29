import httpClient from './httpClient';

export interface AssistantPrompt {
  id: string;
  module_type: 'baby' | 'mother' | 'professional';
  name: string;
  description?: string;
  system_prompt: string;
  variables_schema: Record<string, any>;
  version: number;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  updater?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreatePromptData {
  module_type: 'baby' | 'mother' | 'professional';
  name: string;
  description?: string;
  system_prompt: string;
  variables_schema?: Record<string, any>;
}

export interface UpdatePromptData {
  name?: string;
  description?: string;
  system_prompt?: string;
  variables_schema?: Record<string, any>;
  is_active?: boolean;
}

class AssistantPromptService {
  async getPrompts(options?: { module_type?: string; include_inactive?: boolean }): Promise<AssistantPrompt[]> {
    const params = new URLSearchParams();
    if (options?.module_type) params.append('module_type', options.module_type);
    if (options?.include_inactive) params.append('include_inactive', 'true');
    
    const queryString = params.toString();
    const url = queryString ? `/assistant-prompts?${queryString}` : '/assistant-prompts';
    
    const response = await httpClient.get<AssistantPrompt[]>(url, { requiresAuth: true });
    
    if (!response.success) {
      throw new Error(response.error || 'Erro ao carregar prompts');
    }
    
    return response.data || [];
  }

  async getPromptById(id: string): Promise<AssistantPrompt> {
    const response = await httpClient.get<AssistantPrompt>(`/assistant-prompts/${id}`, { requiresAuth: true });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Prompt não encontrado');
    }
    
    return response.data;
  }

  async getActivePromptByModule(moduleType: 'baby' | 'mother' | 'professional'): Promise<AssistantPrompt | null> {
    const response = await httpClient.get<AssistantPrompt>(`/assistant-prompts/active/${moduleType}`, { requiresAuth: true });
    
    if (!response.success) {
      throw new Error(response.error || 'Erro ao carregar prompt ativo');
    }
    
    return response.data || null;
  }

  async getPromptHistory(moduleType: 'baby' | 'mother' | 'professional'): Promise<AssistantPrompt[]> {
    const response = await httpClient.get<AssistantPrompt[]>(`/assistant-prompts/history/${moduleType}`, { requiresAuth: true });
    
    if (!response.success) {
      throw new Error(response.error || 'Erro ao carregar histórico');
    }
    
    return response.data || [];
  }

  async createPrompt(data: CreatePromptData): Promise<AssistantPrompt> {
    const response = await httpClient.post<AssistantPrompt>('/assistant-prompts', data, { requiresAuth: true });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao criar prompt');
    }
    
    return response.data;
  }

  async updatePrompt(id: string, data: UpdatePromptData): Promise<AssistantPrompt> {
    const response = await httpClient.put<AssistantPrompt>(`/assistant-prompts/${id}`, data, { requiresAuth: true });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao atualizar prompt');
    }
    
    return response.data;
  }

  async activatePrompt(id: string): Promise<AssistantPrompt> {
    const response = await httpClient.post<AssistantPrompt>(`/assistant-prompts/${id}/activate`, {}, { requiresAuth: true });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao ativar prompt');
    }
    
    return response.data;
  }
}

export const assistantPromptService = new AssistantPromptService();
export default assistantPromptService;
