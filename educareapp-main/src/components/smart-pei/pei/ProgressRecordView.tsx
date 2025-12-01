
import React from 'react';
import { PEIProgress } from '@/hooks/usePEI';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Copy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getStatusColor, 
  getStatusIcon, 
  getStatusLabel,
  getProgressValue 
} from './timeline/timelineUtils';
import { Progress } from '@/components/ui/progress';

interface ProgressRecordViewProps {
  progress: PEIProgress;
  showAuthor?: boolean;
  showCopyButton?: boolean;
  onCopy?: () => void;
}

const ProgressRecordView: React.FC<ProgressRecordViewProps> = ({ 
  progress, 
  showAuthor = false,
  showCopyButton = false,
  onCopy
}) => {
  const progressValue = getProgressValue(progress.status);
  
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {format(new Date(progress.date), 'PPP', { locale: pt })}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div 
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
              transition-colors duration-200
              ${getStatusColor(progress.status).replace('bg-', 'bg-').replace('500', '100')} 
              ${getStatusColor(progress.status).replace('bg-', 'text-')}`}
          >
            {getStatusIcon(progress.status)}
            <span>{getStatusLabel(progress.status)}</span>
          </div>
          
          {showCopyButton && onCopy && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={onCopy}
              title="Copiar registro"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="my-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Progresso</span>
          <span className={`text-xs font-medium ${getStatusColor(progress.status).replace('bg-', 'text-')}`}>
            {progressValue}%
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className={`absolute h-full rounded-full transition-all duration-500 ${getStatusColor(progress.status)}`}
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      </div>
      
      {progress.notes && (
        <div className="mt-3">
          <p className="text-sm whitespace-pre-wrap">{progress.notes}</p>
        </div>
      )}
      
      {progress.evidence && (
        <div className="mt-3 bg-muted/50 p-3 rounded-md border border-border/30">
          <p className="text-xs font-medium text-muted-foreground mb-1">Evidências:</p>
          <p className="text-sm whitespace-pre-wrap">{progress.evidence}</p>
        </div>
      )}
      
      {showAuthor && progress.author && (
        <div className="mt-3 text-right">
          <p className="text-xs text-muted-foreground">
            Registrado por: <span className="font-medium">{progress.author}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressRecordView;
