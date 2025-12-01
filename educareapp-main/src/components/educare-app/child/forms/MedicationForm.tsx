
import React, { useState } from 'react';
import { EnhancedFormCard, FormActions } from '@/components/ui/enhanced-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { Plus, Pill } from 'lucide-react';

interface MedicationFormProps {
  onSubmit: (data: {
    medication_name: string;
    dosage: string;
    frequency: string;
    start_date: Date;
    end_date?: Date;
    prescribed_by: string;
    active: boolean;
    purpose?: string;
    side_effects?: string;
    notes?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({
  onSubmit,
  isSubmitting = false,
  onCancel
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    frequency: '',
    start_date: new Date(),
    end_date: undefined as Date | undefined,
    prescribed_by: '',
    active: true,
    purpose: '',
    side_effects: '',
    notes: ''
  });

  const frequencyOptions = [
    { value: '1x-day', label: '1x ao dia' },
    { value: '2x-day', label: '2x ao dia' },
    { value: '3x-day', label: '3x ao dia' },
    { value: '4x-day', label: '4x ao dia' },
    { value: '8h-8h', label: 'De 8 em 8 horas' },
    { value: '12h-12h', label: 'De 12 em 12 horas' },
    { value: 'when-needed', label: 'Quando necessário' },
    { value: 'weekly', label: 'Semanalmente' },
    { value: 'monthly', label: 'Mensalmente' }
  ];

  const handleSubmit = async () => {
    await onSubmit(formData);
    setShowForm(false);
    // Reset form
    setFormData({
      medication_name: '',
      dosage: '',
      frequency: '',
      start_date: new Date(),
      end_date: undefined,
      prescribed_by: '',
      active: true,
      purpose: '',
      side_effects: '',
      notes: ''
    });
  };

  const getFormProgress = () => {
    const requiredFields = ['medication_name', 'dosage', 'frequency', 'start_date', 'prescribed_by'];
    const filledFields = requiredFields.filter(field => {
      if (field === 'start_date') return !!formData.start_date;
      return !!(formData as any)[field];
    });
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  if (!showForm) {
    return (
      <div className="border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 hover:border-amber-400 transition-all duration-300">
        <div className="text-center">
          <Pill className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Registro de Medicamento</h3>
          <p className="text-amber-700 text-sm mb-4">Gerencie medicamentos e tratamentos em curso</p>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Medicamento
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
            <h3 className="text-xl font-bold text-white">Registro de Medicamento</h3>
            <p className="text-amber-100 text-sm mt-1">Controle de medicações e tratamentos</p>
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

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="medication_name" className="text-sm font-semibold text-slate-700">Nome do Medicamento *</Label>
            <Input
              id="medication_name"
              value={formData.medication_name}
              onChange={(e) => setFormData(prev => ({ ...prev, medication_name: e.target.value }))}
              placeholder="Ex: Paracetamol, Amoxicilina"
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="dosage" className="text-sm font-semibold text-slate-700">Dosagem *</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
              placeholder="Ex: 500mg, 5ml, 1 comprimido"
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="frequency" className="text-sm font-semibold text-slate-700">Frequência *</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger className="border-slate-300 focus:border-amber-400 focus:ring-amber-400">
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="prescribed_by" className="text-sm font-semibold text-slate-700">Prescrito por *</Label>
            <Input
              id="prescribed_by"
              value={formData.prescribed_by}
              onChange={(e) => setFormData(prev => ({ ...prev, prescribed_by: e.target.value }))}
              placeholder="Nome do médico ou profissional"
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="start_date" className="text-sm font-semibold text-slate-700">Data de Início *</Label>
            <DatePicker
              date={formData.start_date}
              setDate={(date) => setFormData(prev => ({ ...prev, start_date: date || new Date() }))}
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="end_date" className="text-sm font-semibold text-slate-700">Data de Término (Opcional)</Label>
            <DatePicker
              date={formData.end_date}
              setDate={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="purpose" className="text-sm font-semibold text-slate-700">Finalidade/Indicação</Label>
          <Input
            id="purpose"
            value={formData.purpose}
            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
            placeholder="Para que foi prescrito o medicamento"
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center space-x-3">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
          />
          <Label htmlFor="active" className="text-sm font-semibold text-slate-700">
            Medicamento ativo (em uso)
          </Label>
        </div>

        <div className="space-y-3">
          <Label htmlFor="side_effects" className="text-sm font-semibold text-slate-700">Efeitos Colaterais Observados</Label>
          <Textarea
            id="side_effects"
            value={formData.side_effects}
            onChange={(e) => setFormData(prev => ({ ...prev, side_effects: e.target.value }))}
            placeholder="Descreva qualquer reação observada"
            rows={2}
            className="resize-none border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">Observações Gerais</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Observações adicionais, instruções especiais..."
            rows={3}
            className="resize-none border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <FormActions
            onSave={handleSubmit}
            onCancel={() => setShowForm(false)}
            isSaving={isSubmitting}
            saveText="Salvar Medicamento"
          />
        </div>
      </div>
    </div>
  );
};
