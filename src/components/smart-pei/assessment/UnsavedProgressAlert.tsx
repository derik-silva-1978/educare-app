
import React from 'react';
import { AlertCircle, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface UnsavedProgressAlertProps {
  show: boolean;
  onSave?: () => void;
}

export const UnsavedProgressAlert: React.FC<UnsavedProgressAlertProps> = ({
  show,
  onSave
}) => {
  if (!show) return null;

  return (
    <Alert className="bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span>Você tem alterações não salvas na avaliação.</span>
        {onSave && (
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4 bg-white hover:bg-amber-50 border-amber-300"
            onClick={onSave}
          >
            <Save className="h-3 w-3 mr-2" />
            Salvar agora
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default UnsavedProgressAlert;
