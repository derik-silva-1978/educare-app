
import { useState, useCallback, useMemo } from 'react';
import { Activity } from '@/types/activity';
import { ActivityWithStringDates } from '@/hooks/useActivities';
import { stringDatesToActivity } from '@/utils/activity-utils';
import { isSameDay, isWithinInterval, startOfDay, endOfDay, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

export const useCalendarActivities = (activities: Activity[]) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Memoize activities for the current month to avoid recalculations
  const currentMonthActivities = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    return activities.filter(activity => {
      const activityStartDate = new Date(activity.startDate);
      const activityEndDate = activity.endDate ? new Date(activity.endDate) : activityStartDate;
      
      // Check if activity falls within the current month
      return (
        (activityStartDate >= monthStart && activityStartDate <= monthEnd) ||
        (activityEndDate >= monthStart && activityEndDate <= monthEnd) ||
        (activityStartDate <= monthStart && activityEndDate >= monthEnd)
      );
    });
  }, [activities, currentMonth]);

  const getActivitiesForDay = useCallback((day: Date): Activity[] => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    
    // If the day is in the current month, use the filtered activities
    if (isSameMonth(day, currentMonth)) {
      return currentMonthActivities.filter(activity => {
        const activityStartDate = new Date(activity.startDate);
        const activityEndDate = activity.endDate ? new Date(activity.endDate) : activityStartDate;
        
        if (isSameDay(activityStartDate, day)) {
          return true;
        }
        
        if (activity.endDate && !isSameDay(activityStartDate, activityEndDate)) {
          return isWithinInterval(day, {
            start: activityStartDate,
            end: activityEndDate
          });
        }
        
        return false;
      });
    } else {
      // If outside current month, filter from all activities
      return activities.filter(activity => {
        const activityStartDate = new Date(activity.startDate);
        const activityEndDate = activity.endDate ? new Date(activity.endDate) : activityStartDate;
        
        if (isSameDay(activityStartDate, day)) {
          return true;
        }
        
        if (activity.endDate && !isSameDay(activityStartDate, activityEndDate)) {
          return isWithinInterval(day, {
            start: activityStartDate,
            end: activityEndDate
          });
        }
        
        return false;
      });
    }
  }, [activities, currentMonth, currentMonthActivities]);

  // Memoize daily activities based on selected date
  const dailyActivities = useMemo(() => 
    getActivitiesForDay(selectedDate), 
    [getActivitiesForDay, selectedDate]
  );

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    
    if (!isSameMonth(today, currentMonth)) {
      setCurrentMonth(today);
    }
  }, [currentMonth]);

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    dailyActivities,
    getActivitiesForDay,
    goToPreviousMonth,
    goToNextMonth,
    goToToday
  };
};

export default useCalendarActivities;
