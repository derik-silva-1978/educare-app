
import React, { useState } from 'react';
import { EnhancedFormCard, FormActions } from '@/components/ui/enhanced-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Plus, FileText } from 'lucide-react';

interface MedicalExamFormProps {
  onSubmit: (data: {
    exam_type: string;
    exam_name: string;
    date: Date;
    next_exam_date?: Date;
    results: string;
    doctor_notes?: string;
    file_url?: string;
    healthcare_provider: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const MedicalExamForm: React.FC<MedicalExamFormProps> = ({
  onSubmit,
  isSubmitting = false,
  onCancel
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    exam_type: '',
    exam_name: '',
    date: new Date(),
    next_exam_date: undefined as Date | undefined,
    results: '',
    doctor_notes: '',
    file_url: '',
    healthcare_provider: ''
  });

  const examTypes = [
    { value: 'blood_test', label: 'Exame de Sangue' },
    { value: 'urine_test', label: 'Exame de Urina' },
    { value: 'x_ray', label: 'Raio-X' },
    { value: 'ultrasound', label: 'Ultrassom' },
    { value: 'ecg', label: 'Eletrocardiograma' },
    { value: 'vision_test', label: 'Teste de Visão' },
    { value: 'hearing_test', label: 'Teste Auditivo' },
    { value: 'allergy_test', label: 'Teste de Alergia' },
    { value: 'developmental_assessment', label: 'Avaliação do Desenvolvimento' },
    { value: 'other', label: 'Outro' }
  ];

  const handleSubmit = async () => {
    await onSubmit(formData);
    setShowForm(false);
    // Reset form
    setFormData({
      exam_type: '',
      exam_name: '',
      date: new Date(),
      next_exam_date: undefined,
      results: '',
      doctor_notes: '',
      file_url: '',
      healthcare_provider: ''
    });
  };

  const getFormProgress = () => {
    const requiredFields = ['exam_type', 'exam_name', 'date', 'results', 'healthcare_provider'];
    const filledFields = requiredFields.filter(field => {
      if (field === 'date') return !!formData.date;
      return !!(formData as any)[field];
    });
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  if (!showForm) {
    return (
      <div className="border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 hover:border-amber-400 transition-all duration-300">
        <div className="text-center">
          <FileText className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Exame Médico</h3>
          <p className="text-amber-700 text-sm mb-4">Registre resultados de exames e consultas</p>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Exame
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
            <h3 className="text-xl font-bold text-white">Exame Médico</h3>
            <p className="text-amber-100 text-sm mt-1">Registre resultados e acompanhamentos</p>
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
            <Label htmlFor="exam_type" className="text-sm font-semibold text-slate-700">Tipo de Exame *</Label>
            <Select
              value={formData.exam_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, exam_type: value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, exam_name: e.target.value }))}
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
              setDate={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="next_exam_date" className="text-sm font-semibold text-slate-700">Próximo Exame (Opcional)</Label>
            <DatePicker
              date={formData.next_exam_date}
              setDate={(date) => setFormData(prev => ({ ...prev, next_exam_date: date }))}
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="healthcare_provider" className="text-sm font-semibold text-slate-700">Local/Médico *</Label>
          <Input
            id="healthcare_provider"
            value={formData.healthcare_provider}
            onChange={(e) => setFormData(prev => ({ ...prev, healthcare_provider: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, doctor_notes: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
            placeholder="URL para arquivo digital do exame"
            className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <FormActions
            onSave={handleSubmit}
            onCancel={() => setShowForm(false)}
            isSaving={isSubmitting}
            saveText="Salvar Exame"
          />
        </div>
      </div>
    </div>
  );
};
