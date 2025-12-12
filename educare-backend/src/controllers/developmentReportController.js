const { ChildDevelopmentReport, Child, User, JourneyBotSession, Profile } = require('../models');
const { Op } = require('sequelize');

const DIMENSION_NAMES = {
  'motor_grosso': 'Motor Grosso',
  'motor_fino': 'Motor Fino',
  'linguagem': 'Linguagem',
  'cognitivo': 'Cognitivo',
  'social_emocional': 'Social-Emocional',
  'autocuidado': 'Autocuidado'
};

exports.listReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.query;

    const whereClause = { user_id: userId };
    if (childId) {
      whereClause.child_id = childId;
    }

    const reports = await ChildDevelopmentReport.findAll({
      where: whereClause,
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['generated_at', 'DESC']]
    });

    const reportsWithChildName = reports.map(report => ({
      ...report.toJSON(),
      child_name: report.child ? `${report.child.firstName} ${report.child.lastName}` : null
    }));

    return res.status(200).json({ reports: reportsWithChildName });
  } catch (error) {
    console.error('Erro ao listar relatórios:', error);
    return res.status(500).json({ error: 'Erro ao listar relatórios de desenvolvimento' });
  }
};

exports.getReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const report = await ChildDevelopmentReport.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName', 'birthDate']
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error('Erro ao buscar relatório:', error);
    return res.status(500).json({ error: 'Erro ao buscar relatório' });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { session_id, child_id, responses, child_age } = req.body;

    if (!child_id || !responses || !Array.isArray(responses)) {
      return res.status(400).json({
        error: 'Campos obrigatórios: child_id, responses (array)'
      });
    }

    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    const child = await Child.findOne({
      where: { id: child_id, profileId: profile.id }
    });

    if (!child) {
      return res.status(403).json({ error: 'Acesso negado a esta criança' });
    }

    const dimensionScores = {};
    const dimensionCounts = {};

    responses.forEach(response => {
      if (!dimensionScores[response.dimension]) {
        dimensionScores[response.dimension] = 0;
        dimensionCounts[response.dimension] = 0;
      }
      const score = response.answer === 1 ? 100 : response.answer === 2 ? 50 : 0;
      dimensionScores[response.dimension] += score;
      dimensionCounts[response.dimension] += 1;
    });

    Object.keys(dimensionScores).forEach(dimension => {
      dimensionScores[dimension] = Math.round(
        dimensionScores[dimension] / dimensionCounts[dimension]
      );
    });

    const overallScore = Math.round(
      Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) /
      Object.keys(dimensionScores).length
    );

    const recommendations = [];
    const concerns = [];

    Object.entries(dimensionScores).forEach(([dimension, score]) => {
      const dimensionName = DIMENSION_NAMES[dimension] || dimension;
      if (score < 50) {
        concerns.push(`Área de atenção: ${dimensionName} (${score}%)`);
        recommendations.push(`Estimule atividades de ${dimensionName.toLowerCase()}`);
      } else if (score >= 80) {
        recommendations.push(`Excelente desenvolvimento em ${dimensionName.toLowerCase()}`);
      }
    });

    const ageRangeMonths = child_age
      ? `${Math.floor(child_age / 12)}a${child_age % 12}m`
      : null;

    const reportData = {
      child_id,
      user_id: userId,
      session_id: session_id || null,
      age_range_months: ageRangeMonths,
      total_questions: responses.length,
      answered_questions: responses.length,
      completion_percentage: 100,
      overall_score: overallScore,
      dimension_scores: dimensionScores,
      recommendations,
      concerns,
      report_data: {
        responses,
        generation_date: new Date().toISOString(),
        child_age_months: child_age
      },
      status: 'generated',
      generated_at: new Date()
    };

    const newReport = await ChildDevelopmentReport.create(reportData);

    return res.status(201).json({
      success: true,
      report: newReport
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return res.status(500).json({ error: 'Erro ao gerar relatório de desenvolvimento' });
  }
};

exports.shareWithProfessionals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const report = await ChildDevelopmentReport.findOne({
      where: { id, user_id: userId }
    });

    if (!report) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }

    await report.update({ shared_with_professionals: true });

    return res.status(200).json({
      success: true,
      message: 'Relatório compartilhado com profissionais'
    });
  } catch (error) {
    console.error('Erro ao compartilhar relatório:', error);
    return res.status(500).json({ error: 'Erro ao compartilhar relatório' });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const report = await ChildDevelopmentReport.findOne({
      where: { id, user_id: userId }
    });

    if (!report) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }

    await report.destroy();

    return res.status(200).json({
      success: true,
      message: 'Relatório excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir relatório:', error);
    return res.status(500).json({ error: 'Erro ao excluir relatório' });
  }
};
