
export interface MaternalHealthRecord {
  id: string;
  user_id?: string;
  date: string;
  weight?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  blood_glucose?: number;
  temperature?: number;
  sleep_hours?: number;
  mood?: string;
  symptoms?: string[];
  notes?: string;
}

export interface PregnancyInfo {
  id: string;
  due_date: string;
  last_period_date: string;
  pregnancy_week: number;
  high_risk: boolean;
  medical_conditions?: string[];
  medications?: string[];
  healthcare_provider?: string;
  next_appointment?: string;
}
