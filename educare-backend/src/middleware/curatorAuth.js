/**
 * Middleware para verificar acesso de curador
 * Curador pode: owner, admin, ou usuário com role 'curator'
 */
const requireCuratorRole = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    const allowedRoles = ['owner', 'admin', 'curator'];
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Permissão de curador necessária.'
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de curador:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se é owner (para operações críticas)
 */
const requireOwnerRole = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas owners podem executar esta ação.'
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de owner:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  requireCuratorRole,
  requireOwnerRole
};
