
import { AssessmentLevel } from '@/types/assessment';

/**
 * Helper function to get a human-readable name for an assessment level
 */
export const getLevelName = (level: AssessmentLevel): string => {
  const levelNames: Record<string, string> = {
    'not_present': 'Não Presente',
    'emerging': 'Emergente',
    'developing': 'Em Desenvolvimento',
    'developing_strong': 'Desenvolvimento Avançado',
    'acquired': 'Adquirido',
    'achieved': 'Alcançado',
    'mastered': 'Dominado',
    'low': 'Baixo',
    'medium': 'Médio',
    'high': 'Alto'
  };
  
  return level ? levelNames[level] || String(level) : 'Não avaliado';
};

export const getLevelLabel = getLevelName;
