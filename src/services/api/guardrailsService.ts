/**
 * Guardrails Service
 * Serviço para integração com endpoints de guardrails
 */

import httpClient from './httpClient';

export interface GuardrailsMetrics {
  totalValidations: number;
  piiDetections: number;
  promptInjectionBlocks: number;
  topicViolations: number;
  emergencyEscalations: number;
  rateLimit: {
    violations: number;
  };
  rateLimitActiveUsers: number;
  uptime: number;
  lastReset: string;
}

export interface GuardrailsHealth {
  success: boolean;
  status: 'healthy' | 'disabled' | 'error';
  enabled: boolean;
  strictMode: boolean;
  uptime: number;
  totalValidations: number;
}

export interface GuardrailsConfig {
  enabled: boolean;
  strictMode: boolean;
  logEvents: boolean;
  blockOnViolation: boolean;
  pii: {
    detectCPF: boolean;
    detectPhone: boolean;
    detectEmail: boolean;
    maskInLogs: boolean;
  };
  rateLimit: {
    enabled: boolean;
    maxRequestsPerMinute: number;
    maxRequestsPerHour: number;
  };
}

const guardrailsService = {
  async getMetrics(): Promise<GuardrailsMetrics | null> {
    try {
      const response = await httpClient.get<{ success: boolean; metrics: GuardrailsMetrics }>('/api/guardrails/metrics');
      return (response as any).metrics || response;
    } catch (error) {
      console.error('Erro ao buscar métricas de guardrails:', error);
      return null;
    }
  },

  async getHealth(): Promise<GuardrailsHealth | null> {
    try {
      const response = await httpClient.get<GuardrailsHealth>('/api/guardrails/health');
      return response as unknown as GuardrailsHealth;
    } catch (error) {
      console.error('Erro ao buscar health de guardrails:', error);
      return null;
    }
  },

  async getConfig(): Promise<GuardrailsConfig | null> {
    try {
      const response = await httpClient.get<{ success: boolean; config: GuardrailsConfig }>('/api/guardrails/config');
      return (response as any).config || response;
    } catch (error) {
      console.error('Erro ao buscar config de guardrails:', error);
      return null;
    }
  },

  async resetMetrics(): Promise<boolean> {
    try {
      await httpClient.post('/api/guardrails/metrics/reset', {});
      return true;
    } catch (error) {
      console.error('Erro ao resetar métricas:', error);
      return false;
    }
  },
};

export default guardrailsService;
