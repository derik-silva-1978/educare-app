import { httpClient } from './api/httpClient';

export type BabyDevDomain = 'motor' | 'cognitivo' | 'linguagem' | 'social' | 'emocional' | 'sensorial';
export type MotherDevDomain = 'nutricao' | 'saude_mental' | 'recuperacao' | 'amamentacao' | 'saude_fisica' | 'autocuidado';
export type DevDomain = BabyDevDomain | MotherDevDomain;

export type CurationAxis = 'baby-content' | 'mother-content' | 'baby-quiz' | 'mother-quiz';

export interface CurationStatistics {
  axes: {
    baby_content: {
      topics: Array<{ dev_domain: string | null; count: string }>;
      unclassified: number;
    };
    mother_content: {
      topics: Array<{ dev_domain: string | null; count: string }>;
      unclassified: number;
    };
    baby_quiz: {
      quizzes: Array<{ dev_domain: string | null; count: string }>;
      unclassified: number;
      milestone_mappings: { total: number; verified: number };
    };
    mother_quiz: {
      quizzes: Array<{ dev_domain: string | null; count: string }>;
      unclassified: number;
      maternal_mappings: { total: number; verified: number };
    };
  };
  totals: {
    unclassified_quizzes: number;
    unclassified_topics: number;
  };
}

export interface AxisItem {
  id: string;
  title: string;
  dev_domain: string | null;
  content_hash: string | null;
  classification_source: string | null;
  classification_confidence: number | null;
  week?: {
    id: string;
    week: number;
    title: string;
    journey?: {
      id: string;
      trail: string;
      month: number;
      title: string;
    };
  };
  question?: string;
  domain?: string;
  options?: Array<{ id: string; text: string; value: number }>;
  feedback?: Record<string, unknown>;
  knowledge?: Record<string, unknown>;
  content?: Record<string, unknown>;
  order_index?: number;
}

export interface BabyMilestoneMapping {
  id: string;
  official_milestone_id: string;
  journey_v2_quiz_id: string;
  weight: string;
  is_auto_generated: boolean;
  verified_by_curator: boolean;
  verified_at?: string;
  verified_by?: string;
  notes?: string;
  source_type: string;
  milestone?: {
    id: string;
    title: string;
    category: string;
    target_month: number;
  };
  quiz?: {
    id: string;
    title: string;
    question: string;
    dev_domain: string;
  };
}

export interface MaternalCurationMapping {
  id: string;
  maternal_domain: string;
  journey_v2_quiz_id?: string;
  journey_v2_topic_id?: string;
  relevance_score?: number;
  ai_reasoning?: string;
  weight: number;
  is_auto_generated: boolean;
  verified_by_curator: boolean;
  verified_at?: string;
  verified_by?: string;
  notes?: string;
  quiz?: {
    id: string;
    title: string;
    question: string;
    dev_domain: string;
  };
  topic?: {
    id: string;
    title: string;
    dev_domain: string;
  };
}

export interface JourneyV2MediaLink {
  id: string;
  journey_v2_quiz_id?: string;
  journey_v2_topic_id?: string;
  media_resource_id: string;
  block_type: string;
  position: number;
  metadata?: Record<string, unknown>;
  mediaResource?: {
    id: string;
    title: string;
    resource_type: string;
    file_url?: string;
    file_name?: string;
  };
}

export interface ClassifyAllResult {
  trail: string;
  type: string;
  classified: number;
  skipped: number;
  duplicates_found: number;
  duplicates: Array<{ id: string; title: string; duplicate_of: string }>;
}

export interface BatchImportItem {
  month: number;
  week: number;
  title: string;
  content?: Record<string, unknown>;
  order_index?: number;
  question?: string;
  options?: unknown[];
  feedback?: Record<string, unknown>;
  knowledge?: Record<string, unknown>;
  domain_id?: string;
}

