
import { License } from '@/types/license';

export const demoLicenses: License[] = [
  {
    id: 'ent-license-001',
    key: 'EDUCARE-ENT-A1B2C3D4',
    type: 'enterprise',
    status: 'active',
    expiresAt: '2024-12-31T23:59:59Z',
    maxUsers: 500,
    features: ['multi-platform', 'full-analytics', 'priority-support', 'custom-branding', 'api-access'],
    isActive: true,
    assignedTo: 'Escola Modelo LTDA',
    lastValidated: '2023-09-15T14:30:00Z',
    model: 'enterprise',
    usedCount: 342,
    totalCount: 500,
    teams: [],
    createdAt: '2023-01-01T10:00:00Z'
  },
  {
    id: 'pro-license-001',
    key: 'EDUCARE-PRO-B5C6D7E8',
    status: 'active',
    type: 'professional',
    expiresAt: '2024-06-30T23:59:59Z',
    maxUsers: 100,
    features: ['full-analytics', 'team-collaboration', 'advanced-reporting', 'api-access'],
    isActive: true,
    assignedTo: 'Centro Educacional Alfa',
    lastValidated: '2023-09-10T11:45:00Z',
    model: 'enterprise',
    usedCount: 78,
    totalCount: 100,
    teams: [],
    createdAt: '2023-02-15T09:30:00Z'
  },
  {
    id: 'std-license-001',
    key: 'EDUCARE-STD-F9G0H1I2',
    status: 'active',
    type: 'standard',
    expiresAt: '2024-03-31T23:59:59Z',
    maxUsers: 50,
    features: ['basic-analytics', 'team-collaboration', 'standard-reporting'],
    isActive: true,
    assignedTo: 'Escola Pequenos Passos',
    lastValidated: '2023-09-05T10:15:00Z',
    model: 'enterprise',
    usedCount: 43,
    totalCount: 50,
    teams: [],
    createdAt: '2023-03-10T13:45:00Z'
  },
  {
    id: 'trial-license-001',
    key: 'EDUCARE-TRIAL-J3K4L5M6',
    status: 'active',
    type: 'trial',
    expiresAt: '2023-10-15T23:59:59Z',
    maxUsers: 10,
    features: ['limited-analytics', 'basic-reporting'],
    isActive: true,
    assignedTo: null,
    lastValidated: null,
    model: 'individual',
    teams: [],
    createdAt: '2023-09-01T08:00:00Z'
  },
  {
    id: 'exp-license-001',
    key: 'EDUCARE-EXP-N7O8P9Q0',
    status: 'expired',
    type: 'professional',
    expiresAt: '2023-08-31T23:59:59Z',
    maxUsers: 20,
    features: ['full-analytics', 'team-collaboration', 'advanced-reporting'],
    isActive: false,
    assignedTo: 'Dr. Ana Silva',
    lastValidated: '2023-08-30T16:20:00Z',
    model: 'individual',
    teams: [],
    createdAt: '2023-01-15T11:30:00Z'
  }
];

export default demoLicenses;
