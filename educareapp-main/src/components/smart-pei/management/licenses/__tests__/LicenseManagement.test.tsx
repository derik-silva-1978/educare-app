
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LicenseManagement } from '../LicenseManagement';

// Mock dependencies
vi.mock('@/hooks/useLicenseManagement', () => ({
  useLicenseManagement: () => ({
    licenses: [
      {
        id: 'license-1',
        key: 'KEY-12345',
        type: 'professional',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxUsers: 10,
        features: ['feature-1', 'feature-2'],
        isActive: true,
        assignedTo: 'Test User',
        lastValidated: null,
        model: 'individual'
      },
      {
        id: 'license-2',
        key: 'KEY-67890',
        type: 'enterprise',
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        maxUsers: 50,
        features: ['feature-1', 'feature-2', 'feature-3'],
        isActive: true,
        assignedTo: 'Enterprise Org',
        lastValidated: null,
        model: 'enterprise',
        usedCount: 5,
        totalCount: 20
      }
    ],
    isLoading: false,
    refreshLicenses: vi.fn(),
    licenseMetrics: {
      total: 2,
      active: 2,
      inactive: 0,
      expired: 0,
      assigned: 2,
      unassigned: 0,
      expiringIn30Days: 1,
      byType: {
        professional: 1,
        enterprise: 1
      },
      byModel: {
        individual: 1,
        enterprise: 1
      },
      expirationByMonth: [],
      teamsTotal: 0,
      averageTeamSize: 0,
      enterpriseUtilization: 25 // 5/20 = 25%
    }
  })
}));

// Mock Dialog
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }) => <div data-testid="dialog-title">{children}</div>,
  DialogDescription: ({ children }) => <div data-testid="dialog-description">{children}</div>,
  DialogFooter: ({ children }) => <div data-testid="dialog-footer">{children}</div>
}));

// Mock Tabs
vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange }) => (
    <div data-testid="tabs" data-value={value} data-onvaluechange={onValueChange}>
      {children}
    </div>
  ),
  TabsList: ({ children }) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value }) => (
    <button data-testid={`tab-${value}`} data-value={value}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value }) => (
    <div data-testid={`tab-content-${value}`} data-value={value}>
      {children}
    </div>
  )
}));

// Mock LicensesList
vi.mock('../LicensesList', () => ({
  LicensesList: ({ licenses, onEditLicense }) => (
    <div data-testid="licenses-list">
      {licenses.map(license => (
        <div key={license.id} data-testid={`license-${license.id}`}>
          <button 
            data-testid={`edit-license-${license.id}`}
            onClick={() => onEditLicense(license)}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  )
}));

// Mock LicenseDialog
vi.mock('../LicenseDialog', () => ({
  LicenseDialog: ({ open, onOpenChange, license, onClose }) => (
    open ? (
      <div data-testid="license-dialog" data-license-id={license?.id}>
        <button data-testid="close-dialog" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null
  )
}));

describe('LicenseManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the license management interface', () => {
    const { getByTestId } = render(<LicenseManagement />);
    
    // Check if tabs are rendered
    expect(getByTestId('tabs')).toBeInTheDocument();
    expect(getByTestId('tab-licenses')).toBeInTheDocument();
    expect(getByTestId('tab-analytics')).toBeInTheDocument();
    
    // Check if license list is rendered
    expect(getByTestId('licenses-list')).toBeInTheDocument();
    expect(getByTestId('license-license-1')).toBeInTheDocument();
    expect(getByTestId('license-license-2')).toBeInTheDocument();
  });

  it('should filter licenses based on search input', async () => {
    const user = userEvent.setup();
    const { getByPlaceholderText, getByTestId, queryByTestId } = render(<LicenseManagement />);
    
    // Get search input
    const searchInput = getByPlaceholderText(/Buscar licenças/i);
    
    // Search for Enterprise Org
    await user.type(searchInput, 'Enterprise Org');
    
    // Only the enterprise license should be visible
    expect(getByTestId('license-license-2')).toBeInTheDocument();
    expect(queryByTestId('license-license-1')).not.toBeInTheDocument();
  });

  it('should open the license dialog when adding a new license', async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId } = render(<LicenseManagement />);
    
    // Click "Nova Licença" button
    const addButton = getByRole('button', { name: /Nova Licença/i });
    await user.click(addButton);
    
    // Check if dialog opened
    expect(getByTestId('license-dialog')).toBeInTheDocument();
    expect(getByTestId('license-dialog')).not.toHaveAttribute('data-license-id');
  });

  it('should open the license dialog with existing license when editing', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<LicenseManagement />);
    
    // Click edit button on first license
    const editButton = getByTestId('edit-license-license-1');
    await user.click(editButton);
    
    // Check if dialog opened with correct license
    expect(getByTestId('license-dialog')).toBeInTheDocument();
    expect(getByTestId('license-dialog')).toHaveAttribute('data-license-id', 'license-1');
  });

  it('should close the dialog when onClose is called', async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId, queryByTestId } = render(<LicenseManagement />);
    
    // Open dialog
    const addButton = getByRole('button', { name: /Nova Licença/i });
    await user.click(addButton);
    
    // Check if dialog opened
    expect(getByTestId('license-dialog')).toBeInTheDocument();
    
    // Close dialog
    const closeButton = getByTestId('close-dialog');
    await user.click(closeButton);
    
    // Check if dialog closed
    expect(queryByTestId('license-dialog')).not.toBeInTheDocument();
  });
});
