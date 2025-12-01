
import React, { useEffect } from 'react';
import NotificationCenterPage from './NotificationCenterPage';
import { toast } from '@/hooks/use-toast';
import useNotifications from '@/hooks/useNotifications';

const NotificationsPage: React.FC = () => {
  const { unreadCount, markAllAsRead } = useNotifications();
  
  useEffect(() => {
    // Show a toast when visiting the notifications page if there are unread notifications
    if (unreadCount > 0) {
      toast({
        title: "Notificações não lidas",
        description: `Você tem ${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}.`,
        duration: 3000
      });
    }
  }, [unreadCount]);
  
  return <NotificationCenterPage />;
};

export default NotificationsPage;
