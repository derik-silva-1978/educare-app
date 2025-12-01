
import React from 'react';
import { Assessment, AssessmentSummary, AssessmentStatus, DevelopmentDomain } from '@/types/assessment';
import EmptyAssessmentsList from './EmptyAssessmentsList';
import AssessmentListItem from './AssessmentListItem';

interface AssessmentsListProps {
  assessments: Assessment[];
  onSelectAssessment: (id: string) => void;
  onCreateAssessment: () => void;
  searchTerm?: string;
}

export const AssessmentsList: React.FC<AssessmentsListProps> = ({ 
  assessments, 
  onSelectAssessment, 
  onCreateAssessment,
  searchTerm = ''
}) => {
  // Filter assessments based on search term
  const filteredAssessments = assessments.filter(assessment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      assessment.title?.toLowerCase().includes(searchLower) ||
      assessment.studentName?.toLowerCase().includes(searchLower) ||
      assessment.student_name?.toLowerCase().includes(searchLower)
    );
  });

  // Separate assessments by status - using a broader approach to handle different status formats
  const inProgressAssessments = filteredAssessments.filter(a => 
    a.status === 'in_progress' || a.status === 'in-progress' || a.status === 'draft'
  );
  const completedAssessments = filteredAssessments.filter(a => a.status === 'completed');

  // Function to safely get a property that might have different naming conventions
  const getProperty = <T,>(obj: any, camelCaseProp: string, snakeCaseProp: string, defaultValue: T): T => {
    if (obj[camelCaseProp] !== undefined) return obj[camelCaseProp];
    if (obj[snakeCaseProp] !== undefined) return obj[snakeCaseProp];
    return defaultValue;
  };

  if (filteredAssessments.length === 0) {
    return <EmptyAssessmentsList onCreateAssessment={onCreateAssessment} />;
  }

  return (
    <div className="space-y-8">
      {inProgressAssessments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Em Andamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressAssessments.map((assessment) => (
              <AssessmentListItem
                key={assessment.id}
                assessment={assessment}
                lastUpdated={getProperty(assessment, 'updatedAt', 'updated_at', '')}
                onClick={() => onSelectAssessment(assessment.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {completedAssessments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Concluídas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedAssessments.map((assessment) => (
              <AssessmentListItem
                key={assessment.id}
                assessment={assessment}
                lastUpdated={getProperty(assessment, 'updatedAt', 'updated_at', '')}
                onClick={() => onSelectAssessment(assessment.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentsList;