export interface BatchImportResult {
  axis: string;
  summary: {
    total: number;
    created: number;
    duplicates: number;
    errors: number;
  };
  details: {
    created: Array<{ id: string; title: string; index: number }>;
    duplicates: Array<{ title: string; index: number; duplicate_of: string }>;
    errors: Array<{ index: number; title?: string; error: string }>;
  };
}

export interface DomainValues {
  baby: Array<{ value: string; label: string }>;
  mother: Array<{ value: string; label: string }>;
}

const BABY_DOMAIN_LABELS: Record<string, string> = {
  motor: 'Motor',
  cognitivo: 'Cognitivo',
  linguagem: 'Linguagem',
  social: 'Social',
  emocional: 'Emocional',
  sensorial: 'Sensorial',
};

const MOTHER_DOMAIN_LABELS: Record<string, string> = {
  nutricao: 'Nutrição',
  saude_mental: 'Saúde Mental',
  recuperacao: 'Recuperação',
  amamentacao: 'Amamentação',
  saude_fisica: 'Saúde Física',
  autocuidado: 'Autocuidado',
};

const BABY_DOMAIN_COLORS: Record<string, string> = {
  motor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  cognitivo: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  linguagem: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  social: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  emocional: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  sensorial: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
};

const MOTHER_DOMAIN_COLORS: Record<string, string> = {
  nutricao: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  saude_mental: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  recuperacao: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  amamentacao: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  saude_fisica: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  autocuidado: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

class CurationService {
  private baseUrl = '/api/admin/curation';

  async getDomainValues(): Promise<DomainValues> {
    const response = await httpClient.get(`${this.baseUrl}/domains`);
    return (response as any).data;
  }

  async getStatistics(): Promise<CurationStatistics> {
    const response = await httpClient.get(`${this.baseUrl}/statistics`);
    return (response as any).data;
  }

  async listByAxis(axis: CurationAxis, params?: { page?: number; limit?: number; dev_domain?: string }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.dev_domain) query.append('dev_domain', params.dev_domain);
    return await httpClient.get(`${this.baseUrl}/axis/${axis}?${query.toString()}`);
  }

  async classifyAll(trail: 'baby' | 'mother', type: 'quiz' | 'topic', force = false): Promise<ClassifyAllResult> {
    const response = await httpClient.post(`${this.baseUrl}/classify-all`, { trail, type, force });
    return (response as any).data;
  }

  async updateDomain(id: string, type: 'quiz' | 'topic', dev_domain: string, notes?: string): Promise<any> {
    return await httpClient.put(`${this.baseUrl}/domain/${id}`, { type, dev_domain, notes });
  }

  async getBabyMilestoneMappings(params?: { quiz_id?: string; milestone_id?: string; verified?: string; page?: number; limit?: number }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.quiz_id) query.append('quiz_id', params.quiz_id);
    if (params?.milestone_id) query.append('milestone_id', params.milestone_id);
    if (params?.verified) query.append('verified', params.verified);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return await httpClient.get(`${this.baseUrl}/baby/milestone-mappings?${query.toString()}`);
  }

  async createBabyMilestoneMapping(data: { official_milestone_id: string; journey_v2_quiz_id: string; weight?: number; notes?: string }): Promise<any> {
    return await httpClient.post(`${this.baseUrl}/baby/milestone-mappings`, data);
  }

  async verifyBabyMilestoneMapping(id: string, notes?: string): Promise<any> {
    return await httpClient.post(`${this.baseUrl}/baby/milestone-mappings/${id}/verify`, { notes });
  }

  async deleteBabyMilestoneMapping(id: string): Promise<any> {
    return await httpClient.delete(`${this.baseUrl}/baby/milestone-mappings/${id}`);
  }

  async getMaternalMappings(params?: { quiz_id?: string; topic_id?: string; maternal_domain?: string; verified?: string; page?: number; limit?: number }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.quiz_id) query.append('quiz_id', params.quiz_id);
    if (params?.topic_id) query.append('topic_id', params.topic_id);
    if (params?.maternal_domain) query.append('maternal_domain', params.maternal_domain);
    if (params?.verified) query.append('verified', params.verified);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return await httpClient.get(`${this.baseUrl}/mother/mappings?${query.toString()}`);
  }

  async createMaternalMapping(data: { maternal_domain: string; journey_v2_quiz_id?: string; journey_v2_topic_id?: string; weight?: number; notes?: string }): Promise<any> {
    return await httpClient.post(`${this.baseUrl}/mother/mappings`, data);
  }

  async verifyMaternalMapping(id: string, notes?: string): Promise<any> {
    return await httpClient.post(`${this.baseUrl}/mother/mappings/${id}/verify`, { notes });
  }

  async deleteMaternalMapping(id: string): Promise<any> {
    return await httpClient.delete(`${this.baseUrl}/mother/mappings/${id}`);
  }

  async getMediaForItem(type: 'quiz' | 'topic', id: string): Promise<JourneyV2MediaLink[]> {
    const response = await httpClient.get(`${this.baseUrl}/media/${type}/${id}`);
    return (response as any).data;
  }

  async linkMedia(type: 'quiz' | 'topic', id: string, data: { media_resource_id: string; block_type?: string; position?: number; metadata?: Record<string, unknown> }): Promise<any> {
    return await httpClient.post(`${this.baseUrl}/media/${type}/${id}`, data);
  }

  async unlinkMedia(mediaId: string): Promise<any> {
    return await httpClient.delete(`${this.baseUrl}/media/${mediaId}`);
  }

  async batchImport(axis: CurationAxis, items: BatchImportItem[]): Promise<BatchImportResult> {
    const response = await httpClient.post(`${this.baseUrl}/batch-import`, { axis, items });
    return (response as any).data;
  }

  getDomainLabel(domain: string | null, trail?: string): string {
    if (!domain) return 'Sem classificação';
    if (trail === 'mother' || MOTHER_DOMAIN_LABELS[domain]) {
      return MOTHER_DOMAIN_LABELS[domain] || domain;
    }
    return BABY_DOMAIN_LABELS[domain] || domain;
  }

  getDomainColor(domain: string | null, trail?: string): string {
    if (!domain) return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
    if (trail === 'mother' || MOTHER_DOMAIN_COLORS[domain]) {
      return MOTHER_DOMAIN_COLORS[domain] || 'bg-gray-100 text-gray-500';
    }
    return BABY_DOMAIN_COLORS[domain] || 'bg-gray-100 text-gray-500';
  }

  getConfidenceLabel(confidence: number | null): string {
    if (confidence === null || confidence === undefined) return '';
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.5) return 'Média';
    return 'Baixa';
  }

  getConfidenceColor(confidence: number | null): string {
    if (confidence === null || confidence === undefined) return '';
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  }

  getAxisLabel(axis: CurationAxis): string {
    const labels: Record<CurationAxis, string> = {
      'baby-content': 'Conteúdo Bebê',
      'mother-content': 'Conteúdo Mãe',
      'baby-quiz': 'Quiz Bebê',
      'mother-quiz': 'Quiz Mãe',
    };
    return labels[axis];
  }

  getAxisTrail(axis: CurationAxis): 'baby' | 'mother' {
    return axis.startsWith('baby') ? 'baby' : 'mother';
  }

  getAxisType(axis: CurationAxis): 'topic' | 'quiz' {
    return axis.endsWith('content') ? 'topic' : 'quiz';
  }

  getBabyDomains(): Array<{ value: BabyDevDomain; label: string; color: string }> {
    return Object.entries(BABY_DOMAIN_LABELS).map(([value, label]) => ({
      value: value as BabyDevDomain,
      label,
      color: BABY_DOMAIN_COLORS[value],
    }));
  }

  getMotherDomains(): Array<{ value: MotherDevDomain; label: string; color: string }> {
    return Object.entries(MOTHER_DOMAIN_LABELS).map(([value, label]) => ({
      value: value as MotherDevDomain,
      label,
      color: MOTHER_DOMAIN_COLORS[value],
    }));
  }
}

export const curationService = new CurationService();
