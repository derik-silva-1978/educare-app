
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, UploadCloud } from 'lucide-react';

interface MigrationStepProps {
  migrationProgress: number;
  isMigrating: boolean;
  onMigrate: () => void;
}

export const MigrationStep: React.FC<MigrationStepProps> = ({
  migrationProgress,
  isMigrating,
  onMigrate
}) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>Migração de Licenças</AlertTitle>
        <AlertDescription>
          Este processo migrará suas licenças para o novo sistema de backend.
          Não feche esta janela durante a migração.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progresso da Migração</span>
          <span>{migrationProgress}%</span>
        </div>
        <Progress value={migrationProgress} />
      </div>
      
      <Button 
        onClick={onMigrate}
        className="w-full"
        disabled={isMigrating}
      >
        {isMigrating ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Migrando...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-4 w-4" />
            Iniciar Migração
          </>
        )}
      </Button>
    </div>
  );
};

export default MigrationStep;
