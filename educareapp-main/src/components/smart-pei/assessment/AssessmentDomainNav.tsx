
import React from 'react';
import { Button } from '@/components/ui/button';
import { DevelopmentDomain } from '@/types/assessment';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { getDomainDisplayName } from '@/utils/assessment/domain-utils';

interface AssessmentDomainNavProps {
  domains: DevelopmentDomain[];
  activeDomain: DevelopmentDomain | null;
  completedDomains: Record<DevelopmentDomain, boolean>;
  onDomainSelect: (domain: DevelopmentDomain) => void;
}

export const AssessmentDomainNav: React.FC<AssessmentDomainNavProps> = ({
  domains,
  activeDomain,
  completedDomains,
  onDomainSelect
}) => {
  return (
    <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1">
      {domains.map((domain) => (
        <Button
          key={domain}
          variant={domain === activeDomain ? "default" : "outline"}
          size="sm"
          className={cn(
            "flex-shrink-0 whitespace-nowrap",
            completedDomains[domain] && domain !== activeDomain && "border-green-200"
          )}
          onClick={() => onDomainSelect(domain)}
        >
          {completedDomains[domain] && (
            <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
          )}
          <span>{getDomainDisplayName(domain)}</span>
        </Button>
      ))}
    </div>
  );
};

export default AssessmentDomainNav;
