
// Enhanced maternal health types for the new comprehensive system
export interface MaternalHealthProfile {
  id: string;
  user_id: string;
  name: string;
  due_date?: string;
  last_period_date?: string;
  pregnancy_week?: number;
  high_risk: boolean;
  doctor_name?: string;
  next_appointment?: string;
  blood_type?: string;
  height?: number;
  pre_pregnancy_weight?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MaternalDailyHealth {
  id: string;
  profile_id: string;
  user_id: string;
  date: string;
  weight?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  blood_glucose?: number;
  temperature?: number;
  sleep_hours?: number;
  energy_level?: number;
  nausea_level?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MaternalMentalHealth {
  id: string;
  profile_id: string;
  user_id: string;
  date: string;
  mood_score?: number;
  anxiety_level?: number;
  stress_level?: number;
  sleep_quality?: number;
  support_feeling?: number;
  concerns?: string;
  positive_moments?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MaternalMedication {
  id: string;
  profile_id: string;
  user_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  prescribed_by?: string;
  start_date?: string;
  end_date?: string;
  purpose?: string;
  side_effects?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaternalExam {
  id: string;
  profile_id: string;
  user_id: string;
  exam_type: string;
  exam_name: string;
  date: string;
  results?: string;
  doctor_notes?: string;
  file_url?: string;
  next_exam_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PregnancyMilestone {
  id: string;
  profile_id: string;
  user_id: string;
  week_number: number;
  belly_measurement?: number;
  baby_weight_estimate?: number;
  baby_length_estimate?: number;
  ultrasound_notes?: string;
  symptoms?: string[];
  milestone_notes?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
}
