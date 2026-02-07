import { MediaResource, MediaResourceFormData, MediaResourceFilters, MediaResourceStats } from '@/types/mediaResource';
import { getStoredAuthToken } from '@/utils/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = `${API_BASE_URL}/api`;

/**
 * Serviço para gerenciamento de recursos audiovisuais
 */
class MediaResourceService {
  private getAuthToken(): string {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    return token;
  }

  private getHeaders(includeContentType = true): HeadersInit {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.getAuthToken()}`
    };
    
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  /**
   * Listar recursos com filtros
   */
  async list(filters?: MediaResourceFilters): Promise<{
    data: MediaResource[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(
      `${API_URL}/media-resources?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: this.getHeaders()
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao listar recursos');
    }

    return response.json();
  }

  /**
   * Buscar recurso por ID
   */
  async getById(id: string): Promise<MediaResource> {
    const response = await fetch(`${API_URL}/media-resources/${id}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar recurso');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Criar novo recurso
   */
  async create(data: MediaResourceFormData): Promise<MediaResource> {
    try {
      console.log('📤 Criando recurso:', data);
      console.log('🔗 API URL:', `${API_URL}/media-resources`);
      
      const formData = new FormData();
      
      // Adicionar campos ao FormData
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('resource_type', data.resource_type);
      if (data.content) formData.append('content', data.content);
      if (data.category) formData.append('category', data.category);
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));
      if (data.age_range_min !== undefined) formData.append('age_range_min', String(data.age_range_min));
      if (data.age_range_max !== undefined) formData.append('age_range_max', String(data.age_range_max));
      formData.append('is_active', String(data.is_active ?? true));
      formData.append('is_public', String(data.is_public ?? false));
      
      // TTS
      formData.append('tts_enabled', String(data.tts_enabled ?? false));
      if (data.tts_endpoint) formData.append('tts_endpoint', data.tts_endpoint);
      if (data.tts_voice) formData.append('tts_voice', data.tts_voice);
      
      // Arquivo
      if (data.file) {
        formData.append('file', data.file);
        console.log('📎 Arquivo anexado:', data.file.name);
      }

      const token = this.getAuthToken();
      console.log('🔑 Token presente:', !!token);

      const response = await fetch(`${API_URL}/media-resources`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        
        try {
          const error = JSON.parse(errorText);
          throw new Error(error.message || 'Erro ao criar recurso');
        } catch {
          throw new Error(`Erro ao criar recurso: ${response.status} - ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('✅ Recurso criado:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Erro ao criar recurso:', error);
      throw error;
    }
  }

  /**
   * Atualizar recurso
   */
  async update(id: string, data: Partial<MediaResourceFormData>): Promise<MediaResource> {
    const formData = new FormData();
    
    // Adicionar apenas campos fornecidos
    if (data.title) formData.append('title', data.title);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.resource_type) formData.append('resource_type', data.resource_type);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.age_range_min !== undefined) formData.append('age_range_min', String(data.age_range_min));
    if (data.age_range_max !== undefined) formData.append('age_range_max', String(data.age_range_max));
    if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
    if (data.is_public !== undefined) formData.append('is_public', String(data.is_public));
    
    // TTS
    if (data.tts_enabled !== undefined) formData.append('tts_enabled', String(data.tts_enabled));
    if (data.tts_endpoint !== undefined) formData.append('tts_endpoint', data.tts_endpoint);
    if (data.tts_voice !== undefined) formData.append('tts_voice', data.tts_voice);
    
    // Arquivo
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await fetch(`${API_URL}/media-resources/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar recurso');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Deletar recurso
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/media-resources/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao deletar recurso');
    }
  }

  /**
   * Gerar áudio via TTS
   */
  async generateTTS(id: string, text?: string, voice?: string): Promise<any> {
    const response = await fetch(`${API_URL}/media-resources/${id}/tts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ text, voice })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao gerar áudio via TTS');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Obter estatísticas
   */
  async getStats(): Promise<MediaResourceStats> {
    const response = await fetch(`${API_URL}/media-resources/stats`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao obter estatísticas');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Buscar recursos por categoria
   */
  async getByCategory(category: string): Promise<MediaResource[]> {
    const response = await fetch(`${API_URL}/media-resources/category/${category}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar recursos');
    }

    const result = await response.json();
    return result.data;
  }
}

export const mediaResourceService = new MediaResourceService();
