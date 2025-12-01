
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Activity } from '@/types/activity';
import { cn } from '@/lib/utils';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Badge } from '@/components/ui/badge';

interface CalendarDayCellProps {
  date: Date;
  activities: Activity[];
  isCurrentMonth: boolean;
  onDateClick: (date: Date) => void;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  activities,
  isCurrentMonth,
  onDateClick
}) => {
  const today = new Date();
  const isToday = isSameDay(date, today);
  const dateId = format(date, 'yyyy-MM-dd');
  
  // Find activities for this day
  const dayActivities = activities.filter(activity => 
    isSameDay(new Date(activity.startDate), date)
  );
  
  // Get activity priority color
  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500 border-red-600';
      case 'medium': return 'bg-yellow-500 border-yellow-600';
      case 'low': return 'bg-green-500 border-green-600';
      default: return 'bg-blue-500 border-blue-600';
    }
  };
  
  // Get activity status style
  const getStatusStyle = (status: Activity['status']) => {
    switch (status) {
      case 'completed': return 'opacity-60 line-through';
      case 'cancelled': return 'opacity-40';
      default: return '';
    }
  };
  
  return (
    <Droppable droppableId={dateId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "min-h-20 p-1 border-b border-r relative",
            isCurrentMonth ? "bg-white dark:bg-background" : "bg-muted/30 text-muted-foreground",
            isToday && "bg-blue-50 dark:bg-blue-950/20",
            snapshot.isDraggingOver && "bg-blue-100/50 dark:bg-blue-900/20"
          )}
          onClick={() => onDateClick(date)}
        >
          <div className={cn(
            "text-sm p-1 font-medium",
            isToday && "text-primary rounded-full w-7 h-7 flex items-center justify-center bg-primary/10"
          )}>
            {format(date, 'd')}
          </div>
          
          <div className="space-y-1 mt-1">
            {dayActivities.slice(0, 3).map((activity, index) => (
              <Draggable 
                key={activity.id} 
                draggableId={activity.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "text-xs p-1 rounded border-l-2 bg-white dark:bg-card truncate",
                      getPriorityColor(activity.priority),
                      getStatusStyle(activity.status)
                    )}
                  >
                    {activity.title}
                  </div>
                )}
              </Draggable>
            ))}
            
            {dayActivities.length > 3 && (
              <div className="text-xs px-1">
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  +{dayActivities.length - 3} mais
                </Badge>
              </div>
            )}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default CalendarDayCell;
