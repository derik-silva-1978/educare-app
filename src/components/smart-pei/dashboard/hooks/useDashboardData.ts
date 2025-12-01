
import { useState, useEffect } from 'react';

// Define proper type interfaces for all the data

export interface Statistic {
  id: string;
  title: string;
  value: number | string;
  change: number;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface DomainProgressItem {
  domain: string;
  score: number;
  previous: number;
}

export interface PerformanceTrendItem {
  period: string;
  averageProgress: number;
  goalsAchieved: number;
  assessmentsCompleted: number;
}

export interface DevelopmentProgressItem {
  subject: string;
  score: number;
  fullScore: number;
}

export interface AssessmentCompletionItem {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyActivityItem {
  month: string;
  [key: string]: string | number;
}

export interface ActivityConfig {
  assessments: { label: string; color: string; };
  plans: { label: string; color: string; };
}

export interface AgeDistributionItem {
  ageRange: string;
  count: number;
}

// Hook for statistics data
export const useStatisticsData = () => {
  const [statistics, setStatistics] = useState<Statistic[]>([
    {
      id: 'total-students',
      title: 'Alunos Ativos',
      value: 125,
      change: 12,
      icon: 'users',
      trend: 'up'
    },
    {
      id: 'active-assessments',
      title: 'Avaliações em Andamento',
      value: 64,
      change: 8,
      icon: 'clipboard-list',
      trend: 'up'
    },
    {
      id: 'completed-plans',
      title: 'PEIs Finalizados',
      value: 42,
      change: -5,
      icon: 'check-square',
      trend: 'down'
    },
    {
      id: 'pending-reviews',
      title: 'Revisões Pendentes',
      value: 18,
      change: 3,
      icon: 'clock',
      trend: 'up'
    }
  ]);

  return { statistics };
};

// Hook for domain progress data
export const useDomainProgressData = () => {
  const [domainProgressData, setDomainProgressData] = useState<DomainProgressItem[]>([
    { domain: 'Comunicação', score: 75, previous: 68 },
    { domain: 'Psicomotor', score: 82, previous: 79 },
    { domain: 'Socioafetivo', score: 68, previous: 62 },
    { domain: 'Cognitivo', score: 79, previous: 72 },
    { domain: 'Adaptativo', score: 85, previous: 80 },
    { domain: 'Sensorial', score: 71, previous: 65 }
  ]);

  const [developmentProgressData, setDevelopmentProgressData] = useState<DevelopmentProgressItem[]>([
    { subject: 'Comunicação', score: 75, fullScore: 100 },
    { subject: 'Psicomotor', score: 82, fullScore: 100 },
    { subject: 'Socioafetivo', score: 68, fullScore: 100 },
    { subject: 'Cognitivo', score: 79, fullScore: 100 },
    { subject: 'Adaptativo', score: 85, fullScore: 100 }
  ]);

  const [performanceTrendData, setPerformanceTrendData] = useState<PerformanceTrendItem[]>([
    { period: 'Jan/23', averageProgress: 62, goalsAchieved: 12, assessmentsCompleted: 15 },
    { period: 'Fev/23', averageProgress: 65, goalsAchieved: 15, assessmentsCompleted: 18 },
    { period: 'Mar/23', averageProgress: 70, goalsAchieved: 14, assessmentsCompleted: 16 },
    { period: 'Abr/23', averageProgress: 72, goalsAchieved: 18, assessmentsCompleted: 20 },
    { period: 'Mai/23', averageProgress: 75, goalsAchieved: 20, assessmentsCompleted: 23 },
    { period: 'Jun/23', averageProgress: 80, goalsAchieved: 22, assessmentsCompleted: 25 },
  ]);

  return { domainProgressData, developmentProgressData, performanceTrendData };
};

// Hook for activity data
export const useActivityData = () => {
  const [monthlyActivityData, setMonthlyActivityData] = useState<MonthlyActivityItem[]>([
    { month: 'Jan', 'Avaliações Iniciadas': 12, 'PEIs Gerados': 8 },
    { month: 'Fev', 'Avaliações Iniciadas': 15, 'PEIs Gerados': 12 },
    { month: 'Mar', 'Avaliações Iniciadas': 18, 'PEIs Gerados': 10 },
    { month: 'Abr', 'Avaliações Iniciadas': 16, 'PEIs Gerados': 14 },
    { month: 'Mai', 'Avaliações Iniciadas': 20, 'PEIs Gerados': 16 },
    { month: 'Jun', 'Avaliações Iniciadas': 25, 'PEIs Gerados': 20 },
  ]);

  const [activityConfig, setActivityConfig] = useState<ActivityConfig>({
    assessments: { label: 'Avaliações Iniciadas', color: '#3b82f6' },
    plans: { label: 'PEIs Gerados', color: '#10b981' }
  });

  const [assessmentCompletionData, setAssessmentCompletionData] = useState<AssessmentCompletionItem[]>([
    { name: 'Completos', value: 14, color: '#10b981' },
    { name: 'Em Andamento', value: 7, color: '#f59e0b' },
    { name: 'Pendentes', value: 11, color: '#ef4444' }
  ]);

  return { monthlyActivityData, activityConfig, assessmentCompletionData };
};

// Hook for age distribution data
export const useAgeDistributionData = () => {
  const [ageDistributionData, setAgeDistributionData] = useState<AgeDistributionItem[]>([
    { ageRange: '3-5 anos', count: 18 },
    { ageRange: '6-8 anos', count: 35 },
    { ageRange: '9-11 anos', count: 42 },
    { ageRange: '12-14 anos', count: 28 },
    { ageRange: '15-17 anos', count: 22 }
  ]);

  return { ageDistributionData };
};
