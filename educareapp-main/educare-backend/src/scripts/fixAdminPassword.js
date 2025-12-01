/**
 * Script para corrigir as senhas dos usuários admin e owner
 * Este script garante que as senhas não sejam tratadas como temporárias
 * Uso: node src/scripts/fixAdminPassword.js
 */

// Importar dependências
const { sequelize } = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

// Senha para administradores e owners
const ADMIN_PASSWORD = 'abc123';

async function fixAdminPasswords() {
  try {
    console.log('Iniciando correção de senhas para administradores e owners...');
    
    // Garantir que a conexão com o banco de dados está estabelecida
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');
    
    // Gerar o hash da senha
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, authConfig.saltRounds);
    console.log('Hash da senha gerado.');
    
    // Buscar usuários com role admin ou owner
    const users = await User.findAll({
      where: {
        role: ['admin', 'owner']
      }
    });
    
    console.log(`Encontrados ${users.length} usuários admin/owner.`);
    
    // Contador de sucesso
    let successCount = 0;
    
    // Atualizar a senha de cada usuário e limpar campos de reset
    for (const user of users) {
      try {
        // Atualizar a senha diretamente no banco de dados para garantir que não seja tratada como temporária
        await sequelize.query(
          `UPDATE users SET password = :password, reset_token = NULL, reset_token_expires = NULL, 
           phone_verification_code = NULL, phone_verification_expires = NULL, updated_at = NOW() 
           WHERE id = :userId`,
          {
            replacements: { 
              password: hashedPassword,
              userId: user.id
            },
            type: sequelize.QueryTypes.UPDATE
          }
        );
        
        successCount++;
        console.log(`Senha corrigida para ${user.role}: ${user.email || user.phone || user.id}`);
      } catch (error) {
        console.error(`Erro ao corrigir senha para o usuário ${user.id}:`, error);
      }
    }
    
    console.log(`\nProcesso concluído!`);
    console.log(`Total de admin/owner: ${users.length}`);
    console.log(`Senhas corrigidas com sucesso: ${successCount}`);
    console.log(`Falhas: ${users.length - successCount}`);
    console.log(`\nTodos os administradores e owners agora podem fazer login com a senha: ${ADMIN_PASSWORD}`);
    
    // Fechar a conexão com o banco de dados
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
    
  } catch (error) {
    console.error('Erro ao executar o script:', error);
    process.exit(1);
  }
}

// Executar a função principal
fixAdminPasswords();
