
import { StudentFormData } from '@/hooks/useStudents';

/**
 * Hook for form validation logic
 */
export const useFormValidation = () => {
  /**
   * Validates the student form data
   */
  const validateForm = (formData: StudentFormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Basic info validation
    if (!formData.name) errors.name = 'Nome é obrigatório';
    if (!formData.birthDate) errors.birthDate = 'Data de nascimento é obrigatória';
    if (!formData.guardianName) errors.guardianName = 'Nome do responsável é obrigatório';
    
    // Academic info validation
    if (!formData.gradeLevel) errors.gradeLevel = 'Série escolar é obrigatória';
    
    // Diagnóstico validation (only if hasDiagnosis is true)
    if (formData.hasDiagnosis) {
      if (!formData.diagnoses?.length) errors.diagnoses = 'Pelo menos um diagnóstico é obrigatório';
    }
    
    // Medication validation (only if medicationUse is true)
    if (formData.medicationUse && !formData.medicationNotes) {
      errors.medicationNotes = 'Informações sobre a medicação são obrigatórias';
    }
    
    return errors;
  };
  
  /**
   * Find which tab has validation errors
   */
  const findTabWithErrors = (errors: Record<string, string>): string | null => {
    const tabFieldMap: Record<string, string[]> = {
      basic: ['name', 'birthDate', 'gender', 'guardianName', 'guardianRelationship', 'guardianPhone'],
      academic: ['gradeLevel', 'schoolName', 'teacherName'],
      diagnostic: ['diagnoses', 'diagnosisNotes'],
      support: ['supportLevel', 'therapies', 'accommodations', 'therapyNotes', 'medicationNotes']
    };
    
    for (const [tab, fields] of Object.entries(tabFieldMap)) {
      if (fields.some(field => !!errors[field])) {
        return tab;
      }
    }
    
    return null;
  };
  
  return {
    validateForm,
    findTabWithErrors,
  };
};

export default useFormValidation;
