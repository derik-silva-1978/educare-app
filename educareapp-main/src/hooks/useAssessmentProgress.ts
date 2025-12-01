
import { useState, useCallback } from 'react';
import { Assessment, DevelopmentDomain } from '@/types/assessment';

export function useAssessmentProgress() {
  const [progress, setProgress] = useState(0);
  const [completedDomains, setCompletedDomains] = useState<Record<DevelopmentDomain, boolean>>({} as Record<DevelopmentDomain, boolean>);

  // Calculate progress and completed domains
  const calculateProgress = useCallback((assessment: Assessment) => {
    if (!assessment || !assessment.items || assessment.items.length === 0) {
      setProgress(0);
      setCompletedDomains({} as Record<DevelopmentDomain, boolean>);
      return;
    }
    
    const totalItems = assessment.items.length;
    const completedItems = assessment.items.filter(item => item.level !== null).length;
    const percentage = Math.round((completedItems / totalItems) * 100);
    
    setProgress(percentage);
    
    // Calculate completed domains
    const domains = assessment.domains || [];
    const completedDomainsRecord: Record<DevelopmentDomain, boolean> = {} as Record<DevelopmentDomain, boolean>;
    
    domains.forEach(domain => {
      const domainItems = assessment.items.filter(item => item.domain === domain);
      const domainCompletedItems = domainItems.filter(item => item.level !== null);
      completedDomainsRecord[domain] = domainItems.length > 0 && domainCompletedItems.length === domainItems.length;
    });
    
    setCompletedDomains(completedDomainsRecord);
  }, []);

  return {
    progress,
    completedDomains,
    calculateProgress
  };
}

export default useAssessmentProgress;
