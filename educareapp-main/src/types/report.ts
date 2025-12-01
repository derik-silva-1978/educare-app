
// Define report types
export type ReportType = 'progress' | 'assessment' | 'pei' | 'meeting' | 'activity' | 'evaluation' | 'custom' | 
  'summary' | 'trimestral' | 'team' | 'complete' | 'pei-complete' | 'monthly-progress' | 'quarterly-report';
export type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'approved' | 'archived' | 'complete' | 'shared';

export interface ReportFilters {
  type?: ReportType | null;
  status?: ReportStatus | null;
  studentId?: string | null;
  dateRange?: string | null;
  search?: string | null;
}

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  status: ReportStatus;
  progress: number;
  content?: string;
  studentId?: string;
  studentName?: string;
  author?: string;
  description?: string;
  coverImage?: string;
  domainTracking?: boolean;
  skillsTracking?: boolean;
  recent?: boolean;
  important?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper function to convert string to ReportType
export const toReportType = (str: string): ReportType => {
  const validTypes: ReportType[] = [
    'progress', 'assessment', 'pei', 'meeting', 'activity', 'evaluation', 'custom',
    'summary', 'trimestral', 'team', 'complete', 'pei-complete', 'monthly-progress', 'quarterly-report'
  ];
  return validTypes.includes(str as ReportType) ? (str as ReportType) : 'custom';
};

// Helper function to convert string to ReportStatus
export const toReportStatus = (str: string): ReportStatus => {
  const validStatuses: ReportStatus[] = [
    'draft', 'in_progress', 'completed', 'approved', 'archived', 'complete', 'shared'
  ];
  return validStatuses.includes(str as ReportStatus) ? (str as ReportStatus) : 'draft';
};
