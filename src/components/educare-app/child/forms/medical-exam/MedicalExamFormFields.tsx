
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { examTypes, MedicalExamFormData } from './MedicalExamFormData';

interface MedicalExamFormFieldsProps {
  formData: MedicalExamFormData;
  updateField: (field: keyof MedicalExamFormData, value: any) => void;
}

export const MedicalExamFormFields: React.FC<MedicalExamFormFieldsProps> = ({
  formData,
  updateField
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="exam_type" className="text-sm font-semibold text-slate-700">Tipo de Exame *</Label>
          <Select
            value={formData.exam_type}
            onValueChange={(value) => updateField('exam_type', value)}
          >
            <SelectTrigger className="border-slate-300 focus:border-amber-400 focus:ring-amber-400">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {examTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="exam_name" className="text-sm font-semibold text-slate-700">Nome do Exame *</Label>
          <Input
            id="exam_name"
            value={formData.exam_name}
            onChange={(e) => updateField('exam_name', e.target.value)}
            placeholder="Ex: Hemograma Completo, Raio-X Tórax"
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="date" className="text-sm font-semibold text-slate-700">Data do Exame *</Label>
          <DatePicker
            date={formData.date}
            setDate={(date) => updateField('date', date || new Date())}
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="next_exam_date" className="text-sm font-semibold text-slate-700">Próximo Exame (Opcional)</Label>
          <DatePicker
            date={formData.next_exam_date}
            setDate={(date) => updateField('next_exam_date', date)}
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="healthcare_provider" className="text-sm font-semibold text-slate-700">Local/Médico *</Label>
        <Input
          id="healthcare_provider"
          value={formData.healthcare_provider}
          onChange={(e) => updateField('healthcare_provider', e.target.value)}
          placeholder="Ex: Hospital São Lucas, Dr. Maria Silva"
          className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="results" className="text-sm font-semibold text-slate-700">Resultados *</Label>
        <Textarea
          id="results"
          value={formData.results}
          onChange={(e) => updateField('results', e.target.value)}
          placeholder="Descreva os principais resultados do exame..."
          rows={4}
          className="resize-none border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="doctor_notes" className="text-sm font-semibold text-slate-700">Observações do Médico</Label>
        <Textarea
          id="doctor_notes"
          value={formData.doctor_notes}
          onChange={(e) => updateField('doctor_notes', e.target.value)}
          placeholder="Anotações e recomendações do profissional..."
          rows={3}
          className="resize-none border-slate-300 focus:border-amber-400 focus:ring-amber-400"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="file_url" className="text-sm font-semibold text-slate-700">Link do Arquivo (Opcional)</Label>
        <Input
          id="file_url"
          value={formData.file_url}
          onChange={(e) => updateField('file_url', e.target.value)}
          placeholder="URL para arquivo digital do exame"
          className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
        />
      </div>
    </>
  );
};
