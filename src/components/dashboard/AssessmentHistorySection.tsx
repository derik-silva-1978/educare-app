
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Assessment } from '@/types/assessment';
import { Plus } from 'lucide-react';
import useAssessmentService from '@/hooks/useAssessmentService';
import AssessmentHistoryCard from '@/components/assessment/AssessmentHistoryCard';

interface AssessmentHistorySectionProps {
  childId: string;
  childName: string;
}

export const AssessmentHistorySection: React.FC<AssessmentHistorySectionProps> = ({
  childId,
  childName
}) => {
  const navigate = useNavigate();
  const { loading, getAssessmentsByChildId } = useAssessmentService();
  
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  
  useEffect(() => {
    const loadAssessments = async () => {
      const data = await getAssessmentsByChildId(childId);
      setAssessments(data);
    };
    
    loadAssessments();
  }, [childId, getAssessmentsByChildId]);
  
  const handleStartNewAssessment = () => {
    navigate(`/new-assessment/${childId}`);
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Histórico de Avaliações</CardTitle>
          <CardDescription>
            Avaliações de desenvolvimento para {childName}
          </CardDescription>
        </div>
        <Button onClick={handleStartNewAssessment}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Avaliação
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">
            Carregando avaliações...
          </p>
        ) : assessments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Nenhuma avaliação encontrada para {childName}
            </p>
            <Button onClick={handleStartNewAssessment}>
              Realizar Primeira Avaliação
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map(assessment => (
              <AssessmentHistoryCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentHistorySection;
