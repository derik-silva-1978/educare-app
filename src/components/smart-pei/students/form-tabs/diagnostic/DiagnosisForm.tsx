
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { Diagnosis, DiagnosisType } from '@/types/diagnosis';
import DiagnosisTypeSelector from './DiagnosisTypeSelector';

// CID mapping for auto-suggestions
export const cidMapping: Record<string, string> = {
  'autism': 'F84.0',
  'adhd': 'F90.0',
  'intellectual_disability': 'F70-F79',
  'down_syndrome': 'Q90',
  'dyslexia': 'F81.0',
  'speech_disorder': 'F80.1',
  'other': ''
};

interface DiagnosisFormProps {
  onAdd: (diagnosis: Diagnosis) => void;
}

const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ onAdd }) => {
  const [diagnosisType, setDiagnosisType] = useState<DiagnosisType>('other');
  const [cid, setCid] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const handleTypeChange = (value: DiagnosisType) => {
    setDiagnosisType(value);
    // Auto-fill CID based on selected type
    setCid(cidMapping[value] || '');
  };

  const handleAdd = () => {
    if (diagnosisType) {
      onAdd({
        type: diagnosisType,
        cid: cid || undefined,
        date: date || undefined
      });
      // Reset form
      setDiagnosisType('other');
      setCid('');
      setDate('');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div className="w-full sm:w-auto flex-grow">
        <DiagnosisTypeSelector
          value={diagnosisType}
          onChange={handleTypeChange}
        />
      </div>
      
      <div className="w-1/2 sm:w-32">
        <Input 
          value={cid} 
          onChange={(e) => setCid(e.target.value)} 
          placeholder="CID"
        />
      </div>

      <div className="w-1/2 sm:w-40">
        <Input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          placeholder="Data do diagnóstico" 
        />
      </div>
      
      <div>
        <Button 
          type="button" 
          size="sm" 
          onClick={handleAdd}
          variant="outline"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default DiagnosisForm;
