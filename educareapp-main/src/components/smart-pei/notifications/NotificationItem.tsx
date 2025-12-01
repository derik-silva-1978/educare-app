import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Notification } from '@/types/notification';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Info, 
  FileText, 
  Calendar, 
  User, 
  Activity, 
  AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const navigate = useNavigate();
  
  const getIconForType = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getIconForCategory = () => {
    switch (notification.category) {
      case 'assessment':
        return <Activity className="h-5 w-5 text-purple-500" />;
      case 'report':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-teal-500" />;
      case 'student':
        return <User className="h-5 w-5 text-indigo-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'general':
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Format date to a friendly format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If it's today, show relative time
    if (date.toDateString() === now.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true, locale: pt });
    }
    
    // Otherwise show the full date
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: pt });
  };
  
  const handleClick = () => {
    // Mark as read
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate to the URL if provided
    if (notification.url) {
      navigate(notification.url);
    }
  };
  
  return (
    <div 
      className={`
        border-b last:border-0 px-4 py-3 cursor-pointer transition-colors
        ${notification.read ? 'bg-white' : 'bg-blue-50'}
        ${notification.url ? 'hover:bg-gray-50' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIconForCategory()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {notification.title}
          </h4>
          
          <p className="text-xs text-gray-500 mt-0.5">
            {formatDate(notification.timestamp)}
          </p>
          
          <p className="text-sm text-gray-600 mt-1 leading-snug">
            {notification.message}
          </p>
        </div>
        
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
