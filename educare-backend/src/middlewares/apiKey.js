require('dotenv').config();

/**
 * Middleware para validar API key em requisições externas
 * Usa uma chave simples definida no arquivo .env
 */
exports.validateApiKey = (req, res, next) => {
  // Obter a API key da query ou do header
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  
  // Verificar se a API key foi fornecida
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key não fornecida'
    });
  }
  
  // Verificar se a API key é válida (comparando com a chave definida no .env)
  const validApiKey = process.env.EXTERNAL_API_KEY;
  
  if (!validApiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key inválida'
    });
  }
  
  // Se a API key for válida, continuar para o próximo middleware/controlador
  next();
};
