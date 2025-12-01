
import React, { useState } from 'react';
import { EnhancedFormCard, FormActions } from '@/components/ui/enhanced-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';

interface HealthRecordFormBaseProps {
  title: string;
  description: string;
  recordTypes: Array<{
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  children?: React.ReactNode;
}

export const HealthRecordFormBase: React.FC<HealthRecordFormBaseProps> = ({
  title,
  description,
  recordTypes,
  onSubmit,
  isSubmitting = false,
  onCancel,
  children
}) => {
  const [formData, setFormData] = useState({
    type: recordTypes[0]?.value || '',
    name: '',
    date: new Date(),
    description: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedType = recordTypes.find(type => type.value === formData.type);

  const handleSubmit = async () => {
    await onSubmit(formData);
    setShowForm(false);
  };

  const getFormProgress = () => {
    const required = ['name', 'date'];
    const filled = required.filter(field => {
      if (field === 'date') return !!formData.date;
      return !!(formData as any)[field];
    });
    return Math.round((filled.length / required.length) * 100);
  };

  if (!showForm) {
    return (
      <EnhancedFormCard
        title={title}
        description={description}
        status="default"
      >
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          {title}
        </Button>
      </EnhancedFormCard>
    );
  }

  return (
    <EnhancedFormCard
      title={title}
      description={description}
      progress={getFormProgress()}
      status="active"
    >
      <div className="space-y-6">
        {/* Record Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tipo de Registro</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recordTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                  formData.type === type.value
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-muted hover:border-primary/50"
                )}
              >
                <type.icon className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Registro *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={`Nome ${selectedType?.label.toLowerCase()}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data *</Label>
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    if (date) setFormData(prev => ({ ...prev, date }));
                    setShowDatePicker(false);
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Custom Children Content */}
        {children}

        <FormActions
          onSave={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSaving={isSubmitting}
          saveText="Salvar Registro"
        />
      </div>
    </EnhancedFormCard>
  );
};
