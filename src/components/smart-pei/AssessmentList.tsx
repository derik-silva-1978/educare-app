
import React, { useState, useEffect } from 'react';
import AssessmentsInProgress from './assessment/AssessmentsInProgress';
import AssessmentsCompleted from './assessment/AssessmentsCompleted';
import EmptyAssessmentsList from './assessment/EmptyAssessmentsList';
import { useAssessmentsList } from '@/hooks/useAssessmentsList';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { DevelopmentDomain, AssessmentSummary, AssessmentStatus, Assessment } from '@/types/assessment';

interface AssessmentListProps {
  studentId?: string;
  onSelectAssessment: (id: string) => void;
  onCreateAssessment: () => void;
  searchTerm?: string;
}

export const AssessmentList: React.FC<AssessmentListProps> = ({ 
  studentId, 
  onSelectAssessment, 
  onCreateAssessment,
  searchTerm = ''
}) => {
  const { 
    assessments,
    isLoading
  } = useAssessmentsList();
  
  // Separate assessments by status
  const [inProgressAssessments, setInProgressAssessments] = useState<AssessmentSummary[]>([]);
  const [completedAssessments, setCompletedAssessments] = useState<AssessmentSummary[]>([]);
  const hasAssessments = assessments.length > 0;
  
  useEffect(() => {
    // Filter assessments based on status and search term
    const filtered = assessments.filter(assessment => {
      if (searchTerm && !assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !assessment.studentName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      if (studentId && assessment.studentId !== studentId) {
        return false;
      }
      
      return true;
    });
    
    // Separate by status
    setInProgressAssessments(
      filtered.filter(a => a.status === 'in_progress' || a.status === 'draft')
        .map(assessment => ({
          id: assessment.id,
          title: assessment.title,
          date: typeof assessment.date === 'string' ? assessment.date : new Date().toISOString(),
          status: assessment.status as AssessmentStatus,
          studentId: assessment.studentId || assessment.student_id,
          studentName: assessment.studentName || assessment.student_name,
          updatedAt: assessment.updatedAt || assessment.updated_at || new Date().toISOString(),
          createdAt: assessment.createdAt || assessment.created_at || new Date().toISOString(),
          domains: (assessment.domains || []) as DevelopmentDomain[]
        }))
    );
    
    setCompletedAssessments(
      filtered.filter(a => a.status === 'completed')
        .map(assessment => ({
          id: assessment.id,
          title: assessment.title,
          date: typeof assessment.date === 'string' ? assessment.date : new Date().toISOString(),
          status: assessment.status as AssessmentStatus,
          studentId: assessment.studentId || assessment.student_id,
          studentName: assessment.studentName || assessment.student_name,
          updatedAt: assessment.updatedAt || assessment.updated_at || new Date().toISOString(),
          createdAt: assessment.createdAt || assessment.created_at || new Date().toISOString(),
          domains: (assessment.domains || []) as DevelopmentDomain[]
        }))
    );
  }, [assessments, searchTerm, studentId]);
  
  if (isLoading) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Carregando avaliações...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (!hasAssessments) {
    return (
      <EmptyAssessmentsList onCreateAssessment={onCreateAssessment} />
    );
  }
  
  return (
    <div className="space-y-8">
      {inProgressAssessments.length > 0 && (
        <AssessmentsInProgress 
          assessments={inProgressAssessments} 
          onSelectAssessment={onSelectAssessment} 
        />
      )}
      
      {completedAssessments.length > 0 && (
        <AssessmentsCompleted 
          assessments={completedAssessments} 
          onSelectAssessment={onSelectAssessment} 
        />
      )}
      
      {inProgressAssessments.length === 0 && completedAssessments.length === 0 && (
        <EmptyAssessmentsList onCreateAssessment={onCreateAssessment} />
      )}
    </div>
  );
};

export default AssessmentList;
