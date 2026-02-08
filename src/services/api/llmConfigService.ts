import httpClient from './httpClient';

export type ModuleType = 'baby' | 'mother' | 'professional' | 'landing_chat' | 'quiz_baby' | 'quiz_mother' | 'content_generator' | 'curation_baby_quiz' | 'curation_mother_quiz' | 'curation_baby_content' | 'curation_mother_content' | 'media_metadata' | 'nlp_biometric' | 'nlp_sleep' | 'nlp_appointment' | 'nlp_vaccine';
export type ProviderType = 'openai' | 'gemini' | 'deepseek' | 'groq' | 'xai' | 'anthropic' | 'together' | 'openrouter' | 'custom';

export interface LLMModel {
  id: string;
  name: string;
  description: string;
  context_window: number;
}

export interface LLMProviderInfo {
  id: ProviderType;
  name: string;
  type: 'openai-compatible' | 'gemini' | 'anthropic';
  available: boolean;
  reason?: string;
  models: LLMModel[];
}

export interface LLMConfig {
  module_type: ModuleType;
  provider: ProviderType;
  model_name: string;
  temperature: number;
  max_tokens: number;
  additional_params?: {
    base_url?: string;
    api_key?: string;
    [key: string]: unknown;
  };
  is_active: boolean;
  updated_by?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LLMConfigsResponse {
  configs: LLMConfig[];
  providers: LLMProviderInfo[];
}

export interface UpdateLLMConfigData {
  provider: ProviderType;
  model_name: string;
  temperature: number;
  max_tokens: number;
  additional_params?: {
    base_url?: string;
    api_key?: string;
    [key: string]: unknown;
  };
}

class LLMConfigService {
  async getAllConfigs(): Promise<LLMConfigsResponse> {
    const response = await httpClient.get<LLMConfigsResponse>('/llm-configs', { requiresAuth: true });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao carregar configurações de LLM');
    }
    
    return response.data;
  }

  async getConfigByModule(moduleType: ModuleType): Promise<{ config: LLMConfig; providers: LLMProviderInfo[] }> {
    const response = await httpClient.get<{ config: LLMConfig; providers: LLMProviderInfo[] }>(`/llm-configs/${moduleType}`, { requiresAuth: true });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao carregar configuração de LLM');
    }
    
    return response.data;
  }

  async getAvailableProviders(): Promise<LLMProviderInfo[]> {
    const response = await httpClient.get<LLMProviderInfo[]>('/llm-configs/providers', { requiresAuth: true });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao carregar provedores disponíveis');
    }
    
    return response.data;
  }

  async updateConfig(moduleType: ModuleType, data: UpdateLLMConfigData): Promise<LLMConfig> {
    const response = await httpClient.put<LLMConfig>(`/llm-configs/${moduleType}`, data, { requiresAuth: true });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao atualizar configuração de LLM');
    }
    
    return response.data;
  }
}

export const llmConfigService = new LLMConfigService();
export default llmConfigService;
