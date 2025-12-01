
import React from 'react';
import { Assessment, AssessmentItem } from '@/types/assessment';
import AssessmentItemCard from './assessment/AssessmentItemCard';

interface AssessmentDomainSectionProps {
  form: Assessment;
  domain: string;
  readOnly?: boolean;
  onUpdate: (item: AssessmentItem) => void;
}

export const AssessmentDomainSection: React.FC<AssessmentDomainSectionProps> = ({
  form,
  domain,
  readOnly = false,
  onUpdate
}) => {
  // Filter items by domain
  const domainItems = form.items ? form.items.filter(item => item.domain === domain) : [];

  if (domainItems.length === 0) {
    return (
      <div className="p-6 text-center border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Não há itens para este domínio.</p>
      </div>
    );
  }

  const handleLevelChange = (itemId: string) => (level: string) => {
    if (!form.items) return;
    
    const item = form.items.find(i => i.id === itemId);
    if (item) {
      const updatedItem = { ...item, level: level as any };
      onUpdate(updatedItem);
    }
  };

  const handleNotesChange = (itemId: string) => (notes: string) => {
    if (!form.items) return;
    
    const item = form.items.find(i => i.id === itemId);
    if (item) {
      const updatedItem = { ...item, notes };
      onUpdate(updatedItem);
    }
  };

  return (
    <div className="space-y-6">
      {domainItems.map((item) => (
        <AssessmentItemCard
          key={item.id}
          item={item}
          onLevelChange={handleLevelChange(item.id)}
          onNotesChange={handleNotesChange(item.id)}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default AssessmentDomainSection;
