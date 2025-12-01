
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DiagnosisType, diagnosisTypeMapping } from '@/types/diagnosis';

interface DiagnosisTypeSelectorProps {
  value: DiagnosisType | string;
  onChange: (value: DiagnosisType) => void;
  className?: string;
  error?: string;
}

const DiagnosisTypeSelector: React.FC<DiagnosisTypeSelectorProps> = ({
  value,
  onChange,
  className,
  error
}) => {
  return (
    <Select 
      value={value} 
      onValueChange={(value) => onChange(value as DiagnosisType)}
    >
      <SelectTrigger 
        variant="modern"
        className={`${error ? 'border-destructive' : ''} ${className || ''}`}
      >
        <SelectValue placeholder="Tipo de diagnóstico" />
      </SelectTrigger>
      <SelectContent variant="modern">
        <SelectItem value="autism" variant="modern">Transtorno do Espectro Autista (TEA)</SelectItem>
        <SelectItem value="adhd" variant="modern">TDAH</SelectItem>
        <SelectItem value="dyslexia" variant="modern">Dislexia</SelectItem>
        <SelectItem value="intellectual_disability" variant="modern">Deficiência Intelectual</SelectItem>
        <SelectItem value="hearing_impairment" variant="modern">Deficiência Auditiva</SelectItem>
        <SelectItem value="visual_impairment" variant="modern">Deficiência Visual</SelectItem>
        <SelectItem value="physical_disability" variant="modern">Deficiência Física</SelectItem>
        <SelectItem value="down_syndrome" variant="modern">Síndrome de Down</SelectItem>
        <SelectItem value="cerebral_palsy" variant="modern">Paralisia Cerebral</SelectItem>
        <SelectItem value="speech_disorder" variant="modern">Transtorno de Fala</SelectItem>
        <SelectItem value="other" variant="modern">Outro</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DiagnosisTypeSelector;
