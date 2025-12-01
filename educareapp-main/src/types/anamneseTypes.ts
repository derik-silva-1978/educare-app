
// Basic anamnese form data structure matching the database schema
export interface AnamneseFormData {
  prenatal_start?: string;
  blood_exams?: string;
  immunization?: string;
  birth_location?: string;
  birth_type?: string;
}

// Database response structure
export interface AnamneseData {
  id: string;
  child_id: string;
  user_id: string;
  prenatal_start?: string;
  blood_exams?: string;
  immunization?: string;
  birth_location?: string;
  birth_type?: string;
  completion_percentage?: number;
  completed?: boolean;
  created_at?: string;
  updated_at?: string;
}
