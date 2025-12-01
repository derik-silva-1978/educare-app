
/**
 * Formats a diagnosis type string to a user-friendly label
 */
export const formatDiagnosisType = (type?: string): string => {
  if (!type) return 'Não especificado';
  
  const diagnosisMap: Record<string, string> = {
    'autism': 'Transtorno do Espectro Autista',
    'adhd': 'TDAH',
    'intellectual': 'Deficiência Intelectual',
    'intellectual_disability': 'Deficiência Intelectual',
    'down_syndrome': 'Síndrome de Down',
    'cerebral_palsy': 'Paralisia Cerebral',
    'dyslexia': 'Dislexia',
    'dyscalculia': 'Discalculia',
    'hearing_impairment': 'Deficiência Auditiva',
    'visual_impairment': 'Deficiência Visual',
    'multiple': 'Deficiências Múltiplas',
    'other': 'Outro'
  };
  
  return diagnosisMap[type] || type;
};

/**
 * Formats a date string to a localized format
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Data não informada';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Formats a therapy name to a user-friendly label
 */
export const formatTherapyName = (therapy: string): string => {
  const therapyMap: Record<string, string> = {
    'speech': 'Fonoaudiologia',
    'occupational': 'Terapia Ocupacional',
    'behavioral': 'Terapia Comportamental',
    'psychotherapy': 'Psicoterapia',
    'physical': 'Fisioterapia',
    'psychology': 'Psicologia',
    'equine': 'Equoterapia'
  };
  
  return therapyMap[therapy] || therapy;
};

/**
 * Formats a support level code to a user-friendly label
 */
export const formatSupportLevel = (level?: string): string => {
  if (!level) return 'Não especificado';
  
  const supportLevelMap: Record<string, string> = {
    'level1': 'Nível 1 - Necessidade de Suporte',
    'level2': 'Nível 2 - Necessidade de Suporte Substancial',
    'level3': 'Nível 3 - Necessidade de Suporte Muito Substancial',
    'minimal': 'Suporte Mínimo',
    'moderate': 'Suporte Moderado',
    'substantial': 'Suporte Substancial',
    'very_substantial': 'Suporte Muito Substancial',
    'intensive': 'Suporte Intensivo'
  };
  
  return supportLevelMap[level] || level;
};

/**
 * Formats an accommodation type to a user-friendly label
 */
export const formatAccommodation = (accommodation: string): string => {
  const accommodationMap: Record<string, string> = {
    'extended_time': 'Tempo Estendido',
    'separate_setting': 'Ambiente Separado',
    'large_print': 'Impressão Ampliada',
    'text_to_speech': 'Texto para Fala',
    'speech_to_text': 'Fala para Texto',
    'frequent_breaks': 'Pausas Frequentes',
    'preferential_seating': 'Assento Preferencial',
    'visual_supports': 'Suportes Visuais',
    'manipulatives': 'Materiais Manipuláveis',
    'calculator': 'Calculadora',
    'noise_cancelling': 'Cancelamento de Ruído',
    'scribe': 'Escriba',
    'reader': 'Leitor',
    'modified_assignments': 'Tarefas Modificadas',
    'modified_materials': 'Materiais Adaptados',
    'assistive_technology': 'Tecnologia Assistiva',
    'quiet_environment': 'Ambiente Tranquilo',
    'breaks': 'Pausas Regulares',
    'other': 'Outro'
  };
  
  return accommodationMap[accommodation] || accommodation;
};
