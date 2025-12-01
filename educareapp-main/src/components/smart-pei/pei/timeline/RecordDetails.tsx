
import React from 'react';
import { PEIProgress } from '@/hooks/usePEI';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { getProgressValue, getStatusColor, getStatusIcon, getStatusLabel } from './timelineUtils';

interface RecordDetailsProps {
  record: PEIProgress;
}

export const RecordDetails: React.FC<RecordDetailsProps> = ({ record }) => {
  return (
    <div key={record.id} className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {format(new Date(record.date), 'PPP', { locale: pt })}
          </span>
        </div>
        <div 
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" 
          style={{ 
            backgroundColor: `${getStatusColor(record.status)}20`, 
            color: getStatusColor(record.status).replace('bg-', 'text-') 
          }}
        >
          {getStatusIcon(record.status)}
          <span>{getStatusLabel(record.status)}</span>
        </div>
      </div>
      
      <div className="my-2">
        <div className="relative pt-2">
          <div className="absolute h-1.5 w-full bg-muted rounded-full" />
          <div 
            className="absolute h-1.5 bg-primary rounded-full transition-all duration-500" 
            style={{ width: `${getProgressValue(record.status)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">0%</span>
          <span className="text-xs text-muted-foreground">100%</span>
        </div>
      </div>
      
      {record.notes && (
        <div className="bg-muted/40 p-3 rounded-md">
          <p className="text-sm whitespace-pre-wrap">{record.notes}</p>
        </div>
      )}
      
      {record.evidence && (
        <div className="mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Evidências:</p>
          </div>
          <p className="text-sm mt-1 whitespace-pre-wrap bg-muted/40 p-3 rounded-md">{record.evidence}</p>
        </div>
      )}
      
      {record.author && (
        <div className="mt-2 text-xs text-muted-foreground text-right">
          Registrado por: {record.author}
        </div>
      )}
    </div>
  );
};

export default RecordDetails;
