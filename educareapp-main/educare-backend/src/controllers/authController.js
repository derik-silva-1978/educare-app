const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Profile } = require('../models');
const authConfig = require('../config/auth');
const { validationResult } = require('express-validator');
const https = require('https'); // Módulo nativo do Node.js para requisições HTTPS

/**
 * Função auxiliar para enviar dados para um webhook via HTTPS
 * @param {string} webhookUrl - URL do webhook
 * @param {object} data - Dados a serem enviados no formato JSON
 * @returns {Promise<object>} - Resposta do webhook
 */
const sendToWebhook = async (webhookUrl, data) => {
  return new Promise((resolve, reject) => {
    try {
      // Converter a URL do webhook em objeto URL para extrair os componentes
      const url = new URL(webhookUrl);
      
      // Preparar os dados para envio
      const postData = JSON.stringify(data);
      
      // Opções da requisição
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      // Criar a requisição
      const req = https.request(options, (res) => {
        let responseData = '';
        
        // Coletar os dados da resposta
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        // Finalizar a requisição quando terminar
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ ok: true, status: res.statusCode, data: responseData });
          } else {
            reject(new Error(`Webhook retornou status ${res.statusCode}`));
          }
        });
      });
      
      // Tratar erros de conexão
      req.on('error', (error) => {
        reject(error);
      });
      
      // Enviar os dados
      req.write(postData);
      req.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Função para gerar token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, authConfig.secret, {
    expiresIn: authConfig.expiresIn
  });
};

