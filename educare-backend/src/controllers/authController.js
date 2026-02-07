const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Profile } = require('../models');
const authConfig = require('../config/auth');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const { normalizePhoneNumber, findUserByPhone } = require('../utils/phoneUtils');
const WhatsappService = require('../services/whatsappService');

// Função para gerar token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
    issuer: authConfig.issuer,
    audience: authConfig.audience
  });
};

// Registrar novo usuário
exports.register = async (req, res) => {
  try {
    console.log('=== REGISTRO - Dados recebidos ===');
    
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
      console.log('Senha temporária gerada para profissional (user registration)');
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
      const normalizedPhone = normalizePhoneNumber(phone);
      console.log(`Verificando se telefone já está em uso: ${phone} (normalizado: ${normalizedPhone})`);
      
      // Verificar telefone usando função de busca inteligente
      const phoneExists = await findUserByPhone(User, phone);
      
      if (phoneExists) {
        return res.status(400).json({ error: 'Telefone já está em uso' });
      }
    }

    // Criar usuário com telefone normalizado
    const phoneToSave = phone ? normalizePhoneNumber(phone) : null;
    const crypto = require('crypto');
    // Verificar se é criação por admin autenticado (não confiar apenas no header)
    let isAdminCreated = false;
    if (req.headers.authorization && (mappedRole === 'professional' || mappedRole === 'admin')) {
      try {
        const authToken = req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(authToken, authConfig.secret, {
          issuer: authConfig.issuer,
          audience: authConfig.audience
        });
        const creatorUser = await User.findByPk(decoded.id);
        if (creatorUser && (creatorUser.role === 'owner' || creatorUser.role === 'admin')) {
          isAdminCreated = true;
        }
      } catch (tokenErr) {
        // Token inválido - tratar como registro público
        isAdminCreated = false;
      }
    }
    const approvalToken = isAdminCreated ? null : crypto.randomBytes(24).toString('hex');
    const user = await User.create({
      email,
      phone: phoneToSave,
      password: finalPassword,
      name,
      role: isAdminCreated ? (mappedRole || 'user') : 'user',
      status: isAdminCreated ? 'active' : 'pending',
      reset_token: approvalToken,
      reset_token_expires: approvalToken ? new Date(Date.now() + 30 * 24 * 3600000) : null
    });

    // Criar perfil do usuário
    const profileData = {
      user_id: user.id,
      name: name,
      type: mappedRole === 'professional' ? 'professional' : 'parent',
      phone: phoneToSave
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
    if (isAdminCreated && mappedRole === 'professional' && !password) {
      response.temporaryPassword = finalPassword;
      response.message = 'Profissional criado com sucesso. Senha temporária gerada.';
    }

    // Notificar Owner via WhatsApp sobre novo registro
    const ownerPhone = process.env.OWNER_PHONE;
    if (ownerPhone && approvalToken) {
      try {
        let approvalBaseUrl = process.env.BACKEND_URL || process.env.FRONTEND_URL;
        if (!approvalBaseUrl && process.env.REPLIT_DOMAINS) {
          approvalBaseUrl = `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`;
        }
        if (!approvalBaseUrl) approvalBaseUrl = 'http://localhost:3001';

        const approvalLink = `${approvalBaseUrl}/api/auth/approve-user/${approvalToken}`;
        const roleLabel = { user: 'Pai/Mãe', professional: 'Profissional', admin: 'Administrador' };
        const notifMessage = `📋 *Novo Cadastro Educare+*\n\n` +
          `👤 *Nome:* ${name}\n` +
          `📧 *Email:* ${email || 'Não informado'}\n` +
          `📱 *Telefone:* ${phoneToSave || 'Não informado'}\n` +
          `🏷️ *Tipo:* ${roleLabel[mappedRole] || mappedRole || 'Pai/Mãe'}\n\n` +
          `✅ *Para aprovar o acesso, clique no link abaixo:*\n${approvalLink}\n\n` +
          `⏰ Link válido por 30 dias.`;

        WhatsappService.sendMessage(ownerPhone, notifMessage)
          .then(() => console.log(`Notificação de novo registro enviada ao Owner`))
          .catch(err => console.error(`Erro ao notificar Owner: ${err.message}`));
      } catch (notifError) {
        console.error('Erro ao preparar notificação ao Owner:', notifError.message);
      }
    }

    // Retornar dados do usuário
    if (!response.message) {
      response.message = isAdminCreated
        ? 'Usuário criado com sucesso.'
        : 'Cadastro realizado com sucesso! Aguarde a aprovação do seu acesso.';
    }
    response.pendingApproval = !isAdminCreated;
    return res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

// Aprovar acesso de usuário (via link de aprovação)
exports.approveUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token de aprovação inválido' });
    }

    const { Op } = require('sequelize');
    const user = await User.findOne({
      where: { reset_token: token }
    });

    const getFrontendUrl = () => {
      let baseUrl = process.env.FRONTEND_URL;
      if (!baseUrl && process.env.REPLIT_DOMAINS) {
        baseUrl = `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`;
      }
      return baseUrl || 'http://localhost:5173';
    };

    if (!user) {
      return res.redirect(`${getFrontendUrl()}/educare-app/auth/login?approved=invalid`);
    }

    if (user.status === 'active') {
      return res.redirect(`${getFrontendUrl()}/educare-app/auth/login?approved=already`);
    }

    if (user.reset_token_expires && new Date() > new Date(user.reset_token_expires)) {
      user.reset_token = null;
      user.reset_token_expires = null;
      await user.save();
      return res.redirect(`${getFrontendUrl()}/educare-app/auth/login?approved=expired`);
    }

    user.status = 'active';
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    console.log(`Usuário aprovado: ${user.name} (${user.email || user.phone})`);

    // Enviar mensagem de boas-vindas via WhatsApp
    if (user.phone) {
      try {
        const welcomeMessage = `🎉 *Bem-vindo(a) ao Educare+!*\n\n` +
          `Olá, *${user.name}*! 👋\n\n` +
          `Seu acesso à plataforma Educare+ foi aprovado com sucesso! ✅\n\n` +
          `Agora você pode acessar todos os recursos disponíveis para o seu perfil.\n\n` +
          `📱 Acesse a plataforma e faça login com suas credenciais.\n\n` +
          `Se precisar de ajuda, estamos aqui para você! 💙`;

        WhatsappService.sendMessage(user.phone, welcomeMessage)
          .then(() => console.log(`Mensagem de boas-vindas enviada para: ${user.phone}`))
          .catch(err => console.error(`Erro ao enviar boas-vindas: ${err.message}`));
      } catch (welcomeError) {
        console.error('Erro ao preparar mensagem de boas-vindas:', welcomeError.message);
      }
    }

    // Notificar Owner que a aprovação foi concluída
    const ownerPhone = process.env.OWNER_PHONE;
    if (ownerPhone) {
      const confirmMsg = `✅ *Acesso Aprovado*\n\n` +
        `Usuário *${user.name}* (${user.email || user.phone}) foi ativado com sucesso.`;
      WhatsappService.sendMessage(ownerPhone, confirmMsg)
        .catch(err => console.error(`Erro ao confirmar aprovação ao Owner: ${err.message}`));
    }

    // Redirecionar para a página de login com mensagem de sucesso
    return res.redirect(`${getFrontendUrl()}/educare-app/auth/login?approved=success&name=${encodeURIComponent(user.name)}`);
  } catch (error) {
    console.error('Erro ao aprovar usuário:', error);
    return res.status(500).json({ error: 'Erro ao aprovar usuário' });
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
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Seu cadastro está aguardando aprovação. Você receberá uma notificação no WhatsApp quando seu acesso for liberado.' });
    }
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Usuário inativo. Entre em contato com o suporte.' });
    }

    // Verificar senha
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

