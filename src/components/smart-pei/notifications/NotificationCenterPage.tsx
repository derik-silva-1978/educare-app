
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { Helmet } from 'react-helmet-async';

const NotificationCenterPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Centro de Notificações - Smart PEI</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <BellRing className="h-6 w-6" />
          Centro de Notificações
        </h1>
        <p className="text-muted-foreground">
          Acompanhe suas notificações e mantenha-se atualizado com as atividades recentes
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationCenter />
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenterPage;
