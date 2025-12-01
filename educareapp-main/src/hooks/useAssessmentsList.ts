
import { useState, useEffect, useCallback } from 'react';
import { AssessmentRepository } from '@/services/AssessmentRepository';
import { Assessment, AssessmentStatus, DevelopmentDomain } from '@/types/assessment';
import { createCompatibleObject } from '@/utils/supabase-type-helper';

export const useAssessmentsList = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  
  // Load assessments
  const loadAssessments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await AssessmentRepository.getAllAssessments();
      
      // Make sure all assessments have the required fields
      const compatibleAssessments = data.map(assessment => 
        createCompatibleObject<Assessment>({
          ...assessment,
          student_id: assessment.studentId || assessment.student_id || '',
          student_name: assessment.studentName || assessment.student_name || '',
          created_at: assessment.createdAt || assessment.created_at || '',
          updated_at: assessment.updatedAt || assessment.updated_at || '',
          user_id: assessment.userId || assessment.user_id || ''
        })
      );
      
      setAssessments(compatibleAssessments);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    loadAssessments();
  }, [loadAssessments]);
  
  // Filter assessments when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAssessments(assessments);
      return;
    }
    
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = assessments.filter(assessment => {
      const nameMatch = (assessment.studentName || assessment.student_name || '').toLowerCase().includes(lowercasedTerm);
      const titleMatch = (assessment.title || '').toLowerCase().includes(lowercasedTerm);
      return nameMatch || titleMatch;
    });
    
    setFilteredAssessments(filtered);
  }, [assessments, searchTerm]);
  
  return {
    assessments: filteredAssessments,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadAssessments
  };
};

export default useAssessmentsList;
