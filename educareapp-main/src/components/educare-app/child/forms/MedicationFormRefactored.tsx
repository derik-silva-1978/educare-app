
import React from 'react';
import { FormActions } from '@/components/ui/enhanced-form';
import { Pill } from 'lucide-react';
import { HealthFormContainer } from './components/HealthFormContainer';
import { HealthFormHeader } from './components/HealthFormHeader';
import { HealthFormAddButton } from './components/HealthFormAddButton';
import { MedicationFormFields } from './medication/MedicationFormFields';
import { useHealthFormState } from './hooks/useHealthFormState';
import { useFormProgress } from './hooks/useFormProgress';
import { initialMedicationData, medicationRequiredFields, MedicationFormData } from './medication/MedicationFormData';

interface MedicationFormRefactoredProps {
  onSubmit: (data: MedicationFormData) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const MedicationFormRefactored: React.FC<MedicationFormRefactoredProps> = ({
  onSubmit,
  isSubmitting = false,
  onCancel
}) => {
  const { showForm, setShowForm, formData, updateField, resetForm } = useHealthFormState(initialMedicationData);
  const progress = useFormProgress(formData, medicationRequiredFields);

  const handleSubmit = async () => {
    await onSubmit(formData);
    resetForm(initialMedicationData);
  };

  if (!showForm) {
    return (
      <HealthFormAddButton
        title="Registro de Medicamento"
        description="Gerencie medicamentos e tratamentos em curso"
        icon={<Pill className="h-8 w-8" />}
        onAdd={() => setShowForm(true)}
        buttonText="Adicionar Medicamento"
      />
    );
  }

  return (
    <HealthFormContainer
      header={
        <HealthFormHeader
          title="Registro de Medicamento"
          description="Controle de medicações e tratamentos"
          progress={progress}
          icon={<Pill className="h-6 w-6 text-white" />}
        />
      }
    >
      <MedicationFormFields formData={formData} updateField={updateField} />
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <FormActions
          onSave={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSaving={isSubmitting}
          saveText="Salvar Medicamento"
        />
      </div>
    </HealthFormContainer>
  );
};
