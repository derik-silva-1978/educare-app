/**
 * Serviço para gerenciamento de quizzes e sessões de quiz
 */

import httpClient, { ApiResponse } from './httpClient';

// Tipos
export interface Quiz {
  id: string;
  title: string;
  description: string;
  type: string;
  ageRangeMin: number;
  ageRangeMax: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: string;
  options?: string[];
  correctAnswer?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizSession {
  id: string;
  quizId: string;
  childId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  answers?: Answer[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  sessionId: string;
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lista todos os quizzes disponíveis
 */
export const listQuizzes = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    category?: string;
    ageMin?: number;
    ageMax?: number;
    type?: string;
  }
): Promise<ApiResponse<{ quizzes: Quiz[], total: number, page: number, limit: number }>> => {
  let queryParams = `page=${page}&limit=${limit}`;
  
  if (filters) {
    if (filters.category) queryParams += `&category=${encodeURIComponent(filters.category)}`;
    if (filters.ageMin) queryParams += `&ageMin=${filters.ageMin}`;
    if (filters.ageMax) queryParams += `&ageMax=${filters.ageMax}`;
    if (filters.type) queryParams += `&type=${encodeURIComponent(filters.type)}`;
  }
  
  return httpClient.get<{ quizzes: Quiz[], total: number, page: number, limit: number }>(`/quizzes?${queryParams}`);
};

/**
 * Obtém os detalhes de um quiz específico
 */
export const getQuiz = async (quizId: string): Promise<ApiResponse<Quiz>> => {
  return httpClient.get<Quiz>(`/quizzes/${quizId}`);
};

/**
 * Cria um novo quiz (apenas para administradores)
 */
export const createQuiz = async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Quiz>> => {
  return httpClient.post<Quiz>('/admin/quizzes', quizData);
};

/**
 * Atualiza um quiz existente (apenas para administradores)
 */
export const updateQuiz = async (quizId: string, quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> => {
  return httpClient.put<Quiz>(`/admin/quizzes/${quizId}`, quizData);
};

/**
 * Remove um quiz (apenas para administradores)
 */
export const deleteQuiz = async (quizId: string): Promise<ApiResponse> => {
  return httpClient.delete(`/admin/quizzes/${quizId}`);
};

/**
 * Adiciona uma questão a um quiz (apenas para administradores)
 */
export const addQuestion = async (
  quizId: string,
  questionData: Omit<Question, 'id' | 'quizId' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Question>> => {
  return httpClient.post<Question>(`/admin/quizzes/${quizId}/questions`, questionData);
};

/**
 * Atualiza uma questão (apenas para administradores)
 */
export const updateQuestion = async (
  quizId: string,
  questionId: string,
  questionData: Partial<Question>
): Promise<ApiResponse<Question>> => {
  return httpClient.put<Question>(`/admin/quizzes/${quizId}/questions/${questionId}`, questionData);
};

/**
 * Remove uma questão (apenas para administradores)
 */
export const deleteQuestion = async (quizId: string, questionId: string): Promise<ApiResponse> => {
  return httpClient.delete(`/admin/quizzes/${quizId}/questions/${questionId}`);
};

/**
 * Inicia uma nova sessão de quiz para uma criança
 */
export const startQuizSession = async (quizId: string, childId: string): Promise<ApiResponse<QuizSession>> => {
  return httpClient.post<QuizSession>('/quiz-sessions', { quizId, childId });
};

/**
 * Obtém os detalhes de uma sessão de quiz
 */
export const getQuizSession = async (sessionId: string): Promise<ApiResponse<QuizSession>> => {
  return httpClient.get<QuizSession>(`/quiz-sessions/${sessionId}`);
};

/**
 * Submete uma resposta para uma questão em uma sessão de quiz
 */
export const submitAnswer = async (
  sessionId: string,
  questionId: string,
  answer: string
): Promise<ApiResponse<Answer>> => {
  return httpClient.post<Answer>(`/quiz-sessions/${sessionId}/answers`, { questionId, answer });
};

/**
 * Finaliza uma sessão de quiz
 */
export const completeQuizSession = async (sessionId: string): Promise<ApiResponse<QuizSession>> => {
  return httpClient.post<QuizSession>(`/quiz-sessions/${sessionId}/complete`, {});
};

/**
 * Lista todas as sessões de quiz de uma criança
 */
export const listChildQuizSessions = async (childId: string): Promise<ApiResponse<QuizSession[]>> => {
  return httpClient.get<QuizSession[]>(`/children/${childId}/quiz-sessions`);
};
