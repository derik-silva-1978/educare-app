
import React from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AutoSaveStatus } from '@/hooks/useAutoSave';

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
  lastSavedText: string | null;
  className?: string;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  status,
  lastSavedText,
  className
}) => {
  return (
    <div className={cn("flex items-center text-sm", className)}>
      {status === 'idle' && lastSavedText && (
        <div className="flex items-center text-slate-500">
          <Check className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
          <span>Salvo {lastSavedText}</span>
        </div>
      )}
      
      {status === 'saving' && (
        <div className="flex items-center text-slate-500">
          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          <span>Salvando...</span>
        </div>
      )}
      
      {status === 'saved' && (
        <div className="flex items-center text-green-600">
          <Check className="h-3.5 w-3.5 mr-1.5" />
          <span>Salvo {lastSavedText || ''}</span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex items-center text-red-500">
          <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
          <span>Erro ao salvar</span>
        </div>
      )}
    </div>
  );
};

// Add a default export for compatibility
export default AutoSaveIndicator;
