
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle, Loader2, Save } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
  lastSavedTime?: string;
  onManualSave: () => void;
  showTooltip?: boolean;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  status,
  lastSavedTime,
  onManualSave,
  showTooltip = true
}) => {
  const content = (
    <div className="flex items-center text-sm">
      {status === 'saving' && (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          <span>Salvando...</span>
        </div>
      )}
      
      {status === 'saved' && (
        <div className="flex items-center text-green-500">
          <Check className="h-3 w-3 mr-1" />
          <span>
            {lastSavedTime ? `Salvo ${lastSavedTime}` : 'Salvo'}
          </span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex items-center text-destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span className="mr-2">Erro ao salvar</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 text-xs py-0 px-2" 
            onClick={onManualSave}
          >
            <Save className="h-3 w-3 mr-1" />
            Tentar novamente
          </Button>
        </div>
      )}
      
      {status === 'idle' && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-6 text-xs py-0 px-2" 
          onClick={onManualSave}
        >
          <Save className="h-3 w-3 mr-1" />
          Salvar
        </Button>
      )}
    </div>
  );

  if (!showTooltip) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p>{status === 'saving' ? 'Salvando alterações...' : 
             status === 'saved' ? 'Alterações salvas com sucesso' : 
             status === 'error' ? 'Erro ao salvar alterações' : 
             'Clique para salvar alterações'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AutoSaveIndicator;
