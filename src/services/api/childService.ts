/**
 * Serviço para gerenciamento de crianças
 */

import httpClient, { ApiResponse } from './httpClient';

// Tipos
export interface Child {
  id: string;
  userId: string;
  name: string;
  birthDate: string;
  gender: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChildDocument {
  id: string;
  childId: string;
  name: string;
  type: string;
  url: string;
  createdAt: string;
}

export interface DevelopmentNote {
  id: string;
  childId: string;
  title: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lista todas as crianças do usuário atual
 */
export const listChildren = async (): Promise<ApiResponse<Child[]>> => {
  return httpClient.get<Child[]>('/children');
};

/**
 * Obtém os detalhes de uma criança específica
 */
export const getChild = async (childId: string): Promise<ApiResponse<Child>> => {
  return httpClient.get<Child>(`/children/${childId}`);
};

/**
 * Cria uma nova criança
 */
export const createChild = async (childData: Omit<Child, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Child>> => {
  return httpClient.post<Child>('/children', childData);
};

/**
 * Atualiza os dados de uma criança
 */
export const updateChild = async (childId: string, childData: Partial<Child>): Promise<ApiResponse<Child>> => {
  return httpClient.put<Child>(`/children/${childId}`, childData);
};

/**
 * Remove uma criança
 */
export const deleteChild = async (childId: string): Promise<ApiResponse> => {
  return httpClient.delete(`/children/${childId}`);
};

/**
 * Lista todos os documentos de uma criança
 */
export const listChildDocuments = async (childId: string): Promise<ApiResponse<ChildDocument[]>> => {
  return httpClient.get<ChildDocument[]>(`/children/${childId}/documents`);
};

/**
 * Adiciona um documento a uma criança
 */
export const addChildDocument = async (
  childId: string, 
  documentData: { name: string, type: string, file: File }
): Promise<ApiResponse<ChildDocument>> => {
  // Para upload de arquivos, precisamos usar FormData
  const formData = new FormData();
  formData.append('name', documentData.name);
  formData.append('type', documentData.type);
  formData.append('file', documentData.file);

  // Implementação especial para upload de arquivos
  try {
    const token = localStorage.getItem('educare_auth_token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/children/${childId}/documents`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Erro desconhecido',
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Remove um documento de uma criança
 */
export const removeChildDocument = async (childId: string, documentId: string): Promise<ApiResponse> => {
  return httpClient.delete(`/children/${childId}/documents/${documentId}`);
};

/**
 * Lista todas as notas de desenvolvimento de uma criança
 */
export const listDevelopmentNotes = async (childId: string): Promise<ApiResponse<DevelopmentNote[]>> => {
  return httpClient.get<DevelopmentNote[]>(`/children/${childId}/development-notes`);
};

/**
 * Adiciona uma nota de desenvolvimento a uma criança
 */
export const addDevelopmentNote = async (
  childId: string, 
  noteData: { title: string, content: string, date: string }
): Promise<ApiResponse<DevelopmentNote>> => {
  return httpClient.post<DevelopmentNote>(`/children/${childId}/development-notes`, noteData);
};

/**
 * Atualiza uma nota de desenvolvimento
 */
export const updateDevelopmentNote = async (
  childId: string,
  noteId: string,
  noteData: Partial<{ title: string, content: string, date: string }>
): Promise<ApiResponse<DevelopmentNote>> => {
  return httpClient.put<DevelopmentNote>(`/children/${childId}/development-notes/${noteId}`, noteData);
};

/**
 * Remove uma nota de desenvolvimento
 */
export const deleteDevelopmentNote = async (childId: string, noteId: string): Promise<ApiResponse> => {
  return httpClient.delete(`/children/${childId}/development-notes/${noteId}`);
};
