const { MaternalHealthProfile, MaternalDailyHealth, MaternalMentalHealth, MaternalAppointment, User } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const getOrCreateProfile = async (userId) => {
  let profile = await MaternalHealthProfile.findOne({ where: { userId } });
  if (!profile) {
    const user = await User.findByPk(userId);
    profile = await MaternalHealthProfile.create({
      userId,
      name: user ? user.name : null,
      stage: 'pregnancy'
    });
  }
  return profile;
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);
    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Erro ao buscar perfil maternal:', error);
    return res.status(500).json({ error: 'Erro ao buscar perfil maternal' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);

    const allowedFields = [
      'name', 'dueDate', 'lastPeriodDate', 'pregnancyWeek', 'highRisk',
      'doctorName', 'nextAppointment', 'bloodType', 'height',
      'prePregnancyWeight', 'notes', 'stage'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();
    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Erro ao atualizar perfil maternal:', error);
    return res.status(500).json({ error: 'Erro ao atualizar perfil maternal' });
  }
};

exports.addDailyHealth = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);

    const record = await MaternalDailyHealth.create({
      profileId: profile.id,
      userId,
      date: req.body.date || new Date().toISOString().split('T')[0],
      weight: req.body.weight,
      bloodPressureSystolic: req.body.bloodPressureSystolic,
      bloodPressureDiastolic: req.body.bloodPressureDiastolic,
      bloodGlucose: req.body.bloodGlucose,
      temperature: req.body.temperature,
      sleepHours: req.body.sleepHours,
      energyLevel: req.body.energyLevel,
      nauseaLevel: req.body.nauseaLevel,
      notes: req.body.notes
    });

    return res.status(201).json({ record });
  } catch (error) {
    console.error('Erro ao adicionar registro de saúde diária:', error);
    return res.status(500).json({ error: 'Erro ao adicionar registro de saúde diária' });
  }
};

exports.getDailyHealth = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);

    const where = { profileId: profile.id };

    if (req.query.startDate || req.query.endDate) {
      where.date = {};
      if (req.query.startDate) where.date[Op.gte] = req.query.startDate;
      if (req.query.endDate) where.date[Op.lte] = req.query.endDate;
    }

    const records = await MaternalDailyHealth.findAll({
      where,
      order: [['date', 'DESC']]
    });

    return res.status(200).json({ records });
  } catch (error) {
    console.error('Erro ao buscar registros de saúde diária:', error);
    return res.status(500).json({ error: 'Erro ao buscar registros de saúde diária' });
  }
};

exports.addMentalHealth = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);

    const record = await MaternalMentalHealth.create({
      profileId: profile.id,
      userId,
      date: req.body.date || new Date().toISOString().split('T')[0],
      moodScore: req.body.moodScore,
      anxietyLevel: req.body.anxietyLevel,
      stressLevel: req.body.stressLevel,
      sleepQuality: req.body.sleepQuality,
      supportFeeling: req.body.supportFeeling,
      concerns: req.body.concerns,
      positiveMoments: req.body.positiveMoments,
      notes: req.body.notes
    });

    return res.status(201).json({ record });
  } catch (error) {
    console.error('Erro ao adicionar registro de saúde mental:', error);
    return res.status(500).json({ error: 'Erro ao adicionar registro de saúde mental' });
  }
};

exports.getMentalHealth = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);

    const where = { profileId: profile.id };

    if (req.query.startDate || req.query.endDate) {
      where.date = {};
      if (req.query.startDate) where.date[Op.gte] = req.query.startDate;
      if (req.query.endDate) where.date[Op.lte] = req.query.endDate;
    }

    const records = await MaternalMentalHealth.findAll({
      where,
      order: [['date', 'DESC']]
    });

    return res.status(200).json({ records });
  } catch (error) {
    console.error('Erro ao buscar registros de saúde mental:', error);
    return res.status(500).json({ error: 'Erro ao buscar registros de saúde mental' });
  }
};

