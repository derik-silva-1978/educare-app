
import { License } from '@/types/license';
import { User } from '@/types/auth';

// Define audit event types
export type AuditAction = 
  | 'license_created'
  | 'license_updated'
  | 'license_deleted'
  | 'license_assigned'
  | 'license_unassigned'
  | 'license_validated'
  | 'team_created'
  | 'team_updated'
  | 'team_deleted';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: AuditAction;
  userId: string;
  userName: string;
  userRole: string;
  resourceId: string;
  resourceType: 'license' | 'team';
  details: string;
  metadata?: Record<string, any>;
}

/**
 * Log an audit event
 */
export function logAuditEvent(
  action: AuditAction,
  user: User,
  resourceId: string,
  resourceType: 'license' | 'team',
  details: string,
  metadata?: Record<string, any>
): void {
  const auditLog: AuditLog = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    action,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    resourceId,
    resourceType,
    details,
    metadata
  };
  
  // Store audit log
  const logs = loadAuditLogs();
  saveAuditLogs([...logs, auditLog]);
  
  // In a real application, you would also send this to a secure server-side logging system
  console.log('Audit log:', auditLog);
}

/**
 * Load audit logs from storage
 */
export function loadAuditLogs(): AuditLog[] {
  try {
    const storedLogs = localStorage.getItem('smartPeiAuditLogs');
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (error) {
    console.error('Error loading audit logs:', error);
    return [];
  }
}

/**
 * Save audit logs to storage
 */
function saveAuditLogs(logs: AuditLog[]): void {
  try {
    localStorage.setItem('smartPeiAuditLogs', JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving audit logs:', error);
  }
}

/**
 * Get audit logs for a specific resource
 */
export function getResourceAuditLogs(resourceId: string, resourceType: 'license' | 'team'): AuditLog[] {
  const logs = loadAuditLogs();
  return logs.filter(log => 
    log.resourceId === resourceId && log.resourceType === resourceType
  );
}

/**
 * Generate a unique ID for an audit log entry
 */
function generateAuditId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
