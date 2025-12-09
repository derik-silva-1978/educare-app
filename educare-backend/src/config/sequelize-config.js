require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: process.env.DB_DIALECT || 'postgres',
    timezone: process.env.DB_TIMEZONE || 'America/Sao_Paulo',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    logging: console.log
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE ? process.env.DB_DATABASE + '_test' : undefined,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: process.env.DB_DIALECT || 'postgres',
    timezone: process.env.DB_TIMEZONE || 'America/Sao_Paulo',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    logging: console.log
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: process.env.DB_DIALECT || 'postgres',
    timezone: process.env.DB_TIMEZONE || 'America/Sao_Paulo',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    logging: false
  }
};
