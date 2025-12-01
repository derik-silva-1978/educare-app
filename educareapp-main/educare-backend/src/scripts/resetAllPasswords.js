/**
 * Script para redefinir todas as senhas dos usuários para um valor padrão
 * Uso: node src/scripts/resetAllPasswords.js
 */

// Importar dependências
const { sequelize } = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

// Senha padrão para todos os usuários
const DEFAULT_PASSWORD = 'ab123';

async function resetAllPasswords() {
  try {
    console.log('Iniciando redefinição de senhas...');
    
    // Garantir que a conexão com o banco de dados está estabelecida
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');
    
    // Gerar o hash da senha padrão
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, authConfig.saltRounds);
    console.log('Hash da senha padrão gerado.');
    
    // Buscar todos os usuários
    const users = await User.findAll();
    console.log(`Encontrados ${users.length} usuários.`);
    
    // Contador de sucesso
    let successCount = 0;
    
    // Atualizar a senha de cada usuário
    for (const user of users) {
      try {
        user.password = hashedPassword;
        await user.save();
        successCount++;
        console.log(`Senha redefinida para o usuário: ${user.email || user.phone || user.id}`);
      } catch (error) {
        console.error(`Erro ao redefinir senha para o usuário ${user.id}:`, error);
      }
    }
    
    console.log(`\nProcesso concluído!`);
    console.log(`Total de usuários: ${users.length}`);
    console.log(`Senhas redefinidas com sucesso: ${successCount}`);
    console.log(`Falhas: ${users.length - successCount}`);
    console.log(`\nTodos os usuários agora podem fazer login com a senha: ${DEFAULT_PASSWORD}`);
    
    // Fechar a conexão com o banco de dados
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
    
  } catch (error) {
    console.error('Erro ao executar o script:', error);
    process.exit(1);
  }
}

// Executar a função principal
resetAllPasswords();
