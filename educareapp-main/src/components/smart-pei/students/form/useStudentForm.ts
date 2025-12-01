
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import useStudents, { StudentFormData } from '@/hooks/useStudents';
import useFormState from './useFormState';
import useFormValidation from './useFormValidation';
import { UseStudentFormProps, UseStudentFormReturn } from './types';
import { Diagnosis } from '@/types/diagnosis';

export const useStudentForm = ({ studentId }: UseStudentFormProps): UseStudentFormReturn => {
  const { saveStudent } = useStudents();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get form state from the hook
  const {
    formData,
    handleChange,
    handleCheckboxArray,
    resetForm
  } = useFormState(studentId ? {} as StudentFormData : {} as StudentFormData);
  
  // Track additional state needed for form
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [hasChanged, setHasChanged] = useState(false);
  
  // Get form validation methods
  const { validateForm, findTabWithErrors } = useFormValidation();
  
  // Method for auto-save functionality
  const saveProgress = async () => {
    try {
      // Don't validate on auto-save to avoid disrupting user experience
      // Only save if there's at least a name (basic info)
      if (!formData.name) {
        return false;
      }
      
      // Call saveStudent with simplified parameters
      const savedId = saveStudent(formData, studentId);
      console.log('Auto-saved student data', savedId);
      return true;
    } catch (error) {
      console.error('Error auto-saving student:', error);
      return false;
    }
  };
  
  // Additional methods required by StudentForm interface
  const updateField = (field: keyof StudentFormData, value: any) => {
    handleChange(field, value);
  };
  
  const addDiagnosis = (diagnosis: Diagnosis) => {
    const currentDiagnoses = formData.diagnoses || [];
    handleChange('diagnoses', [...currentDiagnoses, diagnosis]);
  };
  
  const updateDiagnosis = (index: number, diagnosis: Diagnosis) => {
    const updatedDiagnoses = [...(formData.diagnoses || [])];
    updatedDiagnoses[index] = diagnosis;
    handleChange('diagnoses', updatedDiagnoses);
  };
  
  const removeDiagnosis = (index: number) => {
    const updatedDiagnoses = [...(formData.diagnoses || [])];
    updatedDiagnoses.splice(index, 1);
    handleChange('diagnoses', updatedDiagnoses);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validation
      const validationErrors = validateForm(formData);
      setFormErrors(validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        // If there are errors, navigate to the first tab with errors
        const tabWithErrors = findTabWithErrors(validationErrors);
        if (tabWithErrors) {
          setActiveTab(tabWithErrors);
        }
        
        setIsSubmitting(false);
        toast({
          title: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos obrigatórios',
          variant: 'destructive'
        });
        return;
      }
      
      // Ensure diagnoses is always an array before saving
      const dataToSave = {
        ...formData,
        diagnoses: Array.isArray(formData.diagnoses) ? formData.diagnoses : []
      };
      
      // Save student with simplified parameters
      const savedId = saveStudent(dataToSave, studentId);
      
      toast({
        title: studentId ? 'Estudante atualizado' : 'Estudante criado',
        description: studentId 
          ? 'As informações do estudante foram atualizadas com sucesso!' 
          : 'O novo estudante foi adicionado com sucesso!',
        variant: 'default'
      });
      
      // Navigate to student profile
      navigate(`/smart-pei/students/${savedId}`);
      
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar os dados do estudante',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    navigate(-1);
  };

  return {
    formData,
    activeTab,
    isSubmitting,
    formErrors,
    setActiveTab,
    handleChange,
    handleCheckboxArray,
    handleSubmit,
    handleCancel,
    saveProgress,
    // Additional properties required by StudentForm
    isLoading: false,
    hasChanged,
    updateField,
    addDiagnosis,
    updateDiagnosis,
    removeDiagnosis
  };
};

// Add missing React import
import React, { useState } from 'react';

export default useStudentForm;
