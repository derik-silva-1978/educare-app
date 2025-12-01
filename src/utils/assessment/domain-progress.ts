
import { DomainProgress, AssessmentItem, DevelopmentDomain } from '@/types/assessment';

/**
 * Calculate domain progress based on assessment items
 */
export const calculateDomainProgress = (
  items: AssessmentItem[],
  domains: DevelopmentDomain[]
): DomainProgress[] => {
  // Group items by domain
  const itemsByDomain: Record<string, AssessmentItem[]> = {};
  
  // Initialize domains
  domains.forEach(domain => {
    itemsByDomain[domain] = [];
  });
  
  // Populate domains with items
  items.forEach(item => {
    const domain = item.domain as string;
    if (domain in itemsByDomain) {
      itemsByDomain[domain].push(item);
    }
  });
  
  // Calculate progress for each domain
  return domains.map(domain => {
    const domainItems = itemsByDomain[domain] || [];
    const total = domainItems.length;
    const completed = domainItems.filter(item => (item as any).level !== null || item.response !== null).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      domain,
      total,
      completed,
      percentage,
      progress: percentage,  // For compatibility
      score: percentage      // For compatibility
    };
  });
};

/**
 * Calculate overall progress from domain progress data
 */
export const calculateOverallProgress = (domainProgress: DomainProgress[]): number => {
  if (domainProgress.length === 0) return 0;
  
  const totalItems = domainProgress.reduce((sum, domain) => sum + domain.total, 0);
  const completedItems = domainProgress.reduce((sum, domain) => sum + domain.completed, 0);
  
  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
};

export default {
  calculateDomainProgress,
  calculateOverallProgress
};
