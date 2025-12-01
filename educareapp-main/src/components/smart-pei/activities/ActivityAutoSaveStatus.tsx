
import React from 'react';
import type { AutoSaveStatus } from '@/hooks/useAutoSave'; // Import as a type
import { AutoSaveIndicator } from '@/components/ui/autosave-indicator'; // Changed from default import to named import
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ActivityAutoSaveStatusProps {
  status: AutoSaveStatus;
  lastSavedTime: string | null;
  onManualSave: () => void;
}

export const ActivityAutoSaveStatus: React.FC<ActivityAutoSaveStatusProps> = ({
  status,
  lastSavedTime,
  onManualSave
}) => {
  return (
    <div className="flex items-center gap-2">
      <AutoSaveIndicator 
        status={status} 
        lastSavedText={lastSavedTime ? `às ${lastSavedTime}` : null}
      />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="px-2 h-7"
              onClick={onManualSave}
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              Salvar
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Salvar manualmente as alterações</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ActivityAutoSaveStatus;
