import httpClient, { ApiResponse } from './httpClient';

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  metadata: Record<string, string>;
}

export interface StripePrice {
  id: string;
  product: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  recurring: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
  } | null;
  metadata: Record<string, string>;
}

export interface StripeProductWithPrices extends StripeProduct {
  prices: StripePrice[];
}

export interface StripeSubscription {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid' | 'paused';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  items: {
    data: Array<{
      id: string;
      price: StripePrice;
    }>;
  };
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
}

export interface PortalResponse {
  url: string;
}

export const getStripeConfig = async (): Promise<ApiResponse<{ publishableKey: string }>> => {
  return httpClient.get<{ publishableKey: string }>('/stripe/config', { requiresAuth: false });
};

export const listProducts = async (): Promise<ApiResponse<StripeProduct[]>> => {
  return httpClient.get<StripeProduct[]>('/stripe/products', { requiresAuth: false });
};

export const listProductsWithPrices = async (): Promise<ApiResponse<StripeProductWithPrices[]>> => {
  return httpClient.get<StripeProductWithPrices[]>('/stripe/products-with-prices', { requiresAuth: false });
};

export const listPrices = async (): Promise<ApiResponse<StripePrice[]>> => {
  return httpClient.get<StripePrice[]>('/stripe/prices', { requiresAuth: false });
};

export const getProductPrices = async (productId: string): Promise<ApiResponse<StripePrice[]>> => {
  return httpClient.get<StripePrice[]>(`/stripe/products/${productId}/prices`, { requiresAuth: false });
};

export const createCheckoutSession = async (
  priceId: string,
  planId?: string
): Promise<ApiResponse<CheckoutResponse>> => {
  return httpClient.post<CheckoutResponse>('/stripe/checkout', { priceId, planId });
};

export const createCustomerPortalSession = async (): Promise<ApiResponse<PortalResponse>> => {
  return httpClient.post<PortalResponse>('/stripe/customer-portal', {});
};

export const getMySubscription = async (): Promise<ApiResponse<{
  subscription: StripeSubscription | null;
  allSubscriptions: StripeSubscription[];
}>> => {
  return httpClient.get<{
    subscription: StripeSubscription | null;
    allSubscriptions: StripeSubscription[];
  }>('/stripe/subscription');
};

export const cancelSubscription = async (
  subscriptionId: string,
  immediate: boolean = false
): Promise<ApiResponse<{ subscription: StripeSubscription; message: string }>> => {
  return httpClient.post<{ subscription: StripeSubscription; message: string }>(
    `/stripe/subscription/${subscriptionId}/cancel`,
    { immediate }
  );
};

export const resumeSubscription = async (
  subscriptionId: string
): Promise<ApiResponse<{ subscription: StripeSubscription; message: string }>> => {
  return httpClient.post<{ subscription: StripeSubscription; message: string }>(
    `/stripe/subscription/${subscriptionId}/resume`,
    {}
  );
};

export const changePlan = async (
  subscriptionId: string,
  newPriceId: string
): Promise<ApiResponse<{ subscription: StripeSubscription; message: string }>> => {
  return httpClient.post<{ subscription: StripeSubscription; message: string }>(
    `/stripe/subscription/${subscriptionId}/change-plan`,
    { newPriceId }
  );
};

export const formatPrice = (amount: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

export const formatInterval = (interval: string, count: number = 1): string => {
  const intervals: Record<string, string> = {
    day: count === 1 ? 'dia' : 'dias',
    week: count === 1 ? 'semana' : 'semanas',
    month: count === 1 ? 'mês' : 'meses',
    year: count === 1 ? 'ano' : 'anos',
  };
  
  if (count === 1) {
    return `/${intervals[interval] || interval}`;
  }
  return `a cada ${count} ${intervals[interval] || interval}`;
};
