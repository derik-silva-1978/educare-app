
import { parseISO, isValid } from 'date-fns';
import { Activity, ActivityWithStringDates } from '@/types/activity';

// Helper function to safely format dates
export const formatDateString = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  
  try {
    // Try to parse with date-fns
    const date = parseISO(dateStr);
    if (!isValid(date)) {
      return dateStr;
    }
    return dateStr;
  } catch (error) {
    return dateStr;
  }
};

// Helper to check if a date is valid
export const isValidDate = (dateStr: string | undefined): boolean => {
  if (!dateStr) return false;
  
  try {
    const date = parseISO(dateStr);
    return isValid(date);
  } catch (error) {
    return false;
  }
};

// Safely format date objects or strings for API
export const formatDateForAPI = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  try {
    // If it's a Date object
    if (date instanceof Date) {
      return date.toISOString();
    }
    
    // If it's a string
    if (typeof date === 'string') {
      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        return parsedDate.toISOString();
      }
      return date;
    }
    
    return '';
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Convert an activity with string dates to an activity with Date objects
 */
export const stringDatesToActivity = (activity: ActivityWithStringDates): Activity => {
  const result: any = { ...activity };
  
  // Convert string dates to Date objects
  if (activity.startDate) {
    result.startDate = new Date(activity.startDate);
  }
  
  if (activity.endDate) {
    result.endDate = new Date(activity.endDate);
  }
  
  if (activity.reminderDate) {
    result.reminderDate = new Date(activity.reminderDate);
  }
  
  return result as Activity;
};

/**
 * Convert an activity with Date objects to an activity with string dates
 */
export const activityToStringDates = (activity: Activity): ActivityWithStringDates => {
  const result: any = { ...activity };
  
  // Convert Date objects to ISO strings
  if (activity.startDate) {
    result.startDate = formatDateForAPI(activity.startDate);
  }
  
  if (activity.endDate) {
    result.endDate = activity.endDate ? formatDateForAPI(activity.endDate) : undefined;
  }
  
  if (activity.reminderDate) {
    result.reminderDate = activity.reminderDate ? formatDateForAPI(activity.reminderDate) : undefined;
  }
  
  return result as ActivityWithStringDates;
};
