
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BirthSectionProps {
  control: Control<any>;
}

export const BirthSection: React.FC<BirthSectionProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Parto</h3>
      
      <FormField
        control={control}
        name="birth_location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Local do parto</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Hospital, Casa, etc." />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="birth_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de parto</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de parto" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="cesariana">Cesariana</SelectItem>
                <SelectItem value="forceps">Fórceps</SelectItem>
                <SelectItem value="ventosa">Ventosa</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};
