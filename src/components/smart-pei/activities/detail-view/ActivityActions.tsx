
import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity, ActivityStatus } from '@/types/activity';
import { ActivityRoleGuard } from '../ActivityRoleGuard';
import { Edit, Trash2, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

interface ActivityActionsProps {
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: ActivityStatus) => void;
}

export const ActivityActions: React.FC<ActivityActionsProps> = ({
  activity,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between pt-6 border-t gap-4">
      <ActivityRoleGuard
        allowedRoles={['admin', 'coordinator', 'teacher']}
        fallback={
          <div></div>
        }
      >
        <div className="flex items-center space-x-2">
          <Button 
            variant="destructive" 
            onClick={onDelete}
            className="shadow-sm hover:shadow transition-shadow"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
          <Button 
            variant="outline" 
            onClick={onEdit}
            className="border-primary/20 hover:border-primary/40 shadow-sm hover:shadow transition-all"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </ActivityRoleGuard>
      
      <div className="flex items-center space-x-2">
        {activity.status === 'pending' && (
          <Button 
            variant="outline"
            onClick={() => onStatusChange('in_progress')}
            className="border-blue-300/50 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm hover:shadow transition-all"
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Iniciar
          </Button>
        )}
        
        {activity.status !== 'completed' && (
          <Button 
            variant="default"
            onClick={() => onStatusChange('completed')}
            className="bg-green-500 hover:bg-green-600 shadow-sm hover:shadow transition-all"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Marcar como concluída
          </Button>
        )}
        
        {activity.status === 'completed' && (
          <Button 
            variant="outline"
            onClick={() => onStatusChange('in_progress')}
            className="border-blue-300/50 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm hover:shadow transition-all"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reabrir
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActivityActions;
