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

// Serviço de jornadas
export * from './journeyService';
