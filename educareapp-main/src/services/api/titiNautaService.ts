/**
 * Serviço para o TitiNauta
 * Gerencia a comunicação com os endpoints do TitiNauta
 */

import httpClient, { ApiResponse } from './httpClient';
import { JourneyContent, QuizAnswer } from '@/types/titinauta';

/**
 * Busca o conteúdo da jornada para uma criança com base na idade
 * @param childId ID da criança
 * @param ageInMonths Idade da criança em meses
 */
export const getJourneyContent = async (
  childId: string,
  ageInMonths: number
): Promise<ApiResponse<JourneyContent>> => {
  return httpClient.get<JourneyContent>(`/journey/${childId}?ageInMonths=${ageInMonths}`);
};

/**
 * Interface para o payload de progresso
 */
export interface JourneyProgressPayload {
  journeyId: string;
  currentStep: number;
  completedSteps: string[];
}

/**
 * Interface para a resposta de progresso
 */
export interface JourneyProgressResponse {
  sessionId: string;
  progress: number;
}

/**
 * Salva o progresso da jornada
 * @param childId ID da criança
 * @param progressData Dados do progresso
 */
export const saveProgress = async (
  childId: string,
  progressData: JourneyProgressPayload
): Promise<ApiResponse<JourneyProgressResponse>> => {
  return httpClient.post<JourneyProgressResponse>(`/journey/${childId}/progress`, progressData);
};

/**
 * Interface para o payload de resposta de quiz
 */
export interface QuizAnswerPayload {
  questionId: string;
  selectedOptionId: string;
}

/**
 * Interface para a resposta do servidor ao salvar uma resposta
 */
export interface QuizAnswerResponse {
  id: string;
  user_id: string;
  child_id: string;
  question_id: string;
  answer: number;
  answer_text: string;
  created_at: string;
}

/**
 * Salva uma resposta de quiz
 * @param childId ID da criança
 * @param answerData Dados da resposta
 */
export const saveAnswer = async (
  childId: string,
  answerData: QuizAnswerPayload
): Promise<ApiResponse<QuizAnswerResponse>> => {
  return httpClient.post<QuizAnswerResponse>(`/journey/${childId}/answers`, answerData);
};

/**
 * Busca o histórico de respostas de uma criança
 * @param childId ID da criança
 */
export const getAnswerHistory = async (
  childId: string
): Promise<ApiResponse<QuizAnswerResponse[]>> => {
  return httpClient.get<QuizAnswerResponse[]>(`/journey/${childId}/history`);
};
