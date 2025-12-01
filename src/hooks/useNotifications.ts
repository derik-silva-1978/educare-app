
import { useState, useEffect } from 'react';
import { Notification, NotificationFilter, NotificationType, NotificationCategory } from '@/types/notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    // Update unread count whenever notifications change
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // For now, we'll use mock data
      // In a real app, this would be an API call
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
      } else {
        // Initialize with empty array if no notifications found
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNotification = (
    title: string, 
    message: string, 
    type: NotificationType = 'info',
    category: NotificationCategory = 'general',
    url?: string
  ) => {
    const newNotification: Notification = {
      id: `notification_${Date.now()}`,
      title,
      message,
      type,
      category,
      timestamp: new Date().toISOString(),
      read: false,
      url
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    return newNotification;
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const filterNotifications = (filter: NotificationFilter) => {
    let filtered = [...notifications];
    
    if (filter.categories && filter.categories.length > 0) {
      filtered = filtered.filter(n => filter.categories?.includes(n.category));
    }
    
    if (filter.types && filter.types.length > 0) {
      filtered = filtered.filter(n => filter.types?.includes(n.type));
    }
    
    if (filter.read !== undefined) {
      filtered = filtered.filter(n => n.read === filter.read);
    }
    
    if (filter.dateRange) {
      const { from, to } = filter.dateRange;
      filtered = filtered.filter(n => {
        const date = new Date(n.timestamp);
        return date >= from && date <= to;
      });
    }
    
    return filtered;
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    filterNotifications,
    refreshNotifications: loadNotifications
  };
};

export default useNotifications;
