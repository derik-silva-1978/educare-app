
import { License, LicenseTeam } from '@/types/license';
import { uuid } from '@/utils/uuid';

// Create demo licenses for initial data
export function createDemoLicenses(): License[] {
  const now = new Date().toISOString();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  return [
    {
      id: '1',
      key: 'DEMO-AAAA-BBBB-CCCC-DDDD',
      status: 'active',
      type: 'enterprise',
      model: 'enterprise',
      expiresAt: oneYearFromNow.toISOString(),
      maxUsers: 50,
      features: ['all'],
      isActive: true,
      assignedTo: 'smartpei@example.com',
      lastValidated: now,
      usedCount: 10,
      totalCount: 50,
      createdAt: now,
      teams: [
        {
          id: uuid(),
          name: 'Equipe de Desenvolvimento',
          description: 'Equipe responsável pelo desenvolvimento do Smart PEI',
          members: [
            {
              id: '101',
              name: 'Coordenador Técnico',
              email: 'coord@example.com',
              role: 'coordinator'
            },
            {
              id: '102',
              name: 'Desenvolvedor Principal',
              email: 'dev@example.com',
              role: 'professional'
            }
          ],
          licenses: ['1'],
          createdAt: now
        }
      ]
    },
    {
      id: '2',
      key: 'DEMO-EEEE-FFFF-GGGG-HHHH',
      status: 'active',
      type: 'individual',
      model: 'individual',
      expiresAt: oneYearFromNow.toISOString(),
      maxUsers: 1,
      features: ['basic'],
      isActive: true,
      assignedTo: 'professor@example.com',
      lastValidated: now,
      usedCount: 1,
      totalCount: 1,
      createdAt: now,
      teams: []
    },
    {
      id: '3',
      key: 'DEMO-IIII-JJJJ-KKKK-LLLL',
      status: 'inactive',
      type: 'professional',
      model: 'individual',
      expiresAt: now, // Already expired
      maxUsers: 1,
      features: ['basic', 'advanced_reports'],
      isActive: false,
      assignedTo: null,
      lastValidated: null,
      usedCount: 0,
      totalCount: 1,
      createdAt: now,
      teams: []
    }
  ];
}

// Ensure teams have correct types
export function ensureTeamsHaveCorrectTypes(licenses: License[]): License[] {
  return licenses.map(license => {
    // If teams is not defined or not an array, initialize it
    if (!license.teams || !Array.isArray(license.teams)) {
      license.teams = [];
    }
    
    // Ensure each team has the correct types
    if (license.teams.length > 0) {
      license.teams = license.teams.map(team => {
        // Ensure members is an array
        if (!team.members || !Array.isArray(team.members)) {
          team.members = [];
        }
        
        // Ensure licenses is an array
        if (!team.licenses || !Array.isArray(team.licenses)) {
          team.licenses = [license.id];
        }
        
        return team;
      });
    }
    
    return license;
  });
}
