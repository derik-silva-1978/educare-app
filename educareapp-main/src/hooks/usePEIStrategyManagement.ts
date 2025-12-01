
import { PEI, PEIStrategy } from './usePEI';

export const usePEIStrategyManagement = (pei: PEI | null, setPEI: (pei: PEI | null) => void) => {
  // Add a strategy to a goal
  const addStrategy = (goalId: string, strategy: Omit<PEIStrategy, 'id'>) => {
    if (!pei) return;
    
    const newStrategy: PEIStrategy = {
      ...strategy,
      id: `strategy_${Date.now()}`
    };
    
    const updatedGoals = pei.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          strategies: [...goal.strategies, newStrategy]
        };
      }
      return goal;
    });
    
    setPEI({ ...pei, goals: updatedGoals });
    
    return newStrategy.id;
  };

  // Update a strategy
  const updateStrategy = (goalId: string, strategyId: string, updates: Partial<PEIStrategy>) => {
    if (!pei) return;
    
    const updatedGoals = pei.goals.map(goal => {
      if (goal.id === goalId) {
        const updatedStrategies = goal.strategies.map(strategy => 
          strategy.id === strategyId ? { ...strategy, ...updates } : strategy
        );
        
        return { ...goal, strategies: updatedStrategies };
      }
      return goal;
    });
    
    setPEI({ ...pei, goals: updatedGoals });
  };

  // Delete a strategy
  const deleteStrategy = (goalId: string, strategyId: string) => {
    if (!pei) return;
    
    const updatedGoals = pei.goals.map(goal => {
      if (goal.id === goalId) {
        const filteredStrategies = goal.strategies.filter(strategy => 
          strategy.id !== strategyId
        );
        
        return { ...goal, strategies: filteredStrategies };
      }
      return goal;
    });
    
    setPEI({ ...pei, goals: updatedGoals });
  };

  return {
    addStrategy,
    updateStrategy,
    deleteStrategy
  };
};

export default usePEIStrategyManagement;
