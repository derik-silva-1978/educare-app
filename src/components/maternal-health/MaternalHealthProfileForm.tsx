
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MaternalHealthProfileForm: React.FC = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">Formulário de Saúde Materna - Em Desenvolvimento</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-blue-600">
          Esta funcionalidade será implementada em breve para registro de dados de saúde materna.
        </p>
      </CardContent>
    </Card>
  );
};

export default MaternalHealthProfileForm;
