
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Activity } from '@/types/activity';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { GripVertical } from 'lucide-react';

interface DraggableActivityProps {
  activity: Activity;
  index: number;
}

const DraggableActivity: React.FC<DraggableActivityProps> = ({ activity, index }) => {
  // Activity status colors
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    inProgress: 'bg-blue-100 border-blue-300 text-blue-800',
    completed: 'bg-green-100 border-green-300 text-green-800',
    cancelled: 'bg-gray-100 border-gray-300 text-gray-800',
    missed: 'bg-red-100 border-red-300 text-red-800'
  };
  
  const colorClass = statusColors[activity.status] || 'bg-gray-100 border-gray-300 text-gray-800';
  
  // Format time for display
  const formatTime = (dateStr: string | Date) => {
    // Ensure we're working with a Date object
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return format(date, 'HH:mm');
  };
  
  return (
    <Draggable draggableId={activity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            'px-1.5 py-1 rounded border flex items-center justify-between gap-1',
            colorClass,
            snapshot.isDragging ? 'opacity-70 shadow-md' : ''
          )}
        >
          <div className="flex-1 truncate">
            <span className="font-medium truncate block">{activity.title}</span>
            {activity.startDate && (
              <span className="text-[10px] opacity-80">{formatTime(activity.startDate)}</span>
            )}
          </div>
          <div {...provided.dragHandleProps} className="cursor-grab">
            <GripVertical className="h-3 w-3" />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableActivity;
