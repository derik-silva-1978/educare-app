
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DomainProgressAnalyticsProps {
  data: any[];
}

export const DomainProgressAnalytics: React.FC<DomainProgressAnalyticsProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso por Domínio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-4 text-muted-foreground">
          Este componente foi desativado durante a migração para o novo aplicativo Educare.
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainProgressAnalytics;
