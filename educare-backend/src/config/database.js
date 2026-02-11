require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbUser = process.env.DB_USERNAME || 'postgres';
const dbName = process.env.DB_DATABASE || 'educare';
const dbHost = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(
  dbName,
  dbUser,
  process.env.DB_PASSWORD,
  {
    host: dbHost,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    timezone: process.env.DB_TIMEZONE || 'America/Sao_Paulo',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      acquire: 30000,
      idle: 10000,
      evict: 15000,
    },
    retry: {
      max: 3,
      backoffBase: 1000,
      backoffExponent: 1.5,
    },
    dialectOptions: {
      connectTimeout: 10000,
      statement_timeout: 30000,
      idle_in_transaction_session_timeout: 60000,
    },
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[DB] Conexao estabelecida com sucesso (user=${dbUser}, db=${dbName}, host=${dbHost})`);
    return true;
  } catch (error) {
    console.error(`[DB] Falha na conexao (user=${dbUser}, db=${dbName}, host=${dbHost}):`, error.message);
    return false;
  }
};

const testConnectionWithRetry = async (maxRetries = 5, delayMs = 3000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const success = await testConnection();
    if (success) return true;

    if (attempt < maxRetries) {
      const waitTime = delayMs * attempt;
      console.log(`[DB] Tentativa ${attempt}/${maxRetries} falhou. Aguardando ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  console.error(`[DB] Todas as ${maxRetries} tentativas de conexao falharam.`);
  return false;
};

const getPoolStatus = () => {
  const pool = sequelize.connectionManager.pool;
  if (!pool) return { available: false };
  return {
    available: true,
    size: pool.size || 0,
    available_connections: pool.available || 0,
    pending: pool.pending || 0,
    max: pool.max || 0,
    min: pool.min || 0,
  };
};

module.exports = {
  sequelize,
  testConnection,
  testConnectionWithRetry,
  getPoolStatus
};
