
import { StudentFormData } from '@/hooks/useStudents';

export interface UseStudentFormProps {
  studentId?: string;
}

export interface UseStudentFormReturn {
  formData: StudentFormData;
  activeTab: string;
  isSubmitting: boolean;
  isLoading: boolean;
  formErrors: Record<string, string>;
  hasChanged: boolean;
  setActiveTab: (tab: string) => void;
  handleChange: (field: keyof StudentFormData, value: any) => void;
  handleCheckboxArray: (field: any, value: string, checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  saveProgress: () => Promise<boolean>;
  updateField: (field: keyof StudentFormData, value: any) => void;
  addDiagnosis: (diagnosis: any) => void;
  updateDiagnosis: (index: number, diagnosis: any) => void;
  removeDiagnosis: (index: number) => void;
}
