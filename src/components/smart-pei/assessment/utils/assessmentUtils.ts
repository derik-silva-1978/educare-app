
import { AssessmentForm } from '@/types/assessmentTypes';

// Calculate the completion percentage for an assessment
export const calculateCompletionPercentage = (assessment: AssessmentForm): number => {
  if (!assessment.items || assessment.items.length === 0) {
    return 0;
  }
  
  const totalItems = assessment.items.length;
  const completedItems = assessment.items.filter(item => item.level !== null).length;
  
  return Math.round((completedItems / totalItems) * 100);
};

// Format assessment date for display
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
    return 'Data desconhecida';
  }
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'agora mesmo';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'data desconhecida';
  }
};

// Get display name for assessment domain
export const getDomainDisplayName = (domain: string): string => {
  const domainNames: Record<string, string> = {
    'cognitive': 'Cognitivo',
    'motor': 'Motor',
    'social': 'Social',
    'language': 'Linguagem',
    'adaptive': 'Adaptativo',
    'communication': 'Comunicação',
    'sensory': 'Sensorial'
  };
  
  return domainNames[domain] || domain;
};
