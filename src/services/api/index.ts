/**
 * Índice de exportação para todos os serviços de API
 */

// Cliente HTTP
export { default as httpClient } from './httpClient';
export type { ApiResponse } from './httpClient';

// Serviço de autenticação
export * from './authService';

// Serviço de usuários
export * from './userService';

// Serviço de crianças
export * from './childService';

// Serviço de quizzes
export * from './quizService';

// Serviço de assinaturas
export * from './subscriptionService';

// Serviço do Stripe (re-export with aliases to avoid conflicts)
export {
  getStripeConfig,
  listProducts,
  listProductsWithPrices,
  listPrices,
  getProductPrices,
  createCheckoutSession,
  createCustomerPortalSession,
  getMySubscription as getMyStripeSubscription,
  cancelSubscription as cancelStripeSubscription,
  resumeSubscription as resumeStripeSubscription,
  changePlan,
  formatPrice,
  formatInterval,
} from './stripeService';
export type {
  StripeProduct,
  StripePrice,
  StripeProductWithPrices,
  StripeSubscription,
  CheckoutResponse,
  PortalResponse,
} from './stripeService';

// Serviço de jornadas
export * from './journeyService';
