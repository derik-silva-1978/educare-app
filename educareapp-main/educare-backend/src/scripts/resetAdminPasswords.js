/**
 * Script para redefinir as senhas dos usuários admin e owner para um valor padrão
 * Uso: node src/scripts/resetAdminPasswords.js
 */

// Importar dependências
const { sequelize } = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

// Senha padrão para administradores e owners
const DEFAULT_PASSWORD = 'abc123';

async function resetAdminPasswords() {
  try {
    console.log('Iniciando redefinição de senhas para administradores e owners...');
    
    // Garantir que a conexão com o banco de dados está estabelecida
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');
    
    // Gerar o hash da senha padrão
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, authConfig.saltRounds);
    console.log('Hash da senha padrão gerado.');
    
    // Buscar usuários com role admin ou owner
    const users = await User.findAll({
      where: {
        role: ['admin', 'owner']
      }
    });
    
    console.log(`Encontrados ${users.length} usuários admin/owner.`);
    
    // Contador de sucesso
    let successCount = 0;
    
    // Atualizar a senha de cada usuário
    for (const user of users) {
      try {
        user.password = hashedPassword;
        await user.save();
        successCount++;
        console.log(`Senha redefinida para ${user.role}: ${user.email || user.phone || user.id}`);
      } catch (error) {
        console.error(`Erro ao redefinir senha para o usuário ${user.id}:`, error);
      }
    }
    
    console.log(`\nProcesso concluído!`);
    console.log(`Total de admin/owner: ${users.length}`);
    console.log(`Senhas redefinidas com sucesso: ${successCount}`);
    console.log(`Falhas: ${users.length - successCount}`);
    console.log(`\nTodos os administradores e owners agora podem fazer login com a senha: ${DEFAULT_PASSWORD}`);
    
    // Fechar a conexão com o banco de dados
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
    
  } catch (error) {
    console.error('Erro ao executar o script:', error);
    process.exit(1);
  }
}

// Executar a função principal
resetAdminPasswords();
