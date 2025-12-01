
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { AssessmentDomain } from '@/types/assessment';

interface AssessmentCompletedCardProps {
  assessment: {
    id: string;
    studentName: string;
    completedDate: string;
    domains: AssessmentDomain[];
  };
  onSelectAssessment: (id: string) => void;
}

const AssessmentCompletedCard: React.FC<AssessmentCompletedCardProps> = ({
  assessment,
  onSelectAssessment
}) => {
  const completedTimeAgo = formatDistanceToNow(new Date(assessment.completedDate), {
    locale: ptBR,
    addSuffix: true
  });
  
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onSelectAssessment(assessment.id)}>
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-primary">{assessment.studentName}</h3>
            <Badge variant="outline" className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {completedTimeAgo}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {assessment.domains.map((domain) => (
            <Badge key={domain} variant="secondary" className="text-xs">
              {domain}
            </Badge>
          ))}
        </div>
        
        <div className="mt-3 flex justify-end">
          <Button size="sm" variant="outline" className="text-xs" onClick={(e) => {
            e.stopPropagation();
            onSelectAssessment(assessment.id);
          }}>
            <FileText className="h-3 w-3 mr-1" />
            Visualizar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentCompletedCard;
