
export interface HealthMeasurement {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  color?: string;
  type: 'slider' | 'circular';
  step?: number;
  markers?: { value: number; label: string }[];
  helpText?: string;
}

export interface HealthRecord {
  id: string;
  child_id: string;
  user_id: string;
  record_type: 'vaccination' | 'medication' | 'exam' | 'growth';
  name: string;
  date: string;
  description?: string;
  file_url?: string;
  height?: number;
  weight?: number;
  temperature?: number;
  head_circumference?: number;
  measurements?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface GrowthMeasurements {
  height?: number;
  weight?: number;
  temperature?: number;
  head_circumference?: number;
}
