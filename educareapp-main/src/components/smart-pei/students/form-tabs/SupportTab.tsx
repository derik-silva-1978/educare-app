import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { StudentFormData } from '@/hooks/useStudents';

interface SupportTabProps {
  formData: StudentFormData;
  handleChange: (field: keyof StudentFormData, value: any) => void;
  handleCheckboxArray: (field: 'therapies' | 'accommodations', value: string, checked: boolean) => void;
  errors?: Record<string, string>;
}

export const SupportTab: React.FC<SupportTabProps> = ({ 
  formData, 
  handleChange, 
  handleCheckboxArray,
  errors = {}
}) => {
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className={errors.therapies ? 'text-destructive' : ''}>Terapias e Intervenções</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="therapy-speech" 
              checked={(formData.therapies || []).includes('speech')} 
              onCheckedChange={checked => 
                handleCheckboxArray('therapies', 'speech', checked === true)
              }
              aria-labelledby="therapy-speech-label"
            />
            <Label htmlFor="therapy-speech" id="therapy-speech-label">Fonoaudiologia</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="therapy-occupational" 
              checked={(formData.therapies || []).includes('occupational')} 
              onCheckedChange={checked => 
                handleCheckboxArray('therapies', 'occupational', checked === true)
              }
              aria-labelledby="therapy-occupational-label"
            />
            <Label htmlFor="therapy-occupational" id="therapy-occupational-label">Terapia Ocupacional</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="therapy-behavioral" 
              checked={(formData.therapies || []).includes('behavioral')} 
              onCheckedChange={checked => 
                handleCheckboxArray('therapies', 'behavioral', checked === true)
              }
              aria-labelledby="therapy-behavioral-label"
            />
            <Label htmlFor="therapy-behavioral" id="therapy-behavioral-label">Terapia Comportamental</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="therapy-psychotherapy" 
              checked={(formData.therapies || []).includes('psychotherapy')} 
              onCheckedChange={checked => 
                handleCheckboxArray('therapies', 'psychotherapy', checked === true)
              }
              aria-labelledby="therapy-psychotherapy-label"
            />
            <Label htmlFor="therapy-psychotherapy" id="therapy-psychotherapy-label">Psicoterapia</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="therapy-physical" 
              checked={(formData.therapies || []).includes('physical')} 
              onCheckedChange={checked => 
                handleCheckboxArray('therapies', 'physical', checked === true)
              }
              aria-labelledby="therapy-physical-label"
            />
            <Label htmlFor="therapy-physical" id="therapy-physical-label">Fisioterapia</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="therapy-equine" 
              checked={(formData.therapies || []).includes('equine')} 
              onCheckedChange={checked => 
                handleCheckboxArray('therapies', 'equine', checked === true)
              }
              aria-labelledby="therapy-equine-label"
            />
            <Label htmlFor="therapy-equine" id="therapy-equine-label">Equoterapia</Label>
          </div>
        </div>
        {errors.therapies && (
          <p className="text-sm font-medium text-destructive">{errors.therapies}</p>
        )}
        
        <div className="space-y-2 mt-2">
          <Label htmlFor="therapyNotes" className={errors.therapyNotes ? 'text-destructive' : ''}>Observações sobre Terapias</Label>
          <Textarea 
            id="therapyNotes" 
            value={formData.therapyNotes || ''} 
            onChange={e => handleChange('therapyNotes', e.target.value)}
            placeholder="Detalhes adicionais sobre as terapias"
            rows={2}
            className={errors.therapyNotes ? 'border-destructive' : ''}
            aria-invalid={!!errors.therapyNotes}
            aria-describedby={errors.therapyNotes ? "therapyNotes-error" : undefined}
          />
          {errors.therapyNotes && (
            <p id="therapyNotes-error" className="text-sm font-medium text-destructive">{errors.therapyNotes}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4 pt-2">
        <Label className={errors.accommodations ? 'text-destructive' : ''}>Acomodações Educacionais</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accommodation-extended_time" 
              checked={(formData.accommodations || []).includes('extended_time')} 
              onCheckedChange={checked => 
                handleCheckboxArray('accommodations', 'extended_time', checked === true)
              }
              aria-labelledby="accommodation-extended_time-label"
            />
            <Label htmlFor="accommodation-extended_time" id="accommodation-extended_time-label">Tempo Estendido</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accommodation-preferential_seating" 
              checked={(formData.accommodations || []).includes('preferential_seating')} 
              onCheckedChange={checked => 
                handleCheckboxArray('accommodations', 'preferential_seating', checked === true)
              }
              aria-labelledby="accommodation-preferential_seating-label"
            />
            <Label htmlFor="accommodation-preferential_seating" id="accommodation-preferential_seating-label">Assentos Preferenciais</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accommodation-modified_materials" 
              checked={(formData.accommodations || []).includes('modified_materials')} 
              onCheckedChange={checked => 
                handleCheckboxArray('accommodations', 'modified_materials', checked === true)
              }
              aria-labelledby="accommodation-modified_materials-label"
            />
            <Label htmlFor="accommodation-modified_materials" id="accommodation-modified_materials-label">Materiais Adaptados</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accommodation-assistive_technology" 
              checked={(formData.accommodations || []).includes('assistive_technology')} 
              onCheckedChange={checked => 
                handleCheckboxArray('accommodations', 'assistive_technology', checked === true)
              }
              aria-labelledby="accommodation-assistive_technology-label"
            />
            <Label htmlFor="accommodation-assistive_technology" id="accommodation-assistive_technology-label">Tecnologia Assistiva</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accommodation-visual_supports" 
              checked={(formData.accommodations || []).includes('visual_supports')} 
              onCheckedChange={checked => 
                handleCheckboxArray('accommodations', 'visual_supports', checked === true)
              }
              aria-labelledby="accommodation-visual_supports-label"
            />
            <Label htmlFor="accommodation-visual_supports" id="accommodation-visual_supports-label">Suportes Visuais</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accommodation-quiet_environment" 
              checked={(formData.accommodations || []).includes('quiet_environment')} 
              onCheckedChange={checked => 
                handleCheckboxArray('accommodations', 'quiet_environment', checked === true)
              }
              aria-labelledby="accommodation-quiet_environment-label"
            />
            <Label htmlFor="accommodation-quiet_environment" id="accommodation-quiet_environment-label">Ambiente Tranquilo</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accommodation-breaks" 
              checked={(formData.accommodations || []).includes('breaks')} 
              onCheckedChange={checked => 
                handleCheckboxArray('accommodations', 'breaks', checked === true)
              }
              aria-labelledby="accommodation-breaks-label"
            />
            <Label htmlFor="accommodation-breaks" id="accommodation-breaks-label">Pausas Regulares</Label>
          </div>
        </div>
        {errors.accommodations && (
          <p className="text-sm font-medium text-destructive">{errors.accommodations}</p>
        )}
      </div>
      
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="medicationUse" 
              checked={formData.medicationUse || false} 
              onCheckedChange={value => handleChange('medicationUse', value)}
              aria-labelledby="medicationUse-label"
            />
            <Label htmlFor="medicationUse" id="medicationUse-label">Utiliza Medicação</Label>
          </div>
        </div>
        
        {formData.medicationUse && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="medicationNotes">Detalhes da Medicação</Label>
            <Textarea 
              id="medicationNotes" 
              value={formData.medicationNotes || ''} 
              onChange={e => handleChange('medicationNotes', e.target.value)}
              placeholder="Nome, dosagem e frequência da medicação"
              rows={2}
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Switch 
            id="schoolSupport" 
            checked={formData.schoolSupport || false} 
            onCheckedChange={value => handleChange('schoolSupport', value)}
            aria-labelledby="schoolSupport-label"
          />
          <Label htmlFor="schoolSupport" id="schoolSupport-label">Recebe Apoio Escolar Especializado</Label>
        </div>
      </div>
    </div>
  );
};

export default SupportTab;
