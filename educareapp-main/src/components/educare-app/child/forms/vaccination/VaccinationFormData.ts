
export const commonVaccines = [
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

export interface VaccinationFormData {
  vaccine_name: string;
  date_administered: Date;
  next_dose_date?: Date;
  batch_number: string;
  healthcare_provider: string;
  notes: string;
}

export const initialVaccinationData: VaccinationFormData = {
  vaccine_name: '',
  date_administered: new Date(),
  next_dose_date: undefined,
  batch_number: '',
  healthcare_provider: '',
  notes: ''
};

export const vaccinationRequiredFields = ['vaccine_name', 'date_administered', 'healthcare_provider'];
