
import { License } from '@/types/license';

export interface LicenseMetrics {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  assigned: number;
  unassigned: number;
  expiringIn30Days: number;
  byType: Record<string, number>;
  byModel: Record<string, number>;
  expirationByMonth: Array<{ month: string; count: number }>;
  teamsTotal: number;
  averageTeamSize: number;
  enterpriseUtilization: number; // percentage of enterprise license slots used
}

export function calculateLicenseMetrics(licenseData: License[]): LicenseMetrics {
  const now = new Date();
  const in30Days = new Date();
  in30Days.setDate(now.getDate() + 30);
  
  const metrics: LicenseMetrics = {
    total: licenseData.length,
    active: 0,
    inactive: 0,
    expired: 0,
    assigned: 0,
    unassigned: 0,
    expiringIn30Days: 0,
    byType: {},
    byModel: {
      enterprise: 0,
      individual: 0
    },
    expirationByMonth: [],
    teamsTotal: 0,
    averageTeamSize: 0,
    enterpriseUtilization: 0
  };
  
  let totalTeamMembers = 0;
  let totalEnterpriseSlots = 0;
  let usedEnterpriseSlots = 0;
  
  // Calculate basic metrics
  licenseData.forEach(license => {
    const expirationDate = new Date(license.expiresAt);
    
    // Count by type
    metrics.byType[license.type] = (metrics.byType[license.type] || 0) + 1;
    
    // Count by model
    if (license.model) {
      metrics.byModel[license.model] = (metrics.byModel[license.model] || 0) + 1;
    }
    
    // Count by status
    if (!license.isActive) {
      metrics.inactive++;
    } else if (expirationDate < now) {
      metrics.expired++;
    } else {
      metrics.active++;
      
      // Check expiring soon
      if (expirationDate <= in30Days) {
        metrics.expiringIn30Days++;
      }
    }
    
    // Count by assignment
    if (license.assignedTo) {
      metrics.assigned++;
    } else {
      metrics.unassigned++;
    }
    
    // Count teams
    if (license.teams) {
      metrics.teamsTotal += license.teams.length;
      
      // Count team members
      license.teams.forEach(team => {
        // Count coordinator, parent, and professionals
        const teamSize = 2 + (team.professionals?.length || 0); // 1 coordinator + 1 parent + professionals
        totalTeamMembers += teamSize;
      });
    }
    
    // Track enterprise license usage
    if (license.model === 'enterprise') {
      totalEnterpriseSlots += (license.totalCount || license.maxUsers);
      usedEnterpriseSlots += (license.usedCount || 0);
    }
  });
  
  // Calculate average team size
  metrics.averageTeamSize = metrics.teamsTotal > 0 ? Math.round((totalTeamMembers / metrics.teamsTotal) * 10) / 10 : 0;
  
  // Calculate enterprise utilization percentage
  metrics.enterpriseUtilization = totalEnterpriseSlots > 0 ? Math.round((usedEnterpriseSlots / totalEnterpriseSlots) * 100) : 0;
  
  // Group by expiration month (next 6 months)
  const monthlyData: Record<string, number> = {};
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    monthlyData[monthKey] = 0;
  }
  
  // Count licenses expiring in each month
  licenseData.forEach(license => {
    const expirationDate = new Date(license.expiresAt);
    
    // Only count active licenses that haven't expired yet
    if (license.isActive && expirationDate >= now) {
      const monthKey = `${monthNames[expirationDate.getMonth()]} ${expirationDate.getFullYear()}`;
      
      // Only count if within next 6 months
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey]++;
      }
    }
  });
  
  // Format for chart
  metrics.expirationByMonth = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count
  }));
  
  return metrics;
}