// Registrar novo usuário
exports.register = async (req, res) => {
  try {
    console.log('=== REGISTRO - Dados recebidos ===');
    console.log('Body:', req.body);
    
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Erros de validação:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    console.log('Validação passou, processando registro...');

    const { email, phone, password, name, firstName, lastName, role, plan_id, profile } = req.body;

    // Mapear role 'parent' para 'user' (compatibilidade com ENUM do banco)
    const mappedRole = role === 'parent' ? 'user' : role;
    
    // Gerar senha temporária se não fornecida (para profissionais criados pelo admin)
    let finalPassword = password;
    if (!password && mappedRole === 'professional' && req.headers.authorization) {
      // Gerar senha temporária de 16 caracteres
      finalPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      console.log(`Senha temporária gerada para profissional: ${finalPassword}`);
    }
    
    // Verificar se temos senha (fornecida ou gerada)
    if (!finalPassword) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    // Verificar se pelo menos email ou telefone foi fornecido
    if (!email && !phone) {
      return res.status(400).json({ error: 'É necessário fornecer email ou telefone' });
    }

    // Processar nome: usar firstName/lastName se fornecidos, ou dividir 'name'
    let finalFirstName = firstName;
    let finalLastName = lastName;
    
    if (!firstName && !lastName && name) {
      const nameParts = name.trim().split(' ');
      finalFirstName = nameParts[0] || name;
      finalLastName = nameParts.slice(1).join(' ') || '';
    }

    // Verificar se o e-mail já está em uso (se fornecido)
    if (email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'E-mail já está em uso' });
      }
    }

    // Verificar se o telefone já está em uso (se fornecido)
    if (phone) {
      console.log(`Verificando se telefone já está em uso: ${phone}`);
      
      // Verificar telefone exatamente como recebido
      let phoneExists = await User.findOne({ where: { phone } });
      
      // Se não encontrar e for telefone com +, verificar sem o +
      if (!phoneExists && phone.startsWith('+')) {
        const phoneWithoutPlus = phone.substring(1);
        console.log(`Verificando telefone sem o +: ${phoneWithoutPlus}`);
        phoneExists = await User.findOne({ where: { phone: phoneWithoutPlus } });
        
        // Se encontrar sem o +, atualizar para incluir o +
        if (phoneExists) {
          console.log(`Telefone já cadastrado sem o +: ${phoneWithoutPlus}`);
          await phoneExists.update({ phone });
        }
      }
      
      if (phoneExists) {
        return res.status(400).json({ error: 'Telefone já está em uso' });
      }
    }

    // Criar usuário
    const user = await User.create({
      email,
      phone,
      password: finalPassword,
      name,
      role: mappedRole || 'user',
      status: 'active'  // Definir como ativo automaticamente para pais/users
    });

    // Criar perfil do usuário
    const profileData = {
      user_id: user.id,
      name: name,
      type: mappedRole === 'professional' ? 'professional' : 'parent',
      phone: phone
    };
    
    // Se é um profissional e tem dados de perfil, incluir informações adicionais
    if (mappedRole === 'professional' && profile) {
      if (profile.specialization) profileData.specialization = profile.specialization;
      if (profile.bio) profileData.bio = profile.bio;
      if (profile.city) profileData.city = profile.city;
      if (profile.state) profileData.state = profile.state;
      if (profile.experience_years !== undefined) profileData.experience_years = profile.experience_years;
      if (profile.certifications) profileData.certifications = JSON.stringify(profile.certifications);
    }
    
    await Profile.create(profileData);

    // Criar assinatura - com plano fornecido ou plano padrão gratuito
    const { SubscriptionPlan, Subscription } = require('../models');
    let selectedPlanId = plan_id;
    
    // Se não há plano válido fornecido, buscar plano gratuito padrão
    if (!plan_id || typeof plan_id !== 'string' || plan_id === 'undefined' || plan_id === 'true' || plan_id === 'false') {
      console.log('Nenhum plano fornecido, buscando plano gratuito padrão...');
      const freePlan = await SubscriptionPlan.findOne({
        where: { 
          name: { [require('sequelize').Op.iLike]: '%gratuito%' },
          is_active: true,
          is_public: true 
        },
        order: [['price', 'ASC']]
      });
      
      if (freePlan) {
        selectedPlanId = freePlan.id;
        console.log('Plano gratuito encontrado:', freePlan.name, 'ID:', selectedPlanId);
      } else {
        console.log('Nenhum plano gratuito encontrado, criando usuário sem assinatura');
      }
    }
    
    // Criar assinatura se temos um plano válido
    if (selectedPlanId) {
      console.log('Criando assinatura para usuário:', user.id, 'com plano:', selectedPlanId);
      
      // Verificar se o plano existe
      const plan = await SubscriptionPlan.findByPk(selectedPlanId);
      
      if (plan) {
        // Calcular datas de início e fim
        const startDate = new Date();
        let endDate = null;
        let nextBillingDate = null;
        
        if (plan.billing_cycle === 'monthly') {
          endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);
          nextBillingDate = new Date(endDate);
        } else if (plan.billing_cycle === 'yearly') {
          endDate = new Date(startDate);
          endDate.setFullYear(endDate.getFullYear() + 1);
          nextBillingDate = new Date(endDate);
        }
        
        // Se há período de teste, ajustar as datas
        if (plan.trial_days && plan.trial_days > 0) {
          const trialEndDate = new Date(startDate);
          trialEndDate.setDate(trialEndDate.getDate() + plan.trial_days);
          nextBillingDate = new Date(trialEndDate);
        }
        
        // Criar assinatura
        const subscription = await Subscription.create({
          userId: user.id,
          planId: selectedPlanId,
          status: plan.trial_days > 0 ? 'trial' : 'active',
          startDate: startDate,
          endDate: endDate,
          nextBillingDate: nextBillingDate,
          autoRenew: true,
          childrenCount: 0,
          usageStats: {},
          paymentDetails: {}
        });
        
        console.log('Assinatura criada com sucesso para usuário:', user.id);
      } else {
        console.warn('Plano não encontrado:', plan_id);
      }
    }

    // Gerar token JWT
    const token = generateToken(user.id);
    const refreshToken = generateToken(user.id); // Por enquanto, mesmo token (pode ser melhorado)

    // Preparar resposta
    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: name || `${finalFirstName} ${finalLastName}`.trim(),
        role: user.role
      },
      token,
      refreshToken
    };
    
    // Se é um profissional criado pelo admin com senha temporária, incluir a senha na resposta
    if (mappedRole === 'professional' && req.headers.authorization && !password) {
      response.temporaryPassword = finalPassword;
      response.message = 'Profissional criado com sucesso. Senha temporária gerada.';
    }
    
    // Retornar dados do usuário
    return res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, password } = req.body;

    // Verificar se pelo menos email ou telefone foi fornecido
    if (!email && !phone) {
      return res.status(400).json({ error: 'É necessário fornecer email ou telefone' });
    }

    console.log(`Tentando login com: ${email || phone}`);
    
    // Primeiro, tentamos encontrar o usuário pelo método fornecido (email ou telefone)
    let user = null;
    
    if (email) {
      user = await User.findOne({ 
        where: { email },
        include: [{ model: Profile, as: 'profile' }]
      });
    } else if (phone) {
      // Primeiro tenta com o telefone exatamente como recebido
      user = await User.findOne({ 
        where: { phone },
        include: [{ model: Profile, as: 'profile' }]
      });
      
      // Se não encontrar e for telefone com +, tenta sem o +
      if (!user && phone.startsWith('+')) {
        const phoneWithoutPlus = phone.substring(1);
        console.log(`Tentando login com telefone sem o +: ${phoneWithoutPlus}`);
        
        user = await User.findOne({ 
          where: { phone: phoneWithoutPlus },
          include: [{ model: Profile, as: 'profile' }]
        });
        
        // Se encontrou, atualiza o telefone para incluir o +
        if (user) {
          console.log(`Usuário encontrado com telefone sem o +: ${phoneWithoutPlus}`);
          await user.update({ phone });
        }
      }
    }

    // Se não encontramos o usuário pelo método fornecido, verificamos se é uma tentativa
    // de login com senha temporária usando um método alternativo
    if (!user && email) {
      // Tentativa de login com email, mas usuário não encontrado
      // Vamos buscar por telefone associado a este email em outro registro
      console.log('Usuário não encontrado pelo email, buscando por outros métodos...');
      
      // Aqui precisaríamos de uma tabela de associação entre email e telefone
      // Como não temos isso explicitamente, vamos verificar se algum usuário com este email
      // está tentando usar uma senha temporária gerada para seu telefone
      
      // Esta é uma implementação simplificada - idealmente você teria uma tabela
      // que associa explicitamente emails e telefones do mesmo usuário
    } else if (!user && phone) {
      // Tentativa de login com telefone, mas usuário não encontrado
      // Vamos buscar por email associado a este telefone em outro registro
      console.log('Usuário não encontrado pelo telefone, buscando por outros métodos...');
      
      // Implementação similar à acima
    }

    // Verificar se o usuário existe
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar se o usuário está ativo
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    // Verificar senha
    console.log(`Verificando senha para usuário: ${user.email || user.phone}`);
    console.log(`Senha fornecida (comprimento): ${password ? password.length : 'senha vazia'}`);
    console.log(`Senha contém @: ${password && password.includes('@') ? 'Sim' : 'Não'}`);
    
    const passwordMatch = await user.checkPassword(password);
    
    if (passwordMatch) {
      console.log('Senha verificada com sucesso para login direto');
    } else {
      console.log('Senha direta não corresponde, verificando métodos alternativos...');
      
      // Se a senha direta não corresponder, verificamos se há outro usuário
      // com o mesmo ID (mesmo usuário) mas com método de contato diferente
      // que possa ter recebido uma senha temporária
      
      // Buscar todos os métodos de contato deste usuário
      const userId = user.id;
      let alternativeUser = null;
      let altPasswordMatch = false;
      
      if (email) {
        // Se o login foi tentado com email, verificar se o mesmo usuário tem um telefone
        // registrado que possa ter recebido uma senha temporária
        console.log(`Tentando encontrar conta alternativa com telefone para o usuário ${userId}`);
        
        alternativeUser = await User.findOne({
          where: {
            id: userId,
            phone: { [require('sequelize').Op.ne]: null }
          }
        });
        
        if (alternativeUser) {
          console.log(`Conta alternativa encontrada com telefone ${alternativeUser.phone}`);
          console.log(`Verificando senha temporária enviada para o telefone ${alternativeUser.phone}`);
          
          altPasswordMatch = await alternativeUser.checkPassword(password);
          
          if (altPasswordMatch) {
            // A senha temporária enviada para o telefone funciona para o login com email
            console.log('Senha temporária do telefone aceita para login com email!');
            user = alternativeUser;
          } else {
            console.log('Senha temporária do telefone NÃO funciona para login com email');
            return res.status(401).json({ 
              error: 'Email ou senha incorretos. Por favor, verifique suas credenciais.'
            });
          }
        } else {
          console.log('Nenhuma conta alternativa encontrada com telefone');
          return res.status(401).json({ error: 'Email ou senha incorretos. Por favor, verifique suas credenciais.' });
        }
      } else if (phone) {
        // Se o login foi tentado com telefone, verificar se o mesmo usuário tem um email
        // registrado que possa ter recebido uma senha temporária
        console.log(`Tentando encontrar conta alternativa com email para o usuário ${userId}`);
        
        alternativeUser = await User.findOne({
          where: {
            id: userId,
            email: { [require('sequelize').Op.ne]: null }
          }
        });
        
        if (alternativeUser) {
          console.log(`Conta alternativa encontrada com email ${alternativeUser.email}`);
          console.log(`Verificando senha temporária enviada para o email ${alternativeUser.email}`);
          
          altPasswordMatch = await alternativeUser.checkPassword(password);
          
          if (altPasswordMatch) {
            // A senha temporária enviada para o email funciona para o login com telefone
            console.log('Senha temporária do email aceita para login com telefone!');
            user = alternativeUser;
          } else {
            console.log('Senha temporária do email NÃO funciona para login com telefone');
            return res.status(401).json({ 
              error: 'Email ou senha incorretos. Por favor, verifique suas credenciais.'
            });
          }
        } else {
          console.log('Nenhuma conta alternativa encontrada com email');
          return res.status(401).json({ error: 'Email ou senha incorretos. Por favor, verifique suas credenciais.' });
        }
      }
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar token JWT
    const token = generateToken(user.id);
    const refreshToken = generateToken(user.id); // Por enquanto, mesmo token (pode ser melhorado)

    // Retornar dados do usuário (sem a senha), token e refreshToken
    return res.status(200).json({
      success: true, // Adicionar campo success para compatibilidade com o frontend
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile
      },
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    
    // Verificar se é um erro relacionado a senha temporária
    const errorMessage = error.message || 'Erro ao fazer login';
    const isTempPasswordError = errorMessage.includes('temporária');
    
    if (isTempPasswordError) {
      return res.status(401).json({ 
        error: 'Senha temporária inválida ou expirada. Por favor, solicite uma nova senha.',
        success: false,
        isTempPasswordError: true
      });
    }
    
    return res.status(500).json({ 
      error: 'Erro ao fazer login. Por favor, tente novamente.',
      success: false,
      details: process.env.NODE_ENV !== 'production' ? errorMessage : undefined
    });
  }
};

