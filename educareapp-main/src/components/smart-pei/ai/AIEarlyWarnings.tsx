
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Info, MessageCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTitibot } from '@/components/smart-pei/titibot/TitibotProvider';

interface AIEarlyWarningsProps {
  warnings: string[];
  title?: string;
}

export const AIEarlyWarnings: React.FC<AIEarlyWarningsProps> = ({
  warnings,
  title = "Sistema de Alerta Precoce"
}) => {
  const { isEnabled, openTitibot } = useTitibot();
  
  const handleAskTitibot = () => {
    // Open Titibot chat
    openTitibot();
  };
  
  if (!warnings || warnings.length === 0) {
    return (
      <Card className="ai-early-warnings">
        <CardHeader className="border-b bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription>
              Nenhum alerta detectado. O sistema de alerta precoce não identificou áreas que necessitem de atenção imediata.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Categorize warnings by severity
  const urgentWarnings = warnings.filter(w => w.startsWith('Alerta:'));
  const moderateWarnings = warnings.filter(w => w.startsWith('Aviso:'));
  const infoWarnings = warnings.filter(w => !w.startsWith('Alerta:') && !w.startsWith('Aviso:'));

  const hasUrgentWarnings = urgentWarnings.length > 0;

  return (
    <Card className="ai-early-warnings">
      <CardHeader className={`border-b ${hasUrgentWarnings ? 'bg-red-50 dark:bg-red-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className={`h-5 w-5 mr-2 ${hasUrgentWarnings ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`} />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5"
            onClick={handleAskTitibot}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Perguntar ao Titibot</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {urgentWarnings.length > 0 && (
          <div className="space-y-2">
            {urgentWarnings.map((warning, index) => (
              <Alert key={index} className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription>
                  {warning.replace('Alerta: ', '')}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {moderateWarnings.length > 0 && (
          <div className="space-y-2">
            {moderateWarnings.map((warning, index) => (
              <Alert key={index} className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription>
                  {warning.replace('Aviso: ', '')}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {infoWarnings.length > 0 && (
          <div className="space-y-2">
            {infoWarnings.map((warning, index) => (
              <Alert key={index} className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription>
                  {warning}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIEarlyWarnings;
