import { useState, useCallback } from 'react';
import { StudentFormData } from '@/hooks/useStudents';

export const useFormState = (initialData: StudentFormData) => {
  const [formData, setFormData] = useState<StudentFormData>(initialData);
  
  // Fix for the numeric value handling
  const handleChange = useCallback((field: keyof StudentFormData, value: any) => {
    setFormData(prev => {
      // Convert string values to numbers for numeric fields if needed
      if (['age', 'gradeYear'].includes(field) && typeof value === 'string') {
        // Parse string to number or use 0 if parsing fails
        const numericValue = value === '' ? undefined : Number(value);
        return { ...prev, [field]: numericValue };
      }
      
      return { ...prev, [field]: value };
    });
  }, []);
  
  const handleCheckboxArray = useCallback(
    (field: keyof StudentFormData, value: string) => {
      setFormData(prev => {
        const currentValues = (prev[field] as string[]) || [];
        const isPresent = currentValues.includes(value);

        return {
          ...prev,
          [field]: isPresent
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value],
        };
      });
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  return {
    formData,
    handleChange,
    handleCheckboxArray,
    resetForm
  };
};

export default useFormState;