// Verificar token
exports.verifyToken = async (req, res) => {
  try {
    // O middleware auth.verifyToken já verificou o token
    // e adicionou as informações do usuário ao objeto req.user
    
    // Buscar informações atualizadas do usuário
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(500).json({ error: 'Erro ao verificar token' });
  }
};

// Solicitar redefinição de senha
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'E-mail é obrigatório',
        success: false
      });
    }
    
    console.log(`Solicitando redefinição de senha para: ${email}`);

    // Buscar usuário pelo e-mail
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Por segurança, não informamos se o e-mail existe ou não
      console.log(`Usuário não encontrado com o email: ${email}`);
      return res.status(200).json({ 
        message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha',
        success: true
      });
    }

    // Gerar token para redefinição de senha
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Salvar token e data de expiração no usuário
    user.reset_token = resetToken;
    user.reset_token_expires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();

    // Importar o módulo de envio de email
    const { sendEmail } = require('../utils/emailSender');
    
    // Construir a URL de redefinição de senha
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${baseUrl}/educare-app/auth/reset-password?token=${resetToken}`;
    
    // Construir o corpo do email
    const emailSubject = 'Educare - Redefinição de Senha';
    const emailBody = `
      <h2>Redefinição de Senha</h2>
      <p>Olá,</p>
      <p>Você solicitou a redefinição de senha para sua conta no Educare.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <p><a href="${resetUrl}" target="_blank">Redefinir minha senha</a></p>
      <p>Ou copie e cole o seguinte link no seu navegador:</p>
      <p>${resetUrl}</p>
      <p>Este link é válido por 1 hora.</p>
      <p>Se você não solicitou esta redefinição, ignore este email.</p>
      <p>Atenciosamente,<br>Equipe Educare</p>
    `;
    
    // Enviar o email
    const emailResult = await sendEmail(email, emailSubject, emailBody);
    
    if (!emailResult.success) {
      console.error('Erro ao enviar email de redefinição:', emailResult.error);
      
      // Mesmo com erro no envio, não informamos ao usuário para evitar vazamento de informação
      return res.status(200).json({ 
        message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha',
        success: true
      });
    }
    
    console.log(`Email de redefinição enviado com sucesso para: ${email}`);
    
    return res.status(200).json({
      message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha',
      success: true
    });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar solicitação de redefinição de senha',
      success: false
    });
  }
};

// Redefinir senha
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ 
        error: 'Token e senha são obrigatórios',
        success: false
      });
    }
    
    console.log(`Tentando redefinir senha com token: ${token.substring(0, 10)}...`);

    // Buscar usuário pelo token
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expires: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      console.log('Token inválido ou expirado');
      return res.status(400).json({ 
        error: 'Token inválido ou expirado. Por favor, solicite uma nova redefinição de senha.',
        success: false
      });
    }
    
    console.log(`Usuário encontrado: ${user.email}. Atualizando senha...`);

    // Atualizar senha
    user.password = password;
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();
    
    console.log(`Senha redefinida com sucesso para: ${user.email}`);

    return res.status(200).json({ 
      message: 'Senha redefinida com sucesso. Você já pode fazer login com sua nova senha.',
      success: true
    });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar redefinição de senha. Por favor, tente novamente.',
      success: false
    });
  }
};

// Atualizar senha (usuário logado)
exports.updatePassword = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Buscar usuário
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar senha atual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    // Atualizar senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return res.status(200).json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return res.status(500).json({ error: 'Erro ao atualizar senha' });
  }
};

// Logout (opcional, depende da implementação do frontend)
exports.logout = async (req, res) => {
  try {
    // No JWT, o logout geralmente é implementado no cliente
    // Aqui podemos registrar o evento ou invalidar tokens em uma lista negra se necessário
    const userId = req.user.id;
    
    // Registrar evento de logout (opcional)
    console.log(`Usuário ${userId} realizou logout em ${new Date()}`);
    
    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro ao realizar logout:', error);
    return res.status(500).json({ error: 'Erro ao realizar logout' });
  }
};

// Função auxiliar para gerar senha temporária segura
const generateSecurePassword = () => {
  // Definir conjuntos de caracteres
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '@';
  
  // Garantir pelo menos 2 maiúsculas
  let password = '';
  for (let i = 0; i < 2; i++) {
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
  }
  
  // Garantir pelo menos um @
  password += specialChars;
  
  // Garantir pelo menos um número
  password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
  
  // Garantir pelo menos uma letra minúscula
  password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  
  // Adicionar caracteres aleatórios para completar 6 dígitos se necessário
  const remainingLength = 6 - password.length;
  const allChars = uppercaseChars + lowercaseChars + numberChars;
  
  for (let i = 0; i < remainingLength; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Embaralhar a senha para não ter um padrão previsível
  const shuffled = password.split('').sort(() => 0.5 - Math.random()).join('');
  
  console.log('Senha temporária gerada (exata):', shuffled);
  console.log('Comprimento da senha:', shuffled.length);
  console.log('Contém @:', shuffled.includes('@') ? 'Sim' : 'Não');
  
  return shuffled;
};

// Login por telefone com senha temporária
exports.loginByPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ 
        error: 'Número de telefone é obrigatório',
        success: false
      });
    }

    console.log(`Tentando login com telefone: ${phone}`);
    
    // Buscar usuário pelo telefone (exatamente como recebido)
    const user = await User.findOne({ where: { phone } });
    
    // Se não encontrar com o formato exato, tente buscar sem o + (compatibilidade)
    if (!user && phone.startsWith('+')) {
      const phoneWithoutPlus = phone.substring(1);
      console.log(`Tentando buscar telefone sem o +: ${phoneWithoutPlus}`);
      const userWithoutPlus = await User.findOne({ where: { phone: phoneWithoutPlus } });
      
      if (userWithoutPlus) {
        console.log(`Usuário encontrado com telefone sem o +: ${phoneWithoutPlus}`);
        // Atualizar o telefone para incluir o + para futuras buscas
        await userWithoutPlus.update({ phone });
        return processLoginByPhone(userWithoutPlus, phone, res);
      }
    }

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado com este número de telefone',
        success: false
      });
    }
    
    return processLoginByPhone(user, phone, res);
  } catch (error) {
    console.error('Erro ao processar login por telefone:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar solicitação de senha temporária',
      success: false,
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

// Função auxiliar para processar login por telefone
const processLoginByPhone = async (user, phone, res) => {
  try {
    // Verificar se o usuário está ativo
    if (user.status !== 'active') {
      return res.status(401).json({ 
        error: 'Usuário inativo. Por favor, entre em contato com o suporte.',
        success: false
      });
    }

    // Gerar senha temporária segura (6 dígitos, letras, números, maiúsculas e um @)
    const tempPassword = generateSecurePassword();
    console.log('Senha temporária gerada para usuário:', user.id);
    
    // Hash da senha temporária
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    console.log('Hash da senha temporária gerado com sucesso');
    
    // Atualizar senha do usuário
    user.password = hashedPassword;
    await user.save();
    console.log('Senha temporária salva no banco de dados para usuário:', user.id);

    // Obter URL do webhook do .env
    const webhookUrl = process.env.PHONE_PASSWORD_WEBHOOK;
    
    if (!webhookUrl) {
      console.error('URL do webhook para senhas não configurada no .env');
      return res.status(500).json({ 
        error: 'Não foi possível enviar a senha temporária. Erro de configuração do servidor.',
        success: false
      });
    }

    // Verificar se o usuário tem email associado
    const hasEmail = user.email && user.email.trim() !== '';
    let loginMessage = '';
    
    if (hasEmail) {
      // Se o usuário tem email, informar que a senha pode ser usada com ambos
      loginMessage = `Sua senha temporária para acesso ao Educare: ${tempPassword}\nVálida por 30 minutos.\nVocê pode usar esta senha para entrar com seu email (${user.email}) ou telefone.`;
    } else {
      // Se não tem email, usar a mensagem padrão
      loginMessage = `Sua senha temporária para acesso ao Educare: ${tempPassword}\nVálida por 30 minutos.`;
    }

    // Enviar senha via webhook
    try {
      // Preparar dados para envio
      const webhookData = {
        phone: phone,
        message: loginMessage
      };
      
      console.log(`Enviando senha temporária para ${phone} via webhook POST`);
      
      // Usar a função auxiliar para enviar ao webhook
      const response = await sendToWebhook(process.env.PHONE_PASSWORD_WEBHOOK, webhookData);
      
      console.log(`Senha temporária enviada com sucesso para ${phone}`);
      
      // Verificar a senha gerada com o hash armazenado (teste de verificação)
      const verifyPassword = await bcrypt.compare(tempPassword, user.password);
      console.log('Verificação da senha temporária com o hash armazenado:', verifyPassword ? 'OK' : 'FALHA');
      
      let responseMessage = 'Senha temporária enviada com sucesso para o seu telefone';
      if (hasEmail) {
        responseMessage += `. Você pode usar esta senha para entrar com seu email (${user.email}) ou telefone.`;
      }
      
      // Definir hora de expiração (30 minutos a partir de agora)
      const expiresAt = new Date(Date.now() + 30 * 60000);
      
      return res.status(200).json({
        message: responseMessage,
        expiresAt: expiresAt,
        canUseWithEmail: hasEmail,
        email: hasEmail ? user.email : null,
        success: true // Adicionar campo success para compatibilidade com o frontend
      });
    } catch (error) {
      console.error('Erro ao enviar senha via webhook:', error);
      return res.status(500).json({ 
        error: 'Erro ao enviar senha temporária',
        success: false
      });
    }
  } catch (error) {
    console.error('Erro ao processar login por telefone:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar solicitação',
      success: false
    });
  }
};

// Gerar e enviar chave de verificação para telefone
exports.sendPhoneVerification = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Número de telefone é obrigatório' });
    }
    
    console.log(`Tentando verificar telefone: ${phone}`);

    // Gerar código de verificação de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Definir data de expiração (30 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Verificar se o telefone já está cadastrado (exatamente como recebido)
    let user = await User.findOne({ where: { phone } });
    
    // Se não encontrar com o formato exato, tente buscar sem o + (compatibilidade)
    if (!user && phone.startsWith('+')) {
      const phoneWithoutPlus = phone.substring(1);
      console.log(`Tentando buscar telefone sem o +: ${phoneWithoutPlus}`);
      user = await User.findOne({ where: { phone: phoneWithoutPlus } });
      
      if (user) {
        console.log(`Usuário encontrado com telefone sem o +: ${phoneWithoutPlus}`);
        // Atualizar o telefone para incluir o + para futuras buscas
        await user.update({ phone });
      }
    }

    if (user) {
      // Atualizar código de verificação para usuário existente
      user.phone_verification_code = verificationCode;
      user.phone_verification_expires = expiresAt;
      await user.save();
    } else {
      // Criar usuário temporário com telefone e código de verificação
      user = await User.create({
        phone,
        phone_verification_code: verificationCode,
        phone_verification_expires: expiresAt,
        status: 'pending',
        password: await bcrypt.hash(Math.random().toString(36), 10) // Senha temporária aleatória
      });
    }

    // Obter URL do webhook do .env
    const webhookUrl = process.env.PHONE_VERIFICATION_WEBHOOK;
    
    if (!webhookUrl) {
      return res.status(500).json({ error: 'URL do webhook não configurada' });
    }

    // Enviar código via webhook
    try {
      // Preparar dados para envio
      const webhookData = {
        phone: phone,
        message: `Seu código de verificação do Educare: ${verificationCode}\nVálido por 30 minutos.`
      };
      
      console.log(`Enviando código de verificação para ${phone} via webhook POST`);
      
      // Usar a função auxiliar para enviar ao webhook
      const response = await sendToWebhook(process.env.PHONE_VERIFICATION_WEBHOOK, webhookData);
      
      console.log(`Código de verificação enviado com sucesso para ${phone}`);
      
      return res.status(200).json({
        message: 'Código de verificação enviado com sucesso',
        expiresAt
      });
    } catch (error) {
      console.error('Erro ao enviar código via webhook:', error);
      return res.status(500).json({ error: 'Erro ao enviar código de verificação' });
    }
  } catch (error) {
    console.error('Erro ao gerar código de verificação:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
};

// Verificar código de telefone
exports.verifyPhoneCode = async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: 'Telefone e código são obrigatórios' });
    }
    
    console.log(`Verificando código para telefone: ${phone}`);

    // Buscar usuário pelo telefone (exatamente como recebido)
    let user = await User.findOne({ where: { phone } });
    
    // Se não encontrar com o formato exato, tente buscar sem o + (compatibilidade)
    if (!user && phone.startsWith('+')) {
      const phoneWithoutPlus = phone.substring(1);
      console.log(`Tentando buscar telefone sem o +: ${phoneWithoutPlus}`);
      user = await User.findOne({ where: { phone: phoneWithoutPlus } });
      
      if (user) {
        console.log(`Usuário encontrado com telefone sem o +: ${phoneWithoutPlus}`);
        // Atualizar o telefone para incluir o + para futuras buscas
        await user.update({ phone });
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se o código é válido e não expirou
    if (user.phone_verification_code !== code) {
      return res.status(400).json({ error: 'Código de verificação inválido' });
    }

    if (new Date() > new Date(user.phone_verification_expires)) {
      return res.status(400).json({ error: 'Código de verificação expirado' });
    }

    // Ativar usuário se estiver pendente
    if (user.status === 'pending') {
      user.status = 'active';
    }

    // Limpar código de verificação
    user.phone_verification_code = null;
    user.phone_verification_expires = null;
    await user.save();

    // Gerar token JWT
    const token = generateToken(user.id);
    const refreshToken = jwt.sign({ id: user.id }, authConfig.refreshSecret, {
      expiresIn: authConfig.refreshExpiresIn
    });

    return res.status(200).json({
      message: 'Telefone verificado com sucesso',
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Erro ao verificar código de telefone:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
};

// Renovar token JWT
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token é obrigatório' });
    }

    // Verificar e decodificar o refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(401).json({ error: 'Refresh token inválido ou expirado' });
    }

    // Buscar usuário
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se o usuário está ativo
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    // Gerar novos tokens
    const newToken = generateToken(user.id);
    const newRefreshToken = generateToken(user.id); // Por enquanto, mesmo token (pode ser melhorado)

    // Retornar dados do usuário (sem a senha) e novos tokens
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role
      },
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
};
