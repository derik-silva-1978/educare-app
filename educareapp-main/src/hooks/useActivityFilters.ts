
import { useState, useCallback, useMemo } from 'react';
import { Activity } from '@/types/activity';
import { startOfDay, endOfDay, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Export these enums so they can be imported by other components
export enum StatusFilter {
  ALL = 'all',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PriorityFilter {
  ALL = 'all',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum TimeFrame {
  ALL = 'all',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'this_week',
  NEXT_WEEK = 'next_week',
  THIS_MONTH = 'this_month',
  CUSTOM = 'custom'
}

interface ActivityFilters {
  searchTerm: string;
  status: string[];
  priority: string[];
  student: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

const useActivityFilters = (activities: Activity[]) => {
  const [filters, setFilters] = useState<ActivityFilters>({
    searchTerm: '',
    status: [],
    priority: [],
    student: [],
    dateRange: {
      start: null,
      end: null
    }
  });
  
  // Update search term
  const updateSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: term
    }));
  }, []);
  
  // Update status filters
  const updateStatusFilters = useCallback((statuses: string[]) => {
    setFilters(prev => ({
      ...prev,
      status: statuses
    }));
  }, []);
  
  // Update priority filters
  const updatePriorityFilters = useCallback((priorities: string[]) => {
    setFilters(prev => ({
      ...prev,
      priority: priorities
    }));
  }, []);
  
  // Update student filters
  const updateStudentFilters = useCallback((students: string[]) => {
    setFilters(prev => ({
      ...prev,
      student: students
    }));
  }, []);
  
  // Update date range
  const updateDateRange = useCallback((start: Date | null, end: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        start,
        end
      }
    }));
  }, []);

  // Update all filters at once from timeframe selection
  const updateFromTimeFrame = useCallback((timeFrame: TimeFrame) => {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (timeFrame) {
      case TimeFrame.TODAY:
        start = startOfDay(today);
        end = endOfDay(today);
        break;
      case TimeFrame.TOMORROW:
        start = startOfDay(addDays(today, 1));
        end = endOfDay(addDays(today, 1));
        break;
      case TimeFrame.THIS_WEEK:
        start = startOfWeek(today, { weekStartsOn: 1 });
        end = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case TimeFrame.NEXT_WEEK:
        start = startOfWeek(addDays(today, 7), { weekStartsOn: 1 });
        end = endOfWeek(addDays(today, 7), { weekStartsOn: 1 });
        break;
      case TimeFrame.THIS_MONTH:
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case TimeFrame.ALL:
        start = null;
        end = null;
        break;
      // CUSTOM is handled by direct date selection
    }

    setFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  }, []);
  
  // Apply filters to activities
  const filteredActivities = useMemo(() => {
    let result = [...activities];
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(activity => 
        activity.title.toLowerCase().includes(term) ||
        (activity.description && activity.description.toLowerCase().includes(term)) ||
        (activity.studentName && activity.studentName.toLowerCase().includes(term))
      );
    }
    
    // Filter by status
    if (filters.status.length > 0) {
      result = result.filter(activity => filters.status.includes(activity.status));
    }
    
    // Filter by priority
    if (filters.priority.length > 0) {
      result = result.filter(activity => filters.priority.includes(activity.priority));
    }
    
    // Filter by student
    if (filters.student.length > 0) {
      result = result.filter(activity => 
        activity.studentId && filters.student.includes(activity.studentId)
      );
    }
    
    // Filter by date range
    if (filters.dateRange.start) {
      const startDate = filters.dateRange.start;
      result = result.filter(activity => new Date(activity.startDate) >= startDate);
    }
    
    if (filters.dateRange.end) {
      const endDate = filters.dateRange.end;
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      result = result.filter(activity => new Date(activity.startDate) <= endDate);
    }
    
    return result;
  }, [activities, filters]);
  
  // Sort activities by date (newest first)
  const sortedActivities = useMemo(() => {
    return [...filteredActivities].sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [filteredActivities]);
  
  return {
    filters,
    updateSearchTerm,
    updateStatusFilters,
    updatePriorityFilters,
    updateStudentFilters,
    updateDateRange,
    updateFromTimeFrame,
    filteredActivities,
    sortedActivities
  };
};

export default useActivityFilters;
