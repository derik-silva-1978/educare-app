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
