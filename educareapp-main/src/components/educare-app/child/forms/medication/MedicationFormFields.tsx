
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { frequencyOptions, MedicationFormData } from './MedicationFormData';

interface MedicationFormFieldsProps {
  formData: MedicationFormData;
  updateField: (field: keyof MedicationFormData, value: any) => void;
}

export const MedicationFormFields: React.FC<MedicationFormFieldsProps> = ({
  formData,
  updateField
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="medication_name" className="text-sm font-semibold text-slate-700">Nome do Medicamento *</Label>
          <Input
            id="medication_name"
            value={formData.medication_name}
            onChange={(e) => updateField('medication_name', e.target.value)}
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
            onChange={(e) => updateField('dosage', e.target.value)}
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
            onValueChange={(value) => updateField('frequency', value)}
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
            onChange={(e) => updateField('prescribed_by', e.target.value)}
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
            setDate={(date) => updateField('start_date', date || new Date())}
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="end_date" className="text-sm font-semibold text-slate-700">Data de Término (Opcional)</Label>
          <DatePicker
            date={formData.end_date}
            setDate={(date) => updateField('end_date', date)}
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="purpose" className="text-sm font-semibold text-slate-700">Finalidade/Indicação</Label>
        <Input
          id="purpose"
          value={formData.purpose}
          onChange={(e) => updateField('purpose', e.target.value)}
          placeholder="Para que foi prescrito o medicamento"
          className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
        />
      </div>

      <div className="flex items-center space-x-3">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => updateField('active', checked)}
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
          onChange={(e) => updateField('side_effects', e.target.value)}
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
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Observações adicionais, instruções especiais..."
          rows={3}
          className="resize-none border-slate-300 focus:border-amber-400 focus:ring-amber-400"
        />
      </div>
    </>
  );
};
