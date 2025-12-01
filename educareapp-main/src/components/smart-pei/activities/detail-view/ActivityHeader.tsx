
import React from 'react';
import { Activity } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

interface ActivityHeaderProps {
  activity: Activity;
  onBack: () => void;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  activity,
  onBack,
}) => {
  const getPriorityBadge = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500/90 hover:bg-red-500/80 transition-colors">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/90 hover:bg-yellow-500/80 transition-colors">Média</Badge>;
      case 'low':
        return <Badge className="bg-green-500/90 hover:bg-green-500/80 transition-colors">Baixa</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: Activity['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 transition-colors">Pendente</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 transition-colors">Em andamento</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 transition-colors">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 transition-colors">Cancelada</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="rounded-full hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex space-x-2">
          {getPriorityBadge(activity.priority)}
          {getStatusBadge(activity.status)}
        </div>
      </div>
      
      <CardTitle className="text-2xl mt-4 text-primary-foreground font-bold">{activity.title}</CardTitle>
      <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
        <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md">
          <Calendar className="h-4 w-4 text-primary/70" />
          <span>
            {format(activity.startDate, "dd 'de' MMMM", { locale: pt })}
            {activity.endDate && activity.startDate.toDateString() !== activity.endDate.toDateString() && 
              ` - ${format(activity.endDate, "dd 'de' MMMM", { locale: pt })}`}
          </span>
        </div>
        
        <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md">
          <Clock className="h-4 w-4 text-primary/70" />
          <span>
            {activity.allDay 
              ? 'O dia todo' 
              : `${format(activity.startDate, 'HH:mm')} - ${activity.endDate ? format(activity.endDate, 'HH:mm') : ''}`}
          </span>
        </div>
      </CardDescription>
    </>
  );
};

export default ActivityHeader;
