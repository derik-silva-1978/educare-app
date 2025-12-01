
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle } from 'lucide-react';
import { MigrationResult } from '@/hooks/license/license-migration';

interface ValidationResultsProps {
  migrationResult: MigrationResult | null;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({ migrationResult }) => {
  if (!migrationResult) return null;
  
  return (
    <div className="mt-6 space-y-4">
      <Separator />
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-md">
          <div className="text-2xl font-bold">{migrationResult.total}</div>
          <div className="text-sm text-muted-foreground">Total de Licenças</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-md">
          <div className="text-2xl font-bold text-green-600">{migrationResult.valid}</div>
          <div className="text-sm text-muted-foreground">Licenças Válidas</div>
        </div>
        
        <div className={`${migrationResult.invalid > 0 ? 'bg-red-50' : 'bg-slate-50'} p-4 rounded-md`}>
          <div className={`text-2xl font-bold ${migrationResult.invalid > 0 ? 'text-red-600' : ''}`}>
            {migrationResult.invalid}
          </div>
          <div className="text-sm text-muted-foreground">Licenças com Problemas</div>
        </div>
      </div>
      
      {migrationResult.errors.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
            Erros Encontrados
          </h3>
          <div className="bg-slate-50 rounded-md p-2 max-h-60 overflow-y-auto">
            <ul className="space-y-2">
              {migrationResult.errors.map((error, index) => (
                <li key={index} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                  <span className="font-mono bg-slate-100 px-1 rounded">{error.licenseKey.substring(0, 10)}...</span>
                  <span className="mx-2">-</span>
                  <span className="text-red-600">{error.error}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationResults;
