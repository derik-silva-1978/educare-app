
import React, { useState } from 'react';
import { HealthFormContainer } from './components/HealthFormContainer';
import { HealthFormHeader } from './components/HealthFormHeader';
import { HealthFormAddButton } from './components/HealthFormAddButton';
import { VitalSignsSection, GrowthSection, WellnessSection } from './components/HealthFormSections';
import { FormActions, HealthNotes } from '@/components/ui/enhanced-form';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';

interface UnifiedHealthFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const UnifiedHealthForm: React.FC<UnifiedHealthFormProps> = ({
  onSubmit,
  isSubmitting = false,
  onCancel
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    description: '',
    // Growth measurements
    height: 85,
    weight: 12,
    head_circumference: 48,
    // Vital signs
    temperature: 36.5,
    heart_rate: 80,
    // Wellness
    energy_level: 5,
    sleep_quality: 7,
    appetite: 6,
    mood: 7,
    // Notes
    notes: ''
  });

  const updateValue = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const getFormProgress = () => {
    const measurementFields = ['height', 'weight', 'temperature', 'heart_rate'];
    const changedMeasurements = measurementFields.filter(field => 
      formData[field] !== getDefaultValue(field)
    );
    return Math.round((changedMeasurements.length / measurementFields.length) * 100);
  };

  const getDefaultValue = (field: string) => {
    const defaults = { height: 85, weight: 12, temperature: 36.5, heart_rate: 80 };
    return defaults[field] || 0;
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        type: 'growth',
        name: 'Registro de Saúde Completo',
        date: formData.date,
        description: formData.description || formData.notes,
        measurements: {
          height: formData.height,
          weight: formData.weight,
          head_circumference: formData.head_circumference,
          temperature: formData.temperature,
          heart_rate: formData.heart_rate,
          energy_level: formData.energy_level,
          sleep_quality: formData.sleep_quality,
          appetite: formData.appetite,
          mood: formData.mood
        }
      };
      
      await onSubmit(submitData);
      setShowForm(false);
      // Reset form
      setFormData({
        date: new Date(),
        description: '',
        height: 85,
        weight: 12,
        head_circumference: 48,
        temperature: 36.5,
        heart_rate: 80,
        energy_level: 5,
        sleep_quality: 7,
        appetite: 6,
        mood: 7,
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!showForm) {
    return (
      <HealthFormAddButton
        title="Registro de Saúde Completo"
        description="Registre medições de crescimento, sinais vitais e bem-estar"
        onAdd={() => setShowForm(true)}
        icon={<Heart className="h-5 w-5" />}
        buttonText="Adicionar Registro"
      />
    );
  }

  return (
    <HealthFormContainer
      header={
        <HealthFormHeader
          title="Novo Registro de Saúde"
          description="Registre informações completas de saúde e desenvolvimento"
          progress={getFormProgress()}
          icon={<Heart className="h-6 w-6 text-white" />}
        />
      }
    >
      <div className="space-y-10">
        {/* Date Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="space-y-4">
            <Label htmlFor="date" className="text-base font-semibold text-slate-700">Data do Registro</Label>
            <DatePicker
              date={formData.date}
              setDate={(date) => updateValue('date', date || new Date())}
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Health Measurements */}
        <VitalSignsSection formData={formData} updateValue={updateValue} />
        <GrowthSection formData={formData} updateValue={updateValue} />
        <WellnessSection formData={formData} updateValue={updateValue} />

        {/* Notes Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <HealthNotes
            value={formData.notes || ''}
            onChange={(value) => updateValue('notes', value)}
            placeholder="Observações sobre o estado geral, comportamento, sintomas..."
          />
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <FormActions
            onSave={handleSubmit}
            onCancel={() => setShowForm(false)}
            isSaving={isSubmitting}
            saveText="Salvar Registro"
          />
        </div>
      </div>
    </HealthFormContainer>
  );
};
