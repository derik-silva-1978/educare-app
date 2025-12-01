const { User, Profile, Child } = require('../models');
const { Op } = require('sequelize');

// Dados mockados de atividades para funcionar imediatamente
const mockActivities = [
  {
    id: 1,
    title: 'Brincadeira com Blocos',
    description: 'Atividade de construção para desenvolvimento motor',
    category: 'Motor',
    min_age_months: 12,
    max_age_months: 36,
    duration_minutes: 30,
    materials: ['Blocos de madeira', 'Tapete'],
    instructions: 'Deixe a criança explorar e construir livremente'
  },
  {
    id: 2,
    title: 'Leitura Interativa',
    description: 'Leitura de livros com perguntas e interação',
    category: 'Cognitivo',
    min_age_months: 24,
    max_age_months: 60,
    duration_minutes: 20,
    materials: ['Livros ilustrados'],
    instructions: 'Faça perguntas sobre as imagens e história'
  },
  {
    id: 3,
    title: 'Pintura com Dedos',
    description: 'Atividade artística para expressão criativa',
    category: 'Criativo',
    min_age_months: 18,
    max_age_months: 48,
    duration_minutes: 45,
    materials: ['Tinta atóxica', 'Papel', 'Aventais'],
    instructions: 'Deixe a criança explorar cores e texturas'
  }
];

// Função auxiliar para filtrar atividades por idade da criança
const getActivitiesForChild = (ageInMonths) => {
  return mockActivities.filter(activity => 
    ageInMonths >= activity.min_age_months && ageInMonths <= activity.max_age_months
  );
};

// Listar todos os usuários com suas crianças e atividades recomendadas
const getAllUsersWithActivities = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      has_children,
      min_children_age,
      max_children_age
    } = req.query;

    // Construir filtros para usuários
    const userWhere = {};
    
    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) {
      userWhere.role = role;
    }

    // Calcular offset
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Buscar usuários com suas crianças
    const { count, rows: users } = await User.findAndCountAll({
      where: userWhere,
      include: [
        {
          model: Child,
          as: 'children',
          required: false // LEFT JOIN para incluir usuários sem crianças
        },
        {
          model: Profile,
          as: 'profile',
          required: false
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      distinct: true
    });

    // Para cada usuário, calcular atividades recomendadas
    const usersWithActivities = users.map(user => {
      const userObj = user.toJSON();
      
      // Calcular atividades recomendadas baseado nas crianças
      let recommendedActivities = [];
      
      if (userObj.children && userObj.children.length > 0) {
        // Para cada criança, buscar atividades apropriadas
        userObj.children.forEach(child => {
          const childActivities = getActivitiesForChild(child.age_in_months);
          recommendedActivities = [...recommendedActivities, ...childActivities];
        });
        
        // Remover duplicatas
        recommendedActivities = recommendedActivities.filter((activity, index, self) => 
          index === self.findIndex(a => a.id === activity.id)
        );
      }
      
      return {
        ...userObj,
        recommended_activities: recommendedActivities,
        activities_count: recommendedActivities.length
      };
    });

    res.json({
      success: true,
      data: {
        users: usersWithActivities,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / parseInt(limit)),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários com atividades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Obter atividades específicas para um usuário baseado na idade de suas crianças
const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, category } = req.query;

    // Buscar usuário com suas crianças
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Child,
          as: 'children'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const userObj = user.toJSON();
    let allActivities = [];

    if (userObj.children && userObj.children.length > 0) {
      // Para cada criança, buscar atividades apropriadas
      userObj.children.forEach(child => {
        const childActivities = getActivitiesForChild(child.age_in_months);
        allActivities = [...allActivities, ...childActivities];
      });
      
      // Remover duplicatas
      allActivities = allActivities.filter((activity, index, self) => 
        index === self.findIndex(a => a.id === activity.id)
      );

      // Filtrar por categoria se especificada
      if (category) {
        allActivities = allActivities.filter(activity => 
          activity.category.toLowerCase() === category.toLowerCase()
        );
      }
    }

    // Paginação manual
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const paginatedActivities = allActivities.slice(offset, offset + parseInt(limit));
    const totalPages = Math.ceil(allActivities.length / parseInt(limit));

    res.json({
      success: true,
      data: {
        user: {
          id: userObj.id,
          name: userObj.name,
          email: userObj.email,
          children_count: userObj.children ? userObj.children.length : 0
        },
        activities: paginatedActivities,
        pagination: {
          total: allActivities.length,
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: totalPages
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar atividades do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Obter atividades recomendadas para uma criança específica
const getChildActivities = async (req, res) => {
  try {
    const { childId } = req.params;
    const { category } = req.query;

    // Buscar criança
    const child = await Child.findByPk(childId);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Criança não encontrada'
      });
    }

    // Buscar atividades apropriadas para a idade
    let activities = getActivitiesForChild(child.age_in_months);

    // Filtrar por categoria se especificada
    if (category) {
      activities = activities.filter(activity => 
        activity.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: {
        child: {
          id: child.id,
          name: child.name,
          age_in_months: child.age_in_months
        },
        activities,
        total_activities: activities.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar atividades da criança:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Obter estatísticas de atividades por usuários
const getUserActivitiesStats = async (req, res) => {
  try {
    // Total de usuários
    const totalUsers = await User.count();

    // Usuários com crianças
    const usersWithChildren = await User.count({
      include: [
        {
          model: Child,
          as: 'children',
          required: true
        }
      ]
    });

    // Total de crianças
    const totalChildren = await Child.count();

    // Distribuição por faixa etária usando dados mockados
    const ageRanges = {
      '0-6 meses': { min: 0, max: 6 },
      '7-12 meses': { min: 7, max: 12 },
      '13-24 meses': { min: 13, max: 24 },
      '25-36 meses': { min: 25, max: 36 },
      '37+ meses': { min: 37, max: 999 }
    };

    const children = await Child.findAll({
      attributes: ['age_in_months'],
      raw: true
    });

    const ageDistribution = Object.entries(ageRanges).map(([range, { min, max }]) => {
      const childrenInRange = children.filter(
        child => child.age_in_months >= min && child.age_in_months <= max
      ).length;

      const activitiesInRange = mockActivities.filter(activity => 
        activity.min_age_months <= max && activity.max_age_months >= min
      ).length;

      return {
        age_range: range,
        children_count: childrenInRange,
        activities_count: activitiesInRange
      };
    });

    // Distribuição de atividades por categoria usando dados mockados
    const categories = [...new Set(mockActivities.map(a => a.category))];
    const activitiesByCategory = categories.map(category => {
      const activitiesCount = mockActivities.filter(a => a.category === category).length;
      
      return {
        category,
        activities_count: activitiesCount
      };
    });

    res.json({
      success: true,
      data: {
        total_users: totalUsers,
        users_with_children: usersWithChildren,
        total_children: totalChildren,
        total_activities: mockActivities.length,
        age_distribution: ageDistribution,
        activities_by_category: activitiesByCategory
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsersWithActivities,
  getUserActivities,
  getChildActivities,
  getUserActivitiesStats
};
