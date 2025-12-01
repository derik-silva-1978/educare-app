
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { UnifiedHealthForm } from '@/components/ui/unified-health-form';
import { Plus, Save, X } from 'lucide-react';
import { GrowthMeasurements } from '@/types/health-measurements';

interface HealthRecordFormRefactoredProps {
  onSubmit: (data: {
    type: 'vaccination' | 'medication' | 'exam' | 'growth';
    name: string;
    date: Date;
    description?: string;
    measurements?: GrowthMeasurements;
  }) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const HealthRecordFormRefactored: React.FC<HealthRecordFormRefactoredProps> = ({
  onSubmit,
  isSubmitting = false,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'growth'>('basic');
  const [formData, setFormData] = useState({
    type: 'vaccination' as const,
    name: '',
    date: new Date(),
    description: ''
  });

  const growthMeasurements = [
    {
      id: 'height',
      label: 'Altura',
      value: 85,
      min: 40,
      max: 150,
      unit: 'cm',
      type: 'circular' as const,
      color: '#3b82f6',
      helpText: 'Altura atual da criança'
    },
    {
      id: 'weight',
      label: 'Peso',
      value: 12,
      min: 2,
      max: 50,
      unit: 'kg',
      type: 'circular' as const,
      color: '#10b981',
      step: 0.1,
      helpText: 'Peso atual da criança'
    },
    {
      id: 'temperature',
      label: 'Temperatura',
      value: 36.5,
      min: 35,
      max: 42,
      unit: '°C',
      type: 'slider' as const,
      color: '#f59e0b',
      step: 0.1,
      markers: [
        { value: 36.5, label: 'Normal' },
        { value: 37.5, label: 'Febre' },
        { value: 39, label: 'Alta' }
      ],
      helpText: 'Temperatura corporal'
    },
    {
      id: 'head_circumference',
      label: 'Perímetro Cefálico',
      value: 48,
      min: 30,
      max: 65,
      unit: 'cm',
      type: 'circular' as const,
      color: '#8b5cf6',
      helpText: 'Circunferência da cabeça'
    }
  ];

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleGrowthSubmit = async (data: Record<string, any>) => {
    await onSubmit({
      type: 'growth',
      name: 'Registro de Crescimento',
      date: new Date(),
      description: data.notes || '',
      measurements: {
        height: data.height,
        weight: data.weight,
        temperature: data.temperature,
        head_circumference: data.head_circumference
      }
    });
  };

  if (activeTab === 'growth') {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab('basic')}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            Registros Básicos
          </Button>
          <Button
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
          >
            Crescimento
          </Button>
        </div>
        
        <UnifiedHealthForm
          title="Registro de Crescimento"
          description="Registre as medições de crescimento e desenvolvimento"
          measurements={growthMeasurements}
          onSubmit={handleGrowthSubmit}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          showAddButton={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
        >
          Registros Básicos
        </Button>
        <Button
          variant="outline"
          onClick={() => setActiveTab('growth')}
          className="border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          Crescimento
        </Button>
      </div>

      {/* Enhanced Basic Form */}
      <div className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 border-b border-amber-300">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">Novo Registro de Saúde</h3>
              <p className="text-amber-100 text-sm mt-1">Adicione vacinas, medicamentos ou exames</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-white text-sm font-medium">0% completo</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleBasicSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="type" className="text-sm font-semibold text-slate-700">Tipo de Registro</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="border-slate-300 focus:border-amber-400 focus:ring-amber-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vaccination">Vacina</SelectItem>
                  <SelectItem value="medication">Medicamento</SelectItem>
                  <SelectItem value="exam">Exame</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="date" className="text-sm font-semibold text-slate-700">Data</Label>
              <DatePicker
                date={formData.date}
                setDate={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Vacina Tríplice Viral, Paracetamol, Hemograma..."
              className="border-slate-300 focus:border-amber-400 focus:ring-amber-400"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Observações, dosagem, reações..."
              rows={4}
              className="resize-none border-slate-300 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <Button 
              type="submit"
              disabled={isSubmitting || !formData.name}
              className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none border-slate-300 hover:bg-slate-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
