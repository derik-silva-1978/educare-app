
import React from 'react';
import { AssessmentDomain } from '@/types/assessment';
import { cn } from '@/lib/utils';
import { getDomainDisplayName } from '@/utils/assessment/domain-utils';

interface AssessmentDomainNavFloatingProps {
  domains: AssessmentDomain[];
  activeDomain: AssessmentDomain | null;
  completedDomains: Record<AssessmentDomain, boolean>;
  onDomainSelect: (domain: AssessmentDomain) => void;
}

export const AssessmentDomainNavFloating: React.FC<AssessmentDomainNavFloatingProps> = ({
  domains,
  activeDomain,
  completedDomains,
  onDomainSelect
}) => {
  if (!domains || domains.length <= 1) {
    return null;
  }

  return (
    <div className="sticky top-4 z-10 mx-auto my-4 flex justify-center">
      <div className="flex space-x-1 bg-background/80 backdrop-blur-sm p-1 rounded-lg border shadow-sm">
        {domains.map((domain) => (
          <button
            key={domain}
            type="button"
            onClick={() => onDomainSelect(domain)}
            className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center transition-colors relative",
              domain === activeDomain
                ? "bg-primary text-primary-foreground"
                : "bg-transparent hover:bg-muted"
            )}
            title={getDomainDisplayName(domain)}
          >
            <span className="sr-only">{getDomainDisplayName(domain)}</span>
            <span className="text-xs font-medium">{getDomainDisplayName(domain).charAt(0).toUpperCase()}</span>
            
            {completedDomains[domain] && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssessmentDomainNavFloating;
