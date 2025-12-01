
import React from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Award, Clock, Calendar } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'pei' | 'assessment' | 'report' | 'other';
  status: 'completed' | 'in_progress' | 'pending';
}

interface TimelineEventProps {
  event: TimelineEvent;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

export const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'pei':
      return <BookOpen className="h-4 w-4" />;
    case 'assessment':
      return <Award className="h-4 w-4" />;
    case 'report':
      return <Clock className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

export const getEventTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case 'pei':
      return "default";
    case 'assessment':
      return "secondary";
    case 'report':
      return "outline";
    default:
      return "outline";
  }
};

export const TimelineEventItem: React.FC<TimelineEventProps> = ({ 
  event, 
  isHovered, 
  onHover 
}) => {
  return (
    <div 
      key={event.id} 
      className="flex gap-4 relative"
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative mt-1.5">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center 
          ${event.status === 'completed' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
          {getEventTypeIcon(event.type)}
        </div>
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-full 
          border border-primary/30 scale-0 animate-ping" />
      </div>
      
      <div className="flex-1 bg-card border rounded-lg p-3 shadow-sm">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{event.title}</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={getEventTypeBadgeVariant(event.type)} className="text-xs">
                  {event.type === 'pei' ? 'PEI' : 
                   event.type === 'assessment' ? 'Avaliação' : 
                   event.type === 'report' ? 'Relatório' : 'Evento'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tipo de evento</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <p className="text-muted-foreground text-xs mt-1">{event.description}</p>
        
        <div className="mt-2 flex items-center justify-end">
          <span className="text-xs text-muted-foreground">
            {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimelineEventItem;
