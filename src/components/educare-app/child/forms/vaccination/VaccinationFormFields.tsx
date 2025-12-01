
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { commonVaccines, VaccinationFormData } from './VaccinationFormData';

interface VaccinationFormFieldsProps {
  formData: VaccinationFormData;
  updateField: (field: keyof VaccinationFormData, value: any) => void;
}

export const VaccinationFormFields: React.FC<VaccinationFormFieldsProps> = ({
  formData,
  updateField
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="vaccine_name" className="text-sm font-semibold text-slate-700">Nome da Vacina *</Label>
          <Select
            value={formData.vaccine_name}
            onValueChange={(value) => updateField('vaccine_name', value)}
          >
            <SelectTrigger className="border-slate-300 focus:border-amber-400 focus:ring-amber-400">
              <SelectValue placeholder="Selecione a vacina" />
            </SelectTrigger>
            <SelectContent>
              {commonVaccines.map((vaccine) => (
                <SelectItem key={vaccine} value={vaccine}>{vaccine}</SelectItem>
              ))}
              <SelectItem value="other">Outra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="date_administered" className="text-sm font-semibold text-slate-700">Data de Aplicação *</Label>
          <DatePicker
            date={formData.date_administered}
            setDate={(date) => updateField('date_administered', date || new Date())}
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="next_dose_date" className="text-sm font-semibold text-slate-700">Próxima Dose (Opcional)</Label>
          <DatePicker
            date={formData.next_dose_date}
            setDate={(date) => updateField('next_dose_date', date)}
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="batch_number" className="text-sm font-semibold text-slate-700">Lote da Vacina</Label>
          <Input
            id="batch_number"
            value={formData.batch_number}
            onChange={(e) => updateField('batch_number', e.target.value)}
            placeholder="Número do lote"
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="healthcare_provider" className="text-sm font-semibold text-slate-700">Local/Profissional *</Label>
        <Input
          id="healthcare_provider"
          value={formData.healthcare_provider}
          onChange={(e) => updateField('healthcare_provider', e.target.value)}
          placeholder="Ex: UBS Central, Dr. João Silva"
          className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Reações, observações especiais..."
          rows={3}
          className="resize-none border-slate-300 focus:border-amber-400 focus:ring-amber-400"
        />
      </div>
    </>
  );
};
