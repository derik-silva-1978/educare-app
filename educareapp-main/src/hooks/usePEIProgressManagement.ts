
import { PEI, PEIProgress } from './usePEI';

export const usePEIProgressManagement = (pei: PEI | null, setPEI: (pei: PEI | null) => void) => {
  // Add progress record to a goal
  const addProgressRecord = (goalId: string, progress: Omit<PEIProgress, 'id'>) => {
    if (!pei) return;
    
    const newProgress: PEIProgress = {
      ...progress,
      id: `progress_${Date.now()}`
    };
    
    const updatedGoals = pei.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          progress: [...goal.progress, newProgress]
        };
      }
      return goal;
    });
    
    setPEI({ ...pei, goals: updatedGoals });
    
    return newProgress.id;
  };

  // Update a progress record
  const updateProgressRecord = (goalId: string, progressId: string, updates: Partial<PEIProgress>) => {
    if (!pei) return;
    
    const updatedGoals = pei.goals.map(goal => {
      if (goal.id === goalId) {
        const updatedProgress = goal.progress.map(record => 
          record.id === progressId ? { ...record, ...updates } : record
        );
        
        return { ...goal, progress: updatedProgress };
      }
      return goal;
    });
    
    setPEI({ ...pei, goals: updatedGoals });
  };

  // Delete a progress record
  const deleteProgressRecord = (goalId: string, progressId: string) => {
    if (!pei) return;
    
    const updatedGoals = pei.goals.map(goal => {
      if (goal.id === goalId) {
        const filteredProgress = goal.progress.filter(record => 
          record.id !== progressId
        );
        
        return { ...goal, progress: filteredProgress };
      }
      return goal;
    });
    
    setPEI({ ...pei, goals: updatedGoals });
  };

  // Get progress analytics for a goal
  const getProgressAnalytics = (goalId: string) => {
    if (!pei) return null;
    
    const goal = pei.goals.find(g => g.id === goalId);
    if (!goal) return null;
    
    const totalRecords = goal.progress.length;
    const significantProgress = goal.progress.filter(
      p => p.status === 'significant_progress' || p.status === 'achieved'
    ).length;
    const regressions = goal.progress.filter(p => p.status === 'regression').length;
    
    return {
      totalRecords,
      significantProgress,
      regressions
    };
  };

  return {
    addProgressRecord,
    updateProgressRecord,
    deleteProgressRecord,
    getProgressAnalytics
  };
};

export default usePEIProgressManagement;
