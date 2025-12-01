
export const frequencyOptions = [
  { value: '1x-day', label: '1x ao dia' },
  { value: '2x-day', label: '2x ao dia' },
  { value: '3x-day', label: '3x ao dia' },
  { value: '4x-day', label: '4x ao dia' },
  { value: '8h-8h', label: 'De 8 em 8 horas' },
  { value: '12h-12h', label: 'De 12 em 12 horas' },
  { value: 'when-needed', label: 'Quando necessário' },
  { value: 'weekly', label: 'Semanalmente' },
  { value: 'monthly', label: 'Mensalmente' }
];

export interface MedicationFormData {
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: Date;
  end_date?: Date;
  prescribed_by: string;
  active: boolean;
  purpose: string;
  side_effects: string;
  notes: string;
}

export const initialMedicationData: MedicationFormData = {
  medication_name: '',
  dosage: '',
  frequency: '',
  start_date: new Date(),
  end_date: undefined,
  prescribed_by: '',
  active: true,
  purpose: '',
  side_effects: '',
  notes: ''
};

export const medicationRequiredFields = ['medication_name', 'dosage', 'frequency', 'start_date', 'prescribed_by'];
