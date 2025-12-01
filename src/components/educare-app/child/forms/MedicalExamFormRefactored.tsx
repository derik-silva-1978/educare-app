
import React from 'react';
import { FormActions } from '@/components/ui/enhanced-form';
import { FileText } from 'lucide-react';
import { HealthFormContainer } from './components/HealthFormContainer';
import { HealthFormHeader } from './components/HealthFormHeader';
import { HealthFormAddButton } from './components/HealthFormAddButton';
import { MedicalExamFormFields } from './medical-exam/MedicalExamFormFields';
import { useHealthFormState } from './hooks/useHealthFormState';
import { useFormProgress } from './hooks/useFormProgress';
import { initialMedicalExamData, medicalExamRequiredFields, MedicalExamFormData } from './medical-exam/MedicalExamFormData';

interface MedicalExamFormRefactoredProps {
  onSubmit: (data: MedicalExamFormData) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const MedicalExamFormRefactored: React.FC<MedicalExamFormRefactoredProps> = ({
  onSubmit,
  isSubmitting = false,
  onCancel
}) => {
  const { showForm, setShowForm, formData, updateField, resetForm } = useHealthFormState(initialMedicalExamData);
  const progress = useFormProgress(formData, medicalExamRequiredFields);

  const handleSubmit = async () => {
    await onSubmit(formData);
    resetForm(initialMedicalExamData);
  };

  if (!showForm) {
    return (
      <HealthFormAddButton
        title="Exame Médico"
        description="Registre resultados de exames e consultas"
        icon={<FileText className="h-8 w-8" />}
        onAdd={() => setShowForm(true)}
        buttonText="Adicionar Exame"
      />
    );
  }

  return (
    <HealthFormContainer
      header={
        <HealthFormHeader
          title="Exame Médico"
          description="Registre resultados e acompanhamentos"
          progress={progress}
          icon={<FileText className="h-6 w-6 text-white" />}
        />
      }
    >
      <MedicalExamFormFields formData={formData} updateField={updateField} />
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <FormActions
          onSave={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSaving={isSubmitting}
          saveText="Salvar Exame"
        />
      </div>
    </HealthFormContainer>
  );
};