exports.getMentalHealthSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const getAverages = async (startDate) => {
      const records = await MaternalMentalHealth.findAll({
        where: {
          profileId: profile.id,
          date: { [Op.gte]: startDate.toISOString().split('T')[0] }
        },
        attributes: [
          [fn('AVG', col('mood_score')), 'avgMoodScore'],
          [fn('AVG', col('anxiety_level')), 'avgAnxietyLevel'],
          [fn('AVG', col('stress_level')), 'avgStressLevel'],
          [fn('AVG', col('sleep_quality')), 'avgSleepQuality'],
          [fn('AVG', col('support_feeling')), 'avgSupportFeeling'],
          [fn('COUNT', col('id')), 'totalRecords']
        ],
        raw: true
      });
      return records[0] || {};
    };

    const [last7Days, last30Days] = await Promise.all([
      getAverages(sevenDaysAgo),
      getAverages(thirtyDaysAgo)
    ]);

    return res.status(200).json({
      summary: {
        last7Days: {
          avgMoodScore: last7Days.avgMoodScore ? parseFloat(last7Days.avgMoodScore) : null,
          avgAnxietyLevel: last7Days.avgAnxietyLevel ? parseFloat(last7Days.avgAnxietyLevel) : null,
          avgStressLevel: last7Days.avgStressLevel ? parseFloat(last7Days.avgStressLevel) : null,
          avgSleepQuality: last7Days.avgSleepQuality ? parseFloat(last7Days.avgSleepQuality) : null,
          avgSupportFeeling: last7Days.avgSupportFeeling ? parseFloat(last7Days.avgSupportFeeling) : null,
          totalRecords: parseInt(last7Days.totalRecords) || 0
        },
        last30Days: {
          avgMoodScore: last30Days.avgMoodScore ? parseFloat(last30Days.avgMoodScore) : null,
          avgAnxietyLevel: last30Days.avgAnxietyLevel ? parseFloat(last30Days.avgAnxietyLevel) : null,
          avgStressLevel: last30Days.avgStressLevel ? parseFloat(last30Days.avgStressLevel) : null,
          avgSleepQuality: last30Days.avgSleepQuality ? parseFloat(last30Days.avgSleepQuality) : null,
          avgSupportFeeling: last30Days.avgSupportFeeling ? parseFloat(last30Days.avgSupportFeeling) : null,
          totalRecords: parseInt(last30Days.totalRecords) || 0
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar resumo de saúde mental:', error);
    return res.status(500).json({ error: 'Erro ao buscar resumo de saúde mental' });
  }
};

exports.addAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);

    const appointment = await MaternalAppointment.create({
      profileId: profile.id,
      userId,
      appointmentType: req.body.appointmentType,
      doctorName: req.body.doctorName,
      appointmentDate: req.body.appointmentDate,
      location: req.body.location,
      status: req.body.status || 'scheduled',
      notes: req.body.notes
    });

    return res.status(201).json({ appointment });
  } catch (error) {
    console.error('Erro ao adicionar consulta:', error);
    return res.status(500).json({ error: 'Erro ao adicionar consulta' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);

    const where = { profileId: profile.id };

    if (req.query.status) {
      where.status = req.query.status;
    }

    const appointments = await MaternalAppointment.findAll({
      where,
      order: [['appointmentDate', 'ASC']]
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    return res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.params;

    const appointment = await MaternalAppointment.findOne({
      where: { id: appointmentId, userId }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }

    const allowedFields = [
      'appointmentType', 'doctorName', 'appointmentDate',
      'location', 'status', 'notes'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        appointment[field] = req.body[field];
      }
    });

    await appointment.save();
    return res.status(200).json({ appointment });
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error);
    return res.status(500).json({ error: 'Erro ao atualizar consulta' });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [latestDailyHealth, upcomingAppointments, recentMoodRecords, moodSummary7d, moodSummary30d] = await Promise.all([
      MaternalDailyHealth.findAll({
        where: { profileId: profile.id },
        order: [['date', 'DESC']],
        limit: 7
      }),

      MaternalAppointment.findAll({
        where: {
          profileId: profile.id,
          status: { [Op.in]: ['scheduled', 'confirmed'] },
          appointmentDate: { [Op.gte]: now }
        },
        order: [['appointmentDate', 'ASC']],
        limit: 5
      }),

      MaternalMentalHealth.findAll({
        where: { profileId: profile.id },
        order: [['date', 'DESC']],
        limit: 7
      }),

      MaternalMentalHealth.findAll({
        where: {
          profileId: profile.id,
          date: { [Op.gte]: sevenDaysAgo.toISOString().split('T')[0] }
        },
        attributes: [
          [fn('AVG', col('mood_score')), 'avgMoodScore'],
          [fn('AVG', col('anxiety_level')), 'avgAnxietyLevel'],
          [fn('AVG', col('stress_level')), 'avgStressLevel'],
          [fn('AVG', col('sleep_quality')), 'avgSleepQuality'],
          [fn('AVG', col('support_feeling')), 'avgSupportFeeling'],
          [fn('COUNT', col('id')), 'totalRecords']
        ],
        raw: true
      }),

      MaternalMentalHealth.findAll({
        where: {
          profileId: profile.id,
          date: { [Op.gte]: thirtyDaysAgo.toISOString().split('T')[0] }
        },
        attributes: [
          [fn('AVG', col('mood_score')), 'avgMoodScore'],
          [fn('AVG', col('anxiety_level')), 'avgAnxietyLevel'],
          [fn('AVG', col('stress_level')), 'avgStressLevel'],
          [fn('AVG', col('sleep_quality')), 'avgSleepQuality'],
          [fn('AVG', col('support_feeling')), 'avgSupportFeeling'],
          [fn('COUNT', col('id')), 'totalRecords']
        ],
        raw: true
      })
    ]);

    const last7 = moodSummary7d[0] || {};
    const last30 = moodSummary30d[0] || {};

    return res.status(200).json({
      dashboard: {
        profile,
        latestMetrics: latestDailyHealth,
        upcomingAppointments,
        recentMood: recentMoodRecords,
        moodSummary: {
          last7Days: {
            avgMoodScore: last7.avgMoodScore ? parseFloat(last7.avgMoodScore) : null,
            avgAnxietyLevel: last7.avgAnxietyLevel ? parseFloat(last7.avgAnxietyLevel) : null,
            avgStressLevel: last7.avgStressLevel ? parseFloat(last7.avgStressLevel) : null,
            avgSleepQuality: last7.avgSleepQuality ? parseFloat(last7.avgSleepQuality) : null,
            avgSupportFeeling: last7.avgSupportFeeling ? parseFloat(last7.avgSupportFeeling) : null,
            totalRecords: parseInt(last7.totalRecords) || 0
          },
          last30Days: {
            avgMoodScore: last30.avgMoodScore ? parseFloat(last30.avgMoodScore) : null,
            avgAnxietyLevel: last30.avgAnxietyLevel ? parseFloat(last30.avgAnxietyLevel) : null,
            avgStressLevel: last30.avgStressLevel ? parseFloat(last30.avgStressLevel) : null,
            avgSleepQuality: last30.avgSleepQuality ? parseFloat(last30.avgSleepQuality) : null,
            avgSupportFeeling: last30.avgSupportFeeling ? parseFloat(last30.avgSupportFeeling) : null,
            totalRecords: parseInt(last30.totalRecords) || 0
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard maternal:', error);
    return res.status(500).json({ error: 'Erro ao buscar dashboard maternal' });
  }
};
