// Verificar perfil (apenas admin/owner)
exports.verifyProfile = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { isVerified } = req.body;
    
    // Buscar perfil pelo ID
    const profile = await Profile.findByPk(id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    // Atualizar status de verificação
    profile.isVerified = isVerified;
    await profile.save();
    
    return res.status(200).json({
      message: `Perfil ${isVerified ? 'verificado' : 'não verificado'} com sucesso`,
      profile
    });
  } catch (error) {
    console.error('Erro ao verificar perfil:', error);
    return res.status(500).json({ error: 'Erro ao verificar perfil' });
  }
};
