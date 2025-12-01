
import { DevelopmentDomain, DomainLabels } from '@/types/assessment';

/**
 * Helper function to get a human-readable name for a development domain
 */
export const getDomainDisplayName = (domain: DevelopmentDomain): string => {
  return DomainLabels[domain] || domain;
};

/**
 * Helper function to get a human-readable name for a development domain
 * @deprecated Use getDomainDisplayName instead
 */
export const getDomainLabel = (domain: DevelopmentDomain): string => {
  return DomainLabels[domain] || domain;
};
