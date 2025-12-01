
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Save, X } from 'lucide-react';

interface EnhancedFormCardProps {
  title: string;
  description?: string;
  progress?: number;
  status: 'default' | 'active' | 'success' | 'warning';
  children: React.ReactNode;
}

export const EnhancedFormCard: React.FC<EnhancedFormCardProps> = ({
  title,
  description,
  progress,
  status,
  children
}) => {
  const statusConfig = {
    default: {
      border: 'border-muted',
      bg: 'bg-card'
    },
    active: {
      border: 'border-amber-400 border-2 shadow-lg shadow-amber-100',
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-50'
    },
    success: {
      border: 'border-green-400 border-2',
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50'
    },
    warning: {
      border: 'border-orange-400 border-2',
      bg: 'bg-gradient-to-br from-orange-50 to-amber-50'
    }
  };

  const config = statusConfig[status];

  return (
    <Card className={cn("transition-all duration-300 rounded-xl", config.border, config.bg)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {progress !== undefined && (
            <Badge variant="outline" className="text-xs bg-white/80">
              {progress}% completo
            </Badge>
          )}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-muted rounded-full h-2 mt-3">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

interface VisualSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  colorGradient?: string[];
  markers?: { value: number; label: string }[];
  helpText?: string;
}

export const VisualSlider: React.FC<VisualSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  colorGradient = ['#ef4444', '#f59e0b', '#10b981'],
  markers = [],
  helpText
}) => {
  const getColorForValue = (val: number) => {
    const percentage = ((val - min) / (max - min)) * 100;
    if (percentage <= 33) return colorGradient[0];
    if (percentage <= 66) return colorGradient[1];
    return colorGradient[2];
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header with label and value */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Label className="text-base font-semibold text-slate-800 block mb-1">{label}</Label>
          {helpText && (
            <p className="text-sm text-slate-600 leading-relaxed">{helpText}</p>
          )}
        </div>
        <div className="flex items-center gap-3 ml-4">
          <div 
            className="w-4 h-4 rounded-full shadow-sm border border-white/50"
            style={{ backgroundColor: getColorForValue(value) }}
          />
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-800">{value}</div>
            <div className="text-sm text-slate-500 font-medium">{unit}</div>
          </div>
        </div>
      </div>
      
      {/* Slider with improved spacing */}
      <div className="px-3 py-2">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        
        {/* Markers with better positioning */}
        {markers.length > 0 && (
          <div className="relative mt-6 mb-2">
            <div className="flex justify-between items-end h-8">
              {markers.map((marker, idx) => {
                const position = ((marker.value - min) / (max - min)) * 100;
                return (
                  <div 
                    key={idx}
                    className="flex flex-col items-center absolute transform -translate-x-1/2"
                    style={{ left: `${position}%` }}
                  >
                    <div className="w-0.5 h-4 bg-slate-400 mb-2" />
                    <span className="text-xs text-slate-600 font-medium bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap">
                      {marker.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CircularMeasurementProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CircularMeasurement: React.FC<CircularMeasurementProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  unit,
  color = '#10b981',
  size = 'md'
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const sizeConfig = {
    sm: { container: 'w-28 h-28', text: 'text-xs', value: 'text-sm', strokeWidth: '6' },
    md: { container: 'w-36 h-36', text: 'text-sm', value: 'text-lg', strokeWidth: '8' },
    lg: { container: 'w-44 h-44', text: 'text-base', value: 'text-xl', strokeWidth: '10' }
  };
  
  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center space-y-6 p-2">
      <div className={cn("relative", config.container)}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e2e8f0"
            strokeWidth={config.strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold text-slate-800", config.value)}>{value}</span>
          <span className={cn("text-slate-500 font-medium", config.text)}>{unit}</span>
        </div>
      </div>
      
      <div className="text-center space-y-3 w-full">
        <Label className={cn("font-semibold text-slate-700", config.text)}>{label}</Label>
        <div className="px-2">
          <Slider
            value={[value]}
            onValueChange={(vals) => onChange(vals[0])}
            min={min}
            max={max}
            step={0.1}
            className="w-full max-w-[140px] mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

interface FormActionsProps {
  onSave: () => void | Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
  saveText?: string;
  cancelText?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onCancel,
  isSaving = false,
  saveText = 'Salvar',
  cancelText = 'Cancelar'
}) => {
  return (
    <div className="flex gap-4 pt-6 border-t border-slate-200">
      <Button 
        onClick={onSave}
        disabled={isSaving}
        className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? 'Salvando...' : saveText}
      </Button>
      {onCancel && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 sm:flex-none border-slate-300 hover:bg-slate-50"
        >
          <X className="h-4 w-4 mr-2" />
          {cancelText}
        </Button>
      )}
    </div>
  );
};

interface HealthNotesProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const HealthNotes: React.FC<HealthNotesProps> = ({
  value,
  onChange,
  placeholder = "Observações adicionais, sintomas, reações..."
}) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="notes" className="text-base font-semibold text-slate-700">Observações</Label>
      <Textarea
        id="notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="resize-none border-slate-300 focus:border-amber-400 focus:ring-amber-400"
      />
    </div>
  );
};
