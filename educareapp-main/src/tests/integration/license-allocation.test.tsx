
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LicenseAllocationDialog from '@/components/smart-pei/management/licenses/LicenseAllocationDialog';
import { useLicenseManagement } from '@/hooks/useLicenseManagement';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { License } from '@/types/license';

// Mock the hooks
vi.mock('@/hooks/useLicenseManagement');
vi.mock('@/hooks/useTeamManagement');
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({ toast: vi.fn() })
}));

describe('License Allocation Integration', () => {
  const mockLicense: License = {
    id: 'test-license-id',
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
  
  const mockAllocateLicense = vi.fn().mockResolvedValue(true);
  const mockCreateTeam = vi.fn().mockImplementation(() => 'new-team-id');
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the hook implementations
    (useLicenseManagement as any).mockReturnValue({
      allocateLicense: mockAllocateLicense,
      licenses: [mockLicense],
      getLicenseById: () => mockLicense
    });
    
    (useTeamManagement as any).mockReturnValue({
      createTeam: mockCreateTeam,
      teams: []
    });
  });
  
  it('should allocate a license to a student', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const licenseId = 'test-license-id';
    
    // Act
    const { getByLabelText, getByRole } = render(
      <LicenseAllocationDialog 
        open={true} 
        onOpenChange={onClose} 
        licenseId={licenseId}
        onAllocate={() => {}}
      />
    );
    
    // Fill out the form
    // Enter student details
    await user.type(getByLabelText(/Nome do Aluno/i), 'John Student');
    
    // Enter coordinator details
    await user.type(getByLabelText(/Nome do Coordenador/i), 'Jane Coordinator');
    await user.type(getByLabelText(/Email do Coordenador/i), 'jane@example.com');
    
    // Enter parent details
    await user.type(getByLabelText(/Nome do Responsável/i), 'Parent Name');
    await user.type(getByLabelText(/Email do Responsável/i), 'parent@example.com');
    
    // Submit the form
    await user.click(getByRole('button', { name: /Alocar Licença/i }));
    
    // Assert
    expect(mockCreateTeam).toHaveBeenCalledWith(expect.objectContaining({
      licenseId: 'test-license-id',
      studentName: 'John Student',
      coordinator: expect.objectContaining({
        name: 'Jane Coordinator',
        email: 'jane@example.com'
      }),
      parent: expect.objectContaining({
        name: 'Parent Name',
        email: 'parent@example.com'
      })
    }));
    
    expect(mockAllocateLicense).toHaveBeenCalledWith(expect.objectContaining({
      licenseId: 'test-license-id'
    }));
    
    expect(onClose).toHaveBeenCalled();
  });
});
