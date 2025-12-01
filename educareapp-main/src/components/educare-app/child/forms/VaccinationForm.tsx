
import React, { useState } from 'react';
import { EnhancedFormCard, FormActions } from '@/components/ui/enhanced-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Plus, Syringe } from 'lucide-react';

interface VaccinationFormProps {
  onSubmit: (data: {
    vaccine_name: string;
    date_administered: Date;
    next_dose_date?: Date;
    batch_number?: string;
    healthcare_provider: string;
    notes?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const VaccinationForm: React.FC<VaccinationFormProps> = ({
  onSubmit,
  isSubmitting = false,
  onCancel
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vaccine_name: '',
    date_administered: new Date(),
    next_dose_date: undefined as Date | undefined,
    batch_number: '',
    healthcare_provider: '',
    notes: ''
  });

  const commonVaccines = [
    'BCG',
    'Hepatite B',
    'Pentavalente (DTP+Hib+HepB)',
    'Pneumocócica 10',
    'Rotavírus',
    'Meningocócica C',
    'Tríplice Viral (SCR)',
    'Tetraviral (SCR+V)',
    'Hepatite A',
    'Febre Amarela',
    'DTP',
    'HPV',
    'dT (Dupla Adulto)'
  ];

  const handleSubmit = async () => {
    await onSubmit(formData);
    setShowForm(false);
    // Reset form
    setFormData({
      vaccine_name: '',
      date_administered: new Date(),
      next_dose_date: undefined,
      batch_number: '',
      healthcare_provider: '',
      notes: ''
    });
  };

  const getFormProgress = () => {
    const requiredFields = ['vaccine_name', 'date_administered', 'healthcare_provider'];
    const filledFields = requiredFields.filter(field => {
      if (field === 'date_administered') return !!formData.date_administered;
      return !!(formData as any)[field];
    });
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  if (!showForm) {
    return (
      <div className="border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 hover:border-amber-400 transition-all duration-300">
        <div className="text-center">
          <Syringe className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Registro de Vacinação</h3>
          <p className="text-amber-700 text-sm mb-4">Registre vacinas aplicadas e agende próximas doses</p>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Vacina
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
            <h3 className="text-xl font-bold text-white">Registro de Vacinação</h3>
            <p className="text-amber-100 text-sm mt-1">Mantenha o calendário vacinal atualizado</p>
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
            <Label htmlFor="vaccine_name" className="text-sm font-semibold text-slate-700">Nome da Vacina *</Label>
            <Select
              value={formData.vaccine_name}
              onValueChange={(value) => setFormData(prev => ({ ...prev, vaccine_name: value }))}
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
              setDate={(date) => setFormData(prev => ({ ...prev, date_administered: date || new Date() }))}
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="next_dose_date" className="text-sm font-semibold text-slate-700">Próxima Dose (Opcional)</Label>
            <DatePicker
              date={formData.next_dose_date}
              setDate={(date) => setFormData(prev => ({ ...prev, next_dose_date: date }))}
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="batch_number" className="text-sm font-semibold text-slate-700">Lote da Vacina</Label>
            <Input
              id="batch_number"
              value={formData.batch_number}
              onChange={(e) => setFormData(prev => ({ ...prev, batch_number: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, healthcare_provider: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Reações, observações especiais..."
            rows={3}
            className="resize-none border-slate-300 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <FormActions
            onSave={handleSubmit}
            onCancel={() => setShowForm(false)}
            isSaving={isSubmitting}
            saveText="Salvar Vacina"
          />
        </div>
      </div>
    </div>
  );
};
