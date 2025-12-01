
import { PEI, PEIGoal } from './usePEI';

export const usePEIGoalManagement = (pei: PEI | null, setPEI: (pei: PEI | null) => void) => {
  // Add a new goal to the PEI
  const addGoal = (goal: Omit<PEIGoal, 'id' | 'strategies' | 'progress'>) => {
    if (!pei) return;
    
    const newGoal: PEIGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      strategies: [],
      progress: []
    };
    
    setPEI({
      ...pei,
      goals: [...pei.goals, newGoal]
    });
    
    return newGoal.id;
  };

  // Update an existing goal
  const updateGoal = (goalId: string, updates: Partial<PEIGoal>) => {
    if (!pei) return;
    
    const updatedGoals = pei.goals.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    
    setPEI({ ...pei, goals: updatedGoals });
  };

  // Delete a goal
  const deleteGoal = (goalId: string) => {
    if (!pei) return;
    
    const filteredGoals = pei.goals.filter(goal => goal.id !== goalId);
    
    setPEI({ ...pei, goals: filteredGoals });
  };

  // Get a specific goal by ID
  const getGoalById = (goalId: string): PEIGoal | undefined => {
    if (!pei) return undefined;
    return pei.goals.find(goal => goal.id === goalId);
  };

  return {
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalById
  };
};

export default usePEIGoalManagement;
