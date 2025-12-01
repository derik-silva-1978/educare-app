
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Calendar } from 'lucide-react';
import { formatAssessmentDate } from './utils/assessmentUtils';
import { Badge } from '@/components/ui/badge';

interface AssessmentInProgressCardProps {
  title: string;
  date: string;
  progress: number;
  onClick: () => void;
  studentName?: string;
}

export const AssessmentInProgressCard: React.FC<AssessmentInProgressCardProps> = ({
  title,
  date,
  progress,
  onClick,
  studentName
}) => {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={onClick}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-primary">{title}</h3>
              {studentName && (
                <p className="text-sm text-muted-foreground">Aluno: {studentName}</p>
              )}
            </div>
            <Badge variant="secondary" className="ml-2 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatAssessmentDate(date)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button size="sm" variant="outline" className="text-xs" onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}>
              <FileText className="h-3 w-3 mr-1" />
              Continuar Avaliação
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentInProgressCard;
