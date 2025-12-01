
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const MaternalHealthPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            Funcionalidade Temporariamente Indisponível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-700">
            A seção de Saúde Materna está sendo reestruturada e estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaternalHealthPage;
