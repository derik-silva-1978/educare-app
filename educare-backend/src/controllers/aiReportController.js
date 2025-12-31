const { Child, Profile, Biometric, VaccineRecord, SleepLog, ChildDevelopmentReport, JourneyBotSession } = require('../models');
const whatsappService = require('../services/whatsappService');
const { Op } = require('sequelize');

const generatePdfContent = (reportData) => {
  const { child, biometrics, vaccines, sleepLogs, developmentReports } = reportData;
  
  let content = `
RELATÓRIO INFANTIL - ${child.firstName} ${child.lastName || ''}
Gerado em: ${new Date().toLocaleDateString('pt-BR')}

════════════════════════════════════════

📋 DADOS PESSOAIS
Nome: ${child.firstName} ${child.lastName || ''}
Data de Nascimento: ${child.birthDate ? new Date(child.birthDate).toLocaleDateString('pt-BR') : 'Não informada'}
Gênero: ${child.gender === 'male' ? 'Masculino' : child.gender === 'female' ? 'Feminino' : 'Não informado'}
`;

  if (biometrics && biometrics.length > 0) {
    const latestBiometric = biometrics[0];
    content += `
════════════════════════════════════════

📊 DADOS BIOMÉTRICOS (Última medição)
Peso: ${latestBiometric.weight ? `${latestBiometric.weight} kg` : 'Não registrado'}
Altura: ${latestBiometric.height ? `${latestBiometric.height} cm` : 'Não registrada'}
Perímetro Cefálico: ${latestBiometric.headCircumference ? `${latestBiometric.headCircumference} cm` : 'Não registrado'}
Data: ${latestBiometric.recordedAt ? new Date(latestBiometric.recordedAt).toLocaleDateString('pt-BR') : 'Não informada'}
`;
  }

  if (vaccines && vaccines.length > 0) {
    const takenVaccines = vaccines.filter(v => v.status === 'taken' || v.takenAt);
    const pendingVaccines = vaccines.filter(v => v.status === 'pending' || (!v.takenAt && v.scheduledFor));
    
    content += `
════════════════════════════════════════

💉 VACINAS
Aplicadas: ${takenVaccines.length}
Pendentes: ${pendingVaccines.length}

Vacinas Aplicadas:
${takenVaccines.slice(0, 10).map(v => `  • ${v.vaccineName || v.vaccine_name} - ${v.takenAt ? new Date(v.takenAt).toLocaleDateString('pt-BR') : 'Data não informada'}`).join('\n') || '  Nenhuma registrada'}
`;
  }

  if (sleepLogs && sleepLogs.length > 0) {
    const avgSleep = Math.round(sleepLogs.slice(0, 7).reduce((acc, s) => acc + (s.durationMinutes || 0), 0) / Math.min(sleepLogs.length, 7));
    content += `
════════════════════════════════════════

🌙 PADRÃO DE SONO (Últimos 7 dias)
Média de sono: ${Math.floor(avgSleep / 60)}h ${avgSleep % 60}min por noite
Qualidade predominante: ${getMostCommonQuality(sleepLogs.slice(0, 7))}
`;
  }

  if (developmentReports && developmentReports.length > 0) {
    const latestReport = developmentReports[0];
    content += `
════════════════════════════════════════

🧠 DESENVOLVIMENTO
Score Geral: ${latestReport.overall_score || latestReport.overallScore || 0}%
Data da Avaliação: ${latestReport.generated_at ? new Date(latestReport.generated_at).toLocaleDateString('pt-BR') : 'Não informada'}

Dimensões:
${formatDimensionScores(latestReport.dimension_scores || latestReport.dimensionScores)}

Recomendações:
${(latestReport.recommendations || []).map(r => `  • ${r}`).join('\n') || '  Nenhuma recomendação'}
`;
  }

  content += `
════════════════════════════════════════

Este relatório foi gerado automaticamente pelo Educare+.
Para mais informações, acesse o aplicativo.
`;

  return content;
};

const getMostCommonQuality = (sleepLogs) => {
  const qualities = {};
  sleepLogs.forEach(s => {
    const quality = s.quality || 'regular';
    qualities[quality] = (qualities[quality] || 0) + 1;
  });
  const sorted = Object.entries(qualities).sort((a, b) => b[1] - a[1]);
  const qualityLabels = { good: 'Bom', regular: 'Regular', poor: 'Ruim' };
  return qualityLabels[sorted[0]?.[0]] || 'Regular';
};

