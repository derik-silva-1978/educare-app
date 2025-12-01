
import { PEI, PEIGoal } from './usePEI';

export const usePEIAnalytics = (pei: PEI | null) => {
  // Calculate overall progress of the PEI
  const getOverallProgress = (): number => {
    if (!pei || pei.goals.length === 0) return 0;
    
    const totalGoals = pei.goals.length;
    const completedGoals = pei.goals.filter(goal => goal.status === 'achieved').length;
    const inProgressGoals = pei.goals.filter(goal => goal.status === 'in_progress').length;
    
    // Count in-progress goals as half achieved
    return Math.round(((completedGoals + (inProgressGoals * 0.5)) / totalGoals) * 100);
  };
  
  // Get progress trends over time
  const getProgressTrends = () => {
    if (!pei) return [];
    
    // Extract all progress records from all goals
    const allProgressRecords = pei.goals.flatMap(goal => 
      goal.progress.map(record => ({
        ...record,
        goalId: goal.id,
        goalTitle: goal.title,
        date: new Date(record.date)
      }))
    );
    
    // Sort by date
    const sortedRecords = allProgressRecords.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Group by month for trend analysis
    const monthlyProgress: Record<string, { count: number, improved: number, same: number, regressed: number }> = {};
    
    sortedRecords.forEach(record => {
      const monthYear = record.date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      if (!monthlyProgress[monthYear]) {
        monthlyProgress[monthYear] = { count: 0, improved: 0, same: 0, regressed: 0 };
      }
      
      monthlyProgress[monthYear].count++;
      
      // Categorize progress type
      if (record.status === 'regression') {
        monthlyProgress[monthYear].regressed++;
      } else if (record.status === 'no_change') {
        monthlyProgress[monthYear].same++;
      } else {
        // minor_progress, significant_progress, or achieved
        monthlyProgress[monthYear].improved++;
      }
    });
    
    // Convert to array format for charts
    return Object.entries(monthlyProgress).map(([month, data]) => ({
      month,
      ...data
    }));
  };
  
  // Get goals grouped by domain
  const getGoalsByDomain = () => {
    if (!pei) return [];
    
    const domainGroups: Record<string, { total: number, achieved: number, inProgress: number, notStarted: number }> = {};
    
    pei.goals.forEach(goal => {
      const domain = goal.domain;
      
      if (!domainGroups[domain]) {
        domainGroups[domain] = { total: 0, achieved: 0, inProgress: 0, notStarted: 0 };
      }
      
      domainGroups[domain].total++;
      
      switch (goal.status) {
        case 'achieved':
          domainGroups[domain].achieved++;
          break;
        case 'in_progress':
          domainGroups[domain].inProgress++;
          break;
        default:
          domainGroups[domain].notStarted++;
      }
    });
    
    return Object.entries(domainGroups).map(([domain, data]) => ({
      domain,
      ...data
    }));
  };
  
  // Calculate progress distribution
  const getProgressDistribution = () => {
    if (!pei || pei.goals.length === 0) return [];
    
    const statuses = ['not_started', 'in_progress', 'achieved', 'canceled'];
    const statusLabels: Record<string, string> = {
      not_started: 'Não Iniciado',
      in_progress: 'Em Progresso',
      achieved: 'Alcançado',
      canceled: 'Cancelado'
    };
    
    const distribution = statuses.map(status => {
      const count = pei.goals.filter(goal => goal.status === status).length;
      const percentage = (count / pei.goals.length) * 100;
      
      return {
        status,
        label: statusLabels[status],
        count,
        percentage
      };
    });
    
    return distribution.filter(item => item.count > 0);
  };
  
  return {
    getOverallProgress,
    getProgressTrends,
    getGoalsByDomain,
    getProgressDistribution
  };
};

export default usePEIAnalytics;
