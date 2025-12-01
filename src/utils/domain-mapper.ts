
// Simplified domain mapping for components that still need it
// This replaces the deleted quiz domain utilities

export type SimpleDomain = 'cognitive' | 'language' | 'social' | 'motor' | 'sensory' | 'emotional';

export const getDomainLabel = (domain: SimpleDomain): string => {
  const labels: Record<SimpleDomain, string> = {
    cognitive: 'Cognitivo',
    language: 'Linguagem',
    social: 'Social',
    motor: 'Motor',
    sensory: 'Sensorial',
    emotional: 'Emocional'
  };
  return labels[domain] || domain;
};

export const getDomainColor = (domain: SimpleDomain): string => {
  const colors: Record<SimpleDomain, string> = {
    cognitive: 'bg-blue-100 text-blue-800',
    language: 'bg-green-100 text-green-800',
    social: 'bg-purple-100 text-purple-800',
    motor: 'bg-orange-100 text-orange-800',
    sensory: 'bg-pink-100 text-pink-800',
    emotional: 'bg-red-100 text-red-800'
  };
  return colors[domain] || 'bg-gray-100 text-gray-800';
};
