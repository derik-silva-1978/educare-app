
import { useEffect, useState } from 'react';
import { PEIGoal, PEIProgress, PEIStrategy } from './usePEI';
import { v4 as uuidv4 } from 'uuid';
import usePEI from './usePEI';

// Hook for managing operations on a specific goal
const usePEIGoal = (goalId?: string) => {
  const { pei, updatePEI, savePEI } = usePEI();
  const [goal, setGoal] = useState<PEIGoal | null>(null);
  
  // Load goal data when goalId changes
  useEffect(() => {
    if (pei && goalId) {
      const foundGoal = pei.goals.find(g => g.id === goalId);
      if (foundGoal) {
        setGoal(foundGoal);
      }
    }
  }, [pei, goalId]);
  
  // Add a strategy to a goal
  const addStrategy = (goalId: string, strategyData: Partial<PEIStrategy>) => {
    if (!pei) return;
    
    const newStrategy: PEIStrategy = {
      id: uuidv4(),
      description: strategyData.description || '',
      resources: strategyData.resources || '',
      responsible: strategyData.responsible || '',
      frequency: strategyData.frequency || ''
    };
    
    // Create updated goals array with the new strategy added to the specified goal
    const updatedGoals = pei.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          strategies: [...goal.strategies, newStrategy]
        };
      }
      return goal;
    });
    
    // Update PEI with new goals
    updatePEI({ goals: updatedGoals });
    savePEI();
    
    return newStrategy;
  };
  
  // Add a progress record to a goal
  const addProgress = (goalId: string, progressData: Partial<PEIProgress>) => {
    if (!pei) return;
    
    const newProgress: PEIProgress = {
      id: uuidv4(),
      date: progressData.date || new Date().toISOString(),
      notes: progressData.notes || '',
      evidence: progressData.evidence || '',
      status: progressData.status || 'no_change',
      author: progressData.author || 'user'
    };
    
    // Create updated goals array with the new progress record added to the specified goal
    const updatedGoals = pei.goals.map(goal => {
      if (goal.id === goalId) {
        // Also update the goal status based on progress if it's 'achieved'
        const updatedGoal = {
          ...goal,
          progress: [...goal.progress, newProgress]
        };
        
        // If progress status is 'achieved', update goal status too
        if (newProgress.status === 'achieved') {
          updatedGoal.status = 'achieved';
        } else if (goal.status === 'not_started' && 
                  ['minor_progress', 'significant_progress'].includes(newProgress.status)) {
          updatedGoal.status = 'in_progress';
        }
        
        return updatedGoal;
      }
      return goal;
    });
    
    // Update PEI with new goals
    updatePEI({ goals: updatedGoals });
    savePEI();
    
    return newProgress;
  };
  
  return {
    goal,
    addStrategy,
    addProgress
  };
};

export default usePEIGoal;
