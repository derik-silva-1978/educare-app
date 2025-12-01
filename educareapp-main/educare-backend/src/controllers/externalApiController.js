const { SubscriptionPlan, User, Profile, Child, Subscription } = require('../models');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/external/subscription-plans:
 *   get:
 *     summary: Lista todos os planos de assinatura públicos e ativos
 *     tags: [API Externa]
 *     parameters:
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *     responses:
 *       200:
 *         description: Lista de planos de assinatura
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubscriptionPlan'
 *       401:
 *         description: API key inválida ou não fornecida
 *       500:
 *         description: Erro interno do servidor
 */
exports.getSubscriptionPlans = async (req, res) => {
  try {
    // Buscar apenas planos ativos e públicos
    const plans = await SubscriptionPlan.findAll({
      where: {
        is_active: true,
        is_public: true
      },
      order: [
        ['sort_order', 'ASC'],
        ['price', 'ASC']
      ]
    });

    // Mapear os dados para um formato mais amigável para API externa
    const formattedPlans = plans.map(plan => {
      const planData = plan.toJSON();
      
      return {
        id: planData.id,
        name: planData.name,
        description: planData.description,
        price: parseFloat(planData.price),
        currency: planData.currency,
        billing_cycle: planData.billing_cycle,
        trial_days: planData.trial_days,
        features: planData.features,
        limits: planData.limits
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedPlans
    });
  } catch (error) {
    console.error('Erro ao buscar planos de assinatura:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar planos de assinatura'
    });
  }
};

/**
 * @swagger
 * /api/external/users:
 *   get:
 *     summary: Lista usuários com seus dados de contato
 *     tags: [API Externa]
 *     parameters:
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email (opcional)
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filtrar por telefone (opcional)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, professional, admin, owner]
 *         description: Filtrar por papel/função (opcional)
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       role:
 *                         type: string
 *                       profile:
 *                         type: object
 *       401:
 *         description: API key inválida ou não fornecida
 *       500:
 *         description: Erro interno do servidor
 */
exports.getUsers = async (req, res) => {
  try {
    // Extrair parâmetros de consulta
    const { email, phone, role } = req.query;
    
    // Construir filtro
    const userFilter = {};
    if (email) userFilter.email = email;
    if (role) userFilter.role = role;
    
    // Construir filtro de perfil
    const profileFilter = {};
    if (phone) profileFilter.phone = phone;
    
    // Buscar usuários com seus perfis
    const users = await User.findAll({
      where: userFilter,
      include: [{
        model: Profile,
        as: 'profile',
        where: Object.keys(profileFilter).length > 0 ? profileFilter : undefined
      }],
      attributes: { 
        exclude: ['password', 'reset_token', 'reset_token_expires', 'phone_verification_code', 'phone_verification_expires'] 
      }
    });

    // Mapear os dados para um formato mais amigável para API externa
    const formattedUsers = users.map(user => {
      const userData = user.toJSON();
      
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        profile: userData.profile ? {
          id: userData.profile.id,
          name: userData.profile.name,
          phone: userData.profile.phone,
          type: userData.profile.type,
          address: userData.profile.address,
          city: userData.profile.city,
          state: userData.profile.state,
          country: userData.profile.country,
          zip_code: userData.profile.zip_code,
          profession: userData.profile.profession,
          specialization: userData.profile.specialization
        } : null
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuários'
    });
  }
};

/**
 * @swagger
 * /api/external/users/{id}:
 *   get:
 *     summary: Obtém dados de um usuário específico pelo ID
 *     tags: [API Externa]
 *     parameters:
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profile:
 *                       type: object
 *       401:
 *         description: API key inválida ou não fornecida
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar usuário pelo ID com seu perfil
    const user = await User.findByPk(id, {
      include: [{ model: Profile, as: 'profile' }],
      attributes: { 
        exclude: ['password', 'reset_token', 'reset_token_expires', 'phone_verification_code', 'phone_verification_expires'] 
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    const userData = user.toJSON();
    
    // Formatar dados para resposta
    const formattedUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: userData.status,
      profile: userData.profile ? {
        id: userData.profile.id,
        name: userData.profile.name,
        phone: userData.profile.phone,
        type: userData.profile.type,
        address: userData.profile.address,
        city: userData.profile.city,
        state: userData.profile.state,
        country: userData.profile.country,
        zip_code: userData.profile.zip_code,
        profession: userData.profile.profession,
        specialization: userData.profile.specialization
      } : null
    };

    return res.status(200).json({
      success: true,
      data: formattedUser
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuário'
    });
  }
};

/**
 * @swagger
 * /api/external/users/{id}/children:
 *   get:
 *     summary: Obtém os filhos associados a um usuário específico
 *     tags: [API Externa]
 *     parameters:
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de filhos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       birth_date:
 *                         type: string
 *                       gender:
 *                         type: string
 *                       age_months:
 *                         type: number
 *       401:
 *         description: API key inválida ou não fornecida
 *       404:
 *         description: Usuário não encontrado ou não possui filhos
 *       500:
 *         description: Erro interno do servidor
 */
