
import { differenceInMonths, differenceInYears, differenceInWeeks, format, isAfter } from 'date-fns';

/**
 * Calculate age from birthdate in human-readable format
 */
export function calculateAge(birthDateStr?: string): string {
  if (!birthDateStr) return '';
  
  try {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    // Check if birthdate is valid and not in the future
    if (isNaN(birthDate.getTime()) || isAfter(birthDate, today)) {
      return '';
    }
    
    const years = differenceInYears(today, birthDate);
    
    // For infants less than 1 year old, show months
    if (years === 0) {
      const months = differenceInMonths(today, birthDate);
      return months <= 1 ? `${months} mês` : `${months} meses`;
    }
    
    return years <= 1 ? `${years} ano` : `${years} anos`;
  } catch (error) {
    console.error('Error calculating age:', error);
    return '';
  }
}

/**
 * Calculate age in months from birthdate
 */
export function calculateAgeInMonths(birthDateStr?: string): number {
  if (!birthDateStr) return 0;
  
  try {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    // Check if birthdate is valid and not in the future
    if (isNaN(birthDate.getTime()) || isAfter(birthDate, today)) {
      console.error('Invalid or future birthdate:', birthDateStr);
      return 0;
    }
    
    const months = differenceInMonths(today, birthDate);
    
    // ALWAYS round up to the next month as requested
    // If there are any days completed in the current month, consider it as the full month
    const yearsDiff = today.getFullYear() - birthDate.getFullYear();
    const monthsDiff = today.getMonth() - birthDate.getMonth();
    const daysDiff = today.getDate() - birthDate.getDate();
    
    let totalMonths = yearsDiff * 12 + monthsDiff;
    
    // If we have completed any days in the current month, round up
    if (daysDiff >= 0) {
      totalMonths++;
    }
    
    return Math.max(0, totalMonths); // Ensure non-negative
  } catch (error) {
    console.error('Error calculating age in months:', error);
    return 0;
  }
}

/**
 * Calculate age in weeks from birthdate
 */
export function calculateAgeInWeeks(birthDateStr?: string): number {
  if (!birthDateStr) return 0;
  
  try {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    // Check if birthdate is valid and not in the future
    if (isNaN(birthDate.getTime()) || isAfter(birthDate, today)) {
      console.error('Invalid or future birthdate:', birthDateStr);
      return 0;
    }
    
    const weeks = differenceInWeeks(today, birthDate);
    return Math.max(0, weeks); // Ensure non-negative
  } catch (error) {
    console.error('Error calculating age in weeks:', error);
    return 0;
  }
}

/**
 * Get age display with weeks for babies under 6 months
 */
export function getDetailedAgeDisplay(birthDateStr?: string): string {
  if (!birthDateStr) return '';
  
  try {
    const ageInMonths = calculateAgeInMonths(birthDateStr);
    const ageInWeeks = calculateAgeInWeeks(birthDateStr);
    
    // For babies under 6 months, show weeks
    if (ageInMonths < 6) {
      if (ageInWeeks === 0) return 'Recém-nascido';
      if (ageInWeeks === 1) return '1 semana';
      if (ageInWeeks < 4) return `${ageInWeeks} semanas`;
      
      // Show weeks and months for 1-6 months
      const remainingWeeks = ageInWeeks % 4;
      const monthsPart = Math.floor(ageInWeeks / 4);
      
      if (remainingWeeks === 0) {
        return monthsPart === 1 ? '1 mês' : `${monthsPart} meses`;
      } else {
        const monthsText = monthsPart === 1 ? '1 mês' : `${monthsPart} meses`;
        const weeksText = remainingWeeks === 1 ? '1 semana' : `${remainingWeeks} semanas`;
        return `${monthsText} e ${weeksText}`;
      }
    }
    
    // For older babies, use the regular age display
    return calculateAge(birthDateStr);
  } catch (error) {
    console.error('Error calculating detailed age:', error);
    return calculateAge(birthDateStr);
  }
}

/**
 * Validate if a birthdate is valid (not in future, not too old)
 */
export function isValidBirthdate(birthDateStr: string): boolean {
  try {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    const maxAge = new Date();
    maxAge.setFullYear(maxAge.getFullYear() - 18); // Max 18 years old for child
    
    return !isNaN(birthDate.getTime()) && 
           !isAfter(birthDate, today) && 
           !isAfter(maxAge, birthDate);
  } catch {
    return false;
  }
}
