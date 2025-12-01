
export type DiagnosisType = 
  | 'autism' 
  | 'adhd' 
  | 'dyslexia' 
  | 'intellectual_disability'
  | 'hearing_impairment'
  | 'visual_impairment'
  | 'physical_disability'
  | 'down_syndrome'
  | 'cerebral_palsy'
  | 'speech_disorder'
  | 'other';

export interface Diagnosis {
  type: DiagnosisType;
  cid?: string;
  date?: string;
}

// Mapping for diagnosis type display names
export const diagnosisTypeMapping: Record<string, string> = {
  'autism': 'Transtorno do Espectro Autista (TEA)',
  'adhd': 'TDAH',
  'dyslexia': 'Dislexia',
  'intellectual_disability': 'Deficiência Intelectual',
  'hearing_impairment': 'Deficiência Auditiva',
  'visual_impairment': 'Deficiência Visual',
  'physical_disability': 'Deficiência Física',
  'down_syndrome': 'Síndrome de Down',
  'cerebral_palsy': 'Paralisia Cerebral',
  'speech_disorder': 'Transtorno de Fala',
  'other': 'Outro'
};
