require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbUser = process.env.DB_USERNAME || 'postgres';
const dbName = process.env.DB_DATABASE || 'educare';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

let authFailureCount = 0;
let lastAuthFailure = null;
const AUTH_FAILURE_THRESHOLD = 3;

const sequelize = new Sequelize(
  dbName,
  dbUser,
  process.env.DB_PASSWORD,
  {
    host: dbHost,
    port: dbPort,
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
      validate: (client) => {
        return client && !client._ending;
      },
    },
    retry: {
      max: 5,
      backoffBase: 1000,
      backoffExponent: 1.5,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /connection terminated unexpectedly/,
        /Connection terminated/,
        /SSL connection has been closed unexpectedly/,
      ],
    },
    dialectOptions: {
      connectTimeout: 15000,
      statement_timeout: 30000,
      idle_in_transaction_session_timeout: 60000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    },
    hooks: {
      afterConnect: () => {
        if (authFailureCount > 0) {
          console.log(`[DB] Conexao restaurada apos ${authFailureCount} falha(s) de autenticacao`);
          authFailureCount = 0;
          lastAuthFailure = null;
        }
      },
    },
  }
);

function isAuthError(error) {
  const msg = (error?.message || '').toLowerCase();
  return msg.includes('password authentication failed') ||
    msg.includes('authentication failed') ||
    msg.includes('role') && msg.includes('does not exist') ||
    error?.parent?.code === '28P01' ||
    error?.parent?.code === '28000';
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    if (authFailureCount > 0) {
      console.log(`[DB] Conexao restaurada apos ${authFailureCount} falha(s)`);
      authFailureCount = 0;
      lastAuthFailure = null;
    }
    console.log(`[DB] Conexao estabelecida com sucesso (user=${dbUser}, db=${dbName}, host=${dbHost}:${dbPort})`);
    return true;
  } catch (error) {
    if (isAuthError(error)) {
      authFailureCount++;
      lastAuthFailure = new Date().toISOString();
      console.error(`[DB] FALHA DE AUTENTICACAO #${authFailureCount} (user=${dbUser}, db=${dbName}, host=${dbHost}:${dbPort})`);
      console.error(`[DB] Verifique se a senha em DB_PASSWORD corresponde ao usuario '${dbUser}' no PostgreSQL.`);
      if (authFailureCount >= AUTH_FAILURE_THRESHOLD) {
        console.error(`[DB] ALERTA: ${authFailureCount} falhas consecutivas de autenticacao! Possivel dessincronizacao de senhas.`);
        console.error(`[DB] Acao recomendada: Verifique as senhas nos containers via Portainer (Stack Editor).`);
      }
    } else {
      console.error(`[DB] Falha na conexao (user=${dbUser}, db=${dbName}, host=${dbHost}:${dbPort}):`, error.message);
    }
    return false;
  }
};

const testConnectionWithRetry = async (maxRetries = 5, delayMs = 3000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const success = await testConnection();
    if (success) return true;

    if (attempt < maxRetries) {
      const waitTime = Math.min(delayMs * Math.pow(1.5, attempt - 1), 30000);
      console.log(`[DB] Tentativa ${attempt}/${maxRetries} falhou. Aguardando ${Math.round(waitTime)}ms (backoff exponencial)...`);
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

const getAuthStatus = () => ({
  db_user: dbUser,
  db_name: dbName,
  db_host: dbHost,
  db_port: dbPort,
  auth_failure_count: authFailureCount,
  last_auth_failure: lastAuthFailure,
  auth_healthy: authFailureCount < AUTH_FAILURE_THRESHOLD,
});

const queryWithRetry = async (sql, options = {}, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sequelize.query(sql, options);
    } catch (error) {
      if (isAuthError(error)) {
        authFailureCount++;
        lastAuthFailure = new Date().toISOString();
        console.error(`[DB] Auth failure during query (attempt ${attempt}/${maxRetries})`);
      }
      if (attempt === maxRetries) throw error;
      const waitTime = 1000 * Math.pow(2, attempt - 1);
      console.warn(`[DB] Query retry ${attempt}/${maxRetries}, waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

module.exports = {
  sequelize,
  testConnection,
  testConnectionWithRetry,
  getPoolStatus,
  getAuthStatus,
  queryWithRetry,
  isAuthError,
};
