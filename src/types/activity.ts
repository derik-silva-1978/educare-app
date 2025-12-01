
export type ActivityStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ActivityPriority = 'low' | 'medium' | 'high';

/**
 * Activity type with Date objects for UI components
 */
export interface Activity {
  id: string;
  title: string;
  description: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
  reminderDate?: Date;
  isRecurring?: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    monthOfYear?: number;
    endsOn?: Date | null;
    occurrences?: number | null;
  };
  peiId?: string;
  assignedToRoles?: string[];
  assignedToUsers?: string[];
  scheduledDate?: string;
  completed?: boolean;
  dueDate?: string;
  studentId?: string;
  studentName?: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  category?: string;
  tags?: string[];
  createdBy?: string;
  date?: string; // Optional for backward compatibility
  type?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  comments?: Array<{
    id: string;
    text: string;
    createdAt: string;
    author: string;
    authorId: string;
  }>;
}

/**
 * Form data for creating/editing activities
 */
export interface ActivityFormData {
  title: string;
  description: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
  reminderDate?: Date;
  isRecurring?: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    monthOfYear?: number;
    endsOn?: Date | null;
    occurrences?: number | null;
  };
  peiId?: string;
  assignedToRoles?: string[];
  assignedToUsers?: string[];
  dueDate?: string;
  studentId?: string;
  studentName?: string;
  assignedTo?: string;
  notes?: string;
  category?: string;
  tags?: string[];
  date?: string; // Optional for backward compatibility
  type?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  comments?: Array<{
    id: string;
    text: string;
    createdAt: string;
    author: string;
    authorId: string;
  }>;
}

/**
 * Activity with string dates for API storage
 * Defined here in addition to useActivities.ts for better type checking
 */
export interface ActivityWithStringDates extends Omit<Activity, 'startDate' | 'endDate' | 'reminderDate'> {
  startDate: string;
  endDate?: string;
  reminderDate?: string;
}
