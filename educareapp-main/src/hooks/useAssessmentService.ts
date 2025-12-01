import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  Assessment, 
  DevelopmentDomain,
  DevelopmentQuestion,
  AssessmentStatus,
  AssessmentResponse,
  RecommendedActivity,
  AssessmentItem,
  ResponseType,
  DomainProgress
} from '@/types/assessment';
import { ensureValidItem } from '@/utils/assessment/item-utils';
import { calculateDomainProgress } from '@/utils/assessment/domain-progress';
import { normalizeAssessment } from '@/utils/assessment-compatibility';

const useAssessmentService = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock domains for development
  const availableDomains: DevelopmentDomain[] = [
    'motor', 'cognitive', 'language', 'social', 'adaptive', 'emotional',
    'communication', 'social_emotional', 'self_care', 'maternal_health', 'sensory'
  ];

  // Fetches an assessment by ID
  const getAssessment = useCallback(async (id: string): Promise<Assessment | null> => {
    setLoading(true);
    try {
      // First try localStorage
      const storedAssessment = localStorage.getItem(`assessment_${id}`);
      
      if (storedAssessment) {
        const assessment = JSON.parse(storedAssessment) as Assessment;
        setLoading(false);
        return normalizeAssessment(assessment);
      }
      
      setLoading(false);
      return null;
    } catch (error) {
      console.error('Error fetching assessment:', error);
      setLoading(false);
      
      toast({
        title: 'Erro ao carregar avaliação',
        description: 'Não foi possível carregar os dados da avaliação',
        variant: 'destructive',
      });
      
      return null;
    }
  }, [toast]);

  // Alias for getAssessment to match API used in AssessmentPage.tsx
  const getAssessmentById = getAssessment;

  // Get assessments by child ID
  const getAssessmentsByChildId = useCallback(async (childId: string): Promise<Assessment[]> => {
    setLoading(true);
    try {
      const allAssessments = await getAllAssessments();
      const childAssessments = allAssessments.filter(assessment => 
        assessment.childId === childId || assessment.student_id === childId
      );
      setLoading(false);
      return childAssessments;
    } catch (error) {
      console.error('Error fetching assessments by child ID:', error);
      setLoading(false);
      return [];
    }
  }, []);

  // Creates a new assessment
  const createAssessment = useCallback(async (data: Partial<Assessment>): Promise<Assessment | null> => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const id = uuidv4();
      
      // Set up default values for the assessment
      const newAssessment: Assessment = {
        id: data.id || id,
        title: data.title || 'Nova Avaliação',
        status: 'draft',
        student_id: data.student_id || data.studentId || data.childId || '',
        student_name: data.student_name || data.studentName || data.childName || '',
        evaluator: data.evaluator || '',
        date: data.date || now,
        domains: data.domains || ['motor', 'cognitive'],
        items: data.items || [],
        observations: data.observations || {},
        created_at: now,
        updated_at: now,
        user_id: data.user_id || data.userId || '',
        
        // Compatibility fields
        studentId: data.studentId || data.student_id || data.childId || '',
        studentName: data.studentName || data.student_name || data.childName || '',
        childId: data.childId || data.student_id || data.studentId || '',
        childName: data.childName || data.student_name || data.studentName || '',
        childAgeMonths: data.childAgeMonths || 0,
        createdAt: now,
        updatedAt: now,
        userId: data.userId || data.user_id || '',
        progress: 0,
        completed: false,
        feedback: data.feedback || ''
      };
      
      // Save to localStorage
      localStorage.setItem(`assessment_${newAssessment.id}`, JSON.stringify(newAssessment));
      
      setLoading(false);
      return newAssessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      setLoading(false);
      
      toast({
        title: 'Erro ao criar avaliação',
        description: 'Não foi possível criar uma nova avaliação',
        variant: 'destructive',
      });
      
      return null;
    }
  }, [toast]);

  // Update an existing assessment
  const updateAssessment = useCallback(async (assessment: Assessment): Promise<boolean> => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const updatedAssessment = {
        ...assessment,
        updated_at: now,
        updatedAt: now
      };
      
      // Save to localStorage
      localStorage.setItem(`assessment_${assessment.id}`, JSON.stringify(updatedAssessment));
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error updating assessment:', error);
      setLoading(false);
      
      toast({
        title: 'Erro ao atualizar avaliação',
        description: 'Não foi possível salvar as alterações',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [toast]);

  // Delete an assessment
  const deleteAssessment = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Remove from localStorage
      localStorage.removeItem(`assessment_${id}`);
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      setLoading(false);
      
      toast({
        title: 'Erro ao excluir avaliação',
        description: 'Não foi possível excluir a avaliação',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [toast]);

  // Fetch all assessments
  const getAllAssessments = useCallback(async (): Promise<Assessment[]> => {
    setLoading(true);
    try {
      const assessments: Assessment[] = [];
      
      // Get all items from localStorage that start with "assessment_"
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && key.startsWith('assessment_')) {
          const storedAssessment = localStorage.getItem(key);
          
          if (storedAssessment) {
            try {
              const assessment = JSON.parse(storedAssessment) as Assessment;
              assessments.push(normalizeAssessment(assessment));
            } catch (error) {
              console.error('Error parsing stored assessment:', error);
            }
          }
        }
      }
      
      setLoading(false);
      return assessments;
    } catch (error) {
      console.error('Error fetching all assessments:', error);
      setLoading(false);
      return [];
    }
  }, []);

  // Get development questions
  const getQuestions = useCallback(async (
    ageMonths: number = 0, 
    domains: DevelopmentDomain[] = []
  ): Promise<DevelopmentQuestion[]> => {
    // Mock implementation
    return [
      {
        id: '1',
        domain: 'motor',
        question: 'Can walk without support',
        age_min_months: 12,
        age_max_months: 24
      },
      {
        id: '2',
        domain: 'cognitive',
        question: 'Can identify basic shapes',
        age_min_months: 24,
        age_max_months: 36
      }
    ] as DevelopmentQuestion[];
  }, []);

  // Get responses for an assessment
  const getResponsesByAssessmentId = useCallback(async (
    assessmentId: string
  ): Promise<AssessmentResponse[]> => {
    try {
      const storedResponses = localStorage.getItem(`responses_${assessmentId}`);
      if (storedResponses) {
        return JSON.parse(storedResponses) as AssessmentResponse[];
      }
      return [];
    } catch (error) {
      console.error('Error getting responses:', error);
      return [];
    }
  }, []);

  // Save a response
  const saveResponse = useCallback(async (
    response: Partial<AssessmentResponse>
  ): Promise<AssessmentResponse | null> => {
    try {
      const assessmentId = response.assessment_id;
      if (!assessmentId) return null;
      
      const responses = await getResponsesByAssessmentId(assessmentId);
      
      const newResponse: AssessmentResponse = {
        id: response.id || uuidv4(),
        questionId: response.questionId || response.question_id || '',
        question_id: response.question_id || response.questionId || '',
        level: response.level || null,
        notes: response.notes || '',
        assessment_id: assessmentId,
        response: response.response || null,
        domain: response.domain,
        questions: response.questions || [],
        created_at: response.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Find existing response or add new one
      const index = responses.findIndex(r => 
        r.questionId === newResponse.questionId || r.question_id === newResponse.question_id
      );
      if (index >= 0) {
        responses[index] = newResponse;
      } else {
        responses.push(newResponse);
      }
      
      // Save to localStorage
      localStorage.setItem(`responses_${assessmentId}`, JSON.stringify(responses));
      
      return newResponse;
    } catch (error) {
      console.error('Error saving response:', error);
      return null;
    }
  }, [getResponsesByAssessmentId]);

  // Complete an assessment
  const completeAssessment = useCallback(async (
    assessmentId: string,
    feedback: string = ''
  ): Promise<boolean> => {
    try {
      const assessment = await getAssessment(assessmentId);
      if (!assessment) return false;
      
      const updatedAssessment = {
        ...assessment,
        status: 'completed' as AssessmentStatus,
        completed: true,
        feedback: feedback,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return updateAssessment(updatedAssessment);
    } catch (error) {
      console.error('Error completing assessment:', error);
      return false;
    }
  }, [getAssessment, updateAssessment]);

  // Calculate domain progress
  const calculateDomainProgressForAssessment = useCallback(async (
    assessmentId: string
  ): Promise<DomainProgress[]> => {
    try {
      const assessment = await getAssessment(assessmentId);
      if (!assessment) return [];
      
      if (!assessment.items || assessment.items.length === 0) {
        return assessment.domains.map(domain => ({
          domain,
          total: 0,
          completed: 0,
          percentage: 0,
          progress: 0,
          score: 0
        }));
      }
      
      return calculateDomainProgress(assessment.items, assessment.domains);
    } catch (error) {
      console.error('Error calculating domain progress:', error);
      return [];
    }
  }, [getAssessment]);

  return {
    loading,
    getAssessment,
    getAssessmentById,
    getAssessmentsByChildId,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    getAllAssessments,
    getQuestions,
    getResponsesByAssessmentId,
    saveResponse,
    completeAssessment,
    calculateDomainProgress: calculateDomainProgressForAssessment,
    availableDomains
  };
};

export default useAssessmentService;
