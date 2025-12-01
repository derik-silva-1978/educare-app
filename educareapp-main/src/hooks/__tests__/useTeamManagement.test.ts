
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTeamManagement } from '../useTeamManagement';
import { License, LicenseTeam, TeamMember } from '@/types/license';
import { renderHook, act } from '@testing-library/react-hooks';

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({ toast: vi.fn() })
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useTeamManagement', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });
  
  it('should create a team and associate it with a license', () => {
    // Arrange
    const { result } = renderHook(() => useTeamManagement());
    
    // Setup test data
    const licenseId = 'test-license-id';
    const testCoordinator: TeamMember = {
      id: 'coord-1',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'coordinator'
    };
    
    const testParent: TeamMember = {
      id: 'parent-1',
      name: 'John Parent',
      email: 'john@example.com',
      role: 'parent'
    };
    
    // Create a license first
    const testLicense: License = {
      id: licenseId,
      key: 'TEST-KEY-12345',
      type: 'professional',
      status: 'active',
      expiresAt: '2024-12-31',
      maxUsers: 5,
      features: [],
      isActive: true,
      assignedTo: 'Test User',
      lastValidated: null,
      model: 'individual',
      teams: [],
      createdAt: '2023-01-01'
    };
    
    window.localStorage.setItem(`license_${licenseId}`, JSON.stringify(testLicense));
    
    // Act
    act(() => {
      result.current.createTeam({
        licenseId,
        studentId: 'student-123',
        studentName: 'Test Student',
        teamName: 'Test Team',
        coordinator: testCoordinator,
        parent: testParent,
        professionals: []
      });
    });
    
    // Assert
    const teamData = JSON.parse(window.localStorage.getItem('teams') || '[]');
    expect(teamData.length).toBe(1);
    
    const team: LicenseTeam = teamData[0];
    expect(team.id).toBeDefined();
    expect(team.name).toBe('Test Team');
    expect(team.studentId).toBe('student-123');
    expect(team.studentName).toBe('Test Student');
    expect(team.coordinator).toEqual(testCoordinator);
    expect(team.parent).toEqual(testParent);
    expect(team.licenseId).toBe(licenseId);
    expect(team.description).toBe(''); // Add default description
    expect(team.members).toEqual([testCoordinator, testParent]); // Coordinator and parent should be in members
    expect(team.licenses).toEqual([licenseId]); // License ID should be in licenses array
    
    // Check if the license was updated with the team reference
    const updatedLicense = JSON.parse(window.localStorage.getItem(`license_${licenseId}`) || '{}');
    expect(updatedLicense.teams && updatedLicense.teams.length).toBe(1);
    expect(updatedLicense.teams[0].id).toBe(team.id);
  });
  
  it('should update an existing team', () => {
    // Arrange
    const { result } = renderHook(() => useTeamManagement());
    const licenseId = 'test-license-id-2';
    const teamId = 'test-team-id';
    
    // Create a sample team first
    const initialTeam: LicenseTeam = {
      id: teamId,
      name: 'Initial Team',
      description: 'Initial description',
      studentId: 'student-456',
      studentName: 'Student Before Update',
      coordinator: {
        id: 'coord-2',
        name: 'Coordinator Before',
        email: 'coord@example.com',
        role: 'coordinator'
      },
      parent: {
        id: 'parent-2',
        name: 'Parent Before',
        email: 'parent@example.com',
        role: 'parent'
      },
      professionals: [],
      createdAt: '2023-06-01',
      updatedAt: '2023-06-01',
      licenseId: licenseId,
      members: [{
        id: 'coord-2',
        name: 'Coordinator Before',
        email: 'coord@example.com',
        role: 'coordinator'
      }, {
        id: 'parent-2',
        name: 'Parent Before',
        email: 'parent@example.com',
        role: 'parent'
      }],
      licenses: [licenseId]
    };
    
    window.localStorage.setItem('teams', JSON.stringify([initialTeam]));
    
    // Act - Update the team
    act(() => {
      result.current.updateTeam({
        ...initialTeam,
        name: 'Updated Team Name',
        studentName: 'Updated Student Name',
        coordinator: {
          ...initialTeam.coordinator as TeamMember,
          name: 'Updated Coordinator'
        }
      });
    });
    
    // Assert
    const updatedTeamData = JSON.parse(window.localStorage.getItem('teams') || '[]');
    expect(updatedTeamData.length).toBe(1);
    
    const updatedTeam = updatedTeamData[0];
    expect(updatedTeam.id).toBe(teamId);
    expect(updatedTeam.name).toBe('Updated Team Name');
    expect(updatedTeam.studentName).toBe('Updated Student Name');
    expect((updatedTeam.coordinator as TeamMember).name).toBe('Updated Coordinator');
    expect(updatedTeam.description).toBe('Initial description');
    expect(updatedTeam.members.length).toBe(2);
    expect(updatedTeam.licenses).toEqual([licenseId]);
  });
});
