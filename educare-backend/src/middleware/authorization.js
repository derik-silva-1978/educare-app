/**
 * Middleware de autorização baseado em roles
 */

/**
 * Verifica se o usuário tem uma das roles permitidas
 * @param {...string} allowedRoles - Roles permitidas
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    // Verificar role do usuário (pode vir como 'role' ou 'user_type')
    const userRole = req.user.role || req.user.user_type;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não tem permissão para acessar este recurso.',
        required_roles: allowedRoles,
        user_role: userRole
      });
    }

    next();
  };
};

/**
 * Verifica se o usuário é owner
 */
const isOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  const userRole = req.user.role || req.user.user_type;

  if (userRole !== 'owner') {
    return res.status(403).json({
      success: false,
      message: 'Acesso restrito a proprietários'
    });
  }

  next();
};

/**
 * Verifica se o usuário é admin ou owner
 */
const isAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  const userRole = req.user.role || req.user.user_type;

  if (!['admin', 'owner'].includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Acesso restrito a administradores'
    });
  }

  next();
};

module.exports = {
  authorizeRoles,
  isOwner,
  isAdminOrOwner
};
