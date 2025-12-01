
import { DevelopmentDomain, DomainProgress } from './assessment';

/**
 * Enhanced domain progress with timeline data
 */
export interface DomainProgressWithTimeline extends Partial<DomainProgress> {
  domain: DevelopmentDomain;
  progress: number;
  milestones?: Milestone[];
  percentage?: number; // Made optional to prevent type errors
  completedMilestones?: number;
  totalMilestones?: number;
}

/**
 * Milestone for development timeline
 */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  age: number; // age in months
  completed: boolean;
  domain: DevelopmentDomain;
  date?: string;
  skills?: string[];
}

/**
 * Timeline data structure
 */
export interface DevelopmentTimeline {
  milestones: Milestone[];
  domainProgress: DomainProgressWithTimeline[];
  isLoading: boolean;
}

/**
 * Helper function to convert DomainProgress to DomainProgressWithTimeline
 */
export const convertToDomainProgressWithTimeline = (
  domainProgress: DomainProgress
): DomainProgressWithTimeline => {
  return {
    ...domainProgress,
    milestones: [],
    completedMilestones: 0,
    totalMilestones: 0
  };
};
