import httpClient from './httpClient';
import type { AssistantPrompt } from './assistantPromptService';
import type { LLMConfig, LLMProviderInfo, ModuleType, ProviderType } from './llmConfigService';

export interface AgentMeta {
  name: string;
  description: string;
  icon: string;
  color: string;
  kb: string;
}

export interface AgentSummary {
  module_type: ModuleType;
  meta: AgentMeta;
  prompt: {
    id: string;
    name: string;
    version: number;
    updatedAt: string;
    updater?: { id: string; name: string };
    description?: string;
    promptLength: number;
  } | null;
  llm: {
    provider: string;
    providerName: string;
    model_name: string;
    temperature: number;
    max_tokens: number;
  };
  stats: {
    totalVersions: number;
    rankingsCount: number;
  };
}

export interface DashboardResponse {
  agents: AgentSummary[];
  providers: LLMProviderInfo[];
}

export interface AgentDetail {
  meta: AgentMeta;
  activePrompt: AssistantPrompt | null;
  draftPrompts: AssistantPrompt[];
  llmConfig: LLMConfig;
  providers: LLMProviderInfo[];
  rankings: ModelRanking[];
}

export interface ModelRanking {
  id: string;
  module_type: ModuleType;
  provider: string;
  model_name: string;
  stars: number;
  notes?: string;
  cost_rating: 'low' | 'medium' | 'high';
  speed_rating: 'slow' | 'medium' | 'fast';
  quality_rating: 'low' | 'medium' | 'high';
  rated_by?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertRankingData {
  provider: string;
  model_name: string;
  stars: number;
  notes?: string;
  cost_rating?: 'low' | 'medium' | 'high';
  speed_rating?: 'slow' | 'medium' | 'fast';
  quality_rating?: 'low' | 'medium' | 'high';
}

export interface PlaygroundRequest {
  module_type: ModuleType;
  user_message: string;
  system_prompt?: string;
  provider?: ProviderType;
  model_name?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface PlaygroundResponse {
  response: string;
  model: string;
  provider: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  elapsed_ms: number;
  config_used: {
    provider: string;
    model_name: string;
    temperature: number;
    max_tokens: number;
  };
}

class AgentControlService {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await httpClient.get<DashboardResponse>('/agent-control/dashboard', { requiresAuth: true });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao carregar dashboard');
    }
    return response.data;
  }

  async getAgentDetail(moduleType: ModuleType): Promise<AgentDetail> {
    const response = await httpClient.get<AgentDetail>(`/agent-control/agent/${moduleType}`, { requiresAuth: true });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao carregar detalhes do agente');
    }
    return response.data;
  }

  async runPlayground(data: PlaygroundRequest): Promise<PlaygroundResponse> {
    const response = await httpClient.post<PlaygroundResponse>('/agent-control/playground', data, { requiresAuth: true });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao executar playground');
    }
    return response.data;
  }

  async getRankings(moduleType: ModuleType): Promise<ModelRanking[]> {
    const response = await httpClient.get<ModelRanking[]>(`/agent-control/rankings/${moduleType}`, { requiresAuth: true });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao carregar rankings');
    }
    return response.data;
  }

  async upsertRanking(moduleType: ModuleType, data: UpsertRankingData): Promise<ModelRanking> {
    const response = await httpClient.post<ModelRanking>(`/agent-control/rankings/${moduleType}`, data, { requiresAuth: true });
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao salvar ranking');
    }
    return response.data;
  }

  async deleteRanking(id: string): Promise<void> {
    const response = await httpClient.delete(`/agent-control/rankings/${id}`, { requiresAuth: true });
    if (!response.success) {
      throw new Error(response.error || 'Erro ao remover ranking');
    }
  }
}

export const agentControlService = new AgentControlService();
export default agentControlService;
