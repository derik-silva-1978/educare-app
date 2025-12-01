
import React from 'react';
import { PEIProgress } from '@/hooks/usePEI';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { getProgressValue, getStatusColor, getStatusIcon, getStatusLabel } from './timelineUtils';

interface TimelinePointProps {
  record: PEIProgress;
  position: number;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (id: string) => void;
  onHover: (id: string | null) => void;
}

export const TimelinePoint: React.FC<TimelinePointProps> = ({
  record,
  position,
  isSelected,
  isHovered,
  onClick,
  onHover
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="flex flex-col items-center absolute transform -translate-x-1/2"
          style={{ left: `${position}%` }}
          onMouseEnter={() => onHover(record.id)}
          onMouseLeave={() => onHover(null)}
          onClick={() => onClick(record.id)}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
          aria-label={`Progresso de ${format(new Date(record.date), 'dd/MM/yyyy', { locale: pt })}: ${getStatusLabel(record.status)}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClick(record.id);
              e.preventDefault();
            }
          }}
        >
          <div className="relative">
            <div 
              className={`w-4 h-4 rounded-full z-10 cursor-pointer transition-all duration-300
                ${getStatusColor(record.status)}
                ${isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-125' : ''}
                ${isHovered && !isSelected ? 'scale-110' : ''}
                hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-primary/70`}
            />
            <div 
              className={`absolute -top-1.5 -left-1.5 w-7 h-7 bg-primary/10 rounded-full 
                transition-transform duration-300 ${isHovered || isSelected ? 'scale-100' : 'scale-0'}`}
            />
          </div>
          
          <div 
            className={`mt-2 transition-all duration-300 
              ${isHovered || isSelected ? 'scale-110 text-primary font-medium' : 'opacity-70'}`}
          >
            <span className="text-xs whitespace-nowrap block">
              {format(new Date(record.date), 'dd/MM', { locale: pt })}
            </span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              {getStatusIcon(record.status)}
              <span className="text-xs">
                {getProgressValue(record.status)}%
              </span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">
                {format(new Date(record.date), 'PPP', { locale: pt })}
              </span>
            </div>
            <div 
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" 
              style={{ 
                backgroundColor: `${getStatusColor(record.status)}30`, 
                color: getStatusColor(record.status).replace('bg-', 'text-') 
              }}
            >
              {getStatusIcon(record.status)}
              <span>{getStatusLabel(record.status)}</span>
            </div>
          </div>
          {record.notes && (
            <p className="text-sm max-w-[250px] whitespace-pre-wrap">{record.notes}</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default TimelinePoint;
