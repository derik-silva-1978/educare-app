
import React from 'react';
import { AssessmentSummary } from '@/types/assessment';
import AssessmentListItem from './AssessmentListItem';

interface AssessmentsInProgressProps {
  assessments: AssessmentSummary[];
  onSelectAssessment: (id: string) => void;
}

const AssessmentsInProgress: React.FC<AssessmentsInProgressProps> = ({ 
  assessments,
  onSelectAssessment
}) => {
  if (assessments.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Em Andamento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessments.map((assessment) => (
          <AssessmentListItem
            key={assessment.id}
            assessment={assessment} 
            lastUpdated={assessment.updatedAt}
            onClick={() => onSelectAssessment(assessment.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AssessmentsInProgress;
