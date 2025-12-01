
import React from 'react';
import { VisualSlider, CircularMeasurement } from '@/components/ui/enhanced-form';

interface HealthFormSectionsProps {
  formData: Record<string, any>;
  updateValue: (id: string, value: any) => void;
}

export const VitalSignsSection: React.FC<HealthFormSectionsProps> = ({ formData, updateValue }) => {
  const vitalMeasurements = [
    {
      id: 'temperature',
      label: 'Temperatura',
      value: formData.temperature || 36.5,
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
      helpText: 'Temperatura corporal medida em graus Celsius'
    },
    {
      id: 'heart_rate',
      label: 'Batimentos Cardíacos',
      value: formData.heart_rate || 80,
      min: 60,
      max: 120,
      unit: 'bpm',
      type: 'circular' as const,
      color: '#dc2626',
      helpText: 'Frequência cardíaca em repouso'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
        <h4 className="text-xl font-bold text-slate-800 uppercase tracking-wide">SINAIS VITAIS</h4>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {vitalMeasurements.map((measurement) => (
          <div key={measurement.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
            {measurement.type === 'circular' ? (
              <CircularMeasurement
                label={measurement.label}
                value={formData[measurement.id] || measurement.value}
                onChange={(value) => updateValue(measurement.id, value)}
                min={measurement.min}
                max={measurement.max}
                unit={measurement.unit}
                color={measurement.color}
              />
            ) : (
              <VisualSlider
                label={measurement.label}
                value={formData[measurement.id] || measurement.value}
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
  );
};

export const GrowthSection: React.FC<HealthFormSectionsProps> = ({ formData, updateValue }) => {
  const growthMeasurements = [
    {
      id: 'height',
      label: 'Altura',
      value: formData.height || 85,
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
      value: formData.weight || 12,
      min: 2,
      max: 50,
      unit: 'kg',
      type: 'circular' as const,
      color: '#10b981',
      step: 0.1,
      helpText: 'Peso atual da criança'
    },
    {
      id: 'head_circumference',
      label: 'Perímetro Cefálico',
      value: formData.head_circumference || 48,
      min: 30,
      max: 65,
      unit: 'cm',
      type: 'circular' as const,
      color: '#8b5cf6',
      helpText: 'Circunferência da cabeça'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
        <h4 className="text-xl font-bold text-slate-800 uppercase tracking-wide">CRESCIMENTO E FÍSICO</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {growthMeasurements.map((measurement) => (
          <div key={measurement.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CircularMeasurement
              label={measurement.label}
              value={formData[measurement.id] || measurement.value}
              onChange={(value) => updateValue(measurement.id, value)}
              min={measurement.min}
              max={measurement.max}
              unit={measurement.unit}
              color={measurement.color}
              size="md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const WellnessSection: React.FC<HealthFormSectionsProps> = ({ formData, updateValue }) => {
  const wellnessMeasurements = [
    {
      id: 'energy_level',
      label: 'Nível de Energia',
      value: formData.energy_level || 5,
      min: 1,
      max: 10,
      unit: '/10',
      type: 'slider' as const,
      color: '#10b981',
      step: 1,
      markers: [
        { value: 3, label: 'Baixo' },
        { value: 5, label: 'Normal' },
        { value: 8, label: 'Alto' }
      ],
      helpText: 'Avalie o nível de energia e disposição da criança'
    },
    {
      id: 'sleep_quality',
      label: 'Qualidade do Sono',
      value: formData.sleep_quality || 7,
      min: 1,
      max: 10,
      unit: '/10',
      type: 'slider' as const,
      color: '#6366f1',
      step: 1,
      markers: [
        { value: 3, label: 'Ruim' },
        { value: 7, label: 'Bom' },
        { value: 9, label: 'Ótimo' }
      ],
      helpText: 'Como foi a qualidade do sono nas últimas noites'
    },
    {
      id: 'appetite',
      label: 'Apetite',
      value: formData.appetite || 6,
      min: 1,
      max: 10,
      unit: '/10',
      type: 'circular' as const,
      color: '#f59e0b',
      helpText: 'Como está o apetite da criança'
    },
    {
      id: 'mood',
      label: 'Humor',
      value: formData.mood || 7,
      min: 1,
      max: 10,
      unit: '/10',
      type: 'circular' as const,
      color: '#ec4899',
      helpText: 'Como está o humor e disposição geral'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
        <h4 className="text-xl font-bold text-slate-800 uppercase tracking-wide">BEM-ESTAR</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {wellnessMeasurements.map((measurement) => (
          <div key={measurement.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
            {measurement.type === 'circular' ? (
              <CircularMeasurement
                label={measurement.label}
                value={formData[measurement.id] || measurement.value}
                onChange={(value) => updateValue(measurement.id, value)}
                min={measurement.min}
                max={measurement.max}
                unit={measurement.unit}
                color={measurement.color}
              />
            ) : (
              <VisualSlider
                label={measurement.label}
                value={formData[measurement.id] || measurement.value}
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
  );
};
