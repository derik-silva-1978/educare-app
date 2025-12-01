
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  AssessmentDomain, 
  Assessment,
  AssessmentItem,
  DevelopmentDomain
} from '@/types/assessment';
import { AssessmentDomainSection } from '../AssessmentDomainSection';
import { AssessmentObservations } from './AssessmentObservations';
import { CheckCircle } from 'lucide-react';

export interface AssessmentAccordionSectionsProps {
  form: Assessment;
  expandedSections: string[];
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
  completedDomains: Record<AssessmentDomain, boolean>;
  handleSectionToggle: (sectionId: string) => void;
  handleObservationChange: (domain: DevelopmentDomain, observation: string) => void;
  onUpdateItem: (item: AssessmentItem) => void;
  readOnly?: boolean;
}

export const AssessmentAccordionSections: React.FC<AssessmentAccordionSectionsProps> = ({
  form,
  expandedSections,
  setExpandedSections,
  completedDomains,
  handleSectionToggle,
  handleObservationChange,
  onUpdateItem,
  readOnly = false
}) => {
  return (
    <Accordion
      type="multiple"
      value={expandedSections}
      onValueChange={setExpandedSections}
      className="w-full"
    >
      {form.domains.map((domain) => (
        <AccordionItem 
          key={domain} 
          value={domain}
          id={domain}
          className="border rounded-md mb-4 overflow-hidden"
        >
          <AccordionTrigger 
            onClick={() => handleSectionToggle(domain)}
            className="px-4 py-3 hover:no-underline bg-muted/30 hover:bg-muted/50"
          >
            <div className="flex items-center justify-between w-full pr-4">
              <span className="text-base font-medium capitalize">{domain}</span>
              {completedDomains[domain] && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-4">
            <div className="space-y-6">
              <AssessmentDomainSection 
                form={form} 
                domain={domain} 
                readOnly={readOnly}
                onUpdate={onUpdateItem}
              />
              
              <div className="pt-2 border-t">
                <AssessmentObservations 
                  domain={domain}
                  value={form.observations?.[domain] || ''}
                  onChange={(value) => handleObservationChange(domain, value)}
                  readOnly={readOnly}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AssessmentAccordionSections;
