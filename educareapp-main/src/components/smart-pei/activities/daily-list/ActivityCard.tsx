
import React from 'react';
import { Activity } from '@/types/activity';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  X, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  onViewDetails: (activityId: string) => void;
  onComplete: (activityId: string, e: React.MouseEvent) => void;
  onCancel: (activityId: string, e: React.MouseEvent) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onViewDetails,
  onComplete,
  onCancel
}) => {
  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-blue-500';
    }
  };
  
  const getStatusBadge = (status: Activity['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em andamento</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelada</Badge>;
      default:
        return null;
    }
  };

  const renderActionButtons = () => (
    <div className="flex items-center gap-1">
      {activity.status !== 'completed' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-green-600 hover:text-green-700"
                onClick={(e) => onComplete(activity.id, e)}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Marcar como concluída</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {activity.status !== 'cancelled' && activity.status !== 'completed' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-red-600 hover:text-red-700"
                onClick={(e) => onCancel(activity.id, e)}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Cancelar atividade</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => onViewDetails(activity.id)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Ver detalhes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  const statusClass = 
    activity.status === 'completed' ? "border-l-green-500" : 
    activity.status === 'cancelled' ? "border-l-red-500" :
    activity.status === 'in_progress' ? "border-l-blue-500" :
    getPriorityColor(activity.priority);

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:bg-accent/50 transition-colors border-l-4",
        statusClass
      )}
      onClick={() => onViewDetails(activity.id)}
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "font-medium",
                activity.status === 'completed' && "line-through text-muted-foreground",
                activity.status === 'cancelled' && "text-muted-foreground"
              )}>{activity.title}</h3>
              {getStatusBadge(activity.status)}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {activity.allDay 
                  ? 'O dia todo' 
                  : `${format(activity.startDate, 'HH:mm')} - ${activity.endDate ? format(activity.endDate, 'HH:mm') : ''}`}
              </span>
            </div>
            
            {activity.reminderDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Lembrete: {format(activity.reminderDate, "dd/MM/yyyy 'às' HH:mm")}</span>
              </div>
            )}
            
            {activity.assignedToRoles.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{activity.assignedToRoles.map(role => 
                  role === 'admin' ? 'Administrador' :
                  role === 'coordinator' ? 'Coordenador' :
                  role === 'teacher' ? 'Professor' :
                  role === 'therapist' ? 'Terapeuta' :
                  role === 'parent' ? 'Responsável' : role
                ).join(', ')}</span>
              </div>
            )}
          </div>
          
          {renderActionButtons()}
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
