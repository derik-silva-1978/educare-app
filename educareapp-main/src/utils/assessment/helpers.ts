
import { DevelopmentDomain } from '@/types/assessment';

/**
 * Creates a record with all development domains
 * @param values Object with domain values
 * @param defaultValue Default value for domains not specified
 * @returns Record with all domains
 */
export const createDomainRecord = <T>(
  values: Partial<Record<DevelopmentDomain, T>>, 
  defaultValue: T
): Record<DevelopmentDomain, T> => {
  const allDomains: DevelopmentDomain[] = [
    'motor',
    'language',
    'social',
    'sensory',
    'cognitive',
    'emotional',
    'communication',
    'social_emotional',
    'self_care',
    'maternal_health',
    'adaptive',
    'behavioral',
    'academic'
  ];

  const result: Partial<Record<DevelopmentDomain, T>> = {};

  for (const domain of allDomains) {
    result[domain] = values[domain] !== undefined ? values[domain] : defaultValue;
  }

  return result as Record<DevelopmentDomain, T>;
};

/**
 * Ensures that select values are never empty strings
 * @param value The value to check
 * @param defaultValue Default value to use if value is empty
 * @returns A non-empty string value
 */
export const ensureNonEmptyValue = (value: string | null | undefined, defaultValue: string): string => {
  if (!value || value === '') {
    return defaultValue;
  }
  return value;
};
