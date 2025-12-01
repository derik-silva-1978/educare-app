
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationCategory = 'general' | 'assessment' | 'student' | 'report' | 'event' | 'alert';

export interface NotificationFilter {
  categories?: NotificationCategory[];
  types?: NotificationType[];
  read?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  category: NotificationCategory;
  url?: string;
}
