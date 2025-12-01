
import { differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays } from 'date-fns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formats a date in a localized string
 */
export const formatDate = (date: Date | string, formatString: string = 'PPP'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString, { locale: ptBR });
};

/**
 * Calculates age in years, months, weeks, or days
 */
export const calculateAge = (birthDate: Date | string): string => {
  if (!birthDate) return '';
  
  const today = new Date();
  const dateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  
  const years = differenceInYears(today, dateObj);
  
  if (years > 0) {
    return years === 1 ? '1 ano' : `${years} anos`;
  }
  
  const months = differenceInMonths(today, dateObj);
  
  if (months > 0) {
    return months === 1 ? '1 mês' : `${months} meses`;
  }
  
  const weeks = differenceInWeeks(today, dateObj);
  
  if (weeks > 0) {
    return weeks === 1 ? '1 semana' : `${weeks} semanas`;
  }
  
  const days = differenceInDays(today, dateObj);
  
  return days === 1 ? '1 dia' : `${days} dias`;
};

/**
 * Returns a friendly date format for children's age range
 */
export const getAgeRangeText = (minMonths: number, maxMonths: number): string => {
  if (minMonths < 1) {
    if (maxMonths < 1) {
      return 'Recém-nascido';
    }
    return `0-${maxMonths} meses`;
  }
  
  if (minMonths >= 12 && maxMonths >= 12) {
    const minYears = Math.floor(minMonths / 12);
    const maxYears = Math.floor(maxMonths / 12);
    
    if (minYears === maxYears) {
      return `${minYears} anos`;
    }
    
    return `${minYears}-${maxYears} anos`;
  }
  
  if (maxMonths >= 12) {
    const maxYears = Math.floor(maxMonths / 12);
    return `${minMonths} meses - ${maxYears} anos`;
  }
  
  return `${minMonths}-${maxMonths} meses`;
};
