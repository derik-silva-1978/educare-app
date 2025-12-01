/**
 * Serviço para gerenciamento de assinaturas e planos
 */

import httpClient, { ApiResponse } from './httpClient';

// Tipos
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    childrenCount: number;
    documentsPerChild: number;
    quizzesPerMonth: number;
    [key: string]: any;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: 'active' | 'canceled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  renewalDate?: string;
  paymentMethod?: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lista todos os planos de assinatura disponíveis
 */
export const listSubscriptionPlans = async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
  return httpClient.get<SubscriptionPlan[]>('/subscription-plans/public', { requiresAuth: false });
};

/**
 * Obtém os detalhes de um plano de assinatura específico
 */
export const getSubscriptionPlan = async (planId: string): Promise<ApiResponse<SubscriptionPlan>> => {
  return httpClient.get<SubscriptionPlan>(`/subscription-plans/${planId}`, { requiresAuth: false });
};

/**
 * Compara planos de assinatura
 */
export const comparePlans = async (planIds: string[]): Promise<ApiResponse<SubscriptionPlan[]>> => {
  const planIdsParam = planIds.join(',');
  return httpClient.get<SubscriptionPlan[]>(`/subscription-plans/compare?planIds=${planIdsParam}`, { requiresAuth: false });
};

/**
 * Obtém as assinaturas do usuário atual
 */
export const getMySubscriptions = async (): Promise<ApiResponse<Subscription[]>> => {
  return httpClient.get<Subscription[]>('/subscriptions/my');
};

/**
 * Obtém a assinatura ativa do usuário atual
 */
export const getMyActiveSubscription = async (): Promise<ApiResponse<Subscription>> => {
  return httpClient.get<Subscription>('/subscriptions/my/active');
};

/**
 * Cria uma nova assinatura
 */
export const createSubscription = async (
  planId: string,
  paymentMethod: string,
  paymentDetails: any
): Promise<ApiResponse<Subscription>> => {
  return httpClient.post<Subscription>('/subscriptions', {
    planId,
    paymentMethod,
    paymentDetails
  });
};

/**
 * Cancela uma assinatura
 */
export const cancelSubscription = async (
  subscriptionId: string,
  reason?: string
): Promise<ApiResponse<Subscription>> => {
  return httpClient.post<Subscription>(`/subscriptions/${subscriptionId}/cancel`, { reason });
};

/**
 * Renova uma assinatura
 */
export const renewSubscription = async (
  subscriptionId: string,
  paymentMethod: string,
  paymentDetails: any
): Promise<ApiResponse<Subscription>> => {
  return httpClient.post<Subscription>(`/subscriptions/${subscriptionId}/renew`, {
    paymentMethod,
    paymentDetails
  });
};

/**
 * Atualiza o plano de uma assinatura
 */
export const updateSubscriptionPlan = async (
  subscriptionId: string,
  newPlanId: string,
  paymentMethod: string,
  paymentDetails: any
): Promise<ApiResponse<Subscription>> => {
  return httpClient.patch<Subscription>(`/subscriptions/${subscriptionId}/plan`, {
    newPlanId,
    paymentMethod,
    paymentDetails
  });
};

/**
 * Verifica se o usuário tem acesso a um recurso específico
 * baseado em sua assinatura atual
 */
export const checkSubscriptionAccess = async (
  resourceType: string,
  resourceAction: string
): Promise<ApiResponse<{ hasAccess: boolean, reason?: string }>> => {
  return httpClient.get<{ hasAccess: boolean, reason?: string }>(
    `/subscriptions/access-check?resourceType=${resourceType}&resourceAction=${resourceAction}`
  );
};
