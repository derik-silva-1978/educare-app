
export const examTypes = [
  { value: 'blood_test', label: 'Exame de Sangue' },
  { value: 'urine_test', label: 'Exame de Urina' },
  { value: 'x_ray', label: 'Raio-X' },
  { value: 'ultrasound', label: 'Ultrassom' },
  { value: 'ecg', label: 'Eletrocardiograma' },
  { value: 'vision_test', label: 'Teste de Visão' },
  { value: 'hearing_test', label: 'Teste Auditivo' },
  { value: 'allergy_test', label: 'Teste de Alergia' },
  { value: 'developmental_assessment', label: 'Avaliação do Desenvolvimento' },
  { value: 'other', label: 'Outro' }
];

export interface MedicalExamFormData {
  exam_type: string;
  exam_name: string;
  date: Date;
  next_exam_date?: Date;
  results: string;
  doctor_notes: string;
  file_url: string;
  healthcare_provider: string;
}

export const initialMedicalExamData: MedicalExamFormData = {
  exam_type: '',
  exam_name: '',
  date: new Date(),
  next_exam_date: undefined,
  results: '',
  doctor_notes: '',
  file_url: '',
  healthcare_provider: ''
};

export const medicalExamRequiredFields = ['exam_type', 'exam_name', 'date', 'results', 'healthcare_provider'];
