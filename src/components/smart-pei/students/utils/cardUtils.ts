
import { Student } from '@/hooks/useStudents';

/**
 * Get badge color class based on diagnosis type
 */
export const getDiagnosisBadgeClass = (type?: string) => {
  switch (type) {
    case 'autism':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'adhd':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
    case 'intellectual':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
    case 'down':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'dyslexia':
      return 'bg-rose-100 text-rose-800 hover:bg-rose-100';
    case 'dysphasia':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
    case 'other':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

/**
 * Get diagnosis label for display
 */
export const getDiagnosisLabel = (type?: string) => {
  switch (type) {
    case 'autism':
      return 'TEA';
    case 'adhd':
      return 'TDAH';
    case 'intellectual':
      return 'DI';
    case 'down':
      return 'Síndrome de Down';
    case 'dyslexia':
      return 'Dislexia';
    case 'dysphasia':
      return 'Disfasia';
    case 'other':
      return 'Outro';
    default:
      return '';
  }
};

/**
 * Format grade level for display
 */
export const formatGradeLevel = (gradeLevel: string) => {
  if (gradeLevel === 'preschool') {
    return 'Pré-escolar';
  } else {
    return `${gradeLevel}º Ano`;
  }
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};
