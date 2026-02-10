const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Profile } = require('../models');
const authConfig = require('../config/auth');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const { normalizePhoneNumber, findUserByPhone } = require('../utils/phoneUtils');
const WhatsappService = require('../services/whatsappService');
const { shortenMultiple, shortenUrl } = require('../utils/urlShortener');

// Função para gerar token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
    issuer: authConfig.issuer,
    audience: authConfig.audience
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId, type: 'refresh' }, authConfig.refreshSecret, {
    expiresIn: authConfig.refreshExpiresIn,
    issuer: authConfig.issuer,
    audience: authConfig.audience
  });
};

const validatePasswordStrength = (password) => {
  if (!password) return { valid: false, message: 'Senha é obrigatória' };
  if (password.length < authConfig.passwordPolicy.minLength) {
    return { valid: false, message: `Senha deve ter no mínimo ${authConfig.passwordPolicy.minLength} caracteres` };
  }
  if (password.length > authConfig.passwordPolicy.maxLength) {
    return { valid: false, message: `Senha deve ter no máximo ${authConfig.passwordPolicy.maxLength} caracteres` };
  }
  return { valid: true };
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

    // Verificar se email, telefone e nome foram fornecidos
    if (!email || !phone || !name) {
      return res.status(400).json({ error: 'É necessário fornecer nome, email e telefone' });
    }

    // Mapear role 'parent' para 'user' (compatibilidade com ENUM do banco)
    const mappedRole = role === 'parent' ? 'user' : role;
    
    // Gerar senha temporária se não fornecida (para profissionais criados pelo admin)
    let finalPassword = password;
    if (!password && mappedRole === 'professional' && req.headers.authorization) {
      // Gerar senha temporária de 16 caracteres
      const crypto2 = require('crypto');
      finalPassword = crypto2.randomBytes(12).toString('base64url').slice(0, 16);
      console.log('Senha temporária gerada para profissional (user registration)');
    }
    
    // Verificar se temos senha (fornecida ou gerada)
    if (!finalPassword) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    const pwCheck = validatePasswordStrength(finalPassword);
    if (!pwCheck.valid) {
      return res.status(400).json({ error: pwCheck.message });
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
    const refreshToken = generateRefreshToken(user.id);

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
        let approvalBaseUrl = '';
        if (process.env.REPLIT_DOMAINS) {
          approvalBaseUrl = `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`;
        } else if (process.env.BACKEND_URL) {
          approvalBaseUrl = process.env.BACKEND_URL.replace(/\/$/, '');
        } else if (process.env.FRONTEND_URL) {
          approvalBaseUrl = process.env.FRONTEND_URL.replace(/\/educare-app$/, '');
        }
        if (!approvalBaseUrl) approvalBaseUrl = 'http://localhost:5000';

        const rawLink7 = `${approvalBaseUrl}/api/auth/approve-user/${approvalToken}?days=7`;
        const rawLink14 = `${approvalBaseUrl}/api/auth/approve-user/${approvalToken}?days=14`;
        const rawLink30 = `${approvalBaseUrl}/api/auth/approve-user/${approvalToken}?days=30`;

        const [link7, link14, link30] = await shortenMultiple([rawLink7, rawLink14, rawLink30]);

        const roleLabel = { user: 'Pai/Mãe', professional: 'Profissional', admin: 'Administrador' };

        let planLabel = 'Plano Gratuito';
        if (selectedPlanId) {
          try {
            const selectedPlan = await SubscriptionPlan.findByPk(selectedPlanId);
            if (selectedPlan) planLabel = selectedPlan.name;
          } catch (e) { /* ignore */ }
        }

        const notifMessage = `📋 *Novo Cadastro Educare+*\n\n` +
          `👤 *Nome:* ${name}\n` +
          `📧 *Email:* ${email || 'Não informado'}\n` +
          `📱 *Telefone:* ${phoneToSave || 'Não informado'}\n` +
          `🏷️ *Tipo:* ${roleLabel[mappedRole] || mappedRole || 'Pai/Mãe'}\n` +
          `📦 *Plano:* ${planLabel}\n\n` +
          `✅ *Selecione o período de acesso gratuito:*\n\n` +
          `▶️ *7 dias:* ${link7}\n\n` +
          `▶️ *14 dias:* ${link14}\n\n` +
          `▶️ *30 dias:* ${link30}\n\n` +
          `⏰ Links válidos por 30 dias.`;

        WhatsappService.sendMessage(ownerPhone, notifMessage)
          .then(() => console.log(`Notificação de novo registro enviada ao Owner`))
          .catch(err => console.error(`Erro ao notificar Owner: ${err.message}`));
      } catch (notifError) {
        console.error('Erro ao preparar notificação ao Owner:', notifError.message);
      }
    }

    // Enviar confirmação de cadastro ao próprio usuário via WhatsApp
    if (phoneToSave) {
      try {
        const userConfirmMessage = `✅ *Cadastro Recebido - Educare+*\n\n` +
          `Olá, *${name}*! 👋\n\n` +
          `Seu cadastro na plataforma *Educare+* foi recebido com sucesso!\n\n` +
          `📋 *Status:* Aguardando aprovação\n` +
          `📧 *Email:* ${email || 'Não informado'}\n\n` +
          `Assim que seu acesso for aprovado, você receberá uma notificação aqui no WhatsApp.\n\n` +
          `Enquanto isso, se tiver dúvidas, estamos à disposição! 💜\n\n` +
          `_Equipe Educare+_`;

        WhatsappService.sendMessage(phoneToSave, userConfirmMessage)
          .then(() => console.log(`Confirmação de cadastro enviada ao usuário: ${phoneToSave}`))
          .catch(err => console.error(`Erro ao enviar confirmação ao usuário: ${err.message}`));
      } catch (userNotifError) {
        console.error('Erro ao preparar confirmação ao usuário:', userNotifError.message);
      }
    }

    // Retornar dados do usuário
    if (!response.message) {
      response.message = isAdminCreated
        ? 'Usuário criado com sucesso.'
        : 'Cadastro realizado com sucesso! Aguarde a aprovação do seu acesso.';
    }
    response.success = true;
    response.pendingApproval = !isAdminCreated;
    
    console.log('=== REGISTRO - Resposta enviada ===');
    console.log('pendingApproval:', response.pendingApproval);
    console.log('user.id:', response.user?.id);
    console.log('user.status:', user.status);
    console.log('isAdminCreated:', isAdminCreated);
    
    return res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    const errorDetail = process.env.NODE_ENV === 'production' 
      ? error.message 
      : error.stack;
    return res.status(500).json({ error: 'Erro ao registrar usuário', detail: errorDetail });
  }
};

