
import { AssessmentForm } from '@/types/assessmentTypes';
import { useToast } from './use-toast';

export const useAssessmentStorage = () => {
  const { toast } = useToast();

  // Get all assessments from local storage
  const getAllAssessments = async (): Promise<AssessmentForm[]> => {
    try {
      // Retrieve all keys from localStorage
      const assessmentsKeys = Object.keys(localStorage).filter(key => key.startsWith('assessment_'));
      
      // Retrieve all assessments using the keys
      const assessments = assessmentsKeys.map(key => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }).filter(Boolean);
      
      return assessments as AssessmentForm[];
    } catch (error) {
      console.error('Error fetching assessments from local storage:', error);
      return [];
    }
  };

  // Get assessment by ID
  const getAssessment = async (id: string): Promise<AssessmentForm | null> => {
    try {
      const data = localStorage.getItem(`assessment_${id}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error fetching assessment from local storage:', error);
      return null;
    }
  };

  // Save assessment to local storage
  const saveAssessment = async (assessment: AssessmentForm): Promise<boolean> => {
    try {
      localStorage.setItem(`assessment_${assessment.id}`, JSON.stringify({
        ...assessment,
        updatedAt: new Date().toISOString()
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving assessment to local storage:', error);
      toast({
        title: 'Erro de armazenamento',
        description: 'Não foi possível salvar os dados da avaliação no armazenamento local.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  // Delete assessment from local storage
  const deleteAssessment = async (id: string): Promise<boolean> => {
    try {
      localStorage.removeItem(`assessment_${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting assessment from local storage:', error);
      return false;
    }
  };

  // Get assessments by student ID
  const getAssessmentsByStudentId = async (studentId: string): Promise<AssessmentForm[]> => {
    try {
      const allAssessments = await getAllAssessments();
      return allAssessments.filter(assessment => assessment.studentId === studentId);
    } catch (error) {
      console.error('Error fetching assessments by student ID:', error);
      return [];
    }
  };

  return {
    getAllAssessments,
    getAssessment,
    saveAssessment,
    deleteAssessment,
    getAssessmentsByStudentId
  };
};

export default useAssessmentStorage;