// Solicitar redefinição de senha (email)
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
    let baseUrl = process.env.FRONTEND_URL;
    if (!baseUrl && process.env.REPLIT_DOMAINS) {
      baseUrl = `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`;
    }
    if (!baseUrl) baseUrl = 'http://localhost:5173';
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

// Solicitar redefinição de senha (WhatsApp)
exports.forgotPasswordByPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ 
        error: 'Número de telefone é obrigatório',
        success: false
      });
    }
    
    console.log(`Solicitando redefinição de senha via WhatsApp para: ${phone}`);

    // Buscar usuário pelo telefone
    let user = await findUserByPhone(User, phone);

    if (!user) {
      // Por segurança, não informamos se o telefone existe ou não
      console.log(`Usuário não encontrado com o telefone: ${phone}`);
      return res.status(200).json({ 
        message: 'Se o telefone estiver cadastrado, você receberá instruções para redefinir sua senha via WhatsApp',
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

    // Construir a URL de redefinição de senha
    let baseUrl = process.env.FRONTEND_URL;
    if (!baseUrl && process.env.REPLIT_DOMAINS) {
      baseUrl = `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`;
    }
    if (!baseUrl) baseUrl = 'http://localhost:5173';
    const resetUrl = `${baseUrl}/educare-app/auth/reset-password?token=${resetToken}`;
    
    // Construir mensagem WhatsApp
    const message = `🔐 *Redefinição de Senha Educare+*\n\n` +
      `Clique no link abaixo para redefinir sua senha:\n\n` +
      `${resetUrl}\n\n` +
      `⏰ Este link é válido por 1 hora.\n` +
      `🔒 Se você não solicitou isso, ignore esta mensagem.`;
    
    // Enviar via WhatsApp
    try {
      const result = await WhatsappService.sendMessage(user.phone, message);
      
      console.log(`Mensagem de redefinição de senha enviada com sucesso para: ${user.phone}`);
      
      return res.status(200).json({
        message: 'Se o telefone estiver cadastrado, você receberá instruções para redefinir sua senha via WhatsApp',
        success: true
      });
    } catch (whatsappError) {
      console.error('Erro ao enviar mensagem WhatsApp:', whatsappError.message);
      
      // Mesmo com erro no WhatsApp, não informamos ao usuário
      return res.status(200).json({
        message: 'Se o telefone estiver cadastrado, você receberá instruções para redefinir sua senha via WhatsApp',
        success: true
      });
    }
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha via WhatsApp:', error);
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

    // Atualizar senha (o hook beforeUpdate do modelo faz o hash automaticamente)
    await user.update({ password: newPassword });

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
  
  console.log('Senha temporária gerada para recuperação de conta');
  
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

    // Normalizar o telefone para formato E.164
    const normalizedPhone = normalizePhoneNumber(phone);
    console.log(`Tentando login com telefone: ${phone} (normalizado: ${normalizedPhone})`);
    
    // Buscar usuário usando função que verifica múltiplos formatos
    const user = await findUserByPhone(User, phone);

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado com este número de telefone',
        success: false
      });
    }
    
    return processLoginByPhone(user, normalizedPhone, res);
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
    if (user.status === 'pending') {
      return res.status(403).json({ 
        error: 'Seu cadastro está aguardando aprovação. Você receberá uma notificação no WhatsApp quando seu acesso for liberado.',
        success: false
      });
    }
    if (user.status !== 'active') {
      return res.status(401).json({ 
        error: 'Usuário inativo. Entre em contato com o suporte.',
        success: false
      });
    }

    // Gerar senha temporária segura (6 dígitos, letras, números, maiúsculas e um @)
    const tempPassword = generateSecurePassword();
    console.log('Senha temporária gerada para usuário:', user.id);
    
    // Atualizar senha do usuário (o hook beforeUpdate do modelo faz o hash automaticamente)
    user.password = tempPassword;
    await user.save();
    console.log('Senha temporária salva no banco de dados para usuário:', user.id);

    // Verificar se o usuário tem email associado
    const hasEmail = user.email && user.email.trim() !== '';

    // Enviar senha via WhatsApp
    try {
      console.log(`Enviando senha temporária para ${phone} via WhatsApp`);
      
      const result = await WhatsappService.sendTemporaryPassword(phone, tempPassword, user.email);
      
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
        success: true
      });
    } catch (error) {
      console.error('Erro ao enviar senha via WhatsApp:', error.message);
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
    
    // Normalizar o telefone para formato E.164
    const normalizedPhone = normalizePhoneNumber(phone);
    console.log(`Tentando verificar telefone: ${phone} (normalizado: ${normalizedPhone})`);

    // Gerar código de verificação de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Definir data de expiração (30 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Verificar se o telefone já está cadastrado usando busca inteligente
    let user = await findUserByPhone(User, phone);

    if (user) {
      // Atualizar código de verificação para usuário existente
      user.phone_verification_code = verificationCode;
      user.phone_verification_expires = expiresAt;
      await user.save();
    } else {
      // Criar usuário temporário com telefone e código de verificação
      // (o hook beforeCreate do modelo faz o hash da senha automaticamente)
      user = await User.create({
        phone: normalizedPhone,
        phone_verification_code: verificationCode,
        phone_verification_expires: expiresAt,
        status: 'pending',
        name: 'Usuário Temporário',
        password: Math.random().toString(36).slice(-12) // Senha temporária aleatória (hash automático)
      });
    }

    // Enviar código via WhatsApp (usar telefone normalizado para garantir formato correto)
    try {
      console.log(`Enviando código de verificação para ${normalizedPhone} via WhatsApp`);
      
      const result = await WhatsappService.sendVerificationCode(normalizedPhone, verificationCode);
      
      return res.status(200).json({
        message: 'Código de verificação enviado com sucesso',
        expiresAt
      });
    } catch (error) {
      console.error('Erro ao enviar código via WhatsApp:', error.message);
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
    
    // Normalizar telefone e buscar usando função inteligente
    const normalizedPhone = normalizePhoneNumber(phone);
    console.log(`Verificando código para telefone: ${phone} (normalizado: ${normalizedPhone})`);

    // Buscar usuário pelo telefone usando busca inteligente
    let user = await findUserByPhone(User, phone);

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
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Seu cadastro está aguardando aprovação. Você receberá uma notificação no WhatsApp quando seu acesso for liberado.' });
    }
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Usuário inativo. Entre em contato com o suporte.' });
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

// Login com Google OAuth
exports.googleLogin = async (req, res) => {
  try {
    const { email, name, picture, googleId, credential } = req.body;
    
    console.log('Google login attempt:', { email, name, googleId });
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório para login com Google' });
    }

    // Verificar se o usuário já existe
    let user = await User.findOne({ where: { email } });

    if (user) {
      // Usuário existe - fazer login
      // Atualizar último login
      await user.update({ last_login: new Date() });
      console.log(`Usuário existente logado via Google: ${email}`);
    } else {
      // Criar novo usuário (o hook beforeCreate do modelo faz o hash automaticamente)
      const randomPassword = Math.random().toString(36).slice(-16);

      user = await User.create({
        email,
        name: name || email.split('@')[0],
        password: randomPassword,
        role: 'user',
        status: 'active',
        email_verified: true, // Email do Google já é verificado
        last_login: new Date()
      });

      // Criar perfil para o usuário
      await Profile.create({
        user_id: user.id,
        name: name || email.split('@')[0],
        type: 'parent',
        is_primary: true
      });

      console.log(`Novo usuário criado via Google: ${email}`);
    }

    // Gerar tokens
    const token = generateToken(user.id);
    const refreshToken = generateToken(user.id);

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Erro no login com Google:', error);
    return res.status(500).json({ error: 'Erro ao processar login com Google' });
  }
};
