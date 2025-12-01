
import { License, ValidationResult } from '@/types/license';
import { toast } from '@/hooks/use-toast';

/**
 * Validates a license to check if it's active and not expired
 */
export const validateLicense = async (license: License): Promise<ValidationResult> => {
  // Handle null/undefined license
  if (!license) {
    return {
      isValid: false,
      message: 'Licença não encontrada. Verifique se a chave de licença foi inserida corretamente.',
      errorCode: 'LICENSE_NOT_FOUND'
    };
  }
  
  // Check if license is active
  if (license.isActive === false) {
    return {
      isValid: false,
      message: 'Esta licença está inativa. Entre em contato com o suporte para mais informações.',
      errorCode: 'LICENSE_INACTIVE'
    };
  }
  
  // Check if license is expired
  const now = new Date();
  const expiryDate = new Date(license.expiresAt);
  
  if (expiryDate < now) {
    return {
      isValid: false,
      message: `Esta licença expirou em ${expiryDate.toLocaleDateString()}. Entre em contato com o suporte para renovação.`,
      errorCode: 'LICENSE_EXPIRED'
    };
  }
  
  // License is valid, but check for upcoming expiration
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  let details = undefined;
  
  if (daysUntilExpiry <= 30) {
    details = `Sua licença expirará em ${daysUntilExpiry} dias. Considere renová-la em breve.`;
  }
  
  // Check seat/user limitations
  if (license.usedCount && license.totalCount && license.usedCount >= license.totalCount) {
    return {
      isValid: false,
      message: `Esta licença atingiu o limite máximo de ${license.totalCount} usuários. Para adicionar mais usuários, atualize sua licença.`,
      errorCode: 'LICENSE_SEAT_LIMIT',
      details
    };
  }
  
  // Return a successful validation result
  return {
    isValid: true,
    message: `Licença válida até ${expiryDate.toLocaleDateString()}.`,
    details
  };
};

/**
 * Shows a toast notification with license validation results
 */
export const showLicenseValidationResult = (result: ValidationResult) => {
  if (result.isValid) {
    toast({
      title: 'Licença Válida',
      description: result.message,
      variant: 'default'
    });
    
    if (result.details) {
      toast({
        title: 'Atenção',
        description: result.details as string,
        variant: result.details ? 'default' : 'default'
      });
    }
  } else {
    toast({
      title: 'Problema na Licença',
      description: result.message,
      variant: 'destructive'
    });
  }
};

export default { validateLicense, showLicenseValidationResult };
