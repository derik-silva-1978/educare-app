const { createCanvas } = require('canvas');

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCard(ctx, x, y, width, height, radius = 16) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.fill();
  ctx.restore();
}

function drawProgressBar(ctx, x, y, width, height, progress, color) {
  ctx.fillStyle = '#E5E7EB';
  drawRoundedRect(ctx, x, y, width, height, height / 2);
  ctx.fill();

  if (progress > 0) {
    const fillWidth = Math.max(height, width * (progress / 100));
    ctx.fillStyle = color;
    drawRoundedRect(ctx, x, y, fillWidth, height, height / 2);
    ctx.fill();
  }
}

async function generateReportImage(reportData) {
  const WIDTH = 800;
  const HEIGHT = 1200;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#F3F4F6';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, 160);
  gradient.addColorStop(0, '#2563EB');
  gradient.addColorStop(1, '#7C3AED');
  ctx.fillStyle = gradient;
  drawRoundedRect(ctx, 0, 0, WIDTH, 160, 0);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('Educare+', 40, 55);

  ctx.font = '20px sans-serif';
  const nameText = `${reportData.babyName} — ${reportData.ageText}`;
  ctx.fillText(nameText, 40, 95);

  ctx.font = '16px sans-serif';
  ctx.globalAlpha = 0.85;
  ctx.fillText(`Relatório Semanal — Semana ${reportData.journeyWeek}`, 40, 130);
  ctx.globalAlpha = 1.0;

  const cardX = 30;
  const cardWidth = WIDTH - 60;

  drawCard(ctx, cardX, 180, cardWidth, 400);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Progresso do Desenvolvimento', cardX + 30, 220);

  const domains = reportData.domains || [];
  const barStartY = 250;
  const barSpacing = 70;
  const barX = cardX + 160;
  const barWidth = cardWidth - 250;
  const barHeight = 20;

  domains.forEach((domain, i) => {
    const y = barStartY + i * barSpacing;

    ctx.fillStyle = '#374151';
    ctx.font = '18px sans-serif';
    ctx.fillText(`${domain.emoji} ${domain.name}`, cardX + 30, y + 15);

    drawProgressBar(ctx, barX, y, barWidth, barHeight, domain.score, domain.color);

    ctx.fillStyle = '#6B7280';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${domain.score}%`, barX + barWidth + 12, y + 15);
  });

  drawCard(ctx, cardX, 620, cardWidth, 180);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('💡 Insights', cardX + 30, 660);

  ctx.fillStyle = '#4B5563';
  ctx.font = '15px sans-serif';
  const insights = reportData.insights || [];
  insights.forEach((insight, i) => {
    const insightY = 695 + i * 30;
    const maxWidth = cardWidth - 60;
    const text = insight.length > 80 ? insight.substring(0, 77) + '...' : insight;
    ctx.fillText(`• ${text}`, cardX + 30, insightY);
  });

  drawCard(ctx, cardX, 820, cardWidth, 280);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('🏆 Marcos Alcançados', cardX + 30, 860);

  const milestones = reportData.milestones || [];
  ctx.font = '15px sans-serif';
  milestones.forEach((milestone, i) => {
    const msY = 895 + i * 32;
    if (msY > 1080) return;
    const icon = milestone.completed ? '✅' : '⏳';
    ctx.fillStyle = milestone.completed ? '#059669' : '#9CA3AF';
    ctx.fillText(`${icon}  ${milestone.period} • ${milestone.text}`, cardX + 30, msY);
  });

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📱 Relatório completo disponível na plataforma Educare+', WIDTH / 2, 1150);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.font = '12px sans-serif';
  ctx.fillText('Educare+ © 2026', WIDTH / 2, 1180);
  ctx.textAlign = 'left';

  return canvas.toBuffer('image/png');
}

function generateAsciiReport(reportData) {
  const lines = [];

  lines.push(`📊 *Progresso do ${reportData.babyName} — Semana ${reportData.journeyWeek}*`);
  lines.push('');

  const domains = reportData.domains || [];
  domains.forEach((domain) => {
    const filled = Math.round(domain.score / 10);
    const empty = 10 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const label = `${domain.emoji} ${domain.name}`.padEnd(16);
    lines.push(`${label} ${bar} ${domain.score}%`);
  });

  lines.push('');

  const insights = reportData.insights || [];
  insights.forEach((insight) => {
    lines.push(`💡 _${insight}_`);
  });

  lines.push('');
  lines.push('🏆 *Marcos Alcançados:*');

  const milestones = reportData.milestones || [];
  milestones.forEach((ms) => {
    const icon = ms.completed ? '✅' : '⏳';
    lines.push(`${icon} ${ms.period} • ${ms.text}`);
  });

  lines.push('');
  lines.push('📱 _Relatório completo disponível na plataforma Educare+_');

  return lines.join('\n');
}

function getDefaultReportData(babyName, babyGender, ageWeeks) {
  const ageMonths = Math.floor(ageWeeks / 4);
  const ageText = ageMonths < 1
    ? `${ageWeeks} semanas`
    : ageMonths === 1
      ? '1 mês'
      : `${ageMonths} meses`;

  const baseFactor = Math.min(ageWeeks / 52, 1);
  const randomVariation = () => Math.floor(Math.random() * 15) - 7;

  const cognitivo = Math.min(100, Math.max(10, Math.round(55 + baseFactor * 30 + randomVariation())));
  const linguagem = Math.min(100, Math.max(10, Math.round(45 + baseFactor * 25 + randomVariation())));
  const motor = Math.min(100, Math.max(10, Math.round(60 + baseFactor * 30 + randomVariation())));
  const social = Math.min(100, Math.max(10, Math.round(50 + baseFactor * 25 + randomVariation())));
  const criativo = Math.min(100, Math.max(10, Math.round(45 + baseFactor * 20 + randomVariation())));

  const domains = [
    { name: 'Cognitivo', emoji: '🧠', score: cognitivo, color: '#3B82F6' },
    { name: 'Linguagem', emoji: '🗣️', score: linguagem, color: '#8B5CF6' },
    { name: 'Motor', emoji: '🏃', score: motor, color: '#10B981' },
    { name: 'Social-Emocional', emoji: '💚', score: social, color: '#F59E0B' },
    { name: 'Criativo', emoji: '🎨', score: criativo, color: '#EC4899' }
  ];

  const pronoun = babyGender === 'female' ? 'a' : 'o';

  const insightPool = [
    `${babyName} está desenvolvendo bem a coordenação motora para a idade`,
    `Ótimo progresso na interação social! Continue estimulando`,
    `A comunicação está evoluindo conforme esperado para ${ageText}`,
    `Brinquedos coloridos ajudam no desenvolvimento cognitivo nesta fase`,
    `Conversar com ${pronoun} ${babyName} fortalece o vínculo e a linguagem`,
    `O sono adequado é fundamental para o desenvolvimento nesta fase`
  ];

  const insights = [];
  const usedIndexes = new Set();
  while (insights.length < 3 && usedIndexes.size < insightPool.length) {
    const idx = Math.floor(Math.random() * insightPool.length);
    if (!usedIndexes.has(idx)) {
      usedIndexes.add(idx);
      insights.push(insightPool[idx]);
    }
  }

  const allMilestones = [
    { text: 'Sorriso social', period: 'Social 0-2m', ageThreshold: 8 },
    { text: 'Sustenta a cabeça', period: 'Motor 3-4m', ageThreshold: 16 },
    { text: 'Segura objetos', period: 'Motor 3-5m', ageThreshold: 20 },
    { text: 'Rola de barriga', period: 'Motor 4-6m', ageThreshold: 24 },
    { text: 'Senta sem apoio', period: 'Motor 6-8m', ageThreshold: 32 },
    { text: 'Balbucia sílabas', period: 'Linguagem 6-9m', ageThreshold: 36 },
    { text: 'Engatinha', period: 'Motor 7-10m', ageThreshold: 40 },
    { text: 'Primeiras palavras', period: 'Linguagem 10-14m', ageThreshold: 52 },
    { text: 'Primeiros passos', period: 'Motor 12-15m', ageThreshold: 60 },
    { text: 'Anda com segurança', period: 'Motor 14-18m', ageThreshold: 72 }
  ];

  const milestones = allMilestones
    .filter(m => m.ageThreshold <= ageWeeks + 20)
    .slice(0, 6)
    .map(m => ({
      text: m.text,
      period: m.period,
      completed: ageWeeks >= m.ageThreshold
    }));

  return {
    babyName,
    babyGender,
    ageText,
    ageWeeks,
    journeyWeek: Math.max(1, Math.ceil(ageWeeks)),
    domains,
    insights,
    milestones
  };
}

module.exports = {
  generateReportImage,
  generateAsciiReport,
  getDefaultReportData
};
