export type ResourceType = 'text' | 'audio' | 'image' | 'pdf' | 'video' | 'link';

export interface MediaResource {
  id: string;
  title: string;
  description?: string;
  resource_type: ResourceType;
  content?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  tts_enabled: boolean;
  tts_endpoint?: string;
  tts_voice?: string;
  category?: string;
  tags?: string[];
  age_range_min?: number;
  age_range_max?: number;
  is_active: boolean;
  is_public: boolean;
  view_count: number;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
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

export interface MediaResourceFormData {
  title: string;
  description?: string;
  resource_type: ResourceType;
  content?: string;
  file?: File;
  tts_enabled?: boolean;
  tts_endpoint?: string;
  tts_voice?: string;
  category?: string;
  tags?: string[];
  age_range_min?: number;
  age_range_max?: number;
  is_active?: boolean;
  is_public?: boolean;
}

export interface MediaResourceFilters {
  type?: ResourceType;
  category?: string;
  is_active?: boolean;
  is_public?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface MediaResourceStats {
  by_type: Array<{
    resource_type: ResourceType;
    count: number;
    total_views: number;
  }>;
  total: number;
  active: number;
  public: number;
}