exports.getUserChildren = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário existe
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    // Buscar o perfil do usuário
    const profile = await Profile.findOne({
      where: { userId: id }
    });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Perfil do usuário não encontrado'
      });
    }
    
    // Buscar os filhos associados ao perfil do usuário
    const children = await Child.findAll({
      where: { profileId: profile.id }
    });
    
    if (!children || children.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Usuário não possui filhos cadastrados'
      });
    }
    
    // Calcular idade em meses para cada criança
    const formattedChildren = children.map(child => {
      const childData = child.toJSON();
      
      // Calcular idade em meses se houver data de nascimento
      let ageMonths = null;
      if (childData.birth_date) {
        const birthDate = new Date(childData.birth_date);
        const today = new Date();
        const diffMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                          (today.getMonth() - birthDate.getMonth());
        ageMonths = diffMonths;
      }
      
      return {
        id: childData.id,
        name: childData.name,
        birth_date: childData.birth_date,
        gender: childData.gender,
        age_months: ageMonths,
        profile_id: childData.profileId,
        photo_url: childData.photo_url,
        created_at: childData.createdAt,
        updated_at: childData.updatedAt
      };
    });
    
    return res.status(200).json({
      success: true,
      data: formattedChildren
    });
  } catch (error) {
    console.error('Erro ao buscar filhos do usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar filhos do usuário'
    });
  }
};

/**
 * @swagger
 * /api/external/children/{id}:
 *   get:
 *     summary: Obtém dados de uma criança específica pelo ID
 *     tags: [API Externa]
 *     parameters:
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da criança
 *     responses:
 *       200:
 *         description: Dados da criança
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     birth_date:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     age_months:
 *                       type: number
 *       401:
 *         description: API key inválida ou não fornecida
 *       404:
 *         description: Criança não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
exports.getChildById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id);
    
    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Criança não encontrada'
      });
    }
    
    const childData = child.toJSON();
    
    // Calcular idade em meses se houver data de nascimento
    let ageMonths = null;
    if (childData.birth_date) {
      const birthDate = new Date(childData.birth_date);
      const today = new Date();
      const diffMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                        (today.getMonth() - birthDate.getMonth());
      ageMonths = diffMonths;
    }
    
    // Formatar dados para resposta
    const formattedChild = {
      id: childData.id,
      name: childData.name,
      birth_date: childData.birth_date,
      gender: childData.gender,
      age_months: ageMonths,
      profile_id: childData.profileId,
      photo_url: childData.photo_url,
      created_at: childData.createdAt,
      updated_at: childData.updatedAt
    };
    
    return res.status(200).json({
      success: true,
      data: formattedChild
    });
  } catch (error) {
    console.error('Erro ao buscar criança:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar criança'
    });
  }
};

/**
 * @swagger
 * /api/external/users:
 *   post:
 *     summary: Cria um novo usuário com perfil e assinatura (para integrações externas)
 *     tags: [API Externa]
 *     parameters:
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário (único)
 *                 example: "joao@example.com"
 *               phone:
 *                 type: string
 *                 description: Telefone do usuário (opcional)
 *                 example: "+5511999999999"
 *               cpf_cnpj:
 *                 type: string
 *                 description: CPF ou CNPJ do usuário (opcional)
 *                 example: "123.456.789-09"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "senha123"
 *               role:
 *                 type: string
 *                 enum: [user, professional]
 *                 default: user
 *                 description: Papel do usuário
 *               plan_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID do plano de assinatura (opcional)
 *               subscription_status:
 *                 type: string
 *                 enum: [active, trial]
 *                 default: active
 *                 description: Status da assinatura (active ou trial)
 *               trial_days:
 *                 type: integer
 *                 description: Quantidade de dias de trial (usado se subscription_status=trial, padrão do plano se não informado)
 *                 example: 7
 *               profile:
 *                 type: object
 *                 description: Dados adicionais do perfil (opcional)
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   zip_code:
 *                     type: string
 *                   profession:
 *                     type: string
 *                   specialization:
 *                     type: string
 *               external_id:
 *                 type: string
 *                 description: ID do usuário no sistema externo (para referência)
 *               metadata:
 *                 type: object
 *                 description: Metadados adicionais (JSON livre)
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     profile:
 *                       type: object
 *                     subscription:
 *                       type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou usuário já existe
 *       401:
 *         description: API key inválida
 *       500:
 *         description: Erro interno do servidor
 */
