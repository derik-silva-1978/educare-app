
import { useState } from 'react';

export const useHealthFormState = <T>(initialState: T) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<T>(initialState);

  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = (resetData: T) => {
    setFormData(resetData);
    setShowForm(false);
  };

  return {
    showForm,
    setShowForm,
    formData,
    setFormData,
    updateField,
    resetForm
  };
};
