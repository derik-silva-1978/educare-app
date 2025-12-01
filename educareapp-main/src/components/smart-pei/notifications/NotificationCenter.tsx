
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2 } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { Notification } from '@/types/notification';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Avaliação concluída',
    message: 'A avaliação de João Silva foi concluída com sucesso.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    type: 'success',
    category: 'assessment',
    url: '/smart-pei/assessments/abc123'
  },
  {
    id: '2',
    title: 'Novo relatório disponível',
    message: 'O relatório trimestral de Maria Santos está disponível para visualização.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    type: 'info',
    category: 'report',
    url: '/smart-pei/reports'
  },
  {
    id: '3',
    title: 'Lembrete de atividade',
    message: 'Você tem uma sessão de terapia agendada com Carlos Oliveira amanhã às 10h.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: false,
    type: 'info',
    category: 'event',
    url: '/smart-pei/activities'
  },
  {
    id: '4',
    title: 'Alerta de progresso',
    message: 'Pedro Costa não atingiu os objetivos esperados este mês.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    read: false,
    type: 'warning',
    category: 'alert'
  }
];

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Load notifications from mock data
  useEffect(() => {
    setNotifications(MOCK_NOTIFICATIONS);
  }, []);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const handleClearAll = () => {
    setNotifications([]);
  };
  
  const filteredNotifications = activeTab === 'all'
    ? notifications
    : activeTab === 'unread'
    ? notifications.filter(notification => !notification.read)
    : notifications.filter(notification => notification.read);
  
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Sem notificações</h3>
        <p className="text-sm text-gray-500 mt-1">
          Você não tem notificações no momento.
        </p>
      </div>
    );
  }
  
  return (
    <div className="notification-center">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-1" />
            Marcar todas como lidas
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-1" />
            Limpar tudo
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="all" className="flex-1">
            Todas
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex-1">
            Não lidas{unreadCount > 0 && ` (${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="read" className="flex-1">
            Lidas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[400px] border rounded-md overflow-hidden">
            {filteredNotifications.map(notification => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          <ScrollArea className="h-[400px] border rounded-md overflow-hidden">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <NotificationItem 
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-gray-500">
                  Não há notificações não lidas.
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="read" className="mt-0">
          <ScrollArea className="h-[400px] border rounded-md overflow-hidden">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <NotificationItem 
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-gray-500">
                  Não há notificações lidas.
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;
