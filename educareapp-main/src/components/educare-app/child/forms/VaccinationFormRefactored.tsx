
import React from 'react';
import { FormActions } from '@/components/ui/enhanced-form';
import { Syringe } from 'lucide-react';
import { HealthFormContainer } from './components/HealthFormContainer';
import { HealthFormHeader } from './components/HealthFormHeader';
import { HealthFormAddButton } from './components/HealthFormAddButton';
import { VaccinationFormFields } from './vaccination/VaccinationFormFields';
import { useHealthFormState } from './hooks/useHealthFormState';
import { useFormProgress } from './hooks/useFormProgress';
import { initialVaccinationData, vaccinationRequiredFields, VaccinationFormData } from './vaccination/VaccinationFormData';

interface VaccinationFormRefactoredProps {
  onSubmit: (data: VaccinationFormData) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const VaccinationFormRefactored: React.FC<VaccinationFormRefactoredProps> = ({
  onSubmit,
  isSubmitting = false,
  onCancel
}) => {
  const { showForm, setShowForm, formData, updateField, resetForm } = useHealthFormState(initialVaccinationData);
  const progress = useFormProgress(formData, vaccinationRequiredFields);

  const handleSubmit = async () => {
    await onSubmit(formData);
    resetForm(initialVaccinationData);
  };

  if (!showForm) {
    return (
      <HealthFormAddButton
        title="Registro de Vacinação"
        description="Registre vacinas aplicadas e agende próximas doses"
        icon={<Syringe className="h-8 w-8" />}
        onAdd={() => setShowForm(true)}
        buttonText="Adicionar Vacina"
      />
    );
  }

  return (
    <HealthFormContainer
      header={
        <HealthFormHeader
          title="Registro de Vacinação"
          description="Mantenha o calendário vacinal atualizado"
          progress={progress}
          icon={<Syringe className="h-6 w-6 text-white" />}
        />
      }
    >
      <VaccinationFormFields formData={formData} updateField={updateField} />
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <FormActions
          onSave={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSaving={isSubmitting}
          saveText="Salvar Vacina"
        />
      </div>
    </HealthFormContainer>
  );
};
