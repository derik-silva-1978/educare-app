
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AssessmentForm } from '@/types/assessment';
import { formatAssessmentDate } from '@/utils/assessment';

interface AssessmentFormHeaderProps {
  form: AssessmentForm;
  progress: number;
}

export const AssessmentFormHeader: React.FC<AssessmentFormHeaderProps> = ({
  form,
  progress
}) => {
  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">
            {form.title || `Avaliação - ${form.studentName}`}
          </h2>
          <p className="text-muted-foreground text-sm">
            {form.studentName} • {formatAssessmentDate(form.date)}
          </p>
        </div>
        
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-muted bg-background">
            <span className="font-bold text-lg text-foreground">
              {progress}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progresso da avaliação</span>
          <span className="text-xs font-medium">{progress}% concluído</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default AssessmentFormHeader;
