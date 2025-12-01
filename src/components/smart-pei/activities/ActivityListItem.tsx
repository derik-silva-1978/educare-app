
import React from 'react';
import { Activity, ActivityStatus } from '@/types/activity';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  Pencil,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useActivities } from '@/hooks/useActivities';
import { ActivityRoleGuard } from './ActivityRoleGuard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pt } from 'date-fns/locale';

interface ActivityListItemProps {
  activity: Activity;
}

const ActivityListItem: React.FC<ActivityListItemProps> = ({ activity }) => {
  const navigate = useNavigate();
  const { updateActivityStatus, deleteActivity } = useActivities();
  
  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
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
  
  const handleStatusChange = (newStatus: ActivityStatus) => {
    updateActivityStatus(activity.id, newStatus);
  };
  
  const handleEditActivity = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/smart-pei/activities/${activity.id}`);
  };
  
  const handleDeleteActivity = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteActivity(activity.id);
  };
  
  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate(`/smart-pei/activities/${activity.id}`)}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className={`w-1 h-full min-h-[2.5rem] rounded-full ${getPriorityColor(activity.priority)}`} />
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{activity.title}</h3>
              {getStatusBadge(activity.status)}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(activity.startDate, "dd 'de' MMMM", { locale: pt })}
              </span>
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
          </div>
          
          <ActivityRoleGuard
            allowedRoles={['admin', 'coordinator', 'teacher']}
            fallback={
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  if (activity.status !== 'completed') {
                    handleStatusChange('completed');
                  }
                }}
                disabled={activity.status === 'completed'}
              >
                <CheckCircle2 className={`h-4 w-4 ${activity.status === 'completed' ? 'text-green-500' : ''}`} />
              </Button>
            }
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                <DropdownMenuItem onClick={handleEditActivity}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange('in_progress');
                  }}
                  disabled={activity.status === 'in_progress'}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Marcar em andamento</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange('completed');
                  }}
                  disabled={activity.status === 'completed'}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Marcar como concluída</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleDeleteActivity}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ActivityRoleGuard>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityListItem;
