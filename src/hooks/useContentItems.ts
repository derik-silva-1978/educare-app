import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '@/services/api/httpClient';

export type ContentItemType = 'news' | 'training' | 'course';
export type ContentAudience = 'all' | 'parents' | 'professionals';

export type ContentItem = {
  id: string;
  type: ContentItemType;
  title: string;
  description: string | null;
  summary: string | null;
  image_url: string | null;
  category: string | null;
  duration: string | null;
  level: 'iniciante' | 'intermediário' | 'avançado' | null;
  cta_url: string | null;
  cta_text: string | null;
  target_audience: ContentAudience;
  status: 'draft' | 'published' | 'archived';
  publish_date: string | null;
  view_count: number;
  created_at: string;
  creator?: {
    id: string;
    name: string;
  };
};

interface UseContentItemsOptions {
  type?: ContentItemType;
  audience?: ContentAudience;
  limit?: number;
}

export function useContentItems(options: UseContentItemsOptions = {}) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.type) params.append('type', options.type);
      if (options.audience) params.append('audience', options.audience);
      if (options.limit) params.append('limit', options.limit.toString());

      const response = await httpClient.get(`/content/public?${params.toString()}`);
      
      if (response.data.success) {
        setItems(response.data.data || []);
      } else {
        setError(response.data.message || 'Erro ao buscar conteúdo');
      }
    } catch (err: any) {
      console.error('Erro ao buscar conteúdo:', err);
      setError(err.response?.data?.message || 'Erro ao carregar conteúdo');
    } finally {
      setIsLoading(false);
    }
  }, [options.type, options.audience, options.limit]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchContent
  };
}