// Gerar página HTML de resposta para aprovação
const approvalHtmlPage = (title, emoji, message, details, color) => {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Educare+</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%); padding: 20px; }
    .card { background: white; border-radius: 16px; padding: 40px 32px; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .emoji { font-size: 64px; margin-bottom: 16px; }
    .title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 12px; }
    .message { font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 20px; }
    .details { background: #f7fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left; }
    .detail-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .detail-label { color: #718096; }
    .detail-value { color: #2d3748; font-weight: 600; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; color: white; background: ${color}; }
    .footer { margin-top: 20px; font-size: 13px; color: #a0aec0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">${emoji}</div>
    <div class="title">${title}</div>
    <div class="message">${message}</div>
    ${details}
    <div class="footer">Educare+ &copy; ${new Date().getFullYear()}</div>
  </div>
</body>
</html>`;
};

// Aprovar acesso de usuário (via link de aprovação)
exports.approveUser = async (req, res) => {
  try {
    const { token } = req.params;
    const days = parseInt(req.query.days) || 30;
    const validDays = [7, 14, 30].includes(days) ? days : 30;

    if (!token) {
      return res.status(400).send(approvalHtmlPage(
        'Link Inválido', '⚠️',
        'O link de aprovação é inválido. Verifique se copiou o link completo.',
        '', '#e53e3e'
      ));
    }

    const user = await User.findOne({
      where: { reset_token: token }
    });

    if (!user) {
      return res.status(404).send(approvalHtmlPage(
        'Link Inválido', '❌',
        'Este link de aprovação não foi encontrado ou já foi utilizado.',
        '', '#e53e3e'
      ));
    }

    if (user.status === 'active') {
      return res.status(200).send(approvalHtmlPage(
        'Já Aprovado', '✅',
        `O usuário ${user.name} já teve seu acesso aprovado anteriormente.`,
        `<div class="details">
          <div class="detail-row"><span class="detail-label">Nome</span><span class="detail-value">${user.name}</span></div>
          <div class="detail-row"><span class="detail-label">Contato</span><span class="detail-value">${user.email || user.phone}</span></div>
        </div>
        <span class="badge" style="background:#38a169">Já Ativo</span>`,
        '#38a169'
      ));
    }

    if (user.reset_token_expires && new Date() > new Date(user.reset_token_expires)) {
      user.reset_token = null;
      user.reset_token_expires = null;
      await user.save();
      return res.status(410).send(approvalHtmlPage(
        'Link Expirado', '⏰',
        'Este link de aprovação expirou. O usuário precisará solicitar um novo cadastro.',
        '', '#dd6b20'
      ));
    }

    user.status = 'active';
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    const { Subscription } = require('../models');
    const subscription = await Subscription.findOne({ where: { userId: user.id } });
    let subscriptionInfo = '';
    if (subscription) {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + validDays);
      subscription.status = 'trial';
      subscription.startDate = now;
      subscription.endDate = endDate;
      subscription.nextBillingDate = endDate;
      await subscription.save();

      const formattedEnd = endDate.toLocaleDateString('pt-BR');
      subscriptionInfo = `
        <div class="detail-row"><span class="detail-label">Período liberado</span><span class="detail-value">${validDays} dias</span></div>
        <div class="detail-row"><span class="detail-label">Válido até</span><span class="detail-value">${formattedEnd}</span></div>
      `;
    }

    console.log(`Usuário aprovado: ${user.name} (${user.email || user.phone}) - ${validDays} dias de acesso`);

    if (user.phone) {
      try {
        let loginUrl = '';
        if (process.env.BACKEND_URL) {
          loginUrl = `${process.env.BACKEND_URL.replace(/\/$/, '')}/educare-app/auth/login`;
        } else if (process.env.REPLIT_DOMAINS) {
          loginUrl = `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/educare-app/auth/login`;
        } else if (process.env.FRONTEND_URL) {
          loginUrl = `${process.env.FRONTEND_URL}/auth/login`;
        } else {
          loginUrl = 'http://localhost:5000/educare-app/auth/login';
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + validDays);
        const formattedEnd = endDate.toLocaleDateString('pt-BR');

        const shortLoginUrl = await shortenUrl(loginUrl);

        const welcomeMessage = `🎉 *Bem-vindo(a) ao Educare+!*\n\n` +
          `Olá, *${user.name}*! 👋\n\n` +
          `Seu acesso à plataforma Educare+ foi *aprovado com sucesso*! ✅\n\n` +
          `📅 *Período de acesso:* ${validDays} dias (até ${formattedEnd})\n\n` +
          `Agora você tem acesso a diversas funcionalidades:\n\n` +
          `🧒 *Acompanhamento do Desenvolvimento*\n` +
          `🤖 *TitiNauta (Assistente IA)*\n` +
          `🤰 *Saúde Materna*\n` +
          `📊 *Relatórios Inteligentes*\n` +
          `📚 *Jornada do Desenvolvimento*\n` +
          `💉 *Vacinas e Crescimento*\n\n` +
          `🔗 *Acesse a plataforma agora:*\n${shortLoginUrl}\n\n` +
          `Faça login com o e-mail e senha que você cadastrou.\n\n` +
          `Qualquer dúvida, estamos aqui para ajudar! 💙`;

        WhatsappService.sendMessage(user.phone, welcomeMessage)
          .then(() => console.log(`Mensagem de boas-vindas enviada para: ${user.phone}`))
          .catch(err => console.error(`Erro ao enviar boas-vindas: ${err.message}`));
      } catch (welcomeError) {
        console.error('Erro ao preparar mensagem de boas-vindas:', welcomeError.message);
      }
    }

    const ownerPhone = process.env.OWNER_PHONE;
    if (ownerPhone) {
      const confirmMsg = `✅ *Acesso Aprovado*\n\n` +
        `Usuário *${user.name}* (${user.email || user.phone}) foi ativado com sucesso.\n` +
        `📅 Período: ${validDays} dias`;
      WhatsappService.sendMessage(ownerPhone, confirmMsg)
        .catch(err => console.error(`Erro ao confirmar aprovação ao Owner: ${err.message}`));
    }

    return res.status(200).send(approvalHtmlPage(
      'Acesso Aprovado!', '🎉',
      `O acesso de ${user.name} foi aprovado com sucesso. Uma mensagem de boas-vindas foi enviada.`,
      `<div class="details">
        <div class="detail-row"><span class="detail-label">Nome</span><span class="detail-value">${user.name}</span></div>
        <div class="detail-row"><span class="detail-label">Contato</span><span class="detail-value">${user.email || user.phone || 'N/A'}</span></div>
        ${subscriptionInfo}
      </div>
      <span class="badge">Aprovado</span>`,
      '#7c3aed'
    ));
  } catch (error) {
    console.error('Erro ao aprovar usuário:', error);
    return res.status(500).send(approvalHtmlPage(
      'Erro no Sistema', '⚠️',
      'Ocorreu um erro ao processar a aprovação. Tente novamente mais tarde.',
      '', '#e53e3e'
    ));
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
      user = await findUserByPhone(User, phone, {
        include: [{ model: Profile, as: 'profile' }]
      });
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
    const refreshToken = generateRefreshToken(user.id);

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

    const pwCheck = validatePasswordStrength(password);
    if (!pwCheck.valid) {
      return res.status(400).json({ error: pwCheck.message, success: false });
    }

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
  const crypto = require('crypto');
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '@';
  
  const randomChar = (chars) => chars.charAt(crypto.randomInt(chars.length));
  
  let password = '';
  password += randomChar(uppercaseChars);
  password += randomChar(uppercaseChars);
  password += specialChars;
  password += randomChar(numberChars);
  password += randomChar(lowercaseChars);
  
  const allChars = uppercaseChars + lowercaseChars + numberChars;
  const remainingLength = 8 - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += randomChar(allChars);
  }
  
  const arr = password.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr.join('');
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
    const verificationCode = String(require('crypto').randomInt(100000, 999999));
    
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
        password: require('crypto').randomBytes(12).toString('base64url')
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
    const refreshToken = generateRefreshToken(user.id);

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
      decoded = jwt.verify(refreshToken, authConfig.refreshSecret, {
        issuer: authConfig.issuer,
        audience: authConfig.audience
      });
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
    const newRefreshToken = generateRefreshToken(user.id);

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
      const randomPassword = require('crypto').randomBytes(16).toString('base64url');

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
    const refreshToken = generateRefreshToken(user.id);

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
