const { User, Profile, Subscription, SubscriptionPlan, Team, TeamMember, Child, BiometricsLog, SleepLog, VaccineHistory, Appointment } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const SBP_VACCINE_CALENDAR = [
  { vaccine: 'BCG', weeks: 0, dose: 1 },
  { vaccine: 'Hepatite B', weeks: 0, dose: 1 },
  { vaccine: 'Pentavalente (DTP+Hib+HB)', weeks: 8, dose: 1 },
  { vaccine: 'VIP (Polio inativada)', weeks: 8, dose: 1 },
  { vaccine: 'Pneumocócica 10V', weeks: 8, dose: 1 },
  { vaccine: 'Rotavírus', weeks: 8, dose: 1 },
  { vaccine: 'Meningocócica C', weeks: 12, dose: 1 },
  { vaccine: 'Pentavalente (DTP+Hib+HB)', weeks: 16, dose: 2 },
  { vaccine: 'VIP (Polio inativada)', weeks: 16, dose: 2 },
  { vaccine: 'Pneumocócica 10V', weeks: 16, dose: 2 },
  { vaccine: 'Rotavírus', weeks: 16, dose: 2 },
  { vaccine: 'Meningocócica C', weeks: 20, dose: 2 },
  { vaccine: 'Pentavalente (DTP+Hib+HB)', weeks: 24, dose: 3 },
  { vaccine: 'VIP (Polio inativada)', weeks: 24, dose: 3 },
  { vaccine: 'Febre Amarela', weeks: 36, dose: 1 },
  { vaccine: 'Tríplice Viral (SCR)', weeks: 52, dose: 1 },
  { vaccine: 'Pneumocócica 10V', weeks: 52, dose: 'reforço' },
  { vaccine: 'Meningocócica C', weeks: 52, dose: 'reforço' },
  { vaccine: 'DTP', weeks: 60, dose: 'reforço 1' },
  { vaccine: 'VOP (Polio oral)', weeks: 60, dose: 'reforço 1' },
  { vaccine: 'Hepatite A', weeks: 60, dose: 1 },
  { vaccine: 'Tetra Viral (SCRV)', weeks: 60, dose: 1 },
  { vaccine: 'DTP', weeks: 208, dose: 'reforço 2' },
  { vaccine: 'VOP (Polio oral)', weeks: 208, dose: 'reforço 2' }
];

// Métricas do dashboard do usuário (parent/professional)
exports.getUserDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Buscar perfil do usuário
    const profile = await Profile.findOne({ where: { userId } });
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    // Buscar crianças do usuário
    const children = await Child.findAll({
      where: { profileId: profile.id },
      order: [['createdAt', 'DESC']]
    });
    
    // Para cada criança, calcular métricas básicas
    const childrenWithProgress = children.map(child => {
      // Simular progresso (em produção, seria calculado baseado em sessões/respostas)
      const calculatedProgress = Math.floor(Math.random() * 100);
      const sessionCount = Math.floor(Math.random() * 10);
      const reportCount = Math.floor(Math.random() * 5);
      const responseCount = Math.floor(Math.random() * 20);
      const hasActiveSession = Math.random() > 0.7;
      
      return {
        ...child.toJSON(),
        calculatedProgress,
        sessionCount,
        reportCount,
        responseCount,
        hasActiveSession
      };
    });
    
    // Calcular métricas gerais
    const totalChildren = children.length;
    const childrenInProgress = childrenWithProgress.filter(c => c.calculatedProgress > 0 && c.calculatedProgress < 100).length;
    const completedJourneys = childrenWithProgress.filter(c => c.calculatedProgress >= 100).length;
    const totalSessions = childrenWithProgress.reduce((sum, c) => sum + c.sessionCount, 0);
    const activeSessions = childrenWithProgress.filter(c => c.hasActiveSession).length;
    const completedSessions = totalSessions - activeSessions;
    const totalReports = childrenWithProgress.reduce((sum, c) => sum + c.reportCount, 0);
    const averageProgress = totalChildren > 0 ? 
      Math.round(childrenWithProgress.reduce((sum, c) => sum + c.calculatedProgress, 0) / totalChildren) : 0;
    
    // Buscar assinatura do usuário (se for parent)
    let subscription = null;
    if (userRole === 'parent' || userRole === 'user') {
      subscription = await Subscription.findOne({
        where: { 
          userId, 
          status: ['active', 'trial'] 
        },
        include: [{ model: SubscriptionPlan, as: 'plan' }]
      });
    }
    
    const metrics = {
      totalChildren,
      childrenInProgress,
      completedJourneys,
      totalSessions,
      activeSessions,
      completedSessions,
      totalReports,
      averageProgress,
      childrenWithProgress
    };
    
    const rawData = {
      children: childrenWithProgress,
      sessions: [], // Será implementado quando criarmos o modelo Session
      responses: [], // Será implementado quando criarmos o modelo Response
      reports: [], // Será implementado quando criarmos o modelo Report
      subscription,
      professionalRelations: [] // Para profissionais
    };
    
    return res.status(200).json({
      metrics,
      rawData
    });
    
  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard do usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar métricas do dashboard' });
  }
};

