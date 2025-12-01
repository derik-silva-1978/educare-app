/**
 * Configuração da API
 * 
 * Este arquivo contém as configurações básicas para comunicação com a API,
 * como URL base, timeouts, etc.
 */

// URL base da API
export const API_BASE_URL = 'http://localhost:3001/api';

// Timeout padrão para requisições (em milissegundos)
export const API_TIMEOUT = 30000;

// Cabeçalhos padrão para requisições
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Versão da API
export const API_VERSION = 'v1';
