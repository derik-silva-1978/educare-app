
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface NewbornSectionProps {
  control: Control<any>;
}

export const NewbornSection: React.FC<NewbornSectionProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recém-nascido</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="birth_weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso ao nascer (kg)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: 3.2" type="number" step="0.1" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="birth_length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comprimento ao nascer (cm)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: 50" type="number" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="breastfeeding"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="text-sm font-normal">
              Amamentação
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
};
