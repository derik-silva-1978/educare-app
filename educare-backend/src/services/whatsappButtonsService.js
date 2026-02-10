const WhatsappService = require('./whatsappService');

function formatButtonMessage(phone, bodyText, buttons, options = {}) {
  const cleanPhone = phone.replace(/\D/g, '');

  const formattedButtons = buttons.slice(0, 3).map(btn => ({
    type: 'reply',
    reply: {
      id: btn.id,
      title: btn.text.substring(0, 20)
    }
  }));

  return {
    number: cleanPhone,
    options: {
      delay: options.delay || 200,
      presence: options.presence || 'composing'
    },
    buttonMessage: {
      text: bodyText,
      buttons: formattedButtons,
      footerText: options.footer || 'Educare+ 💜'
    }
  };
}

function formatListMessage(phone, bodyText, sections, options = {}) {
  const cleanPhone = phone.replace(/\D/g, '');

  const formattedSections = sections.map(section => ({
    title: section.title || 'Opções',
    rows: section.rows.slice(0, 10).map(row => ({
      rowId: row.id,
      title: row.title.substring(0, 24),
      description: row.description ? row.description.substring(0, 72) : undefined
    }))
  }));

  return {
    number: cleanPhone,
    options: {
      delay: options.delay || 200,
      presence: options.presence || 'composing'
    },
    listMessage: {
      title: options.title || 'Opções',
      description: bodyText,
      buttonText: options.buttonText || 'Ver opções',
      footerText: options.footer || 'Educare+ 💜',
      sections: formattedSections
    }
  };
}

function formatQuizButtons(phone, questionText, answers, options = {}) {
  const buttons = answers.slice(0, 3).map((answer, i) => ({
    id: `quiz_${options.quizId || 'q'}_${i}`,
    text: answer.text || answer
  }));

  return formatButtonMessage(phone, questionText, buttons, {
    footer: options.footer || 'Quiz Educare+ 📝',
    ...options
  });
}

function formatFeedbackButtons(phone) {
  const buttons = [
    { id: 'fb_1', text: '⭐ 1-2 estrelas' },
    { id: 'fb_3', text: '⭐⭐⭐ 3 estrelas' },
    { id: 'fb_5', text: '⭐⭐⭐⭐⭐ 4-5' }
  ];

  return formatButtonMessage(
    phone,
    'Como foi sua experiência até agora? ⭐\n\nSua opinião nos ajuda a melhorar!',
    buttons,
    { footer: 'Avaliação Educare+' }
  );
}

function formatContextSelectionButtons(phone) {
  const buttons = [
    { id: 'ctx_child', text: '👶 Sobre meu bebê' },
    { id: 'ctx_mother', text: '💚 Sobre mim' }
  ];

  return formatButtonMessage(
    phone,
    'Sobre o que você quer falar agora? 💬',
    buttons,
    { footer: 'TitiNauta' }
  );
}

function formatMenuButtons(phone, activeContext) {
  const contextLabel = activeContext === 'child' ? '👶 Bebê' : activeContext === 'mother' ? '💚 Saúde' : '💬 Geral';

  const buttons = [
    { id: 'action_quiz', text: '📝 Fazer quiz' },
    { id: 'action_content', text: '📚 Ver conteúdos' },
    { id: 'action_change', text: '🔄 Mudar contexto' }
  ];

  return formatButtonMessage(
    phone,
    `Como posso te ajudar? [${contextLabel}]`,
    buttons,
    { footer: 'Menu TitiNauta' }
  );
}

async function sendButtonMessage(phone, bodyText, buttons, options = {}) {
  const config = WhatsappService.config;
  if (!config.apiKey) {
    return { success: false, error: 'Evolution API não configurada' };
  }

  const payload = formatButtonMessage(phone, bodyText, buttons, options);
  const url = `${config.apiUrl}/message/sendButtons/${config.instanceName}`;

  try {
    const response = await WhatsappService._makeEvolutionRequest(url, payload);
    return {
      success: response.ok,
      messageId: response.data?.key?.id,
      error: !response.ok ? `Status ${response.status}` : null
    };
  } catch (error) {
    console.error('[WhatsAppButtons] Error sending buttons:', error.message);
    const fallbackText = `${bodyText}\n\n${buttons.map((b, i) => `${i + 1}️⃣ ${b.text}`).join('\n')}`;
    return WhatsappService.sendMessage(phone, fallbackText);
  }
}

async function sendListMessage(phone, bodyText, sections, options = {}) {
  const config = WhatsappService.config;
  if (!config.apiKey) {
    return { success: false, error: 'Evolution API não configurada' };
  }

  const payload = formatListMessage(phone, bodyText, sections, options);
  const url = `${config.apiUrl}/message/sendList/${config.instanceName}`;

  try {
    const response = await WhatsappService._makeEvolutionRequest(url, payload);
    return {
      success: response.ok,
      messageId: response.data?.key?.id,
      error: !response.ok ? `Status ${response.status}` : null
    };
  } catch (error) {
    console.error('[WhatsAppButtons] Error sending list:', error.message);
    const fallbackText = `${bodyText}\n\n${sections.map(s => s.rows.map((r, i) => `${i + 1}. ${r.title}`).join('\n')).join('\n')}`;
    return WhatsappService.sendMessage(phone, fallbackText);
  }
}

module.exports = {
  formatButtonMessage,
  formatListMessage,
  formatQuizButtons,
  formatFeedbackButtons,
  formatContextSelectionButtons,
  formatMenuButtons,
  sendButtonMessage,
  sendListMessage
};
