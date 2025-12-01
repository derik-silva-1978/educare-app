
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthRecordsTabSimplifiedProps {
  childId: string;
}

export const HealthRecordsTabSimplified: React.FC<HealthRecordsTabSimplifiedProps> = ({ childId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registros de Saúde</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Esta funcionalidade está em desenvolvimento.
            </p>
            <p className="text-sm text-gray-500">
              Em breve você poderá gerenciar todos os registros de saúde da criança aqui.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
