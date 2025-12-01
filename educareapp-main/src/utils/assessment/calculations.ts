
import { AssessmentForm } from '@/types/assessment';

/**
 * Calculate assessment progress based on completed items
 * @param assessment The assessment form
 * @returns Progress percentage (0-100)
 */
export const calculateAssessmentProgress = (assessment: AssessmentForm): number => {
  if (!assessment || !assessment.items || assessment.items.length === 0) {
    return 0;
  }
  
  const totalItems = assessment.items.length;
  const completedItems = assessment.items.filter(item => item.level !== null).length;
  
  return Math.round((completedItems / totalItems) * 100);
};

/**
 * Calculate domain completion percentage
 * @param assessment The assessment form
 * @param domain The domain to calculate completion for
 * @returns Domain completion percentage (0-100)
 */
export const calculateDomainCompletion = (assessment: AssessmentForm, domain: string): number => {
  if (!assessment || !assessment.items || assessment.items.length === 0) {
    return 0;
  }
  
  const domainItems = assessment.items.filter(item => item.domain === domain);
  
  if (domainItems.length === 0) {
    return 0;
  }
  
  const completedDomainItems = domainItems.filter(item => item.level !== null);
  
  return Math.round((completedDomainItems.length / domainItems.length) * 100);
};
