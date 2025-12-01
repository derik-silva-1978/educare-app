
export interface License {
  id: string;
  key: string;
  status: 'active' | 'inactive' | 'expired' | 'pending';
  type: 'individual' | 'enterprise' | 'trial' | 'standard' | 'professional';
  model?: 'individual' | 'enterprise';
  seats?: number;
  maxUsers?: number;
  totalCount?: number;
  usedCount?: number;
  isActive?: boolean;
  features?: string[];
  teams?: LicenseTeam[];
  assignedTo?: string;
  lastValidated?: Date | string | null;
  createdAt: string | Date;
  expiresAt: string | Date;
  activatedAt?: string | Date;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
}

export interface LicenseTeam {
  id: string;
  name: string;
  description: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  members: TeamMember[];
  licenses: string[]; // Array of license IDs assigned to this team
  studentName?: string;
  coordinator?: any;
  parent?: any;
  professionals?: any[];
  studentId?: string;
  licenseId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'teacher' | 'therapist' | 'parent' | 'professional';
  joinedAt?: string | Date;
  description?: string;
  // Optional fields for UI display
  photoUrl?: string;
  position?: string;
  specialties?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  errorCode?: string;
  details?: string | Record<string, any>;
}

export interface LicenseAllocationParams {
  licenseId: string;
  teamId?: string;
  userId?: string;
  seats?: number;
  studentId?: string;
  studentName?: string;
  teamName?: string;
  coordinator?: any;
  parent?: any;
  professionals?: any[];
}
