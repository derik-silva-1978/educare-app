
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AssessmentDomain } from '@/types/assessment';
import { Calendar, BookOpen, Brain, HeartPulse, Users } from 'lucide-react';

/**
 * Format assessment date according to Brazilian locale
 */
export const formatAssessmentDate = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Get the full label for a domain
 */
export const getDomainLabel = (domain: AssessmentDomain): string => {
  const domainLabels: Record<string, string> = {
    cognitive: 'Desenvolvimento Cognitivo',
    motor: 'Desenvolvimento Físico/Motor',
    social: 'Desenvolvimento Social',
    communication: 'Comunicação e Linguagem',
    language: 'Linguagem',
    adaptive: 'Adaptativo',
    sensory: 'Sensorial'
  };
  
  return domainLabels[domain] || domain;
};

/**
 * Get a shorter label for a domain (for mobile views)
 */
export const getShortDomainLabel = (domain: AssessmentDomain): string => {
  const shortLabels: Record<string, string> = {
    cognitive: 'Cognitivo',
    motor: 'Físico/Motor',
    social: 'Social',
    communication: 'Comunicação',
    language: 'Linguagem',
    adaptive: 'Adaptativo',
    sensory: 'Sensorial'
  };
  
  return shortLabels[domain] || domain;
};

/**
 * Get the icon name for a domain
 */
export const getDomainIcon = (domain: AssessmentDomain): string => {
  const domainIcons: Record<string, string> = {
    cognitive: 'Brain',
    motor: 'Activity',
    social: 'Users',
    communication: 'MessageSquare',
    language: 'MessageSquare',
    adaptive: 'CheckCircle',
    sensory: 'Eye'
  };
  
  return domainIcons[domain] || 'Circle';
};
