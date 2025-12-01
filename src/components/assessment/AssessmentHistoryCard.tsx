
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Assessment } from '@/types/assessment';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { normalizeAssessment } from '@/utils/assessment-compatibility';

interface AssessmentHistoryCardProps {
  assessment: Assessment;
}

const AssessmentHistoryCard: React.FC<AssessmentHistoryCardProps> = ({ assessment }) => {
  // Normalize assessment to ensure all properties are available
  const normalizedAssessment = normalizeAssessment(assessment);
  
  const formattedDate = normalizedAssessment.date 
    ? new Date(normalizedAssessment.date).toLocaleDateString('pt-BR')
    : new Date(normalizedAssessment.created_at).toLocaleDateString('pt-BR');
  
  const isCompleted = normalizedAssessment.completed !== undefined 
    ? normalizedAssessment.completed 
    : normalizedAssessment.status === 'completed';

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-medium">{normalizedAssessment.title}</h3>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end text-sm pr-2">
            <span className={`${isCompleted ? 'text-green-600' : 'text-amber-600'} font-medium`}>
              {isCompleted ? 'Concluído' : 'Em Progresso'}
            </span>
            <span className="text-muted-foreground">
              {normalizedAssessment.studentName || normalizedAssessment.student_name}
            </span>
          </div>
          
          <Link to={`/assessments/${normalizedAssessment.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default AssessmentHistoryCard;