const formatDimensionScores = (scores) => {
  if (!scores || typeof scores !== 'object') return '  Nenhuma avaliação disponível';
  
  const dimensionLabels = {
    motor_grosso: 'Motor Grosso',
    motor_fino: 'Motor Fino',
    linguagem: 'Linguagem',
    cognitivo: 'Cognitivo',
    social_emocional: 'Social-Emocional',
    autocuidado: 'Autocuidado'
  };

  return Object.entries(scores)
    .map(([dim, score]) => `  • ${dimensionLabels[dim] || dim}: ${score}%`)
    .join('\n') || '  Nenhuma avaliação disponível';
};

exports.generateAIReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, selectedFields } = req.body;

    if (!childId) {
      return res.status(400).json({ success: false, error: 'ID da criança é obrigatório' });
    }

    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Perfil não encontrado' });
    }

    const child = await Child.findOne({
      where: { id: childId, profileId: profile.id }
    });

    if (!child) {
      return res.status(403).json({ success: false, error: 'Acesso negado a esta criança' });
    }

    const reportData = { child };

    const fieldsToFetch = selectedFields || [
      'personal', 'biometrics', 'vaccines', 'sleep', 'development'
    ];

    if (fieldsToFetch.includes('biometrics')) {
      reportData.biometrics = await Biometric.findAll({
        where: { childId },
        order: [['recordedAt', 'DESC']],
        limit: 10
      });
    }

    if (fieldsToFetch.includes('vaccines')) {
      reportData.vaccines = await VaccineRecord.findAll({
        where: { childId },
        order: [['scheduledFor', 'ASC']]
      });
    }

    if (fieldsToFetch.includes('sleep')) {
      reportData.sleepLogs = await SleepLog.findAll({
        where: { childId },
        order: [['date', 'DESC']],
        limit: 30
      });
    }

    if (fieldsToFetch.includes('development')) {
      reportData.developmentReports = await ChildDevelopmentReport.findAll({
        where: { child_id: childId },
        order: [['generated_at', 'DESC']],
        limit: 5
      });
    }

    const reportContent = generatePdfContent(reportData);

    return res.status(200).json({
      success: true,
      report: {
        content: reportContent,
        childName: `${child.firstName} ${child.lastName || ''}`,
        generatedAt: new Date().toISOString(),
        fieldsIncluded: fieldsToFetch
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório AI:', error);
    return res.status(500).json({ success: false, error: 'Erro ao gerar relatório' });
  }
};

exports.sendReportViaWhatsApp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.body;
    let { phoneNumber } = req.body;

    if (!childId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID da criança é obrigatório' 
      });
    }

    const profile = await Profile.findOne({ 
      where: { userId },
      include: [{ 
        model: require('../models').User, 
        as: 'user',
        attributes: ['phoneNumber'] 
      }]
    });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Perfil não encontrado' });
    }

    if (!phoneNumber || phoneNumber.trim() === '') {
      phoneNumber = profile.phoneNumber || profile.user?.phoneNumber;
    }

    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nenhum número de telefone cadastrado. Por favor, cadastre seu telefone nas configurações.' 
      });
    }

    const child = await Child.findOne({
      where: { id: childId, profileId: profile.id }
    });

    if (!child) {
      return res.status(403).json({ success: false, error: 'Acesso negado a esta criança' });
    }

    const reportData = { child };
    
    reportData.biometrics = await Biometric.findAll({
      where: { childId },
      order: [['recordedAt', 'DESC']],
      limit: 5
    });

    reportData.vaccines = await VaccineRecord.findAll({
      where: { childId },
      order: [['scheduledFor', 'ASC']],
      limit: 10
    });

    reportData.sleepLogs = await SleepLog.findAll({
      where: { childId },
      order: [['date', 'DESC']],
      limit: 7
    });

    reportData.developmentReports = await ChildDevelopmentReport.findAll({
      where: { child_id: childId },
      order: [['generated_at', 'DESC']],
      limit: 1
    });

    const reportContent = generatePdfContent(reportData);

    const formattedMessage = `*Educare+ - Relatório Infantil*\n\n${reportContent}`;

    const result = await whatsappService.sendMessage(phoneNumber, formattedMessage);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Relatório enviado com sucesso via WhatsApp',
        messageId: result.messageId
      });
    } else {
      throw new Error(result.error || 'Falha ao enviar mensagem');
    }
  } catch (error) {
    console.error('Erro ao enviar relatório via WhatsApp:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao enviar relatório via WhatsApp' 
    });
  }
};
