
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveStatusProps {
  status: AutoSaveStatus;
  lastSavedTime: string | null;
  onManualSave: () => void;
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({
  status,
  lastSavedTime,
  onManualSave
}) => {
  const renderIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case 'saved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const renderText = () => {
    switch (status) {
      case 'saving':
        return 'Salvando...';
      case 'saved':
        return `Salvo ${lastSavedTime}`;
      case 'error':
        return 'Erro ao salvar';
      default:
        return lastSavedTime ? `Último salvamento ${lastSavedTime}` : '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {renderIcon()}
        <span>{renderText()}</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={onManualSave}
              disabled={status === 'saving'}
            >
              <Save className="h-4 w-4" />
              <span className="sr-only">Salvar manualmente</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Salvar manualmente</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AutoSaveStatus;
