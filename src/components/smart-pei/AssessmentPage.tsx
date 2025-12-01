
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Filter } from 'lucide-react';
import AssessmentsList from './assessment/AssessmentsList';
import AssessmentFilters from './assessment/AssessmentFilters';
import StudentSelector from './assessment/StudentSelector';
import { useToast } from '@/hooks/use-toast';
import { createEmptyAssessment } from '@/utils/assessment/item-generator';
import useAssessmentStorage from '@/hooks/useAssessmentStorage';
import useStudents from '@/hooks/useStudents';
import { useAssessmentsList } from '@/hooks/useAssessmentsList';

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [creatingAssessment, setCreatingAssessment] = useState(false);
  const [showStudentSelector, setShowStudentSelector] = useState(false);
  const { saveAssessment } = useAssessmentStorage();
  const { students } = useStudents();
  const { assessments, isLoading } = useAssessmentsList();
  
  useEffect(() => {
    if (location.state?.studentId && !creatingAssessment) {
      handleCreateAssessment(location.state.studentId);
    }
  }, [location.state]);
  
  const handleCreateAssessment = async (studentId?: string, studentName?: string) => {
    if (creatingAssessment) return;
    
    if (!studentId && students.length > 0) {
      setShowStudentSelector(true);
      return;
    }
    
    setCreatingAssessment(true);
    const newId = uuidv4();
    console.log("Creating new assessment with ID:", newId);
    
    try {
      const assessmentData = createEmptyAssessment(studentId || 'unknown');
      assessmentData.id = newId;
      
      // If we have a student name, use it
      if (studentName) {
        assessmentData.studentName = studentName;
      } else if (studentId) {
        // Try to find student name from ID
        const student = students.find(s => s.id === studentId);
        if (student) {
          assessmentData.studentName = student.name;
        }
      }
      
      await saveAssessment(assessmentData);
      
      toast({
        title: 'Nova avaliação criada',
        description: 'Você foi redirecionado para o formulário de avaliação'
      });
      
      setTimeout(() => {
        navigate(`/smart-pei/assessment/${newId}`);
      }, 300);
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a avaliação',
        variant: 'destructive'
      });
    } finally {
      setCreatingAssessment(false);
      setShowStudentSelector(false);
    }
  };
  
  const handleStudentSelected = (studentId: string, studentName: string) => {
    handleCreateAssessment(studentId, studentName);
  };
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleSelectAssessment = (id: string) => {
    const isSubmitted = localStorage.getItem(`pei_${id}_submitted`);
    
    if (isSubmitted) {
      navigate(`/smart-pei/assessment/view/${id}`);
    } else {
      navigate(`/smart-pei/assessment/${id}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Avaliações</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <Dialog open={showStudentSelector} onOpenChange={setShowStudentSelector}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                onClick={() => setShowStudentSelector(true)}
                disabled={creatingAssessment}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {creatingAssessment ? 'Criando...' : 'Nova Avaliação'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md p-0">
              <StudentSelector 
                onSelect={handleStudentSelected}
                onCancel={() => setShowStudentSelector(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {showFilters && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <AssessmentFilters onSearch={handleSearchChange} />
          </CardContent>
        </Card>
      )}
      
      <AssessmentsList 
        assessments={assessments}
        onSelectAssessment={handleSelectAssessment} 
        onCreateAssessment={() => setShowStudentSelector(true)}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default AssessmentPage;
