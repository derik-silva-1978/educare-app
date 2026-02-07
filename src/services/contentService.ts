import { httpClient } from '@/services/api/httpClient';

export interface ContentItem {
  id: string;
  type: 'news' | 'training' | 'course';
  title: string;
  description: string;
  summary: string;
  image_url: string;
  category: string;
  duration: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  cta_url: string;
  cta_text: string;
  target_audience: 'all' | 'parents' | 'professionals';
  status: 'draft' | 'published' | 'archived';
  publish_date: string;
  sort_order: number;
  view_count: number;
  created_at: string;
  creator?: { id: string; name: string };
}

export interface ContentResponse {
  success: boolean;
  data: ContentItem[];
}

export const getPublishedContent = async (type?: string, audience?: string): Promise<ContentItem[]> => {
  try {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (audience) params.append('audience', audience);
    params.append('limit', '10');
    
    const response = await httpClient.get(`/api/content/public?${params.toString()}`);
    if (response.success && response.data) {
      return response.data;
    }
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching published content:', error);
    return [];
  }
};

export const getNewsContent = async (): Promise<ContentItem[]> => {
  return getPublishedContent('news');
};

export const getTrainingContent = async (): Promise<ContentItem[]> => {
  return getPublishedContent('training');
};

export const getCourseContent = async (): Promise<ContentItem[]> => {
  return getPublishedContent('course');
};

export interface AllContentParams {
  type?: string;
  status?: string;
  audience?: string;
  page?: number;
  limit?: number;
}

export interface AllContentResponse {
  data: ContentItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AIContentGenerateParams {
  type: 'news' | 'training' | 'course';
  target_audience: 'all' | 'parents' | 'professionals';
  topic?: string;
}

export interface AIContentGenerateResult {
  title: string;
  summary: string;
  description: string;
  category: string;
  cta_text: string;
}

export const generateAIContent = async (params: AIContentGenerateParams): Promise<AIContentGenerateResult> => {
  const response = await httpClient.post('/api/content/generate-ai', params);
  return response.data;
};

export const getAllContent = async (params?: AllContentParams): Promise<AllContentResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', String(params.page));
    queryParams.append('limit', String(params?.limit || 50));

    const response = await httpClient.get(`/api/content?${queryParams.toString()}`);
    const items: ContentItem[] = response.data || [];
    const meta = response.meta;
    const pagination = {
      total: meta?.total || items.length,
      page: meta?.page || 1,
      limit: meta?.limit || 50,
      pages: meta?.totalPages || 1,
    };

    if (params?.audience && params.audience !== 'all') {
      const filtered = items.filter(
        (item: ContentItem) => item.target_audience === 'all' || item.target_audience === params.audience
      );
      return {
        data: filtered,
        pagination: { ...pagination, total: filtered.length },
      };
    }

    return { data: items, pagination };
  } catch (error) {
    console.error('Error fetching all content:', error);
    return { data: [], pagination: { total: 0, page: 1, limit: 50, pages: 1 } };
  }
};
