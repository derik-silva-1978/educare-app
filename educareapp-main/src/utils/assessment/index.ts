
// Re-export all assessment utilities
export * from './domain-utils';
export * from './levels';
export * from './item-generator';

// Export format utility
export const formatAssessmentDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