// Métricas principais do dashboard (admin/owner)
exports.getMetrics = async (req, res) => {
  try {
    // Total de usuários
    const totalUsers = await User.count();

    // Novos usuários hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.count({
      where: {
        created_at: {
          [Op.gte]: today
        }
      }
    });

    // Assinaturas ativas
    const activeSubscriptions = await Subscription.count({
      where: {
        status: 'active'
      }
    });

    // Receita mensal (simulada - pode ser calculada com query mais simples)
    const monthlyRevenue = activeSubscriptions * 29.90; // Valor médio simulado

    // Taxa de churn (cancelamentos no último mês)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const canceledSubscriptions = await Subscription.count({
      where: {
        status: 'canceled',
        canceledAt: {
          [Op.gte]: lastMonth
        }
      }
    });

    const churnRate = totalUsers > 0 ? ((canceledSubscriptions / totalUsers) * 100) : 0;

    // Taxa de conversão (assinaturas ativas / total de usuários)
    const conversionRate = totalUsers > 0 ? ((activeSubscriptions / totalUsers) * 100) : 0;

    // Saúde do sistema (simulada - pode ser baseada em métricas reais)
    const systemHealth = 99.5; // Pode ser calculada baseada em uptime, erros, etc.
    const uptime = 99.9;

    res.json({
      totalUsers,
      activeSubscriptions,
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      churnRate: parseFloat(churnRate.toFixed(2)),
      systemHealth,
      newUsersToday,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      uptime
    });
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Métricas dos planos de assinatura
exports.getSubscriptionPlanMetrics = async (req, res) => {
  try {
    // Buscar todos os planos
    const allPlans = await SubscriptionPlan.findAll({
      order: [['sort_order', 'ASC']]
    });

    // Para cada plano, contar assinantes e calcular receita
    const plans = [];
    for (const plan of allPlans) {
      const subscriberCount = await Subscription.count({
        where: {
          planId: plan.id,
          status: 'active'
        }
      });

      const revenue = subscriberCount * parseFloat(plan.price);
      const growthPercentage = Math.random() * 20 - 5; // Simulado

      plans.push({
        planName: plan.name,
        subscriberCount,
        revenue,
        growthPercentage
      });
    }

    res.json({ plans });
  } catch (error) {
    console.error('Erro ao buscar métricas dos planos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Dados de crescimento de usuários
exports.getUserGrowthData = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userGrowth = await User.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'users']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']]
    });

    const subscriptionGrowth = await Subscription.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'subscriptions']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']]
    });

    // Combinar dados de usuários e assinaturas
    const growthData = [];
    const userMap = new Map();
    const subscriptionMap = new Map();

    userGrowth.forEach(item => {
      userMap.set(item.dataValues.date, parseInt(item.dataValues.users));
    });

    subscriptionGrowth.forEach(item => {
      subscriptionMap.set(item.dataValues.date, parseInt(item.dataValues.subscriptions));
    });

    // Gerar dados para todos os dias no período
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      growthData.push({
        date: dateStr,
        users: userMap.get(dateStr) || 0,
        subscriptions: subscriptionMap.get(dateStr) || 0
      });
    }

    res.json({ growth: growthData });
  } catch (error) {
    console.error('Erro ao buscar dados de crescimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Estatísticas gerais do sistema
exports.getSystemStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalPlans,
      activePlans,
      totalTeams,
      activeTeams,
      totalProfiles,
      verifiedProfiles
    ] = await Promise.all([
      User.count(),
      User.count({ where: { status: 'active' } }),
      Subscription.count(),
      Subscription.count({ where: { status: 'active' } }),
      SubscriptionPlan.count(),
      SubscriptionPlan.count({ where: { is_active: true } }),
      Team.count(),
      Team.count({ where: { is_active: true } }),
      Profile.count(),
      Profile.count({ where: { is_verified: true } })
    ]);

    // Receita total e mensal (simuladas)
    const totalRevenue = activeSubscriptions * 29.90;
    const monthlyRevenue = totalRevenue; // Assumindo que todas são mensais

    res.json({
      totalUsers,
      activeUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      totalPlans,
      activePlans,
      totalTeams,
      activeTeams,
      totalProfiles,
      verifiedProfiles
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do sistema:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Usuários por role
exports.getUsersByRole = async (req, res) => {
  try {
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['role'],
      order: [['role', 'ASC']]
    });

    const result = usersByRole.map(item => ({
      role: item.role,
      count: parseInt(item.dataValues.count)
    }));

    res.json({ usersByRole: result });
  } catch (error) {
    console.error('Erro ao buscar usuários por role:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Assinaturas por status
exports.getSubscriptionsByStatus = async (req, res) => {
  try {
    const subscriptionsByStatus = await Subscription.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['status'],
      order: [['status', 'ASC']]
    });

    const result = subscriptionsByStatus.map(item => ({
      status: item.status,
      count: parseInt(item.dataValues.count)
    }));

    res.json({ subscriptionsByStatus: result });
  } catch (error) {
    console.error('Erro ao buscar assinaturas por status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Análise de receita
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const period = req.query.period || 'monthly';
    let dateFormat;
    let dateInterval;

    switch (period) {
      case 'daily':
        dateFormat = '%Y-%m-%d';
        dateInterval = 30; // últimos 30 dias
        break;
      case 'weekly':
        dateFormat = '%Y-%u'; // ano-semana
        dateInterval = 12; // últimas 12 semanas
        break;
      case 'monthly':
      default:
        dateFormat = '%Y-%m';
        dateInterval = 12; // últimos 12 meses
        break;
    }

    const startDate = new Date();
    if (period === 'daily') {
      startDate.setDate(startDate.getDate() - dateInterval);
    } else if (period === 'weekly') {
      startDate.setDate(startDate.getDate() - (dateInterval * 7));
    } else {
      startDate.setMonth(startDate.getMonth() - dateInterval);
    }

    const revenueData = await Subscription.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('subscriptions.created_at'), dateFormat), 'period'],
        [fn('SUM', literal('CAST(subscription_plan.price AS DECIMAL)')), 'revenue'],
        [fn('COUNT', col('subscriptions.id')), 'subscriptions']
      ],
      include: [{
        model: SubscriptionPlan,
        as: 'subscriptionPlan',
        attributes: []
      }],
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        status: 'active'
      },
      group: [fn('DATE_FORMAT', col('subscriptions.created_at'), dateFormat)],
      order: [[fn('DATE_FORMAT', col('subscriptions.created_at'), dateFormat), 'ASC']]
    });

    const analytics = revenueData.map(item => ({
      period: item.dataValues.period,
      revenue: parseFloat(item.dataValues.revenue) || 0,
      subscriptions: parseInt(item.dataValues.subscriptions) || 0
    }));

    res.json({ analytics, period });
  } catch (error) {
    console.error('Erro ao buscar análise de receita:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getBabyHealthSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.query;

    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    let child;
    if (childId) {
      child = await Child.findOne({ 
        where: { id: childId, profileId: profile.id } 
      });
    } else {
      child = await Child.findOne({ 
        where: { profileId: profile.id, isActive: true },
        order: [['createdAt', 'DESC']]
      });
    }

    if (!child) {
      return res.json({
        hasChild: false,
        child: null,
        biometrics: [],
        sleepLogs: [],
        vaccines: { taken: [], pending: [], nextVaccine: null },
        appointments: [],
        summary: null
      });
    }

    const birthDate = new Date(child.birthDate);
    const today = new Date();
    const ageInWeeks = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 7));
    const ageInMonths = Math.floor(ageInWeeks / 4.33);

    const biometrics = await BiometricsLog.findAll({
      where: { childId: child.id },
      order: [['recordedAt', 'DESC']],
      limit: 20
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const sleepLogs = await SleepLog.findAll({
      where: { 
        childId: child.id,
        createdAt: { [Op.gte]: sevenDaysAgo }
      },
      order: [['createdAt', 'DESC']]
    });

    const vaccineHistory = await VaccineHistory.findAll({
      where: { childId: child.id }
    });

    const takenVaccineKeys = new Set(
      vaccineHistory.map(v => `${v.vaccineName}-${v.doseNumber}`)
    );

    const takenVaccines = SBP_VACCINE_CALENDAR.filter(v => 
      takenVaccineKeys.has(`${v.vaccine}-${v.dose}`)
    ).map(v => ({
      ...v,
      status: 'taken',
      takenAt: vaccineHistory.find(vh => vh.vaccineName === v.vaccine && vh.doseNumber == v.dose)?.takenAt
    }));

    const pendingVaccines = SBP_VACCINE_CALENDAR.filter(v => 
      !takenVaccineKeys.has(`${v.vaccine}-${v.dose}`) && v.weeks <= ageInWeeks
    ).map(v => ({ ...v, status: 'pending' }));

    const upcomingVaccines = SBP_VACCINE_CALENDAR.filter(v => 
      !takenVaccineKeys.has(`${v.vaccine}-${v.dose}`) && v.weeks > ageInWeeks
    ).map(v => ({ ...v, status: 'upcoming' }));

    const nextVaccine = [...pendingVaccines, ...upcomingVaccines][0] || null;

    const appointments = await Appointment.findAll({
      where: { 
        childId: child.id,
        appointmentDate: { [Op.gte]: today }
      },
      order: [['appointmentDate', 'ASC']],
      limit: 5
    });

    const latestBiometrics = biometrics[0] || null;
    const totalSleepMinutes = sleepLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0);
    const avgSleepPerDay = sleepLogs.length > 0 ? Math.round(totalSleepMinutes / 7) : null;

    const developmentLeaps = [
      { week: 5, name: 'Mundo das Sensações' },
      { week: 8, name: 'Mundo dos Padrões' },
      { week: 12, name: 'Mundo das Transições Suaves' },
      { week: 19, name: 'Mundo dos Eventos' },
      { week: 26, name: 'Mundo dos Relacionamentos' },
      { week: 37, name: 'Mundo das Categorias' },
      { week: 46, name: 'Mundo das Sequências' },
      { week: 55, name: 'Mundo dos Programas' },
      { week: 64, name: 'Mundo dos Princípios' },
      { week: 75, name: 'Mundo dos Sistemas' }
    ];

    const nextLeap = developmentLeaps.find(leap => leap.week > ageInWeeks) || null;
    const currentLeap = developmentLeaps.filter(leap => leap.week <= ageInWeeks).pop() || null;

    return res.json({
      hasChild: true,
      child: {
        id: child.id,
        firstName: child.firstName,
        lastName: child.lastName,
        birthDate: child.birthDate,
        ageInWeeks,
        ageInMonths,
        ageDisplay: ageInMonths < 1 
          ? `${ageInWeeks} semanas` 
          : ageInMonths < 24 
            ? `${ageInMonths} meses` 
            : `${Math.floor(ageInMonths / 12)} anos e ${ageInMonths % 12} meses`
      },
      biometrics: biometrics.map(b => ({
        id: b.id,
        weight: b.weight,
        height: b.height,
        headCircumference: b.headCircumference,
        recordedAt: b.recordedAt,
        source: b.source
      })),
      sleepLogs: sleepLogs.map(s => ({
        id: s.id,
        startTime: s.startTime,
        endTime: s.endTime,
        durationMinutes: s.durationMinutes,
        sleepType: s.sleepType,
        quality: s.quality,
        createdAt: s.createdAt
      })),
      vaccines: {
        taken: takenVaccines,
        pending: pendingVaccines,
        upcoming: upcomingVaccines.slice(0, 5),
        nextVaccine
      },
      appointments: appointments.map(a => ({
        id: a.id,
        doctorName: a.doctorName,
        specialty: a.specialty,
        appointmentDate: a.appointmentDate,
        location: a.location,
        status: a.status
      })),
      summary: {
        latestWeight: latestBiometrics?.weight || null,
        latestHeight: latestBiometrics?.height || null,
        lastMeasurementDate: latestBiometrics?.recordedAt || null,
        avgSleepPerDay,
        pendingVaccinesCount: pendingVaccines.length,
        upcomingAppointmentsCount: appointments.length,
        currentLeap,
        nextLeap,
        nextLeapWeeksAway: nextLeap ? nextLeap.week - ageInWeeks : null
      }
    });
  } catch (error) {
    console.error('Erro ao buscar resumo de saúde do bebê:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
