
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { AssessmentDomain } from '@/types/assessment';
import { getDomainDisplayName } from '@/utils/assessment/domain-utils';

interface PEIGoalDomainSelectorProps {
  form: UseFormReturn<z.infer<any>>;
  domains: AssessmentDomain[];
}

export const PEIGoalDomainSelector: React.FC<PEIGoalDomainSelectorProps> = ({ 
  form,
  domains 
}) => {
  return (
    <FormField
      control={form.control}
      name="domain"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Domínio</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o domínio de desenvolvimento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {getDomainDisplayName(domain)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PEIGoalDomainSelector;
