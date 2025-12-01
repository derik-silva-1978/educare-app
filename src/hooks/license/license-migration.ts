
import { License } from '@/types/license';
import { loadLicenses } from './license-storage';
import { validateLicense } from './license-validation';
import { toast } from '@/hooks/use-toast';

export interface MigrationResult {
  total: number;
  valid: number;
  invalid: number;
  errors: Array<{
    licenseId: string;
    licenseKey: string;
    error: string;
  }>;
  validLicenses: License[];
}

/**
 * Validates all licenses and prepares them for migration
 * Returns a detailed report of the validation results
 */
export async function validateAllLicenses(): Promise<MigrationResult> {
  const licenses = loadLicenses();
  const result: MigrationResult = {
    total: licenses.length,
    valid: 0,
    invalid: 0,
    errors: [],
    validLicenses: []
  };

  // Validate each license
  for (const license of licenses) {
    try {
      const validationResult = await validateLicense(license);
      
      // Even expired licenses are considered valid for migration
      if (validationResult.isValid || validationResult.errorCode === 'LICENSE_EXPIRED') {
        result.valid++;
        result.validLicenses.push(license);
      } else {
        result.invalid++;
        result.errors.push({
          licenseId: license.id,
          licenseKey: license.key,
          error: validationResult.message
        });
      }
    } catch (error) {
      result.invalid++;
      result.errors.push({
        licenseId: license.id,
        licenseKey: license.key,
        error: error instanceof Error ? error.message : 'Unknown error during validation'
      });
    }
  }

  return result;
}

/**
 * Exports all licenses to a JSON file for backup
 */
export function exportLicensesToJson(): string {
  const licenses = loadLicenses();
  const jsonData = JSON.stringify(licenses, null, 2);
  
  // Create a downloadable blob
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `smartpei-licenses-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  URL.revokeObjectURL(url);
  
  toast({
    title: "Exportação Concluída",
    description: `${licenses.length} licenças exportadas com sucesso.`,
  });
  
  return jsonData;
}

/**
 * Imports licenses from a JSON file
 */
export function importLicensesFromJson(jsonData: string): License[] {
  try {
    const licenses = JSON.parse(jsonData) as License[];
    
    // Validate the structure of each license
    if (!Array.isArray(licenses)) {
      throw new Error('O arquivo importado não contém um array de licenças.');
    }
    
    // Basic validation of required fields
    for (const license of licenses) {
      if (!license.id || !license.key || !license.expiresAt) {
        throw new Error('Uma ou mais licenças não possuem os campos obrigatórios (id, key, expiresAt).');
      }
    }
    
    toast({
      title: "Importação Concluída",
      description: `${licenses.length} licenças importadas com sucesso.`,
    });
    
    return licenses;
  } catch (error) {
    toast({
      title: "Erro na Importação",
      description: error instanceof Error ? error.message : 'Erro desconhecido ao importar licenças.',
      variant: "destructive"
    });
    
    return [];
  }
}

/**
 * Prepares migration payload for API submission
 */
export async function prepareMigrationPayload(): Promise<{
  success: boolean;
  payload?: any;
  error?: string;
}> {
  try {
    const migrationResult = await validateAllLicenses();
    
    if (migrationResult.invalid > 0) {
      return {
        success: false,
        error: `${migrationResult.invalid} licenças inválidas encontradas. Por favor, corrija os erros antes de migrar.`
      };
    }
    
    const payload = {
      licenses: migrationResult.validLicenses,
      meta: {
        migratedAt: new Date().toISOString(),
        totalCount: migrationResult.total
      }
    };
    
    return {
      success: true,
      payload
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao preparar a migração.'
    };
  }
}
