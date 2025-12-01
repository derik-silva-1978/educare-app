
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollText } from 'lucide-react';
import { DevelopmentDomain } from '@/types/assessment';

interface AssessmentObservationsProps {
  domain: DevelopmentDomain;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const AssessmentObservations: React.FC<AssessmentObservationsProps> = ({
  domain,
  value,
  onChange,
  readOnly = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Observações sobre {domain}</h3>
      </div>
      
      <Textarea
        placeholder={`Adicione observações sobre o desenvolvimento ${domain.toLowerCase()}...`}
        value={value}
        onChange={handleChange}
        className="min-h-[100px]"
        disabled={readOnly}
      />
    </div>
  );
};

export default AssessmentObservations;
