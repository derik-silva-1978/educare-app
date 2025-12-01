const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// URL base do servidor - usa variável de ambiente ou fallback
const serverUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3001}`;

// Configuração básica do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EducareApp API',
      version: '1.0.0',
      description: 'Documentação da API do EducareApp',
      contact: {
        name: 'Suporte EducareApp',
        email: 'suporte@educareapp.com',
      },
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.NODE_ENV === 'production' ? 'Servidor de Produção' : 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKey: {
          type: 'apiKey',
          in: 'query',
          name: 'api_key',
          description: 'API Key para integração externa'
        },
        apiKeyHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key via header'
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Caminhos para os arquivos que contêm anotações JSDoc
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/controllers/*.js',
    './src/server.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
  specs,
};
