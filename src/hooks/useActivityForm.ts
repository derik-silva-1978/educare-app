
import { useState, FormEvent } from 'react';
import { format, parse, addHours, setHours, setMinutes } from 'date-fns';
import { Activity, ActivityFormData, ActivityPriority, ActivityStatus } from '@/types/activity';
import { useActivities } from '@/hooks/useActivities';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { activityToStringDates } from '@/utils/activity-utils';

export const useActivityForm = (activity: Activity | undefined, onClose: () => void) => {
  const isEditMode = !!activity;
  const { addActivity, updateActivity } = useActivities();
  const { currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState<ActivityFormData>(() => {
    if (activity) {
      return {
        title: activity.title,
        description: activity.description,
        startDate: activity.startDate,
        endDate: activity.endDate,
        allDay: activity.allDay,
        priority: activity.priority,
        status: activity.status,
        assignedToRoles: activity.assignedToRoles,
        assignedToUsers: activity.assignedToUsers,
        studentId: activity.studentId,
        peiId: activity.peiId,
        reminderDate: activity.reminderDate,
        isRecurring: activity.isRecurring,
        recurrencePattern: activity.recurrencePattern,
        date: activity.date,
      };
    }
    
    const now = new Date();
    const startTime = setMinutes(setHours(now, now.getHours() + 1), 0);
    const endTime = addHours(startTime, 1);
    
    return {
      title: '',
      description: '',
      startDate: startTime,
      endDate: endTime,
      allDay: false,
      priority: 'medium' as ActivityPriority,
      status: 'pending' as ActivityStatus,
      assignedToRoles: ['teacher'],
      assignedToUsers: [],
      studentId: undefined,
      peiId: undefined,
      reminderDate: undefined,
      isRecurring: false,
      recurrencePattern: undefined,
      date: format(startTime, 'yyyy-MM-dd'),
    };
  });
  
  const [startTime, setStartTime] = useState(
    activity && activity.startDate ? format(new Date(activity.startDate), 'HH:mm') : format(formData.startDate, 'HH:mm')
  );
  
  const [endTime, setEndTime] = useState(
    activity && activity.endDate ? format(new Date(activity.endDate), 'HH:mm') : format(formData.endDate!, 'HH:mm')
  );
  
  const handleInputChange = (field: keyof ActivityFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'startDate') {
        updated.date = format(value, 'yyyy-MM-dd');
      }
      
      return updated;
    });
  };
  
  const handleDateChange = (type: 'start' | 'end', date: Date | null) => {
    if (!date) return;

    const fieldToUpdate = type === 'start' ? 'startDate' : 'endDate';
    const currentTime = type === 'start' ? startTime : endTime;
    
    // Combine the selected date with the current time
    const timeComponents = currentTime.split(':');
    const hours = parseInt(timeComponents[0], 10);
    const minutes = parseInt(timeComponents[1], 10);
    
    const newDateTime = new Date(date);
    newDateTime.setHours(hours, minutes, 0, 0);
    
    // Update the form data
    handleInputChange(fieldToUpdate, newDateTime);
    
    // If changing the start date, also update the date field
    if (type === 'start') {
      handleInputChange('date', format(date, 'yyyy-MM-dd'));
    }
  };
  
  const handleTimeChange = (type: 'start' | 'end', timeString: string) => {
    const fieldToUpdate = type === 'start' ? 'startDate' : 'endDate';
    const currentDate = formData[fieldToUpdate] as Date;
    
    if (!currentDate) return;
    
    // Parse the time string and update the date
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const newDateTime = new Date(currentDate);
      newDateTime.setHours(hours, minutes, 0, 0);
      
      // Update the form data
      handleInputChange(fieldToUpdate, newDateTime);
      
      // Also update the time state
      if (type === 'start') {
        setStartTime(timeString);
      } else {
        setEndTime(timeString);
      }
    } catch (error) {
      console.error('Invalid time format:', error);
    }
  };
  
  const handleAllDayToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allDay: checked,
      startDate: checked ? new Date(format(prev.startDate, 'yyyy-MM-dd')) : prev.startDate,
      endDate: checked 
        ? new Date(format(prev.endDate || prev.startDate, 'yyyy-MM-dd')) 
        : prev.endDate || addHours(prev.startDate, 1)
    }));
  };
  
  const handleRecurringToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isRecurring: checked,
      recurrencePattern: checked 
        ? prev.recurrencePattern || {
            frequency: 'weekly',
            interval: 1,
            daysOfWeek: [new Date(prev.startDate).getDay()],
            endsOn: null,
            occurrences: null
          }
        : undefined
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Create a properly typed activity data object
      const activityData = {
        ...formData,
        startDate: formData.startDate,
        endDate: formData.endDate
      };
      
      // Convert dates to strings before submitting to the API
      const stringDatesActivity = activityToStringDates(activityData as Activity);
      
      if (isEditMode && activity) {
        await updateActivity(activity.id, stringDatesActivity);
      } else {
        await addActivity(stringDatesActivity);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };
  
  return {
    formData,
    isEditMode,
    handleInputChange,
    handleDateChange,
    handleTimeChange,
    handleAllDayToggle,
    handleRecurringToggle,
    handleSubmit,
    startTime,
    endTime,
    activeTab,
    setActiveTab
  };
};

export default useActivityForm;
