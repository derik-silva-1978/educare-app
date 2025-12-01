
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const PersonalizedInsights: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Insights Personalizados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Este componente foi desativado durante a migração para o novo aplicativo Educare.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedInsights;
