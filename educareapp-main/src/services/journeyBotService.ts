import { httpClient } from './api/httpClient';
import { JourneyBotSession } from '@/types/journey-bot';

export interface JourneyBotResponse {
  id: string;
  user_id: string;
  child_id: string;
  question_id: string;
  answer: number;
  answer_text: string;
  created_at: string;
}

export interface CreateSessionData {
  user_id: string;
  child_id: string;
  total_questions: number;
  answered_questions: number;
  status: 'active' | 'completed' | 'paused';
  session_data: Record<string, unknown>;
}

class JourneyBotService {
  private baseUrl = '/api/journey-bot';

  // Get existing responses for a child
  async getChildResponses(childId: string, userId: string): Promise<JourneyBotResponse[]> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/responses?child_id=${childId}&user_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar respostas do journey bot:', error);
      return [];
    }
  }

  // Get active session for a child
  async getActiveSession(childId: string, userId: string): Promise<JourneyBotSession | null> {
    try {
      console.log('🔍 DEBUG: Buscando sessão ativa para child:', childId, 'user:', userId);
      console.log('🔍 DEBUG: Token presente:', !!localStorage.getItem('token'));
      console.log('🔍 DEBUG: URL:', `${this.baseUrl}/sessions/active?child_id=${childId}&user_id=${userId}`);
      
      const response = await httpClient.get(`${this.baseUrl}/sessions/active?child_id=${childId}&user_id=${userId}`);
      console.log('✅ DEBUG: Resposta sessão ativa:', response);
      return response.data || null;
    } catch (error) {
      console.error('❌ Erro ao buscar sessão ativa:', error);
      return null;
    }
  }

  // Create new session
  async createSession(sessionData: CreateSessionData): Promise<JourneyBotSession | null> {
    try {
      const response = await httpClient.post(`${this.baseUrl}/sessions`, sessionData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar sessão do journey bot:', error);
      return null;
    }
  }

  // Save response
  async saveResponse(responseData: {
    user_id: string;
    child_id: string;
    question_id: string;
    answer: number;
    answer_text: string;
  }): Promise<boolean> {
    try {
      await httpClient.post(`${this.baseUrl}/responses`, responseData);
      return true;
    } catch (error) {
      console.error('Erro ao salvar resposta do journey bot:', error);
      return false;
    }
  }

  // Get questions for age
  async getQuestionsForAge(ageMonths: number): Promise<Record<string, unknown>[]> {
    try {
      console.log('🔍 DEBUG: Carregando perguntas para idade:', ageMonths, 'meses');
      console.log('🔍 DEBUG: Token presente:', !!localStorage.getItem('token'));
      console.log('🔍 DEBUG: URL:', `${this.baseUrl}/questions?age_months=${ageMonths}`);
      
      const response = await httpClient.get(`${this.baseUrl}/questions?age_months=${ageMonths}`);
      console.log('✅ DEBUG: Resposta recebida:', response);
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao carregar perguntas do journey bot:', error);
      return [];
    }
  }

  // Update session
  async updateSession(sessionId: string, updateData: Partial<JourneyBotSession>): Promise<boolean> {
    try {
      await httpClient.put(`${this.baseUrl}/sessions/${sessionId}`, updateData);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar sessão do journey bot:', error);
      return false;
    }
  }
}

export const journeyBotService = new JourneyBotService();
