
import { useEffect } from 'react';
import usePEIOperations from './usePEIOperations';
import usePEIGoalManagement from './usePEIGoalManagement';
import usePEIStrategyManagement from './usePEIStrategyManagement';
import usePEIProgressManagement from './usePEIProgressManagement';
import usePEIAnalytics from './usePEIAnalytics';

// Type definitions - these remain unchanged from the original file
export type PEIGoal = {
  id: string;
  domain: AssessmentDomain;
  title: string;
  description: string;
  targetDate: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'canceled';
  strategies: PEIStrategy[];
  evaluationMethod: string;
  progress: PEIProgress[];
};

export type PEIStrategy = {
  id: string;
  description: string;
  resources: string;
  responsible: string;
  frequency: string;
};

export type PEIProgress = {
  id: string;
  date: string;
  notes: string;
  evidence: string;
  status: 'regression' | 'no_change' | 'minor_progress' | 'significant_progress' | 'achieved';
  author?: string;
};

export interface PEI {
  id: string;
  studentId: string;
  studentName: string; // This is explicitly required
  title: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  assessmentId: string;
  goals: PEIGoal[];
  teamMembers: string[];
  reviewFrequency: string;
  nextReviewDate: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  notes: string;
}

// Import AssessmentDomain type
import { AssessmentDomain } from '@/types/assessment';

export const usePEI = (peiId?: string) => {
  // Use the refactored hooks
  const {
    pei,
    setPEI,
    isLoading,
    isSaving,
    error,
    loadPEI,
    createPEI,
    createPEIFromAssessment,
    savePEI,
    updatePEI,
    getStudentPEIs
  } = usePEIOperations();

  const {
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalById
  } = usePEIGoalManagement(pei, setPEI);

  const {
    addStrategy,
    updateStrategy,
    deleteStrategy
  } = usePEIStrategyManagement(pei, setPEI);

  const {
    addProgressRecord,
    updateProgressRecord,
    deleteProgressRecord,
    getProgressAnalytics
  } = usePEIProgressManagement(pei, setPEI);

  const {
    getOverallProgress,
    getProgressTrends,
    getGoalsByDomain,
    getProgressDistribution
  } = usePEIAnalytics(pei);

  // Load PEI from localStorage if peiId is provided
  useEffect(() => {
    if (peiId) {
      loadPEI(peiId);
    }
  }, [peiId, loadPEI]);

  // Return the combined API from all hooks
  return {
    // PEI state
    pei,
    isLoading,
    isSaving,
    error,
    
    // PEI operations
    loadPEI,
    createPEI,
    createPEIFromAssessment,
    savePEI,
    updatePEI,
    getStudentPEIs,
    
    // Goal management
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalById,
    
    // Strategy management
    addStrategy,
    updateStrategy,
    deleteStrategy,
    
    // Progress management
    addProgressRecord,
    updateProgressRecord,
    deleteProgressRecord,
    getProgressAnalytics,
    
    // Analytics
    getOverallProgress,
    getProgressTrends,
    getGoalsByDomain,
    getProgressDistribution
  };
};

export default usePEI;
