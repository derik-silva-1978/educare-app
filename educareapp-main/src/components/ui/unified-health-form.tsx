import React, { useState } from 'react';
import { EnhancedFormCard, VisualSlider, CircularMeasurement, FormActions, HealthNotes } from './enhanced-form';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HealthMeasurement {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  color?: string;
  type: 'slider' | 'circular';
  step?: number;
  markers?: { value: number; label: string }[];
  helpText?: string;
}

interface UnifiedHealthFormProps {
  title: string;
  description: string;
  measurements: HealthMeasurement[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  initialValues?: Record<string, any>;
  showAddButton?: boolean;
  addButtonText?: string;
}

export const UnifiedHealthForm: React.FC<UnifiedHealthFormProps> = ({
  title,
  description,
  measurements,
  onSubmit,
  isSubmitting = false,
  onCancel,
  initialValues = {},
  showAddButton = true,
  addButtonText = "Adicionar Registro"
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = { notes: '' };
    measurements.forEach(m => {
      initial[m.id] = initialValues[m.id] || m.value;
    });
    return initial;
  });

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      setShowForm(false);
      // Reset form
      const resetData: Record<string, any> = { notes: '' };
      measurements.forEach(m => {
        resetData[m.id] = m.value;
      });
      setFormData(resetData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const updateValue = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const getFormProgress = () => {
    const requiredFields = measurements.filter(m => m.id !== 'notes');
    const filledFields = requiredFields.filter(field => 
      formData[field.id] !== undefined && formData[field.id] !== field.value
    );
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const groupedMeasurements = {
    vital: measurements.filter(m => ['blood_pressure', 'heart_rate', 'temperature'].some(type => m.id.includes(type))),
    growth: measurements.filter(m => ['weight', 'height', 'circumference'].some(type => m.id.includes(type))),
    wellness: measurements.filter(m => ['energy', 'sleep', 'mood', 'nausea', 'appetite', 'anxiety', 'stress', 'support'].some(type => m.id.includes(type))),
    other: measurements.filter(m => 
      !['blood_pressure', 'heart_rate', 'temperature', 'weight', 'height', 'circumference', 'energy', 'sleep', 'mood', 'nausea', 'appetite', 'anxiety', 'stress', 'support']
        .some(type => m.id.includes(type))
    )
  };

  if (!showForm && showAddButton) {
    return (
      <div className="border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 hover:border-amber-400 transition-all duration-300">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">{title}</h3>
          <p className="text-amber-700 text-sm mb-4">{description}</p>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            {addButtonText}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl shadow-lg overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 border-b border-amber-300">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-amber-100 text-sm mt-1">{description}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-sm font-medium">{getFormProgress()}% completo</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getFormProgress()}%` }}
          />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Sinais Vitais */}
        {groupedMeasurements.vital.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
              <h4 className="text-lg font-bold text-slate-800 uppercase tracking-wide">SINAIS VITAIS</h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groupedMeasurements.vital.map((measurement) => (
                <div key={measurement.id} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  {measurement.type === 'circular' ? (
                    <CircularMeasurement
                      label={measurement.label}
                      value={formData[measurement.id]}
                      onChange={(value) => updateValue(measurement.id, value)}
                      min={measurement.min}
                      max={measurement.max}
                      unit={measurement.unit}
                      color={measurement.color}
                    />
                  ) : (
                    <VisualSlider
                      label={measurement.label}
                      value={formData[measurement.id]}
                      onChange={(value) => updateValue(measurement.id, value)}
                      min={measurement.min}
                      max={measurement.max}
                      step={measurement.step}
                      unit={measurement.unit}
                      colorGradient={measurement.color ? [measurement.color] : undefined}
                      markers={measurement.markers}
                      helpText={measurement.helpText}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crescimento e Físico */}
        {groupedMeasurements.growth.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
              <h4 className="text-lg font-bold text-slate-800 uppercase tracking-wide">CRESCIMENTO E FÍSICO</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedMeasurements.growth.map((measurement) => (
                <div key={measurement.id} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  {measurement.type === 'circular' ? (
                    <CircularMeasurement
                      label={measurement.label}
                      value={formData[measurement.id]}
                      onChange={(value) => updateValue(measurement.id, value)}
                      min={measurement.min}
                      max={measurement.max}
                      unit={measurement.unit}
                      color={measurement.color}
                      size="md"
                    />
                  ) : (
                    <VisualSlider
                      label={measurement.label}
                      value={formData[measurement.id]}
                      onChange={(value) => updateValue(measurement.id, value)}
                      min={measurement.min}
                      max={measurement.max}
                      step={measurement.step}
                      unit={measurement.unit}
                      colorGradient={measurement.color ? [measurement.color] : undefined}
                      markers={measurement.markers}
                      helpText={measurement.helpText}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bem-estar */}
        {groupedMeasurements.wellness.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              <h4 className="text-lg font-bold text-slate-800 uppercase tracking-wide">BEM-ESTAR</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedMeasurements.wellness.map((measurement) => (
                <div key={measurement.id} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  {measurement.type === 'circular' ? (
                    <CircularMeasurement
                      label={measurement.label}
                      value={formData[measurement.id]}
                      onChange={(value) => updateValue(measurement.id, value)}
                      min={measurement.min}
                      max={measurement.max}
                      unit={measurement.unit}
                      color={measurement.color}
                    />
                  ) : (
                    <VisualSlider
                      label={measurement.label}
                      value={formData[measurement.id]}
                      onChange={(value) => updateValue(measurement.id, value)}
                      min={measurement.min}
                      max={measurement.max}
                      step={measurement.step}
                      unit={measurement.unit}
                      colorGradient={measurement.color ? [measurement.color] : undefined}
                      markers={measurement.markers}
                      helpText={measurement.helpText}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other measurements */}
        {groupedMeasurements.other.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupedMeasurements.other.map((measurement) => (
              <div key={measurement.id} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                {measurement.type === 'circular' ? (
                  <CircularMeasurement
                    label={measurement.label}
                    value={formData[measurement.id]}
                    onChange={(value) => updateValue(measurement.id, value)}
                    min={measurement.min}
                    max={measurement.max}
                    unit={measurement.unit}
                    color={measurement.color}
                  />
                ) : (
                  <VisualSlider
                    label={measurement.label}
                    value={formData[measurement.id]}
                    onChange={(value) => updateValue(measurement.id, value)}
                    min={measurement.min}
                    max={measurement.max}
                    step={measurement.step}
                    unit={measurement.unit}
                    colorGradient={measurement.color ? [measurement.color] : undefined}
                    markers={measurement.markers}
                    helpText={measurement.helpText}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Notes Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <HealthNotes
            value={formData.notes || ''}
            onChange={(value) => updateValue('notes', value)}
          />
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <FormActions
            onSave={handleSubmit}
            onCancel={showAddButton ? () => setShowForm(false) : onCancel}
            isSaving={isSubmitting}
            saveText="Salvar Registro"
          />
        </div>
      </div>
    </div>
  );
};
