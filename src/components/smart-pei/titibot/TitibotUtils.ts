
/**
 * Helper functions for Titibot components
 */

/**
 * Format message text with HTML for links and formatting
 * @param text - The message text to format
 * @returns Formatted HTML
 */
export const formatTitibotMessage = (text: string): string => {
  if (!text) return '';
  
  // Convert URLs to links
  let formattedText = text.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>'
  );
  
  // Convert markdown-style bullet points
  formattedText = formattedText.replace(/•\s(.*?)(?=(\n|$))/g, '<span class="flex gap-2 items-start"><span class="text-primary">•</span><span>$1</span></span>');
  
  // Handle lists with numbers (1. Item)
  formattedText = formattedText.replace(/(\d+)\.\s(.*?)(?=(\n|$))/g, '<span class="flex gap-2 items-start"><span class="text-primary">$1.</span><span>$2</span></span>');
  
  // Replace line breaks with <br>
  formattedText = formattedText.replace(/\n/g, '<br>');
  
  // Handle bold text with ** markers
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Handle italic text with * markers
  formattedText = formattedText.replace(/\*([^\*]+)\*/g, '<em class="italic">$1</em>');
  
  // Handle code blocks with ` markers
  formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
  
  // Handle headings with # (only h3 and h4 for chat messages)
  formattedText = formattedText.replace(/^###\s(.*)$/gm, '<h3 class="text-base font-bold mt-2 mb-1">$1</h3>');
  formattedText = formattedText.replace(/^####\s(.*)$/gm, '<h4 class="text-sm font-bold mt-2 mb-1">$1</h4>');

  // Split double line breaks for paragraphs
  const paragraphs = formattedText.split('<br><br>');
  return paragraphs.map(p => `<p class="mb-2">${p}</p>`).join('');
};

/**
 * Get dynamic suggestions based on user message
 */
export const getDynamicSuggestions = (userMessage: string): string[] => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('pei') || message.includes('plano')) {
    return [
      'Como implementar um PEI?',
      'Modelos de PEI',
      'Avaliação do PEI',
      'PEI e legislação'
    ];
  }
  
  if (message.includes('desenvolvimento') || message.includes('criança')) {
    return [
      'Marcos de desenvolvimento 3-4 anos',
      'Observar desenvolvimento infantil',
      'Sinais de alerta desenvolvimento',
      'Habilidades motoras por idade'
    ];
  }
  
  if (message.includes('atividade') || message.includes('atividades')) {
    return [
      'Atividades para autismo',
      'Atividades para TDAH',
      'Jogos adaptados',
      'Materiais sensoriais'
    ];
  }
  
  if (message.includes('bncc') || message.includes('educação infantil')) {
    return [
      'Competências da BNCC',
      'BNCC e Educação Especial',
      'Adaptações da BNCC',
      'BNCC e planejamento'
    ];
  }
  
  // Add more specific suggestions for assessments and goals
  if (message.includes('avaliação') || message.includes('avaliar')) {
    return [
      'Como avaliar o progresso no PEI?',
      'Ferramentas de avaliação',
      'Frequência de avaliação ideal',
      'Documentar evidências de progresso'
    ];
  }
  
  if (message.includes('objetivo') || message.includes('meta')) {
    return [
      'Como definir objetivos SMART',
      'Objetivos para comunicação',
      'Metas para habilidades sociais',
      'Adaptar objetivos curriculares'
    ];
  }
  
  // Default suggestions
  return [
    'O que é PEI?',
    'Marcos de desenvolvimento',
    'Atividades adaptadas',
    'BNCC Educação Infantil'
  ];
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Handle keyboard events for chat input
 * @param e - The keyboard event
 * @param handleSubmit - The function to handle message submission
 * @returns Boolean indicating if default behavior should be prevented
 */
export const handleChatKeyboard = (
  e: React.KeyboardEvent<HTMLInputElement>,
  handleSubmit: (e: React.FormEvent) => void
): boolean => {
  // Submit on Enter (without Shift)
  if (e.key === 'Enter' && !e.shiftKey) {
    handleSubmit(e as unknown as React.FormEvent);
    return true; // Prevent default to avoid newline
  }
  
  // Allow Shift+Enter for newlines
  if (e.key === 'Enter' && e.shiftKey) {
    return false; // Don't prevent default, allow newline
  }
  
  return false; // Don't prevent default for other keys
};

/**
 * Format timestamp for chat messages
 */
export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) {
    return 'agora';
  } else if (diffInMins < 60) {
    return `${diffInMins}m atrás`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h atrás`;
  } else if (diffInDays === 1) {
    return 'ontem';
  } else {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }
};
