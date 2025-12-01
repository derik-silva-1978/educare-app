
import React from 'react';
import { Activity } from '@/types/activity';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { User, Users, AlertCircle, RotateCcw, Bookmark } from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { UserRole } from '@/types/auth';
import useStudents from '@/hooks/useStudents';
import { Card } from '@/components/ui/card';

interface ActivityMetadataProps {
  activity: Activity;
}

export const ActivityMetadata: React.FC<ActivityMetadataProps> = ({
  activity
}) => {
  const { students } = useStudents();
  const { getRoleName } = useAuth();
  
  const student = students.find(s => s.id === activity.studentId);
  
  return (
    <Card className="p-4 bg-background/50 backdrop-blur-sm border border-primary/10 shadow-sm">
      <h3 className="text-sm font-medium mb-3 text-primary-foreground/80">Detalhes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {student && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
              <User className="h-4 w-4 text-primary/70" />
              Aluno Relacionado
            </h4>
            <p className="text-foreground font-medium pl-5">{student.name}</p>
          </div>
        )}
        
        {activity.assignedToRoles && activity.assignedToRoles.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4 text-primary/70" />
              Atribuído a
            </h4>
            <div className="flex flex-wrap gap-1.5 pl-5">
              {activity.assignedToRoles.map(role => (
                <Badge key={role} variant="outline" className="bg-secondary/50 text-secondary-foreground">
                  {typeof getRoleName === 'function' ? getRoleName(role as UserRole) : role}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {activity.reminderDate && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-primary/70" />
              Lembrete
            </h4>
            <p className="text-foreground pl-5">
              {format(new Date(activity.reminderDate), "dd/MM/yyyy 'às' HH:mm")}
            </p>
          </div>
        )}
        
        {activity.isRecurring && activity.recurrencePattern && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
              <RotateCcw className="h-4 w-4 text-primary/70" />
              Recorrência
            </h4>
            <p className="text-foreground pl-5">
              {activity.recurrencePattern.frequency === 'daily' && 'Diária'}
              {activity.recurrencePattern.frequency === 'weekly' && 'Semanal'}
              {activity.recurrencePattern.frequency === 'monthly' && 'Mensal'}
              {activity.recurrencePattern.frequency === 'yearly' && 'Anual'}
              {activity.recurrencePattern.interval > 1 && ` (a cada ${activity.recurrencePattern.interval})`}
            </p>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
            <Bookmark className="h-4 w-4 text-primary/70" />
            Criado em
          </h4>
          <p className="text-foreground pl-5">
            {format(new Date(activity.createdAt), "dd/MM/yyyy")}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ActivityMetadata;
