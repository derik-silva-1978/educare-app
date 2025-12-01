require('dotenv').config();

// Corrigindo os nomes das variáveis de ambiente para corresponder ao arquivo .env
module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'dsg',
    password: process.env.DB_PASSWORD || 'Senha@1q2w3e',
    database: process.env.DB_DATABASE || 'educare1',
    host: process.env.DB_HOST || 'app.voipsimples.com.br',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    timezone: process.env.DB_TIMEZONE || 'America/Sao_Paulo',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    logging: console.log
  },
  test: {
    username: process.env.DB_USERNAME || 'dsg',
    password: process.env.DB_PASSWORD || 'Senha@1q2w3e',
    database: (process.env.DB_DATABASE || 'educare1') + '_test',
    host: process.env.DB_HOST || 'app.voipsimples.com.br',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    timezone: process.env.DB_TIMEZONE || 'America/Sao_Paulo',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    logging: console.log
  },
  production: {
    username: process.env.DB_USERNAME || 'dsg',
    password: process.env.DB_PASSWORD || 'Senha@1q2w3e',
    database: process.env.DB_DATABASE || 'educare1',
    host: process.env.DB_HOST || 'app.voipsimples.com.br',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    timezone: process.env.DB_TIMEZONE || 'America/Sao_Paulo',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    logging: false
  }
};
