
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateLicense, showLicenseValidationResult } from '../license-validation';
import { toast } from '@/hooks/use-toast';
import { License } from '@/types/license';

// Mock the toast function
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('License Validation', () => {
  let mockLicense: License;
  const now = new Date('2023-01-15');
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock Date.now for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(now);
    
    // Setup a basic license for testing
    mockLicense = {
      id: 'test-license-id',
      key: 'LICENSE-KEY-12345',
      type: 'professional',
      expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days in future
      maxUsers: 10,
      features: ['feature-1', 'feature-2'],
      isActive: true,
      assignedTo: 'Test User',
      lastValidated: null,
      model: 'individual',
      status: 'active',
      createdAt: now.toISOString()
    };
  });
  
  // Using global afterEach instead of vi.afterEach
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should validate an active and non-expired license', async () => {
    const result = await validateLicense(mockLicense);
    
    expect(result.isValid).toBe(true);
    expect(result.message).toContain('Licença válida');
    expect(result.errorCode).toBeUndefined();
  });

  it('should invalidate an inactive license', async () => {
    mockLicense.isActive = false;
    
    const result = await validateLicense(mockLicense);
    
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('Esta licença está inativa');
    expect(result.errorCode).toBe('LICENSE_INACTIVE');
  });

  it('should invalidate an expired license', async () => {
    mockLicense.expiresAt = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(); // 1 day in past
    
    const result = await validateLicense(mockLicense);
    
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('Esta licença expirou');
    expect(result.errorCode).toBe('LICENSE_EXPIRED');
  });

  it('should add warning details for licenses expiring soon', async () => {
    mockLicense.expiresAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(); // 15 days in future
    
    const result = await validateLicense(mockLicense);
    
    expect(result.isValid).toBe(true);
    expect(result.details).toContain('Sua licença expirará em breve');
  });

  it('should handle null license gracefully', async () => {
    const result = await validateLicense(null as unknown as License);
    
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('Licença não encontrada');
    expect(result.errorCode).toBe('LICENSE_NOT_FOUND');
  });

  describe('showLicenseValidationResult', () => {
    it('should show success toast for valid license', () => {
      const validResult = {
        isValid: true,
        message: 'Licença válida'
      };
      
      showLicenseValidationResult(validResult);
      
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Licença Válida',
        variant: 'default'
      }));
    });

    it('should show error toast for invalid license', () => {
      const invalidResult = {
        isValid: false,
        message: 'Licença inválida',
        errorCode: 'LICENSE_EXPIRED'
      };
      
      showLicenseValidationResult(invalidResult);
      
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Problema na Licença',
        variant: 'destructive'
      }));
    });
  });
});
