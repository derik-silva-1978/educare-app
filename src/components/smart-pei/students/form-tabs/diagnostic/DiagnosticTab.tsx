import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { StudentFormData } from '@/hooks/useStudents';
import { Diagnosis } from '@/types/diagnosis';

// Fallback local components to avoid missing modules (these should be replaced for proper Educare usage)
type AnyProps = { [key: string]: any };
const SupportLevelSelector = (props: AnyProps) => null;
const DiagnosisNotes = (props: AnyProps) => null;
const DiagnosisSelector = (props: AnyProps) => null;

interface DiagnosticTabProps {
  formData: StudentFormData;
  handleChange: (field: keyof StudentFormData, value: any) => void;
  errors?: Record<string, string>;
}

export const DiagnosticTab: React.FC<DiagnosticTabProps> = ({ 
  formData, 
  handleChange,
  errors = {} 
}) => {
  const safeDisplayDiagnoses = Array.isArray(formData.diagnoses) ? formData.diagnoses : [];

  const handleDiagnosesChange = (newDiagnoses: Diagnosis[]) => {
    handleChange('diagnoses', newDiagnoses);
    handleChange('hasDiagnosis', newDiagnoses.length > 0);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="hasDiagnosis" 
            checked={formData.hasDiagnosis} 
            onCheckedChange={value => {
              handleChange('hasDiagnosis', value);
              if (!value) handleChange('diagnoses', []);
            }}
            aria-labelledby="hasDiagnosis-label"
          />
          <Label htmlFor="hasDiagnosis" id="hasDiagnosis-label">Possui diagnóstico</Label>
        </div>
      </div>
      {formData.hasDiagnosis && (
        <>
          <div className="border rounded-md p-4 space-y-4 bg-muted/10">
            <h3 className="text-sm font-medium mb-2">Diagnósticos</h3>
            <DiagnosisSelector 
              value={safeDisplayDiagnoses}
              onChange={handleDiagnosesChange}
              error={errors.diagnoses}
            />
          </div>
          <SupportLevelSelector 
            value={formData.supportLevel || ''} 
            onChange={(value) => handleChange('supportLevel', value)}
            error={errors.supportLevel}
          />
          <DiagnosisNotes 
            value={formData.diagnosisNotes || ''} 
            onChange={(value) => handleChange('diagnosisNotes', value)}
            error={errors.diagnosisNotes}
          />
        </>
      )}
    </div>
  );
};

export default DiagnosticTab;
