
import React from 'react';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export const NotificationsSection: React.FC = () => {
  return (
    <div className="notifications-section">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="h-6 w-6" />
        Centro de Notificações
      </h2>
      <p className="text-muted-foreground mb-6">
        Gerencie suas notificações e mantenha-se atualizado com as atividades recentes.
      </p>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="notifications-container">
            <NotificationCenter />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSection;