/**
 * @swagger
 * /api/external/users/search:
 *   get:
 *     summary: Busca usuário por telefone ou CPF/CNPJ com dados de assinatura
 *     tags: [API Externa]
 *     parameters:
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Telefone do usuário (exemplo +5511999999999)
 *       - in: query
 *         name: cpf_cnpj
 *         schema:
 *           type: string
 *         description: CPF ou CNPJ do usuário (exemplo 123.456.789-09)
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     profile:
 *                       type: object
 *                     subscription:
 *                       type: object
 *       400:
 *         description: Parâmetro de busca não fornecido
 *       401:
 *         description: API key inválida
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
exports.searchUser = async (req, res) => {
  try {
    logger.info('API Externa - Buscar Usuário');
    logger.debug('Query params', req.query);
    
    const { phone, cpf_cnpj } = req.query;
    
    // Validar que pelo menos um parâmetro foi fornecido
    if (!phone && !cpf_cnpj) {
      return res.status(400).json({
        success: false,
        error: 'Forneça pelo menos um parâmetro: phone ou cpf_cnpj'
      });
    }
    
    // Construir filtro de busca
    const whereClause = {};
    
    if (phone) {
      // Remover caracteres não numéricos do telefone para busca flexível
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      whereClause.phone = cleanPhone;
    }
    
    if (cpf_cnpj) {
      // Remover caracteres não numéricos do CPF/CNPJ para busca flexível
      const cleanCpfCnpj = cpf_cnpj.replace(/[^\d]/g, '');
      whereClause.cpf_cnpj = cleanCpfCnpj;
    }
    
    console.log('Buscando usuário com filtro:', whereClause);
    
    // Buscar usuário
    const user = await User.findOne({
      where: whereClause,
      attributes: { 
        exclude: ['password', 'reset_token', 'reset_token_expires', 'phone_verification_code', 'phone_verification_expires'] 
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
        search_params: { phone, cpf_cnpj }
      });
    }
    
    console.log('Usuário encontrado:', user.id);
    
    // Buscar perfil do usuário
    const profile = await Profile.findOne({
      where: { userId: user.id }
    });
    
    // Buscar assinatura ativa do usuário
    const subscription = await Subscription.findOne({
      where: { 
        userId: user.id,
        status: ['active', 'trial', 'pending']
      },
      include: [{
        model: SubscriptionPlan,
        as: 'plan',
        attributes: ['id', 'name', 'description', 'price', 'currency', 'billing_cycle', 'trial_days', 'features', 'limits']
      }],
      order: [['created_at', 'DESC']]
    });
    
    logger.debug('Assinatura', { found: !!subscription, id: subscription?.id });
    
    // Formatar resposta
    const userData = user.toJSON();
    
    const response = {
      success: true,
      data: {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          cpf_cnpj: userData.cpf_cnpj,
          role: userData.role,
          status: userData.status,
          email_verified: userData.email_verified,
          last_login: userData.last_login,
          created_at: userData.createdAt,
          updated_at: userData.updatedAt
        },
        profile: profile ? {
          id: profile.id,
          name: profile.name,
          phone: profile.phone,
          type: profile.type,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          zip_code: profile.zip_code,
          profession: profile.profession,
          specialization: profile.specialization
        } : null,
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          start_date: subscription.startDate,
          end_date: subscription.endDate,
          next_billing_date: subscription.nextBillingDate,
          last_billing_date: subscription.lastBillingDate,
          auto_renew: subscription.autoRenew,
          payment_method: subscription.paymentMethod,
          payment_details: subscription.paymentDetails,
          children_count: subscription.childrenCount,
          plan: subscription.plan ? {
            id: subscription.plan.id,
            name: subscription.plan.name,
            description: subscription.plan.description,
            price: parseFloat(subscription.plan.price),
            currency: subscription.plan.currency,
            billing_cycle: subscription.plan.billing_cycle,
            trial_days: subscription.plan.trial_days,
            features: subscription.plan.features,
            limits: subscription.plan.limits
          } : null
        } : null
      }
    };
    
    logger.info('Resposta preparada', { hasUser: true });
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuário',
      message: error.message
    });
  }
};

/**
 * @swagger
 * /api/external/users/search/children:
 *   get:
 *     summary: Busca crianças associadas a um usuário por telefone ou CPF/CNPJ
 *     tags: [API Externa]
 *     parameters:
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Telefone do usuário (exemplo +5511999999999)
 *       - in: query
 *         name: cpf_cnpj
 *         schema:
 *           type: string
 *         description: CPF ou CNPJ do usuário (exemplo 123.456.789-09)
 *     responses:
 *       200:
 *         description: Crianças encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     children:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Parâmetro de busca não fornecido
 *       401:
 *         description: API key inválida
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
exports.searchUserChildren = async (req, res) => {
  try {
    logger.info('API Externa - Buscar Crianças');
    logger.debug('Query params', req.query);
    
    const { phone, cpf_cnpj } = req.query;
    
    // Validar que pelo menos um parâmetro foi fornecido
    if (!phone && !cpf_cnpj) {
      return res.status(400).json({
        success: false,
        error: 'Forneça pelo menos um parâmetro: phone ou cpf_cnpj'
      });
    }
    
    // Construir filtro de busca
    const whereClause = {};
    
    if (phone) {
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      whereClause.phone = cleanPhone;
    }
    
    if (cpf_cnpj) {
      const cleanCpfCnpj = cpf_cnpj.replace(/[^\d]/g, '');
      whereClause.cpf_cnpj = cleanCpfCnpj;
    }
    
    console.log('Buscando usuário com filtro:', whereClause);
    
    // Buscar usuário
    const user = await User.findOne({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'phone', 'cpf_cnpj', 'role', 'status']
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
        search_params: { phone, cpf_cnpj }
      });
    }
    
    console.log('Usuário encontrado:', user.id);
    
    // Buscar perfil do usuário
    const profile = await Profile.findOne({
      where: { userId: user.id }
    });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Perfil do usuário não encontrado'
      });
    }
    
    logger.debug('Perfil encontrado', { profileId: profile.id });
    
    // Buscar crianças associadas ao perfil
    const children = await Child.findAll({
      where: { 
        profileId: profile.id,
        is_active: true
      },
      order: [['birth_date', 'DESC']]
    });
    
    console.log(`${children.length} criança(s) encontrada(s)`);
    
    // Calcular idade em meses para cada criança
    const formattedChildren = children.map(child => {
      const childData = child.toJSON();
      
      // Calcular idade em meses e anos
      let ageMonths = null;
      let ageYears = null;
      let ageDisplay = null;
      
      if (childData.birth_date) {
        const birthDate = new Date(childData.birth_date);
        const today = new Date();
        
        // Idade em meses
        ageMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                    (today.getMonth() - birthDate.getMonth());
        
        // Idade em anos
        ageYears = Math.floor(ageMonths / 12);
        const remainingMonths = ageMonths % 12;
        
        // Formato de exibição
        if (ageYears > 0) {
          ageDisplay = `${ageYears} ano${ageYears > 1 ? 's' : ''}`;
          if (remainingMonths > 0) {
            ageDisplay += ` e ${remainingMonths} ${remainingMonths > 1 ? 'meses' : 'mês'}`;
          }
        } else {
          ageDisplay = `${ageMonths} ${ageMonths > 1 ? 'meses' : 'mês'}`;
        }
      }
      
      return {
        id: childData.id,
        first_name: childData.first_name,
        last_name: childData.last_name,
        full_name: `${childData.first_name} ${childData.last_name}`,
        birth_date: childData.birth_date,
        age_months: ageMonths,
        age_years: ageYears,
        age_display: ageDisplay,
        gender: childData.gender,
        avatar_url: childData.avatar_url,
        notes: childData.notes,
        special_needs: childData.special_needs,
        medical_info: childData.medical_info,
        educational_info: childData.educational_info,
        development_milestones: childData.development_milestones,
        metadata: childData.metadata,
        created_at: childData.created_at,
        updated_at: childData.updated_at
      };
    });
    
    // Preparar resposta
    const response = {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          cpf_cnpj: user.cpf_cnpj,
          role: user.role,
          status: user.status
        },
        profile: {
          id: profile.id,
          name: profile.name,
          type: profile.type
        },
        children: formattedChildren,
        total_children: formattedChildren.length
      }
    };
    
    logger.info('Resposta preparada', { childrenCount: formattedChildren.length });
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Erro ao buscar crianças do usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar crianças do usuário',
      message: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    logger.info('API Externa - Criar Usuário');
    logger.debug('Dados recebidos', req.body);
    
    const { 
      name, 
      email, 
      phone, 
      cpf_cnpj,
      password, 
      role = 'user', 
      plan_id,
      subscription_status = 'active', // 'active' ou 'trial'
      trial_days, // Quantidade de dias de trial (opcional)
      profile: profileData,
      external_id,
      metadata
    } = req.body;
    
    // Validar campos obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: name, email, password'
      });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }
    
    // Verificar se o email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado',
        existing_user_id: existingUser.id
      });
    }
    
    // Verificar se o telefone já existe (se fornecido)
    if (phone) {
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          error: 'Telefone já cadastrado',
          existing_user_id: existingPhone.id
        });
      }
    }
    
    // Verificar se o CPF/CNPJ já existe (se fornecido)
    if (cpf_cnpj) {
      const existingCpfCnpj = await User.findOne({ where: { cpf_cnpj } });
      if (existingCpfCnpj) {
        return res.status(400).json({
          success: false,
          error: 'CPF/CNPJ já cadastrado',
          existing_user_id: existingCpfCnpj.id
        });
      }
    }
    
    // Validar plano se fornecido
    let plan = null;
    if (plan_id) {
      plan = await SubscriptionPlan.findByPk(plan_id);
      if (!plan) {
        return res.status(400).json({
          success: false,
          error: 'Plano de assinatura não encontrado'
        });
      }
    }
    
    // Criar usuário
    const user = await User.create({
      name,
      email,
      phone: phone || null,
      cpf_cnpj: cpf_cnpj || null,
      password, // Será hasheado automaticamente pelo hook do model
      role: role === 'parent' ? 'user' : role, // Mapear 'parent' para 'user'
      status: 'active', // Usuários criados via API externa são ativados automaticamente
      email_verified: true // Considerar email verificado
    });
    
    logger.info('Usuário criado', { userId: user.id });
    
    // Criar perfil
    const profile = await Profile.create({
      userId: user.id,
      name: name,
      phone: phone || null,
      type: role === 'professional' ? 'professional' : 'parent',
      address: profileData?.address || null,
      city: profileData?.city || null,
      state: profileData?.state || null,
      country: profileData?.country || 'BR',
      zip_code: profileData?.zip_code || null,
      profession: profileData?.profession || null,
      specialization: profileData?.specialization || null
    });
    
    logger.info('Perfil criado', { profileId: profile.id });
    
    // Criar assinatura se plano foi fornecido
    let subscription = null;
    if (plan) {
      const startDate = new Date();
      const endDate = new Date();
      
      // Determinar status da assinatura e calcular data de término
      let finalStatus = 'active';
      let finalTrialDays = 0;
      
      if (subscription_status === 'trial') {
        finalStatus = 'trial';
        
        // Usar trial_days fornecido ou o padrão do plano
        finalTrialDays = trial_days || plan.trial_days || 7;
        
        // Calcular data de término baseado nos dias de trial
        endDate.setDate(endDate.getDate() + finalTrialDays);
        
        logger.info('Assinatura trial criada', { trialDays: finalTrialDays });
      } else {
        // Assinatura ativa - calcular baseado no ciclo de cobrança
        if (plan.billing_cycle === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.billing_cycle === 'yearly') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else if (plan.billing_cycle === 'quarterly') {
          endDate.setMonth(endDate.getMonth() + 3);
        } else if (plan.billing_cycle === 'semester') {
          endDate.setMonth(endDate.getMonth() + 6);
        } else {
          // Padrão: 1 mês
          endDate.setMonth(endDate.getMonth() + 1);
        }
        
        logger.info('Assinatura ativa criada', { billingCycle: plan.billing_cycle });
      }
      
      // Calcular next_billing_date (data de término)
      const nextBillingDate = new Date(endDate);
      
      subscription = await Subscription.create({
        userId: user.id,
        planId: plan_id,
        status: finalStatus,
        startDate: startDate,
        endDate: endDate,
        lastBillingDate: startDate,
        nextBillingDate: nextBillingDate,
        autoRenew: true,
        paymentMethod: 'external', // Indicar que o pagamento é gerenciado externamente
        paymentDetails: {
          external_id: external_id || null,
          trial_days: finalTrialDays > 0 ? finalTrialDays : null,
          created_via: 'external_api'
        },
        usageStats: metadata || {}
      });
      
      logger.info('Assinatura criada', { subscriptionId: subscription.id, status: finalStatus });
    }
    
    // Preparar resposta
    const userData = user.toJSON();
    delete userData.password; // Remover senha da resposta
    
    const response = {
      success: true,
      data: {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          cpf_cnpj: userData.cpf_cnpj,
          role: userData.role,
          status: userData.status,
          created_at: userData.createdAt
        },
        profile: {
          id: profile.id,
          name: profile.name,
          phone: profile.phone,
          type: profile.type,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          zip_code: profile.zip_code,
          profession: profile.profession,
          specialization: profile.specialization
        },
        subscription: subscription ? {
          id: subscription.id,
          plan_id: subscription.planId,
          plan_name: plan.name,
          status: subscription.status,
          start_date: subscription.startDate,
          end_date: subscription.endDate,
          next_billing_date: subscription.nextBillingDate,
          auto_renew: subscription.autoRenew,
          trial_days: subscription.paymentDetails?.trial_days || null
        } : null
      },
      message: 'Usuário criado com sucesso'
    };
    
    logger.debug('Resposta preparada', { success: true });
    
    return res.status(201).json(response);
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
    // Tratamento de erros de validação do Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Erro de validação',
        details: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Erro ao criar usuário',
      message: error.message
    });
  }
};

/**
 * @swagger
 * /api/external/children/{childId}/unanswered-questions:
 *   get:
 *     summary: Busca perguntas ainda não respondidas para uma criança
 *     tags: [API Externa]
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da criança
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *     responses:
 *       200:
 *         description: Perguntas não respondidas encontradas
 *       404:
 *         description: Criança não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
exports.getUnansweredQuestions = async (req, res) => {
  try {
    logger.info('API Externa - Buscar Perguntas Não Respondidas');
    const { childId } = req.params;
    
    // Buscar criança
    const child = await Child.findByPk(childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Criança não encontrada'
      });
    }
    
    logger.info('Criança encontrada', { childId: child.id });
    
    // Calcular idade em meses
    const birthDate = new Date(child.birth_date);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                        (today.getMonth() - birthDate.getMonth());
    
    logger.debug('Idade da criança', { ageMonths: ageInMonths });
    
    // Buscar todas as perguntas para a idade
    const { JourneyQuestion } = require('../models');
    const { Op } = require('sequelize');
    const allQuestions = await JourneyQuestion.findAll({
      where: {
        meta_min_months: {
          [Op.lte]: ageInMonths
        },
        meta_max_months: {
          [Op.gte]: ageInMonths
        }
      },
      order: [['meta_min_months', 'ASC'], ['week', 'ASC']]
    });
    
    logger.debug('Perguntas disponíveis', { total: allQuestions.length });
    
    // Buscar respostas já dadas
    const { JourneyBotResponse } = require('../models');
    const answeredQuestions = await JourneyBotResponse.findAll({
      where: {
        child_id: childId
      },
      attributes: ['question_id']
    });
    
    const answeredIds = new Set(answeredQuestions.map(r => r.question_id));
    logger.debug('Perguntas respondidas', { count: answeredIds.size });
    
    // Filtrar perguntas não respondidas
    const unansweredQuestions = allQuestions.filter(q => !answeredIds.has(q.id));
    
    logger.info('Perguntas não respondidas', { count: unansweredQuestions.length });
    
    // Formatar resposta
    const formattedQuestions = unansweredQuestions.map(q => ({
      id: q.id,
      question_text: q.domain_question,
      domain: q.domain_name,
      importance: q.domain_importance,
      activities: q.domain_activities,
      week: q.week,
      week_title: q.week_title,
      week_description: q.week_description,
      age_range: {
        min_months: q.meta_min_months,
        max_months: q.meta_max_months
      },
      feedback_options: {
        positive: q.domain_feedback_1,
        neutral: q.domain_feedback_2,
        negative: q.domain_feedback_3
      },
      alert: q.domain_alert_missing
    }));
    
    return res.status(200).json({
      success: true,
      data: {
        child: {
          id: child.id,
          name: `${child.first_name} ${child.last_name}`,
          age_months: ageInMonths
        },
        total_questions: allQuestions.length,
        answered_questions: answeredIds.size,
        unanswered_questions: unansweredQuestions.length,
        questions: formattedQuestions
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar perguntas não respondidas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar perguntas não respondidas',
      message: error.message
    });
  }
};

/**
 * @swagger
 * /api/external/children/{childId}/save-answer:
 *   post:
 *     summary: Salva resposta de uma pergunta da jornada
 *     tags: [API Externa]
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da criança
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_id
 *               - answer
 *               - answer_text
 *             properties:
 *               question_id:
 *                 type: string
 *                 description: ID da pergunta
 *               answer:
 *                 type: integer
 *                 description: Resposta numérica (0=negativo, 1=neutro, 2=positivo)
 *               answer_text:
 *                 type: string
 *                 description: Texto da resposta
 *               metadata:
 *                 type: object
 *                 description: Metadados adicionais
 *     responses:
 *       201:
 *         description: Resposta salva com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Criança não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
exports.saveQuestionAnswer = async (req, res) => {
  try {
    logger.info('API Externa - Salvar Resposta');
    const { childId } = req.params;
    const { question_id, answer, answer_text, metadata } = req.body;
    
    // Validar campos obrigatórios
    if (!question_id || answer === undefined || !answer_text) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: question_id, answer, answer_text'
      });
    }
    
    // Buscar criança e perfil
    const child = await Child.findByPk(childId, {
      include: [{
        model: Profile,
        as: 'profile',
        include: [{
          model: User,
          as: 'user'
        }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Criança não encontrada'
      });
    }
    
    const userId = child.profile?.user?.id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        error: 'Usuário associado à criança não encontrado'
      });
    }
    
    console.log('Salvando resposta para criança:', child.first_name);
    console.log('Pergunta:', question_id);
    console.log('Resposta:', answer, '-', answer_text);
    
    // Verificar se já existe resposta para esta pergunta
    const { JourneyBotResponse } = require('../models');
    const existingResponse = await JourneyBotResponse.findOne({
      where: {
        child_id: childId,
        question_id: question_id
      }
    });
    
    let response;
    
    if (existingResponse) {
      // Atualizar resposta existente
      await existingResponse.update({
        answer: answer,
        answer_text: answer_text,
        responded_at: new Date()
      });
      response = existingResponse;
      console.log('Resposta atualizada');
    } else {
      // Criar nova resposta
      response = await JourneyBotResponse.create({
        user_id: userId,
        child_id: childId,
        question_id: question_id,
        answer: answer,
        answer_text: answer_text,
        responded_at: new Date()
      });
      console.log('Nova resposta criada');
    }
    
    // Atualizar progresso da sessão se existir
    const { JourneyBotSession } = require('../models');
    const activeSession = await JourneyBotSession.findOne({
      where: {
        child_id: childId,
        status: 'active'
      }
    });
    
    if (activeSession) {
      const answeredCount = await JourneyBotResponse.count({
        where: { child_id: childId }
      });
      
      await activeSession.update({
        answered_questions: answeredCount,
        status: answeredCount >= activeSession.total_questions ? 'completed' : 'active',
        completed_at: answeredCount >= activeSession.total_questions ? new Date() : null
      });
      
      console.log('Sessão atualizada:', answeredCount, '/', activeSession.total_questions);
    }
    
    return res.status(201).json({
      success: true,
      data: {
        id: response.id,
        child_id: response.child_id,
        question_id: response.question_id,
        answer: response.answer,
        answer_text: response.answer_text,
        responded_at: response.responded_at,
        created_at: response.created_at,
        updated_at: response.updated_at
      },
      message: 'Resposta salva com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao salvar resposta',
      message: error.message
    });
  }
};

/**
 * @swagger
 * /api/external/children/{childId}/progress:
 *   get:
 *     summary: Busca progresso da jornada de uma criança
 *     tags: [API Externa]
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da criança
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *     responses:
 *       200:
 *         description: Progresso encontrado
 *       404:
 *         description: Criança não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
/**
 * @swagger
 * /api/external/users/by-phone/{phone}/active-child:
 *   get:
 *     summary: Busca ou define criança ativa para um usuário (por telefone)
 *     tags: [API Externa]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Telefone do usuário
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *     responses:
 *       200:
 *         description: Criança ativa identificada
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
exports.getActiveChildByPhone = async (req, res) => {
  try {
    logger.info('API Externa - Buscar Criança Ativa');
    const { phone } = req.params;
    
    // Limpar telefone
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Buscar usuário
    const user = await User.findOne({
      where: { phone: cleanPhone },
      attributes: ['id', 'name', 'email', 'phone']
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
        phone: cleanPhone
      });
    }
    
    console.log('Usuário encontrado:', user.name);
    
    // Buscar perfil
    const profile = await Profile.findOne({
      where: { userId: user.id }
    });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Perfil não encontrado'
      });
    }
    
    // Buscar todas as crianças
    const children = await Child.findAll({
      where: { 
        profileId: profile.id,
        is_active: true
      },
      order: [['birth_date', 'DESC']] // Mais nova primeiro
    });
    
    if (children.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Nenhuma criança cadastrada',
        user: {
          id: user.id,
          name: user.name
        }
      });
    }
    
    console.log(`${children.length} criança(s) encontrada(s)`);
    
    // Calcular idade e progresso de cada criança
    const childrenWithDetails = await Promise.all(children.map(async (child) => {
      const birthDate = new Date(child.birth_date);
      const today = new Date();
      const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                          (today.getMonth() - birthDate.getMonth());
      
      // Buscar perguntas disponíveis para a idade
      const { JourneyQuestion } = require('../models');
      const { Op } = require('sequelize');
      const totalQuestions = await JourneyQuestion.count({
        where: {
          meta_min_months: { [Op.lte]: ageInMonths },
          meta_max_months: { [Op.gte]: ageInMonths }
        }
      });
      
      // Buscar respostas dadas
      const { JourneyBotResponse } = require('../models');
      const answeredQuestions = await JourneyBotResponse.count({
        where: { child_id: child.id }
      });
      
      const progressPercentage = totalQuestions > 0 
        ? Math.round((answeredQuestions / totalQuestions) * 100) 
        : 0;
      
      return {
        id: child.id,
        first_name: child.first_name,
        last_name: child.last_name,
        full_name: `${child.first_name} ${child.last_name}`,
        birth_date: child.birth_date,
        age_months: ageInMonths,
        age_display: formatAge(ageInMonths),
        gender: child.gender,
        avatar_url: child.avatar_url,
        progress: {
          total_questions: totalQuestions,
          answered_questions: answeredQuestions,
          unanswered_questions: totalQuestions - answeredQuestions,
          progress_percentage: progressPercentage
        }
      };
    }));
    
    // Lógica de seleção automática:
    // 1. Se só tem uma criança, retorna ela
    // 2. Se tem múltiplas, retorna a mais nova (primeira da lista)
    const activeChild = childrenWithDetails[0];
    
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        total_children: children.length,
        active_child: activeChild,
        all_children: childrenWithDetails,
        selection_logic: children.length === 1 
          ? 'única criança' 
          : 'criança mais nova selecionada automaticamente'
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar criança ativa:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar criança ativa',
      message: error.message
    });
  }
};

/**
 * @swagger
 * /api/external/users/by-phone/{phone}/select-child/{childId}:
 *   post:
 *     summary: Define criança ativa para um usuário
 *     tags: [API Externa]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Telefone do usuário
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da criança a ser selecionada
 *       - in: query
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: Chave de API para autenticação
 *     responses:
 *       200:
 *         description: Criança selecionada com sucesso
 *       404:
 *         description: Usuário ou criança não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
exports.selectChildByPhone = async (req, res) => {
  try {
    logger.info('API Externa - Selecionar Criança');
    const { phone, childId } = req.params;
    
    // Limpar telefone
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Buscar usuário
    const user = await User.findOne({
      where: { phone: cleanPhone }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    // Buscar perfil
    const profile = await Profile.findOne({
      where: { userId: user.id }
    });
    
    // Buscar criança e verificar se pertence ao usuário
    const child = await Child.findOne({
      where: {
        id: childId,
        profileId: profile.id,
        is_active: true
      }
    });
    
    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Criança não encontrada ou não pertence a este usuário'
      });
    }
    
    // Calcular idade
    const birthDate = new Date(child.birth_date);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                        (today.getMonth() - birthDate.getMonth());
    
    console.log(`Criança selecionada: ${child.first_name} (${ageInMonths} meses)`);
    
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone
        },
        selected_child: {
          id: child.id,
          first_name: child.first_name,
          last_name: child.last_name,
          full_name: `${child.first_name} ${child.last_name}`,
          age_months: ageInMonths,
          age_display: formatAge(ageInMonths)
        }
      },
      message: `Criança ${child.first_name} selecionada com sucesso`
    });
    
  } catch (error) {
    console.error('Erro ao selecionar criança:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao selecionar criança',
      message: error.message
    });
  }
};

/**
 * Função auxiliar para formatar idade
 */
