/**
 * Configuração da API
 * 
 * Este arquivo contém as configurações básicas para comunicação com a API,
 * como URL base, timeouts, etc.
 */

// URL base da API - usa variável de ambiente ou fallback para desenvolvimento
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Timeout padrão para requisições (em milissegundos)
export const API_TIMEOUT = 30000;

// Cabeçalhos padrão para requisições
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Versão da API
export const API_VERSION = 'v1';
