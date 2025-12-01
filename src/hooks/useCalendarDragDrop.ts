
import { useState, useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { format, addDays } from 'date-fns';
import { Activity } from '@/types/activity';
import { useActivities } from './useActivities';
import { useToast } from './use-toast';

const useCalendarDragDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { updateActivity } = useActivities();
  const { toast } = useToast();
  
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);
  
  const handleDragEndWithResult = useCallback((result: DropResult, activities: Activity[]) => {
    setIsDragging(false);
    
    // If dropped outside a droppable area
    if (!result.destination) {
      return;
    }
    
    const { draggableId, destination } = result;
    const activity = activities.find(a => a.id === draggableId);
    
    if (!activity) {
      console.error('Activity not found', draggableId);
      return;
    }
    
    // Extract the date from the destination droppable id
    // Format expected: date-2023-10-15
    try {
      const dateString = destination.droppableId.replace('date-', '');
      const newDate = new Date(dateString);
      
      if (isNaN(newDate.getTime())) {
        throw new Error('Invalid date');
      }
      
      // Copy the time from the original date to the new date
      const originalDate = new Date(activity.startDate);
      newDate.setHours(originalDate.getHours());
      newDate.setMinutes(originalDate.getMinutes());
      
      // Calculate the difference in days
      const diffInDays = Math.round((newDate.getTime() - originalDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Update end date if it exists
      let newEndDate;
      if (activity.endDate) {
        newEndDate = addDays(new Date(activity.endDate), diffInDays);
      }
      
      // Update activity with new dates
      updateActivity(activity.id, {
        startDate: newDate.toISOString(),
        endDate: newEndDate ? newEndDate.toISOString() : undefined
      });
      
      toast({
        title: "Atividade reagendada",
        description: `${activity.title} foi movida para ${format(newDate, 'dd/MM/yyyy')}`
      });
    } catch (error) {
      console.error('Error processing drag and drop:', error);
      toast({
        title: "Erro ao mover atividade",
        description: "Não foi possível reagendar a atividade para a data selecionada.",
        variant: "destructive"
      });
    }
  }, [updateActivity, toast]);
  
  return {
    isDragging,
    handleDragStart,
    handleDragEndWithResult
  };
};

export default useCalendarDragDrop;