function formatAge(ageInMonths) {
  if (ageInMonths < 12) {
    return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
  }
  
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  
  if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
  
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
}

exports.getChildProgress = async (req, res) => {
  try {
    logger.info('API Externa - Buscar Progresso');
    const { childId } = req.params;
    
    // Buscar criança
    const child = await Child.findByPk(childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Criança não encontrada'
      });
    }
    
    // Calcular idade em meses
    const birthDate = new Date(child.birth_date);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                        (today.getMonth() - birthDate.getMonth());
    
    // Buscar total de perguntas para a idade
    const { JourneyQuestion } = require('../models');
    const { Op } = require('sequelize');
    const totalQuestions = await JourneyQuestion.count({
      where: {
        meta_min_months: {
          [Op.lte]: ageInMonths
        },
        meta_max_months: {
          [Op.gte]: ageInMonths
        }
      }
    });
    
    // Buscar respostas dadas
    const { JourneyBotResponse } = require('../models');
    const answeredQuestions = await JourneyBotResponse.count({
      where: {
        child_id: childId
      }
    });
    
    // Buscar sessão ativa
    const { JourneyBotSession } = require('../models');
    const activeSession = await JourneyBotSession.findOne({
      where: {
        child_id: childId,
        status: ['active', 'completed']
      },
      order: [['created_at', 'DESC']]
    });
    
    // Calcular progresso
    const progressPercentage = totalQuestions > 0 
      ? Math.round((answeredQuestions / totalQuestions) * 100) 
      : 0;
    
    return res.status(200).json({
      success: true,
      data: {
        child: {
          id: child.id,
          name: `${child.first_name} ${child.last_name}`,
          age_months: ageInMonths
        },
        progress: {
          total_questions: totalQuestions,
          answered_questions: answeredQuestions,
          unanswered_questions: totalQuestions - answeredQuestions,
          progress_percentage: progressPercentage,
          status: progressPercentage === 100 ? 'completed' : 'in_progress'
        },
        session: activeSession ? {
          id: activeSession.id,
          status: activeSession.status,
          started_at: activeSession.created_at,
          completed_at: activeSession.completed_at
        } : null
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar progresso',
      message: error.message
    });
  }
};
